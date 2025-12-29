
import React, { useState } from 'react';
import { ShoppingBag, Plus, CheckCircle2, Circle, Trash2, RefreshCcw } from 'lucide-react';
import { ShoppingItem, InventoryItem } from '../types';

interface ShoppingViewProps {
  shoppingList: ShoppingItem[];
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  inventory: InventoryItem[];
}

const ShoppingView: React.FC<ShoppingViewProps> = ({ shoppingList, setShoppingList, inventory }) => {
  const [itemName, setItemName] = useState('');

  const addItem = () => {
    if (!itemName.trim()) return;
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: itemName,
      quantityNeeded: 1,
      isCompleted: false
    };
    setShoppingList([...shoppingList, item]);
    setItemName('');
  };

  const toggleItem = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const deleteItem = (id: string) => {
    setShoppingList(prev => prev.filter(i => i.id !== id));
  };

  const autoGenerate = () => {
    const lowStockItems = inventory.filter(item => item.stock <= item.reorderLevel);
    const newItems = lowStockItems
      .filter(lsi => !shoppingList.some(si => si.name.toLowerCase() === lsi.name.toLowerCase()))
      .map(lsi => ({
        id: `auto-${lsi.id}-${Date.now()}`,
        name: lsi.name,
        quantityNeeded: Math.max(lsi.reorderLevel * 2 - lsi.stock, 5),
        isCompleted: false
      }));
    
    if (newItems.length > 0) {
      setShoppingList([...shoppingList, ...newItems]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Procurement List</h2>
        <button 
          onClick={autoGenerate}
          className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-xl active:bg-blue-100 transition-colors"
        >
          <RefreshCcw size={14} className="mr-1.5" />
          Auto-Suggest
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Add manual item..."
          className="w-full pl-4 pr-14 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-gray-900"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
        />
        <button 
          onClick={addItem}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-lg"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {shoppingList.map(item => (
          <div 
            key={item.id} 
            className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center transition-all ${item.isCompleted ? 'opacity-50' : ''}`}
          >
            <button onClick={() => toggleItem(item.id)} className="mr-4 text-blue-600">
              {item.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} className="text-gray-300" />}
            </button>
            <div className="flex-1 text-gray-900">
              <h4 className={`font-bold text-gray-800 ${item.isCompleted ? 'line-through' : ''}`}>{item.name}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Qty Needed: {item.quantityNeeded}</p>
            </div>
            <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {shoppingList.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto text-gray-200 mb-3" size={48} />
            <p className="text-gray-400 font-medium text-gray-900">Your shopping list is empty</p>
          </div>
        )}
      </div>

      {shoppingList.some(i => i.isCompleted) && (
        <button 
          onClick={() => setShoppingList(prev => prev.filter(i => !i.isCompleted))}
          className="w-full py-3 text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-100 rounded-xl active:bg-gray-200 transition-colors"
        >
          Clear Completed
        </button>
      )}
    </div>
  );
};

export default ShoppingView;
