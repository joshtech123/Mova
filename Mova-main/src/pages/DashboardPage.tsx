import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  Sparkles,
  TrendingUp,
  Video,
  HelpCircle,
  MousePointerClick,
  HeartHandshake,
  Gamepad2,
  CheckSquare,
  ArrowRight,
  Play,
  Send,
  History,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    wallet,
    transactions,
    videos,
    quizzes,
    clickTasks,
    setCurrentPage,
    activatePremium,
    settings,
  } = useApp();

  const [showActivationModal, setShowActivationModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const completedVideos = videos.filter((v) => v.isCompleted).length;
  const completedClicks = clickTasks.filter((c) => c.isCompleted).length;
  const totalTasksCompleted = completedVideos + completedClicks;

  // Today's total earned from recent transactions today
  const todayEarned = transactions
    .filter((t) => t.type === 'credit' && t.date.includes(new Date().toLocaleDateString('en-US', { month: 'short' })))
    .reduce((acc, t) => acc + t.amount, 0);

  const handleQuickActivate = async () => {
    setIsActivating(true);
    await activatePremium('Direct Simulation');
    setIsActivating(false);
    setShowActivationModal(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-4 sm:space-y-5">
      {/* 1. BLUE GRADIENT BALANCE CARD (matching reference screenshot) */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl bg-gradient-to-br from-[#0062FF] via-[#0052EA] to-[#0038B8]">
        {/* Subtle decorative glow circle */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100/90">
              AVAILABLE BALANCE
            </span>
            <span className="text-[11px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-full text-white backdrop-blur-xs">
              {user?.membershipStatus === 'premium' ? 'Verified Member' : 'Standard Member'}
            </span>
          </div>

          <div className="mt-2 mb-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ₦{wallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-blue-100/80 mt-1">
              {user?.membershipStatus === 'premium'
                ? 'All verified task rewards & commissions ready for payout'
                : 'Task earnings accumulate immediately — activate Premium for instant withdrawals'}
            </p>
          </div>

          {/* Three Shortcut Buttons: Withdraw, Upgrade, Loan */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-6 pt-4 border-t border-white/15">
            <button
              onClick={() => setCurrentPage('withdrawal')}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs transition-all active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              <span>Withdraw</span>
            </button>

            <button
              onClick={() => setCurrentPage('upgrade')}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-orange-300" />
              <span>Upgrade</span>
            </button>

            <button
              onClick={() => setCurrentPage('loans')}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs transition-all active:scale-95"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Loan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PREMIUM ACTIVATION CARD (Deep Navy, matching reference layout) */}
      {user?.membershipStatus !== 'premium' ? (
        <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              Account not activated
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Unlock Your MOVA Experience
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Activate MOVA Premium to access eligible earning activities and additional membership benefits.
          </p>

          {/* Single MOVA Premium Fee Card */}
          <div className="mt-5 p-4 rounded-2xl bg-[#0F223D] border border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">MOVA PREMIUM</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                  Official Tier
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">₦{settings.premiumFee.toLocaleString()}</span>
                <span className="text-xs text-slate-400">one-time activation fee</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Full earning access • Nigerian bank withdrawals • Loan eligibility
              </p>
            </div>

            <button
              onClick={() => setCurrentPage('upgrade')}
              className="inline-flex items-center justify-center gap-2 bg-[#0056FD] hover:bg-[#0047D4] text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/30 transition-transform active:scale-95 shrink-0"
            >
              <span>Activate my account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">MOVA Premium Active</h4>
              <p className="text-xs text-emerald-300/80">
                You have full access to high-reward tasks, instant withdrawals, and member loans.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full shrink-0">
            Active
          </span>
        </div>
      )}

      {/* 3. THREE STATISTICS CARDS (Total Tasks, Referral Balance, Total Earned) */}
      <div className="grid grid-cols-3 gap-3">
        {/* Total Tasks */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">TASKS</span>
            <CheckSquare className="w-4 h-4 text-[#0056FD]" />
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-2xl font-black text-slate-900">{totalTasksCompleted}</div>
            <p className="text-[10px] text-slate-400">completed</p>
          </div>
        </div>

        {/* Referral Balance */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">REFERRAL</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              ₦{wallet.referralBalance.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400">balance</p>
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">TOTAL EARNED</span>
            <Sparkles className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="mt-2">
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              ₦{wallet.lifetimeEarnings.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400">lifetime</p>
          </div>
        </div>
      </div>

      {/* 4. ACTIVITY SHORTCUT CARDS (Watch Videos, Answer Quiz, Click and Earn, Global Chat, Talking Stage) */}
      <div className="space-y-3">
        {/* Watch Videos Card */}
        <div
          onClick={() => setCurrentPage('watch-videos')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0056FD] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Watch videos</h3>
              <p className="text-xs text-slate-500">₦2,000 per verified video</p>
              <div className="flex items-center gap-1 text-xs font-bold text-[#0056FD] mt-1">
                <span>Start earning</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-[#0056FD] px-3 py-1.5 rounded-full">
            {completedVideos}/{videos.length} Done
          </span>
        </div>

        {/* Answer Quiz Card */}
        <div
          onClick={() => setCurrentPage('quiz')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Answer quiz</h3>
              <p className="text-xs text-slate-500">₦1,000 per correct answer</p>
              <div className="flex items-center gap-1 text-xs font-bold text-[#0056FD] mt-1">
                <span>Start earning</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          <span className="text-xs font-bold bg-orange-50 text-[#FF6B00] px-3 py-1.5 rounded-full">
            Daily Quiz
          </span>
        </div>

        {/* Click and Earn Card */}
        <div
          onClick={() => setCurrentPage('click-and-earn')}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Click and earn</h3>
              <p className="text-xs text-slate-500">₦1,000 per sponsored task</p>
              <div className="flex items-center gap-1 text-xs font-bold text-[#0056FD] mt-1">
                <span>Start earning</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full">
            {completedClicks}/{clickTasks.length} Done
          </span>
        </div>

        {/* Global Chat & Talking Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setCurrentPage('chat')}
            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Global Chat</h4>
                <p className="text-xs text-slate-500">₦2,000 daily reward</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div
            onClick={() => setCurrentPage('talking-stage')}
            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs hover:border-rose-200 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Talking Stage</h4>
                <p className="text-xs text-slate-500">₦5,000 milestone</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>

      {/* 5. TODAY'S EARNINGS SUMMARY CARD (matching screenshot layout) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Today's earnings</h3>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              user?.membershipStatus === 'premium'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {user?.membershipStatus === 'premium' ? 'Premium member' : 'Unactivated user'}
          </span>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-950">₦{todayEarned.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-semibold">/ ₦{settings.maxDailyEarningsLimit.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Remaining today: ₦{Math.max(0, settings.maxDailyEarningsLimit - todayEarned).toLocaleString()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#0056FD] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (todayEarned / settings.maxDailyEarningsLimit) * 100)}%` }}
          />
        </div>

        {/* Activity Limits Breakdown */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium">Click & Earn</p>
            <p className="text-xs font-bold text-slate-800">₦{clickTasks.length * settings.clickReward}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium">Watch & Earn</p>
            <p className="text-xs font-bold text-slate-800">₦{videos.length * settings.videoReward}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium">Questions</p>
            <p className="text-xs font-bold text-slate-800">₦{quizzes.length * settings.quizReward}</p>
          </div>
        </div>
      </div>

      {/* 6. TUTORIAL VIDEO SHORTCUT CARD */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Tutorial video</h3>
          <p className="text-xs text-slate-500 mt-0.5">Register, activate, perform tasks and withdraw.</p>
        </div>
        <button
          onClick={() => setCurrentPage('tutorial')}
          className="inline-flex items-center justify-center gap-2 bg-[#0056FD] hover:bg-[#0047D4] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xs transition-transform active:scale-95 shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Watch Now</span>
        </button>
      </div>

      {/* 7. QUICK ACTION ROWS (Withdraw, Apply for loan, Earnings history, Community) */}
      <div className="space-y-2.5">
        <button
          onClick={() => setCurrentPage('withdrawal')}
          className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-xs hover:bg-slate-50 transition-colors text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0056FD] flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Withdraw earnings</h4>
              <p className="text-xs text-slate-500">Cash out to any Nigerian bank account on weekdays (no weekend payouts).</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentPage('loans')}
          className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-xs hover:bg-slate-50 transition-colors text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0056FD] flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Apply for a loan</h4>
              <p className="text-xs text-slate-500">Activated members can borrow up to ₦500,000 — no collateral, pay back in 365 days.</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setCurrentPage('earnings')}
          className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-xs hover:bg-slate-50 transition-colors text-left flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0056FD] flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Earnings history</h4>
              <p className="text-xs text-slate-500">See every naira you have earned across all task categories.</p>
            </div>
          </div>
        </button>

        <div className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Join the Community</h4>
              <p className="text-xs text-slate-500">Get weekly payout updates, tips and announcements in our community.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
            Live
          </span>
        </div>
      </div>

      {/* 8. RECENT ACTIVITY SECTION */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Recent activity</h3>
        {transactions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-slate-500">No activity yet — complete your first task to see it here.</p>
            <div className="mt-3 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage('watch-videos')}
                className="text-xs font-bold text-[#0056FD] bg-blue-50 px-3.5 py-1.5 rounded-full hover:bg-blue-100"
              >
                Watch a Video (₦2k)
              </button>
              <button
                onClick={() => setCurrentPage('quiz')}
                className="text-xs font-bold text-[#FF6B00] bg-orange-50 px-3.5 py-1.5 rounded-full hover:bg-orange-100"
              >
                Answer Quiz (₦1k)
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{tx.description}</p>
                  <p className="text-[10px] text-slate-400">{tx.date} • Ref: {tx.reference}</p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-extrabold ${
                      tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </span>
                  <p className="text-[9px] uppercase font-bold text-slate-400">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Call for Activation Modal (matches prompt requirement 4) */}
      {showActivationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setShowActivationModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0056FD] text-xs font-bold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Announcement</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              CALL FOR ACTIVATION
            </h3>

            <div className="my-4 text-xs text-slate-600 space-y-2 text-left bg-slate-50 p-4 rounded-2xl">
              <p>🎉 Welcome to MOVA! Your account is ready for action.</p>
              <p>
                ⚡ Activate MOVA Premium (₦12,000) to access unrestricted withdrawals straight to your Nigerian bank.
              </p>
              <p>👉 One-time activation unlocks video rewards, quiz rewards, and referral bonuses.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowActivationModal(false);
                  setCurrentPage('upgrade');
                }}
                className="flex-1 bg-[#0056FD] hover:bg-[#0047D4] text-white font-bold py-3 rounded-2xl text-xs transition-transform active:scale-95"
              >
                Upgrade Page
              </button>
              <button
                onClick={handleQuickActivate}
                disabled={isActivating}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs transition-transform active:scale-95"
              >
                {isActivating ? 'Activating...' : 'Quick Demo Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
