
export type TransactionType = 'SALE' | 'PURCHASE' | 'EXPENSE';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  reorderLevel: number;
  costPrice: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  itemId?: string;
  amount: number;
  quantity?: number;
  date: string;
  description: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantityNeeded: number;
  isCompleted: boolean;
}

export type View = 'DASHBOARD' | 'INVENTORY' | 'TRANSACTIONS' | 'SHOPPING';
