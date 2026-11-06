'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Layers, 
  PlusCircle, 
  Receipt, 
  ShieldCheck, 
  Search,
  GraduationCap,
  User,
  LogOut,
  ChevronDown,
  Settings,
  Globe
} from 'lucide-react';
import { UserProfile } from '@/types';

interface NavbarProps {
  currentTab: 'public' | 'explore' | 'me' | 'creator' | 'orders';
  setCurrentTab: (tab: 'public' | 'explore' | 'me' | 'creator' | 'orders') => void;
  unlockedCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI: () => void;
  onOpenSettings?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  unlockedCount,
  cartCount,
  onOpenCart,
  onOpenAI,
  onOpenSettings,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1c1d24] bg-[#0c0d10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('public')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#181a20] border border-[#262833] flex items-center justify-center text-zinc-200">
                <GraduationCap className="w-4 h-4 text-zinc-300" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">
                  Araxie
                </span>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[#171920] text-zinc-400 border border-[#22242e]">
                  Campus
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search extensions, study packs, code templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121317] text-xs text-zinc-200 placeholder-zinc-500 pl-9 pr-20 py-2 rounded-lg border border-[#1e2027] focus:outline-none focus:border-zinc-500 transition"
              />
              <button
                onClick={onOpenAI}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-medium text-zinc-300 hover:text-white bg-[#191b22] hover:bg-[#20222a] border border-[#272935] px-2 py-0.5 rounded transition"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>

          {/* Navigation Items (Desktop & Tablet) */}
          <nav className="hidden sm:flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setCurrentTab('public')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'public'
                  ? 'bg-[#1e212b] text-white border border-[#292c3a]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15161b]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Public Space</span>
            </button>

            <button
              onClick={() => setCurrentTab('explore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'explore'
                  ? 'bg-[#1e212b] text-white border border-[#292c3a]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15161b]'
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => setCurrentTab('me')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition relative ${
                currentTab === 'me'
                  ? 'bg-[#1e212b] text-white border border-[#292c3a]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15161b]'
              }`}
            >
              <span>Student Dashboard</span>
              {unlockedCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {unlockedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('creator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'creator'
                  ? 'bg-[#1e212b] text-white border border-[#292c3a]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15161b]'
              }`}
            >
              Creator Studio
            </button>

            <button
              onClick={() => setCurrentTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'orders'
                  ? 'bg-[#1e212b] text-white border border-[#292c3a]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15161b]'
              }`}
            >
              Orders
            </button>
          </nav>

          {/* Right Action Icons: AI, Cart, User Profile */}
          <div className="flex items-center gap-2">
            
            {/* AI Concierge Trigger */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 text-xs font-medium bg-[#1a1c24] hover:bg-[#222530] text-zinc-200 px-3 py-1.5 rounded-lg border border-[#272935] transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Concierge</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-lg bg-[#121317] hover:bg-[#1a1c22] text-zinc-300 border border-[#1e2027] transition"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-200 text-black text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-[#14151b] hover:bg-[#1b1c24] border border-[#22242e] text-xs text-zinc-200 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-700"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="font-medium text-[11px] block text-white leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-zinc-400 block leading-none">
                      {currentUser.university.split(' ')[0]}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-zinc-500" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#121318] border border-[#22242e] shadow-2xl py-1 text-xs z-50">
                    <div className="px-3 py-2 border-b border-[#1c1d25]">
                      <p className="font-semibold text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {currentUser.role === 'student_creator' ? 'Student Creator' : 'Student Learner'}
                      </span>
                    </div>

                    <button
                      onClick={() => { setCurrentTab('public'); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-[#181920] flex items-center gap-1.5 transition"
                    >
                      <Globe className="w-3 h-3 text-blue-400" />
                      <span>Public Space (Main)</span>
                    </button>

                    <button
                      onClick={() => { setCurrentTab('me'); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-[#181920] transition"
                    >
                      Student Dashboard (@me Locker)
                    </button>

                    <button
                      onClick={() => { setCurrentTab('creator'); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-[#181920] transition"
                    >
                      Creator Studio
                    </button>

                    <button
                      onClick={() => { setCurrentTab('orders'); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-[#181920] transition"
                    >
                      Past Receipts
                    </button>

                    <button
                      onClick={() => { onOpenSettings?.(); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-[#181920] flex items-center gap-1.5 transition"
                    >
                      <Settings className="w-3 h-3 text-zinc-400" />
                      <span>Account Settings</span>
                    </button>

                    <div className="border-t border-[#1c1d25] my-1"></div>

                    <button
                      onClick={() => { onLogout(); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-[#181920] flex items-center gap-1.5 transition"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#20232d] hover:bg-[#2b2f3d] text-white border border-[#2c303f] flex items-center gap-1.5 transition"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
