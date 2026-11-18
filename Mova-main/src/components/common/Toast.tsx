import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-white border-slate-200 text-slate-800';
        let icon = <Info className="w-5 h-5 text-blue-500" />;

        if (toast.type === 'success') {
          bg = 'bg-white border-emerald-300 text-slate-800';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
        } else if (toast.type === 'reward') {
          bg = 'bg-[#0B192C] border-orange-500/40 text-white shadow-xl';
          icon = <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" />;
        } else if (toast.type === 'error') {
          bg = 'bg-white border-rose-300 text-slate-800';
          icon = <AlertCircle className="w-5 h-5 text-rose-600" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-lg backdrop-blur-md transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-200 ${bg}`}
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold leading-tight">{toast.title}</h4>
              <p className={`text-xs mt-0.5 leading-relaxed ${toast.type === 'reward' ? 'text-slate-300' : 'text-slate-600'}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
