'use client';

import React, { useState } from 'react';
import { PurchasedItem } from '@/types';
import { 
  Key, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle2, 
  Receipt, 
  Package, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface StudentLockerProps {
  purchasedItems: PurchasedItem[];
  onBrowseCatalog: () => void;
  onViewReceipt: (item: PurchasedItem) => void;
}

export const StudentLocker: React.FC<StudentLockerProps> = ({
  purchasedItems,
  onBrowseCatalog,
  onViewReceipt,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Locker Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121624] via-[#161a2c] to-[#121624] border border-[#23293e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              My Student Locker (@me)
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {purchasedItems.length} Active Tools
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            All your unlocked academic tools, Chrome extensions, and study templates in one central hub.
          </p>
        </div>

        <button
          onClick={onBrowseCatalog}
          className="px-4 py-2 rounded-xl bg-[#1b2030] hover:bg-[#232a40] text-zinc-200 text-xs font-semibold border border-[#2a324b] transition flex items-center gap-1.5"
        >
          <span>Explore More Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Unlocked Tools */}
      {purchasedItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#222738] bg-[#0f1118]/60 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#161925] border border-[#23283b] text-zinc-500 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Your Locker is empty</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              You haven&apos;t acquired any student tools yet. Browse the marketplace or ask the AI Concierge to bundle resources for your courses.
            </p>
          </div>
          <button
            onClick={onBrowseCatalog}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/25 transition"
          >
            Browse Student Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchasedItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#111420] border border-[#1f2436] hover:border-[#2d344d] transition space-y-4 flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base text-white">
                      {item.product.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    By {item.product.creator.name} ({item.product.creator.university})
                  </p>
                </div>

                <button
                  onClick={() => onViewReceipt(item)}
                  title="View PayPal Receipt"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#181d2a] border border-[#222738] transition"
                >
                  <Receipt className="w-4 h-4" />
                </button>
              </div>

              {/* License Key Box */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-400" />
                  Your Unique License Key
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0b0d14] border border-[#1a1e2d] text-xs font-mono">
                  <span className="text-amber-300 font-semibold truncate pr-2">
                    {item.licenseKey}
                  </span>
                  <button
                    onClick={() => copyLicense(item.licenseKey)}
                    className="p-1 text-zinc-400 hover:text-white transition shrink-0"
                    title="Copy License Key"
                  >
                    {copiedKey === item.licenseKey ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#1a1e2c] flex items-center justify-between gap-2">
                <div className="text-[11px] text-zinc-500">
                  Purchased {item.purchaseDate}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Access Tool</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
