import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, Filter, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';

export const EarningsPage: React.FC = () => {
  const { wallet, transactions } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate category totals
  const videoTotal = transactions
    .filter((t) => t.category === 'video' && t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const quizTotal = transactions
    .filter((t) => t.category === 'quiz' && t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const clickTotal = transactions
    .filter((t) => t.category === 'click' && t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const talkingStageTotal = transactions
    .filter((t) => t.category === 'talking_stage' && t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const referralTotal = transactions
    .filter((t) => t.category === 'referral' && t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTaskRewards = videoTotal + quizTotal + clickTotal + talkingStageTotal;

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesCat = filterCategory === 'all' || t.category === filterCategory;
    const matchesQuery =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-4">
      {/* Top Banner (matching screenshot layout) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Earnings history</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Every naira you've earned across all task categories on MOVA Platform.
        </p>
      </div>

      {/* 1. AVAILABLE BALANCE CARD (matching blue card in screenshot) */}
      <div className="rounded-3xl p-6 text-white shadow-xl bg-gradient-to-r from-[#0056FD] to-[#0040D0]">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-100">AVAILABLE BALANCE</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">
          ₦{wallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h2>
        <p className="text-xs text-blue-100/80 mt-1">Active verified ledger balance</p>
      </div>

      {/* 2. LIFETIME EARNINGS CARD */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">LIFETIME EARNINGS</span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          ₦{wallet.lifetimeEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <p className="text-xs text-slate-400 mt-1">Cumulative earnings across all verified activities</p>
      </div>

      {/* 3. Category Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Video Rewards</p>
          <p className="text-lg font-black text-[#0056FD] mt-0.5">₦{videoTotal.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Quiz Rewards</p>
          <p className="text-lg font-black text-[#FF6B00] mt-0.5">₦{quizTotal.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Click Rewards</p>
          <p className="text-lg font-black text-indigo-600 mt-0.5">₦{clickTotal.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Talking Stage</p>
          <p className="text-lg font-black text-rose-600 mt-0.5">₦{talkingStageTotal.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Referral Commissions</p>
          <p className="text-lg font-black text-emerald-600 mt-0.5">₦{referralTotal.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Task Rewards</p>
          <p className="text-lg font-black text-slate-900 mt-0.5">₦{totalTaskRewards.toLocaleString()}</p>
        </div>
      </div>

      {/* 4. Transactions List with Filters & Search */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-base text-slate-900">Transactions</h3>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search description or reference..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {['all', 'video', 'quiz', 'click', 'talking_stage', 'referral', 'upgrade', 'withdrawal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full capitalize font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-[#0056FD] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Transactions Table / List */}
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">No earnings recorded yet.</p>
            <p className="text-[11px] text-slate-400 mt-1">Complete video, quiz or click tasks to start building your ledger.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{tx.description}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {tx.date} • Ref: <span className="font-mono">{tx.reference}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-black text-sm ${
                      tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </span>
                  <p
                    className={`text-[10px] font-bold uppercase mt-0.5 ${
                      tx.status === 'completed'
                        ? 'text-emerald-600'
                        : tx.status === 'pending'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
