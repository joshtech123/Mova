import React from 'react';
import {
  X,
  LayoutDashboard,
  MessageSquare,
  PlaySquare,
  HelpCircle,
  MousePointerClick,
  HeartHandshake,
  Gamepad2,
  CalendarCheck,
  History,
  Users,
  TrendingUp,
  Sparkles,
  Wallet,
  User,
  Settings,
  Video,
  LogOut,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MovaLogo } from './MovaLogo';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ isOpen, onClose }) => {
  const { activeNavTab, setActiveNavTab, currentUser, logout } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'global-chat', label: 'Global Chat', icon: MessageSquare },
    { id: 'watch-videos', label: 'Watch Videos', icon: PlaySquare },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'click-and-earn', label: 'Click and Earn', icon: MousePointerClick },
    { id: 'talking-stage', label: 'Talking Stage', icon: HeartHandshake },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'daily-tasks', label: 'Daily Tasks', icon: CalendarCheck },
    { id: 'earnings', label: 'Earnings History', icon: History },
    { id: 'referral', label: 'Referral', icon: Users },
    { id: 'loans', label: 'Loans', icon: TrendingUp },
    { id: 'upgrade', label: 'Upgrade', icon: Sparkles },
    { id: 'withdrawal', label: 'Withdrawal', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'tutorial', label: 'Tutorial Video', icon: Video },
  ];

  const handleSelectTab = (id: string) => {
    setActiveNavTab(id);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer */}
      <div className="relative w-72 sm:w-80 max-w-[85vw] h-full bg-[#080E21] text-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
        {/* Top White Pill Container with MOVA Logo & Close Button */}
        <div className="p-3">
          <div className="bg-white rounded-2xl p-3 flex items-center justify-between shadow-md">
            <MovaLogo size="md" showTagline={false} />
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Mini Banner */}
        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold flex items-center justify-center text-xs">
              {currentUser?.fullName?.charAt(0) || 'M'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-100 truncate">{currentUser?.fullName}</p>
              <p className="text-[11px] text-blue-400 font-medium truncate">
                ₦{currentUser?.wallets.availableBalance.toLocaleString()} available
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              currentUser?.isPremium
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                : 'bg-white/10 text-slate-400'
            }`}
          >
            {currentUser?.isPremium ? 'PREMIUM' : 'FREE'}
          </span>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-[#2563EB] text-white font-semibold shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'upgrade' && !currentUser?.isPremium && (
                  <span className="ml-auto text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-md">
                    ₦12K
                  </span>
                )}
                {item.id === 'talking-stage' && (
                  <span className="ml-auto text-[10px] font-semibold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-md">
                    ₦5K
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin Backoffice Entry */}
          {currentUser?.role === 'admin' && (
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => handleSelectTab('admin')}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all text-left ${
                  activeNavTab === 'admin'
                    ? 'bg-purple-600 text-white font-semibold shadow-lg shadow-purple-600/30'
                    : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <Shield className="w-4 h-4 shrink-0 text-purple-400" />
                <span className="truncate font-bold">Admin Dashboard</span>
                <span className="ml-auto text-[9px] font-extrabold uppercase bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded">
                  PANEL
                </span>
              </button>
            </div>
          )}

          {/* Sign Out */}
          <div className="pt-2 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left font-medium"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Footer brand stamp */}
        <div className="p-4 border-t border-white/5 text-[11px] text-slate-500 text-center">
          MOVA Platform v2.4 • Entertainment. Rewards. More.
        </div>
      </div>
    </div>
  );
};
