/**
 * Security & Anti-Abuse Shield for Araxie
 * Protects against prompt injection, XSS, malicious payloads, and brute-force attacks.
 */

// Sliding window in-memory rate limiter
interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitBuckets: Map<string, RateLimitEntry> = new Map();

// Known prompt injection and system override patterns
const PROMPT_INJECTION_PATTERNS = [
  /(ignore|disregard|forget)\s+(all\s+)?(previous|past|above|prior)\s+(instructions|prompts|rules|commands)/i,
  /(system\s+prompt|reveal\s+prompt|show\s+prompt|print\s+instructions)/i,
  /(expose|leak|show|print|output)\s+(api[\s_-]?key|secret|credential|token|env)/i,
  /(jailbreak|dan\s+mode|developer\s+mode|god\s+mode|unrestricted\s+mode)/i,
  /(pretend\s+you\s+have\s+no\s+(rules|guidelines|morals|limits))/i,
  /(you\s+are\s+now\s+an?\s+unfiltered|unrestricted\s+ai)/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /javascript\s*:/i,
  /data\s*:\s*text\/html/i,
  /onload\s*=|onerror\s*=/i,
];

/**
 * Sanitizes input text, removing dangerous HTML tags and script injections.
 */
export function sanitizeInput(input: unknown, maxLength: number = 500): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Strip null bytes and control characters
  let clean = input.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Strip HTML script and style blocks
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Strip basic HTML tags
  clean = clean.replace(/<[^>]+>/g, '');

  // Neutralize common XSS attributes
  clean = clean.replace(/javascript:/gi, '');
  clean = clean.replace(/vbscript:/gi, '');
  clean = clean.replace(/on\w+\s*=/gi, '');

  // Trim and enforce maximum length boundary
  clean = clean.trim();
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }

  return clean;
}

/**
 * Inspects an LLM prompt for prompt injection and role hijacking attempts.
 */
export function inspectPromptSecurity(prompt: string): {
  isSafe: boolean;
  sanitized: string;
  flaggedReason?: string;
} {
  const sanitized = sanitizeInput(prompt, 300);

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      console.warn(`[SECURITY] Prompt injection attempt blocked: pattern matched "${pattern.source}"`);
      return {
        isSafe: false,
        sanitized: 'Productivity and course study software',
        flaggedReason: 'Detected unauthorized prompt override instruction. Defaulted to safe query.',
      };
    }
  }

  return {
    isSafe: true,
    sanitized,
  };
}

/**
 * Rate limit check per IP and action bucket.
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): { limited: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = rateLimitBuckets.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitBuckets.set(key, entry);
  }

  // Clean expired timestamps
  entry.timestamps = entry.timestamps.filter(ts => ts > windowStart);

  if (entry.timestamps.length >= limit) {
    return {
      limited: true,
      remaining: 0,
    };
  }

  entry.timestamps.push(now);
  return {
    limited: false,
    remaining: limit - entry.timestamps.length,
  };
}

/**
 * Validates email formatting and rejects injection characters.
 */
export function validateEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}
