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
  ExternalLink
} from 'lucide-react';
import { DynamicBundle, Product } from '@/types';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutBundle: (bundle: DynamicBundle) => void;
  catalog: Product[];
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  bundle?: DynamicBundle;
  suggestedProducts?: Product[];
}

const SAMPLE_PROMPTS = [
  "Sophomore CS student, taking Algorithms & Web Dev, budget $20",
  "Pre-med student studying for MCAT and Organic Chem exam",
  "Chrome extensions to keep track of Canvas deadlines and GPA",
  "Student tools and templates under $8"
];

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({
  isOpen,
  onClose,
  onCheckoutBundle,
  catalog,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 Hey there! I'm your **Araxie AI Concierge**. Tell me your major, current courses, or academic goals—and I'll autonomously assemble the best peer-built tools and calculate a custom student bundle discount for you.",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          text: "I'm having a brief connection blip, but you can explore the curated student catalog in the Explore feed anytime!",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl h-[90vh] max-h-[750px] flex flex-col rounded-2xl bg-[#0f1118] border border-[#23283a] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1f2434] flex items-center justify-between bg-[#131622]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/10 shrink-0">
              <img src="/logo.svg" alt="Araxie AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white">Araxie AI Concierge</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Agentic Commerce
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Autonomous Student Tool Matchmaker & Dynamic Bundler
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
                  <img src="/logo.svg" alt="Araxie AI" className="w-full h-full object-cover" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-3 ${msg.sender === 'user' ? 'items-end' : ''}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-[#151824] text-zinc-200 border border-[#212638] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

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
                    <div className="space-y-2">
                      {msg.bundle.items.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center justify-between p-2 rounded-lg bg-[#0f121d] border border-[#1b2030] text-xs"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="font-medium text-zinc-200 truncate">{item.title}</span>
                            <span className="text-[10px] text-zinc-500">by {item.creator.name}</span>
                          </div>
                          <span className="font-semibold text-zinc-300 shrink-0">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing Breakdown & Instant PayPal Checkout CTA */}
                    <div className="pt-2 border-t border-[#21273c] flex items-center justify-between gap-3">
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
                          You save ${msg.bundle.savings.toFixed(2)}
                        </span>
                      </div>

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
              <span>Analyzing student tools & optimizing bundle discount...</span>
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
              className="text-[11px] text-zinc-300 hover:text-white bg-[#171b28] hover:bg-[#202538] border border-[#23293c] px-2.5 py-1 rounded-lg shrink-0 transition"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#1f2434] bg-[#0d0f17]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="e.g. Taking CS & Organic Chem, what tools do I need for $15?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-[#151824] text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 px-3.5 py-2.5 rounded-xl border border-[#212638] focus:outline-none focus:border-blue-500/60 transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 transition"
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
