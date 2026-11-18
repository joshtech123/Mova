import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Shield, KeyRound, Bell, CheckCircle2, Building, Sparkles } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, setCurrentPage, addToast } = useApp();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '+2348012345678');
  const [email, setEmail] = useState(user?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal account details have been saved.',
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    addToast({
      type: 'success',
      title: 'Security Password Changed',
      message: 'Your password has been successfully updated.',
    });
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* 1. Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0056FD] font-extrabold text-2xl flex items-center justify-center border-2 border-white shadow-xs">
            {user?.username?.charAt(0).toUpperCase() || 'O'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user?.fullName}</h1>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  user?.membershipStatus === 'premium'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {user?.membershipStatus === 'premium' ? 'MOVA Premium Active' : 'Unactivated Member'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">@{user?.username} • {user?.country}</p>
            <p className="text-[11px] font-mono text-[#0056FD] mt-1 font-bold">
              Referral Code: {user?.referralCode}
            </p>
          </div>
        </div>

        {user?.membershipStatus !== 'premium' && (
          <button
            onClick={() => setCurrentPage('upgrade')}
            className="inline-flex items-center gap-1.5 bg-[#0056FD] hover:bg-[#0047D4] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xs transition-transform active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade Account</span>
          </button>
        )}
      </div>

      {/* 2. Personal Details Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Personal Information</h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                disabled
                value={user?.country}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 3. Security & Password Update */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Security & Authentication</h2>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0056FD]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
