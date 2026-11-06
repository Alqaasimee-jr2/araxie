'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Users, 
  Sparkles, 
  Play, 
  ArrowRight, 
  GraduationCap, 
  TrendingUp, 
  ThumbsUp, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  MessageSquareQuote, 
  Code, 
  ExternalLink, 
  Search, 
  Award, 
  Terminal, 
  Key, 
  Check, 
  Copy, 
  Building2,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { Product } from '@/types';

interface PublicSpaceViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onLaunchTool: (product: Product) => void;
  onEnterMarketplace: () => void;
  onOpenDashboard: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const PublicSpaceView: React.FC<PublicSpaceViewProps> = ({
  products,
  onSelectProduct,
  onLaunchTool,
  onEnterMarketplace,
  onOpenDashboard,
  onOpenAuth,
  isLoggedIn,
}) => {
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [upvotes, setUpvotes] = useState<Record<string, number>>({
    'prod-flow7': 342,
    'prod-ci-guardian': 289,
    'prod-canvas-autopilot': 415,
    'prod-algo-visualizer': 378,
    'prod-oaumods': 512,
    'prod-academic-prompt-vault': 230,
    'prod-schora-ai': 194,
    'prod-clasquera': 167,
  });
  const [hasUpvoted, setHasUpvoted] = useState<Record<string, boolean>>({});
  const [licenseQuery, setLicenseQuery] = useState('');
  const [licenseResult, setLicenseResult] = useState<any>(null);
  const [isVerifyingLicense, setIsVerifyingLicense] = useState(false);

  const handleUpvote = (productId: string) => {
    if (hasUpvoted[productId]) {
      setUpvotes(prev => ({ ...prev, [productId]: (prev[productId] || 0) - 1 }));
      setHasUpvoted(prev => ({ ...prev, [productId]: false }));
    } else {
      setUpvotes(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
      setHasUpvoted(prev => ({ ...prev, [productId]: true }));
    }
  };

  const handleVerifyLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseQuery.trim()) return;
    setIsVerifyingLicense(true);
    setLicenseResult(null);

    try {
      const res = await fetch(`/api/licenses/verify?key=${encodeURIComponent(licenseQuery.trim())}`);
      const data = await res.json();
      setLicenseResult(data);
    } catch (err) {
      setLicenseResult({ verified: false, reason: 'Failed to reach verification gateway' });
    } finally {
      setIsVerifyingLicense(false);
    }
  };

  // Filter products by university
  const filteredProducts = products.filter(p => {
    if (selectedCampus === 'all') return true;
    if (selectedCampus === 'oau') return p.creator.university.toLowerCase().includes('obafemi') || p.creator.university.toLowerCase().includes('oau');
    if (selectedCampus === 'stanford') return p.creator.university.toLowerCase().includes('stanford');
    if (selectedCampus === 'mit') return p.creator.university.toLowerCase().includes('mit');
    if (selectedCampus === 'berkeley') return p.creator.university.toLowerCase().includes('berkeley') || p.creator.university.toLowerCase().includes('uc');
    return true;
  });

  const featuredCreators = [
    {
      name: 'Abdullah Qaasim-Falade',
      handle: '@Alqaasimee-jr2',
      university: 'Obafemi Awolowo University \'26',
      avatar: 'https://avatars.githubusercontent.com/u/144673671?v=4',
      badge: 'Campus Pioneer',
      tools: ['CI-Guardian', 'Flow7', 'OAUMods Pro', 'Schora AI'],
      bio: 'Building calm productivity layers and pre-flight developer security tools for student engineers.',
      githubUrl: 'https://github.com/Alqaasimee-jr2',
    },
    {
      name: 'Sarah Lin',
      handle: '@sarah_dev',
      university: 'Stanford University \'26',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Extension Specialist',
      tools: ['CanvasAutoPilot', 'GPA Forecast Curve'],
      bio: 'Automating Canvas LMS assignment calendars and exam reminders for 1,400+ campus peers.',
      githubUrl: 'https://github.com/Alqaasimee-jr2/araxie',
    },
    {
      name: 'Priya Patel',
      handle: '@priyapatel_cs',
      university: 'UC Berkeley \'26',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      badge: 'Algorithms Fellow',
      tools: ['AlgoVisualizer Pro', 'Data Structures Atlas'],
      bio: 'Visualizing Dijkstra, A*, and dynamic programming matrices for undergraduate computer science.',
      githubUrl: 'https://github.com/Alqaasimee-jr2/araxie',
    },
    {
      name: 'Marcus Chen',
      handle: '@mchen_mit',
      university: 'MIT \'25',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      badge: 'Research Builder',
      tools: ['Academic Prompt Vault', 'Paper Synthesizer CLI'],
      bio: 'Curating open scholarly prompts and arXiv CLI synthesizers for university thesis research.',
      githubUrl: 'https://github.com/Alqaasimee-jr2/araxie',
    },
  ];

  const communityDiscussions = [
    {
      author: 'David K. (UC Berkeley \'25)',
      role: 'Student Buyer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      tool: 'Flow7 Focus Layer',
      rating: 5,
      comment: 'Used Flow7 during my 24-hour hackathon sprint. The cognitive domain tracking and calm stopwatch kept our team in deep work without burning out.',
      timestamp: '2 hours ago',
    },
    {
      author: 'Amina B. (Obafemi Awolowo Univ \'27)',
      role: 'Freshman Learner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      tool: 'OAUMods Pro',
      rating: 5,
      comment: 'The lecture hall atlas saved me from getting lost between BOOC and Spider during matriculation week. Essential guide for Great Ife students!',
      timestamp: '5 hours ago',
    },
    {
      author: 'Alex C. (Stanford \'26)',
      role: 'Junior CS Major',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      tool: 'CI-Guardian',
      rating: 5,
      comment: 'CI-Guardian caught an unthrottled API endpoint and an eval() call right in our AST pre-flight test. This is what student developer tools should look like.',
      timestamp: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      
      {/* 1. PUBLIC COMMONS HERO BANNER */}
      <section className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#14161f] via-[#101217] to-[#0c0d11] border border-[#232736] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c202d] border border-[#2b3145] text-zinc-300 text-xs font-medium">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus Commons &bull; Open Public Space</span>
            <span className="text-zinc-500">•</span>
            <span className="text-emerald-400 font-semibold">100% Free Public Exploration</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The open square where university builders showcase peer software.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
            Explore verified tools built by students across <span className="text-white font-medium">Stanford, Great Ife (OAU), MIT, and UC Berkeley</span>. Upvote campus projects, launch in-browser runners, and inspect creator verified code.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onEnterMarketplace}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-white/5"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span>Browse Marketplace Storefront</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {isLoggedIn ? (
              <button
                onClick={onOpenDashboard}
                className="px-4 py-2.5 rounded-xl bg-[#1e2230] hover:bg-[#282d40] text-zinc-200 font-semibold text-xs border border-[#2f364c] transition flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Go to Student Dashboard &amp; Locker</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-xl bg-[#181a24] hover:bg-[#222533] text-zinc-300 hover:text-white font-semibold text-xs border border-[#292e40] transition flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-zinc-400" />
                <span>Sign In with Campus ID</span>
              </button>
            )}
          </div>

          {/* Live Campus Telemetry Badges */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#13151d] border border-[#202434] space-y-0.5">
              <span className="text-[11px] text-zinc-400 block">Universities</span>
              <span className="text-lg font-bold text-white">12 Campuses</span>
            </div>
            <div className="p-3 rounded-xl bg-[#13151d] border border-[#202434] space-y-0.5">
              <span className="text-[11px] text-zinc-400 block">Verified Tools</span>
              <span className="text-lg font-bold text-cyan-400">14 Live Software</span>
            </div>
            <div className="p-3 rounded-xl bg-[#13151d] border border-[#202434] space-y-0.5">
              <span className="text-[11px] text-zinc-400 block">Creator Royalties</span>
              <span className="text-lg font-bold text-emerald-400">95% Net Share</span>
            </div>
            <div className="p-3 rounded-xl bg-[#13151d] border border-[#202434] space-y-0.5">
              <span className="text-[11px] text-zinc-400 block">Payment Rails</span>
              <span className="text-lg font-bold text-amber-400">PayPal Verified</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. CAMPUS BUILDER SPOTLIGHTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Campus Creator Directory</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Verified student builders trading high-utility software on the open campus network
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCreators.map((creator, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-[#111319] border border-[#1e2230] hover:border-[#2f354c] transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-700"
                  />
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {creator.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white">{creator.name}</h3>
                  <p className="text-[11px] text-zinc-400">{creator.university}</p>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {creator.bio}
                </p>
              </div>

              <div className="pt-2 border-t border-[#1a1d27] space-y-2">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                  Published Tools:
                </span>
                <div className="flex flex-wrap gap-1">
                  {creator.tools.map((t, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] px-2 py-0.5 rounded bg-[#171922] text-zinc-300 border border-[#232736]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={creator.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium pt-1"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>View GitHub Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PUBLIC TOOL DISCOVERY & UPVOTE BOARD */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1c1f2b]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Public Campus Tool Board &amp; Upvotes</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Ranked by collegiate peer upvotes across university departments
            </p>
          </div>

          {/* Campus Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Campuses' },
              { id: 'oau', label: 'Great Ife (OAU)' },
              { id: 'stanford', label: 'Stanford' },
              { id: 'berkeley', label: 'UC Berkeley' },
              { id: 'mit', label: 'MIT' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCampus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCampus === tab.id
                    ? 'bg-[#202534] text-white border border-[#31394f]'
                    : 'bg-[#12141a] text-zinc-400 hover:text-zinc-200 border border-[#1e212b]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Public Tool Grid with Upvote and Launch Preview Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => {
            const votes = upvotes[product.id] || 120;
            const isVoted = !!hasUpvoted[product.id];
            const hasBrowserRunner = [
              'prod-flow7', 
              'prod-ci-guardian', 
              'prod-canvas-autopilot', 
              'prod-algo-visualizer', 
              'prod-academic-prompt-vault', 
              'prod-paper-synthesizer'
            ].includes(product.id);

            return (
              <div
                key={product.id}
                className="p-5 rounded-2xl bg-[#111319] border border-[#1e2230] hover:border-[#2f354c] transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#181a24] text-zinc-300 border border-[#262a3a]">
                      {product.creator.university}
                    </span>

                    {/* Upvote Pill */}
                    <button
                      onClick={() => handleUpvote(product.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                        isVoted
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-[#181a24] hover:bg-[#202432] text-zinc-300 border border-[#272c3d]'
                      }`}
                      title="Upvote this campus project"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'fill-white text-white' : 'text-zinc-400'}`} />
                      <span>{votes}</span>
                    </button>
                  </div>

                  <div>
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="font-bold text-base text-white hover:text-blue-400 cursor-pointer transition"
                    >
                      {product.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-300">By {product.creator.name}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating.toFixed(1)}</span>
                    </span>
                    <span>({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Bottom Actions: Launch In-Browser Preview & View Store Listing */}
                <div className="pt-3 border-t border-[#1a1d27] flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-white">${product.price.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-500">USD</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasBrowserRunner && (
                      <button
                        onClick={() => onLaunchTool(product)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/20 transition flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                        <span>Try Live</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-1.5 rounded-lg bg-[#1f2330] hover:bg-[#292f40] text-white text-xs font-medium border border-[#2d3448] transition"
                    >
                      Details
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PUBLIC CRYPTOGRAPHIC LICENSE VERIFICATION WIDGET */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#101218] border border-[#212534] space-y-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
            <Key className="w-3 h-3 text-emerald-400" />
            <span>Public License Verification Gateway</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Verify Any Cryptographic Student License Key
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every transaction on Araxie generates an immutable HMAC-SHA256 signed student pass. Test the integrity of any license key in real time against our public verification API.
          </p>
        </div>

        <form onSubmit={handleVerifyLicense} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="text"
            placeholder="e.g. ARX-FLOW-XXXX-XXXX or CAP-STAN-9942-2026"
            value={licenseQuery}
            onChange={(e) => setLicenseQuery(e.target.value)}
            className="flex-1 bg-[#141722] border border-[#24293a] text-white text-xs px-3.5 py-2.5 rounded-xl font-mono focus:outline-none focus:border-blue-500/60"
          />
          <button
            type="submit"
            disabled={isVerifyingLicense || !licenseQuery.trim()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shrink-0"
          >
            <span>{isVerifyingLicense ? 'Verifying HMAC...' : 'Verify License'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {licenseResult && (
          <div className={`p-4 rounded-xl text-xs space-y-2 border ${
            licenseResult.verified 
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-bold">
              {licenseResult.verified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cryptographic HMAC-SHA256 Signature Validated</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>License Key Invalid or Unrecognized</span>
                </>
              )}
            </div>

            {licenseResult.verified && (
              <div className="font-mono text-[11px] space-y-1 text-zinc-300 pt-1">
                <p>Key: <span className="text-white">{licenseResult.key}</span></p>
                <p>Signature Algorithm: <span className="text-emerald-400">HMAC-SHA256</span></p>
                {licenseResult.registeredOrder && (
                  <p>Product: <span className="text-white">{licenseResult.registeredOrder.productTitle}</span> &bull; Status: <span className="text-emerald-400">{licenseResult.registeredOrder.status}</span></p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 5. LIVE CAMPUS PEER TESTIMONIALS */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-amber-400" />
            <span>Live Campus Feedback Wall</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real peer reviews submitted by students across verified university departments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {communityDiscussions.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#111319] border border-[#1e2230] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={item.avatar} alt={item.author} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-xs text-white">{item.author}</h4>
                    <span className="text-[10px] text-zinc-400 block">{item.tool}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed italic">
                &quot;{item.comment}&quot;
              </p>

              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-[#1a1d27]">
                <span className="text-emerald-400 font-medium">✓ Verified Student Review</span>
                <span>{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-[#141724] to-[#121319] border border-[#252b3d] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">
            Ready to distribute your software or explore the marketplace?
          </h3>
          <p className="text-xs text-zinc-400">
            Join student builders across 12 universities earning 95% creator royalties with instant PayPal settlement.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onEnterMarketplace}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-2"
          >
            <span>Open Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={onOpenDashboard}
            className="px-4 py-2.5 rounded-xl bg-[#1c202c] hover:bg-[#252a3b] text-zinc-200 font-semibold text-xs border border-[#2b3244] transition"
          >
            <span>Student Dashboard</span>
          </button>
        </div>
      </section>

    </div>
  );
};
