import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';
import { DynamicBundle, Product } from '@/types';

// Mathematical Dynamic Bundling function
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
  // Formula: delta(k) = min(0.25, 0.12 * ln(1 + k))
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
    const catalog: Product[] = customCatalog && customCatalog.length > 0 ? customCatalog : INITIAL_PRODUCTS;
    const lowerPrompt = (prompt || '').toLowerCase();

    let matchedItems: Product[] = [];
    let reasoning = '';

    // Semantic matching for student domains
    if (lowerPrompt.includes('cs') || lowerPrompt.includes('code') || lowerPrompt.includes('algorithm') || lowerPrompt.includes('leet') || lowerPrompt.includes('computer')) {
      matchedItems = catalog.filter(p => p.id === 'prod-algo-visualizer' || p.id === 'prod-fastapi-micro-saas' || p.id === 'prod-canvas-autopilot');
      reasoning = 'Curated the top-rated algorithm visualizer and Canvas assignment organizer to keep your coding study sessions on track.';
    } else if (lowerPrompt.includes('premed') || lowerPrompt.includes('med') || lowerPrompt.includes('mcat') || lowerPrompt.includes('bio') || lowerPrompt.includes('chem')) {
      matchedItems = catalog.filter(p => p.id === 'prod-medstudy-cramos' || p.id === 'prod-chem-reaction-3d');
      reasoning = 'Assembled the MedStudy CramOS 3,500+ Anki deck with the 3D Organic Chemistry reaction simulator for high-yield retention.';
    } else if (lowerPrompt.includes('chrome') || lowerPrompt.includes('extension') || lowerPrompt.includes('gpa') || lowerPrompt.includes('grade') || lowerPrompt.includes('calendar')) {
      matchedItems = catalog.filter(p => p.category === 'chrome-extension');
      reasoning = 'Selected our two most essential student browser extensions: automated Canvas calendar sync and GPA curve forecasting.';
    } else if (lowerPrompt.includes('paper') || lowerPrompt.includes('thesis') || lowerPrompt.includes('write') || lowerPrompt.includes('research') || lowerPrompt.includes('prompt')) {
      matchedItems = catalog.filter(p => p.id === 'prod-paper-synthesizer' || p.id === 'prod-academic-prompt-vault');
      reasoning = 'Combined the arXiv/PubMed Research Paper Synthesizer CLI with 250+ battle-tested academic writing prompts.';
    } else if (lowerPrompt.includes('cheap') || lowerPrompt.includes('under 10') || lowerPrompt.includes('under $10') || lowerPrompt.includes('budget') || lowerPrompt.includes('5')) {
      matchedItems = catalog.filter(p => p.price <= 8).slice(0, 3);
      reasoning = 'Filtered student-built tools designed for strict student budgets under $10 with maximal daily utility.';
    } else {
      // Default high-synergy starter kit
      matchedItems = [
        catalog.find(p => p.id === 'prod-canvas-autopilot') || catalog[0],
        catalog.find(p => p.id === 'prod-academic-prompt-vault') || catalog[1],
      ];
      reasoning = 'Recommended a high-impact productivity starter bundle combining assignment deadline automation with academic writing prompts.';
    }

    // Limit to max 3 items for clean bundle presentation
    const bundleItems = matchedItems.slice(0, 3);
    const pricing = calculateBundleDiscount(bundleItems);

    const bundle: DynamicBundle = {
      id: `bundle-${Date.now()}`,
      title: `${bundleItems.length}-Item Campus Success Bundle`,
      items: bundleItems,
      originalTotal: pricing.originalTotal,
      discountPercentage: pricing.discountPercentage,
      bundleTotal: pricing.bundleTotal,
      savings: pricing.savings,
      reason: reasoning,
    };

    const reply = `I found **${bundleItems.length} peer-built tools** that directly target your needs. ${reasoning}\n\nBy packaging these together, I applied an autonomous **${pricing.discountPercentage}% student bundle discount**, bringing your total from **$${pricing.originalTotal.toFixed(2)}** down to **$${pricing.bundleTotal.toFixed(2)}** (saving you $${pricing.savings.toFixed(2)}). You can checkout directly via PayPal below.`;

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
