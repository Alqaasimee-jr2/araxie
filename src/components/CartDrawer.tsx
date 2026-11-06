'use client';

import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Product, DynamicBundle } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemoveItem: (productId: string) => void;
  onCheckout: (products: Product[], bundle: DynamicBundle | null, total: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const rawTotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const k = cartItems.length;

  // Dynamic bundling logic:
  let discountPercentage = 0;
  let savings = 0;
  let finalTotal = rawTotal;
  let bundleObj: DynamicBundle | null = null;

  if (k >= 2) {
    const rawDiscount = Math.min(0.25, 0.12 * Math.log(1 + k));
    discountPercentage = Math.round(rawDiscount * 100);
    finalTotal = Number((rawTotal * (1 - rawDiscount)).toFixed(2));
    savings = Number((rawTotal - finalTotal).toFixed(2));

    bundleObj = {
      id: `cart-bundle-${Date.now()}`,
      title: `${k}-Item Student Multi-Tool Bundle`,
      items: cartItems,
      originalTotal: Number(rawTotal.toFixed(2)),
      discountPercentage,
      bundleTotal: finalTotal,
      savings,
      reason: 'Dynamic student multi-item discount',
    };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-[#0d0f17] border-l border-[#1f2434] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-[#1c2130] flex items-center justify-between bg-[#111420]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm text-white">Your Cart ({cartItems.length})</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1f2e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-zinc-700" />
              <p className="text-xs">Your cart is currently empty.</p>
              <p className="text-[11px] text-zinc-600">
                Explore the marketplace or ask the AI Concierge for recommendations.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#131622] border border-[#202538] flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate">
                  <h4 className="font-semibold text-white truncate">{item.title}</h4>
                  <p className="text-[10px] text-zinc-400">By {item.creator.name} ({item.creator.university})</p>
                  <span className="font-bold text-zinc-200 mt-1 block">${item.price.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-[#1f1922] transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

          {/* Dynamic Bundle Savings Notification */}
          {cartItems.length >= 2 && (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous {discountPercentage}% Bundle Savings Applied!</span>
              </div>
              <p className="text-[11px] text-zinc-300">
                Buying {cartItems.length} student tools together saves you ${savings.toFixed(2)}.
              </p>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-[#1c2130] bg-[#10131e] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>${rawTotal.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Student Multi-Tool Discount</span>
                  <span>-${savings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Platform Fees / Taxes</span>
                <span className="text-emerald-400">$0.00</span>
              </div>
              <div className="pt-2 border-t border-[#1d2232] flex justify-between text-base font-bold text-white">
                <span>Total Due</span>
                <span className="text-blue-400">${finalTotal.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              onClick={() => {
                onCheckout(cartItems, bundleObj, finalTotal);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-[#222530] hover:bg-[#2c303f] text-white border border-[#34394b] font-semibold text-xs shadow-lg flex items-center justify-center gap-2 transition"
            >
              <span>Proceed to PayPal Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
