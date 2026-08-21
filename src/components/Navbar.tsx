import React from 'react';
import { ViewMode } from '../types';
import { 
  Utensils, 
  CreditCard, 
  Flame, 
  LayoutGrid, 
  BarChart3, 
  Sparkles,
  AlertTriangle,
  Clock,
  Wine
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  activeOrdersCount: number;
  outOfStockCount: number;
  onToggleAiCopilot: () => void;
  isAiCopilotOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  activeOrdersCount,
  outOfStockCount,
  onToggleAiCopilot,
  isAiCopilotOpen,
}) => {
  const [currentTime, setCurrentTime] = React.useState<string>('');

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'menu' as ViewMode, label: 'Guest Menu', icon: Utensils, desc: 'Digital Catalog' },
    { id: 'pos' as ViewMode, label: 'POS Terminal', icon: CreditCard, desc: 'High-Speed Register' },
    { 
      id: 'kds' as ViewMode, 
      label: 'Kitchen (KDS)', 
      icon: Flame, 
      desc: 'Line Pacing',
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined 
    },
    { id: 'floor' as ViewMode, label: 'Floor Map', icon: LayoutGrid, desc: 'Table Management' },
    { 
      id: 'management' as ViewMode, 
      label: 'Operations & Inventory', 
      icon: BarChart3, 
      desc: 'COGS & 86-List',
      alert: outOfStockCount > 0 ? `${outOfStockCount} 86'd` : undefined
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f4] border-b border-[#eae8e3] px-4 md:px-8 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#a23a1b] flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Epilogue'] font-bold text-lg text-[#1b1c19] tracking-tight">
                L'ATELIER VERNAL
              </span>
              <span className="text-[10px] uppercase font-['JetBrains_Mono'] px-2 py-0.5 rounded-full bg-[#cde5d9] text-[#4d6359] font-semibold tracking-wider">
                Service Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#57423c] font-['Work_Sans']">
              <span>Culinary Logic OS</span>
              <span className="text-[#8b716b]">•</span>
              <span className="font-['JetBrains_Mono'] text-[11px] text-[#4d6359] font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 inline text-[#745902]" /> {currentTime || '19:42:15'}
              </span>
            </div>
          </div>
        </div>

        {/* Center View Switcher Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs md:text-sm font-['Work_Sans'] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#4d6359] text-white shadow-sm'
                    : 'bg-[#f0eee9] hover:bg-[#eae8e3] text-[#1b1c19] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#cde5d9]' : 'text-[#57423c]'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-['JetBrains_Mono'] font-bold ${
                    isActive ? 'bg-[#a23a1b] text-white' : 'bg-[#a23a1b] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.alert && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-['JetBrains_Mono'] bg-[#ffdad6] text-[#ba1a1a] font-semibold">
                    {item.alert}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right utility & AI Assistant */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            id="btn-ai-copilot"
            onClick={onToggleAiCopilot}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-['Work_Sans'] font-semibold transition-all cursor-pointer border ${
              isAiCopilotOpen 
                ? 'bg-[#c35231] text-white border-[#a23a1b]' 
                : 'bg-[#ffdbd1] text-[#3b0900] border-[#dec0b8] hover:bg-[#ffb5a0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a23a1b]" />
            <span>AI Sommelier & Cost Copilot</span>
          </button>
        </div>

      </div>
    </header>
  );
};
