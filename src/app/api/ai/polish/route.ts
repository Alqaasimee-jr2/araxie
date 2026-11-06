import { NextRequest, NextResponse } from 'next/server';
import { 
  checkAndConsumeGeminiBudget, 
  recordGeminiQuotaExceeded, 
  getCachedGeminiResponse, 
  setCachedGeminiResponse 
} from '@/lib/geminiRateLimiter';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { title, category } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Deterministic fallback response definition
    const fallbackResponse = {
      tagline: `The student-engineered ${category.replace('-', ' ')} built to streamline academic workflows and boost course performance.`,
      description: `Created by university developers for peers managing demanding semester workloads. ${title} eliminates manual friction, automates repetitive study tasks, and is 100% verified across campus coursework.`,
      features: [
        'Direct integration with modern student platforms and local workflows',
        'Lightweight, zero-bloat architecture: sets up in under 60 seconds',
        'Peer-verified across active university midterm & final exams',
        'Includes step-by-step setup guide and lifetime developer updates'
      ],
      suggestedPrice: 8.50,
      creditProtected: true,
    };

    // Check cache first
    const cacheKey = `polish:${category}:${title.trim().toLowerCase()}`;
    const cachedData = getCachedGeminiResponse(cacheKey);
    if (cachedData) {
      try {
        return NextResponse.json(JSON.parse(cachedData));
      } catch {
        // Continue to fresh check
      }
    }

    if (GEMINI_API_KEY) {
      const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
      const budgetCheck = checkAndConsumeGeminiBudget(clientIp);

      if (budgetCheck.allowed) {
        const prompt = `You are an expert product marketer for Araxie, a student digital marketplace (like Whop for universities).
A student is publishing a tool called: "${title}" in the category: "${category}".

Generate a JSON object with:
1. "tagline": A crisp 1-sentence value proposition for university students.
2. "description": A concise, engaging 2-3 sentence description explaining why students need this tool, how it saves time, and peer credibility.
3. "features": An array of exactly 4 punchy, specific features/benefits.
4. "suggestedPrice": A fair student-friendly price between $4.99 and $19.99 (number).

Respond ONLY with valid JSON. Do not include markdown codeblocks or explanation.`;

        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.7,
                  responseMimeType: 'application/json',
                },
              }),
            }
          );

          if (res.status === 429) {
            recordGeminiQuotaExceeded();
          } else if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              const parsed = JSON.parse(text);
              setCachedGeminiResponse(cacheKey, JSON.stringify(parsed));
              return NextResponse.json(parsed);
            }
          }
        } catch (e) {
          console.warn('Gemini polish error, falling back:', e);
        }
      } else {
        console.info(`[Gemini Free Tier Safeguard] Polish call blocked to protect credits: ${budgetCheck.reason}`);
      }
    }

    // High quality deterministic fallback
    return NextResponse.json(fallbackResponse);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI Polish failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
