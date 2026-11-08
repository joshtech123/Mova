import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Play, CheckCircle2, ArrowLeft, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export const TutorialPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    {
      id: 0,
      title: '1. Account Registration & Security',
      duration: '2:15',
      summary: 'How to sign up, verify your email/phone, and protect your login credentials.',
      videoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 1,
      title: '2. Activating MOVA Premium (₦12,000)',
      duration: '3:40',
      summary: 'Step-by-step payment guide using instant debit card or dedicated bank transfer.',
      videoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: '3. Watching Videos & Answering Quizzes',
      duration: '4:10',
      summary: 'How to watch videos without interruption and answer daily quiz questions for verified credits.',
      videoUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: '4. Requesting Cashouts to Nigerian Banks',
      duration: '2:50',
      summary: 'Setting up your NIBSS-verified bank account and submitting weekday payout requests.',
      videoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      title: '5. Maximizing Referral Commissions (₦9,000)',
      duration: '3:20',
      summary: 'Sharing your unique affiliate link across WhatsApp, Twitter, and Telegram.',
      videoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Tutorial Video Guide</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Master every feature of the MOVA ecosystem: Registration, Premium, Tasks & Cashouts.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl shrink-0 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to dashboard</span>
        </button>
      </div>

      {/* Main Video Player Screen */}
      <div className="bg-[#0B192C] rounded-3xl overflow-hidden shadow-xl border border-slate-800">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <img
            src={chapters[activeChapter].videoUrl}
            alt={chapters[activeChapter].title}
            className="w-full h-full object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-black/40 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-18 h-18 rounded-full bg-[#0056FD] flex items-center justify-center shadow-xl shadow-blue-600/50 hover:scale-105 transition-transform cursor-pointer mb-3">
              <Play className="w-8 h-8 text-white fill-current ml-1" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white max-w-md">
              {chapters[activeChapter].title}
            </h2>
            <p className="text-xs text-slate-300 mt-1">{chapters[activeChapter].summary}</p>
          </div>

          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-orange-400" />
            <span>Duration: {chapters[activeChapter].duration}</span>
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="p-4 bg-slate-950 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>MOVA Official Academy Video</span>
          </div>
          <span className="font-semibold text-white">Full HD 1080p</span>
        </div>
      </div>

      {/* Chapters Playlist */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900">Tutorial Course Modules</h3>

        <div className="space-y-2">
          {chapters.map((ch, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapter(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? 'border-[#0056FD] bg-blue-50/50 text-[#0056FD] shadow-xs'
                    : 'border-slate-100 hover:border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isActive ? 'bg-[#0056FD] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{ch.title}</h4>
                    <p className="text-[11px] text-slate-500">{ch.summary}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-400 shrink-0">{ch.duration}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
