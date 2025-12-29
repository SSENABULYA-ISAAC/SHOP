
import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, X, Save, Package, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryViewProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const formatUGX = (val: number) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(val);
};

const SHOP_CATEGORIES = [
  "Bakery", "Beverages", "Grains & Flour", "Snacks & Sweets", 
  "Alcohol", "Dairy & Fats", "Household", "General"
];

const InventoryView: React.FC<InventoryViewProps> = ({ inventory, setInventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'General',
    stock: 0,
    price: 0,
    costPrice: 0,
    reorderLevel: 5
  });

  const filteredItems = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveItem = () => {
    if (!newItem.name || newItem.price === undefined || newItem.costPrice === undefined) return;
    
    if (editingItem) {
      // Update existing
      setInventory(prev => prev.map(item => 
        item.id === editingItem.id ? { ...newItem, id: item.id } as InventoryItem : item
      ));
      setEditingItem(null);
    } else {
      // Create new
      const item: InventoryItem = {
        id: Date.now().toString(),
        name: newItem.name!,
        category: newItem.category || 'General',
        stock: Number(newItem.stock) || 0,
        price: Number(newItem.price),
        costPrice: Number(newItem.costPrice),
        reorderLevel: Number(newItem.reorderLevel) || 5,
      };
      setInventory([...inventory, item]);
    }

    setIsAdding(false);
    resetForm();
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setNewItem(item);
    setIsAdding(true);
  };

  const resetForm = () => {
    setNewItem({ name: '', category: 'General', stock: 0, price: 0, costPrice: 0, reorderLevel: 5 });
    setEditingItem(null);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setInventory(prev => prev.filter(i => i.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Add */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search stock..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => { resetForm(); setIsAdding(true); }}
          className="bg-blue-600 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Item List */}
      <div className="grid gap-3">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{item.name}</h4>
              <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-tight">{item.category}</p>
              <div className="flex items-center space-x-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.stock <= item.reorderLevel ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  Stock: {item.stock}
                </span>
                <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                  {formatUGX(item.price)}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => startEdit(item)}
                className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => setItemToDelete(item.id)}
                className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {inventory.length > 0 && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-200 mb-3" size={48} />
            <p className="text-gray-400 font-medium text-gray-900">No matches found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-900">{editingItem ? 'Edit Item' : 'Add New Stock'}</h2>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 p-1"><X /></button>
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Product Name</label>
                <input
                  placeholder="e.g. Pakistan Rice, Superloaf"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-semibold"
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Category</label>
                <select 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-900 font-semibold"
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  {SHOP_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Sell Price (UGX)</label>
                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-semibold"
                      value={newItem.price || ''}
                      onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Cost Price (UGX)</label>
                    <input
                      type="number"
                      placeholder="Cost"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-semibold"
                      value={newItem.costPrice || ''}
                      onChange={e => setNewItem({...newItem, costPrice: parseFloat(e.target.value)})}
                    />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Current Stock</label>
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-semibold"
                      value={newItem.stock || ''}
                      onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})}
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Alert Level</label>
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 font-semibold"
                      value={newItem.reorderLevel || ''}
                      onChange={e => setNewItem({...newItem, reorderLevel: parseInt(e.target.value)})}
                    />
                 </div>
              </div>
            </div>

            <button 
              onClick={handleSaveItem}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center"
            >
              <Save size={20} className="mr-2" />
              {editingItem ? 'Update Item' : 'Save to Stock'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
              <p className="text-sm text-gray-500 mt-2 text-gray-900">
                Are you sure you want to remove <span className="font-bold text-gray-700">"{inventory.find(i => i.id === itemToDelete)?.name}"</span>?
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button 
                onClick={confirmDelete}
                className="w-full bg-red-600 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-transform"
              >
                Delete Item
              </button>
              <button 
                onClick={() => setItemToDelete(null)}
                className="w-full bg-gray-100 text-gray-600 font-bold py-3.5 rounded-2xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryView;
