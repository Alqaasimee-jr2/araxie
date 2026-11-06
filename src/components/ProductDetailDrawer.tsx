'use client';

import React, { useState, useEffect } from 'react';
import { Product, StudentReview } from '@/types';
import { 
  X, 
  CheckCircle2, 
  Star, 
  Download, 
  ShieldCheck, 
  ShoppingBag, 
  Play,
  MessageSquareQuote,
  Sparkles
} from 'lucide-react';

interface ProductDetailDrawerProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isInCart?: boolean;
  onLaunchDemo?: (product: Product) => void;
  isUnlocked?: boolean;
}

export const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  product,
  onClose,
  onBuyNow,
  onAddToCart,
  isInCart = false,
  onLaunchDemo,
  isUnlocked = false,
}) => {
  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (!product) return;
    const productId = product.id;
    async function fetchReviews() {
      setLoadingReviews(true);
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.warn('Failed to load reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchReviews();
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm">
      <div 
        className="w-full max-w-xl h-full bg-[#0e0f13] border-l border-[#1c1d24] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-150"
      >
        {/* Top bar */}
        <div className="p-4 border-b border-[#1a1c22] flex items-center justify-between bg-[#111216]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-medium px-2 py-0.5 rounded bg-[#181a20] text-zinc-300 border border-[#23252f]">
              {product.category.replace('-', ' ')}
            </span>
            {product.badge && (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#181a20] text-zinc-400 border border-[#23252f]">
                {product.badge}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1c24] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Header Title & Tagline */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {product.title}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Creator Profile Card */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#131419] border border-[#1e2027]">
            <div className="flex items-center gap-3">
              <img
                src={product.creator.avatar}
                alt={product.creator.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-white">{product.creator.name}</span>
                  {product.creator.verified && (
                    <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
                <p className="text-xs text-zinc-500">
                  {product.creator.university} • @{product.creator.handle}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-zinc-300 font-bold text-sm">
                <Star className="w-4 h-4 fill-zinc-300 text-zinc-300" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-zinc-500">
                ({product.reviewsCount} reviews)
              </span>
            </div>
          </div>

          {/* Interactive Tool Preview Callout Banner */}
          {onLaunchDemo && ['prod-flow7', 'prod-ci-guardian', 'prod-canvas-autopilot', 'prod-algo-visualizer', 'prod-academic-prompt-vault', 'prod-paper-synthesizer'].includes(product.id) && (
            <div className="p-4 rounded-xl bg-[#14151b] border border-[#21232d] flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-xs text-white">Live In-Browser Tool Preview Available</h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Launch and preview this tool directly in your browser before completing checkout.
                </p>
              </div>
              <button
                onClick={() => onLaunchDemo(product)}
                className="px-3.5 py-1.5 rounded-lg bg-[#1f222b] hover:bg-[#282c38] text-white font-medium text-xs border border-[#2c303e] transition flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Launch Preview</span>
              </button>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">
              About This Tool
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* What's Included */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">
              What&apos;s Included
            </h4>
            <div className="space-y-2">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#111216] border border-[#1b1d24] text-xs text-zinc-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Student Reviews Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-semibold text-zinc-400 tracking-wider flex items-center gap-1.5">
                <MessageSquareQuote className="w-3.5 h-3.5 text-zinc-400" />
                <span>Verified Student Reviews ({reviews.length})</span>
              </h4>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-zinc-300">{product.rating.toFixed(1)}</span> / 5.0
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#111216] border border-[#1b1d24] text-center text-xs text-zinc-500">
                No reviews yet. Be the first verified student buyer to leave a review!
              </div>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-[#121318] border border-[#1c1e26] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{rev.authorName}</span>
                        <span className="text-[11px] text-zinc-500">• {rev.authorUniversity}</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      &quot;{rev.comment}&quot;
                    </p>
                    <div className="text-[10px] text-zinc-500">
                      {rev.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campus Verified Guarantee */}
          <div className="p-4 rounded-xl bg-[#121318] border border-[#1d1f27] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <span>Campus Verified Peer Guarantee</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Every tool on Araxie is built and peer-tested by university students. Purchased licenses and full browser tools are unlocked immediately in your Student Locker (`@me`), backed by PayPal Purchase Protection and verified campus delivery.
            </p>
          </div>

        </div>

        {/* Sticky Bottom Checkout Footer */}
        <div className="p-4 border-t border-[#1a1c22] bg-[#111216] flex items-center justify-between gap-4">
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
            <span className="text-[11px] text-zinc-500">
              One-time purchase • Instant unlock
            </span>
          </div>

          <div>
            {isUnlocked ? (
              <div className="px-4 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Unlocked in Locker</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {onAddToCart && (
                  <button
                    onClick={() => onAddToCart(product)}
                    className={`px-3.5 py-2.5 rounded-lg font-medium text-xs border transition ${
                      isInCart
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-[#181a20] text-zinc-300 hover:text-white border-[#242632] hover:bg-[#20222a]'
                    }`}
                  >
                    {isInCart ? 'In Cart' : '+ Add to Cart'}
                  </button>
                )}
                <button
                  onClick={() => onBuyNow(product)}
                  className="px-5 py-2.5 rounded-lg bg-[#222530] hover:bg-[#2c303f] text-white font-semibold text-xs border border-[#34394b] flex items-center gap-2 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-zinc-300" />
                  <span>Buy with PayPal</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
