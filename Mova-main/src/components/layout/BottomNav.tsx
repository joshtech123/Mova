import React from 'react';
import { useApp } from '../../context/AppContext';
import { Video, HelpCircle, Home, MousePointerClick, History } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentPage, setCurrentPage } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Videos */}
        <button
          onClick={() => setCurrentPage('watch-videos')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'watch-videos' ? 'text-[#0056FD]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Video className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Videos</span>
        </button>

        {/* Quiz */}
        <button
          onClick={() => setCurrentPage('quiz')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'quiz' ? 'text-[#0056FD]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Quiz</span>
        </button>

        {/* Home - Visually prominent circular floating button in center */}
        <div className="flex-1 flex flex-col items-center justify-center relative -top-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
              currentPage === 'dashboard'
                ? 'bg-[#0056FD] shadow-blue-500/40 ring-4 ring-blue-100'
                : 'bg-[#0056FD] hover:bg-[#0047D4]'
            }`}
          >
            <Home className="w-6 h-6" />
          </button>
          <span
            className={`text-[10px] font-bold mt-1 ${
              currentPage === 'dashboard' ? 'text-[#0056FD]' : 'text-slate-500'
            }`}
          >
            Home
          </span>
        </div>

        {/* Click and earn */}
        <button
          onClick={() => setCurrentPage('click-and-earn')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'click-and-earn' ? 'text-[#0056FD]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MousePointerClick className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1 text-center truncate max-w-[65px]">Click & earn</span>
        </button>

        {/* History */}
        <button
          onClick={() => setCurrentPage('earnings')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
            currentPage === 'earnings' ? 'text-[#0056FD]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">History</span>
        </button>
      </div>
    </nav>
  );
};
