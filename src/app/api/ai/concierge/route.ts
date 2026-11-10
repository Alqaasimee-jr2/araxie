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
    'python', 'react', 'nextjs', 'fastapi', 'javascript', 'typescript', 'web dev',
    'show me other bundles', 'recommend other tools', 'other tools', 'other bundles'
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

    // 4. Genuine tool matching across catalog
    const lowerPrompt = prompt.toLowerCase();
    let matchedItems: Product[] = [];
    let defaultReasoning = '';

    // Handle suggestion pill: "Show me other bundles" / "other bundles"
    if (lowerPrompt.includes('other bundle') || lowerPrompt.includes('different bundle') || lowerPrompt.includes('show me other bundles')) {
      // Rotate to an alternative top bundle (e.g., Micro-SaaS + Fullstack dev bundle, or Pre-med study bundle)
      matchedItems = catalog.filter(p => p.id === 'prod-fastapi-micro-saas' || p.id === 'prod-nit7er-boilerplate');
      if (matchedItems.length < 2) {
        matchedItems = catalog.filter(p => p.id === 'prod-flow7' || p.id === 'prod-ci-guardian');
      }
      defaultReasoning = 'Here is an alternative developer productivity bundle: FastAPI Micro-SaaS Boilerplate paired with Nit7er Next.js 15 Starter for shipping campus apps fast.';
    }
    // Handle suggestion pill: "Can you recommend other tools?" / "other tools"
    else if (lowerPrompt.includes('recommend other tools') || lowerPrompt.includes('can you recommend other tools') || lowerPrompt.includes('other tools')) {
      matchedItems = catalog.filter(p => p.id === 'prod-flow7' || p.id === 'prod-paper-synthesizer');
      defaultReasoning = 'Here are two top campus productivity tools: Flow7 for deep cognitive focus sessions and Paper Synthesizer for automated IEEE/APA literature citations.';
    }
    // Coding / CS / Algorithms / LeetCode / Software Engineering
    else if (
      lowerPrompt.includes('code') || 
      lowerPrompt.includes('coding') || 
      lowerPrompt.includes('cs') || 
      lowerPrompt.includes('algorithm') || 
      lowerPrompt.includes('leet') || 
      lowerPrompt.includes('program') ||
      lowerPrompt.includes('developer') ||
      lowerPrompt.includes('python') ||
      lowerPrompt.includes('futa') || 
      lowerPrompt.includes('mit')
    ) {
      matchedItems = catalog.filter(p => p.id === 'prod-algo-visualizer' || p.id === 'prod-ci-guardian');
      defaultReasoning = 'Curated a custom bundle for your CS & coding coursework: AlgoVisualizer Pro for interview algorithms paired with CI-Guardian AST validation for secure code.';
    } else if (lowerPrompt.includes('med') || lowerPrompt.includes('mcat') || lowerPrompt.includes('bio') || lowerPrompt.includes('chem')) {
      matchedItems = catalog.filter(p => p.id === 'prod-medstudy-cramos' || p.id === 'prod-chem-reaction-3d');
      defaultReasoning = 'Assembled the MedStudy CramOS Anki flashcards with 3D Organic Chemistry reaction visualizer for your medical and biochemistry studies.';
    } else if (lowerPrompt.includes('flow7') || lowerPrompt.includes('focus') || lowerPrompt.includes('timer') || lowerPrompt.includes('deep work')) {
      matchedItems = catalog.filter(p => p.id === 'prod-flow7' || p.id === 'prod-ci-guardian');
      defaultReasoning = 'Paired the Flow7 cognitive focus stopwatch with CI-Guardian AST scanning for distraction-free, high-output development sessions.';
    } else if (lowerPrompt.includes('canvas') || lowerPrompt.includes('extension') || lowerPrompt.includes('calendar') || lowerPrompt.includes('gpa')) {
      matchedItems = catalog.filter(p => p.id === 'prod-canvas-autopilot' || p.id === 'prod-flow7');
      defaultReasoning = 'Selected CanvasAutoPilot for automatic LMS deadline scheduling with Flow7 to balance cognitive study load across your semester.';
    } else if (lowerPrompt.includes('paper') || lowerPrompt.includes('thesis') || lowerPrompt.includes('writing') || lowerPrompt.includes('prompt')) {
      matchedItems = catalog.filter(p => p.id === 'prod-academic-prompt-vault' || p.id === 'prod-paper-synthesizer');
      defaultReasoning = 'Combined the Academic Writing Prompt Vault with Paper Synthesizer to convert rough literature notes into formatted IEEE/APA citations.';
    } else if (lowerPrompt.includes('budget') || lowerPrompt.includes('under') || lowerPrompt.includes('cheap')) {
      matchedItems = catalog.filter(p => p.price <= 8).slice(0, 2);
      defaultReasoning = 'Curated high-utility student tools calibrated specifically for affordable campus budgets under $8.';
    } else if (lowerPrompt.includes('oau') || lowerPrompt.includes('ife') || lowerPrompt.includes('clearance') || lowerPrompt.includes('hostel')) {
      matchedItems = catalog.filter(p => p.id === 'prod-oaumods' || p.id === 'prod-flow7');
      defaultReasoning = 'Curated student navigation and productivity essentials for campus life.';
    }

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
