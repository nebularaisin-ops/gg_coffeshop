import React, { useState } from 'react';
import { MenuItem, MenuCategory, DietaryTag, Table } from '../types';
import { 
  Wine, 
  Sparkles, 
  Plus, 
  Info, 
  ShoppingBag, 
  Check, 
  SlidersHorizontal,
  Flame,
  ChefHat
} from 'lucide-react';

interface CustomerMenuProps {
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAddItem: (item: MenuItem, seat: number, note?: string) => void;
  tables: Table[];
  selectedTableId: string;
  onSelectTableId: (id: string) => void;
  cartItemsCount: number;
  onOpenCart: () => void;
}

export const CustomerMenu: React.FC<CustomerMenuProps> = ({
  menuItems,
  onSelectItem,
  onQuickAddItem,
  tables,
  selectedTableId,
  onSelectTableId,
  cartItemsCount,
  onOpenCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | 'All'>('All');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag | 'All'>('All');
  const [activeSeat, setActiveSeat] = useState<number>(1);
  const [addedItemAnimation, setAddedItemAnimation] = useState<string | null>(null);

  const categories: (MenuCategory | 'All')[] = [
    'All',
    'Starters & Crudo',
    'Handmade Pasta',
    'Wood-Fired Mains',
    'Fromagerie & Sweets',
    'Grand Cru & Cellar',
    'Signature Cocktails'
  ];

  const dietaryFilters: (DietaryTag | 'All')[] = [
    'All',
    'Gluten-Free',
    'Dairy-Free',
    'Vegetarian',
    'Vegan',
    'Raw'
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDietary = selectedDietary === 'All' || item.dietary.includes(selectedDietary);
    return matchesCategory && matchesDietary;
  });

  const handleAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.is86ed) return;
    onQuickAddItem(item, activeSeat);
    setAddedItemAnimation(item.id);
    setTimeout(() => setAddedItemAnimation(null), 800);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-8">
      
      {/* Header Banner & Table Selector */}
      <div className="bg-[#f0eee9] border border-[#e4e2dd] rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-['JetBrains_Mono'] rounded-full bg-[#ffdbd1] text-[#a23a1b] font-semibold">
              Degustation & À La Carte
            </span>
            <span className="text-xs text-[#57423c] font-['Work_Sans']">Late Summer Harvest Menu</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-['Epilogue'] text-[#1b1c19] tracking-tight">
            Culinary Logic Tasting Collection
          </h1>
          <p className="text-sm text-[#57423c] font-['Work_Sans'] mt-1 max-w-2xl">
            Sourced exclusively from regenerative organic farms and artisan purveyors. Wood-fired over white oak and seasoned à la minute.
          </p>
        </div>

        {/* Seat / Table Context Control */}
        <div className="flex flex-wrap items-center gap-3 bg-[#ffffff] p-3 rounded border border-[#dec0b8]/60 shadow-sm self-stretch md:self-auto">
          <div>
            <label className="block text-[11px] font-['JetBrains_Mono'] text-[#8b716b] uppercase tracking-wider mb-1">
              Dining Table
            </label>
            <select
              value={selectedTableId}
              onChange={(e) => onSelectTableId(e.target.value)}
              className="bg-[#fbf9f4] border border-[#dec0b8] text-xs font-['Work_Sans'] font-medium rounded px-2.5 py-1.5 text-[#1b1c19] focus:outline-none focus:border-[#a23a1b]"
            >
              {tables.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.zone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-['JetBrains_Mono'] text-[#8b716b] uppercase tracking-wider mb-1">
              Seat #
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setActiveSeat(s)}
                  className={`w-7 h-7 rounded text-xs font-['JetBrains_Mono'] font-semibold transition-all ${
                    activeSeat === s
                      ? 'bg-[#a23a1b] text-white'
                      : 'bg-[#f0eee9] text-[#1b1c19] hover:bg-[#eae8e3]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {cartItemsCount > 0 && (
            <button
              onClick={onOpenCart}
              className="mt-2 md:mt-0 flex items-center gap-2 bg-[#4d6359] hover:bg-[#3d5047] text-white px-3 py-1.5 rounded text-xs font-['Work_Sans'] font-medium transition-all shadow-sm ml-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Review Order ({cartItemsCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Dietary Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded text-xs md:text-sm font-['Work_Sans'] font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#a23a1b] text-white font-semibold shadow-sm'
                  : 'bg-[#ffffff] text-[#57423c] border border-[#e4e2dd] hover:border-[#8b716b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs text-[#57423c]">
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#8b716b] flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Dietary:
          </span>
          {dietaryFilters.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDietary(d)}
              className={`px-2.5 py-1 rounded-full text-xs font-['Work_Sans'] transition-all ${
                selectedDietary === d
                  ? 'bg-[#cde5d9] text-[#0a1f18] font-semibold border border-[#4d6359]'
                  : 'bg-[#f5f3ee] text-[#57423c] hover:bg-[#eae8e3]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 12-Column Food Grid with 32px Gutters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => {
          const isAdded = addedItemAnimation === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`group bg-[#ffffff] border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                item.is86ed 
                  ? 'border-[#ffdad6] opacity-60 bg-[#fffbfa]' 
                  : 'border-[#eae8e3] hover:border-[#dec0b8] hover:shadow-[0_4px_16px_rgba(77,99,89,0.08)]'
              }`}
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-[#f0eee9]">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* 86'd Out of Stock Badge */}
                {item.is86ed && (
                  <div className="absolute inset-0 bg-[#30312e]/70 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-[#ba1a1a] text-white px-3 py-1 rounded text-xs font-['JetBrains_Mono'] font-bold tracking-wider uppercase">
                      86'd (Sold Out Tonight)
                    </span>
                  </div>
                )}

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-[#1b1c19]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.salesVelocity === 'Star' && (
                    <span className="bg-[#745902] text-white px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-medium flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Chef Signature
                    </span>
                  )}
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-3 right-3 bg-[#ffffff]/95 backdrop-blur-sm border border-[#e4e2dd] px-2.5 py-1 rounded shadow-xs font-['JetBrains_Mono'] font-bold text-sm text-[#a23a1b]">
                  ${item.price.toFixed(2)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-['Epilogue'] font-semibold text-lg text-[#1b1c19] group-hover:text-[#a23a1b] transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#57423c] font-['Work_Sans'] line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Dietary Pills */}
                  {item.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.dietary.map(d => (
                        <span key={d} className="px-2 py-0.5 rounded-full text-[10px] font-['Work_Sans'] font-medium bg-[#f5f3ee] text-[#57423c]">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Sommelier Pairing note if available */}
                  {item.winePairing && (
                    <div className="bg-[#fbf9f4] border border-[#dec0b8]/50 rounded p-2.5 text-xs text-[#57423c] space-y-1">
                      <div className="flex items-center gap-1.5 text-[#745902] font-['Work_Sans'] font-semibold text-[11px]">
                        <Wine className="w-3.5 h-3.5" />
                        <span>Sommelier Pairing:</span>
                      </div>
                      <p className="font-['Work_Sans'] text-[11px] text-[#1b1c19] italic">
                        {item.winePairing}
                      </p>
                      {item.winePairingGlassPrice && (
                        <span className="text-[10px] font-['JetBrains_Mono'] text-[#8b716b]">
                          +${item.winePairingGlassPrice} / glass
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-[#f0eee9] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-['JetBrains_Mono'] text-[#8b716b]">
                    SKU: {item.sku}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem(item);
                      }}
                      className="px-2.5 py-1.5 rounded text-xs font-['Work_Sans'] font-medium text-[#4d6359] hover:bg-[#f0eee9] transition-all flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      type="button"
                      disabled={item.is86ed}
                      onClick={(e) => handleAdd(item, e)}
                      className={`px-3.5 py-1.5 rounded text-xs font-['Work_Sans'] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isAdded
                          ? 'bg-[#4d6359] text-white'
                          : item.is86ed
                          ? 'bg-[#e4e2dd] text-[#8b716b] cursor-not-allowed'
                          : 'bg-[#a23a1b] hover:bg-[#c35231] text-white active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Seat {activeSeat}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
