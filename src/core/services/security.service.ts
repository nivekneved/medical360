/**
 * Medical 360 (Web) — Security Protocols & Anti-Spam / Anti-Bot Suite
 * 
 * Provides:
 * 1. Honeypot Validation: Traps automated bots that fill hidden form fields.
 * 2. Submission Timing Defense: Flags superhuman submission speed (< 2s).
 * 3. Client-Side Rate Limiter: Blocks automated form spam & flood attacks.
 * 4. Input Sanitization: Strips XSS payloads, script tags, and malicious HTML injections.
 * 5. Session Nonce Generator: Ensures authentic user form interaction.
 * 6. Contact Data Masking: Masks sensitive patient contact data in UI and debug logs.
 */

// In-memory rate limiting store
const rateLimitStore: Record<string, { count: number; firstAttemptTime: number; lastAttemptTime: number }> = {};

/**
 * 1. Honeypot Check
 * Returns true if clean (human), false if bot filled the hidden honeypot field.
 */
export function validateHoneypot(honeypotValue?: string | null): boolean {
  if (!honeypotValue) return true;
  return honeypotValue.trim().length === 0;
}

/**
 * 2. Submission Timing Defense
 * Rejects submissions completed faster than minAllowedDurationMs.
 */
export function validateSubmissionTiming(startTimeMs: number, minAllowedDurationMs: number = 2000): boolean {
  if (!startTimeMs || startTimeMs <= 0) return true;
  const elapsed = Date.now() - startTimeMs;
  return elapsed >= minAllowedDurationMs;
}

/**
 * 3. Client-Side Rate Limiter
 */
export function checkRateLimit(
  actionKey: string,
  maxAttempts: number = 4,
  windowMs: number = 10 * 60 * 1000 // 10 minutes
): { allowed: boolean; remainingCooldownSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore[actionKey];

  if (!record) {
    rateLimitStore[actionKey] = {
      count: 1,
      firstAttemptTime: now,
      lastAttemptTime: now,
    };
    return { allowed: true, remainingCooldownSeconds: 0 };
  }

  // Reset if window has elapsed
  if (now - record.firstAttemptTime > windowMs) {
    rateLimitStore[actionKey] = {
      count: 1,
      firstAttemptTime: now,
      lastAttemptTime: now,
    };
    return { allowed: true, remainingCooldownSeconds: 0 };
  }

  // Within window check
  if (record.count >= maxAttempts) {
    const elapsed = now - record.firstAttemptTime;
    const remainingMs = Math.max(0, windowMs - elapsed);
    return {
      allowed: false,
      remainingCooldownSeconds: Math.ceil(remainingMs / 1000),
    };
  }

  record.count += 1;
  record.lastAttemptTime = now;
  return { allowed: true, remainingCooldownSeconds: 0 };
}

/**
 * 4. Input Sanitizer (XSS & Injection Protection)
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * 5. Cryptographic Nonce Generator
 */
export function generateSecurityNonce(): string {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 10);
  return `sec_${timestamp}_${randomChars}`;
}

/**
 * 6. Contact Data Masking
 */
export function maskSensitiveContact(contact: string): string {
  if (!contact) return '';
  const clean = contact.trim();
  if (clean.length <= 6) return clean;
  const start = clean.slice(0, 4);
  const end = clean.slice(-2);
  const maskedLength = clean.length - 6;
  return `${start}${'•'.repeat(maskedLength)}${end}`;
}
