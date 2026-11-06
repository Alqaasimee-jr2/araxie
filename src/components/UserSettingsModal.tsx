'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  GraduationCap, 
  ShieldCheck, 
  Wallet, 
  Check, 
  Save, 
  Bell, 
  Building2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserProfile } from '@/types';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'payouts' | 'verification' | 'notifications'>('profile');
  
  // Form State initialized from currentUser
  const [name, setName] = useState(currentUser?.name || 'Student Learner');
  const [university, setUniversity] = useState(currentUser?.university || 'University Campus');
  const [email, setEmail] = useState(currentUser?.email || 'student@university.edu');
  const [major, setMajor] = useState(currentUser?.major || 'Computer Science');
  const [gradYear, setGradYear] = useState(currentUser?.gradYear || '2026');
  const [bio, setBio] = useState(currentUser?.bio || 'Building and discovering high-utility student software on Araxie.');
  const [payoutEmail, setPayoutEmail] = useState(currentUser?.payoutEmail || currentUser?.email || 'payouts@university.edu');
  const [autoDisburse, setAutoDisburse] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [courseAlerts, setCourseAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: UserProfile = {
      ...currentUser,
      name,
      university,
      email,
      major,
      gradYear,
      bio,
      payoutEmail,
    };

    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0e0f14] border border-[#21232d] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-[#1c1e28] flex items-center justify-between bg-[#121319]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Account & Campus Settings</h3>
              <p className="text-[11px] text-zinc-400">
                Manage your student identity, verified status, and PayPal payout preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1c26] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1c1e28] bg-[#0c0d12] px-5 gap-4 overflow-x-auto">
          {[
            { id: 'profile', label: 'Student Profile', icon: User },
            { id: 'payouts', label: 'PayPal & Payouts', icon: Wallet },
            { id: 'verification', label: 'Campus Verification', icon: ShieldCheck },
            { id: 'notifications', label: 'Preferences', icon: Bell },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs text-zinc-300">
          
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#13151c] border border-[#1e212b]">
                <img
                  src={currentUser?.avatar || '/avatars/default.svg'}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-700"
                />
                <div>
                  <h4 className="font-semibold text-sm text-white">{name}</h4>
                  <p className="text-[11px] text-zinc-400">{university} &bull; Class of {gradYear}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {currentUser?.role === 'student_creator' ? 'Verified Student Creator' : 'Verified Student Member'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-zinc-400 block mb-1">Full Legal / Preferred Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#13151c] border border-[#20232e] text-white p-2.5 rounded-lg focus:outline-none focus:border-zinc-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">University / College</label>
                  <input
                    type="text"
                    value={university}
                    onChange={e => setUniversity(e.target.value)}
                    className="w-full bg-[#13151c] border border-[#20232e] text-white p-2.5 rounded-lg focus:outline-none focus:border-zinc-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Major or Academic Focus</label>
                  <input
                    type="text"
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                    className="w-full bg-[#13151c] border border-[#20232e] text-white p-2.5 rounded-lg focus:outline-none focus:border-zinc-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Expected Graduation Year</label>
                  <input
                    type="text"
                    value={gradYear}
                    onChange={e => setGradYear(e.target.value)}
                    className="w-full bg-[#13151c] border border-[#20232e] text-white p-2.5 rounded-lg focus:outline-none focus:border-zinc-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Bio / Creator Statement</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full bg-[#13151c] border border-[#20232e] text-white p-2.5 rounded-lg focus:outline-none focus:border-zinc-500 font-medium resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Payouts & PayPal */}
          {activeTab === 'payouts' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#12141c] to-[#0e1017] border border-[#202432] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span>Instant Creator Payout Rails</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    95% Net Revenue Royalty
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  When other students purchase your tools or bundles, earnings are disbursed directly into your PayPal account minus the standard 5% platform fee.
                </p>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">PayPal Account Email</label>
                <input
                  type="email"
                  value={payoutEmail}
                  onChange={e => setPayoutEmail(e.target.value)}
                  placeholder="your-paypal-account@email.com"
                  className="w-full bg-[#13151c] border border-[#20232e] text-white p-2.5 rounded-lg focus:outline-none focus:border-zinc-500 font-mono text-xs"
                  required
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Must be a valid PayPal account able to receive incoming commercial payout batches.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121319] border border-[#1e202a] flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-white text-xs">Instant Payout Auto-Disbursement</h5>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Automatically trigger PayPal payouts upon order settlement without manual withdrawal.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoDisburse}
                  onChange={e => setAutoDisburse(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-0"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Campus Verification */}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#12131a] border border-[#1f222d] space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-white text-xs">Verified Campus Student Pass</h4>
                    <p className="text-[11px] text-zinc-400">Accredited university student standing on Araxie</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0e0f14] border border-[#1c1d25] space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Domain Status:</span>
                    <span className="text-emerald-400">VERIFIED (.edu / .ac.uk / .edu.ng)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Institution:</span>
                    <span className="text-white">{university}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Buyer Protection:</span>
                    <span className="text-emerald-400">ACTIVE &bull; PayPal Purchase Protected</span>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Verified students gain full access to course-specific software bundles, student locker key storage, closed-loop peer reviews, and creator distribution.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Preferences */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#121319] border border-[#1e202a] flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-white text-xs">Email Transaction Receipts</h5>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Receive immediate cryptographic license key receipts and PayPal invoices.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailReceipts}
                  onChange={e => setEmailReceipts(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-0"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#121319] border border-[#1e202a] flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-white text-xs">Course Software & Deadline Alerts</h5>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Get notifications when new tools for your enrolled courses are published.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={courseAlerts}
                  onChange={e => setCourseAlerts(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-0"
                />
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-[#1c1e28] flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              {isSaved ? '✓ Changes saved successfully!' : 'All settings encrypted and saved to session'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-[#16171e] hover:bg-[#1e202a] text-zinc-300 font-medium text-xs transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaved}
                className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs flex items-center gap-1.5 transition shadow-lg"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
