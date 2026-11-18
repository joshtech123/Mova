import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake, CheckCircle2, Clock, Sparkles, ShieldCheck, ArrowRight, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TalkingStagePage: React.FC = () => {
  const { user, talkingStages, claimTalkingStageReward, settings, setCurrentPage, addToast } = useApp();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = (id: string) => {
    setVerifyingId(id);
    setTimeout(() => {
      claimTalkingStageReward(id);
      setVerifyingId(null);
      try {
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 1500);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* 1. Header Banner */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full">
            MILESTONE REWARDS
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
            ₦5,000 Milestone
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Talking Stage Verification</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Reach genuine conversation milestones with MOVA community members. When you sustain a 3-day streak and 20+
          verified messages, submit for anti-fraud review to unlock your ₦5,000 milestone bonus.
        </p>
      </div>

      {/* Safety & Anti-Fraud Notice */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold">Anti-Fraud & Consent Policy</h4>
          <p className="mt-0.5 text-amber-800 leading-normal">
            Automated bots, repetitive spam messages, and fake accounts are blocked. Both participants must mutually
            interact over distinct days. Verified claims are audited before final ledger credit.
          </p>
        </div>
      </div>

      {/* Active Talking Stages List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Your Active Conversations</h2>

        {talkingStages.map((stage) => {
          const progressPercent = Math.min(100, (stage.messagesCount / stage.requiredMessages) * 100);
          const isReady = stage.status === 'ready_for_verification';
          const isClaimed = stage.status === 'claimed';

          return (
            <div
              key={stage.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                isClaimed
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isReady
                  ? 'border-orange-300 shadow-md ring-2 ring-orange-100'
                  : 'border-slate-100 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Participant Details */}
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={stage.user.avatar}
                      alt={stage.user.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                    <span className="absolute -bottom-1 -right-1 text-base">{stage.user.countryFlag}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{stage.user.name}</h3>
                    <p className="text-xs text-slate-400">@{stage.user.username} • {stage.user.country}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        {stage.daysStreak}/{stage.requiredDays} Day Streak
                      </span>
                      <span className="text-[11px] text-slate-400">Last active: {stage.lastActive}</span>
                    </div>
                  </div>
                </div>

                {/* Reward & Status Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">₦{stage.rewardAmount.toLocaleString()}</span>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Reward</p>
                  </div>

                  {isClaimed ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reward Claimed</span>
                    </span>
                  ) : isReady ? (
                    <button
                      onClick={() => handleVerify(stage.id)}
                      disabled={verifyingId === stage.id}
                      className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{verifyingId === stage.id ? 'Verifying...' : 'Verify & Claim ₦5,000'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentPage('chat')}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-2xl transition-colors"
                    >
                      <span>Continue Chatting</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Tracker Bar */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-600">
                    Dialogue Progress ({stage.messagesCount}/{stage.requiredMessages} mutual messages)
                  </span>
                  <span className="font-bold text-[#0056FD]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0056FD] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
