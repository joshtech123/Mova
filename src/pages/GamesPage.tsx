import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Gamepad2, Trophy, Play, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GamesPage: React.FC = () => {
  const { wallet, addToast } = useApp();
  const [activeGame, setActiveGame] = useState<'reflex' | 'wheel' | null>(null);

  // Reflex game state
  const [reflexState, setReflexState] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  // Wheel state
  const [spinning, setSpinning] = useState(false);
  const [wheelDegree, setWheelDegree] = useState(0);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Reflex Game Logic
  const startReflex = () => {
    setReflexState('waiting');
    setReactionTime(null);
    const delay = 1500 + Math.random() * 2500;
    setTimeout(() => {
      setReflexState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleReflexClick = () => {
    if (reflexState === 'waiting') {
      setReflexState('idle');
      addToast({ type: 'error', title: 'Too early!', message: 'Wait for the color to turn GREEN.' });
      return;
    }
    if (reflexState === 'ready') {
      const elapsed = Date.now() - startTime;
      setReactionTime(elapsed);
      setReflexState('finished');
      if (elapsed < 350) {
        addToast({
          type: 'reward',
          title: '🔥 Lightning Fast!',
          message: `Reaction time ${elapsed}ms! High score recorded.`,
        });
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
    }
  };

  // Lucky Wheel Logic
  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSpinResult(null);
    const degrees = 1440 + Math.floor(Math.random() * 360);
    setWheelDegree((prev) => prev + degrees);

    setTimeout(() => {
      setSpinning(false);
      const prizes = ['₦500 Bonus Points', 'Double Video Multiplier', 'Free Daily Quiz Pass', '₦1,000 Task Boost'];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setSpinResult(prize);
      addToast({ type: 'reward', title: '🎉 Wheel Result!', message: `You won: ${prize}` });
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }, 3000);
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
            ENTERTAINMENT & TOURNAMENTS
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
            Daily Leaderboards
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">MOVA Games & Contests</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Compete in interactive challenges, test your skills, and earn bonus multiplier credits.
        </p>
      </div>

      {/* Available Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Game 1: Speed Reflex */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Speed Tap Reflex</h3>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">Reaction</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Test your reaction time. When the red screen changes to green, tap as fast as humanly possible!
            </p>
          </div>

          <button
            onClick={() => setActiveGame(activeGame === 'reflex' ? null : 'reflex')}
            className="mt-6 w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{activeGame === 'reflex' ? 'Close Game' : 'Play Reflex Challenge'}</span>
          </button>
        </div>

        {/* Game 2: Daily Wheel */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Daily Lucky Wheel</h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Luck</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Spin the wheel once a day to unlock bonus task reward multipliers and points.
            </p>
          </div>

          <button
            onClick={() => setActiveGame(activeGame === 'wheel' ? null : 'wheel')}
            className="mt-6 w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{activeGame === 'wheel' ? 'Close Game' : 'Spin Lucky Wheel'}</span>
          </button>
        </div>
      </div>

      {/* Active Game 1 Modal: Reflex */}
      {activeGame === 'reflex' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md animate-in fade-in">
          <div className="text-center max-w-sm mx-auto">
            <h3 className="font-bold text-base text-slate-900 mb-2">Speed Tap Reflex</h3>
            <div
              onClick={handleReflexClick}
              className={`h-48 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors shadow-inner select-none ${
                reflexState === 'idle'
                  ? 'bg-slate-100 text-slate-700'
                  : reflexState === 'waiting'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : reflexState === 'ready'
                  ? 'bg-emerald-500 text-white text-xl font-black'
                  : 'bg-[#0056FD] text-white'
              }`}
            >
              {reflexState === 'idle' && <p className="font-bold text-sm">Tap 'Start Game' below</p>}
              {reflexState === 'waiting' && <p className="font-bold text-base">Wait for GREEN...</p>}
              {reflexState === 'ready' && <p className="font-black text-2xl uppercase tracking-wider">TAP NOW!</p>}
              {reflexState === 'finished' && (
                <div>
                  <p className="text-3xl font-black">{reactionTime} ms</p>
                  <p className="text-xs text-blue-100 mt-1">
                    {reactionTime && reactionTime < 350 ? 'Outstanding Reflexes!' : 'Good try! Can you beat 300ms?'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={startReflex}
                className="flex-1 py-3 bg-[#0056FD] text-white rounded-2xl text-xs font-bold hover:bg-[#0047D4]"
              >
                {reflexState === 'finished' ? 'Try Again' : 'Start Game'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Game 2 Modal: Wheel */}
      {activeGame === 'wheel' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md animate-in fade-in">
          <div className="text-center max-w-sm mx-auto">
            <h3 className="font-bold text-base text-slate-900 mb-2">Daily Lucky Wheel</h3>
            <p className="text-xs text-slate-500 mb-6">Spin to win reward boosters</p>

            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Pointer */}
              <div className="absolute -top-3 z-10 w-4 h-6 bg-rose-600 clip-triangle shadow-md" />

              {/* Wheel circle */}
              <div
                className="w-48 h-48 rounded-full border-4 border-slate-900 overflow-hidden shadow-xl transition-transform duration-3000 ease-out flex items-center justify-center"
                style={{
                  transform: `rotate(${wheelDegree}deg)`,
                  background:
                    'conic-gradient(#0056FD 0deg 90deg, #FF6B00 90deg 180deg, #10B981 180deg 270deg, #8B5CF6 270deg 360deg)',
                }}
              >
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center font-extrabold text-[10px] text-slate-800">
                  MOVA
                </div>
              </div>
            </div>

            {spinResult && (
              <div className="mt-6 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                🎉 Won: {spinResult}
              </div>
            )}

            <button
              onClick={spinWheel}
              disabled={spinning}
              className={`mt-6 w-full py-3.5 rounded-2xl text-xs font-bold text-white transition-all ${
                spinning ? 'bg-slate-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 shadow-md'
              }`}
            >
              {spinning ? 'Spinning...' : 'Spin The Wheel'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
