import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Crown,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { signIn, signUp, quickDemoLogin, navigate, routeParams, showToast } = useShop();

  const [mode, setMode] = useState<'signin' | 'signup' | 'otp'>(
    routeParams.mode === 'signup' ? 'signup' : 'signin'
  );
  const [showPassword, setShowPassword] = useState(false);

  // Sign In fields (Email ID + Password)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sign Up fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // OTP Login fields
  const [otpPhone, setOtpPhone] = useState('+91 98201 54321');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = loginIdentifier.trim();
    if (!trimmedEmail || !loginPassword) {
      setErrorMsg('Please enter both Email ID and Password.');
      return;
    }

    setIsSigningIn(true);
    try {
      const res = await signIn(trimmedEmail, loginPassword);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }

      if (res.user?.role === 'admin') {
        navigate('admin');
      } else {
        navigate(routeParams.redirect || 'home');
      }
    } catch {
      setErrorMsg('Unable to sign in right now. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    const res = signUp({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    });
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }
    navigate(routeParams.redirect || 'home');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpPhone.trim()) return;
    setOtpSent(true);
    showToast('OTP Sent (Demo)', 'Use verification code 1234 to sign in', 'info');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (otpCode.trim() !== '1234') {
      setErrorMsg('Invalid OTP. For demo verification please enter 1234.');
      return;
    }
    const res = await signIn(otpPhone);
    if (res.success) {
      navigate(routeParams.redirect || 'home');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Left Brand Showcase Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                A
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight font-display">AURA</span>
                <span className="block text-[9px] uppercase tracking-widest text-indigo-300 -mt-1">
                  Private Client Portal
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Grand Shopping Privileges
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
                {mode === 'signup'
                  ? 'Begin Your First-Class Shopping Experience'
                  : 'Welcome Back to Your Curated Luxury Suite'}
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sign in to sync your shopping bag, track real-time air shipments, manage saved addresses, or manage storefront operations as an Administrator.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>First-time members receive 10% off via AURA10</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time Airway Bill shipment & OTP tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unified Customer & Admin Role Authentication</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Access Section */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block">
              Instant 1-Click Demo Sessions
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin('customer')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" /> Existing VIP Customer
                  </span>
                  <span className="text-[10px] text-slate-300 block">v.roy@imperial.in · Orders & Saved Addresses</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('admin')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/30 text-left text-xs transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Admin Executive Login
                  </span>
                  <span className="text-[10px] text-indigo-100 block">admin@aura.in · Full 16-Module Admin Console</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Auth Forms Panel */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account (New User)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('otp');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all cursor-pointer ${
                mode === 'otp'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              OTP Login
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-medium">
              {errorMsg}
            </div>
          )}

          {/* SIGN IN FORM (EMAIL LOGIN) */}
          {mode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Sign in to AURA
                </h2>
                <p className="text-slate-500 mt-0.5">
                  Enter your registered Email ID and Password.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={isSigningIn}
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. abimanyu@gmail.com or jk@yjktechnologies.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      showToast('Reset Link Dispatched', 'Contact your administrator if you forgot your password.', 'info')
                    }
                    className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isSigningIn}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSigningIn ? 'Signing In...' : 'Sign In Securely'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-slate-500 pt-2">
                New to AURA?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  Create a 1st-Time Account
                </button>
              </p>
            </form>
          )}

          {/* SIGN UP FORM (1st-Time User) */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Create Your AURA Account
                </h2>
                <p className="text-slate-500 mt-0.5">
                  Register as a new shopper and unlock <strong className="text-indigo-600">AURA10</strong> welcome privilege.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Priya Sundaram"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Create Password (min. 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Choose a secure password"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Create Account & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* OTP SIGN IN FORM */}
          {mode === 'otp' && (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4 text-xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  Passwordless Mobile OTP Login
                </h2>
                <p className="text-slate-500 mt-0.5">
                  Instant simulated SMS OTP verification for registered mobile numbers.
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Enter 4-Digit Verification Code (Demo: 1234)
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="1234"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white font-mono tracking-widest text-sm"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                {otpSent ? 'Verify OTP & Sign In' : 'Send Verification OTP'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};