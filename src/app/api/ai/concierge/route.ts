import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db';
import { DynamicBundle, Product } from '@/types';

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
    const { prompt, customCatalog } = await req.json();
    const catalog: Product[] = customCatalog && customCatalog.length > 0 ? customCatalog : getAllProducts();
    const lowerPrompt = (prompt || '').toLowerCase();

    let matchedItems: Product[] = [];
    let defaultReasoning = '';

    // Semantic catalog matching
    if (lowerPrompt.includes('cs') || lowerPrompt.includes('code') || lowerPrompt.includes('algorithm') || lowerPrompt.includes('leet') || lowerPrompt.includes('swe')) {
      matchedItems = catalog.filter(p => p.id === 'prod-algo-visualizer' || p.id === 'prod-fastapi-micro-saas' || p.id === 'prod-canvas-autopilot');
      defaultReasoning = 'Curated the top-rated algorithm visualizer and Canvas assignment organizer to keep your coding study sessions on track.';
    } else if (lowerPrompt.includes('premed') || lowerPrompt.includes('med') || lowerPrompt.includes('mcat') || lowerPrompt.includes('bio') || lowerPrompt.includes('chem')) {
      matchedItems = catalog.filter(p => p.id === 'prod-medstudy-cramos' || p.id === 'prod-chem-reaction-3d');
      defaultReasoning = 'Assembled the MedStudy CramOS 3,500+ Anki deck with the 3D Organic Chemistry reaction simulator for high-yield retention.';
    } else if (lowerPrompt.includes('chrome') || lowerPrompt.includes('extension') || lowerPrompt.includes('gpa') || lowerPrompt.includes('grade') || lowerPrompt.includes('calendar')) {
      matchedItems = catalog.filter(p => p.category === 'chrome-extension');
      defaultReasoning = 'Selected our two most essential student browser extensions: automated Canvas calendar sync and GPA curve forecasting.';
    } else if (lowerPrompt.includes('paper') || lowerPrompt.includes('thesis') || lowerPrompt.includes('write') || lowerPrompt.includes('research') || lowerPrompt.includes('prompt')) {
      matchedItems = catalog.filter(p => p.id === 'prod-paper-synthesizer' || p.id === 'prod-academic-prompt-vault');
      defaultReasoning = 'Combined the arXiv/PubMed Research Paper Synthesizer CLI with 250+ battle-tested academic writing prompts.';
    } else if (lowerPrompt.includes('cheap') || lowerPrompt.includes('under 10') || lowerPrompt.includes('under $10') || lowerPrompt.includes('budget') || lowerPrompt.includes('5')) {
      matchedItems = catalog.filter(p => p.price <= 8).slice(0, 3);
      defaultReasoning = 'Filtered student-built tools designed for strict student budgets under $10 with maximal daily utility.';
    } else {
      matchedItems = [
        catalog.find(p => p.id === 'prod-canvas-autopilot') || catalog[0],
        catalog.find(p => p.id === 'prod-academic-prompt-vault') || catalog[1],
      ];
      defaultReasoning = 'Recommended a high-impact productivity starter bundle combining assignment deadline automation with academic writing prompts.';
    }

    const bundleItems = matchedItems.slice(0, 3);
    const pricing = calculateBundleDiscount(bundleItems);

    let aiReasoning = defaultReasoning;

    // Call live Google Gemini 2.5 Flash if API key is present
    if (GEMINI_API_KEY) {
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

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim().length > 0) {
            aiReasoning = generatedText.trim();
          }
        }
      } catch (err) {
        console.warn('Gemini live call fallback to deterministic reasoning:', err);
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
