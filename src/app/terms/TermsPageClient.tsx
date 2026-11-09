'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Wallet, 
  GraduationCap, 
  RefreshCcw, 
  Scale, 
  Check, 
  Copy, 
  ExternalLink,
  Search,
  ShoppingBag
} from 'lucide-react';
import { LEGAL_SECTIONS, LegalSection } from '@/data/legalTerms';

export default function TermsPageClient() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'creator' | 'honor' | 'refunds'>('terms');
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync hash anchor on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '') as any;
      if (['terms', 'privacy', 'creator', 'honor', 'refunds'].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  const currentSection: LegalSection = LEGAL_SECTIONS[activeTab] || LEGAL_SECTIONS.terms;

  const tabs: Array<{
    id: 'terms' | 'privacy' | 'creator' | 'honor' | 'refunds';
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'privacy', label: 'Student Privacy & FERPA', icon: ShieldCheck },
    { id: 'creator', label: 'Creator & 95% Royalties', icon: Wallet, badge: '95/5' },
    { id: 'honor', label: 'Campus Honor Code', icon: GraduationCap },
    { id: 'refunds', label: 'Refunds & Revocation', icon: RefreshCcw },
  ];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/terms#${activeTab}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const query = searchFilter.trim().toLowerCase();
  const filteredContent = currentSection.content.filter(item => {
    if (!query) return true;
    return (
      item.heading.toLowerCase().includes(query) ||
      item.paragraphs.some(p => p.toLowerCase().includes(query)) ||
      (item.bullets && item.bullets.some(b => b.toLowerCase().includes(query)))
    );
  });

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-zinc-100 flex flex-col selection:bg-blue-600/30 selection:text-white">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1c1d24] bg-[#0c0d10]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-3">
            
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition text-xs font-medium">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Araxie</span>
              </Link>
              <span className="text-zinc-600">/</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-white">Trust &amp; Legal Center</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/marketplace"
                className="px-3 py-1.5 rounded-lg bg-[#181a20] hover:bg-[#20222a] text-zinc-200 text-xs font-medium border border-[#252834] transition flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                <span>Marketplace</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Hero Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121319] border border-[#1e212c] space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Collegiate Transparency &amp; PayPal Platform Compliance</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Araxie Policies, Privacy &amp; Student Trust
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Araxie protects campus developers and student learners with transparent peer-to-peer commerce terms, industry-leading 95% creator royalties, cryptographic HMAC license protection, and a strict Campus Honor Code.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
            <span>Effective: {currentSection.effectiveDate}</span>
            <span>&bull;</span>
            <span>Last Updated: {currentSection.lastUpdated}</span>
            <span>&bull;</span>
            <button
              onClick={handleCopyLink}
              className="text-blue-400 hover:text-blue-300 transition flex items-center gap-1 font-medium"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Policy Link'}</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#1c1e28] bg-[#0c0d12] rounded-xl p-1 gap-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchFilter('');
                  if (typeof window !== 'undefined') {
                    window.location.hash = tab.id;
                  }
                }}
                className={`py-2.5 px-3.5 text-xs font-medium rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1e212b] text-white border border-[#2a2e3d] shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14151c]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search bar inside policy */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#11131a] border border-[#1d202b]">
          <div>
            <h2 className="text-base font-bold text-white">{currentSection.title}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{currentSection.shortDesc}</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search in this policy..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full bg-[#161822] text-xs text-zinc-200 placeholder-zinc-500 pl-9 pr-3 py-2 rounded-lg border border-[#262938] focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Policy Content */}
        <div className="space-y-6">
          {filteredContent.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 space-y-2 rounded-xl border border-dashed border-[#1f222e]">
              <Search className="w-8 h-8 mx-auto text-zinc-600" />
              <p className="text-sm">No sections found matching &quot;{searchFilter}&quot;.</p>
              <button
                onClick={() => setSearchFilter('')}
                className="text-xs text-blue-400 hover:underline"
              >
                Reset search filter
              </button>
            </div>
          ) : (
            filteredContent.map((section, idx) => (
              <div 
                key={idx}
                className="p-5 sm:p-7 rounded-2xl bg-[#11131a] border border-[#1e212c] space-y-3.5"
              >
                <h3 className="font-bold text-base text-white flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {section.heading}
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-2 pt-2 pl-4 border-l-2 border-zinc-800 text-xs sm:text-sm text-zinc-400">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="list-disc">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#17181f] bg-[#0c0d10] py-8 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Araxie Logo" className="w-5 h-5 rounded" />
            <span className="font-bold text-zinc-200">Araxie</span>
            <span>&bull;</span>
            <span>Campus Software &amp; Digital Tool Marketplace</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px]">
            <Link href="/" className="text-zinc-400 hover:text-white transition">
              Home
            </Link>
            <Link href="/marketplace" className="text-zinc-400 hover:text-white transition">
              Marketplace
            </Link>
            <Link href="/public" className="text-zinc-400 hover:text-white transition">
              Public Space
            </Link>
            <a 
              href="https://github.com/Alqaasimee-jr2/araxie" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-400 hover:text-white transition"
            >
              GitHub
            </a>
            <span className="text-zinc-600">&copy; 2026 Araxie Inc.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
