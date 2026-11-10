'use client';

import React, { useEffect } from 'react';
import { Sparkles, Bot, X, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export interface AINotificationData {
  title: string;
  message: string;
  productName?: string;
  productId?: string;
  hasPreview?: boolean;
}

interface AINotificationToastProps {
  notification: AINotificationData | null;
  onClose: () => void;
  onViewLocker: () => void;
  onLaunchPreview?: (productId: string) => void;
}

export const AINotificationToast: React.FC<AINotificationToastProps> = ({
  notification,
  onClose,
  onViewLocker,
  onLaunchPreview,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 12000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-6 fade-in duration-300">
      <div className="relative rounded-2xl bg-[#0e121d] border border-cyan-500/40 shadow-[0_20px_50px_rgba(0,112,186,0.25)] p-4 overflow-hidden backdrop-blur-xl">
        
        {/* Glow Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1b2234]">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                araxieAi
                <span className="text-[10px] font-normal text-cyan-400 px-1.5 py-0.2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  Concierge
                </span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#181d2c] transition"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>{notification.title}</span>
          </p>
          <p className="text-[11px] text-zinc-400 leading-relaxed pl-5">
            {notification.message}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-3 pt-2.5 border-t border-[#1b2234] flex items-center gap-2 pl-5">
          {notification.hasPreview && notification.productId && onLaunchPreview && (
            <button
              onClick={() => {
                onLaunchPreview(notification.productId!);
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Play className="w-3 h-3" />
              <span>Launch Sandbox</span>
            </button>
          )}

          <button
            onClick={() => {
              onViewLocker();
              onClose();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1 transition"
          >
            <span>View License in Locker</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
