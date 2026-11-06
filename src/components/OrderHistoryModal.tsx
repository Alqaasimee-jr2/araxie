'use client';

import React from 'react';
import { 
  X, 
  Receipt, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Download,
  Key
} from 'lucide-react';
import { PurchasedItem } from '@/types';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedItems: PurchasedItem[];
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  purchasedItems,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
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
                Verified PayPal Sandbox transaction logs and asset licenses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1c2132] transition"
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
              {purchasedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#131624] border border-[#21263a] space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-white">
                        {item.product.title}
                      </h4>
                      <p className="text-zinc-400 text-[11px]">
                        Creator: {item.product.creator.name} • {item.product.creator.university}
                      </p>
                    </div>
                    <span className="font-bold text-white text-sm">
                      ${item.amountPaid.toFixed(2)} USD
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
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 text-[11px]"
                    >
                      <span>Access Asset</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
