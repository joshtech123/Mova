import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ClickTask } from '../types/index';
import {
  MousePointerClick,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClickAndEarnPage: React.FC = () => {
  const { user, clickTasks, completeClickTask, settings, transactions } = useApp();
  const [activeTask, setActiveTask] = useState<ClickTask | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [verified, setVerified] = useState<boolean>(false);

  const clickTransactions = transactions.filter((t) => t.category === 'click');
  const todayEarned = clickTransactions.reduce((acc, t) => acc + t.amount, 0);
  const completedCount = clickTasks.filter((t) => t.isCompleted).length;
  const targetClicks = clickTasks.length;
  const dailyTarget = targetClicks * settings.clickReward;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTask && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setVerified(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTask, timer]);

  const handleOpenTask = (task: ClickTask) => {
    setActiveTask(task);
    setTimer(task.minStaySeconds);
    setVerified(false);
  };

  const handleClaim = () => {
    if (!activeTask || !verified) return;
    completeClickTask(activeTask.id);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    setActiveTask(null);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* 1. Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Click and earn
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore verified partner campaigns, articles, and services to receive reward credits.
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
              user?.membershipStatus === 'premium'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {user?.membershipStatus === 'premium' ? 'Premium member' : 'Unactivated user'}
          </span>
        </div>

        {/* Today's earnings card */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Today's earnings
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-slate-900">₦{todayEarned.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-semibold">/ ₦{dailyTarget.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tasks completed
              </span>
              <p className="text-sm font-bold text-slate-700">
                {completedCount}/{targetClicks}
              </p>
            </div>
          </div>

          <div className="mt-3 w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0056FD] h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyTarget > 0 ? (todayEarned / dailyTarget) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Navy Banner: "CLICK & EARN - Tap links, earn naira" */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
          SPONSORED LINKS
        </span>
        <h2 className="text-2xl font-extrabold text-white mt-1">Tap links, earn naira</h2>
        <p className="text-xs text-slate-300 mt-1">
          Engagement is verified via active read time to ensure genuine user participation.
        </p>
      </div>

      {/* 3. Sponsored Tasks List */}
      <div className="space-y-3.5">
        {clickTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-3xl p-5 border transition-all ${
              task.isCompleted
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-slate-100 hover:border-blue-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {task.category}
                  </span>
                  <span className="text-xs text-slate-400">Sponsor: {task.sponsor}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{task.title}</h3>
                <p className="text-xs text-slate-500 max-w-xl">{task.description}</p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                <span className="text-base font-extrabold text-[#0056FD]">
                  ₦{task.reward.toLocaleString()}
                </span>

                {task.isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenTask(task)}
                    className="inline-flex items-center gap-1.5 bg-[#0056FD] hover:bg-[#0047D4] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xs transition-transform active:scale-95"
                  >
                    <span>Open & Verify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Link Verification Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setActiveTask(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-blue-50 text-[#0056FD] rounded-2xl flex items-center justify-center mb-4">
              <MousePointerClick className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0056FD] bg-blue-50 px-2 py-0.5 rounded-md">
              {activeTask.category} • {activeTask.sponsor}
            </span>

            <h3 className="text-lg font-bold text-slate-900 mt-2">{activeTask.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{activeTask.description}</p>

            {/* Campaign simulated frame / action */}
            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <a
                href={activeTask.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0056FD] hover:underline"
              >
                <span>Visit Sponsored Destination ({activeTask.url})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-slate-400 mt-1">
                Reading time verification active: Please allow timer to complete.
              </p>
            </div>

            {/* Timer countdown bar */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>Stay Time Verification</span>
                </div>
                <span>{verified ? 'Verified!' : `${timer}s remaining`}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0056FD] h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${((activeTask.minStaySeconds - timer) / activeTask.minStaySeconds) * 100}%`,
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleClaim}
              disabled={!verified}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all ${
                verified
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-98 animate-pulse'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {verified
                  ? `Claim ₦${activeTask.reward.toLocaleString()} Reward`
                  : `Verifying Activity (${timer}s)...`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
