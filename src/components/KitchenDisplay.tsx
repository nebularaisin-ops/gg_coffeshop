import React, { useState, useEffect } from 'react';
import { OrderTicket, StationType, OrderItem } from '../types';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  Filter,
  Volume2,
  ChefHat,
  ArrowRight
} from 'lucide-react';

interface KitchenDisplayProps {
  tickets: OrderTicket[];
  onUpdateTicket: (ticket: OrderTicket) => void;
  onBumpTicket: (ticketId: string) => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({
  tickets,
  onUpdateTicket,
  onBumpTicket,
}) => {
  const [selectedStation, setSelectedStation] = useState<StationType | 'all'>('all');
  const [elapsedMinutes, setElapsedMinutes] = useState<{ [key: string]: number }>({});

  const stations: { id: StationType | 'all'; label: string }[] = [
    { id: 'all', label: 'All Stations (Master Line)' },
    { id: 'saute', label: 'Sauté Station' },
    { id: 'grill', label: 'Wood-Fire Grill' },
    { id: 'raw_bar', label: 'Raw Bar & Crudo' },
    { id: 'garde_manger', label: 'Garde Manger' },
    { id: 'pastry', label: 'Pastry / Sweets' },
    { id: 'bar', label: 'Service Bar' }
  ];

  // Update timer ticks
  useEffect(() => {
    const updateTimers = () => {
      const newElapsed: { [key: string]: number } = {};
      tickets.forEach(ticket => {
        const diffMs = Date.now() - ticket.createdAt;
        newElapsed[ticket.id] = Math.max(1, Math.floor(diffMs / 60000));
      });
      setElapsedMinutes(newElapsed);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 10000);
    return () => clearInterval(interval);
  }, [tickets]);

  const activeTickets = tickets.filter(t => t.status === 'active');

  const handleToggleItemStatus = (ticketId: string, itemId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const updatedItems = ticket.items.map(item => {
      if (item.id === itemId) {
        const nextStatus: OrderItem['status'] = 
          item.status === 'queued' ? 'in_prep' :
          item.status === 'in_prep' ? 'ready' :
          item.status === 'ready' ? 'served' : 'in_prep';
        return { ...item, status: nextStatus };
      }
      return item;
    });

    onUpdateTicket({
      ...ticket,
      items: updatedItems
    });
  };

  const handleFireAllCourse = (ticketId: string, course: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const updatedItems = ticket.items.map(item => {
      if (item.course === course && item.status === 'queued') {
        return { ...item, status: 'in_prep' as const, firedAt: Date.now() };
      }
      return item;
    });

    onUpdateTicket({
      ...ticket,
      items: updatedItems
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* Top Controls & Station Filter Pills */}
      <div className="bg-[#f0eee9] border border-[#e4e2dd] rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#a23a1b]" />
            <h1 className="text-xl font-bold font-['Epilogue'] text-[#1b1c19]">
              Kitchen Display Line (KDS)
            </h1>
            <span className="bg-[#a23a1b] text-white text-[11px] font-['JetBrains_Mono'] px-2 py-0.5 rounded-full font-bold">
              {activeTickets.length} Active Tickets
            </span>
          </div>
          <p className="text-xs text-[#57423c] font-['Work_Sans'] mt-0.5">
            Pacing standard: Starters &lt;8 min, Mains &lt;14 min. Tap items to bump status.
          </p>
        </div>

        {/* Station Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {stations.map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedStation(st.id)}
              className={`px-3 py-1.5 rounded text-xs font-['Work_Sans'] font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedStation === st.id
                  ? 'bg-[#4d6359] text-white shadow-xs'
                  : 'bg-[#ffffff] text-[#57423c] border border-[#dec0b8] hover:bg-[#eae8e3]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Cards Grid (KDS Rail) */}
      {activeTickets.length === 0 ? (
        <div className="bg-[#ffffff] border border-[#eae8e3] rounded-lg p-16 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 mx-auto text-[#4d6359]" />
          <h3 className="font-['Epilogue'] text-lg font-semibold text-[#1b1c19]">The Board is Clear!</h3>
          <p className="text-xs font-['Work_Sans'] text-[#57423c] max-w-md mx-auto">
            All kitchen orders have been bumped and plated. New orders placed in POS or Guest Menu will immediately appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {activeTickets.map(ticket => {
            const minutes = elapsedMinutes[ticket.id] || 5;
            
            // Timer Urgency Color Token
            let timerClass = 'bg-[#cde5d9] text-[#0a1f18] border-[#4d6359]/30'; // Normal <8m
            if (minutes >= 15) {
              timerClass = 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a] animate-pulse'; // Urgent >15m
            } else if (minutes >= 8) {
              timerClass = 'bg-[#ffdf96] text-[#745902] border-[#745902]/40'; // Warning 8-15m
            }

            // Filter items for selected station
            const relevantItems = ticket.items.filter(item => 
              selectedStation === 'all' || item.station === selectedStation
            );

            if (relevantItems.length === 0 && selectedStation !== 'all') {
              return null;
            }

            const allItemsReady = ticket.items.every(i => i.status === 'ready' || i.status === 'served');

            return (
              <div
                key={ticket.id}
                className={`bg-[#ffffff] border rounded-lg overflow-hidden flex flex-col justify-between shadow-sm transition-all ${
                  minutes >= 15 ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]/20' : 'border-[#e4e2dd]'
                }`}
              >
                {/* Header Ticket Bar */}
                <div className="bg-[#f5f3ee] border-b border-[#eae8e3] p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-['Epilogue'] font-bold text-base text-[#1b1c19]">
                        {ticket.tableName}
                      </span>
                      <span className="text-[11px] font-['JetBrains_Mono'] font-bold px-1.5 py-0.5 rounded bg-[#ffffff] text-[#1b1c19] border border-[#dec0b8]">
                        #{ticket.ticketNumber}
                      </span>
                    </div>

                    {/* Timer Badge */}
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-['JetBrains_Mono'] font-bold border ${timerClass}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{minutes}m ago</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#57423c] font-['Work_Sans']">
                    <span>Server: {ticket.serverName}</span>
                    <span>Guests: {ticket.guestCount}</span>
                  </div>

                  {ticket.specialInstructions && (
                    <div className="bg-[#ffdad6] text-[#93000a] text-xs p-2 rounded font-['Work_Sans'] font-semibold flex items-start gap-1.5 border border-[#ba1a1a]/30">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{ticket.specialInstructions}</span>
                    </div>
                  )}
                </div>

                {/* Ticket Items by Course */}
                <div className="p-3.5 space-y-3 divide-y divide-[#f5f3ee] max-h-[380px] overflow-y-auto">
                  {relevantItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleItemStatus(ticket.id, item.id)}
                      className={`pt-2.5 first:pt-0 flex items-start justify-between gap-2 text-xs cursor-pointer group p-1.5 rounded transition-all ${
                        item.status === 'ready'
                          ? 'bg-[#cde5d9]/30 text-[#4d6359] line-through opacity-70'
                          : item.status === 'in_prep'
                          ? 'bg-[#ffdf96]/20'
                          : 'hover:bg-[#fbf9f4]'
                      }`}
                    >
                      <div className="flex items-start gap-2 flex-1">
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-['JetBrains_Mono'] font-bold mt-0.5 flex-shrink-0 ${
                          item.status === 'ready' 
                            ? 'bg-[#4d6359] text-white' 
                            : item.status === 'in_prep'
                            ? 'bg-[#745902] text-white'
                            : 'border border-[#dec0b8] text-[#57423c]'
                        }`}>
                          {item.status === 'ready' ? <Check className="w-3 h-3" /> : item.quantity}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-['JetBrains_Mono'] text-[10px] bg-[#f0eee9] px-1 py-0.2 rounded text-[#57423c]">
                              S{item.seatNumber || 1}
                            </span>
                            <span className="font-['Work_Sans'] font-semibold text-[#1b1c19] group-hover:text-[#a23a1b]">
                              {item.name}
                            </span>
                          </div>

                          <div className="text-[10px] font-['JetBrains_Mono'] text-[#8b716b] flex items-center gap-2">
                            <span>{item.course}</span>
                            <span>•</span>
                            <span className="uppercase text-[#4d6359] font-medium">{item.station}</span>
                          </div>

                          {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                            <p className="text-[10px] text-[#745902] font-['Work_Sans'] font-medium">
                              + {item.selectedModifiers.join(', ')}
                            </p>
                          )}

                          {item.notes && (
                            <p className="text-[10px] text-[#a23a1b] font-['Work_Sans'] font-bold bg-[#ffdad6]/50 px-1.5 py-0.5 rounded inline-block">
                              ★ {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Tag Pill */}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-['JetBrains_Mono'] font-bold uppercase whitespace-nowrap ${
                        item.status === 'ready' ? 'bg-[#cde5d9] text-[#0a1f18]' :
                        item.status === 'in_prep' ? 'bg-[#ffdf96] text-[#251a00]' :
                        'bg-[#f0eee9] text-[#57423c]'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Course Firing Shortcuts & Bump Footer */}
                <div className="bg-[#fbf9f4] border-t border-[#eae8e3] p-3 space-y-2">
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <button
                      onClick={() => handleFireAllCourse(ticket.id, 'Course 1')}
                      className="px-2 py-1 bg-[#ffffff] hover:bg-[#f0eee9] border border-[#dec0b8] rounded font-['Work_Sans'] font-medium text-[#1b1c19] text-[10px] cursor-pointer"
                    >
                      Fire C1
                    </button>
                    <button
                      onClick={() => handleFireAllCourse(ticket.id, 'Course 2')}
                      className="px-2 py-1 bg-[#ffffff] hover:bg-[#f0eee9] border border-[#dec0b8] rounded font-['Work_Sans'] font-medium text-[#1b1c19] text-[10px] cursor-pointer"
                    >
                      Fire C2
                    </button>
                    <button
                      onClick={() => handleFireAllCourse(ticket.id, 'Dessert')}
                      className="px-2 py-1 bg-[#ffffff] hover:bg-[#f0eee9] border border-[#dec0b8] rounded font-['Work_Sans'] font-medium text-[#1b1c19] text-[10px] cursor-pointer"
                    >
                      Fire Sweets
                    </button>
                  </div>

                  <button
                    onClick={() => onBumpTicket(ticket.id)}
                    className={`w-full py-2.5 px-3 rounded font-['Work_Sans'] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      allItemsReady
                        ? 'bg-[#4d6359] hover:bg-[#3d5047] text-white'
                        : 'bg-[#a23a1b] hover:bg-[#c35231] text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{allItemsReady ? 'Bump Order (Ready for Pass)' : 'Complete & Bump Ticket'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
