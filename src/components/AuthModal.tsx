import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    authPromptReason,
    closeAuthModal,
    openAuthModal,
    login,
    register
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(authModalMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode with prop
  React.useEffect(() => {
    setMode(authModalMode);
    setError(null);
    setSuccessMessage(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in. Please verify your credentials.');
        }
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        const res = await register(name, email, password);
        if (!res.success) {
          setError(res.error || 'Registration failed. Please try again.');
        }
      } else if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          setSuccessMessage(data.message || 'Reset request received. Check your inbox.');
        } else {
          setError(data.error || 'Failed to request password reset.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('nexa.com.in21@gmail.com');
    setPassword('nexa-admin-2026');
    setError(null);
  };

  return (
    <div
      id="nexa-auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        id="nexa-auth-modal-dialog"
        className="w-full max-w-md bg-[#060c18] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-cyan-950/90 via-blue-950/80 to-slate-950 px-6 py-4 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider block">
                NEXA Identity Security
              </span>
              <h3 className="text-sm font-bold text-white">
                {mode === 'login' ? 'Sign In to NEXA' : mode === 'register' ? 'Create Official Account' : 'Account Recovery'}
              </h3>
            </div>
          </div>
          <button
            id="auth-modal-close-btn"
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason Banner if triggered by download or protected feature */}
        {authPromptReason && (
          <div className="bg-cyan-950/40 border-b border-cyan-500/20 px-6 py-3 flex items-start gap-2.5 text-xs text-cyan-200">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-cyan-400 mt-0.5" />
            <span>{authPromptReason}</span>
          </div>
        )}

        {/* Tab Switcher */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-2 bg-slate-950/60 border-b border-slate-800">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min. 6 characters)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30"
                />
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-slate-950 font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Verifying...'
                  : mode === 'login'
                  ? 'Sign In & Access'
                  : mode === 'register'
                  ? 'Create Account'
                  : 'Send Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {mode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* Admin quick login badge */}
          {mode === 'login' && (
            <div className="pt-2 border-t border-slate-800/80 text-center">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5"
              >
                <Shield className="w-3 h-3 text-cyan-500" />
                <span>NEXA Admin? Autofill credentials</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
          Official Domain: <span className="text-slate-400 font-mono">nexa.com.in</span> &bull; Support: <span className="text-slate-400 font-mono">nexa.com.in21@gmail.com</span>
        </div>
      </div>
    </div>
  );
};
