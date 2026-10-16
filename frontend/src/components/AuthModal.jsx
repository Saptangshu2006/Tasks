import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Lock, Mail, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setLocalError('');
    setSubmitting(true);
    const demoEmail = 'alex.morgan@example.com';
    const demoPassword = 'password123';
    try {
      // First try to login
      await login(demoEmail, demoPassword);
    } catch {
      // If demo user doesn't exist yet, auto-register demo user
      try {
        await register('Alex Morgan', demoEmail, demoPassword);
      } catch (regErr) {
        setLocalError(regErr.message || 'Demo login failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-3">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to TaskPulse
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize, prioritize, and filter your daily tasks seamlessly.
          </p>
        </div>

        {/* Demo Fast Login Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition duration-150 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>1-Click Demo Login</span>
          </button>
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-slate-400 font-medium">
              Or with your account
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setLocalError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              !isRegister
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setLocalError('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isRegister
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {localError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Minimum 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition duration-150 cursor-pointer disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isRegister ? 'Register & Get Started' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
