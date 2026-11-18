import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  CreditCard,
  FileText,
  DollarSign,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoanPage: React.FC = () => {
  const { currentUser, loans, submitLoanApplication, setActiveNavTab, setShowActivationModal } = useApp();

  const [amount, setAmount] = useState<number>(100000);
  const [tenure, setTenure] = useState<number>(3); // 3 months
  const [purpose, setPurpose] = useState<string>('Business working capital');
  const [employmentStatus, setEmploymentStatus] = useState<string>('Self-Employed / Digital Creator');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('180000');
  const [bvn, setBvn] = useState<string>('22233344455');
  const [nin, setNin] = useState<string>('99887766554');
  const [bankName, setBankName] = useState<string>('Access Bank');
  const [accountNumber, setAccountNumber] = useState<string>('0123456789');
  const [accountName, setAccountName] = useState<string>('OAKAKA JOHNSON');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const interestRate = 4.5; // 4.5% flat per month
  const totalInterest = Math.round(amount * (interestRate / 100) * tenure);
  const totalRepayment = amount + totalInterest;
  const monthlyRepayment = Math.round(totalRepayment / tenure);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.isPremium) {
      setShowActivationModal(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitLoanApplication({
        amount,
        tenureMonths: tenure,
        purpose,
        monthlyIncome: parseFloat(monthlyIncome) || 0,
        employmentStatus,
        bvn,
        nin,
        bankName,
        accountNumber,
        accountName,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-24 sm:pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          MOVA Digital Credit & Loans
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Access flexible digital credit up to ₦500,000 disbursed directly into your verified bank account.
        </p>
      </div>

      {/* Credit Limits Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B1736] via-[#1E293B] to-[#0A132C] p-6 sm:p-7 text-white shadow-xl border border-blue-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
              MEMBER CREDIT FACILITY
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              Up to ₦500,000
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Transparent term loan facility for active MOVA Premium members.
            </p>
          </div>
          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-xs shrink-0">
            <span className="text-slate-400 block">Eligibility Status:</span>
            <span className="font-extrabold text-amber-300">
              {currentUser?.isPremium ? 'Eligible for Independent Assessment' : 'Requires Premium Activation'}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Max Tenure</span>
            <span className="font-extrabold text-white text-sm">6 Months</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Base Interest</span>
            <span className="font-extrabold text-white text-sm">4.5% / mo</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Collateral</span>
            <span className="font-extrabold text-white text-sm">Zero Upfront</span>
          </div>
        </div>
      </div>

      {/* Application Form & Realtime Calculator */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <h3 className="font-black text-lg text-slate-900 border-b border-slate-100 pb-3">
          Apply for Digital Loan
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          {/* Requested Amount Slider & Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-800">Requested Loan Amount</label>
              <span className="font-black text-blue-600 text-base sm:text-lg">
                ₦{amount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={500000}
              step={5000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>₦10,000</span>
              <span>₦250,000</span>
              <span>₦500,000</span>
            </div>
          </div>

          {/* Tenure Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800">Repayment Period (Tenure)</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[1, 3, 6].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setTenure(m)}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                    tenure === m
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m} Month{m > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Breakdown Card */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Principal:</span>
              <span className="font-bold text-slate-900">₦{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Total Interest ({interestRate}%/mo):</span>
              <span className="font-bold text-slate-900">₦{totalInterest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Repayment:</span>
              <span className="font-bold text-slate-900">₦{totalRepayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-blue-900 font-black text-sm pt-2 border-t border-blue-200">
              <span>Estimated Monthly Repayment:</span>
              <span>₦{monthlyRepayment.toLocaleString()} / mo</span>
            </div>
          </div>

          {/* Loan Purpose */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">Loan Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>

          {/* Personal & Income Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Employment Status</label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-800"
              >
                <option value="Employed (Private Sector)">Employed (Private Sector)</option>
                <option value="Employed (Public Sector)">Employed (Public Sector)</option>
                <option value="Self-Employed / Digital Creator">Self-Employed / Digital Creator</option>
                <option value="Student / Freelancer">Student / Freelancer</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Estimated Monthly Income (₦)</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Bank Verification Number (BVN)</label>
              <input
                type="text"
                maxLength={11}
                value={bvn}
                onChange={(e) => setBvn(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">National Identity Number (NIN)</label>
              <input
                type="text"
                maxLength={11}
                value={nin}
                onChange={(e) => setNin(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white"
              />
            </div>
          </div>

          {/* Bank Disbursement Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Disbursement Bank</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Disbursement Account Number</label>
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono bg-white"
              />
            </div>
          </div>

          {/* Legal Compliance Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            *Loan Notice: Credit approval is assessed independently based on member activity and profile credentials.
            MOVA does not promise automatic approvals or zero-interest loans.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all"
          >
            {isSubmitting ? 'Evaluating Credit Profile...' : `Submit Application for ₦${amount.toLocaleString()}`}
          </button>
        </form>
      </div>

      {/* Application History */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">Your Loan History</h3>
        {loans.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            No loan applications on record.
          </div>
        ) : (
          <div className="space-y-3">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-black text-slate-900 text-sm">
                    ₦{loan.amount.toLocaleString()} ({loan.tenureMonths} Months)
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    {loan.bankName} • {loan.accountNumber} • Applied: {loan.appliedAt}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Monthly Repayment: ₦{loan.monthlyRepayment.toLocaleString()} • Total: ₦{loan.totalRepayment.toLocaleString()}
                  </p>
                  {loan.adminNotes && (
                    <p className="text-[11px] text-indigo-600 font-medium mt-1">
                      Note: {loan.adminNotes}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      loan.status === 'approved' || loan.status === 'disbursed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : loan.status === 'pending' || loan.status === 'under_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {loan.status}
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
