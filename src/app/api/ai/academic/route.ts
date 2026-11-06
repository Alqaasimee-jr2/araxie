import { NextRequest, NextResponse } from 'next/server';
import { 
  checkAndConsumeGeminiBudget, 
  recordGeminiQuotaExceeded, 
  getCachedGeminiResponse, 
  setCachedGeminiResponse 
} from '@/lib/geminiRateLimiter';
import { sanitizeInput, inspectPromptSecurity } from '@/lib/security';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawMode = body.mode;
    const rawText = body.text;
    const rawSubject = body.subject;

    if (!rawText) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
    }

    const textSecurity = inspectPromptSecurity(rawText);
    const text = textSecurity.sanitized;
    const subject = sanitizeInput(rawSubject || 'General Academia', 60);
    const mode = sanitizeInput(rawMode || 'general', 30);

    let systemInstruction = '';
    if (mode === 'literature-review') {
      systemInstruction = 'You are an academic research assistant for university students. Synthesize the provided topic/notes into a structured literature review section with: 1) Core Themes, 2) Methodological Divergences, 3) Open Research Gaps, and 4) Suggested Citations/Keywords in BibTeX format.';
    } else if (mode === 'reviewer-2-rebuttal') {
      systemInstruction = 'You are a master academic editor. Given the critique or review comment, write a diplomatic, rigorous, point-by-point author rebuttal suitable for peer review in an academic journal or conference.';
    } else if (mode === 'latex-formatter') {
      systemInstruction = 'You are a LaTeX typesetting expert. Convert the provided mathematical statements, tables, or algorithms into clean, compile-ready LaTeX code with proper equation environments, alignments, and brief commentary.';
    } else {
      systemInstruction = 'You are an academic writing and study coach. Provide an in-depth academic critique of the argument, logical coherence, and formal scholarly diction of the text.';
    }

    // Check cache first
    const cacheKey = `academic:${mode}:${text.trim().substring(0, 100)}`;
    const cachedResult = getCachedGeminiResponse(cacheKey);
    if (cachedResult) {
      return NextResponse.json({ result: cachedResult, fromCache: true });
    }

    if (GEMINI_API_KEY && textSecurity.isSafe) {
      const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon';
      const budgetCheck = checkAndConsumeGeminiBudget(clientIp);

      if (budgetCheck.allowed) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `${systemInstruction}\n\nSubject / Field: ${subject}\n\nInput Content:\n${text}`,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.6,
                  maxOutputTokens: 800,
                },
              }),
            }
          );

          if (res.status === 429) {
            recordGeminiQuotaExceeded();
          } else if (res.ok) {
            const data = await res.json();
            const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (outputText) {
              setCachedGeminiResponse(cacheKey, outputText);
              return NextResponse.json({ result: outputText });
            }
          }
        } catch (e) {
          console.warn('Academic AI error, falling back:', e);
        }
      }
    }

    return NextResponse.json({
      result: `### Academic Analysis (${subject})\n\n**Key Strengths:**\n- Coherent thesis formulation with clear scope.\n- Logical transitions between core assertions.\n\n**Areas for Refinement:**\n- Strengthen empirical citations to address counter-arguments.\n- Formalize terminology in accordance with contemporary literature.`,
      creditProtected: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Academic AI failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
