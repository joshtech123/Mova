import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  WalletState,
  Transaction,
  VideoTask,
  QuizQuestion,
  ClickTask,
  ChatUser,
  ChatMessage,
  TalkingStagePartner,
  ReferralItem,
  WithdrawalRequest,
  LoanApplication,
  PlatformSettings,
} from '../types';
import { INITIAL_SETTINGS, INITIAL_VIDEOS, INITIAL_QUIZ, INITIAL_CLICKS } from '../data/mockData';
import { getSavedSession, saveSession, signIn, signUp, signOut, loadProfile } from '../lib/supabaseAuth';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'reward';
  title: string;
  message: string;
}

interface AppContextType {
  user: User | null;
  wallet: WalletState;
  transactions: Transaction[];
  videos: VideoTask[];
  quizzes: QuizQuestion[];
  clickTasks: ClickTask[];
  chatUsers: ChatUser[];
  chatMessages: Record<string, ChatMessage[]>;
  talkingStages: TalkingStagePartner[];
  referrals: ReferralItem[];
  withdrawals: WithdrawalRequest[];
  loans: LoanApplication[];
  settings: PlatformSettings;
  toasts: ToastMessage[];
  unreadNotifications: number;
  // Navigation helper
  currentPage: string;
  setCurrentPage: (page: string) => void;
  // Actions
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
  toggleRole: () => void;
  activatePremium: (paymentMethod: string) => Promise<boolean>;
  completeVideoTask: (videoId: string) => boolean;
  answerQuiz: (quizId: string, answerIndex: number) => { isCorrect: boolean; reward: number; explanation: string };
  completeClickTask: (taskId: string) => boolean;
  sendChatMessage: (recipientId: string, text: string) => void;
  claimTalkingStageReward: (stageId: string) => boolean;
  requestWithdrawal: (
    amount: number,
    walletSource: 'task' | 'referral' | 'welcome_pack',
    bankName: string,
    accountNumber: string,
    accountName: string
  ) => { success: boolean; message: string };
  applyForLoan: (
    amount: number,
    tenureMonths: number,
    bankName: string,
    accountNumber: string,
    monthlyIncome: number,
    employmentStatus: string
  ) => { success: boolean; message: string };
  simulateReferralSale: (name?: string, tier?: 1 | 2 | 3) => void;
  adminApproveWithdrawal: (id: string) => void;
  adminRejectWithdrawal: (id: string) => void;
  adminApproveLoan: (id: string) => void;
  adminRejectLoan: (id: string) => void;
  adminUpdateSettings: (newSettings: Partial<PlatformSettings>) => void;
  adminAddVideo: (video: Omit<VideoTask, 'id' | 'isCompleted'>) => void;
  adminAddQuiz: (quiz: Omit<QuizQuestion, 'id'>) => void;
  resetAllData: () => void;
}

const STORAGE_KEY = 'mova_platform_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);



const DEFAULT_WALLET: WalletState = {
  availableBalance: 0,
  taskBalance: 0,
  referralBalance: 0,
  welcomePackBalance: 0,
  lifetimeEarnings: 0,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<WalletState>(DEFAULT_WALLET);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [videos, setVideos] = useState<VideoTask[]>(INITIAL_VIDEOS);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(INITIAL_QUIZ);
  const [clickTasks, setClickTasks] = useState<ClickTask[]>(INITIAL_CLICKS);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [talkingStages, setTalkingStages] = useState<TalkingStagePartner[]>([
    {
      id: 'ts-1',
      user: null,
      messagesCount: 18,
      requiredMessages: 20,
      daysStreak: 3,
      requiredDays: 3,
      status: 'in_progress',
      rewardAmount: 5000,
      lastActive: 'Just now',
    },
    {
      id: 'ts-2',
      user: null,
      messagesCount: 7,
      requiredMessages: 20,
      daysStreak: 1,
      requiredDays: 3,
      status: 'in_progress',
      rewardAmount: 5000,
      lastActive: 'Yesterday',
    },
  ]);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);

  // Restore a real Supabase session and profile on page load.
  useEffect(() => {
    const session = getSavedSession();
    if (!session?.access_token || !session?.user?.id) return;
    loadProfile(session.user.id, session.access_token).then((profile) => {
      const mapped: User = { id: profile.id, fullName: profile.full_name, username: profile.username, email: session.user.email || '', phone: profile.phone || '', country: profile.country || 'Nigeria', countryCode: 'NG', role: profile.role, isPremium: profile.membership_status === 'premium', referralCode: profile.referral_code, wallets: { availableBalance: 0, taskBalance: 0, referralBalance: 0, welcomePackBalance: 0, lifetimeEarnings: 0 }, stats: { totalTasksCompleted: 0, videosWatchedToday: 0, quizzesCompletedToday: 0, clicksCompletedToday: 0, chatMessagesToday: 0, talkingStagesCompleted: 0, referralsCount: 0, activeReferralsCount: 0, qualifiedReferralsCount: 0 }, createdAt: profile.created_at };
      setUser(mapped); setWallet(DEFAULT_WALLET); setCurrentPage('dashboard');
    }).catch(() => { saveSession(null); });
  }, []);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) setUser(parsed.user);
        if (parsed.wallet) setWallet(parsed.wallet);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.videos) setVideos(parsed.videos);
        if (parsed.quizzes) setQuizzes(parsed.quizzes);
        if (parsed.clickTasks) setClickTasks(parsed.clickTasks);
        if (parsed.referrals) setReferrals(parsed.referrals);
        if (parsed.withdrawals) setWithdrawals(parsed.withdrawals);
        if (parsed.loans) setLoans(parsed.loans);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.talkingStages) setTalkingStages(parsed.talkingStages);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
      }
    } catch {
      // Ignore parsing errors
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          wallet,
          transactions,
          videos,
          quizzes,
          clickTasks,
          referrals,
          withdrawals,
          loans,
          settings,
          talkingStages,
          chatMessages,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [user, wallet, transactions, videos, quizzes, clickTasks, referrals, withdrawals, loans, settings, talkingStages, chatMessages]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const session = await signIn(email.trim(), password);
      const profile = await loadProfile(session.user.id, session.access_token);
      const mapped: User = { id: profile.id, fullName: profile.full_name, username: profile.username, email: session.user.email || email, phone: profile.phone || '', country: profile.country || 'Nigeria', countryCode: 'NG', role: profile.role, isPremium: profile.membership_status === 'premium', referralCode: profile.referral_code, wallets: { availableBalance: 0, taskBalance: 0, referralBalance: 0, welcomePackBalance: 0, lifetimeEarnings: 0 }, stats: { totalTasksCompleted: 0, videosWatchedToday: 0, quizzesCompletedToday: 0, clicksCompletedToday: 0, chatMessagesToday: 0, talkingStagesCompleted: 0, referralsCount: 0, activeReferralsCount: 0, qualifiedReferralsCount: 0 }, createdAt: profile.created_at };
      setUser(mapped); setWallet(DEFAULT_WALLET); setCurrentPage('dashboard');
      addToast({ type: 'success', title: 'Welcome back', message: 'You are now signed in to MOVA.' });
      return true;
    } catch (error) { addToast({ type: 'error', title: 'Sign-in failed', message: error instanceof Error ? error.message : 'Please try again.' }); return false; }
  };

  const register = async (data: Partial<User>): Promise<boolean> => {
    try {
      const result = await signUp(data.email || '', String((data as any).password || ''), { full_name: data.fullName || '', username: data.username || '', phone: data.phone || '', country: data.country || 'Nigeria' });
      if (!result.access_token) { addToast({ type: 'success', title: 'Check your email', message: 'Confirm your email address, then sign in to MOVA.' }); setCurrentPage('login'); return true; }
      const profile = await loadProfile(result.user.id, result.access_token);
      const mapped: User = { id: profile.id, fullName: profile.full_name, username: profile.username, email: result.user.email || data.email || '', phone: profile.phone || '', country: profile.country || 'Nigeria', countryCode: data.countryCode || 'NG', role: profile.role, isPremium: profile.membership_status === 'premium', referralCode: profile.referral_code, wallets: { availableBalance: 0, taskBalance: 0, referralBalance: 0, welcomePackBalance: 0, lifetimeEarnings: 0 }, stats: { totalTasksCompleted: 0, videosWatchedToday: 0, quizzesCompletedToday: 0, clicksCompletedToday: 0, chatMessagesToday: 0, talkingStagesCompleted: 0, referralsCount: 0, activeReferralsCount: 0, qualifiedReferralsCount: 0 }, createdAt: profile.created_at };
      setUser(mapped); setWallet(DEFAULT_WALLET); setCurrentPage('dashboard');
      addToast({ type: 'success', title: 'Account created', message: 'Your MOVA account is ready. Your welcome bonus is displayed separately from withdrawable funds.' });
      return true;
    } catch (error) { addToast({ type: 'error', title: 'Registration failed', message: error instanceof Error ? error.message : 'Please try again.' }); return false; }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setCurrentPage('landing');
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely logged out.',
    });
  };

  const toggleRole = () => {
    addToast({ type: 'error', title: 'Admin access restricted', message: 'Administrator access must be assigned securely by the platform owner.' });
  };

  const activatePremium = async (_paymentMethod: string): Promise<boolean> => {
    addToast({ type: 'error', title: 'Payment confirmation required', message: 'Premium cannot be activated from the browser. An administrator must confirm the payment first.' });
    return false;
  };

  const completeVideoTask = (_videoId: string): boolean => {
    addToast({ type: 'info', title: 'Task rewards are being connected', message: 'Video completion will credit your wallet once MOVA server-side reward verification is enabled.' });
    return false;
  };

  const answerQuiz = (_quizId: string, _answerIndex: number) => {
    addToast({ type: 'info', title: 'Quiz rewards are being connected', message: 'Quiz scores can be previewed, but cash rewards are paused until server-side validation is enabled.' });
    return { isCorrect: false, reward: 0, explanation: 'Reward validation is not connected yet.' };
  };

  const completeClickTask = (_taskId: string): boolean => {
    addToast({ type: 'info', title: 'Task rewards are being connected', message: 'Task credits will be enabled after MOVA server-side verification is connected.' });
    return false;
  };

  const sendChatMessage = (recipientId: string, text: string) => {
    if (!text.trim() || !user) return;
    const newMsg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      senderId: user.id,
      text: text.trim(),
      timestamp: 'Just now',
      isRead: true,
    };

    setChatMessages((prev) => {
      const existing = prev[recipientId] || [];
      return {
        ...prev,
        [recipientId]: [...existing, newMsg],
      };
    });

    // Update talking stage progress if exists
    setTalkingStages((prev) =>
      prev.map((ts) => {
        if (ts.user.id === recipientId) {
          const newCount = ts.messagesCount + 1;
          const isReady = newCount >= ts.requiredMessages && ts.daysStreak >= ts.requiredDays;
          return {
            ...ts,
            messagesCount: newCount,
            status: isReady && ts.status === 'in_progress' ? 'ready_for_verification' : ts.status,
            lastActive: 'Just now',
          };
        }
        return ts;
      })
    );

    // Simulate realistic response after 1.5s
    setTimeout(() => {
      const recipient = chatUsers.find((u) => u.id === recipientId);
      const responses = [
        `That sounds fantastic! Glad to connect with you on MOVA.`,
        `Interesting perspective! How long have you been participating in digital communities?`,
        `I agree completely! Let me know if you want to collaborate on the daily milestones.`,
        `Nice talking to you from ${recipient?.country || 'here'}! Stay awesome.`,
      ];
      const botResponse: ChatMessage = {
        id: 'msg-reply-' + Math.random().toString(36).substring(2, 9),
        senderId: recipientId,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: 'Just now',
        isRead: false,
      };

      setChatMessages((prev) => {
        const existing = prev[recipientId] || [];
        return {
          ...prev,
          [recipientId]: [...existing, botResponse],
        };
      });
    }, 1500);
  };

  const claimTalkingStageReward = (_stageId: string): boolean => {
    addToast({ type: 'info', title: 'Reward review required', message: 'Talking-stage rewards are paused until server-side evidence review is connected.' });
    return false;
  };

  const requestWithdrawal = (
    amount: number,
    walletSource: 'task' | 'referral' | 'welcome_pack',
    bankName: string,
    accountNumber: string,
    accountName: string
  ): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Please sign in to request withdrawals.' };

    if (user.membershipStatus !== 'premium') {
      return {
        success: false,
        message: 'Account not activated. Please activate MOVA Premium (₦12,000) to enable withdrawals.',
      };
    }

    if (amount < settings.minWithdrawal) {
      return {
        success: false,
        message: `Minimum withdrawal amount is ₦${settings.minWithdrawal.toLocaleString()}.`,
      };
    }

    let currentSourceBalance = 0;
    if (walletSource === 'task') currentSourceBalance = wallet.taskBalance;
    else if (walletSource === 'referral') currentSourceBalance = wallet.referralBalance;
    else if (walletSource === 'welcome_pack') currentSourceBalance = wallet.welcomePackBalance;

    if (amount > currentSourceBalance && amount > wallet.availableBalance) {
      return {
        success: false,
        message: `Insufficient funds in selected wallet balance (Available: ₦${currentSourceBalance.toLocaleString()}).`,
      };
    }

    const ref = `MOV-WDR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Deduct balance
    setWallet((prev) => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
      taskBalance: walletSource === 'task' ? Math.max(0, prev.taskBalance - amount) : prev.taskBalance,
      referralBalance: walletSource === 'referral' ? Math.max(0, prev.referralBalance - amount) : prev.referralBalance,
    }));

    const newRequest: WithdrawalRequest = {
      id: 'wdr-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount,
      walletSource,
      bankName,
      accountNumber,
      accountName,
      status: 'pending',
      reference: ref,
      notes: 'Submitted for verification. Payout processed on weekdays.',
    };

    setWithdrawals((prev) => [newRequest, ...prev]);

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Withdrawal Request to ${bankName} (${accountNumber})`,
      amount,
      type: 'debit',
      category: 'withdrawal',
      reference: ref,
      status: 'pending',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: 'Withdrawal Submitted',
      message: `₦${amount.toLocaleString()} payout requested to ${bankName}. Under review.`,
    });

    return { success: true, message: 'Withdrawal successfully requested.' };
  };

  const applyForLoan = (
    _amount: number,
    _tenureMonths: number,
    _bankName: string,
    _accountNumber: string,
    _monthlyIncome: number,
    _employmentStatus: string
  ): { success: boolean; message: string } => {
    return { success: false, message: 'Loan applications are not accepting submissions yet. MOVA must connect secure member records, account verification and a lending partner before applications can be processed.' };
  };

  const simulateReferralSale = (_name?: string, _tier?: 1 | 2 | 3) => {
    addToast({ type: 'info', title: 'Referral credits are being connected', message: 'Referral commissions will be credited only after a real Premium payment is confirmed by the server.' });
  };

  const adminApproveWithdrawal = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'successful', notes: 'Payout approved & disbursed by admin.' } : w))
    );
    setTransactions((prev) =>
      prev.map((t) => (t.id.includes(id) || t.reference.includes(id) ? { ...t, status: 'completed' } : t))
    );
    addToast({
      type: 'success',
      title: 'Withdrawal Approved',
      message: 'Payout marked as successful and disbursed.',
    });
  };

  const adminRejectWithdrawal = (id: string) => {
    const item = withdrawals.find((w) => w.id === id);
    if (!item) return;

    // Refund wallet balance
    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance + item.amount,
      taskBalance: item.walletSource === 'task' ? prev.taskBalance + item.amount : prev.taskBalance,
      referralBalance: item.walletSource === 'referral' ? prev.referralBalance + item.amount : prev.referralBalance,
    }));

    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'rejected', notes: 'Rejected by admin. Funds refunded.' } : w))
    );
    addToast({
      type: 'info',
      title: 'Withdrawal Rejected',
      message: 'Withdrawal rejected and funds refunded to user.',
    });
  };

  const adminApproveLoan = (id: string) => {
    const loan = loans.find((l) => l.id === id);
    if (!loan) return;

    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'approved' } : l)));

    // Disburse to available balance
    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance + loan.amount,
    }));

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Approved Loan Disbursement (${loan.reference})`,
      amount: loan.amount,
      type: 'credit',
      category: 'loan',
      reference: loan.reference,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: 'Loan Approved & Disbursed',
      message: `₦${loan.amount.toLocaleString()} credited to user balance.`,
    });
  };

  const adminRejectLoan = (id: string) => {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'rejected' } : l)));
    addToast({
      type: 'info',
      title: 'Loan Rejected',
      message: 'Application marked as declined.',
    });
  };

  const adminUpdateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Platform reward values and rules updated without changing source code.',
    });
  };

  const adminAddVideo = (video: Omit<VideoTask, 'id' | 'isCompleted'>) => {
    const newVid: VideoTask = {
      ...video,
      id: 'vid-' + Math.random().toString(36).substring(2, 9),
      isCompleted: false,
    };
    setVideos((prev) => [newVid, ...prev]);
    addToast({
      type: 'success',
      title: 'Video Campaign Added',
      message: `"${video.title}" is now live for users.`,
    });
  };

  const adminAddQuiz = (quiz: Omit<QuizQuestion, 'id'>) => {
    const newQuiz: QuizQuestion = {
      ...quiz,
      id: 'quiz-' + Math.random().toString(36).substring(2, 9),
    };
    setQuizzes((prev) => [newQuiz, ...prev]);
    addToast({
      type: 'success',
      title: 'Quiz Question Added',
      message: 'New question added to daily quiz rotation.',
    });
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setCurrentPage('landing');
    setWallet(DEFAULT_WALLET);
    setTransactions([]);
    setVideos(INITIAL_VIDEOS);
    setQuizzes(INITIAL_QUIZ);
    setClickTasks(INITIAL_CLICKS);
    setReferrals([]);
    setWithdrawals([]);
    setLoans([]);
    setSettings(INITIAL_SETTINGS);
    addToast({
      type: 'info',
      title: 'Reset to Clean State',
      message: 'All platform balances and demo records have been restored.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        wallet,
        transactions,
        videos,
        quizzes,
        clickTasks,
        chatUsers,
        chatMessages,
        talkingStages,
        referrals,
        withdrawals,
        loans,
        settings,
        toasts,
        unreadNotifications,
        currentPage,
        setCurrentPage,
        addToast,
        removeToast,
        login,
        register,
        logout,
        toggleRole,
        activatePremium,
        completeVideoTask,
        answerQuiz,
        completeClickTask,
        sendChatMessage,
        claimTalkingStageReward,
        requestWithdrawal,
        applyForLoan,
        simulateReferralSale,
        adminApproveWithdrawal,
        adminRejectWithdrawal,
        adminApproveLoan,
        adminRejectLoan,
        adminUpdateSettings,
        adminAddVideo,
        adminAddQuiz,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
