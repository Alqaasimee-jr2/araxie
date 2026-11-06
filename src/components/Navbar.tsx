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
    <header className="sticky top-0 z-40 w-full border-b border-[#1c1d24] bg-[#0c0d10]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-4">
          
          {/* Logo & Brand (Clean, Muted) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('explore')}
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

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setCurrentTab('explore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === 'explore'
                  ? 'bg-[#1e212b] text-white border border-[#292c3a]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15161b]'
              }`}
            >
              Explore
            </button>

            <button
              onClick={() => setCurrentTab('me')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition relative ${
                currentTab === 'me'
                  ? 'bg-[#1e212b] text-white border border-[#292c3a]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#15161b]'
              }`}
            >
              <span>@me Locker</span>
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

          {/* Right Action Icons: AI, Sandbox Status, Cart */}
          <div className="flex items-center gap-2">
            
            {/* AI Concierge Trigger */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1.5 text-xs font-medium bg-[#1a1c24] hover:bg-[#222530] text-zinc-200 px-3 py-1.5 rounded-lg border border-[#272935] transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Concierge</span>
            </button>

            {/* PayPal Sandbox Status Badge */}
            <button
              onClick={onOpenPayPalConfig}
              title="PayPal Sandbox Configuration"
              className="flex items-center gap-1.5 text-[11px] bg-[#121418] hover:bg-[#1a1c22] text-zinc-300 border border-[#1e2027] px-2.5 py-1.5 rounded-lg transition"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-semibold text-zinc-200">PayPal</span>
              <span className="text-zinc-500 text-[10px] hidden lg:inline">Sandbox</span>
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

          </div>

        </div>
      </div>
    </header>
  );
};
