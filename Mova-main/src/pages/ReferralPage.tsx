import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Copy, Check, TrendingUp, Sparkles, Award, ArrowRight, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReferralPage: React.FC = () => {
  const { user, wallet, referrals, simulateReferralSale, settings, addToast } = useApp();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://mova.app/register?ref=${user?.referralCode || 'MOVA-OAKAKA'}`;

  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter((r) => r.status === 'active').length;
  const directReferrals = referrals.filter((r) => r.tier === 1).length;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    addToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Your personal referral link is copied to your clipboard.',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulate = (tier: 1 | 2 | 3) => {
    const demoNames = ['Babatunde Olatunji', 'Chidera Nwosu', 'Zainab Mohammed', 'Olumide Bakare', 'Folashade Adeleke'];
    const chosenName = demoNames[Math.floor(Math.random() * demoNames.length)];
    simulateReferralSale(chosenName, tier);
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* 1. Header Banner */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            AFFILIATE & PARTNERSHIP
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
            ₦9,000 Direct Commission
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">MOVA Referral Program</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
          Invite friends and partners to join MOVA. Earn guaranteed commissions across 3 tiers when your referrals
          activate their MOVA Premium membership.
        </p>
      </div>

      {/* 2. Referral Link Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Your Personal Referral Link</h3>
          <span className="text-xs font-mono font-bold text-[#0056FD] bg-blue-50 px-2.5 py-0.5 rounded-full">
            Code: {user?.referralCode || 'MOVA-OAKAKA'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-700 truncate font-mono">
            {referralLink}
          </div>
          <button
            onClick={handleCopyLink}
            className="shrink-0 bg-[#0056FD] hover:bg-[#0047D4] text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* 3. Statistics Cards (Total, Active, Qualified, Referral Balance) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Referrals</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalReferrals}</p>
          <p className="text-[10px] text-slate-400">all registered</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Referrals</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeReferrals}</p>
          <p className="text-[10px] text-slate-400">verified</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Direct Sales</span>
          <p className="text-2xl font-black text-[#0056FD] mt-1">{directReferrals}</p>
          <p className="text-[10px] text-slate-400">Tier 1 members</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Referral Balance</span>
          <p className="text-2xl font-black text-[#FF6B00] mt-1">
            ₦{wallet.referralBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400">withdrawable</p>
        </div>
      </div>

      {/* 4. Commission Structure Display */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Approved Commission Breakdown:</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0056FD]">Tier 1 (Direct)</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₦{settings.directReferralCommission.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Direct sales commission for each friend you invite</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tier 2 (Indirect)</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₦{settings.firstIndirectCommission.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">First indirect sale when your referral invites someone</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tier 3 (Indirect)</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₦{settings.secondIndirectCommission.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-600 mt-1">Second indirect sale bonus credited to your wallet</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Welcome Pack: ₦10,000</span>
            <p className="mt-0.5 text-amber-800">
              Subject to approved activity eligibility and verification conditions. All commissions are funded from
              genuine partner transactions.
            </p>
          </div>
        </div>

        {/* Live Simulator for Review & Testing */}
        <div className="pt-2">
          <p className="text-xs font-bold text-slate-700 mb-2">Simulate Referral Sale (Testing Sandbox):</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSimulate(1)}
              className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#0056FD] border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Tier 1 (+₦9,000)</span>
            </button>
            <button
              onClick={() => handleSimulate(2)}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <span>Simulate Tier 2 (+₦300)</span>
            </button>
            <button
              onClick={() => handleSimulate(3)}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <span>Simulate Tier 3 (+₦100)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Referral History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Referral Commission History</h3>
        {referrals.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No referral activations recorded yet. Share your personal link to begin earning.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {referrals.map((ref) => (
              <div key={ref.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">
                    T{ref.tier}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{ref.fullName}</p>
                    <p className="text-[10px] text-slate-400">@{ref.username} • {ref.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-emerald-600">+₦{ref.commission.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{ref.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
