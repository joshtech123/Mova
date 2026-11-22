import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, ArrowRight, Clock, Wallet } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NIGERIAN_BANKS } from '../data/banks';

type WalletSource = 'task' | 'referral' | 'welcome_pack';

export const WithdrawalPage: React.FC = () => {
  const { user, wallet, withdrawals, requestWithdrawal, settings, setCurrentPage, addToast } = useApp();
  const [selectedWallet, setSelectedWallet] = useState<WalletSource>('task');
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const isPremium = user?.membershipStatus === 'premium';
  const balances: Record<WalletSource, number> = {
    task: wallet.taskBalance,
    referral: wallet.referralBalance,
    welcome_pack: wallet.welcomePackBalance,
  };
  const sourceBalance = balances[selectedWallet];

  const handleWithdraw = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isPremium) {
      setShowUpgradePopup(true);
      return;
    }
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      addToast({ type: 'error', title: 'Invalid amount', message: 'Enter a valid withdrawal amount.' });
      return;
    }
    if (value > sourceBalance) {
      addToast({ type: 'error', title: 'Insufficient balance', message: 'The amount is higher than the selected wallet balance.' });
      return;
    }
    if (!bankName || !/^\d{10}$/.test(accountNumber) || !accountName.trim()) {
      addToast({ type: 'error', title: 'Bank details required', message: 'Select your bank and enter the 10-digit account number and account holder name.' });
      return;
    }
    setIsSubmitting(true);
    const result = requestWithdrawal(value, selectedWallet, bankName, accountNumber, accountName.trim());
    setIsSubmitting(false);
    if (result.success) {
      setAmount('');
      try { confetti({ particleCount: 45, spread: 55, origin: { y: 0.65 } }); } catch { /* optional effect */ }
    } else {
      addToast({ type: 'error', title: 'Withdrawal not submitted', message: result.message });
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Withdraw earnings</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Request a payout to your Nigerian bank account.</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${isPremium ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {isPremium ? 'Premium account' : 'Free account'}
          </span>
        </div>
      </section>

      {!isPremium && (
        <section className="rounded-3xl border border-orange-200 bg-orange-50 p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-sm text-orange-950">Your ₦9,100 welcome bonus is locked for withdrawals</h2>
            <p className="text-xs leading-5 text-orange-800 mt-1">Free accounts can view the welcome bonus in their wallet, but must upgrade to MOVA Premium for ₦12,000 before withdrawing it.</p>
          </div>
        </section>
      )}

      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">Request withdrawal</h2>
            <p className="text-xs text-slate-500 mt-1">Selected wallet balance: <strong className="text-slate-900">₦{sourceBalance.toLocaleString()}</strong></p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full whitespace-nowrap">Min. ₦{settings.minWithdrawal.toLocaleString()}</span>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select wallet</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {([['task', 'Task earnings', wallet.taskBalance], ['referral', 'Referral earnings', wallet.referralBalance], ['welcome_pack', 'Welcome bonus', wallet.welcomePackBalance]] as [WalletSource, string, number][]).map(([key, label, balance]) => (
                <button key={key} type="button" onClick={() => setSelectedWallet(key)} className={`p-3.5 rounded-2xl border text-left transition-all ${selectedWallet === key ? 'border-[#2457F5] bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'}`}>
                  <p className="text-[11px] text-slate-500 uppercase font-semibold">{label}</p>
                  <p className="text-base font-black text-slate-900 mt-1">₦{balance.toLocaleString()}</p>
                  {key === 'welcome_pack' && <p className="text-[10px] text-orange-700 mt-1">Free members cannot withdraw this</p>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₦)</label>
            <input type="number" required min={settings.minWithdrawal} max={sourceBalance} step="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Enter amount (min. ₦${settings.minWithdrawal.toLocaleString()})`} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#2457F5]" />
            <p className="text-[11px] text-slate-400 mt-1">The amount cannot exceed the selected wallet balance.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bank name</label>
            <select required value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#2457F5]">
              <option value="">Select your bank</option>
              {NIGERIAN_BANKS.map((bank) => <option key={`${bank.code}-${bank.name}`} value={bank.name}>{bank.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account number (10 digits)</label>
            <input type="text" inputMode="numeric" autoComplete="off" required maxLength={10} pattern="[0-9]{10}" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="0123456789" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-[#2457F5]" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account holder name</label>
            <input type="text" required maxLength={100} value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Enter the name registered to the account" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#2457F5]" />
            <p className="text-[11px] text-slate-500 mt-1">Enter the correct details. MOVA will review them before processing payment.</p>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-[#2457F5] hover:bg-blue-700 disabled:opacity-60 shadow-xs">
            {isSubmitting ? 'Submitting request...' : 'Request withdrawal'}
          </button>
          <p className="text-center text-[11px] text-slate-400">A submitted request is marked Processing. This does not mean payment has been sent.</p>
        </form>
      </section>

      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Withdrawal history</h3>
        {withdrawals.length === 0 ? <p className="text-xs text-slate-400 py-6 text-center">No withdrawal requests yet.</p> : (
          <div className="divide-y divide-slate-100">
            {withdrawals.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">₦{item.amount.toLocaleString()} to {item.bankName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.date} • {item.accountName} ({item.accountNumber}) • Ref: {item.reference}</p>
                  {item.notes && <p className="text-[10px] text-slate-500 mt-1">{item.notes}</p>}
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${item.status === 'successful' ? 'bg-emerald-100 text-emerald-800' : item.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                  {item.status === 'pending' || item.status === 'under_review' || item.status === 'processing' ? <Clock className="w-3 h-3" /> : null}
                  {item.status === 'pending' || item.status === 'under_review' || item.status === 'processing' ? 'Processing' : item.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {showUpgradePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="withdraw-upgrade-title">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><Wallet className="h-6 w-6" /></div>
            <h2 id="withdraw-upgrade-title" className="text-center text-lg font-black text-slate-900">Upgrade to withdraw</h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-600">Your ₦9,100 welcome bonus stays in your wallet, but free accounts cannot withdraw. Upgrade to MOVA Premium for ₦12,000 to unlock withdrawals.</p>
            <button onClick={() => { setShowUpgradePopup(false); setCurrentPage('upgrade'); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2457F5] px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">Upgrade to Premium <ArrowRight className="h-4 w-4" /></button>
            <button onClick={() => setShowUpgradePopup(false)} className="mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50">Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
};
