export type MembershipStatus = 'unactivated' | 'premium';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  membershipStatus: MembershipStatus;
  isPremium: boolean;
  activatedAt?: string;
  referralCode: string;
  referredBy?: string;
  isVerified: boolean;
  avatarUrl?: string;
  role: 'user' | 'admin';
}

export interface WalletState {
  availableBalance: number;
  taskBalance: number;
  referralBalance: number;
  welcomePackBalance: number;
  lifetimeEarnings: number;
}

export type TransactionCategory =
  | 'video'
  | 'quiz'
  | 'click'
  | 'talking_stage'
  | 'daily_task'
  | 'game'
  | 'referral'
  | 'upgrade'
  | 'withdrawal'
  | 'loan';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: TransactionCategory;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface VideoTask {
  id: string;
  title: string;
  durationSeconds: number;
  reward: number;
  category: string;
  thumbnail: string;
  videoUrl: string;
  isCompleted: boolean;
  sponsor: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  reward: number;
  category: string;
  explanation: string;
}

export interface ClickTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  url: string;
  sponsor: string;
  category: string;
  minStaySeconds: number;
  isCompleted: boolean;
}

export interface ChatUser {
  id: string;
  name: string;
  username: string;
  country: string;
  countryFlag: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  bio?: string;
  isBlocked?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface TalkingStagePartner {
  id: string;
  user: ChatUser;
  messagesCount: number;
  requiredMessages: number;
  daysStreak: number;
  requiredDays: number;
  status: 'in_progress' | 'ready_for_verification' | 'verified' | 'claimed';
  rewardAmount: number;
  lastActive: string;
}

export interface ReferralItem {
  id: string;
  fullName: string;
  username: string;
  date: string;
  tier: 1 | 2 | 3;
  commission: number;
  status: 'active' | 'pending';
}

export interface WithdrawalRequest {
  id: string;
  date: string;
  amount: number;
  walletSource: 'task' | 'referral' | 'welcome_pack';
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'under_review' | 'approved' | 'processing' | 'successful' | 'rejected';
  reference: string;
  notes?: string;
}

export interface LoanApplication {
  id: string;
  date: string;
  amount: number;
  tenureMonths: number;
  monthlyRepayment: number;
  totalRepayment: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  bankName: string;
  accountNumber: string;
  monthlyIncome: number;
  employmentStatus: string;
  reference: string;
}

export interface PlatformSettings {
  premiumFee: number;
  videoReward: number;
  quizReward: number;
  clickReward: number;
  chatDailyReward: number;
  talkingStageReward: number;
  dailyTaskReward: number;
  directReferralCommission: number;
  firstIndirectCommission: number;
  secondIndirectCommission: number;
  minWithdrawal: number;
  withdrawalEnabled: boolean;
  maxDailyEarningsLimit: number;
}
