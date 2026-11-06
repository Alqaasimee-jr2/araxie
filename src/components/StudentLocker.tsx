'use client';

import React, { useState } from 'react';
import { PurchasedItem, Product } from '@/types';
import { 
  Key, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  CheckCircle2, 
  Receipt, 
  Package, 
  ArrowRight,
  ShieldCheck,
  Play,
  Terminal
} from 'lucide-react';

interface StudentLockerProps {
  purchasedItems: PurchasedItem[];
  onBrowseCatalog: () => void;
  onViewReceipt: (item: PurchasedItem) => void;
  onLaunchTool: (product: Product) => void;
}

export const StudentLocker: React.FC<StudentLockerProps> = ({
  purchasedItems,
  onBrowseCatalog,
  onViewReceipt,
  onLaunchTool,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Locker Top Header (Muted, Matte) */}
      <div className="p-5 rounded-xl bg-[#121317] border border-[#1e2027] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              My Student Locker (@me)
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#1c1d24] text-zinc-300 border border-[#272933]">
              {purchasedItems.length} Active Tools
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Your unlocked university software tools, study packs, and verified license keys.
          </p>
        </div>

        <button
          onClick={onBrowseCatalog}
          className="px-3.5 py-1.5 rounded-lg bg-[#181a20] hover:bg-[#20222a] text-zinc-200 text-xs font-medium border border-[#252834] transition flex items-center gap-1.5"
        >
          <span>Browse Store</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Unlocked Tools */}
      {purchasedItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-[#1e2027] bg-[#0e0f13] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#16171d] border border-[#22242c] text-zinc-500 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Your Locker is empty</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t acquired any student tools yet. Browse the marketplace or ask the AI Concierge to bundle tools for your courses.
            </p>
          </div>
          <button
            onClick={onBrowseCatalog}
            className="px-4 py-2 rounded-lg bg-[#222530] hover:bg-[#2c303f] text-white font-medium text-xs border border-[#34394b] transition"
          >
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchasedItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#121317] border border-[#1e2027] hover:border-[#2a2c36] transition flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base text-white">
                      {item.product.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Unlocked
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    By {item.product.creator.name} • {item.product.creator.university}
                  </p>
                </div>

                <button
                  onClick={() => onViewReceipt(item)}
                  title="View PayPal Receipt"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-[#171920] border border-[#22242e] transition"
                >
                  <Receipt className="w-4 h-4" />
                </button>
              </div>

              {/* License Key Box */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3 h-3 text-zinc-400" />
                  License Key
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c0d10] border border-[#1a1c22] text-xs font-mono">
                  <span className="text-zinc-200 font-semibold truncate pr-2">
                    {item.licenseKey}
                  </span>
                  <button
                    onClick={() => copyLicense(item.licenseKey)}
                    className="p-1 text-zinc-400 hover:text-white transition shrink-0"
                    title="Copy Key"
                  >
                    {copiedKey === item.licenseKey ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions: Live Launch In-App Tool vs Download */}
              <div className="pt-2 border-t border-[#1a1c22] flex items-center justify-between gap-2">
                <div className="text-[11px] text-zinc-500">
                  Purchased {item.purchaseDate}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLaunchTool(item.product)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1f222b] hover:bg-[#282b37] text-white font-medium text-xs border border-[#2d313e] transition flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Launch Tool</span>
                  </button>

                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#16181e] hover:bg-[#20222a] text-zinc-400 hover:text-zinc-200 border border-[#22242d] transition"
                    title="Download files or repo link"
                  >
                    <Download className="w-3.5 h-3.5" />
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
