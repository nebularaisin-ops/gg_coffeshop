import React from 'react';
import { OrderItem, Table } from '../types';
import { 
  X, 
  Trash2, 
  Send, 
  Utensils, 
  ShoppingBag, 
  Flame, 
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  selectedTable: Table | undefined;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSubmitOrder: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  selectedTable,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08875;
  const total = subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 bg-[#30312e]/50 backdrop-blur-xs flex justify-end">
      <div className="bg-[#ffffff] border-l border-[#dec0b8] max-w-md w-full h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 bg-[#f0eee9] border-b border-[#eae8e3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#a23a1b] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Epilogue'] font-bold text-base text-[#1b1c19]">
                Tasting Order Summary
              </h2>
              <p className="text-xs text-[#57423c] font-['Work_Sans']">
                {selectedTable?.name || 'Table 01'} • {selectedTable?.zone || 'Main Dining'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded text-[#57423c] hover:bg-[#eae8e3] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#f0eee9]">
          {cartItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Utensils className="w-10 h-10 mx-auto text-[#dec0b8]" />
              <p className="font-['Epilogue'] text-sm font-semibold text-[#1b1c19]">
                Your dining order is empty
              </p>
              <p className="text-xs text-[#8b716b] font-['Work_Sans'] max-w-xs mx-auto">
                Explore the tasting collection and tap "Add to Seat" to sequence your courses.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['JetBrains_Mono'] text-[10px] px-1.5 py-0.2 rounded bg-[#ffdbd1] text-[#842506] font-bold">
                      Seat {item.seatNumber || 1}
                    </span>
                    <span className="font-['Work_Sans'] font-semibold text-[#1b1c19]">
                      {item.name}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#8b716b] font-['JetBrains_Mono']">
                    {item.course} • Station: {item.station.toUpperCase()}
                  </div>

                  {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                    <div className="text-[11px] text-[#745902] font-['Work_Sans'] italic">
                      + {item.selectedModifiers.join(', ')}
                    </div>
                  )}

                  {item.notes && (
                    <div className="text-[11px] text-[#a23a1b] font-['Work_Sans']">
                      Note: {item.notes}
                    </div>
                  )}
                </div>

                {/* Price and Counter */}
                <div className="flex flex-col items-end gap-2">
                  <span className="font-['JetBrains_Mono'] font-bold text-sm text-[#1b1c19]">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <div className="flex items-center gap-1 bg-[#f5f3ee] rounded p-0.5 border border-[#e4e2dd]">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-5 h-5 flex items-center justify-center rounded text-[#57423c] hover:bg-[#ffffff]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-['JetBrains_Mono'] text-xs px-1 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-5 h-5 flex items-center justify-center rounded text-[#57423c] hover:bg-[#ffffff]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
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

        {/* Footer & Submit to Kitchen */}
        <div className="p-5 bg-[#f5f3ee] border-t border-[#eae8e3] space-y-4">
          <div className="space-y-1.5 font-['JetBrains_Mono'] text-xs">
            <div className="flex justify-between text-[#57423c]">
              <span>Course Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#57423c]">
              <span>Estimated Tax (8.875%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#1b1c19] pt-1.5 border-t border-[#dec0b8]">
              <span>Order Total:</span>
              <span className="text-[#a23a1b]">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={cartItems.length === 0}
            onClick={() => {
              onSubmitOrder();
              onClose();
            }}
            className="w-full bg-[#a23a1b] hover:bg-[#c35231] text-white py-3.5 px-4 rounded font-['Work_Sans'] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Flame className="w-4 h-4" />
            <span>Send Order Directly to Kitchen Line</span>
          </button>
        </div>

      </div>
    </div>
  );
};
