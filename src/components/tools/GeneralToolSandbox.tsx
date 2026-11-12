'use client';

import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  BookOpen, 
  Terminal, 
  Cpu, 
  Calculator, 
  FileText, 
  FlaskConical, 
  Calendar, 
  Sparkles, 
  Send,
  Layers,
  ChevronRight,
  ExternalLink,
  Zap,
  Check,
  GraduationCap
} from 'lucide-react';

interface GeneralToolSandboxProps {
  toolId: string;
  toolTitle?: string;
}

export const GeneralToolSandbox: React.FC<GeneralToolSandboxProps> = ({ toolId, toolTitle }) => {
  // 1. MedStudy CramOS State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyStreak, setStudyStreak] = useState(14);
  const [cardsMastered, setCardsMastered] = useState(28);

  const MCAT_FLASHCARDS = [
    {
      topic: 'Biochemistry / Enzyme Kinetics',
      question: 'What is the Michaelis-Menten constant (Km) and what does a low Km signify?',
      answer: 'Km is the substrate concentration [S] at which the reaction velocity is half of Vmax. A LOW Km signifies HIGH binding affinity between enzyme and substrate.',
      highYield: 'High Yield (MCAT B/B Section 1)',
    },
    {
      topic: 'Organic Chemistry / Stereochemistry',
      question: 'Explain the difference between enantiomers and diastereomers regarding optical activity and physical properties.',
      answer: 'Enantiomers are non-superimposable mirror images with opposite optical rotation and identical physical properties in achiral environments. Diastereomers are stereoisomers that are NOT mirror images, possessing different physical and chemical properties.',
      highYield: 'High Yield (MCAT C/P Section 2)',
    },
    {
      topic: 'Cell Biology / Metabolism',
      question: 'How many net ATP, NADH, and FADH2 molecules are generated per single glucose molecule undergoing aerobic respiration?',
      answer: 'Glycolysis: 2 net ATP + 2 NADH. Pyruvate Dehydrogenase: 2 NADH. Krebs Cycle: 2 ATP/GTP + 6 NADH + 2 FADH2. Total: ~30-32 ATP via oxidative phosphorylation.',
      highYield: 'High Yield (MCAT B/B Section 3)',
    },
  ];

  // 2. FastAPI Micro-SaaS State
  const [fastApiEndpoint, setFastApiEndpoint] = useState<'auth' | 'users' | 'checkout'>('auth');
  const [fastApiResponse, setFastApiResponse] = useState<string | null>(null);
  const [isExecutingApi, setIsExecutingApi] = useState(false);

  const executeFastApi = (endpoint: 'auth' | 'users' | 'checkout') => {
    setFastApiEndpoint(endpoint);
    setIsExecutingApi(true);
    setFastApiResponse(null);
    setTimeout(() => {
      setIsExecutingApi(false);
      if (endpoint === 'auth') {
        setFastApiResponse(JSON.stringify({
          status: 'success',
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.araxie_student_token',
          token_type: 'bearer',
          expires_in: 3600,
          user: { id: 'usr_fastapi_01', university: 'campus.edu', role: 'student_developer' }
        }, null, 2));
      } else if (endpoint === 'users') {
        setFastApiResponse(JSON.stringify({
          id: 'usr_fastapi_01',
          name: 'Campus Builder',
          email: 'builder@university.edu',
          active_subscription: 'pro_tier',
          created_at: '2026-11-10T12:00:00Z',
          verified: true
        }, null, 2));
      } else {
        setFastApiResponse(JSON.stringify({
          order_id: 'ORDER-FASTAPI-2026',
          status: 'APPROVED',
          amount: '14.99 USD',
          webhook_dispatched: true,
          payout_split: { creator_share: '14.24 USD', platform_fee: '0.75 USD' }
        }, null, 2));
      }
    }, 400);
  };

  // 3. GPA Guardian State
  const [courses, setCourses] = useState([
    { name: 'CSC 301 (Data Structures)', units: 4, grade: 'A', points: 4.0 },
    { name: 'MTH 201 (Multivariable Calc)', units: 4, grade: 'B', points: 3.0 },
    { name: 'PHY 105 (Modern Physics)', units: 3, grade: 'A', points: 4.0 },
    { name: 'ENG 210 (Technical Writing)', units: 2, grade: 'A', points: 4.0 },
  ]);

  const totalUnits = courses.reduce((acc, c) => acc + c.units, 0);
  const totalPoints = courses.reduce((acc, c) => acc + c.units * c.points, 0);
  const calculatedGPA = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00';

  // 4. ChemReaction 3D State
  const [reactionStep, setReactionStep] = useState(0);
  const REACTION_STEPS = [
    { title: 'Step 1: Nucleophile Approach', desc: 'Hydroxide ion (OH⁻) attacks back-side of electrophilic carbon center at 180° relative to leaving group.' },
    { title: 'Step 2: Pentacoordinate Transition State', desc: 'High-energy trigonal bipyramidal activated complex with partial C-OH bond formation and partial C-Br bond cleavage.' },
    { title: 'Step 3: Inversion of Configuration', desc: 'Bromide ion departs as leaving group. Walden inversion completes with 100% stereochemical inversion.' },
  ];

  // 5. Schora AI Scholar Notebook State
  const [scholarInput, setScholarInput] = useState('Machine learning methods for asymptotic student market equilibrium under deterministic payouts.');
  const [scholarOutput, setScholarOutput] = useState<{ summary: string; bibtex: string } | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const runScholarSynth = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setScholarOutput({
        summary: 'Synthesizes market dynamics in collegiate digital tool exchanges, validating that logarithmic multi-item bundle incentives preserve creator profit margins while increasing transaction density by 2.4x.',
        bibtex: `@article{araxie2026scholar,\n  author = {Qaasim-Falade, A. and Okonkwo, C.},\n  title = {Asymptotic Multi-Item Discount Curves on Campus Networks},\n  journal = {Journal of Collegiate Software Systems},\n  year = {2026}\n}`
      });
    }, 500);
  };

  // 6. Clasquera Course Scheduler State
  const [scheduleClashResolved, setScheduleClashResolved] = useState(true);

  // 7. OAUmods Campus Companion State
  const [clearanceStep, setClearanceStep] = useState(2);

  // 8. Nit7er Fullstack Boilerplate State
  const [selectedStack, setSelectedStack] = useState<'app_router' | 'supabase' | 'paypal'>('app_router');

  // Render Based on Tool ID
  if (toolId === 'prod-medstudy-cramos') {
    const card = MCAT_FLASHCARDS[flashcardIndex];
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#131622] border border-[#212638] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">MedStudy CramOS</span>
            <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] font-bold">
              3,500+ Anki Cards
            </span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
            <span>🔥 {studyStreak}-Day Streak</span>
            <span className="text-emerald-400">✓ {cardsMastered} Mastered</span>
          </div>
        </div>

        {/* Interactive Flashcard */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="min-h-[200px] p-6 rounded-2xl bg-[#111420] border border-[#262e45] hover:border-pink-500/40 cursor-pointer transition shadow-xl flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="text-pink-400 font-semibold">{card.topic}</span>
            <span className="text-[10px] bg-[#1a1f30] px-2 py-0.5 rounded text-zinc-300">{card.highYield}</span>
          </div>

          <div className="py-6 text-center">
            {isFlipped ? (
              <p className="text-sm text-emerald-300 font-medium leading-relaxed animate-in fade-in">
                {card.answer}
              </p>
            ) : (
              <p className="text-sm text-zinc-100 font-medium leading-relaxed">
                {card.question}
              </p>
            )}
          </div>

          <div className="text-center text-[11px] text-zinc-500 group-hover:text-zinc-400 transition">
            {isFlipped ? 'Click card to flip back to question' : 'Click card to reveal verified MCAT answer'}
          </div>
        </div>

        {/* Rating Controls */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setIsFlipped(false);
              setFlashcardIndex((prev) => (prev + 1) % MCAT_FLASHCARDS.length);
            }}
            className="py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition"
          >
            Hard (+1d)
          </button>
          <button
            onClick={() => {
              setIsFlipped(false);
              setCardsMastered(prev => prev + 1);
              setFlashcardIndex((prev) => (prev + 1) % MCAT_FLASHCARDS.length);
            }}
            className="py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition"
          >
            Good (+3d)
          </button>
          <button
            onClick={() => {
              setIsFlipped(false);
              setCardsMastered(prev => prev + 1);
              setFlashcardIndex((prev) => (prev + 1) % MCAT_FLASHCARDS.length);
            }}
            className="py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
          >
            Easy (+7d)
          </button>
        </div>
      </div>
    );
  }

  if (toolId === 'prod-fastapi-micro-saas') {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <div className="p-3 rounded-xl bg-[#131622] border border-[#212638] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">FastAPI Micro-SaaS Sandbox</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              OpenAPI 3.1
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">Python 3.12 + Pydantic v2</span>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#111420] border border-[#1e2333]">
          <button
            onClick={() => executeFastApi('auth')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
              fastApiEndpoint === 'auth' ? 'bg-[#1e2538] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            POST /api/v1/auth
          </button>
          <button
            onClick={() => executeFastApi('users')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
              fastApiEndpoint === 'users' ? 'bg-[#1e2538] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            GET /api/v1/users/me
          </button>
          <button
            onClick={() => executeFastApi('checkout')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
              fastApiEndpoint === 'checkout' ? 'bg-[#1e2538] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            POST /api/v1/billing
          </button>
        </div>

        {/* Response Viewer */}
        <div className="p-4 rounded-xl bg-[#0a0c13] border border-[#1b2030] font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#181c2b] text-[11px] text-zinc-500">
            <span>Response Status: <strong className="text-emerald-400">200 OK</strong></span>
            <span>Latency: <strong className="text-zinc-300">18ms</strong></span>
          </div>
          <pre className="text-emerald-400/90 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
            {isExecutingApi ? 'Executing endpoint in sandboxed container...' : fastApiResponse || '// Click an endpoint above to execute sandboxed FastAPI request'}
          </pre>
        </div>
      </div>
    );
  }

  if (toolId === 'prod-gpa-guardian') {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <div className="p-3 rounded-xl bg-[#131622] border border-[#212638] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">GPAGuardian &amp; Degree Planner</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
              Dean&apos;s List Tracker
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400">Current CGPA: </span>
            <span className="text-base font-bold text-emerald-400">{calculatedGPA}</span>
          </div>
        </div>

        {/* Course Rows */}
        <div className="space-y-2">
          {courses.map((course, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#10131d] border border-[#1c2132] text-xs">
              <span className="font-medium text-white">{course.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 text-[11px]">{course.units} Credit Units</span>
                <select
                  value={course.grade}
                  onChange={(e) => {
                    const g = e.target.value;
                    const pts = g === 'A' ? 4.0 : g === 'B' ? 3.0 : g === 'C' ? 2.0 : 1.0;
                    setCourses(prev => prev.map((c, i) => i === idx ? { ...c, grade: g, points: pts } : c));
                  }}
                  className="bg-[#181d2c] border border-[#262e45] text-white rounded px-2 py-0.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="A">Grade A (4.0)</option>
                  <option value="B">Grade B (3.0)</option>
                  <option value="C">Grade C (2.0)</option>
                  <option value="D">Grade D (1.0)</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-300 flex items-center justify-between">
          <span>Projected Standing: <strong>First Class Honours / Dean&apos;s List (GPA &gt; 3.50)</strong></span>
          <span className="font-bold text-white">{totalUnits} Credits</span>
        </div>
      </div>
    );
  }

  if (toolId === 'prod-chem-reaction-3d') {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <div className="p-3 rounded-xl bg-[#131622] border border-[#212638] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">ChemReaction 3D Explorer</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
              WebGL Mechanisms
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">SN2 Bimolecular Substitution</span>
        </div>

        {/* 3D Reaction Mechanism Canvas Mockup */}
        <div className="h-44 rounded-2xl bg-gradient-to-b from-[#141224] to-[#0c0b16] border border-[#2c234a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <div className="flex items-center gap-6 z-10">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center font-bold text-blue-300 text-xs">
                OH⁻
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">Nucleophile</span>
            </div>

            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-amber-400" />

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-xs">
                C*(sp³)
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">Chiral Carbon</span>
            </div>

            <div className="w-12 h-0.5 bg-gradient-to-r from-amber-400 to-red-400" />

            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-400/40 flex items-center justify-center font-bold text-red-300 text-xs">
                Br⁻
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">Leaving Group</span>
            </div>
          </div>

          <div className="mt-4 text-center z-10">
            <h4 className="text-xs font-bold text-purple-200">{REACTION_STEPS[reactionStep].title}</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5 max-w-sm">{REACTION_STEPS[reactionStep].desc}</p>
          </div>
        </div>

        {/* Step Stepper */}
        <div className="flex items-center justify-between gap-2">
          {REACTION_STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setReactionStep(idx)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition ${
                reactionStep === idx
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                  : 'bg-[#10131d] text-zinc-400 border-[#1e2333] hover:text-white'
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (toolId === 'prod-schora-ai') {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <div className="p-3 rounded-xl bg-[#131622] border border-[#212638] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Schora AI Scholar Notebook</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
              Research Synthesis
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">LaTeX / BibTeX Ready</span>
        </div>

        <div className="space-y-2">
          <textarea
            value={scholarInput}
            onChange={(e) => setScholarInput(e.target.value)}
            rows={2}
            className="w-full p-2.5 rounded-xl bg-[#0d1017] border border-[#1f2538] text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
            placeholder="Paste paper abstract or literature query..."
          />
          <button
            onClick={runScholarSynth}
            disabled={isSynthesizing}
            className="w-full py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Research Claims'}</span>
          </button>
        </div>

        {scholarOutput && (
          <div className="p-3.5 rounded-xl bg-[#0c0e15] border border-[#1f2434] space-y-2 text-xs">
            <p className="text-zinc-200 leading-relaxed font-medium">{scholarOutput.summary}</p>
            <pre className="p-2 rounded bg-black/50 text-amber-300 font-mono text-[10px] overflow-x-auto">
              {scholarOutput.bibtex}
            </pre>
          </div>
        )}
      </div>
    );
  }

  // Default Campus Developer Sandbox for remaining tools
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="p-3 rounded-xl bg-[#131622] border border-[#212638] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{toolTitle || 'Campus Tool Workspace'}</span>
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
            Live Sandbox
          </span>
        </div>
        <span className="text-[11px] text-zinc-400">Node 24 / Next.js 15</span>
      </div>

      <div className="p-4 rounded-xl bg-[#0c0e16] border border-[#1d2233] space-y-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Interactive campus container ready</span>
        </div>
        <p className="text-zinc-400 leading-relaxed">
          This verified university student tool is sandboxed and ready for deployment. All files, templates, and cryptographic access tokens are included in the download package.
        </p>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300 pt-2 border-t border-[#1a1f30]">
          <div>• FERPA-Compliant Sandboxing</div>
          <div>• Zero Student Credential Retention</div>
          <div>• Instant Local Web Server &amp; CLI</div>
          <div>• 95% Creator Royalty Direct to PayPal</div>
        </div>
      </div>
    </div>
  );
};
