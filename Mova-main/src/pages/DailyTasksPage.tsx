import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, CheckCircle2, Clock, UploadCloud, ExternalLink, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyMission {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: 'available' | 'submitted' | 'completed';
  link?: string;
}

export const DailyTasksPage: React.FC = () => {
  const { addToast } = useApp();
  const [missions, setMissions] = useState<DailyMission[]>([
    {
      id: 'dt-1',
      title: 'Daily App Check-In',
      description: 'Log into your MOVA dashboard and tap check-in to confirm daily activity.',
      reward: 1000,
      status: 'available',
    },
    {
      id: 'dt-2',
      title: 'Share MOVA on WhatsApp Status',
      description: 'Post the official MOVA promotional banner on your WhatsApp status for 24 hours.',
      reward: 1000,
      status: 'available',
      link: 'https://wa.me/?text=Join%20me%20on%20MOVA%20Entertainment%20and%20Rewards!',
    },
    {
      id: 'dt-3',
      title: 'Follow MOVA Official on Twitter / X',
      description: 'Follow @mova_platform and retweet our weekly announcement post.',
      reward: 1000,
      status: 'available',
      link: 'https://twitter.com',
    },
    {
      id: 'dt-4',
      title: 'Join MOVA Telegram Community Channel',
      description: 'Join the announcement channel for weekday payout confirmations and daily task alerts.',
      reward: 1000,
      status: 'available',
      link: 'https://t.me',
    },
  ]);

  const [activeTaskModal, setActiveTaskModal] = useState<DailyMission | null>(null);
  const [proofInput, setProofInput] = useState('');

  const handleClaimCheckin = (id: string) => {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'completed' } : m)));
    addToast({
      type: 'reward',
      title: '₦1,000 Check-In Bonus Credited!',
      message: 'Daily check-in verified and added to your balance.',
    });
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTaskModal || !proofInput.trim()) return;

    setMissions((prev) =>
      prev.map((m) => (m.id === activeTaskModal.id ? { ...m, status: 'submitted' } : m))
    );
    addToast({
      type: 'info',
      title: 'Proof Submitted For Verification',
      message: 'Our review team will audit your submission within 12 hours.',
    });
    setActiveTaskModal(null);
    setProofInput('');
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full">
            DAILY MISSIONS
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
            ₦1,000 Each
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Daily Tasks & Check-ins</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Complete daily brand engagement activities, submit proof, and accumulate verified task earnings.
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-3.5">
        {missions.map((m) => (
          <div
            key={m.id}
            className={`bg-white rounded-3xl p-5 border transition-all ${
              m.status === 'completed'
                ? 'border-emerald-200 bg-emerald-50/20'
                : m.status === 'submitted'
                ? 'border-amber-200 bg-amber-50/20'
                : 'border-slate-100 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    Daily
                  </span>
                  <span className="text-xs font-black text-[#0056FD]">₦{m.reward.toLocaleString()}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{m.title}</h3>
                <p className="text-xs text-slate-500 max-w-lg">{m.description}</p>
              </div>

              <div className="shrink-0">
                {m.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </span>
                ) : m.status === 'submitted' ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span>Under Review</span>
                  </span>
                ) : m.id === 'dt-1' ? (
                  <button
                    onClick={() => handleClaimCheckin(m.id)}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xs transition-transform active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Check-In Now</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTaskModal(m)}
                    className="inline-flex items-center gap-1.5 bg-[#0056FD] hover:bg-[#0047D4] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xs transition-transform active:scale-95"
                  >
                    <span>Perform Task</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proof Submission Modal */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900">{activeTaskModal.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{activeTaskModal.description}</p>

            {activeTaskModal.link && (
              <a
                href={activeTaskModal.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0056FD] bg-blue-50 px-3 py-2 rounded-xl"
              >
                <span>Open Task Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <form onSubmit={handleSubmitProof} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Submission Proof (Profile handle or Screenshot link)
                </label>
                <input
                  type="text"
                  required
                  value={proofInput}
                  onChange={(e) => setProofInput(e.target.value)}
                  placeholder="e.g. https://imgur.com/screenshot or @myusername"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTaskModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0056FD] hover:bg-[#0047D4] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Submit Proof
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
