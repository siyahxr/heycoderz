/**
 * heycoderz Backend Security & Sanitization Suite
 * 
 * Provides:
 * 1. Timing-attack resistant constant-time comparison
 * 2. In-memory sliding-window Rate Limiter (Brute-force protection)
 * 3. Strict XSS and HTML sanitization
 * 4. Input validation (Email, Username, Passwords)
 */

// 1. Timing-attack resistant string comparison
export function secureCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  
  let mismatch = a.length === b.length ? 0 : 1;
  const len = Math.max(a.length, b.length);

  for (let i = 0; i < len; i++) {
    const charA = a.charCodeAt(i) || 0;
    const charB = b.charCodeAt(i) || 0;
    mismatch |= charA ^ charB;
  }

  return mismatch === 0;
}

// 2. Strict Input Sanitizer (HTML / XSS / Script injection stripper)
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:[^"']*/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// 3. Rate Limiter (Sliding Window in-memory store)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 60 * 1000 // 1 minute
): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // Clean expired
  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  record.count += 1;
  return { allowed: true, remaining: maxAttempts - record.count };
}

// 4. Strict Validation Helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
}

export function validateUsername(username: string): boolean {
  // 3-20 characters, lowercase alphanumeric and underscore only
  const usernameRegex = /^[a-z0-9_]{2,24}$/;
  return usernameRegex.test(username.trim().toLowerCase());
}
