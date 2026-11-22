import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/common/Logo';
import { Mail, Lock, User, KeyRound, ArrowRight, LoaderCircle, Moon, Sun } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
}

const COUNTRIES = [
  { name: 'Nigeria', code: 'NG', dial: '+234' },
  { name: 'Ghana', code: 'GH', dial: '+233' },
  { name: 'Kenya', code: 'KE', dial: '+254' },
  { name: 'South Africa', code: 'ZA', dial: '+27' },
  { name: 'United Kingdom', code: 'GB', dial: '+44' },
  { name: 'United States', code: 'US', dial: '+1' },
  { name: 'Canada', code: 'CA', dial: '+1' },
];

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { login, register, setCurrentPage, addToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('mova-theme') === 'dark');
  React.useEffect(() => { document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light'); }, [darkMode]);
  const toggleTheme = () => { const next = !darkMode; setDarkMode(next); localStorage.setItem('mova-theme', next ? 'dark' : 'light'); };

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !username || !email || !phone || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const selectedCountry = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0];
    setIsSubmitting(true);
    try {
      const created = await register({ fullName, username, email, phone, country, countryCode: selectedCountry.code, referredBy: referralCode.trim() || undefined, password } as any);
      if (!created) {
        setError('We could not create your account. Check the error notification and try again.');
      } else {
        // If email confirmation is enabled, registration succeeds without a session.
        // Keep the member on the sign-in form so they can return after confirming.
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        setError('Your account has been created. Confirm your email, then sign in to access your ₦9,100 welcome bonus.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try { const signedIn = await login(email, password); if (!signedIn) setError('Sign-in failed. Check your details and try again.'); } finally { setIsSubmitting(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email.');
      return;
    }
    setError('Password reset is not available yet. Please contact MOVA support.');
  };

  return (
    <div className="mova-auth min-h-screen flex flex-col justify-center py-10 sm:py-12 px-3 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="mova-auth-glow mova-auth-glow-one" aria-hidden="true" />
      <div className="mova-auth-glow mova-auth-glow-two" aria-hidden="true" />
      <button type="button" onClick={toggleTheme} aria-label="Toggle colour theme" title="Toggle light and dark mode" className="mova-theme-button fixed top-5 right-5 z-20 w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-700 flex items-center justify-center shadow-sm">{darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</button>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <div className="inline-block cursor-pointer" onClick={() => setCurrentPage('landing')}>
          <Logo size="lg" showTagline={true} />
        </div>

        <h2 className="mt-6 text-2xl font-extrabold text-slate-900 tracking-tight">
          {mode === 'login' && 'Sign in to your account'}
          {mode === 'register' && 'Create your MOVA account'}
          {mode === 'forgot' && 'Reset your password'}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">
          {mode === 'login' && (
            <span>
              Don't have an account yet?{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setCurrentPage('register');
                  setError('');
                }}
                className="font-bold text-[#0056FD] hover:underline"
              >
                Register here
              </button>
            </span>
          )}
          {mode === 'register' && (
            <span>
              Already registered?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setCurrentPage('login');
                  setError('');
                }}
                className="font-bold text-[#0056FD] hover:underline"
              >
                Sign in here
              </button>
            </span>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="mova-auth-card bg-white/95 backdrop-blur-xl py-7 sm:py-8 px-5 sm:px-8 shadow-2xl rounded-[28px] border border-slate-100 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setCurrentPage('forgot');
                      setError('');
                    }}
                    className="text-xs font-semibold text-[#0056FD] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3.5 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-[#0056FD] hover:bg-[#0047D4] shadow-md shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-60 disabled:cursor-wait"
                >
                  {isSubmitting ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>

              
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="off"
                    className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="Choose a username"
                    autoComplete="off"
                    className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD] bg-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.dial})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="off"
                    className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    autoComplete="off"
                    className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Referral Code <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MOVA-OAKAKA"
                  className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-[#0056FD] hover:bg-[#0047D4] shadow-md shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-60 disabled:cursor-wait"
                >
                  {isSubmitting ? <><LoaderCircle className="w-4 h-4 animate-spin" /> Creating account...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-normal">
                By registering, you agree to MOVA terms of service and acknowledge that task rewards require verified
                completion.
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 text-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Reset Account Password</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your email address and we'll dispatch password recovery instructions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full px-3.5 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0056FD]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-[#FF6B00] hover:bg-[#e65c00] shadow-md"
              >
                <span>Send Reset Link</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('login'); setCurrentPage('login'); }}
                className="w-full text-xs text-slate-500 hover:text-slate-800 text-center block pt-2"
              >
                ← Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
