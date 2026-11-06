'use client';

import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('Stanford University \'26');
  const [role, setRole] = useState<'student_buyer' | 'student_creator'>('student_buyer');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' 
        ? { email, password }
        : { email, password, name, university, role };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication error';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google OAuth error';
      setError(`${msg} (Ensure Google Provider is active in your Supabase dashboard).`);
    }
  };

  const handleEvaluatorSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'judge.sandbox@araxie.edu', password: 'PayPalHackathon2026!' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluator login failed');
      onLoginSuccess(data.user);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-[#0e0f13] border border-[#1e2027] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1a1c22] flex items-center justify-between bg-[#121317]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#181a20] border border-[#23252f] flex items-center justify-center text-zinc-300">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Campus Passport</h3>
              <p className="text-[11px] text-zinc-400">
                Sign in to Araxie student digital economy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1c24] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle: Sign In vs Create Account */}
        <div className="p-5 space-y-4 text-xs">
          <div className="flex rounded-lg bg-[#14151a] p-1 border border-[#1e2027]">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${
                mode === 'login'
                  ? 'bg-[#222530] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${
                mode === 'register'
                  ? 'bg-[#222530] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* 1-Click Judge / Evaluator Demo Pass */}
          <button
            onClick={handleEvaluatorSignIn}
            disabled={isLoading}
            type="button"
            className="w-full py-2.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 font-semibold text-xs border border-emerald-500/30 flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>⚡ One-Click Hackathon Evaluator Sign-In</span>
          </button>

          {/* Continue with Google (Supabase OAuth) */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full py-2.5 rounded-lg bg-[#16171e] hover:bg-[#1e202a] text-zinc-200 font-medium text-xs border border-[#252834] flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-[#1c1d25] flex-1"></div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">or with university email</span>
            <div className="h-px bg-[#1c1d25] flex-1"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Lee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#131419] border border-[#1e2027] text-white p-2 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-zinc-400">University</label>
                    <select
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full bg-[#131419] border border-[#1e2027] text-white p-2 rounded-lg focus:outline-none"
                    >
                      <option value="Stanford University '26">Stanford University</option>
                      <option value="MIT '25">MIT</option>
                      <option value="UC Berkeley '26">UC Berkeley</option>
                      <option value="Harvard University '26">Harvard University</option>
                      <option value="Johns Hopkins '27">Johns Hopkins</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400">Primary Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'student_buyer' | 'student_creator')}
                      className="w-full bg-[#131419] border border-[#1e2027] text-white p-2 rounded-lg focus:outline-none"
                    >
                      <option value="student_buyer">Student Learner</option>
                      <option value="student_creator">Student Creator</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-zinc-400">University Email (.edu)</label>
              <input
                type="email"
                required
                placeholder="your.name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131419] border border-[#1e2027] text-white p-2 rounded-lg focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#131419] border border-[#1e2027] text-white p-2 rounded-lg focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#222530] hover:bg-[#2c303f] disabled:opacity-50 text-white font-medium text-xs border border-[#34394b] transition flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Student Pass'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
