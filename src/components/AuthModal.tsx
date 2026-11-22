import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Globe2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  KeyRound,
} from 'lucide-react';
import { MovaLogo } from './MovaLogo';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
}) => {
  const { login, register, switchUser, setActiveNavTab, addToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'verify_otp' | 'forgot_password'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    // Move to simulated OTP verification
    setMode('verify_otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const ok = await register({
      fullName, username, email, phone, country, password,
      referralCode: referralCode || undefined,
    } as any);
    if (ok) { onClose(); setActiveNavTab('dashboard'); }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginInput.trim()) {
      setErrorMsg('Please enter your email or username.');
      return;
    }

    const ok = await login(loginInput, password);
    if (ok) { onClose(); setActiveNavTab('dashboard'); }
  };

  const handleQuickDemo = (userId: string) => {
    switchUser(userId);
    onClose();
    setActiveNavTab('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 z-10 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo */}
        <div className="text-center mb-5">
          <MovaLogo size="md" showTagline={true} className="justify-center" />
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {mode === 'login' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Welcome Back</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sign in to your MOVA member account</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Username or Email</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oakaka or oakaka@mova.ng"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot_password')}
                    className="text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all"
              >
                Sign In to Dashboard
              </button>
            </form>

            {/* Quick Demo Logins for review */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-2">
                Instant Reviewer Demo Accounts
              </span>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('user_oakaka')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-center"
                >
                  Oakaka (₦0)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('user_halima')}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 font-bold text-emerald-800 text-center"
                >
                  Halima (Premium)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('user_admin')}
                  className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 font-bold text-purple-800 text-center"
                >
                  Admin Master
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 pt-2">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-blue-600 hover:underline"
              >
                Register Free
              </button>
            </div>
          </div>
        )}

        {/* 2. REGISTRATION MODE */}
        {mode === 'register' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Create Free MOVA Account</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Join thousands of members earning and connecting globally
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oakaka Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oakaka"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
                  >
                    <option value="Nigeria">Nigeria 🇳🇬</option>
                    <option value="Ghana">Ghana 🇬🇭</option>
                    <option value="South Africa">South Africa 🇿🇦</option>
                    <option value="Kenya">Kenya 🇰🇪</option>
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="United States">United States 🇺🇸</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 08012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HALIMA99"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono uppercase"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all mt-2"
              >
                Continue to Verification
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* 3. OTP VERIFICATION */}
        {mode === 'verify_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-center text-xs">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Verify Your Account</h3>
              <p className="text-xs text-slate-500 mt-1">
                We sent a 6-digit confirmation code to <strong>{phone || email}</strong>
              </p>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="1 2 3 4 5 6"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-48 mx-auto text-center font-mono font-black text-xl tracking-widest py-2 rounded-xl border border-slate-300"
              />
              <span className="text-[11px] text-slate-400 block mt-1.5">
                (Enter any 6 digits for instant demo verification)
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
            >
              Verify & Open Dashboard
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD */}
        {mode === 'forgot_password' && (
          <div className="space-y-4 text-xs">
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">Reset Your Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your registered email or phone to receive a reset code.
              </p>
            </div>

            <input
              type="text"
              placeholder="Registered email or phone"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
            />

            <button
              type="button"
              onClick={() => {
                addToast('success', 'Reset Code Sent', 'Check your messages for password instructions.');
                setMode('login');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              Send Reset Code
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center font-bold text-slate-500 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
