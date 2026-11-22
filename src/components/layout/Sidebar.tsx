import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  MessageCircle,
  Video,
  HelpCircle,
  MousePointerClick,
  HeartHandshake,
  Gamepad2,
  CheckSquare,
  History,
  Users,
  TrendingUp,
  Sparkles,
  Wallet,
  User,
  Settings,
  PlayCircle,
  LogOut,
  X,
  Shield,
  Lock,
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage, logout, user } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'Global Chat', icon: MessageCircle, badge: '₦2k/day' },
    { id: 'watch-videos', label: 'Watch Videos', icon: Video, badge: '₦2k' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, badge: '₦1k' },
    { id: 'click-and-earn', label: 'Click and Earn', icon: MousePointerClick, badge: '₦1k' },
    { id: 'talking-stage', label: 'Talking Stage', icon: HeartHandshake, badge: '₦5k' },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'daily-tasks', label: 'Daily Tasks', icon: CheckSquare, badge: '₦1k' },
    { id: 'earnings', label: 'Earnings History', icon: History },
    { id: 'referral', label: 'Referral', icon: Users, badge: '₦9,000' },
    { id: 'loans', label: 'Loans', icon: TrendingUp },
    { id: 'upgrade', label: 'Upgrade', icon: Sparkles, highlight: true },
    { id: 'withdrawal', label: 'Withdrawal', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'tutorial', label: 'Tutorial Video', icon: PlayCircle },
  ];

  const handleNav = (pageId: string) => {
    setCurrentPage(pageId);
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200"
        />
      )}

      {/* Slide-out Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 bg-[#0B192C] text-white flex flex-col transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header Card matching reference style */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="bg-white text-slate-900 rounded-2xl p-3 flex items-center justify-between shadow-md relative">
            <Logo size="sm" showTagline={false} />
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const premiumOnly = ['chat', 'referral', 'talking-stage', 'loans'].includes(item.id);
            const lockedForMember = premiumOnly && !user?.isPremium;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#0056FD] text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                } ${item.highlight && !isActive ? 'text-orange-400 hover:text-orange-300' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : item.highlight ? 'text-orange-400' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {lockedForMember ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-md">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                ) : item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.highlight
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          {/* Logout Option */}
          <div className="pt-2 border-t border-slate-800 mt-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Footer info inside sidebar */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">MOVA v1.0</p>
              <p className="text-[11px] text-slate-400">Entertainment. Rewards. More.</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </aside>
    </>
  );
};
