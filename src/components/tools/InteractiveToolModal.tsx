'use client';

import React from 'react';
import { X, ShieldCheck, Terminal, ShoppingBag, CreditCard, Play } from 'lucide-react';
import { CanvasAutoPilotTool } from './CanvasAutoPilotTool';
import { AlgoVisualizerTool } from './AlgoVisualizerTool';
import { AcademicWritingTool } from './AcademicWritingTool';
import { CIGuardianTool } from './CIGuardianTool';
import { Flow7Tool } from './Flow7Tool';
import { Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';

interface InteractiveToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId?: string;
  toolTitle?: string;
  onBuyNow?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  products?: Product[];
}

export const InteractiveToolModal: React.FC<InteractiveToolModalProps> = ({
  isOpen,
  onClose,
  toolId,
  toolTitle,
  onBuyNow,
  onAddToCart,
  products = INITIAL_PRODUCTS,
}) => {
  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === toolId) || INITIAL_PRODUCTS.find(p => p.id === toolId);

  const renderToolComponent = () => {
    if (toolId === 'prod-flow7') {
      return <Flow7Tool />;
    } else if (toolId === 'prod-ci-guardian') {
      return <CIGuardianTool />;
    } else if (toolId === 'prod-algo-visualizer') {
      return <AlgoVisualizerTool />;
    } else if (toolId === 'prod-academic-prompt-vault' || toolId === 'prod-paper-synthesizer') {
      return <AcademicWritingTool />;
    } else {
      return <CanvasAutoPilotTool />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0e0f14] border border-[#21232d] shadow-2xl overflow-hidden">
        
        {/* Top App Bar */}
        <div className="px-5 py-3.5 border-b border-[#1c1e28] flex items-center justify-between bg-[#121319]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white">
                  {toolTitle || currentProduct?.title || 'Interactive Student Tool Studio'}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Live In-Browser Demo
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Sandboxed execution &bull; Created by {currentProduct?.creator.name || 'Campus Student Builder'} ({currentProduct?.creator.university || 'Nigerian University'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1c26] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Workspace Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0b0e]">
          {renderToolComponent()}
        </div>

        {/* Purchase & Action Footer Bar */}
        {currentProduct && (
          <div className="p-3 sm:p-4 border-t border-[#1a1c25] bg-[#0f1118] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300">
                Loving <strong>{currentProduct.title}</strong>? Unlock full source code and cryptographic license key.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onAddToCart && (
                <button
                  onClick={() => {
                    onAddToCart(currentProduct);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#181a24] hover:bg-[#202434] text-zinc-200 border border-[#262c3e] transition flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart (${currentProduct.price.toFixed(2)})</span>
                </button>
              )}

              {onBuyNow && (
                <button
                  onClick={() => {
                    onBuyNow(currentProduct);
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-zinc-200 text-black shadow-md shadow-white/5 transition flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Buy Now with PayPal (${currentProduct.price.toFixed(2)})</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
