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

  // Explicit greeting or meta questions without shopping intent
  const conversationalOnlyPatterns = [
    /^(hi|hello|hey|yo|good morning|good afternoon|good evening)\b[!.]?$/i,
    /^(who are you|what are you|what is araxie|how does araxie work|how does this work)\??$/i,
    /^(how do payouts work|what is the fee|how much do creators make)\??$/i,
    /^(thank you|thanks|cool|awesome|got it|nice|ok|okay)\b[!.]?$/i,
  ];

  for (const pattern of conversationalOnlyPatterns) {
    if (pattern.test(lower)) {
      return false;
    }
  }

  // Explicit tool/bundle/shopping intent cues
  const toolKeywords = [
    'tool', 'tools', 'bundle', 'recommend', 'suggest', 'buy', 'purchase',
    'budget', 'dollar', '$', 'discount', 'extension', 'extensions', 'software',
    'app', 'apps', 'pack', 'template', 'starter', 'need', 'looking for',
    'find me', 'sophomore', 'freshman', 'junior', 'senior', 'taking',
    'algorithms', 'devops', 'pre-med', 'mcat', 'biochem', 'cs', 'engineering',
    'canvas', 'gpa', 'cheat sheet', 'notes', 'study'
  ];

  return toolKeywords.some(kw => lower.includes(kw));
}

// Conversational responses for general chatbot inquiries
function generateConversationalReply(prompt: string): string {
  const lower = prompt.toLowerCase();

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

    // If student is just having a conversation, act as a helpful conversational chatbot without forcing a bundle!
    if (!isToolIntent) {
      let chatReply = generateConversationalReply(prompt);

      // Attempt live Gemini response if available for natural human conversation
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
        bundle: null, // No forced bundle card!
        isRecommendation: false,
      });
    }

    // --- TOOL RECOMMENDATION / BUNDLE FLOW ---
    const lowerPrompt = prompt.toLowerCase();
    let matchedItems: Product[] = [];
    let defaultReasoning = '';

    // Semantic catalog matching
    if (lowerPrompt.includes('cs') || lowerPrompt.includes('code') || lowerPrompt.includes('algorithm') || lowerPrompt.includes('leet') || lowerPrompt.includes('futa') || lowerPrompt.includes('mit')) {
      matchedItems = catalog.filter(p => p.id === 'prod-algo-visualizer' || p.id === 'prod-ci-guardian');
      defaultReasoning = 'Curated a custom bundle for your CS coursework: AlgoVisualizer Pro for interview algorithms paired with CI-Guardian AST validation for secure coding.';
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
    } else {
      matchedItems = [
        catalog.find(p => p.id === 'prod-algo-visualizer') || catalog[0],
        catalog.find(p => p.id === 'prod-ci-guardian') || catalog[1],
      ].filter(Boolean);
      defaultReasoning = "I've curated a custom bundle that fits your budget and covers your course needs. Here are two highly-rated student-built tools:";
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
We matched these tools from the catalog: ${bundleItems.map(b => `${b.title} ($${b.price})`).join(', ')}.
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
