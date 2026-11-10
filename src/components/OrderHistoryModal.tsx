'use client';

import React from 'react';
import { 
  X, 
  Receipt, 
  CheckCircle2, 
  ExternalLink,
  Download,
  Key,
  Play
} from 'lucide-react';
import { PurchasedItem, Product } from '@/types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedItems: PurchasedItem[];
  onLaunchPreview?: (product: Product) => void;
}

const PREVIEWABLE_IDS = [
  'prod-flow7',
  'prod-ci-guardian',
  'prod-canvas-autopilot',
  'prod-algo-visualizer',
  'prod-academic-prompt-vault',
  'prod-paper-synthesizer',
];

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  purchasedItems,
  onLaunchPreview,
}) => {
  if (!isOpen) return null;

  // Resolves safe, working URLs and filters out invalid pseudo-protocols
  const getSafeAssetUrl = (item: PurchasedItem): string | null => {
    const rawUrl = item.downloadUrl || item.product?.downloadAsset?.url;
    if (!rawUrl || rawUrl === '#' || rawUrl.startsWith('interactive:')) {
      // Fallback to our real working local download endpoint
      return `/api/assets/download?productId=${item.productId}`;
    }
    return rawUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0f111a] border border-[#23283b] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1f2436] flex items-center justify-between bg-[#131624]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Order History & Receipts</h3>
              <p className="text-[11px] text-zinc-400">
                Verified PayPal transaction receipts, student licenses, and download access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1c2132] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {purchasedItems.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 space-y-2">
              <Receipt className="w-10 h-10 mx-auto text-zinc-600" />
              <p className="text-xs">No orders recorded yet.</p>
              <p className="text-[11px] text-zinc-500">
                Complete a PayPal checkout on any student tool to generate a transaction receipt.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {purchasedItems.map((item) => {
                const safeUrl = getSafeAssetUrl(item);
                const hasInteractivePreview = Boolean(onLaunchPreview && (item.product || item.productId));

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#131624] border border-[#21263a] space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm text-white">
                          {item.product?.title || 'Student Tool'}
                        </h4>
                        <p className="text-zinc-400 text-[11px]">
                          Creator: {item.product?.creator?.name || 'Student Creator'} • {item.product?.creator?.university || 'Verified Campus'}
                        </p>
                      </div>
                      <span className="font-bold text-white text-sm">
                        ${item.amountPaid?.toFixed(2) || '0.00'} USD
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#0c0e16] p-2.5 rounded-lg border border-[#1a1e2d]">
                      <div>
                        <span className="text-zinc-500 block">PayPal Capture ID</span>
                        <span className="font-mono text-zinc-300 truncate block">
                          {item.captureId}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Date</span>
                        <span className="text-zinc-300 block">{item.purchaseDate}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-[#181c2b] flex items-center justify-between">
                        <span className="text-zinc-500 flex items-center gap-1">
                          <Key className="w-3 h-3 text-amber-400" /> License:
                        </span>
                        <span className="font-mono text-amber-300">{item.licenseKey}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        PayPal Payment Captured
                      </span>

                      <div className="flex items-center gap-2">
                        {hasInteractivePreview && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onLaunchPreview) {
                                onLaunchPreview(item.product);
                              }
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-medium flex items-center gap-1 text-[11px] transition cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-emerald-400" />
                            <span>Run Sandbox</span>
                          </button>
                        )}

                        {safeUrl && (
                          <a
                            href={safeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-medium flex items-center gap-1 text-[11px] transition"
                          >
                            <Download className="w-3 h-3" />
                            <span>Access Asset</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
