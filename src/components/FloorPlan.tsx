import React, { useState } from 'react';
import { Table, TableStatus, OrderTicket } from '../types';
import { 
  Users, 
  Clock, 
  Utensils, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Flame, 
  Receipt, 
  RefreshCw,
  Plus
} from 'lucide-react';

interface FloorPlanProps {
  tables: Table[];
  tickets: OrderTicket[];
  onSelectTable: (tableId: string) => void;
  onUpdateTableStatus: (tableId: string, status: TableStatus, guests?: number, server?: string) => void;
  onOpenPOSTable: (tableId: string) => void;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({
  tables,
  tickets,
  onSelectTable,
  onUpdateTableStatus,
  onOpenPOSTable,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [activeTableDetail, setActiveTableDetail] = useState<Table | null>(tables[0] || null);
  const [showSeatModal, setShowSeatModal] = useState<boolean>(false);
  const [seatGuestCount, setSeatGuestCount] = useState<number>(2);
  const [seatServerName, setSeatServerName] = useState<string>('Elena Rostova');

  const zones = ['All', 'Main Dining Room', 'Chef Counter', 'Garden Terrace', 'Cellar Vault'];

  const filteredTables = tables.filter(t => selectedZone === 'All' || t.zone === selectedZone);

  // Status Style Helper
  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return { label: 'Available', bg: 'bg-[#cde5d9]', text: 'text-[#0a1f18]', border: 'border-[#4d6359]/30' };
      case 'occupied':
        return { label: 'Seated / Dining', bg: 'bg-[#ffdf96]', text: 'text-[#251a00]', border: 'border-[#745902]/40' };
      case 'fired':
        return { label: 'Entrée Fired', bg: 'bg-[#ffdbd1]', text: 'text-[#842506]', border: 'border-[#a23a1b]/40' };
      case 'check_dropped':
        return { label: 'Check Dropped', bg: 'bg-[#d0e8db]', text: 'text-[#0a1f18]', border: 'border-[#4d6359]' };
      case 'bussing':
        return { label: 'Bussing', bg: 'bg-[#eae8e3]', text: 'text-[#57423c]', border: 'border-[#dec0b8]' };
    }
  };

  const currentTicket = activeTableDetail?.activeTicketId 
    ? tickets.find(t => t.id === activeTableDetail.activeTicketId)
    : null;

  const handleSeatParty = () => {
    if (!activeTableDetail) return;
    onUpdateTableStatus(activeTableDetail.id, 'occupied', seatGuestCount, seatServerName);
    setShowSeatModal(false);
    setActiveTableDetail({
      ...activeTableDetail,
      status: 'occupied',
      currentGuests: seatGuestCount,
      serverName: seatServerName,
      seatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
    });
  };

  // Occupancy metrics
  const totalSeats = tables.reduce((acc, t) => acc + t.capacity, 0);
  const occupiedSeats = tables.filter(t => t.status !== 'available' && t.status !== 'bussing').reduce((acc, t) => acc + (t.currentGuests || t.capacity), 0);
  const occupancyPercent = Math.round((occupiedSeats / totalSeats) * 100);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* Floor Header & Zone Filter */}
      <div className="bg-[#f0eee9] border border-[#e4e2dd] rounded-lg p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-['Epilogue'] text-[#1b1c19]">
              Floor Plan & Table Management
            </h1>
            <span className="bg-[#4d6359] text-white px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold">
              {occupancyPercent}% Occupancy ({occupiedSeats}/{totalSeats} Covers)
            </span>
          </div>
          <p className="text-xs text-[#57423c] font-['Work_Sans'] mt-1">
            Real-time dining room pacing, seat turnover, and server zone allocation.
          </p>
        </div>

        {/* Zone Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {zones.map(z => (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3.5 py-2 rounded text-xs font-['Work_Sans'] font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedZone === z
                  ? 'bg-[#a23a1b] text-white font-semibold shadow-xs'
                  : 'bg-[#ffffff] text-[#57423c] border border-[#dec0b8] hover:bg-[#eae8e3]'
              }`}
            >
              {z}
            </button>
          ))}
        </div>
      </div>

      {/* Main Floor Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Visual Table Tiles (8-Cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTables.map(t => {
            const isSelected = activeTableDetail?.id === t.id;
            const badge = getStatusBadge(t.status);
            const ticket = tickets.find(tk => tk.id === t.activeTicketId);

            return (
              <div
                key={t.id}
                onClick={() => setActiveTableDetail(t)}
                className={`bg-[#ffffff] border rounded-lg p-4 cursor-pointer transition-all duration-150 space-y-3 relative ${
                  isSelected 
                    ? 'ring-2 ring-[#a23a1b] border-[#a23a1b] shadow-md' 
                    : 'border-[#e4e2dd] hover:border-[#8b716b] hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] block">
                      {t.zone}
                    </span>
                    <h3 className="font-['Epilogue'] font-bold text-lg text-[#1b1c19]">
                      {t.name}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-['JetBrains_Mono'] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Table Capacity & Occupancy Meta */}
                <div className="flex items-center justify-between text-xs text-[#57423c] font-['Work_Sans'] bg-[#fbf9f4] p-2 rounded border border-[#f0eee9]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#4d6359]" />
                    <span>{t.currentGuests ? `${t.currentGuests}/${t.capacity} Guests` : `Cap: ${t.capacity}`}</span>
                  </span>

                  {t.seatedTime && (
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#745902] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.seatedTime}
                    </span>
                  )}
                </div>

                {/* Active Server */}
                {t.serverName && (
                  <div className="text-[11px] font-['Work_Sans'] text-[#8b716b] flex items-center justify-between">
                    <span>Server: <strong className="text-[#1b1c19]">{t.serverName}</strong></span>
                    {ticket && (
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#a23a1b]">
                        Ticket #{ticket.ticketNumber}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Table Drawer Panel (4-Cols) */}
        <div className="lg:col-span-4 bg-[#ffffff] border border-[#e4e2dd] rounded-lg p-5 shadow-sm space-y-5">
          {activeTableDetail ? (
            <>
              {/* Header */}
              <div className="border-b border-[#eae8e3] pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Epilogue'] font-bold text-xl text-[#1b1c19]">
                    {activeTableDetail.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] font-bold ${getStatusBadge(activeTableDetail.status).bg} ${getStatusBadge(activeTableDetail.status).text}`}>
                    {getStatusBadge(activeTableDetail.status).label}
                  </span>
                </div>
                <p className="text-xs text-[#8b716b] font-['Work_Sans'] mt-1">
                  Location: {activeTableDetail.zone} • Max Capacity: {activeTableDetail.capacity} covers
                </p>
              </div>

              {/* Status Change Action Buttons */}
              <div className="space-y-2">
                <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b]">
                  Update Dining State:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateTableStatus(activeTableDetail.id, 'available')}
                    className="px-2.5 py-2 rounded text-xs font-['Work_Sans'] font-medium bg-[#cde5d9] hover:bg-[#b4ccc0] text-[#0a1f18] transition-all cursor-pointer text-center"
                  >
                    Mark Available
                  </button>
                  <button
                    onClick={() => setShowSeatModal(true)}
                    className="px-2.5 py-2 rounded text-xs font-['Work_Sans'] font-medium bg-[#ffdf96] hover:bg-[#e7c268] text-[#251a00] transition-all cursor-pointer text-center"
                  >
                    Seat New Party
                  </button>
                  <button
                    onClick={() => onUpdateTableStatus(activeTableDetail.id, 'fired')}
                    className="px-2.5 py-2 rounded text-xs font-['Work_Sans'] font-medium bg-[#ffdbd1] hover:bg-[#ffb5a0] text-[#842506] transition-all cursor-pointer text-center"
                  >
                    Fire Entrée
                  </button>
                  <button
                    onClick={() => onUpdateTableStatus(activeTableDetail.id, 'check_dropped')}
                    className="px-2.5 py-2 rounded text-xs font-['Work_Sans'] font-medium bg-[#d0e8db] hover:bg-[#b4ccc0] text-[#0a1f18] transition-all cursor-pointer text-center"
                  >
                    Drop Check
                  </button>
                </div>
              </div>

              {/* Active Ticket Items Preview */}
              {currentTicket ? (
                <div className="border border-[#e4e2dd] bg-[#fbf9f4] rounded p-3.5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-['Epilogue'] font-semibold text-[#1b1c19]">
                    <span>Active Ticket #{currentTicket.ticketNumber}</span>
                    <span className="font-['JetBrains_Mono'] text-[#a23a1b]">
                      ${currentTicket.items.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="max-h-[180px] overflow-y-auto space-y-1 text-xs font-['Work_Sans'] divide-y divide-[#eae8e3]">
                    {currentTicket.items.map(i => (
                      <div key={i.id} className="pt-1.5 flex justify-between text-[#57423c]">
                        <span>{i.quantity}x {i.name} (S{i.seatNumber || 1})</span>
                        <span className="font-['JetBrains_Mono'] text-[11px] uppercase text-[#4d6359]">{i.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#fbf9f4] border border-[#eae8e3] p-4 text-center rounded text-xs text-[#8b716b]">
                  No active ticket linked to this table.
                </div>
              )}

              {/* Jump to POS Button */}
              <button
                onClick={() => onOpenPOSTable(activeTableDetail.id)}
                className="w-full bg-[#a23a1b] hover:bg-[#c35231] text-white py-3 rounded font-['Work_Sans'] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Utensils className="w-4 h-4" />
                <span>Open in POS Terminal</span>
              </button>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-[#8b716b]">
              Select a table on the floor map to view details.
            </div>
          )}
        </div>

      </div>

      {/* Seat Party Modal */}
      {showSeatModal && activeTableDetail && (
        <div className="fixed inset-0 bg-[#30312e]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#eae8e3] rounded-lg p-6 max-w-md w-full shadow-lg space-y-4">
            <h3 className="font-['Epilogue'] font-bold text-lg text-[#1b1c19]">
              Seat Party at {activeTableDetail.name}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] mb-1">
                  Guest Count (Max {activeTableDetail.capacity}):
                </label>
                <input
                  type="number"
                  min={1}
                  max={activeTableDetail.capacity}
                  value={seatGuestCount}
                  onChange={(e) => setSeatGuestCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#fbf9f4] border border-[#dec0b8] rounded px-3 py-2 text-sm font-['Work_Sans'] focus:outline-none focus:border-[#a23a1b]"
                />
              </div>

              <div>
                <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] mb-1">
                  Assigned Server:
                </label>
                <select
                  value={seatServerName}
                  onChange={(e) => setSeatServerName(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-[#dec0b8] rounded px-3 py-2 text-sm font-['Work_Sans'] focus:outline-none focus:border-[#a23a1b]"
                >
                  <option value="Elena Rostova">Elena Rostova (Main Dining)</option>
                  <option value="Marcus Vance">Marcus Vance (Terrace & Bar)</option>
                  <option value="Chef Laurent">Chef Laurent (Chef Counter)</option>
                  <option value="Chloe Dubois">Chloe Dubois (Sommelier / Vault)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eae8e3]">
              <button
                onClick={() => setShowSeatModal(false)}
                className="px-4 py-2 rounded text-xs font-['Work_Sans'] text-[#57423c] hover:bg-[#f0eee9]"
              >
                Cancel
              </button>
              <button
                onClick={handleSeatParty}
                className="px-4 py-2 rounded text-xs font-['Work_Sans'] font-bold bg-[#a23a1b] hover:bg-[#c35231] text-white shadow-xs"
              >
                Confirm Seating
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
