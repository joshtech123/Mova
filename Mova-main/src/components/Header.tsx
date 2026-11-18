import React, { useState } from 'react';
import { Menu, Bell, Shield, User as UserIcon, CheckCircle2, ChevronDown, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onOpenSideNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSideNav }) => {
  const { currentUser, users, switchUser, setActiveNavTab, logout } = useApp();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const initial = currentUser?.fullName?.charAt(0).toUpperCase() || 'M';
  const firstName = currentUser?.fullName?.split(' ')[0] || 'Member';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Hamburger button & Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSideNav}
            aria-label="Open navigation menu"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all shadow-xs"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Hi, {firstName}
              </h1>
              <span className="text-base sm:text-lg select-none">👋</span>
              {currentUser?.isPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <CheckCircle2 className="w-2.5 h-2.5 text-amber-600" />
                  PREMIUM
                </span>
              )}
              {currentUser?.role === 'admin' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                  <Shield className="w-2.5 h-2.5" />
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Here&apos;s your earning summary today.
            </p>
          </div>
        </div>

        {/* Right: Quick actions (Notification, Demo Switcher, Avatar) */}
        <div className="flex items-center gap-2">
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                  <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100">
                    <p className="font-semibold text-blue-950">Daily Tasks Available</p>
                    <p className="text-slate-600 mt-0.5">
                      New video streams and knowledge quiz questions are available. Earn up to ₦15,000 today!
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">10 mins ago</span>
                  </div>
                  <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100">
                    <p className="font-semibold text-amber-950">MOVA Premium Privilege</p>
                    <p className="text-slate-600 mt-0.5">
                      Direct ₦9,000 referral commissions and full withdrawal access unlocked upon activation.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-all"
              aria-label="User profile and switch menu"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm ring-2 ring-blue-500/20">
                {initial}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown & Demo Switcher */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <p className="font-bold text-sm text-slate-900">{currentUser?.fullName}</p>
                  <p className="text-xs text-slate-500">@{currentUser?.username}</p>
                  <p className="text-xs font-semibold text-blue-600 mt-1">
                    Balance: ₦{currentUser?.wallets.availableBalance.toLocaleString()}
                  </p>
                </div>

                <div className="text-xs font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                  Switch Demo Account
                </div>
                <div className="space-y-1 mb-2">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                        u.id === currentUser?.id
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{u.fullName}</p>
                        <p className="text-[11px] text-slate-400">
                          {u.role === 'admin' ? 'Admin Master' : u.isPremium ? 'Premium Active' : 'Unactivated Member'}
                        </p>
                      </div>
                      {u.id === currentUser?.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setActiveNavTab('profile');
                      setShowUserDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    My Profile & KYC
                  </button>
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveNavTab('admin');
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 font-semibold text-left"
                    >
                      <Shield className="w-4 h-4 text-purple-600" />
                      Admin Control Center
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
