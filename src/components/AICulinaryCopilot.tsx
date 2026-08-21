import React, { useState } from 'react';
import { MenuItem } from '../types';
import { 
  Sparkles, 
  Wine, 
  Calculator, 
  ChefHat, 
  Send, 
  X, 
  Check, 
  Bot,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface AICulinaryCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export const AICulinaryCopilot: React.FC<AICulinaryCopilotProps> = ({
  isOpen,
  onClose,
  menuItems,
}) => {
  const [activeTab, setActiveTab] = useState<'sommelier' | 'costing' | 'tasting'>('sommelier');
  const [selectedItem, setSelectedItem] = useState<string>(menuItems[0]?.id || '');
  const [guestPreference, setGuestPreference] = useState<string>('Mineral-driven crisp white with high acidity, no heavy oak');
  const [targetMargin, setTargetMargin] = useState<number>(72);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDish = menuItems.find(m => m.id === selectedItem);

  const handleGenerateSommelier = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (!currentDish) return;
      setAiOutput(`### Sommelier Pairing Protocol: ${currentDish.name}

**Primary Recommendation:** 
*2022 Domaine Sigalas Assyrtiko (Santorini, Greece)* — $19/glass ($78/bottle)
- **Aromatics:** Crushed basalt, green citrus, sea salt brine, white peach blossom.
- **Palate Dynamic:** Piercing volcanic acidity cuts straight through rich fats while accentuating delicate citrus and umami.
- **Temperature Service:** 10°C in Gabriel-Glas StandArt stemware.

**Alternative Reserve Pairing (Red Option):**
*2020 Domaine Dujac Morey-Saint-Denis Pinot Noir (Burgundy, France)* — $35/glass
- Subtle red berries, forest floor floor, silky low-tannin structure that elevates without overpowering.`);
      setIsGenerating(false);
    }, 600);
  };

  const handleGenerateCosting = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (!currentDish) return;
      const currentCost = currentDish.cost;
      const currentPrice = currentDish.price;
      const currentMargin = (((currentPrice - currentCost) / currentPrice) * 100).toFixed(1);
      const recommendedPrice = (currentCost / (1 - (targetMargin / 100))).toFixed(2);

      setAiOutput(`### Menu Engineering & Cost Optimization: ${currentDish.name}

- **Current COGS:** $${currentCost.toFixed(2)} (${(100 - parseFloat(currentMargin)).toFixed(1)}% of price)
- **Current Selling Price:** $${currentPrice.toFixed(2)}
- **Contribution Margin:** $${(currentPrice - currentCost).toFixed(2)} (${currentMargin}%)

**Recommended Optimization:**
1. **Target Selling Price:** Raise from $${currentPrice.toFixed(2)} to **$${recommendedPrice}** to hit your exact ${targetMargin}% margin target.
2. **Yield & Prep Adjustment:** Trimming secondary cuts into broth reduces food waste cost by ~8.4%.
3. **Menu Classification:** This item qualifies as a **"${currentDish.salesVelocity}"** — anchor with a premium wine pairing add-on (+ $18) to maximize total table check average.`);
      setIsGenerating(false);
    }, 600);
  };

  const handleGenerateTastingMenu = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setAiOutput(`### 5-Course Chef's Tasting Flight (Pacing & Harmony)

1. **Course 1 (Amuse / Cold Raw Bar):**
   *Hamachi Crudo & Yuzu Kosho* • Paired with 2022 Assyrtiko
   - Pacing: 6 min prep, light palate opener.

2. **Course 2 (Warm Garde Manger):**
   *Burrata di Puglia & Charred Figs* • Paired with 2020 Fiano di Avellino
   - Pacing: 5 min prep, creamy contrast.

3. **Course 3 (Primo Pasta):**
   *Agnolotti del Plin con Tartufo* (Veal & Winter Périgord Truffle)
   - Paired with 2019 GD Vajra Barolo Albe.

4. **Course 4 (Main Wood-Fired):**
   *45-Day Dry-Aged Prime Ribeye* with Bone Marrow & Robuchon Purée
   - Paired with 2018 Chateau Meyney Saint-Estèphe.

5. **Course 5 (Grand Finale):**
   *Valrhona Guanaja 70% Soufflé* with Bourbon Crème Anglaise
   - Paired with 2017 Niepoort Late Bottled Vintage Port.

**Pacing Guideline:** 18 minutes between pasta and wood-fired mains for optimal line flow.`);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#30312e]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#ffffff] border border-[#dec0b8] rounded-lg max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#f0eee9] border-b border-[#eae8e3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#a23a1b] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Epilogue'] font-bold text-base text-[#1b1c19]">
                AI Sommelier & Recipe Cost Copilot
              </h2>
              <p className="text-xs text-[#57423c] font-['Work_Sans']">
                Culinary Intelligence & Sommelier Cellar Algorithms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded text-[#57423c] hover:bg-[#eae8e3] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#eae8e3] bg-[#fbf9f4]">
          <button
            onClick={() => {
              setActiveTab('sommelier');
              setAiOutput(null);
            }}
            className={`flex-1 py-3 px-4 text-xs font-['Work_Sans'] font-medium flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sommelier'
                ? 'border-[#a23a1b] text-[#a23a1b] font-bold bg-[#ffffff]'
                : 'border-transparent text-[#57423c] hover:bg-[#f0eee9]'
            }`}
          >
            <Wine className="w-4 h-4" />
            <span>Sommelier Pairing</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('costing');
              setAiOutput(null);
            }}
            className={`flex-1 py-3 px-4 text-xs font-['Work_Sans'] font-medium flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'costing'
                ? 'border-[#a23a1b] text-[#a23a1b] font-bold bg-[#ffffff]'
                : 'border-transparent text-[#57423c] hover:bg-[#f0eee9]'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Recipe COGS & Margin</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('tasting');
              setAiOutput(null);
            }}
            className={`flex-1 py-3 px-4 text-xs font-['Work_Sans'] font-medium flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'tasting'
                ? 'border-[#a23a1b] text-[#a23a1b] font-bold bg-[#ffffff]'
                : 'border-transparent text-[#57423c] hover:bg-[#f0eee9]'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>5-Course Sequencing</span>
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'sommelier' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] mb-1">
                  Select Menu Dish:
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-[#dec0b8] rounded px-3 py-2 text-xs font-['Work_Sans'] font-medium"
                >
                  {menuItems.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} (${m.price}) - {m.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] mb-1">
                  Guest Wine Preference / Profile:
                </label>
                <input
                  type="text"
                  value={guestPreference}
                  onChange={(e) => setGuestPreference(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-[#dec0b8] rounded px-3 py-2 text-xs font-['Work_Sans']"
                />
              </div>

              <button
                onClick={handleGenerateSommelier}
                disabled={isGenerating}
                className="w-full bg-[#a23a1b] hover:bg-[#c35231] text-white py-2.5 rounded font-['Work_Sans'] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Analyzing Terroir & Tannins...' : 'Generate Sommelier Analysis'}</span>
              </button>
            </div>
          )}

          {activeTab === 'costing' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] mb-1">
                  Select Recipe Item:
                </label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full bg-[#fbf9f4] border border-[#dec0b8] rounded px-3 py-2 text-xs font-['Work_Sans'] font-medium"
                >
                  {menuItems.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Cost: ${m.cost.toFixed(2)}, Price: ${m.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b] mb-1">
                  Target Profit Margin Percentage ({targetMargin}%):
                </label>
                <input
                  type="range"
                  min={50}
                  max={85}
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(parseInt(e.target.value))}
                  className="w-full accent-[#a23a1b]"
                />
              </div>

              <button
                onClick={handleGenerateCosting}
                disabled={isGenerating}
                className="w-full bg-[#a23a1b] hover:bg-[#c35231] text-white py-2.5 rounded font-['Work_Sans'] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>{isGenerating ? 'Calculating Plate Margins...' : 'Compute Margin Recommendations'}</span>
              </button>
            </div>
          )}

          {activeTab === 'tasting' && (
            <div className="space-y-3">
              <p className="text-xs text-[#57423c] font-['Work_Sans']">
                Harmonize a balanced 5-course degustation flight across raw, pasta, wood-fired mains, and pastry with station timing optimization.
              </p>
              <button
                onClick={handleGenerateTastingMenu}
                disabled={isGenerating}
                className="w-full bg-[#a23a1b] hover:bg-[#c35231] text-white py-2.5 rounded font-['Work_Sans'] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <ChefHat className="w-4 h-4" />
                <span>{isGenerating ? 'Orchestrating Tasting Sequence...' : 'Build 5-Course Tasting Pacing'}</span>
              </button>
            </div>
          )}

          {/* AI Result Card */}
          {aiOutput && (
            <div className="bg-[#fbf9f4] border border-[#dec0b8] rounded p-4 text-xs font-['Work_Sans'] space-y-2 text-[#1b1c19] leading-relaxed">
              <div className="whitespace-pre-line">
                {aiOutput}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
