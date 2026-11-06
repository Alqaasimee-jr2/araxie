'use client';

import React from 'react';
import { Product } from '@/types';
import { 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  ShoppingBag,
  Sparkles,
  Globe,
  Code2,
  GraduationCap,
  FileText,
  Atom,
  ShieldCheck,
  CalendarCheck,
  Binary
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  isUnlocked?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  CalendarCheck,
  Binary,
  GraduationCap,
  Code2,
  FileText,
  Atom,
  ShieldCheck,
  Sparkles,
  Globe,
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickBuy,
  isUnlocked = false,
}) => {
  const IconComponent = ICON_MAP[product.iconName] || Sparkles;

  const categoryLabels: Record<string, string> = {
    'chrome-extension': 'Chrome Ext',
    'ai-prompt': 'AI Prompts',
    'study-pack': 'Study Pack',
    'code-template': 'Code Template',
    'saas-micro': 'Micro SaaS',
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#11131c] border border-[#1f2331] hover:border-[#333a4f] transition-all duration-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50">
      
      {/* Top Banner & Category Pill */}
      <div 
        className="h-28 relative p-4 flex flex-col justify-between overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${product.accentColor}22 0%, #11131c 100%)`
        }}
      >
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10">
            {categoryLabels[product.category] || product.category}
          </span>

          {product.badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              {product.badge}
            </span>
          )}
        </div>

        {/* Center Floating Icon */}
        <div className="flex items-center gap-2.5 z-10">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: product.accentColor }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base text-zinc-100 group-hover:text-blue-400 transition leading-snug line-clamp-1">
              {product.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400" />
                {product.rating.toFixed(1)}
              </span>
              <span>•</span>
              <span>{product.salesCount} students</span>
            </div>
          </div>
        </div>

        {/* Subtle decorative background blur */}
        <div 
          className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
          style={{ backgroundColor: product.accentColor }}
        />
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        
        {/* Creator Info */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#1a1e2a]">
          <img 
            src={product.creator.avatar} 
            alt={product.creator.name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-700" 
          />
          <div className="flex items-center gap-1 text-xs text-zinc-400 truncate">
            <span className="text-zinc-300 font-medium">{product.creator.name}</span>
            {product.creator.verified && (
              <CheckCircle2 className="w-3 h-3 text-blue-400 inline shrink-0" />
            )}
            <span className="text-zinc-500 text-[11px] truncate">({product.creator.university})</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-1">
          {product.features.slice(0, 2).map((feat, idx) => (
            <span 
              key={idx}
              className="text-[10px] bg-[#161a25] text-zinc-300 px-2 py-0.5 rounded-md border border-[#222738] truncate max-w-[200px]"
            >
              ✓ {feat}
            </span>
          ))}
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-[#1a1e2a] flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 font-medium block">
              1-Time Access
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(product)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-zinc-300 bg-[#171b26] hover:bg-[#202534] border border-[#252b3d] transition"
            >
              Details
            </button>

            {isUnlocked ? (
              <button
                onClick={() => onSelect(product)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition flex items-center gap-1"
              >
                <span>Owned</span>
              </button>
            ) : (
              <button
                onClick={() => onQuickBuy(product)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition flex items-center gap-1 transform active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Get Access</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
