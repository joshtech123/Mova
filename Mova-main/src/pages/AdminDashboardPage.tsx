import React, { useState } from 'react';
import {
  Shield,
  Users,
  Wallet,
  Settings,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  PlaySquare,
  HelpCircle,
  MousePointerClick,
  HeartHandshake,
  DollarSign,
  Plus,
  Trash2,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const {
    currentUser,
    users,
    withdrawals,
    loans,
    premiumPayments,
    talkingStages,
    videos,
    quizzes,
    clickTasks,
    platformSettings,
    platformStats,
    adminApprovePremium,
    adminRejectPremium,
    adminToggleUserPremium,
    adminUpdateWithdrawalStatus,
    adminUpdateLoanStatus,
    adminVerifyTalkingStage,
    adminUpdateSettings,
    adminAddVideo,
    adminDeleteVideo,
    adminAddQuizQuestion,
    adminDeleteQuizQuestion,
    adminAddClickTask,
    adminDeleteClickTask,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'financials' | 'users' | 'withdrawals' | 'loans' | 'premiums' | 'talking_stages' | 'rewards_config' | 'tasks_mgmt'
  >('financials');

  // Local state for editing platform reward settings
  const [videoReward, setVideoReward] = useState(platformSettings.videoRewardAmount);
  const [quizReward, setQuizReward] = useState(platformSettings.quizRewardAmount);
  const [clickReward, setClickReward] = useState(platformSettings.clickRewardAmount);
  const [talkingReward, setTalkingReward] = useState(platformSettings.talkingStageRewardAmount);
  const [chatReward, setChatReward] = useState(platformSettings.chatDailyRewardAmount);
  const [minWd, setMinWd] = useState(platformSettings.minWithdrawalAmount);
  const [directRefComm, setDirectRefComm] = useState(platformSettings.directReferralCommission);
  const [premiumFee, setPremiumFee] = useState(platformSettings.premiumActivationFee);

  // New task creation states
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState(30);

  const [newQuizQuestion, setNewQuizQuestion] = useState('');
  const [newQuizOptA, setNewQuizOptA] = useState('');
  const [newQuizOptB, setNewQuizOptB] = useState('');
  const [newQuizOptC, setNewQuizOptC] = useState('');
  const [newQuizOptD, setNewQuizOptD] = useState('');
  const [newQuizCorrect, setNewQuizCorrect] = useState(0);

  const [newClickTitle, setNewClickTitle] = useState('');
  const [newClickSponsor, setNewClickSponsor] = useState('');
  const [newClickUrl, setNewClickUrl] = useState('');

  const handleSaveRewardSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateSettings({
      videoRewardAmount: Number(videoReward),
      quizRewardAmount: Number(quizReward),
      clickRewardAmount: Number(clickReward),
      talkingStageRewardAmount: Number(talkingReward),
      chatDailyRewardAmount: Number(chatReward),
      minWithdrawalAmount: Number(minWd),
      directReferralCommission: Number(directRefComm),
      premiumActivationFee: Number(premiumFee),
    });
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle) return;
    adminAddVideo({
      title: newVideoTitle,
      category: 'Featured Media',
      durationSeconds: Number(newVideoDuration),
      rewardAmount: platformSettings.videoRewardAmount,
      thumbnail:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      videoUrl: newVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      publisher: 'MOVA Media Sponsor',
      views: 0,
      isAvailable: true,
    });
    setNewVideoTitle('');
    setNewVideoUrl('');
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizQuestion || !newQuizOptA) return;
    adminAddQuizQuestion({
      question: newQuizQuestion,
      options: [newQuizOptA, newQuizOptB, newQuizOptC, newQuizOptD],
      correctIndex: Number(newQuizCorrect),
      explanation: 'Verified official answer from MOVA editorial board.',
      rewardAmount: platformSettings.quizRewardAmount,
      category: 'General Knowledge',
    });
    setNewQuizQuestion('');
    setNewQuizOptA('');
    setNewQuizOptB('');
    setNewQuizOptC('');
    setNewQuizOptD('');
  };

  const handleCreateClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClickTitle) return;
    adminAddClickTask({
      title: newClickTitle,
      description: 'Visit sponsored brand partner and inspect for 15 seconds.',
      sponsor: newClickSponsor || 'MOVA Partner',
      targetUrl: newClickUrl || 'https://example.com',
      requiredWaitSeconds: 15,
      rewardAmount: platformSettings.clickRewardAmount,
      category: 'Brand Partner',
      isAvailable: true,
    });
    setNewClickTitle('');
    setNewClickSponsor('');
    setNewClickUrl('');
  };

  return (
    <div className="space-y-6 pb-24 sm:pb-12 max-w-6xl mx-auto">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080E21] p-6 rounded-3xl text-white shadow-xl border border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 text-purple-300 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">MOVA Admin Control Center</h2>
              <span className="text-[10px] font-extrabold uppercase bg-purple-500 text-white px-2 py-0.5 rounded-full">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-0.5">
              Live moderation, financial reserve liabilities, configurable rewards & task management.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right text-xs">
          <span className="text-slate-400 block">Logged in as:</span>
          <span className="font-bold text-white">{currentUser?.fullName}</span>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
        {[
          { id: 'financials', label: 'Financial Reserve & Liabilities' },
          { id: 'rewards_config', label: 'Reward Amounts Configuration' },
          { id: 'withdrawals', label: `Withdrawal Requests (${withdrawals.filter((w) => w.status === 'pending').length})` },
          { id: 'premiums', label: `Premium Payments (${premiumPayments.filter((p) => p.status === 'pending').length})` },
          { id: 'talking_stages', label: `Talking Stages (${talkingStages.filter((t) => t.milestoneStatus === 'under_review').length})` },
          { id: 'loans', label: `Loans (${loans.filter((l) => l.status === 'pending').length})` },
          { id: 'users', label: `User Management (${users.length})` },
          { id: 'tasks_mgmt', label: 'Tasks & Quizzes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: FINANCIALS & RESERVES */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Premium Revenue
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₦{platformStats.totalPlatformRevenue.toLocaleString()}
              </div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 block">
                {platformStats.totalPremiumMembers} Activated Members
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Paid Out Payouts
              </span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                ₦{platformStats.totalPaidOut.toLocaleString()}
              </div>
              <span className="text-xs text-slate-500 font-semibold mt-1 block">
                Successful Bank Transfers
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Payout Liabilities
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">
                ₦{platformStats.pendingWithdrawalsLiability.toLocaleString()}
              </div>
              <span className="text-xs text-amber-700 font-semibold mt-1 block">
                Queued in withdrawal queue
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Unclaimed Task Liabilities
              </span>
              <div className="text-2xl font-black text-purple-600 mt-1">
                ₦{platformStats.unclaimedTaskLiabilities.toLocaleString()}
              </div>
              <span className="text-xs text-slate-500 font-semibold mt-1 block">
                Balances held in user wallets
              </span>
            </div>
          </div>

          {/* Reserve Health Check Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">
              Platform Liquidity & Liability Audit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              In accordance with MOVA financial regulations, task liabilities are tracked independently from platform
              revenue. Payouts must never exceed verified campaign sponsorship reserves.
            </p>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Reserve Ratio Healthy (Current Coverage: 185%)</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800">Audit Status: Compliant</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REWARD CONFIGURATION (Admin can update rewards without editing code!) */}
      {activeTab === 'rewards_config' && (
        <form onSubmit={handleSaveRewardSettings} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-black text-base text-slate-900">
                Reward Amounts & Financial Settings
              </h3>
              <p className="text-slate-500 text-xs">
                Update reward amounts and minimum withdrawal limits dynamically.
              </p>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs self-start sm:self-auto"
            >
              Save Configuration
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Video Watch Reward (₦)</label>
              <input
                type="number"
                value={videoReward}
                onChange={(e) => setVideoReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Quiz Question Reward (₦)</label>
              <input
                type="number"
                value={quizReward}
                onChange={(e) => setQuizReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Click & Earn Task Reward (₦)</label>
              <input
                type="number"
                value={clickReward}
                onChange={(e) => setClickReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Talking Stage Milestone (₦)</label>
              <input
                type="number"
                value={talkingReward}
                onChange={(e) => setTalkingReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Daily Global Chat Reward (₦)</label>
              <input
                type="number"
                value={chatReward}
                onChange={(e) => setChatReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Minimum Withdrawal Amount (₦)</label>
              <input
                type="number"
                value={minWd}
                onChange={(e) => setMinWd(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Direct Referral Commission (₦)</label>
              <input
                type="number"
                value={directRefComm}
                onChange={(e) => setDirectRefComm(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Premium Activation Fee (₦)</label>
              <input
                type="number"
                value={premiumFee}
                onChange={(e) => setPremiumFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: WITHDRAWAL MANAGEMENT */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-black text-base text-slate-900">Member Withdrawal Payout Requests</h3>

          {withdrawals.length === 0 ? (
            <div className="py-8 text-center text-slate-400">No withdrawal requests queued.</div>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-slate-900">
                        ₦{w.amount.toLocaleString()} ({w.walletType} wallet)
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                        {w.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      Member: <strong>{w.userName}</strong> • {w.bankName} • Account: {w.accountNumber} ({w.accountName})
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Requested: {w.createdAt} • Net Payout: ₦{w.netPayout.toLocaleString()} • Ref: {w.reference}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {w.status === 'pending' && (
                      <>
                        <button
                          onClick={() => adminUpdateWithdrawalStatus(w.id, 'processing')}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                        >
                          Mark Processing
                        </button>
                        <button
                          onClick={() => adminUpdateWithdrawalStatus(w.id, 'successful')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                        >
                          Mark Successful
                        </button>
                        <button
                          onClick={() =>
                            adminUpdateWithdrawalStatus(w.id, 'rejected', 'Incorrect bank account details.')
                          }
                          className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
                        >
                          Reject & Refund
                        </button>
                      </>
                    )}
                    {w.status === 'processing' && (
                      <button
                        onClick={() => adminUpdateWithdrawalStatus(w.id, 'successful')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                      >
                        Confirm Bank Transfer Disbursed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PREMIUM PAYMENT PROOFS */}
      {activeTab === 'premiums' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-black text-base text-slate-900">
            Premium Membership Proof Submissions (₦12,000)
          </h3>

          {premiumPayments.length === 0 ? (
            <div className="py-8 text-center text-slate-400">No pending payment proofs.</div>
          ) : (
            <div className="space-y-3">
              {premiumPayments.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <span className="font-bold text-sm text-slate-900">
                      {p.userName} ({p.userEmail})
                    </span>
                    <p className="text-slate-600 mt-0.5">
                      Amount: <strong>₦{p.amount.toLocaleString()}</strong> • Method: {p.method} • Ref: {p.reference}
                    </p>
                    {p.proofNote && <p className="text-xs text-slate-500 italic mt-1">Proof: {p.proofNote}</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {p.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => adminApprovePremium(p.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                        >
                          Approve & Activate
                        </button>
                        <button
                          onClick={() => adminRejectPremium(p.id)}
                          className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                        {p.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: TALKING STAGE VERIFICATION */}
      {activeTab === 'talking_stages' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-black text-base text-slate-900">Talking Stage Milestones (₦5,000)</h3>

          <div className="space-y-3">
            {talkingStages.map((stage) => (
              <div
                key={stage.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Partner: {stage.partnerName} (@{stage.partnerUsername})
                  </h4>
                  <p className="text-slate-500 mt-0.5">
                    {stage.daysActive} Days Active • {stage.messagesCount} Messages • {stage.proofStory}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {stage.milestoneStatus === 'under_review' || stage.milestoneStatus === 'active' ? (
                    <>
                      <button
                        onClick={() => adminVerifyTalkingStage(stage.id, true)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                      >
                        Approve (₦5,000)
                      </button>
                      <button
                        onClick={() => adminVerifyTalkingStage(stage.id, false)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                      {stage.milestoneStatus}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LOANS */}
      {activeTab === 'loans' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-black text-base text-slate-900">Digital Loan Applications</h3>

          <div className="space-y-3">
            {loans.map((loan) => (
              <div
                key={loan.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <span className="font-black text-sm text-slate-900">
                    ₦{loan.amount.toLocaleString()} ({loan.tenureMonths} Months) - {loan.userName}
                  </span>
                  <p className="text-slate-600 mt-0.5">
                    Purpose: {loan.purpose} • Income: ₦{loan.monthlyIncome.toLocaleString()} • BVN: {loan.bvn}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Disbursement: {loan.bankName} • {loan.accountNumber} ({loan.accountName})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {loan.status === 'pending' && (
                    <>
                      <button
                        onClick={() => adminUpdateLoanStatus(loan.id, 'approved', 4.5, 'Credit approved')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                      >
                        Approve Credit
                      </button>
                      <button
                        onClick={() => adminUpdateLoanStatus(loan.id, 'disbursed', 4.5, 'Disbursed to bank')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                      >
                        Disburse Funds
                      </button>
                      <button
                        onClick={() => adminUpdateLoanStatus(loan.id, 'rejected', 0, 'Does not meet minimum requirements')}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {loan.status === 'approved' && (
                    <button
                      onClick={() => adminUpdateLoanStatus(loan.id, 'disbursed', 4.5, 'Disbursed')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                    >
                      Disburse Payout
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-black text-base text-slate-900">Registered Members</h3>

          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 font-bold flex items-center justify-center text-slate-700">
                    {u.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{u.fullName}</span>
                      <span className="text-slate-400">(@{u.username})</span>
                      {u.isPremium ? (
                        <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          PREMIUM
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          UNACTIVATED
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {u.email} • {u.phone} • Balance: <strong>₦{u.wallets.availableBalance.toLocaleString()}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adminToggleUserPremium(u.id)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold"
                  >
                    {u.isPremium ? 'Revoke Premium' : 'Activate Premium'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: TASKS & CONTENT MANAGEMENT */}
      {activeTab === 'tasks_mgmt' && (
        <div className="space-y-6">
          {/* Add Video Form */}
          <form onSubmit={handleCreateVideo} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h4 className="font-black text-sm text-slate-900">Add New Video Task</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Video Title"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                required
                className="px-3.5 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="text"
                placeholder="Video URL (MP4 / WebM)"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="number"
                placeholder="Duration (Seconds, e.g. 30)"
                value={newVideoDuration}
                onChange={(e) => setNewVideoDuration(Number(e.target.value))}
                className="px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Add Video (₦{platformSettings.videoRewardAmount} Reward)
            </button>
          </form>

          {/* Add Quiz Form */}
          <form onSubmit={handleCreateQuiz} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h4 className="font-black text-sm text-slate-900">Add New Quiz Question</h4>
            <input
              type="text"
              placeholder="Question Prompt"
              value={newQuizQuestion}
              onChange={(e) => setNewQuizQuestion(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                placeholder="Option A"
                value={newQuizOptA}
                onChange={(e) => setNewQuizOptA(e.target.value)}
                required
                className="px-3 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="text"
                placeholder="Option B"
                value={newQuizOptB}
                onChange={(e) => setNewQuizOptB(e.target.value)}
                required
                className="px-3 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="text"
                placeholder="Option C"
                value={newQuizOptC}
                onChange={(e) => setNewQuizOptC(e.target.value)}
                required
                className="px-3 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="text"
                placeholder="Option D"
                value={newQuizOptD}
                onChange={(e) => setNewQuizOptD(e.target.value)}
                required
                className="px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Correct Option:</span>
              <select
                value={newQuizCorrect}
                onChange={(e) => setNewQuizCorrect(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Add Quiz Question (₦{platformSettings.quizRewardAmount} Reward)
            </button>
          </form>

          {/* Add Click Task Form */}
          <form onSubmit={handleCreateClick} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h4 className="font-black text-sm text-slate-900">Add Sponsored Click Task</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Task Title (e.g. Follow X)"
                value={newClickTitle}
                onChange={(e) => setNewClickTitle(e.target.value)}
                required
                className="px-3.5 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="text"
                placeholder="Sponsor Brand"
                value={newClickSponsor}
                onChange={(e) => setNewClickSponsor(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300"
              />
              <input
                type="text"
                placeholder="Target URL"
                value={newClickUrl}
                onChange={(e) => setNewClickUrl(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              Add Click Task (₦{platformSettings.clickRewardAmount} Reward)
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
