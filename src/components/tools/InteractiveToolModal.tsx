'use client';

import React from 'react';
import { X, ShieldCheck, ExternalLink, Terminal } from 'lucide-react';
import { CanvasAutoPilotTool } from './CanvasAutoPilotTool';
import { AlgoVisualizerTool } from './AlgoVisualizerTool';
import { AcademicWritingTool } from './AcademicWritingTool';

interface InteractiveToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId?: string;
  toolTitle?: string;
}

export const InteractiveToolModal: React.FC<InteractiveToolModalProps> = ({
  isOpen,
  onClose,
  toolId,
  toolTitle,
}) => {
  if (!isOpen) return null;

  const renderToolComponent = () => {
    if (toolId === 'prod-algo-visualizer') {
      return <AlgoVisualizerTool />;
    } else if (toolId === 'prod-academic-prompt-vault' || toolId === 'prod-paper-synthesizer') {
      return <AcademicWritingTool />;
    } else {
      // Default to CanvasAutoPilot or contextual
      return <CanvasAutoPilotTool />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0e0f14] border border-[#21232d] shadow-2xl overflow-hidden">
        
        {/* Top App Bar */}
        <div className="px-5 py-3.5 border-b border-[#1c1e28] flex items-center justify-between bg-[#121319]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white">
                  {toolTitle || 'Interactive Student Tool Studio'}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Campus Verified
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Live in-browser execution environment backed by Araxie
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1c26] transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Workspace Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#0a0b0e]">
          {renderToolComponent()}
        </div>

      </div>
    </div>
  );
};
