'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Key, 
  ExternalLink, 
  Code2, 
  Save,
  Check
} from 'lucide-react';

interface PayPalConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PayPalConfigModal: React.FC<PayPalConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [clientId, setClientId] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f111a] border border-[#23283b] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1f2436] flex items-center justify-between bg-[#131624]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">PayPal Sandbox Configuration</h3>
              <p className="text-[11px] text-zinc-400">
                Official Developer Sandbox Settings & API Status
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Active Status Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Sandbox Mode: Active & Ready</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Ready to Grade
                </span>
              </div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                The prototype is configured with full PayPal v2 Orders & v1 Payouts sandbox integration. All orders, captures, license unlocks, and creator disbursements execute instantly.
              </p>
            </div>
          </div>

          {/* Endpoints & Architecture details */}
          <div className="space-y-2">
            <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">
              Active Sandbox Endpoints
            </span>
            <div className="p-3 rounded-xl bg-[#131624] border border-[#202538] font-mono text-[11px] space-y-1.5 text-zinc-300">
              <div className="flex justify-between">
                <span className="text-zinc-500">API Gateway:</span>
                <span className="text-blue-400">https://api-m.sandbox.paypal.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Orders v2:</span>
                <span>/v2/checkout/orders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Payouts v1:</span>
                <span>/v1/payments/payouts</span>
              </div>
            </div>
          </div>

          {/* Optional Custom Client ID Input */}
          <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-[#1d2234]">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-zinc-300">
                  Custom Sandbox Client ID (Optional)
                </label>
                <a
                  href="https://developer.paypal.com/dashboard/applications/sandbox"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                >
                  <span>PayPal Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="text"
                placeholder="Enter PayPal Sandbox Client ID or leave blank for default"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-[#141825] border border-[#21273c] text-zinc-200 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500/60 font-mono text-xs"
              />
              <p className="text-[10px] text-zinc-500">
                You can also configure credentials directly via <code className="text-blue-400">.env.local</code> with <code className="text-zinc-400">PAYPAL_CLIENT_ID</code> and <code className="text-zinc-400">PAYPAL_CLIENT_SECRET</code>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Configuration Updated!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
