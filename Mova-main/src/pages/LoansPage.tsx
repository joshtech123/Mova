import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NIGERIAN_BANKS } from '../data/banks';
import { TrendingUp, ShieldCheck, CheckCircle2, AlertCircle, Clock, FileText, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoansPage: React.FC = () => {
  const { user, loans, applyForLoan, setCurrentPage, addToast } = useApp();
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [tenureMonths, setTenureMonths] = useState<number>(6);
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [employmentStatus, setEmploymentStatus] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Financial calculations
  const annualInterestRate = 0.05; // 5% flat
  const totalRepayment = Math.round(loanAmount * (1 + annualInterestRate * (tenureMonths / 12)));
  const monthlyRepayment = Math.round(totalRepayment / tenureMonths);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeNum = parseFloat(monthlyIncome);

    if (isNaN(incomeNum) || incomeNum <= 0) {
      addToast({ type: 'error', title: 'Invalid Income', message: 'Please enter a valid monthly income figure.' });
      return;
    }

    const res = applyForLoan(loanAmount, tenureMonths, bankName, accountNumber, incomeNum, employmentStatus);
    addToast({ type: res.success ? 'success' : 'error', title: res.success ? 'Application received' : 'Loan application unavailable', message: res.message });
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* 1. Header Banner */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            MEMBER CREDIT FACILITY
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
            Up to ₦500,000
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Apply for a MOVA Member Loan</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
          Access digital capital to scale your business, finance equipment, or meet personal milestones. Repay flexibly
          over 1 to 12 months.
        </p>
      </div>

      {/* Credit Disclaimer */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">Independent Credit Assessment Policy</h4>
          <p className="mt-0.5 text-amber-800 leading-normal">
            Loan approval is not automatic or guaranteed. Applications undergo independent risk analysis, employment
            verification, and MOVA Premium account standing review.
          </p>
        </div>
      </div>

      {/* 2. Interactive Loan Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-5">
        <h2 className="text-lg font-bold text-slate-900">1. Customize Loan Amount & Tenure</h2>

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-bold text-slate-600">Requested Loan Amount</span>
            <span className="text-2xl font-black text-[#0056FD]">₦{loanAmount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={20000}
            max={500000}
            step={10000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(parseInt(e.target.value, 10))}
            className="w-full accent-[#0056FD] h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
            <span>₦20,000</span>
            <span>₦250,000</span>
            <span>₦500,000 (Max)</span>
          </div>
        </div>

        {/* Tenure Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2">Repayment Period (Tenure)</label>
          <div className="grid grid-cols-4 gap-2">
            {[3, 6, 9, 12].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTenureMonths(m)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  tenureMonths === m
                    ? 'bg-[#0056FD] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {m} Months
              </button>
            ))}
          </div>
        </div>

        {/* Repayment Breakdown Table */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-[10px] text-slate-400">Monthly Repayment</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">₦{monthlyRepayment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Interest (5% p.a.)</p>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">
              ₦{(totalRepayment - loanAmount).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400">Total Repayment</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">₦{totalRepayment.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* 3. Application Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900">2. Applicant & Financial Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Employment / Business Status</label>
              <select
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              >
                <option value="Employed (Private Sector)">Employed (Private Sector)</option>
                <option value="Civil / Public Servant">Civil / Public Servant</option>
                <option value="Business Owner / Entrepreneur">Business Owner / Entrepreneur</option>
                <option value="Digital Creator / Freelancer">Digital Creator / Freelancer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Monthly Income (₦)</label>
              <input
                type="number"
                required
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="250000"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Disbursement Bank</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Number (10 digits)</label>
              <input
                type="text"
                required
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="0123456789"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>
          </div>

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
                ? 'Submitting Credit Application...'
                : user?.membershipStatus === 'premium'
                ? `Submit ₦${loanAmount.toLocaleString()} Loan Application`
                : 'Activate MOVA Premium to Apply for Loans'}
            </button>
          </div>
        </form>
      </div>

      {/* 4. Application History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Loan Application History</h3>
        {loans.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No loan applications on record.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {loans.map((loan) => (
              <div key={loan.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900">
                    ₦{loan.amount.toLocaleString()} ({loan.tenureMonths} Months)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {loan.date} • Monthly: ₦{loan.monthlyRepayment.toLocaleString()} • Ref: {loan.reference}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    loan.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : loan.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {loan.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
