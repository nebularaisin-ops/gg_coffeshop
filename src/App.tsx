import React, { useState } from 'react';
import { ViewMode, MenuItem, Table, OrderTicket, InventoryItem, OrderItem, TableStatus } from './types';
import { INITIAL_MENU_ITEMS, INITIAL_TABLES, INITIAL_TICKETS, INITIAL_INVENTORY } from './data/mockData';
import { Navbar } from './components/Navbar';
import { CustomerMenu } from './components/CustomerMenu';
import { POSTerminal } from './components/POSTerminal';
import { KitchenDisplay } from './components/KitchenDisplay';
import { FloorPlan } from './components/FloorPlan';
import { ManagementDashboard } from './components/ManagementDashboard';
import { ItemModal } from './components/ItemModal';
import { ReceiptModal } from './components/ReceiptModal';
import { CartDrawer } from './components/CartDrawer';
import { AICulinaryCopilot } from './components/AICulinaryCopilot';
import { Check, Flame, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [tickets, setTickets] = useState<OrderTicket[]>(INITIAL_TICKETS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [selectedTableId, setSelectedTableId] = useState<string>('t1');

  // Modals and Drawers
  const [inspectingItem, setInspectingItem] = useState<MenuItem | null>(null);
  const [receiptTicket, setReceiptTicket] = useState<OrderTicket | null>(null);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const selectedTable = tables.find(t => t.id === selectedTableId) || tables[0];

  // Get or initialize active ticket for currently selected table
  const activeTicket = tickets.find(t => t.tableId === selectedTableId && t.status === 'active') || {
    id: `ticket-${Date.now()}`,
    ticketNumber: Math.floor(100 + Math.random() * 900),
    tableId: selectedTable.id,
    tableName: selectedTable.name,
    serverName: selectedTable.serverName || 'Elena Rostova',
    guestCount: selectedTable.currentGuests || 2,
    orderType: 'Dine-in',
    createdAt: Date.now(),
    items: [],
    status: 'active',
    paymentStatus: 'unpaid',
    tipAmount: 0,
    discountPercent: 0
  };

  // 86-Item Toggle
  const handleToggle86 = (itemId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextState = !item.is86ed;
        showToast(nextState ? `Item 86'd: ${item.name} is now offline.` : `Item Restocked: ${item.name} is back on menu.`);
        return { ...item, is86ed: nextState };
      }
      return item;
    }));
  };

  // Update Inventory Stock
  const handleUpdateInventoryStock = (invId: string, delta: number) => {
    setInventory(prev => prev.map(inv => {
      if (inv.id === invId) {
        const newStock = Math.max(0, parseFloat((inv.currentStock + delta).toFixed(1)));
        return { ...inv, currentStock: newStock };
      }
      return inv;
    }));
  };

  // Update POS Ticket
  const handleUpdateTicket = (updatedTicket: OrderTicket) => {
    setTickets(prev => {
      const exists = prev.some(t => t.id === updatedTicket.id);
      if (exists) {
        return prev.map(t => t.id === updatedTicket.id ? updatedTicket : t);
      }
      return [...prev, updatedTicket];
    });

    // Update table activeTicketId if needed
    setTables(prev => prev.map(table => {
      if (table.id === updatedTicket.tableId) {
        return {
          ...table,
          activeTicketId: updatedTicket.id,
          status: table.status === 'available' ? 'occupied' : table.status
        };
      }
      return table;
    }));
  };

  // Send Ticket to Kitchen (KDS)
  const handleSendToKitchen = (ticketToSend: OrderTicket) => {
    // Mark items as fired / in_prep
    const preparedItems = ticketToSend.items.map(item => ({
      ...item,
      status: item.status === 'queued' ? ('in_prep' as const) : item.status,
      firedAt: item.firedAt || Date.now()
    }));

    const finalTicket: OrderTicket = {
      ...ticketToSend,
      items: preparedItems
    };

    handleUpdateTicket(finalTicket);
    
    // Update table status to 'fired'
    setTables(prev => prev.map(t => t.id === ticketToSend.tableId ? { ...t, status: 'fired' } : t));
    
    showToast(`Order #${finalTicket.ticketNumber} for ${finalTicket.tableName} sent directly to Kitchen Line.`);
  };

  // Bump Ticket in KDS
  const handleBumpTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          items: t.items.map(i => ({ ...i, status: 'served' as const })),
          status: 'completed' as const
        };
      }
      return t;
    }));
    showToast(`Ticket #${ticketId.replace('ticket-', '')} bumped & plated!`);
  };

  // Update Table Status
  const handleUpdateTableStatus = (tableId: string, status: TableStatus, guests?: number, server?: string) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status,
          currentGuests: guests !== undefined ? guests : t.currentGuests,
          serverName: server || t.serverName,
          seatedTime: status === 'occupied' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : t.seatedTime
        };
      }
      return t;
    }));
    showToast(`Table status updated to ${status.replace('_', ' ').toUpperCase()}`);
  };

  // Customer Menu Quick Add
  const handleQuickAddItem = (item: MenuItem, seat: number, note?: string) => {
    const newItem: OrderItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      seatNumber: seat,
      notes: note,
      course: item.category === 'Starters & Crudo' ? 'Course 1' :
              item.category === 'Handmade Pasta' ? 'Course 2' :
              item.category === 'Wood-Fired Mains' ? 'Course 3' :
              item.category === 'Fromagerie & Sweets' ? 'Dessert' : 'Beverage',
      station: item.station,
      status: 'queued'
    };

    setCartItems(prev => [...prev, newItem]);
    showToast(`Added ${item.name} (Seat ${seat}) to Dining Order`);
  };

  // Modal Detailed Add to Cart
  const handleModalAddToCart = (item: MenuItem, quantity: number, seat: number, modifiers: string[], note: string) => {
    const newItem: OrderItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      seatNumber: seat,
      selectedModifiers: modifiers,
      notes: note,
      course: item.category === 'Starters & Crudo' ? 'Course 1' :
              item.category === 'Handmade Pasta' ? 'Course 2' :
              item.category === 'Wood-Fired Mains' ? 'Course 3' :
              item.category === 'Fromagerie & Sweets' ? 'Dessert' : 'Beverage',
      station: item.station,
      status: 'queued'
    };

    setCartItems(prev => [...prev, newItem]);
    showToast(`Added ${quantity}x ${item.name} to Seat ${seat}`);
  };

  // Submit Cart Order to Kitchen & POS
  const handleSubmitCartOrder = () => {
    if (cartItems.length === 0) return;

    const newTicket: OrderTicket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: Math.floor(100 + Math.random() * 900),
      tableId: selectedTable.id,
      tableName: selectedTable.name,
      serverName: selectedTable.serverName || 'Elena Rostova',
      guestCount: selectedTable.currentGuests || 2,
      orderType: 'Dine-in',
      createdAt: Date.now(),
      items: cartItems.map(i => ({ ...i, status: 'in_prep', firedAt: Date.now() })),
      status: 'active',
      paymentStatus: 'unpaid',
      tipAmount: 0,
      discountPercent: 0
    };

    setTickets(prev => [...prev, newTicket]);
    setTables(prev => prev.map(t => t.id === selectedTable.id ? { ...t, status: 'fired', activeTicketId: newTicket.id } : t));
    setCartItems([]);
    showToast(`Order #${newTicket.ticketNumber} for ${selectedTable.name} sent to Kitchen Line!`);
  };

  // Settle Payment on Ticket
  const handleSettlePayment = (ticketId: string, tip: number) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          paymentStatus: 'paid' as const,
          tipAmount: tip
        };
      }
      return t;
    }));

    // Free up or mark table bussing
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setTables(prev => prev.map(t => t.id === ticket.tableId ? { ...t, status: 'bussing' } : t));
    }

    showToast(`Payment settled for Ticket. Table moved to Bussing.`);
  };

  const outOfStockCount = menuItems.filter(m => m.is86ed).length;
  const activeOrdersCount = tickets.filter(t => t.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#fbf9f4] text-[#1b1c19] flex flex-col font-['Work_Sans']">
      
      {/* Universal Culinary Logic OS Navigation Bar */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        activeOrdersCount={activeOrdersCount}
        outOfStockCount={outOfStockCount}
        onToggleAiCopilot={() => setIsAiCopilotOpen(!isAiCopilotOpen)}
        isAiCopilotOpen={isAiCopilotOpen}
      />

      {/* Toast Floating Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b1c19] text-[#fbf9f4] border border-[#4d6359] px-4 py-3 rounded-lg shadow-xl text-xs font-['Work_Sans'] font-medium flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-2 h-2 rounded-full bg-[#a23a1b] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'menu' && (
          <CustomerMenu
            menuItems={menuItems}
            onSelectItem={(item) => setInspectingItem(item)}
            onQuickAddItem={handleQuickAddItem}
            tables={tables}
            selectedTableId={selectedTableId}
            onSelectTableId={(id) => setSelectedTableId(id)}
            cartItemsCount={cartItems.length}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentView === 'pos' && (
          <POSTerminal
            menuItems={menuItems}
            tables={tables}
            activeTicket={activeTicket}
            onUpdateTicket={handleUpdateTicket}
            onSendToKitchen={handleSendToKitchen}
            onOpenReceipt={(ticket) => setReceiptTicket(ticket)}
            onSelectTable={(tableId) => setSelectedTableId(tableId)}
          />
        )}

        {currentView === 'kds' && (
          <KitchenDisplay
            tickets={tickets}
            onUpdateTicket={handleUpdateTicket}
            onBumpTicket={handleBumpTicket}
          />
        )}

        {currentView === 'floor' && (
          <FloorPlan
            tables={tables}
            tickets={tickets}
            onSelectTable={(tableId) => setSelectedTableId(tableId)}
            onUpdateTableStatus={handleUpdateTableStatus}
            onOpenPOSTable={(tableId) => {
              setSelectedTableId(tableId);
              setCurrentView('pos');
            }}
          />
        )}

        {currentView === 'management' && (
          <ManagementDashboard
            menuItems={menuItems}
            inventory={inventory}
            tickets={tickets}
            onToggle86={handleToggle86}
            onUpdateInventoryStock={handleUpdateInventoryStock}
          />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ItemModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onAddToCart={handleModalAddToCart}
      />

      <ReceiptModal
        ticket={receiptTicket}
        onClose={() => setReceiptTicket(null)}
        onSettlePayment={handleSettlePayment}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        selectedTable={selectedTable}
        onUpdateQuantity={(itemId, delta) => {
          setCartItems(prev => prev.map(i => {
            if (i.id === itemId) {
              const newQ = i.quantity + delta;
              return newQ > 0 ? { ...i, quantity: newQ } : null;
            }
            return i;
          }).filter((i): i is OrderItem => i !== null));
        }}
        onRemoveItem={(itemId) => {
          setCartItems(prev => prev.filter(i => i.id !== itemId));
        }}
        onSubmitOrder={handleSubmitCartOrder}
      />

      <AICulinaryCopilot
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        menuItems={menuItems}
      />

    </div>
  );
}
