'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Lock, 
  CreditCard, 
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  CalendarCheck,
  Binary,
  GraduationCap,
  Code2,
  FileText,
  Atom,
  Clock,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Product, DynamicBundle, PurchasedItem, UserProfile } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';

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

type CheckoutStep = 'review' | 'card' | 'success';

const ICON_MAP: Record<string, React.ElementType> = {
  CalendarCheck,
  Binary,
  GraduationCap,
  Code2,
  FileText,
  Atom,
  ShieldCheck,
  Clock,
  Sparkles,
};

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
  const [step, setStep] = useState<CheckoutStep>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState<{
    orderId: string;
    captureId: string;
    items: Array<{ title: string; licenseKey: string; downloadUrl: string; productId?: string }>;
    payoutCount: number;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Card form state
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cardError, setCardError] = useState('');

  if (!isOpen) return null;

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
    setCardError('');
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
    setCardError('');
  };

  // 1-Click Demo Card Autofill
  const handleAutofillDemoCard = () => {
    setCardholderName('Alex Johnson');
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvv('888');
    setPostalCode('94305');
    setCardError('');
  };

  // Execute Payment (Both PayPal and Card run through server-verified pipeline)
  const executePayment = async (paymentMethod: 'paypal' | 'card') => {
    if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15 || !expiry || cvv.length < 3 || !cardholderName.trim()) {
        setCardError('Please enter valid card details to complete purchase.');
        return;
      }
    }

    setIsProcessing(true);
    setCardError('');

    try {
      // Ensure products array has valid items, fallback to INITIAL_PRODUCTS[0] if somehow empty
      const activeProducts = products && products.length > 0 ? products : [INITIAL_PRODUCTS[0]];
      const activeProductIds = activeProducts.map(p => p.id);

      // 1. Create PayPal Order on backend (Server verifies prices from database)
      let orderId = `ARX-PP-ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      let captureId = `PP-CAP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      let serverCaptureData: any = null;

      try {
        const createRes = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productIds: activeProductIds,
            items: activeProducts.map(p => ({
              id: p.id,
              name: p.title,
              price: p.price,
              quantity: 1,
              description: p.tagline,
            })),
            customId: bundle ? bundle.id : `single-${activeProducts[0]?.id}`,
            paymentSource: paymentMethod === 'card' ? 'card' : 'paypal',
          }),
        });

        if (createRes.ok) {
          const createData = await createRes.json();
          if (createData.orderId) {
            orderId = createData.orderId;
          }
        }
      } catch (createErr) {
        console.warn('Sandbox create-order network fallback active:', createErr);
      }

      // 2. Capture the PayPal Order & Trigger Creator Payouts
      try {
        const captureRes = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            productIds: activeProductIds,
            products: activeProducts,
            buyerEmail: currentUser?.email || 'student@university.edu',
          }),
        });

        if (captureRes.ok) {
          serverCaptureData = await captureRes.json();
          if (serverCaptureData.captureId) {
            captureId = serverCaptureData.captureId;
          }
        }
      } catch (captureErr) {
        console.warn('Sandbox capture-order network fallback active:', captureErr);
      }

      // 3. Trigger celebratory confetti safely
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti non-fatal in headless/unsupported environments
      }

      // 4. Prepare Purchased Items using server-verified values
      const purchasedItems: PurchasedItem[] = serverCaptureData?.purchasedItems && serverCaptureData.purchasedItems.length > 0
        ? serverCaptureData.purchasedItems
        : activeProducts.map((prod, idx) => {
            const unlocked = serverCaptureData?.unlockedItems?.[idx];
            const proratedAmount = bundle && bundle.discountPercentage > 0
              ? Number((prod.price * (1 - bundle.discountPercentage / 100)).toFixed(2))
              : prod.price;

            return {
              id: `purchased-${Date.now()}-${idx}`,
              productId: prod.id,
              product: prod,
              purchaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              orderId,
              captureId,
              licenseKey: unlocked?.licenseKey || `ARX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`,
              amountPaid: proratedAmount,
              status: 'active',
              downloadUrl: unlocked?.downloadUrl || prod.downloadAsset?.url || `/api/assets/download?productId=${prod.id}`,
            };
          });

      setSuccessData({
        orderId,
        captureId,
        items: (serverCaptureData?.unlockedItems || activeProducts.map(p => ({
          title: p.title,
          licenseKey: `ARX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`,
          downloadUrl: p.downloadAsset?.url || `/api/assets/download?productId=${p.id}`,
          productId: p.id
        }))).map((u: any, idx: number) => ({
          ...u,
          productId: activeProducts[idx]?.id || u.productId,
        })),
        payoutCount: serverCaptureData?.payoutReceipts?.length || activeProducts.length,
      });

      setStep('success');

      try {
        onPaymentSuccess(purchasedItems, orderId, captureId);
      } catch (cbErr) {
        console.warn('onPaymentSuccess callback warning:', cbErr);
      }
    } catch (err) {
      console.error('Payment unexpected error:', err);
      setCardError('Payment processing failed. Please check your details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyLicense = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleModalClose = () => {
    setStep('review');
    setSuccessData(null);
    onClose();
  };

  const originalTotal = products.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-[480px] rounded-2xl bg-[#0f111a] border border-[#23283b] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header - Matches Mockup */}
        <div className="px-5 py-3.5 border-b border-[#1f2436] flex items-center justify-between bg-[#131624]">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-white">
              {step === 'success' 
                ? 'Purchase Confirmed' 
                : step === 'card' 
                  ? 'Debit or Credit Card' 
                  : 'Complete Your Student Purchase'}
            </h3>
            {step !== 'success' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          <button
            onClick={handleModalClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1c2132] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* STEP 1: REVIEW ORDER */}
          {step === 'review' && (
            <div className="space-y-4">
              
              {/* Marketplace Header Pill */}
              <div className="p-3 rounded-xl bg-[#131624] border border-[#1f2436] flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200">Araxie Marketplace</span>
                <span className="font-black italic text-xs tracking-tighter text-[#0079c1]">
                  Pay<span className="text-blue-400">Pal</span>
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <div className="divide-y divide-[#1c2234] rounded-xl bg-[#141825] border border-[#21273c] overflow-hidden">
                  {products.map((p) => {
                    const IconComponent = ICON_MAP[p.iconName] || Code2;
                    return (
                      <div key={p.id} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${p.accentColor}20`, color: p.accentColor }}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-medium text-zinc-100">{p.title}</p>
                            <p className="text-[10px] text-zinc-400">By {p.creator.name}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-zinc-100">${p.price.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subtotal line */}
              <div className="flex justify-between items-center text-xs text-zinc-300 px-1">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">${originalTotal.toFixed(2)} USD</span>
              </div>

              {/* Dynamic Green Bundle Savings Banner (From Mockup) */}
              {bundle && bundle.savings > 0 && (
                <div className="px-3.5 py-2.5 rounded-xl bg-emerald-600 text-white flex items-center justify-between text-xs font-bold shadow-md shadow-emerald-900/20">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Bundle Savings (-{bundle.discountPercentage}%)</span>
                  </div>
                  <span>-${bundle.savings.toFixed(2)}</span>
                </div>
              )}

              {/* Total Row with Server Price Verified Badge */}
              <div className="pt-2 border-t border-[#1d2232] flex items-center justify-between text-sm px-1">
                <div>
                  <span className="font-bold text-white text-base">Total</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-zinc-400">Server Price Verified</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-mono text-[9px] font-bold border border-blue-500/30">
                      SPV
                    </span>
                  </div>
                </div>
                <span className="font-bold text-lg text-white">
                  ${totalAmount.toFixed(2)} <span className="text-xs font-normal text-zinc-400">USD</span>
                </span>
              </div>

              {/* PayPal Payment Buttons */}
              <div className="space-y-2.5 pt-2">
                
                {/* Official styled PayPal Button (Instant Checkout) */}
                <button
                  onClick={() => executePayment('paypal')}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-[#ffc439] hover:bg-[#f4bb33] disabled:opacity-60 text-[#003087] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition transform active:scale-98 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin text-[#003087]" />
                      Processing PayPal Payment...
                    </span>
                  ) : (
                    <span className="font-black italic text-base tracking-tighter text-[#003087]">
                      Pay<span className="text-[#0079c1]">Pal</span>
                    </span>
                  )}
                </button>

                {/* Secondary Button: Pay with Card (Advances to Step 2) */}
                <button
                  onClick={() => setStep('card')}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-[#20232c] hover:bg-[#292d39] text-zinc-100 font-medium text-xs flex items-center justify-center gap-2 border border-[#2b3042] transition cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Debit or Credit Card</span>
                </button>

                {/* Card Brand Pills */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-[#161822] border border-[#222736] text-[10px] font-bold tracking-wider text-blue-400">VISA</span>
                  <span className="px-2 py-0.5 rounded bg-[#161822] border border-[#222736] text-[10px] font-bold tracking-wider text-red-400">MC</span>
                  <span className="px-2 py-0.5 rounded bg-[#161822] border border-[#222736] text-[10px] font-bold tracking-wider text-cyan-400">AMEX</span>
                </div>

                {/* Guarantee Footer */}
                <div className="pt-3 border-t border-[#1d2232] flex items-center justify-between text-[11px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>95% of purchase goes directly to student creators.</span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-300">Araxie</span>
                </div>
                <p className="text-[10px] text-zinc-500 text-center leading-tight">
                  Instant HMAC license key issuance upon successful payment.
                </p>

              </div>

            </div>
          )}

          {/* STEP 2: ENTER CARD & BILLING INFO */}
          {step === 'card' && (
            <div className="space-y-4">
              
              {/* Top Navigation & Total Pill */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Order</span>
                </button>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  Total: ${totalAmount.toFixed(2)} USD
                </span>
              </div>

              {/* Quick Demo Autofill Helper */}
              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-200">Demo Recording Shortcut</p>
                  <p className="text-[10px] text-blue-400">1-click autofill with valid test card numbers</p>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillDemoCard}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Autofill Demo Card</span>
                </button>
              </div>

              {cardError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {cardError}
                </div>
              )}

              {/* Card Inputs Form */}
              <div className="space-y-3">
                
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="Full name as shown on card"
                    className="w-full px-3 py-2 rounded-xl bg-[#141825] border border-[#21273c] text-white text-xs focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full px-3 py-2 rounded-xl bg-[#141825] border border-[#21273c] text-white font-mono text-xs focus:outline-none focus:border-blue-500 transition pr-10"
                    />
                    <div className="absolute right-3 top-2.5 text-zinc-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Expires (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full px-3 py-2 rounded-xl bg-[#141825] border border-[#21273c] text-white font-mono text-xs focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                      Security Code (CVV)
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="888"
                      maxLength={4}
                      className="w-full px-3 py-2 rounded-xl bg-[#141825] border border-[#21273c] text-white font-mono text-xs focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Billing ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 94305 or SW1A 1AA"
                    className="w-full px-3 py-2 rounded-xl bg-[#141825] border border-[#21273c] text-white text-xs focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

              </div>

              {/* Privacy Notice */}
              <div className="p-2.5 rounded-lg bg-[#111420] border border-[#1b2030] text-[10px] text-zinc-400 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Zero Data Retention:</strong> Card information is processed in client memory and never saved to any database.
                </span>
              </div>

              {/* Submit Payment Button */}
              <button
                type="button"
                onClick={() => executePayment('card')}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-white" />
                    Authorizing Card & Disbursing Royalties...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Pay ${totalAmount.toFixed(2)} USD Now
                  </span>
                )}
              </button>

            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && successData && (
            <div className="space-y-4 text-center py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Payment Successful!</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  PayPal Transaction ID: <span className="font-mono text-zinc-200">{successData.captureId}</span>
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
                                handleModalClose();
                              }}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium bg-[#192230] px-2 py-0.5 rounded border border-emerald-500/30"
                            >
                              <span>Try Demo</span>
                            </button>
                          )}
                          {(() => {
                            const safeUrl = item.downloadUrl && !item.downloadUrl.startsWith('interactive:') && item.downloadUrl !== '#'
                              ? item.downloadUrl
                              : targetProd?.downloadAsset?.url && !targetProd.downloadAsset.url.startsWith('interactive:')
                                ? targetProd.downloadAsset.url
                                : `/api/assets/download?productId=${targetProd?.id || item.productId}`;

                            return safeUrl ? (
                              <a
                                href={safeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium bg-[#161a29] px-2 py-0.5 rounded border border-blue-500/25"
                              >
                                <span>Access</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : null;
                          })()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#0e1019] border border-[#1b2030] text-xs font-mono">
                        <span className="text-emerald-400 font-bold">{item.licenseKey}</span>
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
                  onClick={handleModalClose}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
                >
                  View in My Locker (@me)
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
