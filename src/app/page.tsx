'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  ShoppingBag, 
  Layers, 
  ShieldCheck, 
  Globe, 
  ExternalLink,
  Users,
  Code,
  Zap,
  TrendingUp,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { Product, UserProfile } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';
import { AuthModal } from '@/components/AuthModal';
import { InteractiveToolModal } from '@/components/tools/InteractiveToolModal';
import { Flow7Tool } from '@/components/tools/Flow7Tool';
import { CIGuardianTool } from '@/components/tools/CIGuardianTool';
import { AlgoVisualizerTool } from '@/components/tools/AlgoVisualizerTool';

export default function LandingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeInteractiveTool, setActiveInteractiveTool] = useState<{ id: string; title: string } | null>(null);
  const [playgroundTab, setPlaygroundTab] = useState<'flow7' | 'ci-guardian' | 'algo'>('flow7');

  // Hydrate user session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('araxie_user');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Auth session hydration error:', e);
    }
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    try {
      localStorage.setItem('araxie_user', JSON.stringify(user));
    } catch (e) {}
    // Seamlessly navigate straight to the student marketplace
    router.push('/marketplace');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('araxie_user');
    } catch (e) {}
  };

  // Featured tools for landing page showcase
  const featuredProducts = INITIAL_PRODUCTS.slice(0, 6);

  const creators = [
    {
      name: 'Abdullah Qaasim-Falade',
      handle: '@Alqaasimee-jr2',
      university: 'Obafemi Awolowo University (OAU) \'26',
      avatar: '/avatars/abdullah.svg',
      badge: 'Campus Pioneer',
      tools: 'CI-Guardian & Flow7',
      bio: 'Building pre-flight developer hygiene, campus navigation PWAs, and cognitive flow state tools for university engineers.',
      githubUrl: 'https://github.com/Alqaasimee-jr2',
    },
    {
      name: 'Folashade Adeyemi',
      handle: '@folashade_dev',
      university: 'University of Lagos (UNILAG) \'26',
      avatar: '/avatars/sarah.svg',
      badge: 'Extension Fellow',
      tools: 'CanvasAutoPilot Pro',
      bio: 'Automating lecture timetables, assignment deadlines, and exam schedules for campus peers.',
      githubUrl: 'https://github.com/Alqaasimee-jr2/araxie',
    },
    {
      name: 'Chinedu Okonkwo',
      handle: '@chinedu_cs',
      university: 'Federal University of Technology, Akure (FUTA) \'26',
      avatar: '/avatars/marcus.svg',
      badge: 'Algorithms Fellow',
      tools: 'AlgoVisualizer Pro',
      bio: 'Visualizing Dijkstra, BFS, and dynamic programming matrices for undergraduate computer science.',
      githubUrl: 'https://github.com/Alqaasimee-jr2/araxie',
    },
    {
      name: 'Amina Bello',
      handle: '@amina_ui',
      university: 'University of Ibadan (UI) \'25',
      avatar: '/avatars/amina.svg',
      badge: 'Clinical Researcher',
      tools: 'MedStudy CramOS',
      bio: 'Curating open medical flashcard suites and clinical synthesis workflows for undergraduate medicine.',
      githubUrl: 'https://github.com/Alqaasimee-jr2/araxie',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-zinc-100 flex flex-col selection:bg-blue-600/30 selection:text-white">
      
      {/* 1. TOP NAVIGATION */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1c1d24] bg-[#0c0d10]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-3">
            
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-2.5 group">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center ring-1 ring-white/10 group-hover:ring-blue-500/40 transition">
                  <img 
                    src="/logo.svg" 
                    alt="Araxie Logo" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white group-hover:text-zinc-100 transition">
                    Araxie
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Campus
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-medium">
              <a href="#why-araxie" className="hover:text-white transition">Why Araxie</a>
              <a href="#live-playground" className="hover:text-white transition">In-Browser Runner</a>
              <a href="#featured-tools" className="hover:text-white transition">Campus Software</a>
              <a href="#campus-network" className="hover:text-white transition">University Network</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push('/marketplace')}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Enter Marketplace Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="hidden sm:inline-block text-xs text-zinc-400 hover:text-white px-2 py-1 transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white hover:bg-[#161820] border border-[#20232e] transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push('/marketplace')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black shadow-md shadow-white/5 transition"
                  >
                    <span>Explore Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Ambient Glow Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          
          {/* Spotlight Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14161f] border border-[#232737] text-zinc-300 text-xs font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>The Student Digital Commerce &amp; Peer Software Marketplace</span>
            <span className="text-zinc-600">•</span>
            <span className="text-blue-400 font-semibold">12 Campuses</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Where university builders trade peer software.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Discover peer-built Chrome extensions, interactive algorithm visualizers, and curated study suites. Run live in-browser tool previews, checkout securely with <strong className="text-white">PayPal</strong>, and support 95% creator payouts.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-xl shadow-white/5"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span>Browse 14 Campus Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#151720] hover:bg-[#1d202c] text-zinc-200 font-semibold text-xs sm:text-sm border border-[#272b3a] transition flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-zinc-400" />
              <span>Sign In with University ID</span>
            </button>

            <button
              onClick={() => setActiveInteractiveTool({ id: 'prod-flow7', title: 'Flow7 Focus Layer' })}
              className="px-4 py-3 rounded-xl bg-[#12141c] hover:bg-[#191c26] text-blue-400 hover:text-blue-300 font-medium text-xs sm:text-sm border border-[#212638] transition flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
              <span>Test Live Flow7 Demo</span>
            </button>
          </div>

          {/* Telemetry Counter Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-[#111319] border border-[#1e212b]">
              <span className="text-[11px] text-zinc-400 block">Campuses</span>
              <span className="text-lg font-bold text-white">12 Universities</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111319] border border-[#1e212b]">
              <span className="text-[11px] text-zinc-400 block">Peer Software</span>
              <span className="text-lg font-bold text-cyan-400">14 Verified Tools</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111319] border border-[#1e212b]">
              <span className="text-[11px] text-zinc-400 block">Creator Revenue</span>
              <span className="text-lg font-bold text-emerald-400">95% Payouts</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111319] border border-[#1e212b]">
              <span className="text-[11px] text-zinc-400 block">Checkout Gateway</span>
              <span className="text-lg font-bold text-white">Verified PayPal</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. IN-BROWSER LIVE TOOL PLAYGROUND */}
      <section id="live-playground" className="py-16 border-t border-[#181a22] bg-[#0d0e12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                <span>Zero Installation Required</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Run student-built tools right in your browser.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Test interactive web runners live in client-side sandbox before unlocking full source code or cryptographic licenses.
              </p>
            </div>

            {/* Runner Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14161f] border border-[#212534]">
              <button
                onClick={() => setPlaygroundTab('flow7')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  playgroundTab === 'flow7'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Flow7 Focus Layer
              </button>
              <button
                onClick={() => setPlaygroundTab('ci-guardian')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  playgroundTab === 'ci-guardian'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                CI-Guardian
              </button>
              <button
                onClick={() => setPlaygroundTab('algo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  playgroundTab === 'algo'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                AlgoVisualizer
              </button>
            </div>
          </div>

          {/* Interactive Playground Embed Container */}
          <div className="rounded-2xl bg-[#111319] border border-[#222636] p-4 sm:p-6 shadow-2xl">
            {playgroundTab === 'flow7' && (
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1c1f2b] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-zinc-200">Flow7 Cognitive Domain Runner</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">Created by Abdullah Qaasim-Falade (OAU)</span>
                  </div>
                  <button 
                    onClick={() => router.push('/marketplace')}
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <span>View in Marketplace</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <Flow7Tool />
              </div>
            )}

            {playgroundTab === 'ci-guardian' && (
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1c1f2b] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-semibold text-zinc-200">CI-Guardian Pre-Flight Security Scanner</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">Branch &amp; Secret Hygiene Validator</span>
                  </div>
                  <button 
                    onClick={() => router.push('/marketplace')}
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <span>View in Marketplace</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <CIGuardianTool />
              </div>
            )}

            {playgroundTab === 'algo' && (
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1c1f2b] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="font-semibold text-zinc-200">AlgoVisualizer Pro Dijkstra &amp; BFS Engine</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">Created by Chinedu Okonkwo (FUTA)</span>
                  </div>
                  <button 
                    onClick={() => router.push('/marketplace')}
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <span>View in Marketplace</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <AlgoVisualizerTool />
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 4. VALUE PILLARS */}
      <section id="why-araxie" className="py-20 border-t border-[#181a22] bg-[#0b0c0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
              Why Araxie
            </h2>
            <p className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              An economy engineered specifically for university builders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#111319] border border-[#1e212c] space-y-3 hover:border-[#2f3548] transition">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Campus Peer Network</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect directly with student developers from Obafemi Awolowo University (OAU), UNILAG, University of Ibadan (UI), Covenant University, and FUTA. Verified peer ratings and collegiate trust.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#111319] border border-[#1e212c] space-y-3 hover:border-[#2f3548] transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">In-Browser Execution</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Experience tools before paying. Live interactive runners test algorithms, focus states, and dev security tools directly in your browser.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#111319] border border-[#1e212c] space-y-3 hover:border-[#2f3548] transition">
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">95% Creator Payouts</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Instant PayPal checkout with automated student bundle discounts. Student software creators keep 95% of every transaction.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-[#111319] border border-[#1e212c] space-y-3 hover:border-[#2f3548] transition">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Autonomous AI Concierge</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tell the AI Concierge your courses, major, and budget to receive tailored software bundles and dynamically calculated student discounts.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. FEATURED SOFTWARE CATALOG TEASER */}
      <section id="featured-tools" className="py-20 border-t border-[#181a22] bg-[#0d0e12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
                Student Marketplace Showcase
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Featured software curated from campus builders.
              </p>
            </div>

            <button
              onClick={() => router.push('/marketplace')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              <span>Explore all 14 tools in the marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProducts.map((product) => {
              const hasRunner = ['prod-flow7', 'prod-ci-guardian', 'prod-algo-visualizer', 'prod-canvas-autopilot', 'prod-academic-prompt-vault'].includes(product.id);
              return (
                <div 
                  key={product.id}
                  className="rounded-2xl bg-[#111319] border border-[#1e212c] p-5 flex flex-col justify-between hover:border-[#2d3345] transition group shadow-lg"
                >
                  <div className="space-y-3.5">
                    
                    {/* Top Row: Category Pill & Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#181a24] text-zinc-400 border border-[#252836]">
                        {product.category}
                      </span>
                      <span className="text-sm font-bold text-white">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition">
                        {product.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {product.tagline}
                      </p>
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center gap-2 pt-1 border-t border-[#181a24]">
                      <img 
                        src={product.creator.avatar} 
                        alt={product.creator.name}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-700" 
                      />
                      <span className="text-[11px] text-zinc-300 truncate">
                        {product.creator.name} &bull; <span className="text-zinc-500">{product.creator.university.split(' ')[0]}</span>
                      </span>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center gap-2">
                    {hasRunner && (
                      <button
                        onClick={() => setActiveInteractiveTool({ id: product.id, title: product.title })}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-[#181b26] hover:bg-[#202534] text-cyan-300 border border-[#272d40] transition flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-cyan-300" />
                        <span>Run Demo</span>
                      </button>
                    )}
                    <button
                      onClick={() => router.push('/marketplace')}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black transition flex items-center justify-center gap-1"
                    >
                      <span>View in Market</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Big Banner Link */}
          <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-950/20 via-[#121520] to-[#14161f] border border-[#22283a] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-white">Looking for study suites, prompt vaults, or micro-SaaS?</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Explore the full catalog with real-time ⌘K search, PayPal checkout, and dynamic AI bundles.</p>
            </div>
            <button
              onClick={() => router.push('/marketplace')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs whitespace-nowrap shadow-lg shadow-blue-600/20 transition flex items-center gap-2 shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Open Student Marketplace</span>
            </button>
          </div>

        </div>
      </section>

      {/* 6. CAMPUS CREATOR SPOTLIGHT */}
      <section id="campus-network" className="py-20 border-t border-[#181a22] bg-[#0b0c0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
              Collegiate Builders
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Created by campus peers across top universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {creators.map((c) => (
              <div 
                key={c.name}
                className="p-5 rounded-2xl bg-[#111319] border border-[#1e212c] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <img 
                      src={c.avatar} 
                      alt={c.name} 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#262a3a]" 
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white leading-tight">{c.name}</h4>
                      <p className="text-[11px] text-zinc-400">{c.university}</p>
                    </div>
                  </div>
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {c.tools}
                  </span>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {c.bio}
                  </p>
                </div>

                <a 
                  href={c.githubUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5 pt-2 border-t border-[#191b24]"
                >
                  <Code className="w-3.5 h-3.5 text-zinc-400" />
                  <span>GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. HIGH-IMPACT BOTTOM CTA BANNER */}
      <section className="py-20 border-t border-[#181a22] bg-[#0d0e12] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181a24] text-zinc-300 text-xs font-medium border border-[#252836]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready for Campus Builders &amp; Student Learners</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Step into the Araxie Student Marketplace.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Trade collegiate software, run in-browser tool previews, and join 1,400+ student developers across 12 universities.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => router.push('/marketplace')}
              className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-xl shadow-white/5"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span>Launch Marketplace Storefront</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#151720] hover:bg-[#1d202c] text-zinc-200 font-semibold text-xs sm:text-sm border border-[#272b3a] transition flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-zinc-400" />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-[#17181f] bg-[#0c0d10] py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Araxie Logo" className="w-5 h-5 rounded" />
            <span className="font-bold text-zinc-200">Araxie</span>
            <span>&bull;</span>
            <span>The Peer-to-Peer Student Software &amp; Digital Tool Marketplace</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px]">
            <button 
              onClick={() => router.push('/marketplace')}
              className="text-zinc-400 hover:text-white transition"
            >
              Marketplace Storefront
            </button>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="text-zinc-400 hover:text-white transition"
            >
              Campus Passport
            </button>
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

      {/* 9. MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <InteractiveToolModal
        isOpen={!!activeInteractiveTool}
        onClose={() => setActiveInteractiveTool(null)}
        toolId={activeInteractiveTool?.id}
        toolTitle={activeInteractiveTool?.title}
      />

    </div>
  );
}
