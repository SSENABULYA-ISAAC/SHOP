
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Coins, Package, Info, Smartphone, X } from 'lucide-react';
import { InventoryItem, Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardViewProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
}

const formatUGX = (val: number) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(val);
};

const DashboardView: React.FC<DashboardViewProps> = ({ inventory, transactions }) => {
  const [showGuide, setShowGuide] = useState(false);

  const totalSales = transactions
    .filter(t => t.type === 'SALE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE' || t.type === 'PURCHASE')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalSales - totalExpenses;
  
  const lowStockCount = inventory.filter(i => i.stock <= i.reorderLevel).length;

  const chartData = transactions.slice(-10).map(t => ({
    name: new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    amount: t.amount,
    type: t.type
  }));

  return (
    <div className="space-y-6">
      {/* Install Guide Banner */}
      {!showGuide && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-2xl shadow-lg flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <Smartphone size={24} className="text-blue-200" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Mobile Tip</p>
              <p className="text-sm font-semibold">Use this like a real app!</p>
            </div>
          </div>
          <button 
            onClick={() => setShowGuide(true)}
            className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            How to Install
          </button>
        </div>
      )}

      {showGuide && (
        <div className="bg-white p-5 rounded-2xl border-2 border-blue-100 shadow-sm relative animate-in fade-in zoom-in duration-300">
          <button onClick={() => setShowGuide(false)} className="absolute top-3 right-3 text-gray-400"><X size={18} /></button>
          <h3 className="font-bold text-gray-900 flex items-center mb-3">
            <Info size={18} className="mr-2 text-blue-600" />
            Get the App Icon
          </h3>
          <ul className="text-xs space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center font-bold mr-2 shrink-0">1</span>
              <span>Open this link in <b>Chrome</b> (Android) or <b>Safari</b> (iPhone).</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center font-bold mr-2 shrink-0">2</span>
              <span>Tap the browser menu (3 dots or share icon <span className="inline-block bg-gray-100 px-1 rounded">↑</span>).</span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center font-bold mr-2 shrink-0">3</span>
              <span>Select <b>"Add to Home Screen"</b>.</span>
            </li>
          </ul>
          <p className="mt-4 text-[10px] text-gray-400 italic">Now you can use it anytime without internet!</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center text-green-600 mb-2">
            <TrendingUp size={20} className="mr-2" />
            <span className="text-[10px] font-bold uppercase">Total Sales</span>
          </div>
          <p className="text-lg font-extrabold text-gray-900">{formatUGX(totalSales)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center text-red-600 mb-2">
            <TrendingDown size={20} className="mr-2" />
            <span className="text-[10px] font-bold uppercase">Expenses</span>
          </div>
          <p className="text-lg font-extrabold text-gray-900">{formatUGX(totalExpenses)}</p>
        </div>
      </div>

      <div className={`p-4 rounded-2xl shadow-sm border ${profit >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
        <div className="flex justify-between items-center mb-1 text-gray-900">
          <span className="text-[10px] font-bold uppercase text-gray-500">Net Balance</span>
          <Coins size={16} className={profit >= 0 ? 'text-blue-600' : 'text-orange-600'} />
        </div>
        <p className={`text-2xl font-black ${profit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
          {formatUGX(profit)}
        </p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center">
            <Package size={18} className="mr-2 text-blue-500" />
            Stock Health
          </h3>
          <span className="text-xs font-semibold text-gray-400">{inventory.length} Items</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <span className="text-sm font-medium text-gray-600">Low Stock Alert</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${lowStockCount > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {lowStockCount} Items
          </span>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: number) => [formatUGX(value), 'Amount']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'SALE' ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
