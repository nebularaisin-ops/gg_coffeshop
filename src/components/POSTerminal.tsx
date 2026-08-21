import React, { useState } from 'react';
import { MenuItem, MenuCategory, OrderTicket, OrderItem, Table } from '../types';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Send, 
  Receipt, 
  DollarSign, 
  Split, 
  Percent, 
  User, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface POSTerminalProps {
  menuItems: MenuItem[];
  tables: Table[];
  activeTicket: OrderTicket | null;
  onUpdateTicket: (ticket: OrderTicket) => void;
  onSendToKitchen: (ticket: OrderTicket) => void;
  onOpenReceipt: (ticket: OrderTicket) => void;
  onSelectTable: (tableId: string) => void;
}

export const POSTerminal: React.FC<POSTerminalProps> = ({
  menuItems,
  tables,
  activeTicket,
  onUpdateTicket,
  onSendToKitchen,
  onOpenReceipt,
  onSelectTable,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'All'>('All');
  const [currentSeat, setCurrentSeat] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<'Course 1' | 'Course 2' | 'Course 3' | 'Dessert' | 'Beverage'>('Course 1');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [customNote, setCustomNote] = useState<string>('');
  const [activeItemForNote, setActiveItemForNote] = useState<string | null>(null);

  const categories: (MenuCategory | 'All')[] = [
    'All',
    'Starters & Crudo',
    'Handmade Pasta',
    'Wood-Fired Mains',
    'Fromagerie & Sweets',
    'Grand Cru & Cellar',
    'Signature Cocktails'
  ];

  // Tile Color by Category for server muscle memory
  const getCategoryColor = (cat: MenuCategory) => {
    switch (cat) {
      case 'Starters & Crudo':
        return 'bg-[#ffdf96]/40 hover:bg-[#ffdf96]/70 border-[#dec0b8] text-[#5a4400]';
      case 'Handmade Pasta':
        return 'bg-[#ffdbd1]/50 hover:bg-[#ffdbd1]/80 border-[#dec0b8] text-[#3b0900]';
      case 'Wood-Fired Mains':
        return 'bg-[#ffdbd1] hover:bg-[#ffb5a0] border-[#a23a1b]/40 text-[#842506]';
      case 'Fromagerie & Sweets':
        return 'bg-[#f5f3ee] hover:bg-[#eae8e3] border-[#dec0b8] text-[#57423c]';
      case 'Grand Cru & Cellar':
        return 'bg-[#d0e8db]/60 hover:bg-[#d0e8db] border-[#4d6359]/30 text-[#0a1f18]';
      case 'Signature Cocktails':
        return 'bg-[#cde5d9] hover:bg-[#b4ccc0] border-[#4d6359]/40 text-[#0a1f18]';
      default:
        return 'bg-[#ffffff] hover:bg-[#f0eee9] border-[#e4e2dd] text-[#1b1c19]';
    }
  };

  const filteredItems = menuItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const handleAddItemToTicket = (item: MenuItem) => {
    if (item.is86ed || !activeTicket) return;

    const newItem: OrderItem = {
      id: `ti-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      seatNumber: currentSeat,
      course: selectedCourse,
      station: item.station,
      status: 'queued',
      selectedModifiers: item.modifierGroups?.[0]?.options?.[0] ? [item.modifierGroups[0].options[0].name] : []
    };

    const updatedItems = [...activeTicket.items, newItem];
    onUpdateTicket({
      ...activeTicket,
      items: updatedItems
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    if (!activeTicket) return;
    const updatedItems = activeTicket.items
      .map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is OrderItem => item !== null);

    onUpdateTicket({
      ...activeTicket,
      items: updatedItems
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!activeTicket) return;
    onUpdateTicket({
      ...activeTicket,
      items: activeTicket.items.filter(item => item.id !== itemId)
    });
  };

  const handleAddNoteToItem = (itemId: string, note: string) => {
    if (!activeTicket) return;
    onUpdateTicket({
      ...activeTicket,
      items: activeTicket.items.map(item => item.id === itemId ? { ...item, notes: note } : item)
    });
    setActiveItemForNote(null);
    setCustomNote('');
  };

  // Calculations
  const subtotal = activeTicket ? activeTicket.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxRate = 0.08875; // 8.875% NYC Standard
  const taxedSubtotal = subtotal - discountAmount;
  const tax = taxedSubtotal * taxRate;
  const total = taxedSubtotal + tax;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT 7-COL: Quick Tiles & Selection */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Top Bar: Table & Course Context */}
          <div className="bg-[#ffffff] border border-[#e4e2dd] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div>
                <span className="block text-[11px] font-['JetBrains_Mono'] text-[#8b716b] uppercase">
                  Active Table
                </span>
                <select
                  value={activeTicket?.tableId || ''}
                  onChange={(e) => onSelectTable(e.target.value)}
                  className="bg-[#fbf9f4] border border-[#dec0b8] font-['Epilogue'] font-semibold text-sm rounded px-3 py-1.5 text-[#1b1c19] focus:outline-none focus:border-[#a23a1b]"
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.zone}) - {t.status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-l border-[#eae8e3] pl-3">
                <span className="block text-[11px] font-['JetBrains_Mono'] text-[#8b716b] uppercase">
                  Server
                </span>
                <span className="text-xs font-['Work_Sans'] font-medium text-[#1b1c19]">
                  {activeTicket?.serverName || 'Elena Rostova'}
                </span>
              </div>
            </div>

            {/* Course & Seat Selector */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-['JetBrains_Mono'] text-[#8b716b] uppercase">Seat</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6].map(seat => (
                    <button
                      key={seat}
                      onClick={() => setCurrentSeat(seat)}
                      className={`min-w-[32px] h-[32px] rounded text-xs font-['JetBrains_Mono'] font-bold transition-all cursor-pointer ${
                        currentSeat === seat
                          ? 'bg-[#a23a1b] text-white shadow-xs'
                          : 'bg-[#f0eee9] text-[#57423c] hover:bg-[#eae8e3]'
                      }`}
                    >
                      S{seat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[44px] px-4 rounded text-xs md:text-sm font-['Work_Sans'] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#4d6359] text-white font-semibold shadow-xs'
                    : 'bg-[#ffffff] text-[#57423c] border border-[#e4e2dd] hover:border-[#8b716b]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Course Pacing Fast Selector */}
          <div className="flex items-center gap-2 bg-[#f0eee9] p-2 rounded border border-[#e4e2dd] overflow-x-auto">
            <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] px-1">
              Course:
            </span>
            {(['Course 1', 'Course 2', 'Course 3', 'Dessert', 'Beverage'] as const).map(c => (
              <button
                key={c}
                onClick={() => setSelectedCourse(c)}
                className={`px-3 py-1.5 rounded text-xs font-['Work_Sans'] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCourse === c
                    ? 'bg-[#a23a1b] text-white shadow-xs'
                    : 'bg-[#ffffff] text-[#1b1c19] hover:bg-[#fbf9f4]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* 4-Column Quick-Tiles Grid (Minimum 48x48 touch targets) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredItems.map(item => {
              const colorClass = getCategoryColor(item.category);
              return (
                <button
                  key={item.id}
                  id={`pos-tile-${item.id}`}
                  disabled={item.is86ed}
                  onClick={() => handleAddItemToTicket(item)}
                  className={`min-h-[110px] p-3 rounded border text-left flex flex-col justify-between transition-all duration-150 btn-pos cursor-pointer relative ${colorClass} ${
                    item.is86ed ? 'opacity-40 cursor-not-allowed bg-[#eae8e3]' : 'shadow-xs hover:shadow-sm active:scale-[0.98]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-['JetBrains_Mono'] opacity-75 mb-1">
                      <span>{item.sku}</span>
                      <span className="uppercase">{item.station}</span>
                    </div>
                    <div className="font-['Epilogue'] font-semibold text-xs leading-snug line-clamp-2">
                      {item.name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-current/20">
                    <span className="font-['JetBrains_Mono'] font-bold text-xs">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.is86ed ? (
                      <span className="text-[9px] bg-[#ba1a1a] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                        86'd
                      </span>
                    ) : (
                      <span className="text-[10px] opacity-75 font-['Work_Sans']">
                        +S{currentSeat}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT 5-COL: Live Ticket & Operations */}
        <div className="lg:col-span-5 bg-[#ffffff] border border-[#e4e2dd] rounded-lg p-5 shadow-sm space-y-4">
          
          {/* Ticket Header */}
          <div className="flex items-center justify-between border-b border-[#eae8e3] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Epilogue'] font-bold text-base text-[#1b1c19]">
                  {activeTicket?.tableName || 'Table 01'}
                </span>
                <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#f5f3ee] text-[#57423c] font-semibold">
                  #{activeTicket?.ticketNumber || 101}
                </span>
              </div>
              <p className="text-xs text-[#8b716b] font-['Work_Sans'] mt-0.5">
                Guests: {activeTicket?.guestCount || 2} • Server: {activeTicket?.serverName || 'Elena'}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => activeTicket && onOpenReceipt(activeTicket)}
                className="p-2 rounded text-[#4d6359] hover:bg-[#f0eee9] border border-[#dec0b8] transition-all cursor-pointer"
                title="Print Guest Receipt Preview"
              >
                <Receipt className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ticket Items List */}
          <div className="max-h-[360px] overflow-y-auto space-y-2.5 pr-1 divide-y divide-[#f5f3ee]">
            {(!activeTicket || activeTicket.items.length === 0) ? (
              <div className="py-12 text-center text-[#8b716b] space-y-2">
                <Receipt className="w-8 h-8 mx-auto opacity-40 text-[#57423c]" />
                <p className="text-xs font-['Work_Sans']">No items on current ticket.</p>
                <p className="text-[11px] text-[#dec0b8]">Tap quick-tiles on the left to ring in orders.</p>
              </div>
            ) : (
              activeTicket.items.map((item) => (
                <div key={item.id} className="pt-2 flex items-start justify-between gap-3 text-xs">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-['JetBrains_Mono'] text-[10px] px-1.5 py-0.2 bg-[#f0eee9] text-[#4d6359] rounded font-semibold">
                        S{item.seatNumber || 1}
                      </span>
                      <span className="font-['Work_Sans'] font-semibold text-[#1b1c19]">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#8b716b] font-['JetBrains_Mono']">
                      <span>{item.course}</span>
                      <span>•</span>
                      <span className="uppercase">{item.station}</span>
                      <span>•</span>
                      <span className={item.status === 'ready' ? 'text-[#4d6359] font-bold' : item.status === 'in_prep' ? 'text-[#745902]' : 'text-[#8b716b]'}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-[#a23a1b] font-['Work_Sans'] italic bg-[#ffdad6]/40 px-1.5 py-0.5 rounded">
                        Note: {item.notes}
                      </p>
                    )}

                    {activeItemForNote === item.id ? (
                      <div className="flex items-center gap-1 pt-1">
                        <input
                          type="text"
                          placeholder="Modifier / Allergen / Kitchen note..."
                          value={customNote}
                          onChange={(e) => setCustomNote(e.target.value)}
                          className="text-xs px-2 py-1 border border-[#dec0b8] rounded w-full bg-[#fbf9f4]"
                        />
                        <button
                          onClick={() => handleAddNoteToItem(item.id, customNote)}
                          className="bg-[#4d6359] text-white px-2 py-1 rounded text-xs"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveItemForNote(item.id);
                          setCustomNote(item.notes || '');
                        }}
                        className="text-[10px] text-[#4d6359] hover:underline cursor-pointer"
                      >
                        + Add Modifier Note
                      </button>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="font-['JetBrains_Mono'] font-bold text-[#1b1c19]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <div className="flex items-center gap-1 bg-[#f5f3ee] rounded p-0.5 border border-[#e4e2dd]">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-[#57423c] hover:bg-[#ffffff]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-['JetBrains_Mono'] text-xs px-1 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center rounded text-[#57423c] hover:bg-[#ffffff]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-5 h-5 flex items-center justify-center rounded text-[#ba1a1a] hover:bg-[#ffdad6] ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Discounts & Split Shortcuts */}
          <div className="border-t border-[#eae8e3] pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8b716b] font-['Work_Sans']">Quick Discount:</span>
              <div className="flex items-center gap-1.5">
                {[0, 10, 15, 20].map(disc => (
                  <button
                    key={disc}
                    onClick={() => setDiscountPercent(disc)}
                    className={`px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] font-medium transition-all ${
                      discountPercent === disc
                        ? 'bg-[#a23a1b] text-white'
                        : 'bg-[#f0eee9] text-[#57423c] hover:bg-[#eae8e3]'
                    }`}
                  >
                    {disc === 0 ? 'None' : `${disc}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-[#fbf9f4] border border-[#e4e2dd] rounded p-3 space-y-1.5 font-['JetBrains_Mono'] text-xs">
              <div className="flex justify-between text-[#57423c]">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#a23a1b]">
                  <span>Discount ({discountPercent}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#57423c]">
                <span>State & Local Tax (8.875%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#1b1c19] font-bold text-sm pt-1 border-t border-[#dec0b8]">
                <span>Total Balance Due:</span>
                <span className="text-[#a23a1b]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              id="btn-fire-kitchen"
              disabled={!activeTicket || activeTicket.items.length === 0}
              onClick={() => activeTicket && onSendToKitchen(activeTicket)}
              className="w-full bg-[#a23a1b] hover:bg-[#c35231] text-white font-['Work_Sans'] font-bold py-3 px-4 rounded flex items-center justify-center gap-2 text-xs md:text-sm cursor-pointer shadow-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Flame className="w-4 h-4" />
              <span>Send / Fire to Line</span>
            </button>

            <button
              onClick={() => activeTicket && onOpenReceipt(activeTicket)}
              className="w-full border border-[#4d6359] text-[#4d6359] hover:bg-[#cde5d9]/40 font-['Work_Sans'] font-bold py-3 px-4 rounded flex items-center justify-center gap-2 text-xs md:text-sm cursor-pointer transition-all active:scale-[0.98]"
            >
              <Receipt className="w-4 h-4" />
              <span>Pay & Print Check</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
