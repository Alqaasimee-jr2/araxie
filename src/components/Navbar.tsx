'use client';

import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Layers, 
  PlusCircle, 
  Receipt, 
  ShieldCheck, 
  Search,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'explore' | 'me' | 'creator' | 'orders';
  setCurrentTab: (tab: 'explore' | 'me' | 'creator' | 'orders') => void;
  unlockedCount: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAI: () => void;
  onOpenPayPalConfig: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  unlockedCount,
  cartCount,
  onOpenCart,
  onOpenAI,
  onOpenPayPalConfig,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#1f2331] bg-[#090a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('explore')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition">
                    Araxie
                  </span>
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Campus Whop
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                  Student Digital Marketplace
                </p>
              </div>
            </button>
          </div>

          {/* Search Bar with AI Quick Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition" />
              <input
                type="text"
                placeholder="Search student tools, extensions, study packs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12141c] text-sm text-zinc-200 placeholder-zinc-500 pl-10 pr-24 py-2 rounded-xl border border-[#212534] focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition"
              />
              <button
                onClick={onOpenAI}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-medium bg-gradient-to-r from-blue-600/20 to-indigo-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg transition"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentTab('explore')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                currentTab === 'explore'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161822]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>

            <button
              onClick={() => setCurrentTab('me')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition relative ${
                currentTab === 'me'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161822]'
              }`}
            >
              <span>@me Locker</span>
              {unlockedCount > 0 && (
                <span className="w-4 h-4 text-[10px] font-bold rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  {unlockedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('creator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                currentTab === 'creator'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161822]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Creator Studio</span>
              <span className="sm:hidden">Sell</span>
            </button>

            <button
              onClick={() => setCurrentTab('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                currentTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#161822]'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Orders</span>
            </button>
          </nav>

          {/* Right Action Icons: AI Concierge, PayPal Sandbox, Cart */}
          <div className="flex items-center gap-2">
            
            {/* AI Concierge Trigger Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-xl shadow-md shadow-blue-600/20 transition transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span className="hidden sm:inline">AI Concierge</span>
            </button>

            {/* PayPal Sandbox Status Badge */}
            <button
              onClick={onOpenPayPalConfig}
              title="PayPal Sandbox Configuration"
              className="flex items-center gap-1.5 text-[11px] bg-[#141722] hover:bg-[#1a1f2e] text-zinc-300 border border-[#23283a] px-2.5 py-1.5 rounded-xl transition"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-emerald-400">PayPal</span>
              <span className="text-zinc-400 text-[10px] hidden lg:inline">Sandbox</span>
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-[#12141c] hover:bg-[#1a1d29] text-zinc-300 border border-[#212534] transition"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-[#090a0f]">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
