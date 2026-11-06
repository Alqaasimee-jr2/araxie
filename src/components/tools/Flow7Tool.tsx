'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  Download, 
  ExternalLink,
  Plus,
  Flame,
  Zap,
  BarChart2,
  Calendar
} from 'lucide-react';

interface WorkSession {
  id: string;
  category: 'Deep Work / Code' | 'Academic Research' | 'Architecture / Design' | 'Problem Set';
  title: string;
  durationMinutes: number;
  timestamp: string;
  focusScore: number; // 0 - 100%
}

const DEFAULT_SESSIONS: WorkSession[] = [
  {
    id: 's1',
    category: 'Deep Work / Code',
    title: 'AST Security Scanner & SARIF 2.1.0 Exporter (CI-Guardian)',
    durationMinutes: 145,
    timestamp: 'Today, 09:15 AM',
    focusScore: 94,
  },
  {
    id: 's2',
    category: 'Academic Research',
    title: 'Distributed Systems Consensus & Paxos Proofs',
    durationMinutes: 75,
    timestamp: 'Today, 01:30 PM',
    focusScore: 88,
  },
  {
    id: 's3',
    category: 'Architecture / Design',
    title: 'Flow7 Performance State Machine & Cognitive Heatmaps',
    durationMinutes: 90,
    timestamp: 'Today, 03:45 PM',
    focusScore: 96,
  },
];

const WEEKLY_HEATMAP = [
  { day: 'Mon', hours: 6.2, deepRatio: 82, intensity: 'high' },
  { day: 'Tue', hours: 5.4, deepRatio: 78, intensity: 'medium' },
  { day: 'Wed', hours: 7.1, deepRatio: 89, intensity: 'high' },
  { day: 'Thu', hours: 4.8, deepRatio: 72, intensity: 'medium' },
  { day: 'Fri', hours: 6.8, deepRatio: 85, intensity: 'high' },
  { day: 'Sat', hours: 3.5, deepRatio: 65, intensity: 'low' },
  { day: 'Sun', hours: 5.2, deepRatio: 80, intensity: 'medium' },
];

export const Flow7Tool: React.FC = () => {
  // Session Timer State
  const [secondsElapsed, setSecondsElapsed] = useState(1540); // 25m 40s pre-populated
  const [isRunning, setIsRunning] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'Deep Work / Code' | 'Academic Research' | 'Architecture / Design' | 'Problem Set'>('Deep Work / Code');
  const [sessionTitle, setSessionTitle] = useState('Optimizing Flow7 sub-second session logger & visual matrix');
  const [sessions, setSessions] = useState<WorkSession[]>(DEFAULT_SESSIONS);
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecordSession = () => {
    if (secondsElapsed < 30) return;
    const durationMins = Math.max(1, Math.round(secondsElapsed / 60));
    const newSession: WorkSession = {
      id: `sess-${Date.now()}`,
      category: activeCategory,
      title: sessionTitle || 'Independent Focus Block',
      durationMinutes: durationMins,
      timestamp: 'Just now',
      focusScore: Math.min(100, Math.max(82, Math.round(85 + Math.random() * 14))),
    };
    setSessions([newSession, ...sessions]);
    setSecondsElapsed(0);
    setIsRunning(false);
  };

  const exportTimesheet = () => {
    const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const content = `# Flow7 Performance Accountability Debrief
Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Platform: Flow7 Performance Awareness Layer (Araxie Student Marketplace)
Creator: Abdullah Qaasim-Falade (NIT7ER Studio)

## Summary Statistics
- Total Tracked Effort: ${(totalMinutes / 60).toFixed(1)} hours (${sessions.length} sessions)
- Cognitive Coherence: 91.4%
- Primary Mode: ${activeCategory}

## Session Ledger (Evidence Over Intention)
${sessions.map((s, i) => `${i + 1}. [${s.category}] ${s.title}
   - Duration: ${s.durationMinutes} min
   - Focus Score: ${s.focusScore}%
   - Recorded: ${s.timestamp}`).join('\n\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow7-performance-debrief-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);

    setExportedStatus('✓ Timesheet exported as Markdown');
    setTimeout(() => setExportedStatus(null), 3000);
  };

  const totalTrackedHours = (sessions.reduce((acc, s) => acc + s.durationMinutes, 0) / 60).toFixed(1);

  return (
    <div className="space-y-6 text-zinc-300 text-xs">
      
      {/* Top Hero Banner */}
      <div className="p-4 rounded-xl bg-[#12141a] border border-[#20232e] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Flow7 — The Calm Performance Layer</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Evidence Over Intention
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Objective time & cognitive energy tracking designed for independent student builders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={exportTimesheet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181a23] hover:bg-[#202330] text-zinc-300 text-[11px] font-medium border border-[#262a38] transition"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export Debrief</span>
          </button>
          <a
            href="https://github.com/Alqaasimee-jr2/Flow7-Landing-Page"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-[11px] transition"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>

      {exportedStatus && (
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-medium">
          {exportedStatus}
        </div>
      )}

      {/* Main Grid: Active Session Timer & Real-time Cognitive Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Live Session Tracker (7 cols) */}
        <div className="lg:col-span-7 rounded-xl bg-[#101116] border border-[#1d2028] p-5 flex flex-col justify-between space-y-5">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
                {isRunning ? 'Recording Live Work Session' : 'Session Ready (Zero Friction)'}
              </span>
              <span className="text-[11px] font-mono text-indigo-400">
                Mode: {activeCategory}
              </span>
            </div>

            {/* Large Digital Stopwatch */}
            <div className="my-5 text-center">
              <div className="text-5xl sm:text-6xl font-mono font-bold tracking-tight text-white drop-shadow-md">
                {formatTimer(secondsElapsed)}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                {Math.round(secondsElapsed / 60)} minutes of validated deep effort
              </p>
            </div>

            {/* Mode Selector Tabs */}
            <div className="space-y-2">
              <label className="text-[11px] text-zinc-400 font-medium">Cognitive Focus Domain:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['Deep Work / Code', 'Academic Research', 'Architecture / Design', 'Problem Set'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-medium border text-center transition ${
                      activeCategory === cat 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' 
                        : 'bg-[#15171f] border-[#20232e] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Objective Input */}
            <div className="mt-4 space-y-1.5">
              <label className="text-[11px] text-zinc-400 font-medium">Objective Description:</label>
              <input
                type="text"
                value={sessionTitle}
                onChange={e => setSessionTitle(e.target.value)}
                placeholder="What objective deliverable are you completing?"
                className="w-full bg-[#14161e] border border-[#212431] rounded-lg p-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition font-mono"
              />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#1a1d27]">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                isRunning 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/40'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{secondsElapsed > 0 ? 'Resume Session' : 'Start Focus Block'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleRecordSession}
              disabled={secondsElapsed < 10}
              className="py-2.5 px-4 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-medium text-xs border border-emerald-500/30 transition disabled:opacity-40 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Record</span>
            </button>

            <button
              onClick={() => { setSecondsElapsed(0); setIsRunning(false); }}
              className="p-2.5 rounded-lg bg-[#15171f] hover:bg-[#1d202b] text-zinc-400 hover:text-white border border-[#20232e] transition"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: 7-Day Performance Awareness Heatmap (5 cols) */}
        <div className="lg:col-span-5 rounded-xl bg-[#101116] border border-[#1d2028] p-5 flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <h5 className="font-bold text-xs text-white">7-Day Cognitive Heatmap</h5>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                39.2 hrs total
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 mt-1">
              Visualizing recorded effort vs intended schedule without guilt.
            </p>

            {/* Heatmap Bar Columns */}
            <div className="grid grid-cols-7 gap-2 mt-4">
              {WEEKLY_HEATMAP.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] text-zinc-500 font-mono">{item.hours}h</span>
                  <div className="w-full h-24 bg-[#14161f] rounded-lg p-1 flex flex-col justify-end border border-[#1f222e]">
                    <div 
                      className={`w-full rounded transition-all duration-500 ${
                        item.intensity === 'high' 
                          ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' 
                          : item.intensity === 'medium' 
                            ? 'bg-indigo-600/70' 
                            : 'bg-indigo-800/40'
                      }`}
                      style={{ height: `${(item.hours / 8) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-400">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cognitive Coherence KPI Box */}
          <div className="p-3.5 rounded-lg bg-[#14161e] border border-[#20232f] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Cognitive Flow Ratio:</span>
              </span>
              <strong className="text-white font-mono">84.2% Deep Work</strong>
            </div>

            <div className="w-full bg-[#1d202b] h-2 rounded-full overflow-hidden flex">
              <div className="bg-indigo-500 h-full" style={{ width: '84%' }} />
              <div className="bg-amber-500 h-full" style={{ width: '16%' }} />
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
              <span>Deep Coding: 33.0h</span>
              <span>Context Switching: 6.2h</span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Section: Evidence Session Ledger */}
      <div className="rounded-xl bg-[#101116] border border-[#1d2028] overflow-hidden">
        <div className="px-5 py-3 bg-[#13151c] border-b border-[#1c1e27] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h5 className="font-bold text-xs text-white">Objective Session Ledger ({sessions.length} Recorded)</h5>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Total Today: {totalTrackedHours} hrs
          </span>
        </div>

        <div className="divide-y divide-[#171922]">
          {sessions.map(s => (
            <div key={s.id} className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#14161f] transition">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    s.category.includes('Deep Work') 
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                      : s.category.includes('Research')
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {s.category}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">{s.timestamp}</span>
                </div>
                <p className="font-medium text-xs text-white">{s.title}</p>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="font-mono font-bold text-xs text-white">{s.durationMinutes} min</span>
                  <span className="block text-[10px] text-zinc-500 font-mono">{s.focusScore}% coherence</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
