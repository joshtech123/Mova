import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Settings,
  Users,
  Wallet,
  Video,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Plus,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    user,
    settings,
    adminUpdateSettings,
    adminAddVideo,
    adminAddQuiz,
    withdrawals,
    adminApproveWithdrawal,
    adminRejectWithdrawal,
    loans,
    adminApproveLoan,
    adminRejectLoan,
    resetAllData,
    videos,
    quizzes,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'settings' | 'withdrawals' | 'loans' | 'videos' | 'quizzes'>('settings');

  // Form states for settings
  const [premiumFee, setPremiumFee] = useState(settings.premiumFee);
  const [videoReward, setVideoReward] = useState(settings.videoReward);
  const [quizReward, setQuizReward] = useState(settings.quizReward);
  const [clickReward, setClickReward] = useState(settings.clickReward);
  const [directReferral, setDirectReferral] = useState(settings.directReferralCommission);
  const [minWithdrawal, setMinWithdrawal] = useState(settings.minWithdrawal);

  // New Video Form
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidDuration, setNewVidDuration] = useState(30);
  const [newVidReward, setNewVidReward] = useState(2000);
  const [newVidCategory, setNewVidCategory] = useState('Tech & Finance');
  const [newVidSponsor, setNewVidSponsor] = useState('Apex Partners');

  // New Quiz Form
  const [newQText, setNewQText] = useState('');
  const [newQOptA, setNewQOptA] = useState('');
  const [newQOptB, setNewQOptB] = useState('');
  const [newQOptC, setNewQOptC] = useState('');
  const [newQOptD, setNewQOptD] = useState('');
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQExpl, setNewQExpl] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateSettings({
      premiumFee: Number(premiumFee),
      videoReward: Number(videoReward),
      quizReward: Number(quizReward),
      clickReward: Number(clickReward),
      directReferralCommission: Number(directReferral),
      minWithdrawal: Number(minWithdrawal),
    });
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidTitle.trim()) return;

    adminAddVideo({
      title: newVidTitle,
      durationSeconds: Number(newVidDuration),
      reward: Number(newVidReward),
      category: newVidCategory,
      thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com',
      sponsor: newVidSponsor,
    });

    setNewVidTitle('');
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !newQOptA.trim() || !newQOptB.trim()) return;

    adminAddQuiz({
      question: newQText,
      options: [newQOptA, newQOptB, newQOptC || 'Option C', newQOptD || 'Option D'],
      correctIndex: Number(newQCorrect),
      reward: settings.quizReward,
      category: 'General Knowledge',
      explanation: newQExpl || 'Correctly verified answer.',
    });

    setNewQText('');
    setNewQOptA('');
    setNewQOptB('');
    setNewQOptC('');
    setNewQOptD('');
    setNewQExpl('');
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
              Live Operations
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">Platform Administration</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage dynamic reward amounts, approve withdrawals, review loan applications, and create tasks.
          </p>
        </div>

        <button
          onClick={resetAllData}
          className="inline-flex items-center gap-1.5 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-bold px-4 py-2.5 rounded-2xl transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'settings', label: 'Reward & Platform Settings', icon: Settings },
          { id: 'withdrawals', label: `Withdrawals (${withdrawals.filter((w) => w.status === 'pending').length})`, icon: Wallet },
          { id: 'loans', label: `Loan Applications (${loans.filter((l) => l.status === 'pending').length})`, icon: TrendingUp },
          { id: 'videos', label: `Video Tasks (${videos.length})`, icon: Video },
          { id: 'quizzes', label: `Quiz Pool (${quizzes.length})`, icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#0056FD] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: REWARD & PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Dynamic Financial Rules & Rewards</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update reward amounts and minimum withdrawal without changing source code.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  MOVA Premium Fee (₦)
                </label>
                <input
                  type="number"
                  value={premiumFee}
                  onChange={(e) => setPremiumFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Video Task Reward (₦)
                </label>
                <input
                  type="number"
                  value={videoReward}
                  onChange={(e) => setVideoReward(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quiz Correct Reward (₦)
                </label>
                <input
                  type="number"
                  value={quizReward}
                  onChange={(e) => setQuizReward(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Click & Earn Reward (₦)
                </label>
                <input
                  type="number"
                  value={clickReward}
                  onChange={(e) => setClickReward(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Direct Referral Commission (₦)
                </label>
                <input
                  type="number"
                  value={directReferral}
                  onChange={(e) => setDirectReferral(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Minimum Withdrawal Limit (₦)
                </label>
                <input
                  type="number"
                  value={minWithdrawal}
                  onChange={(e) => setMinWithdrawal(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 py-3 px-6 bg-[#0056FD] hover:bg-[#0047D4] text-white font-bold text-xs rounded-2xl shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Platform Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: WITHDRAWAL MANAGEMENT */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Member Withdrawal Requests</h2>
          {withdrawals.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No withdrawal requests filed yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {withdrawals.map((w) => (
                <div key={w.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">₦{w.amount.toLocaleString()}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {w.walletSource.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Bank: <strong>{w.bankName}</strong> • {w.accountName} ({w.accountNumber})
                    </p>
                    <p className="text-[10px] text-slate-400">{w.date} • Ref: {w.reference}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        w.status === 'successful'
                          ? 'bg-emerald-100 text-emerald-800'
                          : w.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {w.status}
                    </span>

                    {w.status === 'pending' && (
                      <div className="flex gap-1.5 ml-2">
                        <button
                          onClick={() => adminApproveWithdrawal(w.id)}
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Approve Payout</span>
                        </button>
                        <button
                          onClick={() => adminRejectWithdrawal(w.id)}
                          className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LOAN APPLICATIONS */}
      {activeTab === 'loans' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Member Loan Applications</h2>
          {loans.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No loan applications awaiting assessment.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {loans.map((loan) => (
                <div key={loan.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        ₦{loan.amount.toLocaleString()} ({loan.tenureMonths} Months)
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        Monthly: ₦{loan.monthlyRepayment.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Employment: {loan.employmentStatus} • Monthly Income: ₦{loan.monthlyIncome.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Disbursement Account: {loan.bankName} ({loan.accountNumber}) • Ref: {loan.reference}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        loan.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : loan.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {loan.status}
                    </span>

                    {loan.status === 'pending' && (
                      <div className="flex gap-1.5 ml-2">
                        <button
                          onClick={() => adminApproveLoan(loan.id)}
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Approve & Disburse</span>
                        </button>
                        <button
                          onClick={() => adminRejectLoan(loan.id)}
                          className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ADD VIDEO TASK */}
      {activeTab === 'videos' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Create Video Campaign</h2>
          <form onSubmit={handleCreateVideo} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Video Title</label>
              <input
                type="text"
                required
                value={newVidTitle}
                onChange={(e) => setNewVidTitle(e.target.value)}
                placeholder="e.g. High-Yield Investment Strategies for Young Africans"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Seconds)</label>
                <input
                  type="number"
                  value={newVidDuration}
                  onChange={(e) => setNewVidDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reward (₦)</label>
                <input
                  type="number"
                  value={newVidReward}
                  onChange={(e) => setNewVidReward(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sponsor Brand</label>
                <input
                  type="text"
                  value={newVidSponsor}
                  onChange={(e) => setNewVidSponsor(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 py-2.5 px-5 bg-[#0056FD] hover:bg-[#0047D4] text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Video Task</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: ADD QUIZ QUESTION */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Add New Quiz Question</h2>
          <form onSubmit={handleCreateQuiz} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Text</label>
              <input
                type="text"
                required
                value={newQText}
                onChange={(e) => setNewQText(e.target.value)}
                placeholder="e.g. Which Nigerian city is known as the Coal City?"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option A</label>
                <input
                  type="text"
                  required
                  value={newQOptA}
                  onChange={(e) => setNewQOptA(e.target.value)}
                  placeholder="Enugu"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option B</label>
                <input
                  type="text"
                  required
                  value={newQOptB}
                  onChange={(e) => setNewQOptB(e.target.value)}
                  placeholder="Calabar"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option C</label>
                <input
                  type="text"
                  value={newQOptC}
                  onChange={(e) => setNewQOptC(e.target.value)}
                  placeholder="Ibadan"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option D</label>
                <input
                  type="text"
                  value={newQOptD}
                  onChange={(e) => setNewQOptD(e.target.value)}
                  placeholder="Kano"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correct Answer</label>
                <select
                  value={newQCorrect}
                  onChange={(e) => setNewQCorrect(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD] bg-white"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Educational Explanation</label>
                <input
                  type="text"
                  value={newQExpl}
                  onChange={(e) => setNewQExpl(e.target.value)}
                  placeholder="Enugu is historically celebrated as the Coal City."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 py-2.5 px-5 bg-[#0056FD] hover:bg-[#0047D4] text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question to Quiz Pool</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
