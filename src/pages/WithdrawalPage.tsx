import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NIGERIAN_BANKS, resolveMockAccountName } from '../data/banks';
import { Wallet, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Clock, Building } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WithdrawalPage: React.FC = () => {
  const { user, wallet, withdrawals, requestWithdrawal, settings, setCurrentPage, addToast } = useApp();
  const [selectedWallet, setSelectedWallet] = useState<'task' | 'referral' | 'welcome_pack'>('task');
  const [amount, setAmount] = useState<string>('');
  const [bankName, setBankName] = useState<string>('Access Bank');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [isVerifyingAccount, setIsVerifyingAccount] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Available balance for currently selected wallet
  let sourceBalance = wallet.taskBalance;
  if (selectedWallet === 'referral') sourceBalance = wallet.referralBalance;
  if (selectedWallet === 'welcome_pack') sourceBalance = wallet.welcomePackBalance;

  const handleVerifyAccount = () => {
    if (accountNumber.length !== 10) {
      addToast({
        type: 'error',
        title: 'Invalid Account Number',
        message: 'Nigerian bank account numbers must be exactly 10 digits.',
      });
      return;
    }

    setIsVerifyingAccount(true);
    setTimeout(() => {
      const resolved = resolveMockAccountName(accountNumber, bankName, user?.fullName || 'Oakaka Joshua');
      setAccountName(resolved);
      setIsVerifyingAccount(false);
      addToast({
        type: 'success',
        title: 'Account Verified via NIBSS',
        message: `Account Name: ${resolved}`,
      });
    }, 900);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      addToast({ type: 'error', title: 'Invalid Amount', message: 'Please enter a valid withdrawal amount.' });
      return;
    }

    if (!accountName) {
      addToast({ type: 'error', title: 'Verify Bank Account', message: 'Please click "Verify bank account" before submitting.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = requestWithdrawal(numAmount, selectedWallet, bankName, accountNumber, accountName);
      setIsSubmitting(false);
      if (res.success) {
        setAmount('');
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
    }, 1200);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Withdraw earnings</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cash out to any verified Nigerian bank account. Payouts processed on weekdays.
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
              user?.membershipStatus === 'premium'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {user?.membershipStatus === 'premium' ? 'Withdrawal Enabled' : 'Unactivated Member'}
          </span>
        </div>
      </div>

      {/* Unactivated Warning Alert if user is not Premium */}
      {user?.membershipStatus !== 'premium' && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="block text-sm font-bold text-amber-950">Activate your account to enable withdrawals</strong>
              <p className="text-amber-800 mt-0.5">
                MOVA Premium activation (₦12,000) is required before funds can be disbursed to external bank accounts.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('upgrade')}
            className="inline-flex items-center justify-center gap-1.5 bg-[#0056FD] hover:bg-[#0047D4] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shrink-0 shadow-xs"
          >
            <span>Activate Premium</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. REQUEST PAYOUT FORM (matching reference screenshot layout) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Request payout</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available in Selected Wallet: <strong className="text-slate-900">₦{sourceBalance.toLocaleString()}</strong>
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            Min. ₦{settings.minWithdrawal.toLocaleString()}
          </span>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4">
          {/* Select Wallet Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select wallet</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedWallet('task')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedWallet === 'task'
                    ? 'border-[#0056FD] bg-blue-50/50 text-[#0056FD] ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Task balance</p>
                <p className="text-base font-black text-slate-900 mt-0.5">₦{wallet.taskBalance.toLocaleString()}</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedWallet('referral')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedWallet === 'referral'
                    ? 'border-[#0056FD] bg-blue-50/50 text-[#0056FD] ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Referral balance</p>
                <p className="text-base font-black text-slate-900 mt-0.5">₦{wallet.referralBalance.toLocaleString()}</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedWallet('welcome_pack')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedWallet === 'welcome_pack'
                    ? 'border-[#0056FD] bg-blue-50/50 text-[#0056FD] ring-2 ring-blue-100 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <p className="text-[11px] text-slate-500 uppercase font-semibold">Welcome bonus</p>
                <p className="text-base font-black text-slate-900 mt-0.5">₦{wallet.welcomePackBalance.toLocaleString()}</p>
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₦)</label>
            <input
              type="number"
              required
              min={settings.minWithdrawal}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter amount (min. ₦${settings.minWithdrawal.toLocaleString()})`}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
            />
          </div>

          {/* Bank Name Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bank name</label>
            <select
              value={bankName}
              onChange={(e) => {
                setBankName(e.target.value);
                setAccountName('');
              }}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
            >
              {NIGERIAN_BANKS.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account number (10 digits)</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                maxLength={10}
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value.replace(/\D/g, ''));
                  setAccountName('');
                }}
                placeholder="0123456789"
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
              />
              <button
                type="button"
                onClick={handleVerifyAccount}
                disabled={accountNumber.length !== 10 || isVerifyingAccount}
                className={`px-4 py-3 rounded-2xl text-xs font-bold shrink-0 transition-colors ${
                  accountNumber.length === 10
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isVerifyingAccount ? 'Verifying...' : 'Verify bank account'}
              </button>
            </div>

            {/* Resolved Account Name Display */}
            {accountName && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Account Name: {accountName}</span>
              </div>
            )}
          </div>

          {/* Submit Withdrawal Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || user?.membershipStatus !== 'premium'}
              className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-xs transition-transform active:scale-98 ${
                user?.membershipStatus === 'premium'
                  ? 'bg-[#0056FD] hover:bg-[#0047D4]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting
                ? 'Submitting Payout Request...'
                : user?.membershipStatus === 'premium'
                ? 'Request withdrawal'
                : 'Activate your account to enable withdrawals'}
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400 leading-normal">
            Processing window: Monday through Friday, 9:00 AM - 5:00 PM WAT. 0% processing fee.
          </div>
        </form>
      </div>

      {/* 3. Withdrawal History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Payout History</h3>
        {withdrawals.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No withdrawal requests yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {withdrawals.map((w) => (
              <div key={w.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    ₦{w.amount.toLocaleString()} to {w.bankName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {w.date} • {w.accountName} ({w.accountNumber}) • Ref: {w.reference}
                  </p>
                  {w.notes && <p className="text-[10px] text-slate-500 italic mt-0.5">{w.notes}</p>}
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      w.status === 'successful' || w.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : w.status === 'pending' || w.status === 'under_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {w.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
