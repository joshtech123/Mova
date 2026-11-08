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
import { INITIAL_SETTINGS, INITIAL_VIDEOS, INITIAL_QUIZ, INITIAL_CLICKS, INITIAL_CHAT_USERS } from '../data/mockData';

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
  login: (email: string) => boolean;
  register: (data: Partial<User>) => void;
  logout: () => void;
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

const DEFAULT_USER: User = {
  id: 'usr-oakaka',
  fullName: 'Oakaka Joshua',
  username: 'Oakaka',
  email: 'oakaka@mova.app',
  phone: '+2348012345678',
  country: 'Nigeria',
  countryCode: 'NG',
  membershipStatus: 'unactivated',
  referralCode: 'MOVA-OAKAKA',
  isVerified: true,
  role: 'user',
};

const DEFAULT_WALLET: WalletState = {
  availableBalance: 0,
  taskBalance: 0,
  referralBalance: 0,
  welcomePackBalance: 0,
  lifetimeEarnings: 0,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [wallet, setWallet] = useState<WalletState>(DEFAULT_WALLET);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [videos, setVideos] = useState<VideoTask[]>(INITIAL_VIDEOS);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(INITIAL_QUIZ);
  const [clickTasks, setClickTasks] = useState<ClickTask[]>(INITIAL_CLICKS);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>(INITIAL_CHAT_USERS);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    'usr-1': [
      { id: 'm1', senderId: 'usr-1', text: 'Hey Oakaka! Welcome to MOVA.', timestamp: '10:15 AM', isRead: true },
      { id: 'm2', senderId: 'usr-oakaka', text: 'Hello Amara! How are you doing today?', timestamp: '10:16 AM', isRead: true },
      { id: 'm3', senderId: 'usr-1', text: 'Doing great! Just wrapped up today’s video tasks.', timestamp: '10:18 AM', isRead: true },
    ],
    'usr-2': [
      { id: 'm4', senderId: 'usr-2', text: 'Akwaaba brother! Connecting from Accra.', timestamp: 'Yesterday', isRead: true },
    ],
  });
  const [talkingStages, setTalkingStages] = useState<TalkingStagePartner[]>([
    {
      id: 'ts-1',
      user: INITIAL_CHAT_USERS[0],
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
      user: INITIAL_CHAT_USERS[1],
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

  const login = (email: string) => {
    if (email.toLowerCase().includes('admin')) {
      setUser({
        ...DEFAULT_USER,
        email,
        role: 'admin',
        fullName: 'MOVA Platform Admin',
        username: 'Admin',
      });
    } else {
      setUser(DEFAULT_USER);
    }
    addToast({
      type: 'success',
      title: 'Welcome Back',
      message: `Signed in as ${user?.username || 'Oakaka'}`,
    });
    return true;
  };

  const register = (data: Partial<User>) => {
    const newUser: User = {
      ...DEFAULT_USER,
      ...data,
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      membershipStatus: 'unactivated',
      role: 'user',
      referralCode: `MOVA-${(data.username || 'USER').toUpperCase()}`,
      isVerified: true,
    };
    setUser(newUser);
    // Reset wallet to zero as instructed (no fictitious welcome bonuses)
    setWallet(DEFAULT_WALLET);
    setTransactions([]);
    addToast({
      type: 'success',
      title: 'Account Created Successfully',
      message: 'Welcome to MOVA! Explore activities and unlock premium rewards.',
    });
    setCurrentPage('dashboard');
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('landing');
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been safely logged out.',
    });
  };

  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setUser({ ...user, role: newRole });
    addToast({
      type: 'info',
      title: `Switched to ${newRole.toUpperCase()} Mode`,
      message: newRole === 'admin' ? 'You have access to the Admin Dashboard' : 'Viewing as standard member',
    });
  };

  const activatePremium = async (paymentMethod: string): Promise<boolean> => {
    if (!user) return false;
    const fee = settings.premiumFee; // ₦12,000
    const ref = `MOV-ACT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Update user status
    setUser((prev) => (prev ? { ...prev, membershipStatus: 'premium', activatedAt: new Date().toISOString() } : null));

    // Log transaction
    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `MOVA Premium One-Time Activation (${paymentMethod})`,
      amount: fee,
      type: 'debit',
      category: 'upgrade',
      reference: ref,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: '🎉 Premium Activated!',
      message: `You are now a MOVA Premium Member. Task earnings & withdrawals are fully unlocked!`,
    });

    return true;
  };

  const completeVideoTask = (videoId: string): boolean => {
    const video = videos.find((v) => v.id === videoId);
    if (!video || video.isCompleted) return false;

    const reward = settings.videoReward; // ₦2,000
    const ref = `MOV-VID-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    setVideos((prev) => prev.map((v) => (v.id === videoId ? { ...v, isCompleted: true } : v)));

    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance + reward,
      taskBalance: prev.taskBalance + reward,
      lifetimeEarnings: prev.lifetimeEarnings + reward,
    }));

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Video Task Reward: "${video.title.slice(0, 28)}..."`,
      amount: reward,
      type: 'credit',
      category: 'video',
      reference: ref,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'reward',
      title: '₦2,000 Credited!',
      message: 'Video viewing time verified. Reward added to your balance.',
    });

    return true;
  };

  const answerQuiz = (quizId: string, answerIndex: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return { isCorrect: false, reward: 0, explanation: '' };

    const isCorrect = answerIndex === quiz.correctIndex;
    const reward = isCorrect ? settings.quizReward : 0; // ₦1,000 only for correct answers

    if (isCorrect) {
      const ref = `MOV-QZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setWallet((prev) => ({
        ...prev,
        availableBalance: prev.availableBalance + reward,
        taskBalance: prev.taskBalance + reward,
        lifetimeEarnings: prev.lifetimeEarnings + reward,
      }));

      const newTx: Transaction = {
        id: 'tx-' + Math.random().toString(36).substring(2, 9),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: `Quiz Correct Answer: "${quiz.question.slice(0, 26)}..."`,
        amount: reward,
        type: 'credit',
        category: 'quiz',
        reference: ref,
        status: 'completed',
      };
      setTransactions((prev) => [newTx, ...prev]);

      addToast({
        type: 'reward',
        title: 'Correct! ₦1,000 Won',
        message: 'Your answer is verified and credited to your available balance.',
      });
    } else {
      addToast({
        type: 'error',
        title: 'Incorrect Answer',
        message: 'Only correct answers qualify for rewards. Try the next question!',
      });
    }

    return { isCorrect, reward, explanation: quiz.explanation };
  };

  const completeClickTask = (taskId: string): boolean => {
    const task = clickTasks.find((t) => t.id === taskId);
    if (!task || task.isCompleted) return false;

    const reward = settings.clickReward; // ₦1,000
    const ref = `MOV-CLK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    setClickTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true } : t)));

    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance + reward,
      taskBalance: prev.taskBalance + reward,
      lifetimeEarnings: prev.lifetimeEarnings + reward,
    }));

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Sponsored Click Task: "${task.title.slice(0, 26)}..."`,
      amount: reward,
      type: 'credit',
      category: 'click',
      reference: ref,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'reward',
      title: '₦1,000 Credited!',
      message: 'Sponsored campaign engagement verified.',
    });

    return true;
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

  const claimTalkingStageReward = (stageId: string): boolean => {
    const stage = talkingStages.find((ts) => ts.id === stageId);
    if (!stage || stage.status !== 'ready_for_verification') return false;

    const reward = settings.talkingStageReward; // ₦5,000
    const ref = `MOV-TALK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    setTalkingStages((prev) => prev.map((ts) => (ts.id === stageId ? { ...ts, status: 'claimed' } : ts)));

    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance + reward,
      taskBalance: prev.taskBalance + reward,
      lifetimeEarnings: prev.lifetimeEarnings + reward,
    }));

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Talking Stage Milestone Verified with @${stage.user.username}`,
      amount: reward,
      type: 'credit',
      category: 'talking_stage',
      reference: ref,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'reward',
      title: '₦5,000 Milestone Paid!',
      message: 'Talking stage milestone verified and credited.',
    });

    return true;
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
    amount: number,
    tenureMonths: number,
    bankName: string,
    accountNumber: string,
    monthlyIncome: number,
    employmentStatus: string
  ): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Please log in to apply for a loan.' };

    if (user.membershipStatus !== 'premium') {
      return {
        success: false,
        message: 'Loan applications are exclusive to activated MOVA Premium members.',
      };
    }

    if (amount > 500000) {
      return {
        success: false,
        message: 'Maximum loan amount limit is ₦500,000.',
      };
    }

    const interestRate = 0.05; // 5% flat annual
    const totalRepayment = Math.round(amount * (1 + interestRate * (tenureMonths / 12)));
    const monthlyRepayment = Math.round(totalRepayment / tenureMonths);
    const ref = `MOV-LOAN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newLoan: LoanApplication = {
      id: 'loan-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount,
      tenureMonths,
      monthlyRepayment,
      totalRepayment,
      interestRate: 5,
      status: 'pending',
      bankName,
      accountNumber,
      monthlyIncome,
      employmentStatus,
      reference: ref,
    };

    setLoans((prev) => [newLoan, ...prev]);

    addToast({
      type: 'success',
      title: 'Loan Application Submitted',
      message: `₦${amount.toLocaleString()} application received. Assessment in progress.`,
    });

    return { success: true, message: 'Application submitted successfully.' };
  };

  const simulateReferralSale = (name = 'Chidi Nnamdi', tier: 1 | 2 | 3 = 1) => {
    let commission = settings.directReferralCommission; // ₦9,000
    if (tier === 2) commission = settings.firstIndirectCommission; // ₦300
    if (tier === 3) commission = settings.secondIndirectCommission; // ₦100

    const ref = `MOV-REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newRef: ReferralItem = {
      id: 'ref-' + Math.random().toString(36).substring(2, 9),
      fullName: name,
      username: name.toLowerCase().replace(/\s+/g, '_'),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tier,
      commission,
      status: 'active',
    };

    setReferrals((prev) => [newRef, ...prev]);

    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance + commission,
      referralBalance: prev.referralBalance + commission,
      lifetimeEarnings: prev.lifetimeEarnings + commission,
    }));

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: `Tier ${tier} Referral Commission (${name})`,
      amount: commission,
      type: 'credit',
      category: 'referral',
      reference: ref,
      status: 'completed',
    };
    setTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'reward',
      title: `₦${commission.toLocaleString()} Referral Bonus!`,
      message: `Tier ${tier} activation reward earned from ${name}.`,
    });
  };

  // Admin Actions
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
    setUser(DEFAULT_USER);
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
