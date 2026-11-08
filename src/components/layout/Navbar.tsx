import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Bell, Shield, LogOut, User as UserIcon, Check, Sparkles } from 'lucide-react';
import { Logo } from '../common/Logo';

interface NavbarProps {
  onToggleSidebar: () => void;
  title?: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, title, subtitle }) => {
  const { user, wallet, currentPage, setCurrentPage, logout, toggleRole } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Daily Tasks Refreshed',
      desc: '₦10,000 in fresh video, quiz, and click rewards available today.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Welcome to MOVA',
      desc: 'Activate MOVA Premium (₦12,000) to access unrestricted payouts.',
      time: 'Today',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        {/* Left: Hamburger menu button + Greeting */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Open menu"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            {title ? (
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                  {title}
                  {user?.membershipStatus === 'premium' && (
                    <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                </h1>
                {subtitle && <p className="text-xs text-slate-500 leading-tight hidden xs:block">{subtitle}</p>}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    Hi, {user?.username || 'Member'}
                  </h1>
                  <span className="text-base animate-bounce">👋</span>
                  {user?.membershipStatus === 'premium' ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-1">
                      PRO
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full ml-1">
                      Free
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-tight">
                  Here’s your earning summary today.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Center: Brand on desktop */}
        <div className="hidden md:flex items-center">
          <Logo size="sm" showTagline={false} />
        </div>

        {/* Right: Quick actions & Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Balance display on desktop */}
          <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-200">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Balance</span>
            <span className="text-sm font-bold text-[#0056FD]">₦{wallet.availableBalance.toLocaleString()}</span>
          </div>

          {/* Role switcher for easy testing */}
          <button
            onClick={toggleRole}
            title={`Switch to ${user?.role === 'admin' ? 'User' : 'Admin'} Mode`}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              user?.role === 'admin'
                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{user?.role === 'admin' ? 'Admin Mode' : 'Switch Admin'}</span>
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 relative transition-colors shadow-xs"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                  <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                  <span className="text-[10px] font-semibold text-[#0056FD] bg-blue-50 px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Circle (just like reference 3SFE screenshot with circle initial 'J' / 'O') */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="w-10 h-10 rounded-full bg-blue-100 text-[#0056FD] hover:bg-blue-200 border-2 border-white shadow-xs font-bold text-sm flex items-center justify-center transition-transform active:scale-95"
            >
              {user?.username?.charAt(0).toUpperCase() || 'O'}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-slate-100">
                  <p className="font-bold text-sm text-slate-900 leading-tight">{user?.fullName}</p>
                  <p className="text-xs text-slate-500 truncate">@{user?.username}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        user?.membershipStatus === 'premium'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {user?.membershipStatus === 'premium' ? 'Premium Active' : 'Unactivated Member'}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('upgrade');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Upgrade to Premium
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => {
                        setCurrentPage('admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                    >
                      <Shield className="w-4 h-4 text-purple-500" />
                      Admin Control Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1 border-t border-slate-100"
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
