export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  avatar?: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  premiumActivatedAt?: string;
  referralCode: string;
  referredBy?: string;
  wallets: {
    availableBalance: number;
    taskBalance: number;
    referralBalance: number;
    welcomePackBalance: number;
    lifetimeEarnings: number;
  };
  stats: {
    totalTasksCompleted: number;
    videosWatchedToday: number;
    quizzesCompletedToday: number;
    clicksCompletedToday: number;
    chatMessagesToday: number;
    talkingStagesCompleted: number;
    referralsCount: number;
    activeReferralsCount: number;
    qualifiedReferralsCount: number;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    isVerified: boolean;
  };
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  durationSeconds: number;
  rewardAmount: number; // e.g. 2000
  thumbnail: string;
  videoUrl: string;
  publisher: string;
  views: number;
  isAvailable: boolean;
  completedToday?: boolean;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  rewardAmount: number; // e.g. 1000
  category: string;
  completedToday?: boolean;
}

export interface ClickTaskItem {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  targetUrl: string;
  requiredWaitSeconds: number; // e.g. 15
  rewardAmount: number; // e.g. 1000
  category: string;
  isAvailable: boolean;
  completedToday?: boolean;
}

export interface TalkingStageItem {
  id: string;
  partnerName: string;
  partnerUsername: string;
  partnerAvatar: string;
  partnerCountry: string;
  startDate: string;
  daysActive: number;
  messagesCount: number;
  milestoneStatus: 'active' | 'under_review' | 'approved' | 'rejected';
  rewardAmount: number; // e.g. 5000
  proofStory?: string;
  mutualConfirmed: boolean;
  submittedAt?: string;
  verifiedAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderCountry: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  username: string;
  avatar: string;
  country: string;
  isOnline: boolean;
  lastSeen: string;
  bio?: string;
  talkingStageEligible?: boolean;
}

export interface DailyTaskItem {
  id: string;
  title: string;
  description: string;
  rewardAmount: number; // e.g. 1000
  category: string;
  requiredProof: 'link' | 'click' | 'text';
  isCompleted: boolean;
}

export interface GameItem {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  rewardRange: string;
  playsRemainingToday: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  walletType: 'task' | 'referral' | 'welcome';
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'under_review' | 'approved' | 'processing' | 'successful' | 'rejected';
  rejectionReason?: string;
  reference: string;
  fee: number;
  netPayout: number;
  createdAt: string;
  processedAt?: string;
}

export interface LoanApplication {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  monthlyIncome: number;
  employmentStatus: string;
  bvn: string;
  nin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  interestRate: number; // e.g. 5%
  monthlyRepayment: number;
  totalRepayment: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed' | 'repaid';
  adminNotes?: string;
  appliedAt: string;
  reviewedAt?: string;
}

export interface PremiumPaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number; // 12000
  method: 'bank_transfer';
  reference: string;
  proofNote?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type:
    | 'video_reward'
    | 'quiz_reward'
    | 'click_reward'
    | 'chat_reward'
    | 'talking_stage_reward'
    | 'game_reward'
    | 'daily_task_reward'
    | 'referral_direct'
    | 'referral_indirect_1'
    | 'referral_indirect_2'
    | 'welcome_pack'
    | 'premium_activation'
    | 'withdrawal'
    | 'loan_disbursement';
  description: string;
  amount: number; // positive for credit, negative for debit
  wallet: 'task' | 'referral' | 'welcome' | 'main';
  reference: string;
  date: string;
  status: 'successful' | 'pending' | 'rejected';
}

export interface PlatformSettings {
  premiumActivationFee: number; // ₦12,000
  directReferralCommission: number; // ₦9,000
  indirectReferral1Commission: number; // ₦300
  indirectReferral2Commission: number; // ₦100
  welcomePackReward: number; // ₦10,000 conditional
  videoRewardAmount: number; // ₦2,000
  quizRewardAmount: number; // ₦1,000
  clickRewardAmount: number; // ₦1,000
  chatDailyRewardAmount: number; // ₦2,000
  talkingStageRewardAmount: number; // ₦5,000
  dailyTaskRewardAmount: number; // ₦1,000
  minWithdrawalAmount: number; // configurable e.g. ₦5,000
  withdrawalFeePercentage: number; // 1.5%
  withdrawalFlatFee: number; // ₦100
  maxDailyEarningCap: number; // ₦50,000 conditional cap
  maxDailyVideos: number; // 5
  maxDailyQuizzes: number; // 5
  maxDailyClicks: number; // 5
  tutorialVideoUrl: string;
  tutorialTitle: string;
  tutorialSubtitle: string;
  companyBankName: string;
  companyAccountNumber: string;
  companyAccountName: string;
}

export interface PlatformStats {
  totalPlatformRevenue: number;
  totalPaidOut: number;
  pendingWithdrawalsLiability: number;
  unclaimedTaskLiabilities: number;
  totalActiveMembers: number;
  totalPremiumMembers: number;
}
