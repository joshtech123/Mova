import React from 'react';
import { Megaphone, X, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CallForActivationModal: React.FC = () => {
  const { showActivationModal, setShowActivationModal, setActiveNavTab, platformSettings } = useApp();

  if (!showActivationModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setShowActivationModal(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 z-10 text-center animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setShowActivationModal(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4 border border-blue-200/60">
          <Megaphone className="w-3.5 h-3.5 text-blue-600" />
          <span>Announcement</span>
        </div>

        {/* Heading */}
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          CALL FOR ACTIVATION
        </h3>

        {/* Body Content */}
        <div className="mt-4 space-y-3 text-left text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p className="flex items-start gap-2">
            <span className="text-base select-none shrink-0">🎉</span>
            <span>
              <strong className="text-slate-800">Welcome to MOVA!</strong> You have successfully created your member profile.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <span className="text-base select-none shrink-0">💎</span>
            <span>
              Activate your <strong className="text-slate-900">MOVA Premium</strong> membership for only{' '}
              <strong className="text-blue-700 font-extrabold">
                ₦{platformSettings.premiumActivationFee.toLocaleString()}
              </strong>{' '}
              to unlock eligible video rewards (₦2,000/video), daily quizzes (₦1,000), talking stage milestones (₦5,000), and direct ₦9,000 referral commissions.
            </span>
          </p>

          <p className="flex items-start gap-2">
            <span className="text-base select-none shrink-0">👉</span>
            <span>
              Click <strong>Activate My Account</strong> below to view the official payment instructions and start your verified earning journey!
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={() => {
              setShowActivationModal(false);
              setActiveNavTab('upgrade');
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Activate My Account (₦{platformSettings.premiumActivationFee.toLocaleString()})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowActivationModal(false)}
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Got it, explore first
          </button>
        </div>
      </div>
    </div>
  );
};
