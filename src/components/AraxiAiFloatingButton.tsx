'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, X } from 'lucide-react';

interface AraxiAiFloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
  badgeText?: string;
}

export const AraxiAiFloatingButton: React.FC<AraxiAiFloatingButtonProps> = ({
  isOpen,
  onClick,
  badgeText = 'Ask AI',
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      
      {/* Dismissible Floating Teaser Bubble (visible when chat closed) */}
      {!isOpen && showTooltip && (
        <div className="relative animate-in fade-in slide-in-from-bottom-2 duration-300 hidden sm:flex items-center gap-2 p-2 px-3 rounded-xl bg-[#141724] border border-[#23293e] shadow-xl text-xs text-zinc-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>Ask <strong>araxieAi</strong> for student software bundles &amp; discounts</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="p-0.5 rounded text-zinc-500 hover:text-white"
            title="Dismiss hint"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Floating Action Button */}
      <button
        onClick={onClick}
        aria-label="Open araxieAi Assistant"
        className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl transition-all duration-300 transform active:scale-95 ${
          isOpen
            ? 'bg-[#181b28] text-zinc-300 border border-[#2b324b] hover:bg-[#202538]'
            : 'bg-[#141724] text-white border border-[#2d3550] hover:border-blue-500/50 hover:bg-[#181c2c]'
        }`}
      >
        {/* Araxie Spark Icon */}
        <div className="relative w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
          {isOpen ? (
            <X className="w-3.5 h-3.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Brand Text */}
        <div className="relative flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-bold text-xs sm:text-sm tracking-tight text-white group-hover:text-blue-300 transition">
              araxieAi
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] text-zinc-400 font-medium leading-tight">
            {isOpen ? 'Close assistant' : 'Campus Advisor'}
          </span>
        </div>

        {/* Hotkey hint on desktop */}
        <kbd className="hidden lg:inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#10121a] text-zinc-400 border border-[#212638] ml-1">
          ⌘J
        </kbd>
      </button>

    </div>
  );
};
