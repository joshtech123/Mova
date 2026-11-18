import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VideoTask } from '../types';
import { Video, Clock, CheckCircle2, Play, Sparkles, AlertCircle, X, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WatchVideosPage: React.FC = () => {
  const { user, videos, completeVideoTask, settings, transactions } = useApp();
  const [activeVideo, setActiveVideo] = useState<VideoTask | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Today's video earnings
  const videoTransactions = transactions.filter((t) => t.category === 'video');
  const todayEarned = videoTransactions.reduce((acc, t) => acc + t.amount, 0);
  const completedCount = videos.filter((v) => v.isCompleted).length;
  const targetVideos = videos.length;
  const dailyTargetReward = targetVideos * settings.videoReward;
  const remainingReward = Math.max(0, dailyTargetReward - todayEarned);

  // Handle video modal timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeVideo && isPlaying && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanClaim(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeVideo, isPlaying, countdown]);

  const handleStartWatch = (video: VideoTask) => {
    setActiveVideo(video);
    setCountdown(video.durationSeconds);
    setCanClaim(false);
    setIsPlaying(true);
  };

  const handleClaim = () => {
    if (!activeVideo || !canClaim) return;
    completeVideoTask(activeVideo.id);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti not supported
    }
    setActiveVideo(null);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* 1. Header (matching screenshot structure) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Watch videos and earn
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Watch eligible videos and complete the required viewing time to receive your reward.
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
              user?.membershipStatus === 'premium'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {user?.membershipStatus === 'premium' ? 'Premium active' : 'Unactivated user'}
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
                <span className="text-xs text-slate-400 font-semibold">/ ₦{dailyTargetReward.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Remaining reward
              </span>
              <p className="text-sm font-bold text-slate-700">₦{remainingReward.toLocaleString()}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0056FD] h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyTargetReward > 0 ? (todayEarned / dailyTargetReward) * 100 : 0}%` }}
            />
          </div>

          {/* Breakdown Pills matching screenshot */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-xl border border-slate-200/60">
              <p className="text-[9px] text-slate-400">Click & Earn</p>
              <p className="font-bold text-slate-700 text-xs">₦4,000</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-blue-200 text-[#0056FD]">
              <p className="text-[9px] text-blue-500">Watch & Earn</p>
              <p className="font-bold text-xs">₦{dailyTargetReward.toLocaleString()}</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200/60">
              <p className="text-[9px] text-slate-400">Questions</p>
              <p className="font-bold text-slate-700 text-xs">₦7,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Section: "WATCH & EARN" with Dark Navy Banner */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
          WATCH & EARN
        </span>
        <h2 className="text-2xl font-extrabold text-white mt-1">Watch videos, earn naira</h2>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
          <span>Today's progress</span>
          <span className="font-bold text-white">
            {completedCount}/{targetVideos}
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#0056FD] h-full rounded-full transition-all"
            style={{ width: `${targetVideos > 0 ? (completedCount / targetVideos) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* 3. Available Videos List */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-xs">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">
            No videos available right now — check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className={`bg-white rounded-3xl overflow-hidden border transition-all ${
                vid.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                  : 'border-slate-100 hover:border-blue-200 shadow-xs'
              }`}
            >
              {/* Thumbnail with overlay duration */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 bg-[#0B192C]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {vid.category}
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{vid.durationSeconds}s</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-[11px] text-slate-200">Sponsor: {vid.sponsor}</span>
                  <span className="text-xs font-black text-orange-400 bg-black/70 px-2 py-0.5 rounded-full">
                    ₦{vid.reward.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col justify-between">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                  {vid.title}
                </h3>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {vid.isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed (+₦{vid.reward.toLocaleString()})</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStartWatch(vid)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#0056FD] hover:bg-[#0047D4] text-white text-xs font-bold py-2.5 px-4 rounded-2xl shadow-xs transition-transform active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch & Earn ₦{vid.reward.toLocaleString()}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Interactive Video Modal Player with Verified Timer */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B192C] text-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
            {/* Modal Top */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white truncate max-w-[280px]">
                  {activeVideo.title}
                </h3>
                <p className="text-[11px] text-slate-400">Campaign: {activeVideo.sponsor}</p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Display */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={activeVideo.thumbnail}
                alt={activeVideo.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#0056FD] flex items-center justify-center shadow-lg shadow-blue-600/40 animate-pulse mb-3">
                  <Play className="w-7 h-7 text-white fill-current ml-1" />
                </div>
                <p className="text-xs font-semibold text-slate-200">
                  {canClaim ? 'Verification Complete!' : 'Viewing in progress... Keep window open.'}
                </p>
              </div>

              {/* Countdown badge */}
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>{canClaim ? 'Ready to Claim' : `${countdown}s remaining`}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Duration Verification</span>
                </div>
                <span className="font-bold text-orange-400">Reward: ₦{activeVideo.reward.toLocaleString()}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-[#0056FD] h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${((activeVideo.durationSeconds - countdown) / activeVideo.durationSeconds) * 100}%`,
                  }}
                />
              </div>

              <button
                onClick={handleClaim}
                disabled={!canClaim}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  canClaim
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 active:scale-98 animate-bounce'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {canClaim
                    ? `Claim ₦${activeVideo.reward.toLocaleString()} Reward Now!`
                    : `Complete ${countdown}s to Claim Reward`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
