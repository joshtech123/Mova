import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building,
  ArrowRight,
  Copy,
  Clock,
  Check,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UpgradePage: React.FC = () => {
  const { user, activatePremium, settings, transactions, addToast } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [transferRef, setTransferRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const upgradeTransactions = transactions.filter((t) => t.category === 'upgrade');

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('8123456789');
    setCopiedAccount(true);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: 'MOVA dedicated account number copied.',
    });
    setTimeout(() => setCopiedAccount(false), 2500);
  };

  const handlePay = async () => {
    setIsProcessing(true);
    const methodLabel = paymentMethod === 'card' ? 'Online Card / Instant Checkout' : `Bank Transfer Ref: ${transferRef || 'AUTO-TRANSFER'}`;

    // Simulate realistic payment processing
    setTimeout(async () => {
      await activatePremium(methodLabel);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }, 1800);
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

      {/* 2. Single MOVA Premium Card (Distinct from 3SFE's 4 packages) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900">MOVA PREMIUM</h2>
              <span className="text-xs bg-orange-100 text-orange-800 font-extrabold px-3 py-0.5 rounded-full">
                Lifetime Access
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
            <h3 className="font-bold text-sm text-slate-900">Select Secure Payment Channel:</h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#0056FD] bg-blue-50/50 text-[#0056FD] ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <div>
                  <p className="text-xs font-bold leading-tight">Card / Bank App</p>
                  <p className="text-[10px] text-slate-400">Instant Verification</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'transfer'
                    ? 'border-[#0056FD] bg-blue-50/50 text-[#0056FD] ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <Building className="w-5 h-5" />
                <div>
                  <p className="text-xs font-bold leading-tight">Bank Transfer</p>
                  <p className="text-[10px] text-slate-400">Dedicated Account</p>
                </div>
              </button>
            </div>

            {/* Bank Transfer Instructions */}
            {paymentMethod === 'transfer' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <p className="text-slate-600 font-medium">
                  Transfer <strong>₦12,000</strong> to the MOVA dedicated account below:
                </p>

                <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Moniepoint Microfinance Bank</span>
                    <p className="text-base font-black text-slate-900 tracking-wider">8123456789</p>
                    <p className="text-[11px] text-slate-500">Account Name: MOVA DIGITAL PLATFORM</p>
                  </div>
                  <button
                    onClick={handleCopyAccount}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 font-bold text-xs"
                  >
                    {copiedAccount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Your Bank Transfer Session ID / Narration
                  </label>
                  <input
                    type="text"
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    placeholder="e.g. TRF-98234-OAKAKA"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                  />
                </div>
              </div>
            )}

            {/* Activate Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className={`w-full py-4 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98 ${
                isProcessing
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-[#0056FD] hover:bg-[#0047D4] shadow-blue-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-300" />
              <span>
                {isProcessing
                  ? 'Verifying Payment Gateway...'
                  : `Activate MOVA Premium (₦${settings.premiumFee.toLocaleString()})`}
              </span>
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Payments are verified securely via PCI-DSS compliant channels. No recurring surprise charges.
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
