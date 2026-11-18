import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UpgradePage: React.FC = () => {
  const { user, settings, transactions, addToast } = useApp();
  const [transferRef, setTransferRef] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  const upgradeTransactions = transactions.filter((t) => t.category === 'upgrade');

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('3004611364');
    setCopiedAccount(true);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: 'MOVA account number copied.',
    });
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handlePay = async () => {
    if (!transferRef.trim()) {
      addToast({ type: 'error', title: 'Transfer reference required', message: 'Enter the transaction reference shown on your bank receipt.' });
      return;
    }
    const telegramUsername = (import.meta.env.VITE_PAYMENT_SUPPORT_TELEGRAM || '').replace(/^@/, '').trim();
    if (!telegramUsername) {
      addToast({ type: 'error', title: 'Payment support is not configured', message: 'The MOVA owner must add the payment confirmer Telegram username in Vercel before members can submit proof.' });
      return;
    }
    const message = [
      'Hello MOVA Payment Team, I have made my Premium payment.',
      `Name: ${user?.fullName || 'Not available'}`,
      `Email: ${user?.email || 'Not available'}`,
      `Amount: ₦${settings.premiumFee.toLocaleString()}`,
      `Transfer reference: ${transferRef.trim()}`,
      'Please confirm the payment. I will attach my transfer receipt here.'
    ].join('\\n');
    const telegramUrl = `https://t.me/${telegramUsername}?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    addToast({ type: 'info', title: 'Continue in Telegram', message: 'Send the prefilled message and attach your transfer receipt. Premium stays pending until payment is confirmed.' });
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">
            MEMBERSHIP UPGRADE
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
            Single Transparent Tier
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Activate MOVA Premium</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
          Upgrade your account with a single, one-time payment of ₦12,000 to unlock high-yield tasks, verified Nigerian
          bank cashouts, and member credit eligibility.
        </p>

        {/* Current status pill */}
        <div className="mt-4 inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs">
          <span className="text-slate-400">Current Status:</span>
          <span
            className={`font-bold ${
              user?.membershipStatus === 'premium' ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {user?.membershipStatus === 'premium' ? 'MOVA Premium Active' : 'Unactivated Standard Member'}
          </span>
        </div>
      </div>

      {/* MOVA Premium membership card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900">MOVA PREMIUM</h2>
              <span className="text-xs bg-orange-100 text-orange-800 font-extrabold px-3 py-0.5 rounded-full">
                One-time upgrade
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">One-time activation fee. No recurring monthly deductions.</p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-3xl sm:text-4xl font-black text-[#0056FD]">
              ₦{settings.premiumFee.toLocaleString()}
            </span>
            <p className="text-xs text-slate-400 font-semibold">Single One-Time Fee</p>
          </div>
        </div>

        {/* Membership Benefits List */}
        <div className="py-6 space-y-3.5">
          <h3 className="font-bold text-sm text-slate-900">Membership Benefits Included:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-slate-900 block">Access to eligible earning activities</strong>
                <span className="text-slate-500">Video watching (₦2,000), quiz (₦1,000), clicks (₦1,000)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-slate-900 block">Eligible withdrawal access</strong>
                <span className="text-slate-500">Unrestricted cashouts to all verified Nigerian banks</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-slate-900 block">Loan application eligibility</strong>
                <span className="text-slate-500">Access to member loan requests up to ₦500,000</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-slate-900 block">Direct Referral Commission (₦9,000)</strong>
                <span className="text-slate-500">Earn ₦9,000 directly whenever an invited friend upgrades</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        {user?.membershipStatus !== 'premium' ? (
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Official bank transfer</h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <p className="text-slate-600 font-medium">Transfer <strong>₦{settings.premiumFee.toLocaleString()}</strong> to the official MOVA account:</p>
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-3">
                <div><span className="text-[10px] uppercase font-bold text-slate-400">Account name</span><p className="text-sm font-black text-slate-900">MOVA DIGITAL HUB</p></div>
                <div><span className="text-[10px] uppercase font-bold text-slate-400">Account number</span><p className="text-base font-black text-slate-900 tracking-wider">3004611364</p></div>
                <div><span className="text-[10px] uppercase font-bold text-slate-400">Bank</span><p className="text-sm font-black text-slate-900">KUDA MICROFINANCE BANK</p></div>
                <button type="button" onClick={handleCopyAccount} className="w-full p-3 rounded-xl bg-[#0056FD] hover:bg-[#0047D4] text-white flex items-center justify-center gap-2 font-bold text-xs">
                  {copiedAccount ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedAccount ? 'Copied' : 'Copy account number'}
                </button>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Transfer reference</label>
                <input type="text" value={transferRef} onChange={(e) => setTransferRef(e.target.value)} placeholder="Enter your bank transfer reference" className="w-full px-3 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]" />
              </div>
              <p className="text-[11px] text-slate-500">Keep your receipt. Submitting a reference does not activate Premium. The payment must be confirmed by MOVA administration.</p>
            </div>

            {/* Continue to Telegram payment verification */}
            <button
              onClick={handlePay}
              disabled={false}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 bg-[#0056FD] hover:bg-[#0047D4] shadow-blue-500/30" 
            >
              <Sparkles className="w-4 h-4 text-orange-300" />
              <span>Continue to Telegram and submit proof</span>
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Telegram will open with your payment details. Attach your receipt in the chat. MOVA Premium is activated only after the receiving account is checked.
            </p>
          </div>
        ) : (
          <div className="pt-6 border-t border-slate-100 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
            <h4 className="font-bold text-emerald-900 text-sm">You are an Active MOVA Premium Member</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              Your account has full unrestricted access to high-reward tasks and weekday Nigerian bank payouts.
            </p>
          </div>
        )}
      </div>

      {/* 3. Activation History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Activation & Payment History</h3>
        {upgradeTransactions.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">No previous activation records found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {upgradeTransactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{tx.description}</p>
                  <p className="text-[10px] text-slate-400">{tx.date} • Reference: {tx.reference}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-slate-900">₦{tx.amount.toLocaleString()}</span>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
