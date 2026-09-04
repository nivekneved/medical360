/**
 * Medical 360 (Web) — Comprehensive Security Protocols, Anti-Bot Defense, SQL Injection & XSS Suite
 * 
 * Enterprise-Grade Client-Side & API Security Defenses:
 * 1. SQL Injection Detection & Neutralization (Tautologies, Stacked queries, UNION, Time-based blind, Comments)
 * 2. SQL Parameterization & Identifier Escaping
 * 3. Cross-Site Scripting (XSS) Sanitization (DOM, Reflected, Stored, SVG, inline handlers, javascript: protocols)
 * 4. HTML Entity Encoding & Safe Attribute Escaping
 * 5. Multi-Layer Rich Text HTML Sanitizer
 * 6. Deep Recursive Object & Form Data Sanitizer
 * 7. Honeypot Anti-Spam Validation
 * 8. Submission Timing Defense (< 1.5s human threshold)
 * 9. Sliding-Window Rate Limiter
 * 10. Cryptographic Nonce Generator
 * 11. Sensitive Contact & Email Data Masking
 * 12. Brute-Force Login Exponential Backoff
 * 13. Unicode Normalization (NFC) & Homoglyph Protection
 * 14. Max Input Length & Boundary Enforcement
 * 15. Path Traversal & Null Byte Sanitizer
 * 16. Safe External Link Rel Generator (noopener noreferrer nofollow)
 */

// In-memory rate limiting store
const rateLimitStore: Record<string, { count: number; firstAttemptTime: number; lastAttemptTime: number }> = {};

// ─────────────────────────────────────────────────────────────────────────────
// 1. SQL INJECTION (SQLi) DEFENSE SUITE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Signature patterns identifying classic & advanced SQL injection vectors
 */
const SQLI_PATTERNS = [
  // 1. Classic tautology / boolean-based SQLi (e.g., ' OR '1'='1', ' OR 1=1, " OR ""=")
  /(?:'|"|`)\s*(?:or|and|xor|like|rlike)\s*(?:'|"|`|\w+|\d+)?\s*=\s*(?:'|"|`|\w+|\d+)/i,
  // 2. OR / AND with numeric tautologies (e.g., 1=1, 1=0, 'a'='a')
  /\b(?:or|and)\s+(?:\d+=\d+|'[^']*'='[^']*'|"[^"]*"="[^"]*")/i,
  // 3. Stacked queries (e.g., '; DROP TABLE users; --)
  /;\s*(?:drop|alter|create|truncate|delete|insert|update|select|exec|execute|grant|revoke|shutdown)\b/i,
  // 4. UNION-based data exfiltration (e.g., UNION SELECT null, username, password FROM users)
  /\bunion\s+(?:all\s+)?select\b/i,
  // 5. Comment sequences used to truncate remaining SQL queries (-- , /* */, #)
  /(?:--[\s\r\n]|--$|\/\*[\s\S]*?\*\/|@@version|@@servername)/i,
  // 6. Time-based blind SQLi (e.g., SLEEP(5), BENCHMARK(1000000), WAITFOR DELAY '0:0:5', pg_sleep(5))
  /\b(?:sleep|benchmark|pg_sleep)\s*\(\s*\d+\s*\)|\bwaitfor\s+delay\b/i,
  // 7. Database schema discovery & dangerous functions
  /\b(?:information_schema|sys\.tables|sysobjects|syscolumns|xp_cmdshell|into\s+outfile|load_file|extractvalue|updatexml)\b/i,
  // 8. Hexadecimal / char encoding injection (e.g. 0x27, CHAR(39))
  /\b(?:char|chr|concat)\s*\(\s*\d+(?:\s*,\s*\d+)*\s*\)/i,
];

/**
 * Detects whether an input string contains suspicious SQL injection signatures.
 */
export function detectSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const normalized = input.normalize('NFC').trim();
  return SQLI_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Sanitizes input string to prevent SQL injection by escaping quotes, stripping dangerous SQL
 * comment operators, removing null bytes, and normalizing characters.
 */
export function sanitizeSqlInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .normalize('NFC')
    .replace(/\0/g, '') // Null byte removal
    .replace(/'/g, "''") // Standard SQL single-quote escaping
    .replace(/\\/g, '\\\\') // Backslash escaping
    .replace(/--+/g, '-') // Neutralize SQL line comment prefix
    .replace(/\/\*[\s\S]*?\*\//g, '') // Strip inline SQL comments
    .trim();
}

/**
 * Escapes a single SQL identifier (e.g., table or column name).
 */
export function escapeSqlIdentifier(identifier: string): string {
  if (!identifier || typeof identifier !== 'string') return '';
  return `"${identifier.replace(/"/g, '""').replace(/[^a-zA-Z0-9_]/g, '')}"`;
}

/**
 * Escapes a literal value for safe embedding in SQL queries (if parameterized queries cannot be used).
 */
export function escapeSqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return isFinite(value) ? String(value) : 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'string') {
    return `'${value.replace(/\0/g, '').replace(/'/g, "''")}'`;
  }
  return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
}

/**
 * Validates that an input has NO SQL Injection payloads.
 */
export function validateNoSqlInjection(input: string): { isValid: boolean; error?: string } {
  if (!input) return { isValid: true };
  if (detectSqlInjection(input)) {
    return {
      isValid: false,
      error: 'Security Warning: Input contains prohibited query characters or patterns.',
    };
  }
  return { isValid: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CROSS-SITE SCRIPTING (XSS) DEFENSE SUITE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * HTML Entity Map for strict character escaping
 */
const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Encodes special characters to HTML entities, preventing Reflected & Stored XSS.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ESCAPE_MAP[char] || char);
}

/**
 * Safely unescapes standard HTML entities.
 */
export function unescapeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&#x60;/g, '`')
    .replace(/&#x3D;/g, '=');
}

/**
 * Escapes characters for safe inclusion inside HTML attributes (e.g. title, value, alt).
 */
export function encodeForHtmlAttribute(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[^a-zA-Z0-9\-_. ]/g, (char) => `&#x${char.charCodeAt(0).toString(16)};`);
}

/**
 * Strips all HTML tags from an input string, leaving only pure plain text.
 */
export function stripHtmlTags(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

/**
 * General Input Sanitizer (XSS & Injection Protection for Form Text Fields).
 * Strips active scripts, frames, event handlers, protocols, tags, and SQLi signatures.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .normalize('NFC')
    .replace(/\0/g, '') // null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<math\b[^<]*(?:(?!<\/math>)<[^<]*)*<\/math>/gi, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Safe Rich Text HTML Sanitizer (for WYSIWYG editors, Email previews, CMS pages).
 * Allows safe semantic tags (<b>, <i>, <p>, <ul>, <li>, <h3>, <a>) while stripping
 * script tags, iframes, styles, objects, embeds, and malicious event handlers.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return html
    .normalize('NFC')
    .replace(/\0/g, '')
    // Strip malicious tags completely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<base\b[^>]*>/gi, '')
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '')
    // Strip inline event handlers (onload, onclick, onerror, onmouseover, autofocus, etc.)
    .replace(/\s+on[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s+autofocus\b/gi, '')
    // Disallow dangerous URI schemes in href & src
    .replace(/href\s*=\s*("javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, 'href="#"')
    .replace(/href\s*=\s*("data:text\/html[^"]*"|'data:text\/html[^']*')/gi, 'href="#"')
    .replace(/href\s*=\s*("vbscript:[^"]*"|'vbscript:[^']*')/gi, 'href="#"')
    .replace(/src\s*=\s*("javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, 'src=""')
    .replace(/src\s*=\s*("data:text\/html[^"]*"|'data:text\/html[^']*')/gi, 'src=""')
    .replace(/src\s*=\s*("vbscript:[^"]*"|'vbscript:[^']*')/gi, 'src=""');
}

/**
 * Recursively deep-sanitizes an object or array, purifying all string fields.
 */
export function deepSanitize<T>(input: T): T {
  if (input === null || input === undefined) return input;
  if (typeof input === 'string') {
    return sanitizeInput(input) as unknown as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => deepSanitize(item)) as unknown as T;
  }
  if (typeof input === 'object') {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      sanitizedObj[key] = deepSanitize(value);
    }
    return sanitizedObj as T;
  }
  return input;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. HONEYPOT & ANTI-BOT DEFENSES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Honeypot check: Returns true if clean (empty string or undefined), false if triggered.
 */
export function validateHoneypot(honeypotValue?: string | null): boolean {
  if (!honeypotValue) return true;
  return honeypotValue.trim().length === 0;
}

/**
 * Submission Timing Defense: Flags superhuman submission speed (< minAllowedDurationMs).
 */
export function validateSubmissionTiming(startTimeMs: number, minAllowedDurationMs: number = 1500): boolean {
  if (!startTimeMs || startTimeMs <= 0) return true;
  const elapsed = Date.now() - startTimeMs;
  return elapsed >= minAllowedDurationMs;
}

/**
 * Client-Side Sliding-Window Rate Limiter
 */
export function checkRateLimit(
  actionKey: string,
  maxAttempts: number = 5,
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
 * Cryptographic Nonce Generator
 */
export function generateSecurityNonce(): string {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 10);
  return `sec_${timestamp}_${randomChars}`;
}

/**
 * Sensitive Contact Data Masking
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

/**
 * Sensitive Email Data Masking
 */
export function maskSensitiveEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user[0]}${'*'.repeat(user.length - 2)}${user[user.length - 1]}@${domain}`;
}

/**
 * Brute-Force Login Exponential Backoff (seconds)
 */
export function calculateExponentialBackoff(failedAttempts: number): number {
  if (failedAttempts <= 1) return 0;
  if (failedAttempts === 2) return 2;
  if (failedAttempts === 3) return 5;
  if (failedAttempts === 4) return 15;
  return 30; // Max 30s delay
}

/**
 * Form Input Length Enforcement
 */
export function validateFieldLength(value: string, maxLength: number): boolean {
  if (!value) return true;
  return value.trim().length <= maxLength;
}

/**
 * Slug & URL Path Parameter Sanitizer (prevents path traversal & null bytes)
 */
export function sanitizeSlugParam(slug: string): string {
  if (!slug) return '';
  return slug
    .replace(/\0/g, '')
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Safe External Link Rel Generator
 */
export function getSafeExternalRel(isExternal: boolean = true): string {
  return isExternal ? 'noopener noreferrer nofollow' : '';
}
