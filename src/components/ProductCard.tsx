'use client';

import React from 'react';
import { Product } from '@/types';
import { 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  ShoppingBag, 
  Globe, 
  Code2, 
  GraduationCap, 
  FileText, 
  Atom, 
  ShieldCheck, 
  CalendarCheck, 
  Binary,
  Terminal,
  Play
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onLaunchDemo?: (product: Product) => void;
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
  Globe,
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickBuy,
  onLaunchDemo,
  isUnlocked = false,
}) => {
  const IconComponent = ICON_MAP[product.iconName] || Terminal;

  const categoryLabels: Record<string, string> = {
    'chrome-extension': 'Extension',
    'ai-prompt': 'AI Prompts',
    'study-pack': 'Study Pack',
    'code-template': 'Code Template',
    'saas-micro': 'Micro-SaaS',
  };

  return (
    <div className="whop-card rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-150">
      
      {/* Top Header / Icon Area (Muted, Matte) */}
      <div className="p-4 pb-3 border-b border-[#1c1d24] flex items-start justify-between gap-3 bg-[#111216]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#181a20] border border-[#23252f] flex items-center justify-center text-zinc-300">
            <IconComponent className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <h3 
              onClick={() => onSelect(product)}
              className="font-semibold text-sm text-zinc-100 hover:text-white cursor-pointer transition line-clamp-1"
            >
              {product.title}
            </h3>
            <span className="text-[11px] font-medium text-zinc-400">
              {categoryLabels[product.category] || product.category}
            </span>
          </div>
        </div>

        {product.badge && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1c1e26] text-zinc-300 border border-[#272935]">
            {product.badge}
          </span>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        
        {/* Creator Info */}
        <div className="flex items-center gap-2">
          <img 
            src={product.creator.avatar} 
            alt={product.creator.name}
            className="w-4 h-4 rounded-full object-cover ring-1 ring-zinc-700" 
          />
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 truncate">
            <span className="text-zinc-300 font-medium truncate">{product.creator.name}</span>
            {product.creator.verified && (
              <CheckCircle2 className="w-3 h-3 text-zinc-400 inline shrink-0" />
            )}
            <span className="text-zinc-500 truncate">• {product.creator.university}</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Rating and Sales Count */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="text-zinc-300 font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-zinc-300 text-zinc-300" />
            {product.rating.toFixed(1)}
          </span>
          <span>•</span>
          <span>{product.salesCount} students</span>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-[#1a1c22] flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 font-medium block">
              One-time
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onLaunchDemo && (
              <button
                onClick={() => onLaunchDemo(product)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-[#16181f] hover:bg-[#20222b] border border-[#232530] transition flex items-center gap-1"
                title="Test interactive tool demo"
              >
                <Play className="w-3 h-3 text-zinc-400" />
                <span className="hidden sm:inline">Try Demo</span>
              </button>
            )}

            {isUnlocked ? (
              <button
                onClick={() => onSelect(product)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 transition"
              >
                Owned
              </button>
            ) : (
              <button
                onClick={() => onQuickBuy(product)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#222530] hover:bg-[#2c303f] border border-[#34394b] transition flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-zinc-300" />
                <span>Get Access</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
