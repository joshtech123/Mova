import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';
import {
  Video,
  HelpCircle,
  MousePointerClick,
  MessageCircle,
  HeartHandshake,
  Gamepad2,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Globe2,
  Zap,
  Users,
  Award,
  Moon,
  Sun,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('mova-theme') === 'dark');
  React.useEffect(() => { document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light'); }, [darkMode]);
  const toggleTheme = () => { const next = !darkMode; setDarkMode(next); localStorage.setItem('mova-theme', next ? 'dark' : 'light'); };

  const faqs = [
    {
      q: 'What is MOVA and how does it work?',
      a: 'MOVA is an integrated digital platform connecting people globally through entertainment, communication, and verified digital task opportunities. Members participate in watching sponsored videos, answering educational quizzes, exploring partner links, chatting globally, and accessing premium member benefits.',
    },
    {
      q: 'What is MOVA Premium?',
      a: 'MOVA Premium is an optional membership upgrade that unlocks additional platform features, including eligible earning activities, referrals, Global Communication, Talking Stage and access to loan applications. Loan approval is subject to eligibility and assessment.',
    },
    {
      q: 'How much can I earn per task on MOVA?',
      a: 'Verified video tasks reward ₦2,000 each upon completion of the viewing duration; correct daily quiz answers reward ₦1,000 each; verified click and daily tasks reward ₦1,000; qualifying daily global chats reward ₦2,000; and verified talking stage milestones reward ₦5,000. Earnings depend on available funded partner campaigns and daily task limits.',
    },
    {
      q: 'How do withdrawals work?',
      a: 'Activated members can request cashouts directly to any commercial or microfinance bank in Nigeria (e.g., GTBank, Access Bank, OPay, Moniepoint, Kuda). Payouts are verified and processed on weekdays with zero hidden fees.',
    },
    {
      q: 'How does the MOVA Referral Program work?',
      a: 'When you invite friends who activate MOVA Premium, you earn the current direct referral commission, plus ₦300 on first indirect activations and ₦100 on second indirect activations. All commissions are credited immediately upon verified partner registration.',
    },
    {
      q: 'Are loans guaranteed for everyone?',
      a: 'No. Loan opportunities of up to ₦500,000 are available exclusively to active MOVA Premium members and are subject to independent creditworthiness assessment. We never promise automatic or unconditional approvals.',
    },
  ];

  return (
    <div className="mova-landing min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Logo size="md" showTagline={true} />

          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={toggleTheme} aria-label="Toggle colour theme" title="Toggle light and dark mode" className="mova-theme-button w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center hover:-translate-y-0.5 transition-all">{darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
            <button
              onClick={() => setCurrentPage('login')}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0056FD] px-3 sm:px-4 py-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentPage('register')}
              className="bg-[#0056FD] hover:bg-[#0047D4] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-full shadow-md shadow-blue-500/20 transition-transform active:scale-95"
            >
              Register Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mova-hero relative overflow-hidden pt-14 pb-20 lg:pt-24 lg:pb-28">
        <div className="mova-orb mova-orb-blue" aria-hidden="true" />
        <div className="mova-orb mova-orb-orange" aria-hidden="true" />
        <div className="mova-hero-grid" aria-hidden="true" />
        <div className="mova-hero-texture" aria-hidden="true" />
        <div className="mova-hero-orbit mova-hero-orbit-one" aria-hidden="true" />
        <div className="mova-hero-orbit mova-hero-orbit-two" aria-hidden="true" />
        <div className="mova-hero-shimmer" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="mova-hero-content text-center max-w-3xl mx-auto">
            <div className="mova-eyebrow inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0056FD] text-xs font-bold mb-6">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>The Next Generation Digital Community</span>
            </div>

            <h1 className="mova-hero-title text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
              Connect Globally. <br />
              <span className="text-[#0056FD]">Enjoy More.</span>{' '}
              <span className="text-[#FF6B00]">Get Rewarded.</span>
            </h1>

            <p className="mova-hero-copy mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover a world of communication, entertainment and digital opportunities with MOVA. Connect with
              people, watch short videos, complete activities and explore more ways to participate and earn.
            </p>

            <div className="mova-hero-actions mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage('register')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0056FD] hover:bg-[#0047D4] text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>

            {/* Quick Stat Badges */}
            <div className="mova-stat-grid mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                <p className="text-xs text-slate-500">Video Reward</p>
                <p className="text-lg font-extrabold text-[#0056FD]">₦2,000</p>
                <p className="text-[10px] text-slate-400">per verified video</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                <p className="text-xs text-slate-500">Quiz Reward</p>
                <p className="text-lg font-extrabold text-[#FF6B00]">₦1,000</p>
                <p className="text-[10px] text-slate-400">per correct answer</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                <p className="text-xs text-slate-500">Talking Stage</p>
                <p className="text-lg font-extrabold text-slate-900">₦5,000</p>
                <p className="text-[10px] text-slate-400">verified milestone</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs">
                <p className="text-xs text-slate-500">Referrals</p>
                <p className="text-lg font-extrabold text-emerald-600">Rewards</p>
                <p className="text-[10px] text-slate-400">on eligible referrals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction to MOVA Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">Inside MOVA</span>
              <h2 className="text-3xl font-extrabold text-slate-950 mt-2">
                A Unified Hub for Entertainment, Connection & Verified Earnings
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                MOVA bridges entertainment, social interaction, and digital micro-opportunities. Unlike ad-heavy
                platforms, MOVA partners with verified sponsors, creators, and media publishers to deliver funded,
                transparent reward opportunities.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">Zero Fake Figures:</strong> Every balance is backed by
                    completed activities and real sponsor funding.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">Direct Nigerian Bank Payouts:</strong> Withdraw your earned
                    funds straight to any bank or digital account.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900">Interactive Global Community:</strong> Discover friends across
                    Africa, Europe, and the Americas with live messaging.
                  </p>
                </div>
              </div>
            </div>

            {/* MOVA introduction artwork */}
            <div className="rounded-3xl overflow-hidden border border-slate-200/70 shadow-xl bg-[#071044]">
              <img
                src="/assets/mova/about-mova.png"
                alt="Introducing the MOVA platform and its key features"
                className="block w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            {/* Feature Card Preview */}
            <div className="hidden bg-[#0B192C] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0056FD]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-300">Live Earning Engine</span>
                  </div>
                  <span className="text-xs text-orange-400 font-bold">MOVA Premium</span>
                </div>

                <div className="mt-6 bg-gradient-to-r from-[#0056FD] to-[#003EB5] p-5 rounded-2xl">
                  <span className="text-xs text-blue-100 uppercase tracking-wider font-semibold">Available Balance</span>
                  <div className="text-3xl font-extrabold mt-1">₦0.00</div>
                  <p className="text-[11px] text-blue-100/80 mt-1">Verified balance ready for payout or reinvestment</p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl">
                    <p className="text-slate-400 text-[10px]">Watch Video</p>
                    <p className="font-bold text-white text-sm">₦2,000</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl">
                    <p className="text-slate-400 text-[10px]">Answer Quiz</p>
                    <p className="font-bold text-orange-400 text-sm">₦1,000</p>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl">
                    <p className="text-slate-400 text-[10px]">Daily Chat</p>
                    <p className="font-bold text-emerald-400 text-sm">₦2,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Activities Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0056FD]">Explore Features</span>
            <h2 className="text-3xl font-extrabold text-slate-950 mt-1">Activities That Pay You Real Rewards</h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Choose from diverse daily activities designed for learning, fun, and connection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Watch Videos */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0056FD] flex items-center justify-center mb-4">
                <Video className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Watch Videos</h3>
                <span className="text-xs font-bold bg-blue-100 text-[#0056FD] px-2.5 py-1 rounded-full">₦2,000</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Watch curated educational clips, sponsor showcases, and creator spotlights. Complete the duration timer
                to verify completion.
              </p>
            </div>

            {/* Card 2: Quiz & Earn */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Answer Quiz</h3>
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">₦1,000</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Sharpen your trivia knowledge with daily questions on Nigerian geography, culture, finance, and sports.
                Correct answers receive instant reward.
              </p>
            </div>

            {/* Card 3: Click and Earn */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Click & Earn</h3>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">₦1,000</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Discover verified sponsor articles, newsletters, and partner announcements. Stay on page for the
                required timer and claim your reward.
              </p>
            </div>

            {/* Card 4: Global Chat */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Global Communication</h3>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">₦2,000</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Connect directly with members across the globe. Search by country, send instant messages, and earn daily
                rewards for authentic interaction.
              </p>
            </div>

            {/* Card 5: Talking Stage */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Talking Stage</h3>
                <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full">₦5,000</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Build meaningful conversation streaks and reach verified dialogue milestones with community partners to
                unlock milestone payouts.
              </p>
            </div>

            {/* Card 6: Games & Entertainment */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Games & Contests</h3>
                <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">Daily</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Play reflex tap games, memory puzzles, and lucky wheels to compete on leaderboards and win extra bonus
                prizes.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <img src="/assets/mova/mova-rewards.png" alt="MOVA rewards and qualifying chat milestones" className="w-full h-auto rounded-3xl border border-slate-200 shadow-lg" loading="lazy" />
            <img src="/assets/mova/mova-global-chat.png" alt="Chat, connect and earn on MOVA" className="w-full h-auto rounded-3xl border border-slate-200 shadow-lg" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Premium Membership & Loan Section */}
      <section className="py-16 bg-[#0B192C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Premium Card */}
            <div className="bg-[#0F2038] border border-[#1E3A5F] rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              <img src="/assets/mova/mova-premium.png" alt="MOVA Premium membership benefits" className="w-full h-auto rounded-2xl mb-6" loading="lazy" />
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Single Transparent Tier</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">MOVA Premium</h3>
                <p className="text-slate-300 mt-2 text-sm">
                  One-time activation gives you unlimited access to funded earning tasks and priority weekday bank
                  withdrawals.
                </p>

                <div className="mt-6 space-y-2.5 text-sm text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Access to eligible earning activities</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Eligible withdrawal access to Nigerian banks</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Zero collateral loan application eligibility</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Referral rewards on qualifying verified activations</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('upgrade')}
                className="mt-8 w-full bg-[#0056FD] hover:bg-[#0047D4] text-white font-bold py-3.5 rounded-2xl shadow-lg transition-transform active:scale-95 text-center text-sm"
              >
                Explore Premium
              </button>
            </div>

            {/* Loan Card */}
            <div className="bg-[#0F2038] border border-[#1E3A5F] rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
              <img src="/assets/mova/mova-loans.png" alt="MOVA loan programme information" className="w-full h-auto rounded-2xl mb-6" loading="lazy" />
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Financial Opportunities</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Member Loan Program</h3>
                <p className="text-slate-300 mt-2 text-sm">
                  Eligible activated members can request loans up to ₦500,000 to finance digital ventures or personal
                  needs.
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-emerald-400">Up to ₦500,000</span>
                </div>

                <div className="mt-6 space-y-2.5 text-sm text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Flexible tenure from 1 to 12 months</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Independent credit & identity assessment</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Transparent terms, no hidden penalties</span>
                  </div>
                </div>

                <p className="mt-4 text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-800 pt-3">
                  * Loans are subject to independent creditworthiness checks and verification. MOVA does not offer
                  unconditional or guaranteed loans.
                </p>
              </div>

              <button
                onClick={() => setCurrentPage('register')}
                className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-2xl border border-slate-700 transition-colors text-center text-sm"
              >
                Learn More About Loans
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How MOVA Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0056FD]">Simple Steps</span>
            <h2 className="text-3xl font-extrabold text-slate-950 mt-1">How MOVA Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-[#0056FD] text-white font-extrabold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Register Free</h3>
              <p className="text-xs text-slate-600 mt-2">
                Create your MOVA profile with your name, email, phone number, and unique referral code.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-[#FF6B00] text-white font-extrabold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Activate Premium</h3>
              <p className="text-xs text-slate-600 mt-2">
                Choose the Premium membership upgrade and follow the secure payment instructions on the upgrade page.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Complete Tasks</h3>
              <p className="text-xs text-slate-600 mt-2">
                Watch videos, answer quizzes, complete daily tasks, chat globally, and invite friends.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base">Request Cashout</h3>
              <p className="text-xs text-slate-600 mt-2">
                Withdraw your verified earnings directly to any Nigerian commercial or fintech bank account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0056FD]">Got Questions?</span>
            <h2 className="text-3xl font-extrabold text-slate-950 mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#0056FD]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#0B192C] text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <Logo size="md" variant="white" showTagline={true} />
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
                            <button onClick={() => setCurrentPage('upgrade')} className="hover:text-white">
                Premium
              </button>
              <button onClick={() => setCurrentPage('tutorial')} className="hover:text-white">
                Tutorials
              </button>
              <button onClick={() => setCurrentPage('login')} className="hover:text-white">
                Sign In
              </button>
              <button onClick={() => setCurrentPage('register')} className="hover:text-white">
                Register
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} MOVA Platform. All rights reserved. Entertainment. Rewards. More.</p>
            <p className="text-[11px] max-w-md text-center sm:text-right">
              Disclaimer: Earning opportunities are conditional based on available campaign funding, verified completion,
              and membership status. MOVA promotes transparent, verified digital engagement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
