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

export async function POST(req: NextRequest) {
  try {
    const { prompt: rawPrompt, customCatalog } = await req.json();
    const catalog: Product[] = customCatalog && customCatalog.length > 0 ? customCatalog : getAllProducts();

    // 1. Prompt Injection & Anti-Abuse Inspection
    const promptSecurity = inspectPromptSecurity(rawPrompt || '');
    const prompt = promptSecurity.sanitized;
    const lowerPrompt = prompt.toLowerCase();

    let matchedItems: Product[] = [];
    let defaultReasoning = '';

    // Semantic catalog matching with Nigerian campus support
    if (lowerPrompt.includes('oau') || lowerPrompt.includes('ife') || lowerPrompt.includes('clearance') || lowerPrompt.includes('hostel') || lowerPrompt.includes('survival')) {
      matchedItems = catalog.filter(p => p.id === 'prod-oaumods' || p.id === 'prod-flow7' || p.id === 'prod-ci-guardian');
      defaultReasoning = 'Curated the ultimate Great Ife survival bundle: OAUMods campus guide with Flow7 performance awareness and CI-Guardian pre-flight developer tools.';
    } else if (lowerPrompt.includes('flow7') || lowerPrompt.includes('focus') || lowerPrompt.includes('timer') || lowerPrompt.includes('session') || lowerPrompt.includes('stopwatch')) {
      matchedItems = catalog.filter(p => p.id === 'prod-flow7' || p.id === 'prod-ci-guardian' || p.id === 'prod-canvas-autopilot');
      defaultReasoning = 'Paired the Flow7 cognitive performance layer with CI-Guardian AST validation for deep, uninterrupted student development flow.';
    } else if (lowerPrompt.includes('ci') || lowerPrompt.includes('guardian') || lowerPrompt.includes('devops') || lowerPrompt.includes('security') || lowerPrompt.includes('git')) {
      matchedItems = catalog.filter(p => p.id === 'prod-ci-guardian' || p.id === 'prod-flow7' || p.id === 'prod-algo-visualizer');
      defaultReasoning = 'Combined CI-Guardian pre-flight AST scanner with AlgoVisualizer Pro for clean, secure, battle-tested student software.';
    } else if (lowerPrompt.includes('cs') || lowerPrompt.includes('code') || lowerPrompt.includes('algorithm') || lowerPrompt.includes('leet') || lowerPrompt.includes('futa') || lowerPrompt.includes('unilag')) {
      matchedItems = catalog.filter(p => p.id === 'prod-algo-visualizer' || p.id === 'prod-ci-guardian' || p.id === 'prod-canvas-autopilot');
      defaultReasoning = 'Selected the AlgoVisualizer 3D algorithm runner alongside CI-Guardian and Canvas timetable automation for engineering students.';
    } else if (lowerPrompt.includes('med') || lowerPrompt.includes('ui') || lowerPrompt.includes('mcat') || lowerPrompt.includes('bio') || lowerPrompt.includes('chem')) {
      matchedItems = catalog.filter(p => p.id === 'prod-medstudy-cramos' || p.id === 'prod-chem-reaction-3d' || p.id === 'prod-paper-synthesizer');
      defaultReasoning = 'Assembled the MedStudy CramOS Anki suite with 3D Organic Chemistry visualization and literature review summarizers for medical and science students.';
    } else if (lowerPrompt.includes('extension') || lowerPrompt.includes('gpa') || lowerPrompt.includes('timetable') || lowerPrompt.includes('calendar')) {
      matchedItems = catalog.filter(p => p.category === 'chrome-extension' || p.id === 'prod-canvas-autopilot' || p.id === 'prod-gpa-guardian');
      defaultReasoning = 'Selected our two most essential student utilities: Canvas/LMS calendar synchronization and GPA curve forecasting.';
    } else if (lowerPrompt.includes('paper') || lowerPrompt.includes('thesis') || lowerPrompt.includes('project') || lowerPrompt.includes('prompt') || lowerPrompt.includes('final year')) {
      matchedItems = catalog.filter(p => p.id === 'prod-paper-synthesizer' || p.id === 'prod-academic-prompt-vault');
      defaultReasoning = 'Combined the Research Paper Synthesizer CLI with 250+ battle-tested academic prompts for final-year projects and defense preparations.';
    } else if (lowerPrompt.includes('cheap') || lowerPrompt.includes('budget') || lowerPrompt.includes('under 10') || lowerPrompt.includes('under $10') || lowerPrompt.includes('5')) {
      matchedItems = catalog.filter(p => p.price <= 8).slice(0, 3);
      defaultReasoning = 'Curated high-utility student tools specifically calibrated for affordable campus budgets under $8.';
    } else {
      matchedItems = [
        catalog.find(p => p.id === 'prod-flow7') || catalog[0],
        catalog.find(p => p.id === 'prod-ci-guardian') || catalog[1],
        catalog.find(p => p.id === 'prod-oaumods') || catalog[2],
      ].filter(Boolean);
      defaultReasoning = 'Recommended a high-impact campus starter bundle featuring Flow7 focus layer, CI-Guardian AST scanner, and student navigation utilities.';
    }

    const bundleItems = matchedItems.slice(0, 3);
    const pricing = calculateBundleDiscount(bundleItems);

    let aiReasoning = defaultReasoning;

    // Check cache first to avoid duplicate API calls
    const cacheKey = `concierge:${prompt.trim().toLowerCase()}`;
    const cachedText = getCachedGeminiResponse(cacheKey);

    if (cachedText) {
      aiReasoning = cachedText;
    } else if (GEMINI_API_KEY && promptSecurity.isSafe) {
      // Check Free Tier Rate Limit and daily budget protector
      const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
      const budgetCheck = checkAndConsumeGeminiBudget(clientIp);

      if (budgetCheck.allowed) {
        try {
          const geminiPrompt = `You are the AI Concierge for Araxie, a peer-to-peer student digital tools marketplace (like Whop for students).
A student said: "${prompt}".
We selected these tools for them: ${bundleItems.map(b => `${b.title} ($${b.price})`).join(', ')}.
Total original price: $${pricing.originalTotal}, but with our autonomous bundle discount (${pricing.discountPercentage}%), the price is now $${pricing.bundleTotal} (saving $${pricing.savings}).

Write a concise, friendly, collegiate 2-sentence response explaining why these specific student-built tools solve their exact problem and why this bundle discount is worth grabbing right now. Keep it punchy and student-to-student.`;

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: geminiPrompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 250 },
              }),
            }
          );

          if (geminiRes.status === 429) {
            recordGeminiQuotaExceeded();
          } else if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText && generatedText.trim().length > 0) {
              aiReasoning = generatedText.trim();
              setCachedGeminiResponse(cacheKey, aiReasoning);
            }
          }
        } catch (err) {
          console.warn('Gemini live call fallback to deterministic reasoning:', err);
        }
      } else {
        console.info(`[Gemini Free Tier Safeguard] Call blocked to prevent billing: ${budgetCheck.reason}`);
      }
    }

    const bundle: DynamicBundle = {
      id: `bundle-${Date.now()}`,
      title: `${bundleItems.length}-Item Campus Success Bundle`,
      items: bundleItems,
      originalTotal: pricing.originalTotal,
      discountPercentage: pricing.discountPercentage,
      bundleTotal: pricing.bundleTotal,
      savings: pricing.savings,
      reason: aiReasoning,
    };

    const reply = `${aiReasoning}\n\nI dynamically bundled **${bundleItems.length} student tools** and applied our **${pricing.discountPercentage}% student bundle discount**, bringing your total from **$${pricing.originalTotal.toFixed(2)}** down to **$${pricing.bundleTotal.toFixed(2)}** (saving you $${pricing.savings.toFixed(2)}). You can checkout with PayPal below.`;

    return NextResponse.json({
      reply,
      bundle,
      suggestedProducts: bundleItems,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'AI Concierge failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
