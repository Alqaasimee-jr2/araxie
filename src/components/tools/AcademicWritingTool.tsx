'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Copy, 
  Check, 
  Send, 
  FileText, 
  RotateCcw,
  CheckCircle2,
  Code2
} from 'lucide-react';

export const AcademicWritingTool: React.FC = () => {
  const [mode, setMode] = useState<'literature-review' | 'reviewer-2-rebuttal' | 'latex-formatter'>('literature-review');
  const [subject, setSubject] = useState('Computer Science & Machine Learning');
  const [inputText, setInputText] = useState(
    'Evaluating transformer memory attention bottlenecks in edge deployment scenarios with quantized weights.'
  );
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const samplePrompts: Record<string, { subject: string; text: string }> = {
    'literature-review': {
      subject: 'Computer Science & Distributed Systems',
      text: 'Comparing Raft consensus vs Paxos in geo-replicated database clusters with Byzantine fault tolerance considerations.',
    },
    'reviewer-2-rebuttal': {
      subject: 'Biochemistry / Pharmacology',
      text: 'Reviewer #2 states: "The sample size (n=18) in Table 3 is insufficient to substantiate the claimed inhibitor potency, and the control group lacks rigorous vehicle baseline validation."',
    },
    'latex-formatter': {
      subject: 'Applied Mathematics',
      text: 'Convert the following asymptotic dynamic bundling formula and creator payout share into publication-grade LaTeX: delta(k) = min(0.25, 0.12 * ln(1+k)), P_bundle = sum(P_i)*(1 - delta(k)), Payout_j = sum(P_i * (1 - phi) * (P_bundle / sum(P_m))).',
    },
  };

  const loadSample = (sampleKey: 'literature-review' | 'reviewer-2-rebuttal' | 'latex-formatter') => {
    setMode(sampleKey);
    setSubject(samplePrompts[sampleKey].subject);
    setInputText(samplePrompts[sampleKey].text);
  };

  const handleRun = async () => {
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/ai/academic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, text: inputText, subject }),
      });

      if (!res.ok) throw new Error('Failed to run academic engine');
      const data = await res.json();
      setOutput(data.result);
    } catch (err) {
      setOutput('An error occurred during academic synthesis. Please verify your connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-zinc-200">
      
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#161822] border border-[#262a3c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white">Academic Writing &amp; Prompt Studio</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Academic Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Calibrated academic synthesis, thesis defense rebuttals, and LaTeX mathematical formatting.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => loadSample('literature-review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              mode === 'literature-review'
                ? 'bg-blue-600 text-white'
                : 'bg-[#1b1e2c] text-zinc-400 hover:text-white border border-[#272d42]'
            }`}
          >
            Lit Review
          </button>
          <button
            onClick={() => loadSample('reviewer-2-rebuttal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              mode === 'reviewer-2-rebuttal'
                ? 'bg-blue-600 text-white'
                : 'bg-[#1b1e2c] text-zinc-400 hover:text-white border border-[#272d42]'
            }`}
          >
            Reviewer #2 Rebuttal
          </button>
          <button
            onClick={() => loadSample('latex-formatter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              mode === 'latex-formatter'
                ? 'bg-blue-600 text-white'
                : 'bg-[#1b1e2c] text-zinc-400 hover:text-white border border-[#272d42]'
            }`}
          >
            LaTeX Formatter
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 rounded-xl bg-[#12141d] border border-[#202434] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-300">
            {mode === 'literature-review' && 'Academic Topic & Keywords:'}
            {mode === 'reviewer-2-rebuttal' && 'Peer Reviewer Critique to Rebut:'}
            {mode === 'latex-formatter' && 'Formulas / Notes to Format in LaTeX:'}
          </span>
          <span className="text-zinc-500 text-[11px]">Subject: {subject}</span>
        </div>

        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full bg-[#181b28] border border-[#262c40] text-zinc-200 text-xs p-3 rounded-xl focus:outline-none focus:border-blue-500/60 leading-relaxed"
          placeholder="Enter prompt or thesis excerpt here..."
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500">Quick load sample:</span>
            <button
              onClick={() => loadSample(mode)}
              className="text-[11px] text-blue-400 hover:underline"
            >
              Reset to sample
            </button>
          </div>

          <button
            onClick={handleRun}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Execute Academic Tool</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {output && (
        <div className="p-5 rounded-xl bg-[#10121a] border border-[#202436] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Generated Academic Output</span>
            </div>

            <button
              onClick={copyToClipboard}
              className="px-2.5 py-1 rounded-lg bg-[#191d2c] hover:bg-[#23283c] text-xs text-zinc-300 border border-[#272e44] flex items-center gap-1 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-lg bg-[#0c0d14] border border-[#1a1d29] text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap overflow-x-auto">
            {output}
          </div>
        </div>
      )}

    </div>
  );
};
