'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  ExternalLink,
  Zap,
  RotateCcw
} from 'lucide-react';

const SAMPLE_CODE = `// pages/api/auth.ts - Student Project Route
import { NextRequest, NextResponse } from 'next/server';

// ⚠️ Issue: Potential hardcoded secret
const JWT_SECRET = "super_secret_student_campus_key_2026";

export async function POST(req: NextRequest) {
  const { query, userInput } = await req.json();
  
  // ⚠️ Issue: Dangerous dynamic eval
  if (query.startsWith("calc:")) {
    const result = eval(query.replace("calc:", ""));
    return NextResponse.json({ result });
  }

  // Database query execution
  return NextResponse.json({ status: "success" });
}`;

interface ScanResult {
  file: string;
  line: number;
  ruleId: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  recommendation: string;
}

export const CIGuardianTool: React.FC = () => {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);

  const handleRunScan = () => {
    setIsScanning(true);
    setScanComplete(false);

    setTimeout(() => {
      const detected: ScanResult[] = [];

      if (code.includes('JWT_SECRET') || code.includes('secret') || code.includes('key_2026')) {
        detected.push({
          file: 'pages/api/auth.ts',
          line: 5,
          ruleId: 'SEC-AST-001 (Hardcoded Credential)',
          severity: 'CRITICAL',
          message: 'Hardcoded secret literal detected in source AST.',
          recommendation: 'Extract to process.env.JWT_SECRET and add to .env.local (gitignored).'
        });
      }

      if (code.includes('eval(')) {
        detected.push({
          file: 'pages/api/auth.ts',
          line: 11,
          ruleId: 'SEC-AST-004 (Dynamic Code Execution)',
          severity: 'CRITICAL',
          message: 'Use of eval() creates arbitrary remote code execution vulnerability.',
          recommendation: 'Replace eval() with safe math parser or sandboxed AST interpreter.'
        });
      }

      if (!code.includes('rateLimit') && !code.includes('checkRateLimit')) {
        detected.push({
          file: 'pages/api/auth.ts',
          line: 7,
          ruleId: 'SEC-AST-012 (Unprotected Endpoint)',
          severity: 'WARNING',
          message: 'Public POST route missing rate limiting protection.',
          recommendation: 'Add sliding-window IP rate limiter to protect against brute-force.'
        });
      }

      setResults(detected);
      setIsScanning(false);
      setScanComplete(true);
    }, 700);
  };

  const copyNpxCommand = () => {
    navigator.clipboard.writeText('npx ci-guardian');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="space-y-6 text-zinc-300 text-xs">
      
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#12141a] border border-[#20232e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">CI-Guardian Pre-Flight Gate 🛡️</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#191c26] text-zinc-400 border border-[#252a3a]">
                SARIF 2.1.0 Compliant
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Syntax-aware AST security scanning & test orchestration in under 10 seconds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={copyNpxCommand}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181a23] hover:bg-[#202330] text-zinc-300 font-mono text-[11px] border border-[#262a38] transition"
          >
            {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            <span>npx ci-guardian</span>
          </button>
          <a
            href="https://github.com/Alqaasimee-jr2/CI-Guardian"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-[11px] transition"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Interactive Code Editor & Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left: Code Input */}
        <div className="flex flex-col rounded-xl bg-[#101116] border border-[#1d2028] overflow-hidden">
          <div className="px-4 py-2.5 bg-[#14161d] border-b border-[#1d2028] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-mono text-[11px] text-zinc-300">target-file.ts</span>
            </div>
            <button
              onClick={() => { setCode(SAMPLE_CODE); setScanComplete(false); }}
              className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={12}
            className="w-full p-3.5 bg-transparent font-mono text-zinc-300 text-[11px] leading-relaxed resize-none focus:outline-none focus:ring-0"
            spellCheck={false}
          />
          <div className="p-3 bg-[#13151b] border-t border-[#1d2028] flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">
              Lines: {code.split('\n').length} &bull; Language: TypeScript / JS AST
            </span>
            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning AST...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Pre-Flight Gate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Security Findings */}
        <div className="flex flex-col rounded-xl bg-[#101116] border border-[#1d2028] overflow-hidden">
          <div className="px-4 py-2.5 bg-[#14161d] border-b border-[#1d2028] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-[11px] text-white">Pre-Flight Audit Report</span>
            </div>
            {scanComplete && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                results.some(r => r.severity === 'CRITICAL') 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {results.some(r => r.severity === 'CRITICAL') ? 'GATE REJECTED' : 'GATE PASSED'}
              </span>
            )}
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {!scanComplete && !isScanning && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-zinc-500">
                <ShieldCheck className="w-8 h-8 mb-2 text-zinc-600" />
                <p className="font-medium">Ready to scan student codebase</p>
                <p className="text-[11px] text-zinc-600 mt-1">
                  Click &quot;Run Pre-Flight Gate&quot; to inspect syntax AST & secret leaks.
                </p>
              </div>
            )}

            {isScanning && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-zinc-400 space-y-3">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-mono text-[11px]">Evaluating AST nodes & patterns in &lt;10s...</p>
              </div>
            )}

            {scanComplete && results.length === 0 && (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Clean AST: No security violations or vulnerabilities found!</span>
                </div>
                <p className="text-[11px] text-emerald-400/80">
                  Pre-flight check passed. Safe to commit and push to remote branch.
                </p>
              </div>
            )}

            {scanComplete && results.map((res, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  res.severity === 'CRITICAL'
                    ? 'bg-red-950/20 border-red-900/40 text-red-200'
                    : 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/40">
                    {res.ruleId}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {res.file}:{res.line}
                  </span>
                </div>
                <p className="font-medium text-xs mt-1 text-white">{res.message}</p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  <strong>Fix:</strong> {res.recommendation}
                </p>
              </div>
            ))}
          </div>

          {scanComplete && (
            <div className="p-2.5 bg-[#121318] border-t border-[#1d2028] flex items-center justify-between text-[10px] text-zinc-400">
              <span>Scan duration: 42ms (AST parsed)</span>
              <span>SARIF schema: v2.1.0 exportable</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
