
import React, { useState } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, Receipt, X, Save } from 'lucide-react';
import { Transaction, InventoryItem, TransactionType } from '../types';

interface TransactionViewProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
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

const TransactionView: React.FC<TransactionViewProps> = ({ transactions, setTransactions, inventory, setInventory }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    type: 'SALE',
    amount: 0,
    quantity: 1,
    description: '',
    itemId: ''
  });

  const handleLogTransaction = () => {
    if (!newTx.amount || !newTx.type) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTx.type as TransactionType,
      itemId: newTx.itemId,
      amount: Number(newTx.amount),
      quantity: Number(newTx.quantity) || 1,
      date: new Date().toISOString(),
      description: newTx.description || (newTx.type === 'SALE' ? 'Product Sale' : 'Business Expense')
    };

    if (newTx.itemId) {
      setInventory(prev => prev.map(item => {
        if (item.id === newTx.itemId) {
          const change = Number(newTx.quantity) || 1;
          return {
            ...item,
            stock: newTx.type === 'SALE' ? item.stock - change : item.stock + change
          };
        }
        return item;
      }));
    }

    setTransactions([transaction, ...transactions]);
    setIsAdding(false);
    setNewTx({ type: 'SALE', amount: 0, quantity: 1, description: '', itemId: '' });
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-900">Activity Logs</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white flex items-center px-4 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-transform"
        >
          <Plus size={16} className="mr-1" />
          Log Record
        </button>
      </div>

      <div className="space-y-3">
        {sortedTransactions.map(tx => (
          <div key={tx.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center">
            <div className={`p-2 rounded-full mr-4 ${
              tx.type === 'SALE' ? 'bg-green-100 text-green-600' : 
              tx.type === 'PURCHASE' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
            }`}>
              {tx.type === 'SALE' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
            </div>
            <div className="flex-1 text-gray-900">
              <h4 className="font-bold text-gray-800 text-xs">{tx.description}</h4>
              <p className="text-[10px] text-gray-400 font-medium">{new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-black ${tx.type === 'SALE' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'SALE' ? '+' : '-'}{formatUGX(tx.amount)}
              </p>
              {tx.quantity && tx.quantity > 0 && (
                <p className="text-[10px] text-gray-400 font-bold uppercase">Qty: {tx.quantity}</p>
              )}
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="mx-auto text-gray-200 mb-3" size={48} />
            <p className="text-gray-400 font-medium text-gray-900">No transactions logged yet</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-900">New Entry</h2>
              <button onClick={() => setIsAdding(false)} className="text-gray-400"><X /></button>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl">
              {(['SALE', 'PURCHASE', 'EXPENSE'] as TransactionType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setNewTx({ ...newTx, type, itemId: '', amount: 0, quantity: 1 })}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                    newTx.type === type ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            <div className="space-y-4">
              {newTx.type !== 'EXPENSE' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Select Item</label>
                  <select 
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl outline-none text-gray-900"
                    value={newTx.itemId}
                    onChange={e => {
                      const item = inventory.find(i => i.id === e.target.value);
                      if (item) {
                        setNewTx({
                          ...newTx, 
                          itemId: item.id, 
                          amount: newTx.type === 'SALE' ? item.price : item.costPrice,
                          description: `${newTx.type}: ${item.name}`
                        });
                      } else {
                        setNewTx({ ...newTx, itemId: '' });
                      }
                    }}
                  >
                    <option value="">Manual Entry</option>
                    {inventory.map(i => (
                      <option key={i.id} value={i.id}>{i.name} (Stock: {i.stock})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Amount (UGX)</label>
                  <input
                    type="number"
                    placeholder="UGX"
                    className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    value={newTx.amount || ''}
                    onChange={e => setNewTx({...newTx, amount: parseFloat(e.target.value)})}
                  />
                </div>
                {newTx.type !== 'EXPENSE' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Quantity</label>
                    <input
                      type="number"
                      placeholder="Qty"
                      className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                      value={newTx.quantity || ''}
                      onChange={e => setNewTx({...newTx, quantity: parseInt(e.target.value)})}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Notes</label>
                <input
                  placeholder="e.g. Sold to customer X"
                  className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  value={newTx.description}
                  onChange={e => setNewTx({...newTx, description: e.target.value})}
                />
              </div>
            </div>

            <button 
              onClick={handleLogTransaction}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center"
            >
              <Save size={20} className="mr-2" />
              Log Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionView;
