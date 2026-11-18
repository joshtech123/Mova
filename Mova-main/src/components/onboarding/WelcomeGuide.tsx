import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const steps = [
  { page: 'profile', title: '1/3 · Set up your profile', body: 'Add your correct personal details so your MOVA account is ready to use.', action: 'Open profile' },
  { page: 'withdrawal', title: '2/3 · Add your bank details', body: 'Add your own bank account and verify the account name before requesting a payout.', action: 'Set up bank details' },
  { page: 'upgrade', title: '3/3 · Unlock MOVA Premium', body: 'Premium unlocks eligible member activities, referrals and additional features. Review the ₦12,000 fee and terms before paying.', action: 'View Premium' },
];

export const WelcomeGuide: React.FC = () => {
  const { user, setCurrentPage } = useApp();
  const [showWelcome, setShowWelcome] = useState(false);
  const [step, setStep] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const key = `mova-welcome-seen-${user.id}`;
    if (!localStorage.getItem(key)) setShowWelcome(true);
  }, [user?.id]);

  const dismissWelcome = () => {
    if (user) localStorage.setItem(`mova-welcome-seen-${user.id}`, '1');
    setShowWelcome(false);
    setStep(0);
  };

  const goToStep = (index: number) => {
    const item = steps[index];
    if (!item) {
      setStep(null);
      return;
    }
    setCurrentPage(item.page);
    setStep(index);
  };

  if (showWelcome) return (
    <div className="fixed inset-0 z-[100] bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white text-slate-900 p-6 sm:p-8 shadow-2xl">
        <button onClick={dismissWelcome} aria-label="Close welcome message" className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0056FD] flex items-center justify-center mb-4"><Sparkles className="w-6 h-6" /></div>
        <p className="text-[11px] font-extrabold tracking-[.18em] text-[#0056FD]">WELCOME TO MOVA</p>
        <h2 className="text-2xl sm:text-3xl font-black mt-2">Your MOVA journey starts here.</h2>
        <p className="text-sm text-slate-600 mt-3 leading-6">Explore videos, games, community features and eligible activities from your dashboard. Set up your profile and bank details first. Premium features become available only after your payment has been confirmed.</p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {['Complete your profile','Add your bank details','Review Premium access'].map((item,i)=><div key={item} className="rounded-xl bg-slate-50 border border-slate-100 p-3"><b className="text-[#0056FD]">{i+1}/3</b><p className="font-semibold mt-1">{item}</p></div>)}
        </div>
        <button onClick={dismissWelcome} className="mt-6 w-full rounded-xl bg-[#0056FD] hover:bg-blue-700 text-white font-bold py-3.5">Let's get started <ArrowRight className="inline w-4 h-4 ml-1" /></button>
      </div>
    </div>
  );

  if (step === null) return null;
  const current = steps[step];
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] w-[min(92vw,440px)]">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[#0056FD] drop-shadow-lg"><span className="text-4xl">⬆</span></div>
      <div className="rounded-2xl border border-blue-200 bg-white text-slate-900 p-4 shadow-2xl">
        <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold text-[#0056FD] tracking-wider">QUICK SETUP GUIDE</p><h3 className="font-black mt-1">{current.title}</h3></div><button onClick={()=>setStep(null)} aria-label="Close guide" className="p-1 rounded-lg hover:bg-slate-100"><X className="w-4 h-4"/></button></div>
        <p className="text-xs text-slate-600 leading-5 mt-2">{current.body}</p>
        <div className="flex items-center justify-between mt-4 gap-3"><div className="flex gap-1.5">{steps.map((_,i)=><span key={i} className={`h-1.5 w-7 rounded-full ${i===step?'bg-[#0056FD]':'bg-slate-200'}`}/>)}</div><button onClick={()=>step===2?setStep(null):goToStep(step+1)} className="text-xs font-bold text-[#0056FD]">{step===2?'Finish guide':'Next step'} <ArrowRight className="inline w-3.5 h-3.5"/></button></div>
      </div>
    </div>
  );
};
