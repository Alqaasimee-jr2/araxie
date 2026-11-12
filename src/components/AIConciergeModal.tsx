'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Star,
  CheckCircle2,
  CalendarCheck,
  Binary,
  GraduationCap,
  Code2,
  FileText,
  Atom,
  Clock,
  ShieldCheck,
  ChevronRight
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
  "Sophomore CS student taking algorithms and web dev with a $20 budget.",
  "Pre-med student studying for MCAT and biochemistry exams",
  "Automate Canvas deadlines and track GPA curves",
  "Top campus tools and templates under $10"
];

const FOLLOW_UP_SUGGESTIONS = [
  "What are they used for?",
  "How do I use these tools?",
  "Can you recommend other tools?",
  "Show me other bundles"
];

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
      text: "👋 Hi! I'm your **Araxie Concierge**.\n\nTell me your major, semester courses, or budget—and I'll curate the best student-built tools with an automatic bundle discount.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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

    // Find the latest bundle from messages
    const lastBundle = [...messages].reverse().find(m => m.bundle)?.bundle;
    const activeProductIds = lastBundle ? lastBundle.items.map(i => i.id) : [];

    const historyPayload = messages.slice(-6).map(m => ({
      role: m.sender,
      text: m.text,
      bundleProductIds: m.bundle ? m.bundle.items.map(i => i.id) : undefined,
    }));

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: textToSend, 
          customCatalog: catalog,
          history: historyPayload,
          activeProductIds: activeProductIds,
        }),
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
          text: "I experienced a brief network timeout, but you can explore the verified student catalog directly on the marketplace!",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl h-[88vh] max-h-[720px] flex flex-col rounded-2xl bg-[#0f121d] border border-[#23293e] shadow-2xl overflow-hidden">
        
        {/* Header - Matches Mockup */}
        <div className="px-5 py-3.5 border-b border-[#1d2335] flex items-center justify-between bg-[#131724]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Araxie AI Concierge</h3>
              <p className="text-[11px] text-zinc-400">
                Campus Software Advisor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1f30] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* User Bubble (Centered/Right pill from mockup) */}
              {msg.sender === 'user' ? (
                <div className="max-w-[90%] px-4 py-2.5 rounded-2xl bg-[#192438] text-zinc-100 text-xs sm:text-sm font-medium border border-[#263552] shadow-sm leading-relaxed">
                  <p>{msg.text}</p>
                </div>
              ) : (
                /* Assistant Message with Avatar & Card */
                <div className="flex gap-2.5 max-w-full">
                  <div className="w-6 h-6 rounded-full bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="text-xs text-zinc-300 leading-relaxed">
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Curated Bundle Card - Matches Attached Mockup */}
                    {msg.bundle && (
                      <div className="rounded-xl bg-[#131826] border border-[#22293e] p-4 space-y-3 shadow-lg shadow-black/40">
                        
                        {/* Tools in Bundle */}
                        <div className="space-y-2.5">
                          {msg.bundle.items.map((item) => {
                            const IconComp = ICON_MAP[item.iconName] || Code2;
                            return (
                              <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#0e121d] border border-[#1b2133]">
                                <div 
                                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${item.accentColor}20`, color: item.accentColor }}
                                >
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-xs text-white truncate">
                                      {item.title}
                                    </h4>
                                    {/* Star Rating */}
                                    <div className="flex items-center text-amber-400 text-[10px]">
                                      {[...Array(5)].map((_, idx) => (
                                        <Star key={idx} className="w-2.5 h-2.5 fill-amber-400" />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                                    {item.tagline}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Summary & Strikethrough Row */}
                        <div className="pt-2 border-t border-[#1d2335] flex items-center justify-between text-xs">
                          <span className="font-semibold text-zinc-300">Summary</span>
                          <span className="text-zinc-400">
                            Original Total: <span className="line-through">${msg.bundle.originalTotal.toFixed(2)}</span>
                          </span>
                        </div>

                        {/* Green Bundle Discount Badge */}
                        <div className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[11px] font-bold">
                          {msg.bundle.discountPercentage}% Bundle Discount applied
                        </div>

                        {/* Final Price Row */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="font-bold text-zinc-200">Final Price</span>
                          <span className="text-base font-bold text-white">
                            ${msg.bundle.bundleTotal.toFixed(2)}
                          </span>
                        </div>

                        {/* Blue Primary Button: Proceed to PayPal Checkout */}
                        <button
                          onClick={() => {
                            onCheckoutBundle(msg.bundle!);
                            onClose();
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-xs transition shadow-md shadow-blue-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Proceed to PayPal Checkout</span>
                        </button>

                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 max-w-full animate-in fade-in duration-150">
              <div className="w-6 h-6 rounded-full bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3" />
              </div>
              <div className="px-3.5 py-1.5 rounded-2xl bg-[#141824] border border-[#232a3e] text-zinc-300 text-xs font-mono tracking-widest animate-pulse">
                ...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips (From Mockup) */}
        <div className="px-4 py-2 border-t border-[#1d2335] bg-[#111420] overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          {(messages.length > 2 ? FOLLOW_UP_SUGGESTIONS : SAMPLE_PROMPTS).map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSend(suggestion)}
              className="text-[11px] whitespace-nowrap bg-[#171b29] hover:bg-[#20273c] text-zinc-300 hover:text-white px-2.5 py-1 rounded-lg border border-[#232b3e] transition shrink-0 cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#1d2335] bg-[#121522]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Chat a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#171b29] text-xs sm:text-sm text-white placeholder-zinc-500 px-4 py-2.5 rounded-xl border border-[#232a3e] focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition flex items-center justify-center shrink-0 cursor-pointer"
              title="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
