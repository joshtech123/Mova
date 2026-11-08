import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ActivationCard: React.FC = () => {
  const { currentUser, setActiveNavTab, platformSettings } = useApp();

  const isPremium = currentUser?.isPremium || false;

  if (isPremium) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-slate-900 p-5 sm:p-6 text-white shadow-lg border border-emerald-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">MOVA Premium Active</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase">
                  Verified
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Full task quotas unlocked • Direct ₦9,000 referral commissions active
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveNavTab('referral')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <span>View Referral Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#09152C] p-5 sm:p-6 text-white shadow-xl border border-blue-500/20">
      {/* Decorative orange & blue glows */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-10 w-40 h-40 rounded-full bg-blue-600/15 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          {/* Tag & Status */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Sparkles className="w-3 h-3 text-orange-400" />
              One-time Activation
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-300">
              Status: Unactivated
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Unlock Your MOVA Experience
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Activate MOVA Premium to access eligible earning activities and additional membership benefits.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-blue-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Watch & Earn ₦2,000/video
            </span>
            <span className="flex items-center gap-1 text-orange-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
              ₦9,000 Referral Commission
            </span>
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Instant Bank Payouts
            </span>
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
          <div className="text-left md:text-right">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
              Activation Fee
            </span>
            <span className="text-2xl font-black text-white">
              ₦{platformSettings.premiumActivationFee.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setActiveNavTab('upgrade')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Activate Premium</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
