'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  DollarSign, 
  Layers, 
  Link2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { Product, ProductCategory } from '@/types';

interface CreatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (newProduct: Product) => void;
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({
  isOpen,
  onClose,
  onProductCreated,
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('chrome-extension');
  const [price, setPrice] = useState('7.99');
  const [assetUrl, setAssetUrl] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Automates repetitive coursework tasks',
    'Tested and verified on campus',
    'Includes step-by-step setup guide'
  ]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const numPrice = parseFloat(price) || 0;
  const platformFee = Number((numPrice * 0.05).toFixed(2));
  const netEarnings = Number((numPrice - platformFee).toFixed(2));

  // AI Polish: calls our live Gemini-backed /api/ai/polish route
  const handleAIPolish = async () => {
    if (!title.trim()) {
      alert('Please enter a tool title first to let the AI polish it.');
      return;
    }
    setIsPolishing(true);
    try {
      const res = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tagline) setTagline(data.tagline);
        if (data.description) setDescription(data.description);
        if (data.features && Array.isArray(data.features)) setFeatures(data.features);
        if (data.suggestedPrice) setPrice(data.suggestedPrice.toFixed(2));
      }
    } catch (err) {
      console.warn('AI polish fallback:', err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || numPrice <= 0 || isSubmitting) return;
    setIsSubmitting(true);

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title,
      tagline: tagline || `Student-built ${category.replace('-', ' ')} utility.`,
      description: description || 'High-utility tool built by a verified university student developer.',
      category,
      price: numPrice,
      originalPrice: Number((numPrice * 1.3).toFixed(2)),
      creator: {
        name: 'You (Student Builder)',
        handle: 'campus_creator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        university: 'University Campus',
        verified: true,
        payoutEmail: 'student.creator.sandbox@araxie.edu',
      },
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      features: features.filter(f => f.trim().length > 0),
      downloadAsset: {
        type: 'download',
        url: assetUrl || 'https://araxie.dev/downloads/sample-tool.zip',
        licenseKeyPrefix: title.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'TOOL'),
      },
      tags: [category.replace('-', ' '), 'Student Build', 'New Release'],
      badge: 'New',
      accentColor: '#3b82f6',
      iconName: 'Sparkles',
    };

    try {
      // Persist to backend DB
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });

      if (res.ok) {
        const saved = await res.json();
        onProductCreated(saved.product || newProd);
      } else {
        onProductCreated(newProd);
      }
    } catch (err) {
      onProductCreated(newProd);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-xl bg-[#0e0f13] border border-[#1e2027] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1a1c22] flex items-center justify-between bg-[#121317]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#181a20] border border-[#23252f] flex items-center justify-center text-zinc-300">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Creator Studio</h3>
              <p className="text-[11px] text-zinc-400">
                List and monetize your student software or study pack
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1c24] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Tool Title & Live AI Polish Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-medium text-zinc-300">Tool / Asset Title</label>
              <button
                type="button"
                onClick={handleAIPolish}
                disabled={isPolishing}
                className="flex items-center gap-1 text-[11px] font-medium text-zinc-300 hover:text-white bg-[#191a22] hover:bg-[#22242f] px-2.5 py-1 rounded-lg border border-[#262836] transition"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isPolishing ? 'Generating with Gemini...' : '✨ Polish with Gemini'}</span>
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. BioLab Data Extractor CLI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#131419] border border-[#1e2027] text-zinc-200 px-3 py-2 rounded-lg focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-medium text-zinc-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#131419] border border-[#1e2027] text-zinc-200 px-3 py-2 rounded-lg focus:outline-none"
              >
                <option value="chrome-extension">Chrome Extension</option>
                <option value="code-template">Code Template / Script</option>
                <option value="study-pack">Study Pack / Notion</option>
                <option value="ai-prompt">AI Prompt Pack</option>
                <option value="saas-micro">Micro-SaaS</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-zinc-300">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                <input
                  type="number"
                  step="0.50"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#131419] border border-[#1e2027] text-zinc-200 pl-7 pr-3 py-2 rounded-lg focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="font-medium text-zinc-300">Tagline</label>
            <input
              type="text"
              placeholder="Crisp 1-sentence value proposition"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#131419] border border-[#1e2027] text-zinc-200 px-3 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-medium text-zinc-300">Description</label>
            <textarea
              rows={2}
              placeholder="What problem does this tool solve for students?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#131419] border border-[#1e2027] text-zinc-200 px-3 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Payout Breakdown Callout */}
          <div className="p-3.5 rounded-lg bg-[#111216] border border-[#1b1c23] space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Listing Price</span>
              <span>${numPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Araxie Student Platform Fee (5%)</span>
              <span className="text-zinc-500">-${platformFee.toFixed(2)}</span>
            </div>
            <div className="pt-1.5 border-t border-[#1a1c22] flex items-center justify-between font-bold text-emerald-400 text-xs">
              <span>Your Net Payout (Dispatched via PayPal Payouts API)</span>
              <span>${netEarnings.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-[#222530] hover:bg-[#2c303f] disabled:opacity-50 text-white font-medium text-xs border border-[#34394b] flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4 text-zinc-300" />
              <span>{isSubmitting ? 'Publishing Tool...' : 'Publish to Student Marketplace'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
