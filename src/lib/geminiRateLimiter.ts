import fs from 'fs';
import path from 'path';

// Conservative thresholds strictly below Google AI Studio Free Tier (15 RPM / 1,500 RPD)
// to guarantee 0 credit consumption and 0 billing charges:
const MAX_RPM = 8;               // Google free tier is 15 RPM -> cap at 8
const MAX_DAILY_CALLS = 200;     // Google free tier is 1,500 RPD -> cap at 200
const MAX_PER_IP_RPM = 4;        // Per client/IP limit per minute
const CIRCUIT_BREAKER_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes cooldown on 429
const CACHE_TTL_MS = 60 * 60 * 1000;                // 1 hour response memoization cache

interface UsageFileSchema {
  date: string;
  dailyCount: number;
  totalCalls: number;
  lastUpdated: string;
}

const USAGE_FILE = path.join(process.cwd(), 'data', 'gemini-usage.json');

// In-memory sliding windows for instant, high-performance checks
const globalTimestamps: number[] = [];
const ipTimestamps: Map<string, number[]> = new Map();
const responseCache: Map<string, { response: string; expiresAt: number }> = new Map();

let circuitBreakerOpenUntil = 0;

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function readUsageData(): UsageFileSchema {
  const today = getTodayString();
  const defaultUsage: UsageFileSchema = {
    date: today,
    dailyCount: 0,
    totalCalls: 0,
    lastUpdated: new Date().toISOString(),
  };

  try {
    const dir = path.dirname(USAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(USAGE_FILE)) {
      fs.writeFileSync(USAGE_FILE, JSON.stringify(defaultUsage, null, 2), 'utf-8');
      return defaultUsage;
    }
    const raw = fs.readFileSync(USAGE_FILE, 'utf-8');
    const parsed: UsageFileSchema = JSON.parse(raw);
    
    // Reset if day has rolled over
    if (parsed.date !== today) {
      parsed.date = today;
      parsed.dailyCount = 0;
      parsed.lastUpdated = new Date().toISOString();
      fs.writeFileSync(USAGE_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch {
    return defaultUsage;
  }
}

function incrementUsageData(): UsageFileSchema {
  const usage = readUsageData();
  usage.dailyCount += 1;
  usage.totalCalls += 1;
  usage.lastUpdated = new Date().toISOString();
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist Gemini usage to file:', err);
  }
  return usage;
}

export interface RateLimitStatus {
  allowed: boolean;
  reason?: string;
  dailyRemaining: number;
  rpmRemaining: number;
  circuitBreakerActive: boolean;
}

/**
 * Checks whether an incoming Gemini API request is allowed under free tier budget.
 * If budget is exceeded or rate limit reached, returns allowed: false so the app
 * immediately uses deterministic fallback without touching Google Cloud billing.
 */
export function checkAndConsumeGeminiBudget(clientIp?: string): RateLimitStatus {
  const now = Date.now();

  // 1. Check Circuit Breaker
  if (now < circuitBreakerOpenUntil) {
    const waitSec = Math.ceil((circuitBreakerOpenUntil - now) / 1000);
    return {
      allowed: false,
      reason: `Gemini Circuit Breaker active to protect quota. Cooldown: ${waitSec}s remaining.`,
      dailyRemaining: 0,
      rpmRemaining: 0,
      circuitBreakerActive: true,
    };
  }

  // 2. Check Daily Free-Tier Cap
  const usage = readUsageData();
  if (usage.dailyCount >= MAX_DAILY_CALLS) {
    return {
      allowed: false,
      reason: `Daily free tier quota protection ceiling reached (${usage.dailyCount}/${MAX_DAILY_CALLS} calls today). Free mode preserved.`,
      dailyRemaining: 0,
      rpmRemaining: 0,
      circuitBreakerActive: false,
    };
  }

  // 3. Check Global Sliding-Window RPM (last 60s)
  const windowStart = now - 60 * 1000;
  while (globalTimestamps.length > 0 && globalTimestamps[0] < windowStart) {
    globalTimestamps.shift();
  }

  if (globalTimestamps.length >= MAX_RPM) {
    return {
      allowed: false,
      reason: `Global rate limit reached (${globalTimestamps.length}/${MAX_RPM} RPM ceiling). Using local intelligence to protect API credits.`,
      dailyRemaining: Math.max(0, MAX_DAILY_CALLS - usage.dailyCount),
      rpmRemaining: 0,
      circuitBreakerActive: false,
    };
  }

  // 4. Check Per-Client IP RPM
  if (clientIp) {
    const ipList = ipTimestamps.get(clientIp) || [];
    while (ipList.length > 0 && ipList[0] < windowStart) {
      ipList.shift();
    }
    if (ipList.length >= MAX_PER_IP_RPM) {
      return {
        allowed: false,
        reason: `Client request threshold reached (${ipList.length}/${MAX_PER_IP_RPM} RPM). Throttled to preserve free tier quota.`,
        dailyRemaining: Math.max(0, MAX_DAILY_CALLS - usage.dailyCount),
        rpmRemaining: Math.max(0, MAX_RPM - globalTimestamps.length),
        circuitBreakerActive: false,
      };
    }
    ipList.push(now);
    ipTimestamps.set(clientIp, ipList);
  }

  // Record allowed call
  globalTimestamps.push(now);
  const updatedUsage = incrementUsageData();

  return {
    allowed: true,
    dailyRemaining: Math.max(0, MAX_DAILY_CALLS - updatedUsage.dailyCount),
    rpmRemaining: Math.max(0, MAX_RPM - globalTimestamps.length),
    circuitBreakerActive: false,
  };
}

/**
 * Trip circuit breaker on HTTP 429 or quota errors to prevent credit burn.
 */
export function recordGeminiQuotaExceeded(): void {
  circuitBreakerOpenUntil = Date.now() + CIRCUIT_BREAKER_COOLDOWN_MS;
  console.warn(`[GEMINI RATE LIMITER] Circuit breaker tripped. All Gemini calls paused for ${CIRCUIT_BREAKER_COOLDOWN_MS / 1000}s to protect credit.`);
}

/**
 * Cache lookup to avoid duplicate calls for identical student prompts.
 */
export function getCachedGeminiResponse(cacheKey: string): string | null {
  const item = responseCache.get(cacheKey);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    responseCache.delete(cacheKey);
    return null;
  }
  return item.response;
}

/**
 * Store response in in-memory TTL cache.
 */
export function setCachedGeminiResponse(cacheKey: string, response: string): void {
  // Cap cache size at 500 items
  if (responseCache.size > 500) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }
  responseCache.set(cacheKey, {
    response,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}
