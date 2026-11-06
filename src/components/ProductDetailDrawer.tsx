'use client';

import React from 'react';
import { Product } from '@/types';
import { 
  X, 
  CheckCircle2, 
  Star, 
  Download, 
  ShieldCheck, 
  ShoppingBag, 
  ExternalLink,
  Code2,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface ProductDetailDrawerProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
  isUnlocked?: boolean;
}

export const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  product,
  onClose,
  onBuyNow,
  isUnlocked = false,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-xl h-full bg-[#0d0f17] border-l border-[#1f2434] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Top bar */}
        <div className="p-4 border-b border-[#1c2130] flex items-center justify-between bg-[#111420]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {product.category.replace('-', ' ')}
            </span>
            {product.badge && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {product.badge}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1f2e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Header Title & Tagline */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {product.title}
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Creator Profile Card */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141724] border border-[#212638]">
            <div className="flex items-center gap-3">
              <img
                src={product.creator.avatar}
                alt={product.creator.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-white">{product.creator.name}</span>
                  {product.creator.verified && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <p className="text-xs text-zinc-400">
                  {product.creator.university} • @{product.creator.handle}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-zinc-500">
                ({product.reviewsCount} reviews)
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
              About This Tool
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* What's Included */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
              What&apos;s Included
            </h4>
            <div className="space-y-2">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#121520] border border-[#1d2232] text-xs text-zinc-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee & Asset Type */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Campus Verified Guarantee</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every tool on Araxie is peer-tested by university students. When you purchase, your unique license key and direct download files are unlocked immediately in your Student Locker (`@me`), backed by PayPal Purchase Protection.
            </p>
          </div>

        </div>

        {/* Sticky Bottom Checkout Footer */}
        <div className="p-4 border-t border-[#1c2130] bg-[#10131e] flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-zinc-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-zinc-400">
              Instant access • Lifetime updates
            </span>
          </div>

          <div>
            {isUnlocked ? (
              <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Unlocked in your Locker</span>
              </div>
            ) : (
              <button
                onClick={() => onBuyNow(product)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy with PayPal</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
