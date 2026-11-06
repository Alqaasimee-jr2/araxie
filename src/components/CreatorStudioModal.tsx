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

  if (!isOpen) return null;

  const numPrice = parseFloat(price) || 0;
  const platformFee = Number((numPrice * 0.05).toFixed(2));
  const netEarnings = Number((numPrice - platformFee).toFixed(2));

  // AI Polish: enhances product copy and feature set
  const handleAIPolish = () => {
    if (!title.trim()) {
      alert('Please enter a tool title first to let the AI polish it.');
      return;
    }
    setIsPolishing(true);
    setTimeout(() => {
      setTagline(`The ultimate student-built ${category.replace('-', ' ')} engineered to accelerate coursework and study efficiency.`);
      setDescription(`Built by university developers for peers tackling rigorous coursework. ${title} streamlines complex academic workflows, eliminates friction, and guarantees privacy with 100% student-focused design.`);
      setFeatures([
        `Direct integration with campus platforms and workflow tools`,
        `Zero setup friction: ready to launch in under 60 seconds`,
        `100% peer-tested across active undergraduate courses`,
        `Lifetime updates and dedicated student developer support`
      ]);
      setIsPolishing(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || numPrice <= 0) {
      alert('Please fill out the title and a valid price.');
      return;
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title,
      tagline: tagline || `Student-built ${category.replace('-', ' ')} utility.`,
      description: description || 'High-utility tool built by a verified university student developer.',
      category,
      price: numPrice,
      originalPrice: Number((numPrice * 1.4).toFixed(2)),
      creator: {
        name: 'You (Student Creator)',
        handle: 'creator_me',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        university: 'Verified University',
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
        licenseKeyPrefix: title.substring(0, 4).toUpperCase(),
      },
      tags: [category.replace('-', ' '), 'Student Build', 'New Release'],
      badge: 'New',
      accentColor: '#3b82f6',
      iconName: 'Sparkles',
    };

    onProductCreated(newProd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0f111a] border border-[#23283b] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1f2436] flex items-center justify-between bg-[#131624]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Creator Studio</h3>
              <p className="text-[11px] text-zinc-400">
                Monetize your code, extension, or study suite in 2 minutes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1c2132] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Tool Title & AI Polish Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-300">Tool / Asset Title</label>
              <button
                type="button"
                onClick={handleAIPolish}
                disabled={isPolishing}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-500/20 transition"
              >
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>{isPolishing ? 'AI Polishing...' : '✨ AI Polish Copy'}</span>
              </button>
            </div>
            <input
              type="text"
              placeholder="e.g. BioLab Data Extractor CLI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#141825] border border-[#21273c] text-zinc-200 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500/60"
            />
          </div>

          {/* Category & Pricing in two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#141825] border border-[#21273c] text-zinc-200 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500/60"
              >
                <option value="chrome-extension">Chrome Extension</option>
                <option value="code-template">Code Template / Script</option>
                <option value="study-pack">Study Pack / Notion</option>
                <option value="ai-prompt">AI Prompt Pack</option>
                <option value="saas-micro">Micro-SaaS</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                <input
                  type="number"
                  step="0.50"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#141825] border border-[#21273c] text-zinc-200 pl-7 pr-3 py-2 rounded-xl focus:outline-none focus:border-blue-500/60"
                />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">One-Line Tagline</label>
            <input
              type="text"
              placeholder="Catchy sentence summarizing the core benefit"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#141825] border border-[#21273c] text-zinc-200 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500/60"
            />
          </div>

          {/* Asset URL / Download Link */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Download or Access URL</label>
            <input
              type="url"
              placeholder="https://github.com/you/repo or Notion link"
              value={assetUrl}
              onChange={(e) => setAssetUrl(e.target.value)}
              className="w-full bg-[#141825] border border-[#21273c] text-zinc-200 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500/60"
            />
          </div>

          {/* Real-Time PayPal Payout Breakdown */}
          <div className="p-3 rounded-xl bg-[#111522] border border-[#20263b] space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Listing Price</span>
              <span>${numPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Araxie Student Platform Fee (5%)</span>
              <span className="text-zinc-500">-${platformFee.toFixed(2)}</span>
            </div>
            <div className="pt-1.5 border-t border-[#1e2436] flex items-center justify-between font-bold text-emerald-400 text-sm">
              <span>Your Net Payout (via PayPal Payouts API)</span>
              <span>${netEarnings.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Tool to Campus Marketplace</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
