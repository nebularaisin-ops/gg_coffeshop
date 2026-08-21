import React, { useState } from 'react';
import { MenuItem } from '../types';
import { 
  X, 
  Wine, 
  ChefHat, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  Plus, 
  Minus, 
  Check 
} from 'lucide-react';

interface ItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, seat: number, modifiers: string[], note: string) => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSeat, setSelectedSeat] = useState<number>(1);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>('');
  const [includeWinePairing, setIncludeWinePairing] = useState<boolean>(false);

  if (!item) return null;

  const handleToggleModifier = (modName: string) => {
    if (selectedModifiers.includes(modName)) {
      setSelectedModifiers(selectedModifiers.filter(m => m !== modName));
    } else {
      setSelectedModifiers([...selectedModifiers, modName]);
    }
  };

  const handleConfirm = () => {
    const finalModifiers = [...selectedModifiers];
    if (includeWinePairing && item.winePairing) {
      finalModifiers.push(`Sommelier Pairing: ${item.winePairing}`);
    }
    onAddToCart(item, quantity, selectedSeat, finalModifiers, customNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#30312e]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#ffffff] border border-[#dec0b8] rounded-lg max-w-2xl w-full overflow-hidden shadow-xl flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Image Hero */}
        <div className="relative h-64 w-full bg-[#f0eee9]">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1b1c19]/70 text-white flex items-center justify-center hover:bg-[#1b1c19] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-3 bg-[#ffffff]/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-['JetBrains_Mono'] font-bold text-[#a23a1b] border border-[#e4e2dd]">
            ${item.price.toFixed(2)}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(85vh-16rem)]">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b]">
                {item.category} • SKU: {item.sku}
              </span>
              {item.is86ed && (
                <span className="bg-[#ba1a1a] text-white text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded font-bold uppercase">
                  86'd
                </span>
              )}
            </div>
            <h2 className="font-['Epilogue'] font-bold text-2xl text-[#1b1c19]">
              {item.name}
            </h2>
            <p className="text-sm text-[#57423c] font-['Work_Sans'] mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Provenance & Technique Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#fbf9f4] border border-[#e4e2dd] p-3.5 rounded text-xs">
            {item.origin && (
              <div className="flex items-start gap-2 text-[#57423c]">
                <MapPin className="w-4 h-4 text-[#a23a1b] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1b1c19] font-['Work_Sans']">Terroir & Origin</strong>
                  <span>{item.origin}</span>
                </div>
              </div>
            )}

            {item.chefTechnique && (
              <div className="flex items-start gap-2 text-[#57423c]">
                <ChefHat className="w-4 h-4 text-[#4d6359] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1b1c19] font-['Work_Sans']">Technique</strong>
                  <span>{item.chefTechnique}</span>
                </div>
              </div>
            )}
          </div>

          {/* Wine Pairing Feature */}
          {item.winePairing && (
            <div className="bg-[#f0eee9] border border-[#dec0b8] p-3.5 rounded space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-['Work_Sans'] font-semibold text-[#745902]">
                  <Wine className="w-4 h-4" />
                  <span>Curated Sommelier Pairing</span>
                </div>
                {item.winePairingGlassPrice && (
                  <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#1b1c19]">
                    +${item.winePairingGlassPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs italic font-['Work_Sans'] text-[#1b1c19]">
                "{item.winePairing}"
              </p>
              <label className="flex items-center gap-2 text-xs font-['Work_Sans'] font-medium text-[#1b1c19] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={includeWinePairing}
                  onChange={(e) => setIncludeWinePairing(e.target.checked)}
                  className="rounded text-[#a23a1b] focus:ring-[#a23a1b]"
                />
                <span>Include paired glass with this course</span>
              </label>
            </div>
          )}

          {/* Modifiers Selection */}
          {item.modifierGroups && item.modifierGroups.length > 0 && (
            <div className="space-y-3 border-t border-[#eae8e3] pt-4">
              {item.modifierGroups.map(group => (
                <div key={group.name} className="space-y-2">
                  <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b]">
                    {group.name}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.options.map(opt => {
                      const isSelected = selectedModifiers.includes(opt.name);
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => handleToggleModifier(opt.name)}
                          className={`p-2.5 rounded border text-left text-xs font-['Work_Sans'] flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#a23a1b] bg-[#ffdbd1]/40 text-[#842506] font-semibold'
                              : 'border-[#dec0b8] bg-[#fbf9f4] text-[#1b1c19] hover:bg-[#f0eee9]'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {opt.priceDelta > 0 && (
                            <span className="font-['JetBrains_Mono'] text-[11px] text-[#a23a1b]">
                              +${opt.priceDelta}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Seat & Special Prep Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#eae8e3] pt-4">
            <div>
              <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] mb-1">
                Seat Assignment
              </label>
              <select
                value={selectedSeat}
                onChange={(e) => setSelectedSeat(parseInt(e.target.value))}
                className="w-full bg-[#fbf9f4] border border-[#dec0b8] rounded px-3 py-2 text-xs font-['Work_Sans']"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Seat {s}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] mb-1">
                Chef & Dietary Notes
              </label>
              <input
                type="text"
                placeholder="E.g., Sauce on side, gluten allergy..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full bg-[#fbf9f4] border border-[#dec0b8] rounded px-3 py-2 text-xs font-['Work_Sans']"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f5f3ee] border-t border-[#eae8e3] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#ffffff] border border-[#dec0b8] rounded p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded text-[#57423c] hover:bg-[#f0eee9] font-bold"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-['JetBrains_Mono'] font-bold text-sm px-2">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded text-[#57423c] hover:bg-[#f0eee9] font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            disabled={item.is86ed}
            onClick={handleConfirm}
            className="flex-1 bg-[#a23a1b] hover:bg-[#c35231] text-white py-3 px-4 rounded font-['Work_Sans'] font-bold text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Ticket • ${(item.price * quantity).toFixed(2)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
