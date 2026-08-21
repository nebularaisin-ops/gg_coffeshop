import React, { useState } from 'react';
import { MenuItem, InventoryItem, OrderTicket } from '../types';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Ban, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  PieChart,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface ManagementDashboardProps {
  menuItems: MenuItem[];
  inventory: InventoryItem[];
  tickets: OrderTicket[];
  onToggle86: (itemId: string) => void;
  onUpdateInventoryStock: (invId: string, delta: number) => void;
}

export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({
  menuItems,
  inventory,
  tickets,
  onToggle86,
  onUpdateInventoryStock,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'inventory' | 'sales'>('matrix');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVelocity, setSelectedVelocity] = useState<string>('All');

  // Metrics Calculations
  const grossSales = tickets.reduce((acc, t) => {
    return acc + t.items.reduce((s, i) => s + (i.price * i.quantity), 0);
  }, 0);

  const totalFoodCost = tickets.reduce((acc, t) => {
    return acc + t.items.reduce((s, i) => {
      const match = menuItems.find(m => m.id === i.menuItemId);
      return s + ((match?.cost || 5) * i.quantity);
    }, 0);
  }, 0);

  const overallCOGS = grossSales > 0 ? ((totalFoodCost / grossSales) * 100).toFixed(1) : '28.4';
  const averageSpendPerCover = tickets.length > 0 ? (grossSales / tickets.reduce((a, t) => a + t.guestCount, 0)).toFixed(2) : '82.50';
  const outOfStockCount = menuItems.filter(m => m.is86ed).length;
  const lowStockItems = inventory.filter(i => i.currentStock <= i.minThreshold);

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVelocity = selectedVelocity === 'All' || item.salesVelocity === selectedVelocity;
    return matchesSearch && matchesVelocity;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* Executive Header */}
      <div className="bg-[#f0eee9] border border-[#e4e2dd] rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-['Epilogue'] text-[#1b1c19]">
              Culinary Operations & Menu Engineering
            </h1>
            <span className="text-xs font-['JetBrains_Mono'] px-2 py-0.5 rounded-full bg-[#d0e8db] text-[#0a1f18] font-bold">
              Shift Audit Q3
            </span>
          </div>
          <p className="text-xs text-[#57423c] font-['Work_Sans'] mt-1">
            Real-time COGS tracking, BCG menu engineering matrix, and automated threshold alerts.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#ffffff] p-1 rounded border border-[#dec0b8] shadow-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded text-xs font-['Work_Sans'] font-medium transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#a23a1b] text-white shadow-xs'
                : 'text-[#57423c] hover:bg-[#f0eee9]'
            }`}
          >
            Menu Engineering Matrix
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded text-xs font-['Work_Sans'] font-medium transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#a23a1b] text-white shadow-xs'
                : 'text-[#57423c] hover:bg-[#f0eee9]'
            }`}
          >
            Raw Inventory & 86-List ({lowStockItems.length} Low)
          </button>
        </div>
      </div>

      {/* Condensed 12-Column Metric Grid with 16px Gutters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Gross Sales */}
        <div className="bg-[#ffffff] border border-[#e4e2dd] rounded-lg p-4 space-y-1 shadow-xs">
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#8b716b] block">
            Gross Service Revenue
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-['Work_Sans'] font-bold text-2xl text-[#1b1c19]">
              ${grossSales > 0 ? grossSales.toFixed(2) : '3,842.00'}
            </span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#4d6359] font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <span className="text-[11px] text-[#57423c] font-['Work_Sans']">
            Pacing vs last Thursday night
          </span>
        </div>

        {/* Metric 2: COGS % */}
        <div className="bg-[#ffffff] border border-[#e4e2dd] rounded-lg p-4 space-y-1 shadow-xs">
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#8b716b] block">
            Target Food Cost (COGS)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-['Work_Sans'] font-bold text-2xl text-[#4d6359]">
              {overallCOGS}%
            </span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#4d6359] font-semibold flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> -1.8%
            </span>
          </div>
          <span className="text-[11px] text-[#57423c] font-['Work_Sans']">
            Benchmark: under 30.0%
          </span>
        </div>

        {/* Metric 3: Average Check per Cover */}
        <div className="bg-[#ffffff] border border-[#e4e2dd] rounded-lg p-4 space-y-1 shadow-xs">
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#8b716b] block">
            Avg Cover Spend
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-['Work_Sans'] font-bold text-2xl text-[#1b1c19]">
              ${averageSpendPerCover}
            </span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#745902] font-semibold">
              42 covers served
            </span>
          </div>
          <span className="text-[11px] text-[#57423c] font-['Work_Sans']">
            Includes wine pairings & caviar
          </span>
        </div>

        {/* Metric 4: 86'd & Critical Threshold Alerts */}
        <div className="bg-[#ffffff] border border-[#e4e2dd] rounded-lg p-4 space-y-1 shadow-xs">
          <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-[#8b716b] block">
            Operational Alerts
          </span>
          <div className="flex items-baseline justify-between">
            <span className={`font-['Work_Sans'] font-bold text-2xl ${outOfStockCount > 0 || lowStockItems.length > 0 ? 'text-[#ba1a1a]' : 'text-[#4d6359]'}`}>
              {outOfStockCount} 86'd / {lowStockItems.length} Low
            </span>
            <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
          </div>
          <span className="text-[11px] text-[#57423c] font-['Work_Sans']">
            Kitchen line sync enabled
          </span>
        </div>

      </div>

      {/* TAB 1: MENU ENGINEERING MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-[#ffffff] border border-[#e4e2dd] rounded-lg p-5 shadow-sm space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-['JetBrains_Mono'] uppercase tracking-wider text-[#8b716b]">
                Velocity Filter:
              </span>
              {['All', 'Star', 'Plowhorse', 'Puzzle', 'Dog'].map(vel => (
                <button
                  key={vel}
                  onClick={() => setSelectedVelocity(vel)}
                  className={`px-2.5 py-1 rounded text-xs font-['Work_Sans'] font-medium transition-all ${
                    selectedVelocity === vel
                      ? 'bg-[#4d6359] text-white'
                      : 'bg-[#f5f3ee] text-[#57423c] hover:bg-[#eae8e3]'
                  }`}
                >
                  {vel}
                </button>
              ))}
            </div>

            {/* Search Input with Float Label vibe */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8b716b]" />
              <input
                type="text"
                placeholder="Search SKU or Dish Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#fbf9f4] border border-[#dec0b8] rounded pl-8 pr-3 py-1.5 text-xs font-['Work_Sans'] focus:outline-none focus:border-[#a23a1b]"
              />
            </div>
          </div>

          {/* Zebra Striped Data Table */}
          <div className="overflow-x-auto border border-[#e4e2dd] rounded">
            <table className="w-full text-left text-xs table-zebra">
              <thead className="bg-[#f0eee9] text-[#1b1c19] font-['Epilogue'] font-semibold border-b border-[#dec0b8]">
                <tr>
                  <th className="p-3 font-['JetBrains_Mono'] text-[11px] uppercase">SKU</th>
                  <th className="p-3">Item Name & Category</th>
                  <th className="p-3 font-['JetBrains_Mono']">Selling Price</th>
                  <th className="p-3 font-['JetBrains_Mono']">Food Cost</th>
                  <th className="p-3 font-['JetBrains_Mono']">Contribution Margin</th>
                  <th className="p-3 font-['JetBrains_Mono']">COGS %</th>
                  <th className="p-3">Engineering Classification</th>
                  <th className="p-3 text-right">86-List Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e3] font-['Work_Sans']">
                {filteredMenuItems.map(item => {
                  const margin = item.price - item.cost;
                  const cogsPercent = ((item.cost / item.price) * 100).toFixed(1);

                  // Velocity Badge Style
                  let velBadge = 'bg-[#ffdf96] text-[#251a00]';
                  if (item.salesVelocity === 'Star') velBadge = 'bg-[#ffdbd1] text-[#842506] font-bold';
                  if (item.salesVelocity === 'Plowhorse') velBadge = 'bg-[#cde5d9] text-[#0a1f18]';
                  if (item.salesVelocity === 'Puzzle') velBadge = 'bg-[#ffdf96] text-[#5a4400]';

                  return (
                    <tr key={item.id} className="hover:bg-[#fbf9f4] transition-colors">
                      <td className="p-3 font-['JetBrains_Mono'] text-[#8b716b] font-medium">
                        {item.sku}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-[#1b1c19]">{item.name}</div>
                        <div className="text-[11px] text-[#8b716b]">{item.category} • {item.station.toUpperCase()}</div>
                      </td>
                      <td className="p-3 font-['JetBrains_Mono'] font-bold text-[#1b1c19]">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="p-3 font-['JetBrains_Mono'] text-[#57423c]">
                        ${item.cost.toFixed(2)}
                      </td>
                      <td className="p-3 font-['JetBrains_Mono'] font-bold text-[#4d6359]">
                        +${margin.toFixed(2)}
                      </td>
                      <td className="p-3 font-['JetBrains_Mono'] text-[#1b1c19]">
                        <span className={`px-2 py-0.5 rounded font-semibold ${parseFloat(cogsPercent) < 25 ? 'bg-[#cde5d9] text-[#0a1f18]' : parseFloat(cogsPercent) > 32 ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#f0eee9]'}`}>
                          {cogsPercent}%
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-['JetBrains_Mono'] uppercase ${velBadge}`}>
                          {item.salesVelocity}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onToggle86(item.id)}
                          className={`px-3 py-1 rounded text-xs font-['Work_Sans'] font-bold transition-all cursor-pointer ${
                            item.is86ed
                              ? 'bg-[#ba1a1a] hover:bg-[#93000a] text-white shadow-xs'
                              : 'border border-[#4d6359] text-[#4d6359] hover:bg-[#cde5d9]/30'
                          }`}
                        >
                          {item.is86ed ? "86'd (Offline)" : "Available"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RAW INVENTORY & PURVEYOR TRACKER */}
      {activeTab === 'inventory' && (
        <div className="bg-[#ffffff] border border-[#e4e2dd] rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Epilogue'] font-bold text-lg text-[#1b1c19]">
              Raw Ingredient Inventory & Supplier Reconciliation
            </h3>
            <span className="text-xs font-['JetBrains_Mono'] text-[#8b716b]">
              Par levels synced with nightly deliveries
            </span>
          </div>

          <div className="overflow-x-auto border border-[#e4e2dd] rounded">
            <table className="w-full text-left text-xs table-zebra">
              <thead className="bg-[#f0eee9] text-[#1b1c19] font-['Epilogue'] font-semibold border-b border-[#dec0b8]">
                <tr>
                  <th className="p-3 font-['JetBrains_Mono'] text-[11px]">SKU</th>
                  <th className="p-3">Ingredient</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 font-['JetBrains_Mono']">Current Stock</th>
                  <th className="p-3 font-['JetBrains_Mono']">Min Par Level</th>
                  <th className="p-3 font-['JetBrains_Mono']">Cost / Unit</th>
                  <th className="p-3">Purveyor / Supplier</th>
                  <th className="p-3 text-right">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae8e3] font-['Work_Sans']">
                {inventory.map(inv => {
                  const isLow = inv.currentStock <= inv.minThreshold;
                  return (
                    <tr key={inv.id} className="hover:bg-[#fbf9f4]">
                      <td className="p-3 font-['JetBrains_Mono'] text-[#8b716b]">
                        {inv.sku}
                      </td>
                      <td className="p-3 font-semibold text-[#1b1c19]">
                        {inv.name}
                        {isLow && (
                          <span className="ml-2 px-1.5 py-0.2 rounded text-[10px] bg-[#ffdad6] text-[#ba1a1a] font-bold uppercase font-['JetBrains_Mono']">
                            Reorder Par
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[#57423c]">{inv.category}</td>
                      <td className="p-3 font-['JetBrains_Mono'] font-bold text-[#1b1c19]">
                        {inv.currentStock} {inv.unit}
                      </td>
                      <td className="p-3 font-['JetBrains_Mono'] text-[#8b716b]">
                        {inv.minThreshold} {inv.unit}
                      </td>
                      <td className="p-3 font-['JetBrains_Mono'] text-[#57423c]">
                        ${inv.costPerUnit.toFixed(2)}
                      </td>
                      <td className="p-3 text-[#57423c]">{inv.supplier}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onUpdateInventoryStock(inv.id, -1)}
                            className="w-6 h-6 rounded bg-[#f0eee9] hover:bg-[#eae8e3] text-[#57423c] font-bold flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            onClick={() => onUpdateInventoryStock(inv.id, 1)}
                            className="w-6 h-6 rounded bg-[#f0eee9] hover:bg-[#eae8e3] text-[#57423c] font-bold flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
