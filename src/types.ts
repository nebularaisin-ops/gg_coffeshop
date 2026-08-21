export type StationType = 'saute' | 'grill' | 'raw_bar' | 'garde_manger' | 'pastry' | 'bar';

export type DietaryTag = 'Vegan' | 'Vegetarian' | 'Gluten-Free' | 'Dairy-Free' | 'Nut-Free' | 'Raw';

export type MenuCategory = 'Starters & Crudo' | 'Handmade Pasta' | 'Wood-Fired Mains' | 'Fromagerie & Sweets' | 'Grand Cru & Cellar' | 'Signature Cocktails';

export interface ModifierOption {
  name: string;
  priceDelta: number;
}

export interface ModifierGroup {
  name: string;
  required?: boolean;
  maxSelections?: number;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  sku: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  cost: number; // For COGS calculations
  station: StationType;
  prepTimeMinutes: number;
  calories?: number;
  allergens: string[];
  dietary: DietaryTag[];
  winePairing?: string;
  winePairingGlassPrice?: number;
  chefTechnique?: string;
  origin?: string;
  image: string;
  is86ed: boolean;
  inventoryStock: number;
  minThreshold: number;
  salesVelocity: 'Star' | 'Plowhorse' | 'Puzzle' | 'Dog';
  modifierGroups?: ModifierGroup[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  seatNumber?: number;
  notes?: string;
  selectedModifiers?: string[];
  course: 'Course 1' | 'Course 2' | 'Course 3' | 'Dessert' | 'Beverage';
  firedAt?: number; // timestamp
  station: StationType;
  status: 'queued' | 'in_prep' | 'ready' | 'served';
}

export interface OrderTicket {
  id: string;
  ticketNumber: number;
  tableId: string;
  tableName: string;
  serverName: string;
  guestCount: number;
  orderType: 'Dine-in' | 'Tasting Menu' | 'Chef Counter' | 'Bar';
  createdAt: number;
  items: OrderItem[];
  status: 'active' | 'completed' | 'void';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  tipAmount: number;
  discountPercent: number;
  specialInstructions?: string;
}

export type TableStatus = 'available' | 'occupied' | 'fired' | 'check_dropped' | 'bussing';

export interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  zone: 'Main Dining Room' | 'Chef Counter' | 'Garden Terrace' | 'Cellar Vault';
  status: TableStatus;
  activeTicketId?: string;
  currentGuests?: number;
  serverName?: string;
  seatedTime?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minThreshold: number;
  costPerUnit: number;
  supplier: string;
  lastReceived: string;
}

export type ViewMode = 'menu' | 'pos' | 'kds' | 'floor' | 'management';
