'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  ShoppingBag, 
  Layers, 
  Tag, 
  CheckCircle2,
  ExternalLink,
  Play,
  Check,
  Plus,
  CreditCard
} from 'lucide-react';
import { DynamicBundle, Product } from '@/types';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutBundle: (bundle: DynamicBundle) => void;
  catalog: Product[];
  onLaunchDemo?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onQuickBuy?: (product: Product) => void;
  onFilterCatalog?: (query: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  bundle?: DynamicBundle;
  suggestedProducts?: Product[];
}

const SAMPLE_PROMPTS = [
  "CS student at OAU studying algorithms, devops, and deep work",
  "Pre-med student at UI preparing for clinical & biochemistry exams",
  "Campus tools to automate lecture schedules and track GPA",
  "Essential student utilities and templates under $8"
];

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({
  isOpen,
  onClose,
  onCheckoutBundle,
  catalog,
  onLaunchDemo,
  onAddToCart,
  onQuickBuy,
  onFilterCatalog,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 Hello! I'm **araxieAi**, your autonomous campus commerce advisor. Tell me your department, university courses, or academic goals—and I'll curate the best peer-built tools and calculate a custom student bundle discount for you with instant PayPal checkout.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, customCatalog: catalog }),
      });

      if (!res.ok) throw new Error('AI failed to respond');
      const data = await res.json();

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        bundle: data.bundle,
        suggestedProducts: data.suggestedProducts,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I experienced a brief network timeout, but you can explore the verified Nigerian student catalog directly on the marketplace!",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = (product: Product) => {
    onAddToCart?.(product);
    setAddedItemIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[90vh] max-h-[750px] flex flex-col rounded-2xl bg-[#0f1118] border border-[#23283a] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1f2434] flex items-center justify-between bg-[#131622]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/10 shrink-0">
              <img src="/logo.svg" alt="araxieAi Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white">araxieAi Advisor</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Autonomous Commerce
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                AI student software recommendations &amp; dynamic bundle discounts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1c2030] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 mt-0.5 ring-1 ring-blue-500/30">
                  <img src="/logo.svg" alt="araxieAi" className="w-full h-full object-cover" />
                </div>
              )}

              <div className={`max-w-[88%] space-y-3 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-[#151824] text-zinc-200 border border-[#212638] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Individual Tool Recommendations in Chat */}
                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Recommended Campus Tools ({msg.suggestedProducts.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.suggestedProducts.map(prod => (
                        <div 
                          key={prod.id}
                          className="p-3 rounded-xl bg-[#12141f] border border-[#222738] flex flex-col justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1c2030] text-zinc-400">
                                {prod.category}
                              </span>
                              <span className="text-xs font-bold text-white">
                                ${prod.price.toFixed(2)}
                              </span>
                            </div>
                            <h4 className="font-semibold text-xs text-zinc-100 mt-1 truncate">
                              {prod.title}
                            </h4>
                            <p className="text-[10px] text-zinc-400 line-clamp-1">
                              {prod.tagline}
                            </p>
                            <span className="text-[9px] text-zinc-500 block mt-0.5">
                              By {prod.creator.name} ({prod.creator.university.split(' ')[0]})
                            </span>
                          </div>

                          {/* Action Buttons: Demo, Add to Cart, Quick Buy */}
                          <div className="flex items-center gap-1.5 pt-1 border-t border-[#1a1e2b]">
                            {onLaunchDemo && (
                              <button
                                onClick={() => {
                                  onLaunchDemo(prod);
                                  onClose();
                                }}
                                className="px-2 py-1 rounded-lg text-[10px] font-medium bg-[#1a1f2e] hover:bg-[#22293e] text-cyan-300 border border-[#273048] transition flex items-center gap-1"
                                title="Run in-browser demo"
                              >
                                <Play className="w-2.5 h-2.5 fill-cyan-300" />
                                <span>Demo</span>
                              </button>
                            )}

                            {onAddToCart && (
                              <button
                                onClick={() => handleAddItem(prod)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition flex items-center gap-1 border ${
                                  addedItemIds[prod.id]
                                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                                    : 'bg-[#181a24] hover:bg-[#202434] text-zinc-300 border-[#282d3e]'
                                }`}
                                title="Add to cart"
                              >
                                {addedItemIds[prod.id] ? (
                                  <>
                                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>Added</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-2.5 h-2.5" />
                                    <span>Cart</span>
                                  </>
                                )}
                              </button>
                            )}

                            {onQuickBuy && (
                              <button
                                onClick={() => {
                                  onQuickBuy(prod);
                                  onClose();
                                }}
                                className="flex-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-zinc-200 text-black transition flex items-center justify-center gap-1 shadow-sm"
                                title="Instant PayPal checkout"
                              >
                                <CreditCard className="w-2.5 h-2.5 text-black" />
                                <span>Buy Now</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render Dynamic Bundle Card if generated by the AI */}
                {msg.bundle && (
                  <div className="rounded-xl bg-[#141825] border border-blue-500/30 p-4 space-y-3 shadow-lg shadow-black/40">
                    <div className="flex items-center justify-between pb-2 border-b border-[#21273c]">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-xs text-white">
                          {msg.bundle.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {msg.bundle.discountPercentage}% Bundle Savings
                      </span>
                    </div>

                    {/* Bundle items list */}
                    <div className="space-y-1.5">
                      {msg.bundle.items.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between p-2 rounded-lg bg-[#0f121d] border border-[#1b2030] text-xs"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="font-medium text-zinc-200 truncate">{item.title}</span>
                            <span className="text-[10px] text-zinc-500">by {item.creator.name} ({item.creator.university.split(' ')[0]})</span>
                          </div>
                          <span className="font-semibold text-zinc-300 shrink-0">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing Breakdown & Instant PayPal Checkout CTA */}
                    <div className="pt-2 border-t border-[#21273c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-white">
                            ${msg.bundle.bundleTotal.toFixed(2)}
                          </span>
                          <span className="text-xs text-zinc-500 line-through">
                            ${msg.bundle.originalTotal.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          Autonomous discount: save ${msg.bundle.savings.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {onAddToCart && (
                          <button
                            onClick={() => {
                              msg.bundle?.items.forEach(it => onAddToCart(it));
                              onClose();
                            }}
                            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a1f2e] hover:bg-[#22293e] text-zinc-200 border border-[#2b334a] transition"
                          >
                            Add Bundle to Cart
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onCheckoutBundle(msg.bundle!);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition transform active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Pay with PayPal</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center shrink-0 mt-0.5 text-zinc-300">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-blue-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>araxieAi analyzing student tools & calculating bundle discount...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-t border-[#1c2030] bg-[#111420] overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-zinc-500 shrink-0 mr-1">
            Try:
          </span>
          {SAMPLE_PROMPTS.map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSend(promptText)}
              className="text-[11px] whitespace-nowrap bg-[#171b29] hover:bg-[#20263a] text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg border border-[#232a3e] transition shrink-0"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#1f2434] bg-[#121420]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tell araxieAi your department, courses, or budget..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#171b29] text-xs sm:text-sm text-white placeholder-zinc-500 px-4 py-2.5 rounded-xl border border-[#232a3e] focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs sm:text-sm transition flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
