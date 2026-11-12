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
      <div className="relative rounded-2xl bg-[#111420] border border-[#23293e] shadow-2xl p-4 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1d2335]">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/25">
              <Bot className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#111420]" />
            </div>
            <div>
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                araxieAi
                <span className="text-[10px] font-medium text-zinc-300 px-2 py-0.5 rounded-full bg-[#181d2c] border border-[#262f44]">
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
        <div className="mt-3 pt-2.5 border-t border-[#1d2335] flex items-center gap-2 pl-5">
          {notification.hasPreview && notification.productId && onLaunchPreview && (
            <button
              onClick={() => {
                onLaunchPreview(notification.productId!);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition"
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
            className="px-3 py-1.5 rounded-lg bg-[#0070ba] hover:bg-[#005ea6] text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm"
          >
            <span>View License in Locker</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
