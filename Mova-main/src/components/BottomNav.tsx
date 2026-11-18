import React from 'react';
import { PlaySquare, HelpCircle, Home, MousePointerClick, History } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeNavTab, setActiveNavTab } = useApp();

  const tabs = [
    { id: 'watch-videos', label: 'Videos', icon: PlaySquare },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'dashboard', label: 'Home', icon: Home, isCenter: true },
    { id: 'click-and-earn', label: 'Click & earn', icon: MousePointerClick },
    { id: 'earnings', label: 'History', icon: History },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeNavTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveNavTab(tab.id)}
                className="relative -top-4 flex flex-col items-center group focus:outline-none"
                aria-label="Home Dashboard"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-tr from-[#1E40AF] to-[#2563EB] text-white ring-4 ring-white shadow-blue-500/40 scale-105'
                      : 'bg-[#2563EB] text-white ring-4 ring-white hover:bg-blue-700 shadow-blue-500/30'
                  }`}
                >
                  <Home className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight ${
                    isActive ? 'text-[#2563EB]' : 'text-slate-600'
                  }`}
                >
                  Home
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveNavTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-1 px-1 transition-colors ${
                isActive ? 'text-[#2563EB]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
              <span
                className={`text-[10px] mt-1 font-medium tracking-tight text-center leading-none ${
                  isActive ? 'font-bold text-[#2563EB]' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
