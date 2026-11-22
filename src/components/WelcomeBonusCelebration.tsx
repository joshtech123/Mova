import React, { useEffect } from 'react';
import { ArrowRight, Gift, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const WelcomeBonusCelebration: React.FC = () => {
  const { welcomeCelebration, dismissWelcomeCelebration } = useApp();

  useEffect(() => {
    if (!welcomeCelebration) return;
    const colors = ['#2457F5', '#FF7043', '#D4AF37', '#FFFFFF', '#00C16A'];
    const burst = (originX: number, originY: number) => confetti({
      particleCount: 90,
      spread: 95,
      startVelocity: 42,
      gravity: 0.85,
      ticks: 220,
      origin: { x: originX, y: originY },
      colors,
      zIndex: 10000,
    });
    burst(0.18, 0.22);
    burst(0.82, 0.22);
    const timer = window.setTimeout(() => burst(0.5, 0.18), 280);
    return () => window.clearTimeout(timer);
  }, [welcomeCelebration]);

  if (!welcomeCelebration) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#080D35]/75 px-4 py-8 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="welcome-bonus-title">
      <style>{`
        @keyframes mova-balloon-rise { 0% { transform: translateY(110vh) rotate(-7deg); opacity: 0; } 12% { opacity: .95; } 100% { transform: translateY(-130vh) rotate(8deg); opacity: .9; } }
        @keyframes mova-pop-in { 0% { opacity: 0; transform: translateY(22px) scale(.94); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .mova-balloon { position:absolute; bottom:-110px; width:44px; height:56px; border-radius:50% 50% 46% 46%; animation: mova-balloon-rise 8s linear infinite; box-shadow: inset -8px -7px 0 rgba(0,0,0,.09); }
        .mova-balloon:after { content:''; position:absolute; left:19px; bottom:-8px; border-left:4px solid transparent; border-right:4px solid transparent; border-bottom:0; border-top:9px solid currentColor; }
        .mova-balloon:before { content:''; position:absolute; left:21px; top:57px; height:72px; border-left:1px solid rgba(255,255,255,.65); }
        @media (prefers-reduced-motion: reduce) { .mova-balloon { animation:none; opacity:.65; } }
      `}</style>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="mova-balloon left-[7%] bg-[#2457F5] text-[#2457F5]" style={{ animationDelay: '-1s' }} />
        <span className="mova-balloon left-[23%] bg-[#FF7043] text-[#FF7043] scale-90" style={{ animationDelay: '-4s', animationDuration: '9s' }} />
        <span className="mova-balloon right-[22%] bg-[#D4AF37] text-[#D4AF37] scale-110" style={{ animationDelay: '-2s', animationDuration: '10s' }} />
        <span className="mova-balloon right-[7%] bg-[#00C16A] text-[#00C16A]" style={{ animationDelay: '-5s' }} />
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/70 bg-white text-center shadow-[0_30px_100px_rgba(0,0,0,.35)]" style={{ animation: 'mova-pop-in .45s cubic-bezier(.2,.8,.2,1) both' }}>
        <button type="button" onClick={dismissWelcomeCelebration} aria-label="Close welcome bonus celebration" className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 text-slate-500 transition hover:bg-white hover:text-slate-900">
          <X className="h-4 w-4" />
        </button>
        <div className="relative overflow-hidden bg-gradient-to-br from-[#080D35] via-[#123A9A] to-[#2457F5] px-7 pb-8 pt-10 text-white">
          <div className="absolute -left-12 -top-16 h-44 w-44 rounded-full bg-[#FF7043]/30 blur-2xl" />
          <div className="absolute -bottom-20 -right-8 h-48 w-48 rounded-full bg-[#00C16A]/25 blur-2xl" />
          <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/15 shadow-lg backdrop-blur">
            <Gift className="h-8 w-8 text-[#FFD38A]" />
          </div>
          <div className="relative mb-2 flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[.22em] text-blue-100">
            <Sparkles className="h-4 w-4 text-[#FFD38A]" /> MOVA welcome gift <Sparkles className="h-4 w-4 text-[#FFD38A]" />
          </div>
          <h2 id="welcome-bonus-title" className="relative text-2xl font-black tracking-tight sm:text-3xl">Congratulations{welcomeCelebration.fullName ? `, ${welcomeCelebration.fullName.split(' ')[0]}` : ''}!</h2>
          <p className="relative mt-2 text-sm leading-relaxed text-blue-100">Your MOVA account has been created successfully. Your welcome bonus is ready in your wallet.</p>
        </div>
        <div className="px-7 pb-7 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-slate-500">Your welcome bonus</p>
          <p className="mt-1 text-4xl font-black tracking-tight text-[#2457F5]">₦{welcomeCelebration.amount.toLocaleString('en-NG')}</p>
          <p className="mt-2 text-xs text-slate-500">The ₦9,100 bonus has been confirmed in your MOVA wallet.</p>
          <button type="button" onClick={dismissWelcomeCelebration} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2457F5] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#1949DE] active:scale-[.99]">
            Continue to dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
