import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Shield,
  Smartphone,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { addToast } = useApp();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveSettings = () => {
    addToast('success', 'Preferences saved successfully.');
  };

  return (
    <div className="space-y-6 pb-24 sm:pb-12 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Platform Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure security, notifications, and earning alert preferences.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-5 text-xs sm:text-sm">
        <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-2">
          Notification Preferences
        </h3>

        <div className="space-y-3.5">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 block">Daily Task & Earnings Alert</span>
              <span className="text-slate-500 text-xs">Notify me when daily video and quiz quotas refill.</span>
            </div>
            <input
              type="checkbox"
              checked={taskReminders}
              onChange={(e) => setTaskReminders(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 block">Email Payout Confirmation</span>
              <span className="text-slate-500 text-xs">Receive digital transaction receipts for bank withdrawals.</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        <h3 className="font-extrabold text-slate-900 border-t border-slate-100 pt-5 pb-2">
          Security & Access
        </h3>

        <div className="space-y-3.5">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-bold text-slate-800 block">Two-Factor OTP Security</span>
              <span className="text-slate-500 text-xs">Require SMS / Email OTP for withdrawal requests.</span>
            </div>
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => setTwoFactor(e.target.checked)}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
