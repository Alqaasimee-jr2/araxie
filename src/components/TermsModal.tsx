'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  Wallet, 
  GraduationCap, 
  RefreshCcw, 
  Check, 
  Copy, 
  ExternalLink,
  Search,
  Scale
} from 'lucide-react';
import { LEGAL_SECTIONS, LegalSection } from '@/data/legalTerms';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'creator' | 'honor' | 'refunds';
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'creator' | 'honor' | 'refunds'>(initialTab);
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

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
    const url = `${window.location.origin}/terms#${activeTab}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter content by search query
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0e0f14] border border-[#21232d] shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-[#1c1e28] flex items-center justify-between bg-[#121319]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white">Campus Legal &amp; Student Trust Hub</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified Campus Standard
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Transparent policies governing digital tools, PayPal transactions, creator royalties, and academic integrity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy link to this policy"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1c26] transition flex items-center gap-1 text-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1c26] transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1c1e28] bg-[#0c0d12] px-5 gap-2 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchFilter('');
                }}
                className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                  isActive
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
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

        {/* Subheader with search & metadata */}
        <div className="px-5 py-3 border-b border-[#181a24] bg-[#10121a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-white text-sm">{currentSection.title}</h4>
            <p className="text-zinc-400 text-[11px] mt-0.5">{currentSection.shortDesc}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search policy..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-48 bg-[#151722] text-xs text-zinc-200 placeholder-zinc-500 pl-8 pr-3 py-1.5 rounded-lg border border-[#232738] focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-[10px] text-zinc-500 hidden md:inline">
              Updated: {currentSection.lastUpdated}
            </span>
          </div>
        </div>

        {/* Policy Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs text-zinc-300 leading-relaxed bg-[#0b0c10]">
          {filteredContent.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-zinc-600" />
              <p>No sections matching &quot;{searchFilter}&quot;.</p>
              <button
                onClick={() => setSearchFilter('')}
                className="text-blue-400 hover:underline text-[11px]"
              >
                Clear filter
              </button>
            </div>
          ) : (
            filteredContent.map((section, idx) => (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-[#12141c] border border-[#1e2230] space-y-3"
              >
                <h5 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {section.heading}
                </h5>

                <div className="space-y-2.5 text-zinc-300">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-1.5 pt-1 pl-4 border-l border-zinc-800 text-zinc-400">
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

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#1c1e28] bg-[#0c0d12] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Complies with PayPal Acceptable Use Policy &amp; University Digital Ethics Standards</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/terms"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white bg-[#151722] border border-[#232738] transition flex items-center gap-1.5 text-xs"
            >
              <span>Full Page View</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition"
            >
              I Understand
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
