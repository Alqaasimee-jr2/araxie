import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db';
import { DynamicBundle, Product } from '@/types';
import { 
  checkAndConsumeGeminiBudget, 
  recordGeminiQuotaExceeded, 
  getCachedGeminiResponse, 
  setCachedGeminiResponse 
} from '@/lib/geminiRateLimiter';
import { inspectPromptSecurity } from '@/lib/security';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Asymptotic Dynamic Bundling Model: delta(k) = min(0.25, 0.12 * ln(1 + k))
function calculateBundleDiscount(items: Product[]): { discountPercentage: number; bundleTotal: number; originalTotal: number; savings: number } {
  const originalTotal = Number(items.reduce((acc, item) => acc + item.price, 0).toFixed(2));
  const k = items.length;
  if (k <= 1) {
    return {
      discountPercentage: 0,
      bundleTotal: originalTotal,
      originalTotal,
      savings: 0,
    };
  }
  const rawDiscount = Math.min(0.25, 0.12 * Math.log(1 + k));
  const discountPercentage = Math.round(rawDiscount * 100);
  const bundleTotal = Number((originalTotal * (1 - rawDiscount)).toFixed(2));
  const savings = Number((originalTotal - bundleTotal).toFixed(2));

  return {
    discountPercentage,
    bundleTotal,
    originalTotal,
    savings,
  };
}

// Determines if a student prompt is asking for tools/bundles vs general conversation
function hasToolRecommendationIntent(text: string): boolean {
  const lower = text.toLowerCase().trim();

  // Pure conversational inquiries that should NOT trigger a tool bundle
  const conversationalOnlyPatterns = [
    /^(hi|hello|hey|yo|sup|good morning|good afternoon|good evening)\b[!.]?$/i,
    /^(who are you|what are you|what is araxie|how does araxie work|how does this work)\??$/i,
    /^(how do payouts work|what is the fee|how much do creators make)\??$/i,
    /^(thank you|thanks|cool|awesome|got it|nice|ok|okay)\b[!.]?$/i,
    /^(how are you|what's up|tell me about yourself)\??$/i,
  ];

  for (const pattern of conversationalOnlyPatterns) {
    if (pattern.test(lower)) {
      return false;
    }
  }

  // Follow-up question about usage is informational, not a new bundle search
  if (lower.includes('how do i use') || lower.includes('how to use') || lower.includes('how do these tools work')) {
    return false;
  }

  const toolKeywords = [
    'tool', 'tools', 'bundle', 'recommend', 'suggest', 'buy', 'purchase',
    'budget', 'dollar', '$', 'discount', 'extension', 'extensions', 'software',
    'app', 'apps', 'pack', 'template', 'starter', 'need', 'looking for',
    'find me', 'sophomore', 'freshman', 'junior', 'senior', 'taking',
    'algorithms', 'devops', 'pre-med', 'mcat', 'biochem', 'cs', 'engineering',
    'canvas', 'gpa', 'cheat sheet', 'notes', 'study', 'math', 'calculus', 'physics',
    'code', 'coding', 'programmer', 'programming', 'developer', 'software dev',
    'python', 'react', 'nextjs', 'fastapi', 'javascript', 'typescript', 'web dev', 'web', 'dev',
    'show me other bundles', 'recommend other tools', 'other tools', 'other bundles',
    'what tools', 'what do you have', 'what have you got', 'catalog', 'available'
  ];

  return toolKeywords.some(kw => lower.includes(kw));
}

// Check for unserved categories (e.g. math solvers, music DAW, video editors)
function checkUnservedCategory(text: string): { isUnserved: boolean; reply: string } | null {
  const lower = text.toLowerCase();

  // Mathematics / Calculus / Algebra
  if (
    lower.includes('math') || 
    lower.includes('calculus') || 
    lower.includes('linear algebra') || 
    lower.includes('differential equation') || 
    lower.includes('geometry') ||
    lower.includes('trigonometry') ||
    lower.includes('desmos') ||
    lower.includes('wolfram')
  ) {
    return {
      isUnserved: true,
      reply: "We don't currently have a dedicated **Math or Calculus solving tool** on the Araxie marketplace yet.\n\nFor step-by-step calculus, symbolic algebra, and graphing, we recommend:\n- **[WolframAlpha](https://www.wolframalpha.com)** (symbolic math and step-by-step calculus solutions)\n- **[Desmos Graphing Calculator](https://www.desmos.com/calculator)** (interactive real-time curve and function plotting)\n- **[GeoGebra](https://www.geogebra.org)** (geometry, 3D graphing, and algebra visualizer)\n\n*(Note: If you're studying discrete mathematics or graph theory algorithms for CS, our **AlgoVisualizer Pro** covers Dijkstra and recursion trees).* \n\nAre you or a classmate building a campus math tool? Students can publish tools to Araxie in 60 seconds through our **Creator Studio** and keep **95% of every sale**!"
    };
  }

  // Music / Audio DAW
  if (lower.includes('music') || lower.includes('audio') || lower.includes('daw') || lower.includes('beat') || lower.includes('fl studio')) {
    return {
      isUnserved: true,
      reply: "We don't have music production or DAW software on Araxie right now. For student music makers, we recommend checking out **[Reaper](https://www.reaper.fm)** (generous student evaluation) or **[Audacity](https://www.audacityteam.org)** (open-source audio editing)."
    };
  }

  // Video Editing / 3D Animation
  if (lower.includes('video edit') || lower.includes('blender') || lower.includes('animation') || lower.includes('premiere')) {
    return {
      isUnserved: true,
      reply: "Araxie focuses primarily on student productivity, Chrome extensions, code templates, and study packs. For video and 3D work, we recommend **[DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve)** (free professional editor) and **[Blender](https://www.blender.org)**."
    };
  }

  return null;
}

// Conversational responses for general chatbot inquiries
function generateConversationalReply(prompt: string): string {
  const lower = prompt.toLowerCase();

  // Informational: How to use tools
  if (lower.includes('how do i use') || lower.includes('how to use') || lower.includes('how do these tools work')) {
    return "Using tools on Araxie is simple and instant:\n\n1. **Live In-Browser Demo**: Click **'Preview'** on any tool to launch a sandboxed interactive runner directly in your browser before buying.\n2. **1-Click Checkout**: Pay securely with PayPal or Card. No credit card details are ever retained.\n3. **Instant Locker Access**: Your tool is minted to your **Student Locker (@me)** with an HMAC cryptographic license key, and direct asset download links (Chrome extension zip, GitHub repo, or Anki deck).";
  }

  if (/^(hi|hello|hey|yo|sup)\b/i.test(lower)) {
    return "Hey there! 👋 I'm **araxieAi**, your campus assistant. How's the semester treating you? Whether you want study advice, tips for your classes, or need me to curate tools for your courses within a budget, just say the word!";
  }

  if (lower.includes('who are you') || lower.includes('what are you')) {
    return "I'm **araxieAi**! I'm an AI assistant built specifically for university students. I can chat about college life and study habits, or autonomously recommend peer-built tools (Chrome extensions, AST linters, Anki packs) with dynamic bundle discounts when you need them.";
  }

  if (lower.includes('how does araxie work') || lower.includes('what is araxie')) {
    return "**Araxie** is a student-first digital economy—think Whop or Gumroad tailored specifically to university life.\n\nStudent developers publish their study extensions and code templates, buyers get bundled discounts calculated by AI, and creators take home **95% of every sale** via instant PayPal Payouts.";
  }

  if (lower.includes('payout') || lower.includes('fee') || lower.includes('royalt')) {
    return "On Araxie, student creators keep **95% of the net captured sale**, with Araxie retaining a 5% platform fee to cover infrastructure. Payouts are dispatched straight to your PayPal account using deterministic, idempotent batch rails so there's zero risk of duplicate transfers.";
  }

  if (lower.includes('discount') || lower.includes('math') || lower.includes('formula')) {
    return "Our bundle discount uses a mathematically capped logarithmic curve:\n\n$$\\delta(k) = \\min(0.25, \\; 0.12 \\cdot \\ln(1 + k))$$\n\nBuying 2 tools gives ~13% off, 3 tools gives ~17% off, and it smoothly caps at 25% at 8 tools. It rewards bundling while preserving fair profit margins for student creators.";
  }

  if (lower.includes('thank') || lower.includes('cool') || lower.includes('awesome')) {
    return "You got it! 🚀 If you need anything else—like recommendations for your upcoming classes or budget-friendly study tools—just drop a message!";
  }

  return "I'm here to help! We can chat about your coursework, technical interview prep, or how to get the most out of your semester. If you ever want me to find specific student tools or build you a discounted bundle, just tell me what classes you're taking!";
}

// Comprehensive catalog matching engine with concept mapping and semantic token relevance scoring
function matchCatalogByRelevance(
  prompt: string,
  catalog: Product[]
): {
  matchedItems: Product[];
  reasoning: string;
  isCatalogOverview?: boolean;
} {
  const lowerPrompt = prompt.toLowerCase().trim();

  // 1. Catalog Overview Intent ("what tools do you have", "what do you have", "list tools", etc.)
  const isOverview = 
    lowerPrompt.includes('what tools do you have') ||
    lowerPrompt.includes('what tools do you') ||
    lowerPrompt.includes('what do you have') ||
    lowerPrompt.includes('what tools are available') ||
    lowerPrompt.includes('what have you got') ||
    lowerPrompt.includes('show me your tools') ||
    lowerPrompt.includes('show all tools') ||
    lowerPrompt.includes('list all tools') ||
    lowerPrompt.includes('list tools') ||
    lowerPrompt.includes('catalog') ||
    lowerPrompt === 'tools' ||
    lowerPrompt === 'what tools' ||
    lowerPrompt === 'all tools';

  if (isOverview) {
    const defaultStarter = catalog.filter(p => p.id === 'prod-canvas-autopilot' || p.id === 'prod-algo-visualizer');
    return {
      matchedItems: defaultStarter.length === 2 ? defaultStarter : catalog.slice(0, 2),
      reasoning: "We have **14 verified student-built tools** across 5 campus categories:\n\n- 🌐 **Chrome Extensions**: CanvasAutoPilot (LMS calendar sync), GPAGuardian\n- 💻 **Dev & Engineering**: AlgoVisualizer Pro (LeetCode patterns), CI-Guardian AST linter, FastAPI Micro-SaaS Starter, Nit7er Next.js 16 Boilerplate\n- 🩺 **Pre-Med & Science**: MedStudy CramOS (3,500+ Anki cards), ChemReaction 3D Explorer\n- 📝 **Writing & Research**: ResearchPaper Synthesizer CLI, Academic Prompt Vault, Schora AI Scholar Notebook\n- ⚡ **Campus Productivity**: Flow7 Cognitive Focus Stopwatch, Clasquera Schedule Generator, OAUmods\n\nI've curated our top-rated **Campus Starter Bundle** for you below with an automatic dynamic bundle discount:",
      isCatalogOverview: true,
    };
  }

  // 2. Specific Concept Matches
  // Web Development / Frontend / Fullstack / Next.js / React
  if (
    lowerPrompt.includes('web dev') ||
    lowerPrompt.includes('webdev') ||
    lowerPrompt.includes('web development') ||
    lowerPrompt.includes('web developer') ||
    lowerPrompt.includes('frontend') ||
    lowerPrompt.includes('front end') ||
    lowerPrompt.includes('backend') ||
    lowerPrompt.includes('back end') ||
    lowerPrompt.includes('fullstack') ||
    lowerPrompt.includes('full stack') ||
    lowerPrompt.includes('next.js') ||
    lowerPrompt.includes('nextjs') ||
    lowerPrompt.includes('react') ||
    lowerPrompt.includes('tailwind') ||
    lowerPrompt.includes('html') ||
    lowerPrompt.includes('css') ||
    lowerPrompt.includes('javascript') ||
    lowerPrompt.includes('typescript') ||
    lowerPrompt.includes('fastapi')
  ) {
    const webItems = catalog.filter(p => p.id === 'prod-fastapi-micro-saas' || p.id === 'prod-nit7er-boilerplate');
    return {
      matchedItems: webItems.length > 0 ? webItems : catalog.filter(p => p.id === 'prod-ci-guardian' || p.id === 'prod-algo-visualizer'),
      reasoning: "Curated top tools for student fullstack web development: the FastAPI Micro-SaaS Starter with auth & PayPal billing paired with the Nit7er Next.js 16/Tailwind v4 studio boilerplate.",
    };
  }

  // Suggestion: Other Bundles
  if (lowerPrompt.includes('other bundle') || lowerPrompt.includes('different bundle') || lowerPrompt.includes('show me other bundles')) {
    const devBundle = catalog.filter(p => p.id === 'prod-fastapi-micro-saas' || p.id === 'prod-nit7er-boilerplate');
    return {
      matchedItems: devBundle.length === 2 ? devBundle : catalog.filter(p => p.id === 'prod-flow7' || p.id === 'prod-ci-guardian'),
      reasoning: "Here is an alternative developer productivity bundle: FastAPI Micro-SaaS Boilerplate paired with Nit7er Next.js 15 Starter for shipping campus apps fast.",
    };
  }

  // Suggestion: Recommend Other Tools
  if (lowerPrompt.includes('recommend other tools') || lowerPrompt.includes('can you recommend other tools') || lowerPrompt.includes('other tools')) {
    const otherTools = catalog.filter(p => p.id === 'prod-flow7' || p.id === 'prod-paper-synthesizer');
    return {
      matchedItems: otherTools.length === 2 ? otherTools : catalog.slice(2, 4),
      reasoning: "Here are two top campus productivity tools: Flow7 for deep cognitive focus sessions and Paper Synthesizer for automated IEEE/APA literature citations.",
    };
  }

  // CS / Algorithms / LeetCode / Coding / Programming
  if (
    lowerPrompt.includes('code') ||
    lowerPrompt.includes('coding') ||
    lowerPrompt.includes('cs') ||
    lowerPrompt.includes('algorithm') ||
    lowerPrompt.includes('leet') ||
    lowerPrompt.includes('program') ||
    lowerPrompt.includes('developer') ||
    lowerPrompt.includes('python') ||
    lowerPrompt.includes('c++') ||
    lowerPrompt.includes('dsa') ||
    lowerPrompt.includes('data structure') ||
    lowerPrompt.includes('futa') ||
    lowerPrompt.includes('mit')
  ) {
    const csItems = catalog.filter(p => p.id === 'prod-algo-visualizer' || p.id === 'prod-ci-guardian');
    return {
      matchedItems: csItems,
      reasoning: "Curated a custom bundle for your CS & coding coursework: AlgoVisualizer Pro for interview algorithms paired with CI-Guardian AST validation for secure code.",
    };
  }

  // Pre-Med / MCAT / Biochem / Chemistry
  if (
    lowerPrompt.includes('med') ||
    lowerPrompt.includes('mcat') ||
    lowerPrompt.includes('bio') ||
    lowerPrompt.includes('chem') ||
    lowerPrompt.includes('doctor') ||
    lowerPrompt.includes('anki') ||
    lowerPrompt.includes('flashcard')
  ) {
    const medItems = catalog.filter(p => p.id === 'prod-medstudy-cramos' || p.id === 'prod-chem-reaction-3d');
    return {
      matchedItems: medItems,
      reasoning: "Assembled the MedStudy CramOS Anki flashcards with 3D Organic Chemistry reaction visualizer for your medical and biochemistry studies.",
    };
  }

  // Productivity / Focus / Time / Pomodoro
  if (
    lowerPrompt.includes('flow7') ||
    lowerPrompt.includes('focus') ||
    lowerPrompt.includes('timer') ||
    lowerPrompt.includes('stopwatch') ||
    lowerPrompt.includes('deep work') ||
    lowerPrompt.includes('pomodoro') ||
    lowerPrompt.includes('productivity')
  ) {
    const focusItems = catalog.filter(p => p.id === 'prod-flow7' || p.id === 'prod-ci-guardian');
    return {
      matchedItems: focusItems,
      reasoning: "Paired the Flow7 cognitive focus stopwatch with CI-Guardian AST scanning for distraction-free, high-output development sessions.",
    };
  }

  // Canvas / LMS / Calendar / GPA / Grades
  if (
    lowerPrompt.includes('canvas') ||
    lowerPrompt.includes('lms') ||
    lowerPrompt.includes('extension') ||
    lowerPrompt.includes('calendar') ||
    lowerPrompt.includes('deadline') ||
    lowerPrompt.includes('gpa') ||
    lowerPrompt.includes('grade')
  ) {
    const canvasItems = catalog.filter(p => p.id === 'prod-canvas-autopilot' || p.id === 'prod-gpa-guardian');
    return {
      matchedItems: canvasItems.length === 2 ? canvasItems : catalog.filter(p => p.id === 'prod-canvas-autopilot' || p.id === 'prod-flow7'),
      reasoning: "Selected CanvasAutoPilot for automatic LMS deadline scheduling paired with GPAGuardian for academic course grade tracking.",
    };
  }

  // Papers / Writing / Research / Citations
  if (
    lowerPrompt.includes('paper') ||
    lowerPrompt.includes('thesis') ||
    lowerPrompt.includes('writing') ||
    lowerPrompt.includes('prompt') ||
    lowerPrompt.includes('citation') ||
    lowerPrompt.includes('bibtex') ||
    lowerPrompt.includes('research') ||
    lowerPrompt.includes('scholar')
  ) {
    const paperItems = catalog.filter(p => p.id === 'prod-academic-prompt-vault' || p.id === 'prod-paper-synthesizer');
    return {
      matchedItems: paperItems,
      reasoning: "Combined the Academic Writing Prompt Vault with Paper Synthesizer to convert rough literature notes into formatted IEEE/APA citations.",
    };
  }

  // Course Scheduling / Timetable
  if (
    lowerPrompt.includes('schedule') ||
    lowerPrompt.includes('timetable') ||
    lowerPrompt.includes('clash') ||
    lowerPrompt.includes('conflict') ||
    lowerPrompt.includes('clasquera')
  ) {
    const schedItems = catalog.filter(p => p.id === 'prod-clasquera' || p.id === 'prod-canvas-autopilot');
    return {
      matchedItems: schedItems,
      reasoning: "Selected Clasquera for automated conflict-free class timetable scheduling paired with CanvasAutoPilot for LMS deadline sync.",
    };
  }

  // Nigerian University Campus Life (OAU, FUTA, UNILAG)
  if (
    lowerPrompt.includes('oau') ||
    lowerPrompt.includes('ife') ||
    lowerPrompt.includes('clearance') ||
    lowerPrompt.includes('hostel') ||
    lowerPrompt.includes('portal')
  ) {
    const oauItems = catalog.filter(p => p.id === 'prod-oaumods' || p.id === 'prod-flow7');
    return {
      matchedItems: oauItems,
      reasoning: "Curated student navigation and productivity essentials for campus life.",
    };
  }

  // Budget
  if (lowerPrompt.includes('budget') || lowerPrompt.includes('under') || lowerPrompt.includes('cheap')) {
    const cheapItems = catalog.filter(p => p.price <= 8).slice(0, 2);
    return {
      matchedItems: cheapItems,
      reasoning: "Curated high-utility student tools calibrated specifically for affordable campus budgets under $8.",
    };
  }

  // 3. Fallback: Fuzzy Token Relevance Scoring across all 14 products
  const stopWords = new Set(['i', 'a', 'an', 'the', 'for', 'to', 'in', 'on', 'of', 'and', 'with', 'need', 'want', 'tools', 'tool', 'some', 'any', 'me', 'my', 'get', 'give', 'recommend', 'suggest', 'looking']);
  const tokens = lowerPrompt
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !stopWords.has(t));

  if (tokens.length > 0) {
    const scoredProducts = catalog.map(prod => {
      let score = 0;
      const titleLower = prod.title.toLowerCase();
      const taglineLower = prod.tagline.toLowerCase();
      const descLower = prod.description.toLowerCase();
      const catLower = prod.category.toLowerCase();
      const tagsLower = prod.tags.map(t => t.toLowerCase());

      for (const token of tokens) {
        if (titleLower.includes(token)) score += 10;
        if (tagsLower.some(t => t.includes(token))) score += 8;
        if (catLower.includes(token)) score += 6;
        if (taglineLower.includes(token)) score += 4;
        if (descLower.includes(token)) score += 2;
      }

      return { prod, score };
    });

    scoredProducts.sort((a, b) => b.score - a.score);
    const topScored = scoredProducts.filter(sp => sp.score > 0).slice(0, 2).map(sp => sp.prod);

    if (topScored.length > 0) {
      return {
        matchedItems: topScored,
        reasoning: `Matched top student tools from our catalog for "${prompt}": ${topScored.map(p => p.title).join(' and ')}. Bundle them together for an automatic dynamic discount.`,
      };
    }
  }

  return {
    matchedItems: [],
    reasoning: '',
  };
}

export async function POST(req: NextRequest) {
  try {
    const { prompt: rawPrompt, customCatalog } = await req.json();
    const catalog: Product[] = customCatalog && customCatalog.length > 0 ? customCatalog : getAllProducts();

    // 1. Prompt Injection & Anti-Abuse Inspection
    const promptSecurity = inspectPromptSecurity(rawPrompt || '');
    const prompt = promptSecurity.sanitized;
    const isToolIntent = hasToolRecommendationIntent(prompt);

    // 2. If student is just having a conversation, act as a helpful conversational chatbot without forcing a bundle
    if (!isToolIntent) {
      let chatReply = generateConversationalReply(prompt);

      if (GEMINI_API_KEY && promptSecurity.isSafe) {
        const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
        const budgetCheck = checkAndConsumeGeminiBudget(clientIp);

        if (budgetCheck.allowed) {
          try {
            const conversationPrompt = `You are araxieAi, a sharp, friendly, collegiate AI assistant for university students on Araxie (a student digital tools marketplace).
A student said: "${prompt}".
Respond conversationally, helpfully, and authentically as a college peer.
Do NOT force or pitch any product bundle unless the student explicitly asks for tools. Keep your answer concise (2-3 sentences), warm, and engaging.`;

            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: conversationPrompt }] }],
                  generationConfig: { temperature: 0.8, maxOutputTokens: 200 },
                }),
              }
            );

            if (geminiRes.status === 429) {
              recordGeminiQuotaExceeded();
            } else if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (generatedText && generatedText.trim().length > 0) {
                chatReply = generatedText.trim();
              }
            }
          } catch (e) {
            console.warn('Gemini chat error, fallback to built-in conversational reply:', e);
          }
        }
      }

      return NextResponse.json({
        reply: chatReply,
        bundle: null,
        isRecommendation: false,
      });
    }

    // 3. Check for unserved categories (e.g. math solver, video editor, etc.)
    const unservedCheck = checkUnservedCategory(prompt);
    if (unservedCheck) {
      return NextResponse.json({
        reply: unservedCheck.reply,
        bundle: null, // DO NOT force unrelated tools!
        isRecommendation: false,
      });
    }

    // 4. Intelligent catalog matching across the entire catalog (concept mapping + token relevance scoring)
    const matchResult = matchCatalogByRelevance(prompt, catalog);
    let matchedItems: Product[] = matchResult.matchedItems;
    let defaultReasoning = matchResult.reasoning;

    // If NO genuine correlation was found, inform the student honestly instead of forcing unrelated tools!
    if (matchedItems.length === 0) {
      return NextResponse.json({
        reply: `We don't currently have a dedicated tool matching that specific request on the Araxie marketplace yet.\n\nWe recommend searching the **[Chrome Web Store](https://chrome.google.com/webstore)** or **[GitHub](https://github.com)** for open-source university extensions.\n\nAre you or a fellow student building a tool for this? You can publish it on Araxie in under 60 seconds via **Creator Studio** and keep **95% of every sale**!`,
        bundle: null,
        isRecommendation: false,
      });
    }

    const bundleItems = matchedItems.slice(0, 2);
    const pricing = calculateBundleDiscount(bundleItems);
    let aiReasoning = defaultReasoning;

    // Check cache
    const cacheKey = `concierge:${prompt.trim().toLowerCase()}`;
    const cachedText = getCachedGeminiResponse(cacheKey);

    if (cachedText) {
      aiReasoning = cachedText;
    } else if (GEMINI_API_KEY && promptSecurity.isSafe) {
      const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
      const budgetCheck = checkAndConsumeGeminiBudget(clientIp);

      if (budgetCheck.allowed) {
        try {
          const geminiPrompt = `You are the AI Concierge for Araxie, a peer-to-peer student digital tools marketplace.
A student said: "${prompt}".
We genuinely matched these tools from the catalog: ${bundleItems.map(b => `${b.title} ($${b.price})`).join(', ')}.
Bundle savings: ${pricing.discountPercentage}%.

Write a concise, friendly 2-sentence response explaining why these student-built tools fit their course requirements and why this bundle discount is worth grabbing. Keep it collegiate and sharp.`;

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: geminiPrompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 200 },
              }),
            }
          );

          if (geminiRes.status === 429) {
            recordGeminiQuotaExceeded();
          } else if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim().length > 0) {
              aiReasoning = text.trim();
              setCachedGeminiResponse(cacheKey, aiReasoning);
            }
          }
        } catch (err) {
          console.warn('Gemini recommendation call fallback:', err);
        }
      }
    }

    const bundle: DynamicBundle = {
      id: `bundle-${Date.now()}`,
      title: `${bundleItems.length}-Item Campus Bundle`,
      items: bundleItems,
      originalTotal: pricing.originalTotal,
      discountPercentage: pricing.discountPercentage,
      bundleTotal: pricing.bundleTotal,
      savings: pricing.savings,
      reason: aiReasoning,
    };

    return NextResponse.json({
      reply: aiReasoning,
      bundle,
      suggestedProducts: bundleItems,
      isRecommendation: true,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'AI Concierge failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
