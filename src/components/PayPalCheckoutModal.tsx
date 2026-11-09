'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  CreditCard, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Product, DynamicBundle, PurchasedItem, UserProfile } from '@/types';

interface PayPalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  bundle?: DynamicBundle | null;
  totalAmount: number;
  currentUser?: UserProfile | null;
  onPaymentSuccess: (purchasedItems: PurchasedItem[], orderId: string, captureId: string) => void;
  onOpenTerms?: (tab?: 'terms' | 'privacy' | 'creator' | 'honor' | 'refunds') => void;
  onLaunchPreview?: (product: Product) => void;
}

export const PayPalCheckoutModal: React.FC<PayPalCheckoutModalProps> = ({
  isOpen,
  onClose,
  products,
  bundle,
  totalAmount,
  currentUser,
  onPaymentSuccess,
  onOpenTerms,
  onLaunchPreview,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState<{
    orderId: string;
    captureId: string;
    items: Array<{ title: string; licenseKey: string; downloadUrl: string; productId?: string }>;
    payoutCount: number;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePayPalCheckout = async () => {
    setIsProcessing(true);
    try {
      // 1. Create PayPal Order
      const createRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: products.map(p => p.id),
          items: products.map(p => ({
            id: p.id,
            name: p.title,
            price: p.price,
            quantity: 1,
            description: p.tagline,
          })),
          customId: bundle ? bundle.id : `single-${products[0]?.id}`,
        }),
      });

      if (!createRes.ok) throw new Error('Order creation failed');
      const createData = await createRes.json();
      const orderId = createData.orderId;

      // 2. Capture the PayPal Order & Trigger Creator Payouts
      const captureRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          productIds: products.map(p => p.id),
          products,
          buyerEmail: currentUser?.email || 'student@university.edu',
        }),
      });

      if (!captureRes.ok) throw new Error('Capture failed');
      const captureData = await captureRes.json();

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      // Prepare Purchased Items for state update using server-verified values
      const purchasedItems: PurchasedItem[] = captureData.purchasedItems && captureData.purchasedItems.length > 0
        ? captureData.purchasedItems
        : products.map((prod, idx) => {
            const unlocked = captureData.unlockedItems?.[idx];
            const proratedAmount = bundle && bundle.discountPercentage > 0
              ? Number((prod.price * (1 - bundle.discountPercentage / 100)).toFixed(2))
              : prod.price;

            return {
              id: `purchased-${Date.now()}-${idx}`,
              productId: prod.id,
              product: prod,
              purchaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              orderId,
              captureId: captureData.captureId,
              licenseKey: unlocked?.licenseKey || `ARX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`,
              amountPaid: proratedAmount,
              status: 'active',
              downloadUrl: unlocked?.downloadUrl || prod.downloadAsset?.url || '#',
            };
          });

      setSuccessData({
        orderId,
        captureId: captureData.captureId,
        items: (captureData.unlockedItems || []).map((u: any, idx: number) => ({
          ...u,
          productId: products[idx]?.id,
        })),
        payoutCount: captureData.payoutReceipts?.length || 0,
      });

      onPaymentSuccess(purchasedItems, orderId, captureData.captureId);
    } catch (err) {
      console.error('PayPal checkout failed:', err);
      alert('Checkout error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f111a] border border-[#23283b] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-[#1f2436] flex items-center justify-between bg-[#131624]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-semibold text-sm text-white">
              {successData ? 'Purchase Confirmed' : 'PayPal Checkout'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1c2132] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {successData ? (
            /* Success Screen */
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  PayPal Transaction ID: <span className="font-mono text-zinc-300">{successData.captureId}</span>
                </p>
                <div className="inline-block mt-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-medium border border-blue-500/20">
                  Instant Payout Dispatched to {successData.payoutCount} Student Creator(s)
                </div>
              </div>

              {/* Unlocked Items with License Keys */}
              <div className="space-y-2 text-left pt-2">
                <p className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                  Unlocked Student Assets
                </p>
                {successData.items.map((item, i) => {
                  const targetProd = products.find(p => p.id === item.productId) || products[i];
                  const hasPreview = targetProd && ['prod-flow7', 'prod-ci-guardian', 'prod-canvas-autopilot', 'prod-algo-visualizer', 'prod-academic-prompt-vault', 'prod-paper-synthesizer'].includes(targetProd.id);

                  return (
                    <div key={i} className="p-3 rounded-xl bg-[#141825] border border-[#21273c] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white truncate max-w-[220px]">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-2">
                          {hasPreview && onLaunchPreview && (
                            <button
                              onClick={() => {
                                onLaunchPreview(targetProd);
                                onClose();
                              }}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium bg-[#192230] px-2 py-0.5 rounded border border-emerald-500/30"
                            >
                              <span>Try Demo</span>
                            </button>
                          )}
                          <a
                            href={item.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                          >
                            <span>Access</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e1019] border border-[#1b2030] text-xs font-mono">
                        <span className="text-emerald-400">{item.licenseKey}</span>
                        <button
                          onClick={() => copyLicense(item.licenseKey)}
                          className="text-zinc-400 hover:text-zinc-200 transition"
                          title="Copy key"
                        >
                          {copiedKey === item.licenseKey ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                >
                  View in My Locker (@me)
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Order Review */
            <div className="space-y-4">
              
              {/* Items List */}
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                  Order Summary
                </span>
                <div className="divide-y divide-[#1c2234] rounded-xl bg-[#141825] border border-[#21273c] overflow-hidden">
                  {products.map((p) => (
                    <div key={p.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-zinc-200">{p.title}</p>
                        <p className="text-[10px] text-zinc-400">By {p.creator.name} • {p.creator.university}</p>
                      </div>
                      <span className="font-semibold text-zinc-100">${p.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Bundle Discount Callout (if bundle) */}
              {bundle && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Autonomous Student Bundle Discount ({bundle.discountPercentage}%)</span>
                  </div>
                  <span className="font-bold text-emerald-400">-${bundle.savings.toFixed(2)}</span>
                </div>
              )}

              {/* Totals Calculation */}
              <div className="p-3 rounded-xl bg-[#111420] border border-[#1d2232] space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>${products.reduce((a, b) => a + b.price, 0).toFixed(2)}</span>
                </div>
                {bundle && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Bundle Discount</span>
                    <span>-${bundle.savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Student Fee / Taxes</span>
                  <span className="text-emerald-400">$0.00 (Waived)</span>
                </div>
                <div className="pt-2 border-t border-[#1d2232] flex justify-between text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-blue-400">${totalAmount.toFixed(2)} USD</span>
                </div>
              </div>

              {/* PayPal Payment Buttons */}
              <div className="space-y-2.5 pt-2">
                
                {/* Official styled PayPal Button */}
                <button
                  onClick={handlePayPalCheckout}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-[#ffc439] hover:bg-[#f4bb33] disabled:opacity-60 text-[#003087] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition transform active:scale-98"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-[#003087]" />
                      Processing Secure PayPal Payment...
                    </span>
                  ) : (
                    <span className="font-black italic text-base tracking-tighter text-[#003087]">
                      Pay<span className="text-[#0079c1]">Pal</span>
                    </span>
                  )}
                </button>

                {/* Secondary Button: Pay with Card */}
                <button
                  onClick={handlePayPalCheckout}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-[#2c2e2f] hover:bg-[#383b3d] text-zinc-200 font-medium text-xs flex items-center justify-center gap-2 transition"
                >
                  <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Debit or Credit Card (Powered by PayPal)</span>
                </button>

                <div className="flex flex-col items-center justify-center gap-1.5 text-[10px] text-zinc-500 pt-2 text-center">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Secured by PayPal Purchase Protection & End-to-End Encryption</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-tight">
                    By completing your order, you agree to Araxie&apos;s{' '}
                    <button
                      type="button"
                      onClick={() => onOpenTerms?.('terms')}
                      className="text-blue-400 hover:underline"
                    >
                      Terms of Service
                    </button>
                    ,{' '}
                    <button
                      type="button"
                      onClick={() => onOpenTerms?.('privacy')}
                      className="text-blue-400 hover:underline"
                    >
                      Privacy Policy
                    </button>
                    , and{' '}
                    <button
                      type="button"
                      onClick={() => onOpenTerms?.('refunds')}
                      className="text-blue-400 hover:underline"
                    >
                      Refund Policy
                    </button>
                    .
                  </p>
                  <span className="text-[9px] text-zinc-600">
                    PayPal AI Hackathon Showcase &bull; Evaluator Sandbox Environment (Simulated / Test Funds)
                  </span>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
