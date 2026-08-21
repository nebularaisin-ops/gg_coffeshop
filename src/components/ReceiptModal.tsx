import React, { useState } from 'react';
import { OrderTicket } from '../types';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  CreditCard, 
  DollarSign, 
  Sparkles,
  Share2
} from 'lucide-react';

interface ReceiptModalProps {
  ticket: OrderTicket | null;
  onClose: () => void;
  onSettlePayment: (ticketId: string, tip: number) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  ticket,
  onClose,
  onSettlePayment,
}) => {
  const [tipPercent, setTipPercent] = useState<number>(20);
  const [customTip, setCustomTip] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(ticket?.paymentStatus === 'paid');

  if (!ticket) return null;

  const subtotal = ticket.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = (subtotal * ticket.discountPercent) / 100;
  const taxable = subtotal - discount;
  const tax = taxable * 0.08875;
  const computedTip = customTip ? parseFloat(customTip) || 0 : (taxable * tipPercent) / 100;
  const grandTotal = taxable + tax + computedTip;

  const handlePay = () => {
    setIsPaid(true);
    onSettlePayment(ticket.id, computedTip);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#30312e]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#ffffff] border border-[#dec0b8] rounded-lg max-w-md w-full overflow-hidden shadow-2xl flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#f0eee9] border-b border-[#eae8e3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-['Epilogue'] font-bold text-sm text-[#1b1c19]">
              Thermal POS Receipt Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded text-[#57423c] hover:bg-[#eae8e3] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Receipt Simulation in JetBrains Mono */}
        <div className="p-6 bg-[#fbf9f4] font-['JetBrains_Mono'] text-xs text-[#1b1c19] space-y-4 border-b border-dashed border-[#dec0b8]">
          
          {/* Header */}
          <div className="text-center space-y-1 border-b border-dashed border-[#dec0b8] pb-4">
            <h2 className="font-['Epilogue'] font-bold text-lg tracking-wider text-[#1b1c19]">
              L'ATELIER VERNAL
            </h2>
            <p className="text-[11px] text-[#57423c]">
              440 Hudson Street, West Village, NY
            </p>
            <p className="text-[10px] text-[#8b716b]">
              Tel: (212) 555-0194 • Est. 2024
            </p>
            <div className="pt-2 flex justify-between text-[10px] text-[#57423c]">
              <span>TICKET: #{ticket.ticketNumber}</span>
              <span>TABLE: {ticket.tableName}</span>
            </div>
            <div className="flex justify-between text-[10px] text-[#57423c]">
              <span>SERVER: {ticket.serverName.toUpperCase()}</span>
              <span>GUESTS: {ticket.guestCount}</span>
            </div>
            <div className="text-[10px] text-[#8b716b] text-left">
              TIME: {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Itemized list */}
          <div className="space-y-2 py-2 border-b border-dashed border-[#dec0b8]">
            {ticket.items.map((item) => (
              <div key={item.id} className="space-y-0.5">
                <div className="flex justify-between items-start">
                  <span className="flex-1 pr-2">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                {item.seatNumber && (
                  <div className="text-[10px] text-[#8b716b]">
                    ↳ Seat {item.seatNumber}
                  </div>
                )}
                {item.selectedModifiers && item.selectedModifiers.map(m => (
                  <div key={m} className="text-[10px] text-[#745902]">
                    ↳ {m}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Calculations */}
          <div className="space-y-1.5 pt-1 text-[11px]">
            <div className="flex justify-between text-[#57423c]">
              <span>FOOD & BEV SUBTOTAL:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {ticket.discountPercent > 0 && (
              <div className="flex justify-between text-[#a23a1b]">
                <span>DISCOUNT ({ticket.discountPercent}%):</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#57423c]">
              <span>NYC TAX (8.875%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-[#4d6359] font-medium">
              <span>GRATUITY:</span>
              <span>${computedTip.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-sm pt-2 border-t border-[#dec0b8] text-[#1b1c19]">
              <span>TOTAL DUE:</span>
              <span className="text-[#a23a1b]">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Tip Guide for Guest */}
          <div className="bg-[#f0eee9] p-2.5 rounded text-[10px] text-center space-y-1 text-[#57423c]">
            <p className="font-semibold text-[#1b1c19]">SUGGESTED TIP GUIDE:</p>
            <div className="flex justify-around pt-0.5">
              <span>18% = ${(taxable * 0.18).toFixed(2)}</span>
              <span>20% = ${(taxable * 0.20).toFixed(2)}</span>
              <span>22% = ${(taxable * 0.22).toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#8b716b] pt-1">
            Thank you for dining at L'Atelier Vernal.
          </div>
        </div>

        {/* Tip Selector & Settlement Bar */}
        <div className="p-4 bg-[#ffffff] space-y-3">
          {!isPaid ? (
            <>
              <div className="space-y-1.5">
                <span className="text-xs font-['Work_Sans'] text-[#57423c]">
                  Select Server Tip Gratuity:
                </span>
                <div className="grid grid-cols-4 gap-1.5 font-['JetBrains_Mono'] text-xs">
                  {[18, 20, 22].map(pct => (
                    <button
                      key={pct}
                      onClick={() => {
                        setTipPercent(pct);
                        setCustomTip('');
                      }}
                      className={`py-1.5 rounded transition-all cursor-pointer ${
                        tipPercent === pct && !customTip
                          ? 'bg-[#4d6359] text-white font-bold'
                          : 'bg-[#f0eee9] text-[#1b1c19] hover:bg-[#eae8e3]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setTipPercent(0);
                      setCustomTip('0');
                    }}
                    className={`py-1.5 rounded transition-all cursor-pointer ${
                      customTip === '0'
                        ? 'bg-[#4d6359] text-white font-bold'
                        : 'bg-[#f0eee9] text-[#1b1c19] hover:bg-[#eae8e3]'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2.5 rounded border border-[#dec0b8] text-[#57423c] hover:bg-[#f0eee9] text-xs font-['Work_Sans'] flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>

                <button
                  onClick={handlePay}
                  className="flex-1 bg-[#a23a1b] hover:bg-[#c35231] text-white py-2.5 rounded font-['Work_Sans'] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Settle Bill (${grandTotal.toFixed(2)})</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-4 text-center space-y-2 bg-[#cde5d9]/30 rounded border border-[#4d6359]/30">
              <CheckCircle2 className="w-8 h-8 text-[#4d6359] mx-auto animate-bounce" />
              <h4 className="font-['Epilogue'] font-bold text-sm text-[#0a1f18]">
                Payment Settled Successfully!
              </h4>
              <p className="text-xs font-['Work_Sans'] text-[#51675d]">
                Transaction approved. Table marked ready for turn.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
