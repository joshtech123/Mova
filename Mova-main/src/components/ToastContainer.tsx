import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        };

        const bgStyles = {
          success: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          error: 'bg-rose-50 border-rose-200 text-rose-950',
          warning: 'bg-amber-50 border-amber-200 text-amber-950',
          info: 'bg-blue-50 border-blue-200 text-blue-950',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md animate-in slide-in-from-top-3 fade-in duration-200 ${bgStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-xs">
              <h5 className="font-bold leading-tight">{toast.title}</h5>
              {toast.message && <p className="mt-0.5 opacity-90 leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
