import React from 'react';
import { Wallet, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BalanceCard: React.FC = () => {
  const { currentUser, setActiveNavTab } = useApp();

  const balance = currentUser?.wallets?.availableBalance || 0;
  const isPremium = currentUser?.isPremium || false;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2545] via-[#134074] to-[#1D4ED8] p-5 sm:p-6 text-white shadow-xl shadow-blue-950/20 border border-blue-400/20">
      {/* Decorative gradient blur orbs */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-400/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-orange-500/15 blur-2xl" />

      {/* Available Balance Header */}
      <div className="relative z-10">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-200/90">
          AVAILABLE BALANCE
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <p className="mt-1 text-xs text-blue-100/80 font-medium">
          {isPremium
            ? 'Task & communication rewards verified • Ready for withdrawal'
            : 'Available balance • Activate MOVA Premium to withdraw'}
        </p>
      </div>

      {/* 3 Shortcut Action Buttons */}
      <div className="relative z-10 mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={() => setActiveNavTab('withdrawal')}
          className="group flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 py-2.5 px-3 transition-all backdrop-blur-xs border border-white/10 hover:border-white/25"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4 text-cyan-200" />
          </div>
          <span className="text-xs font-bold tracking-tight text-white">Withdraw</span>
        </button>

        <button
          onClick={() => setActiveNavTab('upgrade')}
          className="group flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-2xl bg-gradient-to-r from-amber-500/30 to-orange-500/30 hover:from-amber-500/40 hover:to-orange-500/40 active:scale-95 py-2.5 px-3 transition-all backdrop-blur-xs border border-amber-300/30 hover:border-amber-300/50"
        >
          <div className="w-8 h-8 rounded-full bg-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-xs font-bold tracking-tight text-amber-200">Upgrade</span>
        </button>

        <button
          onClick={() => setActiveNavTab('loans')}
          className="group flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 py-2.5 px-3 transition-all backdrop-blur-xs border border-white/10 hover:border-white/25"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4 text-blue-200" />
          </div>
          <span className="text-xs font-bold tracking-tight text-white">Loan</span>
        </button>
      </div>
    </div>
  );
};
