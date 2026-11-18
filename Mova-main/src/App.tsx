import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { WatchVideosPage } from './pages/WatchVideosPage';
import { QuizPage } from './pages/QuizPage';
import { ClickAndEarnPage } from './pages/ClickAndEarnPage';
import { ChatPage } from './pages/ChatPage';
import { TalkingStagePage } from './pages/TalkingStagePage';
import { GamesPage } from './pages/GamesPage';
import { DailyTasksPage } from './pages/DailyTasksPage';
import { UpgradePage } from './pages/UpgradePage';
import { ReferralPage } from './pages/ReferralPage';
import { EarningsPage } from './pages/EarningsPage';
import { WithdrawalPage } from './pages/WithdrawalPage';
import { LoansPage } from './pages/LoansPage';
import { TutorialPage } from './pages/TutorialPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { WelcomeGuide } from './components/onboarding/WelcomeGuide';
import { SupportAssistant } from './components/support/SupportAssistant';

const AppContent: React.FC = () => {
  const { currentPage, user, setCurrentPage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on landing or auth pages without user login
  if (currentPage === 'landing' || (!user && (currentPage === 'login' || currentPage === 'register'))) {
    if (currentPage === 'login') return <AuthPage initialMode="login" />;
    if (currentPage === 'register') return <AuthPage initialMode="register" />;
    return <LandingPage />;
  }

  if (currentPage === 'admin' && user?.role !== 'admin') {
    setCurrentPage('dashboard');
    return null;
  }

  // Get Page Title for Navbar when inside internal pages
  let pageTitle = '';
  let pageSubtitle = '';
  switch (currentPage) {
    case 'watch-videos':
      pageTitle = 'Watch Videos and Earn';
      pageSubtitle = 'Watch eligible videos to receive rewards';
      break;
    case 'quiz':
      pageTitle = 'Answer Quiz Questions';
      pageSubtitle = 'Correct answers earn ₦1,000 each';
      break;
    case 'click-and-earn':
      pageTitle = 'Click and Earn';
      pageSubtitle = 'Tap sponsored links and earn naira';
      break;
    case 'chat':
      pageTitle = 'Global Communication';
      pageSubtitle = 'Connect with community members worldwide';
      break;
    case 'talking-stage':
      pageTitle = 'Talking Stage Verification';
      pageSubtitle = 'Reach conversation milestones for ₦5,000';
      break;
    case 'games':
      pageTitle = 'Games & Contests';
      pageSubtitle = 'Play reflex & lucky games for bonuses';
      break;
    case 'daily-tasks':
      pageTitle = 'Daily Tasks';
      pageSubtitle = 'Complete daily brand missions for ₦1,000';
      break;
    case 'upgrade':
      pageTitle = 'MOVA Premium Upgrade';
      pageSubtitle = 'Single one-time activation: ₦12,000';
      break;
    case 'referral':
      pageTitle = 'Referral Program';
      pageSubtitle = '₦9,000 direct commission per active member';
      break;
    case 'earnings':
      pageTitle = 'Earnings History';
      pageSubtitle = 'Comprehensive ledger across all activities';
      break;
    case 'withdrawal':
      pageTitle = 'Request Payout';
      pageSubtitle = 'Weekday cashouts to Nigerian bank accounts';
      break;
    case 'loans':
      pageTitle = 'Member Loan Facility';
      pageSubtitle = 'Flexible funding up to ₦500,000';
      break;
    case 'tutorial':
      pageTitle = 'Tutorial Video Guide';
      pageSubtitle = 'Video walk-through of the MOVA platform';
      break;
    case 'profile':
    case 'settings':
      pageTitle = 'Profile & Security';
      pageSubtitle = 'Manage your account and preferences';
      break;
    case 'admin':
      pageTitle = 'Admin Control Panel';
      pageSubtitle = 'Live platform operations & configuration';
      break;
    default:
      // Dashboard uses standard greeting
      pageTitle = '';
      pageSubtitle = '';
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(true)}
        title={pageTitle}
        subtitle={pageSubtitle}
      />

      {/* Slide-out Sidebar Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'watch-videos' && <WatchVideosPage />}
        {currentPage === 'quiz' && <QuizPage />}
        {currentPage === 'click-and-earn' && <ClickAndEarnPage />}
        {currentPage === 'chat' && <ChatPage />}
        {currentPage === 'talking-stage' && <TalkingStagePage />}
        {currentPage === 'games' && <GamesPage />}
        {currentPage === 'daily-tasks' && <DailyTasksPage />}
        {currentPage === 'upgrade' && <UpgradePage />}
        {currentPage === 'referral' && <ReferralPage />}
        {currentPage === 'earnings' && <EarningsPage />}
        {currentPage === 'withdrawal' && <WithdrawalPage />}
        {currentPage === 'loans' && <LoansPage />}
        {currentPage === 'tutorial' && <TutorialPage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'settings' && <ProfilePage />}
        {currentPage === 'admin' && <AdminPage />}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <BottomNav />

      {/* Toast Notification Container */}
      <ToastContainer />
      {user && <WelcomeGuide />}
      {user && <SupportAssistant />}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
