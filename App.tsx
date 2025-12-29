
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ArrowLeftRight, 
  ShoppingCart, 
  AlertTriangle
} from 'lucide-react';
import { InventoryItem, Transaction, ShoppingItem, View } from './types';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import TransactionView from './components/TransactionView';
import ShoppingView from './components/ShoppingView';

// Pre-defined templates for Andrew's Shop
const DEFAULT_TEMPLATES: InventoryItem[] = [
  { id: 't1', name: "Sugar (1kg)", category: "Grains & Flour", price: 5500, costPrice: 4800, stock: 10, reorderLevel: 5 },
  { id: 't2', name: "Rice Pakistan (1kg)", category: "Grains & Flour", price: 4500, costPrice: 3800, stock: 10, reorderLevel: 5 },
  { id: 't3', name: "Rice Super (1kg)", category: "Grains & Flour", price: 6000, costPrice: 5200, stock: 10, reorderLevel: 5 },
  { id: 't4', name: "Superloaf Bread", category: "Bakery", price: 4500, costPrice: 4000, stock: 5, reorderLevel: 3 },
  { id: 't5', name: "Ntake Bread", category: "Bakery", price: 4500, costPrice: 4000, stock: 5, reorderLevel: 3 },
  { id: 't6', name: "Soda Coke (500ml Plastic)", category: "Beverages", price: 2000, costPrice: 1700, stock: 12, reorderLevel: 6 },
  { id: 't7', name: "Mirinda Apple (Glass)", category: "Beverages", price: 1500, costPrice: 1200, stock: 24, reorderLevel: 12 },
  { id: 't8', name: "Gorrillos (Small)", category: "Snacks & Sweets", price: 1000, costPrice: 800, stock: 20, reorderLevel: 10 },
  { id: 't9', name: "Omo Detergent (Small)", category: "Household", price: 1000, costPrice: 850, stock: 15, reorderLevel: 5 },
  { id: 't10', name: "Posho (1kg)", category: "Grains & Flour", price: 3000, costPrice: 2400, stock: 50, reorderLevel: 10 },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('ande_inventory');
    // If empty, load the shop templates immediately
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ande_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('ande_shopping');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('ande_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ande_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ande_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <DashboardView inventory={inventory} transactions={transactions} />;
      case 'INVENTORY':
        return <InventoryView inventory={inventory} setInventory={setInventory} />;
      case 'TRANSACTIONS':
        return (
          <TransactionView 
            transactions={transactions} 
            setTransactions={setTransactions} 
            inventory={inventory}
            setInventory={setInventory}
          />
        );
      case 'SHOPPING':
        return <ShoppingView shoppingList={shoppingList} setShoppingList={setShoppingList} inventory={inventory} />;
      default:
        return <DashboardView inventory={inventory} transactions={transactions} />;
    }
  };

  const navItems = [
    { id: 'DASHBOARD' as View, label: 'Home', icon: LayoutDashboard },
    { id: 'INVENTORY' as View, label: 'Stock', icon: Package },
    { id: 'TRANSACTIONS' as View, label: 'Logs', icon: ArrowLeftRight },
    { id: 'SHOPPING' as View, label: 'Shop', icon: ShoppingCart },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden shadow-xl">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md shrink-0">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-white">Ande's Inventory Pro</h1>
          <div className="flex items-center space-x-2">
            {inventory.some(item => item.stock <= item.reorderLevel) && (
              <div className="bg-yellow-400 p-1.5 rounded-full animate-pulse">
                <AlertTriangle size={16} className="text-yellow-900" />
              </div>
            )}
            <span className="text-[10px] font-bold bg-blue-500 px-2 py-1 rounded-full uppercase tracking-wider">OFFLINE</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 safe-bottom flex justify-around items-center h-16 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon size={22} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
              <span className={`text-[10px] mt-1 font-semibold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default App;
