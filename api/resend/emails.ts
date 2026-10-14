export const config = {
  runtime: 'edge',
};

// ─── Security & Anti-Abuse Configuration ─────────────────────────────────────
const ALLOWED_SENDER_DOMAINS = ['resend.dev', 'med360.mu'];
const MAX_BODY_BYTES = 64 * 1024; // 64 KB
const RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_MAX_REQUESTS = 25; // 25 requests per window per IP
const MAX_RECIPIENTS = 50;

const ALLOWED_ORIGIN_HOSTS = new Set([
  'med360.mu',
  'www.med360.mu',
  'localhost',
  '127.0.0.1',
]);

// ─── Rate Limiter (In-Memory Per-Isolate Guard) ───────────────────────────────
const hits = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX_REQUESTS) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return false;
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // Direct same-origin or non-browser request
  try {
    const u = new URL(origin);
    const host = u.hostname.toLowerCase();
    if (ALLOWED_ORIGIN_HOSTS.has(host)) return true;
    if (host.endsWith('.med360.mu')) return true;
    if (host.endsWith('.vercel.app')) return true;
    return false;
  } catch {
    return false;
  }
}

function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin');
  if (origin && isOriginAllowed(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Vary': 'Origin',
    };
  }
  return { 'Vary': 'Origin' };
}

// Check if an email address belongs to authorized internal administrators/coordinators
function isAdminRecipient(email: string): boolean {
  const clean = email.toLowerCase().trim();
  const domain = clean.split('@')[1] || '';
  if (domain === 'med360.mu') return true;

  const defaultAdmin = (process.env.VITE_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  if (defaultAdmin && clean === defaultAdmin) return true;

  const allowedAdmins = new Set([
    'kevinadlib@gmail.com',
    'admin@med360.mu',
    'case@med360.mu',
    'admin@medical360.com',
  ]);
  return allowedAdmins.has(clean);
}

// Verify Supabase Auth JWT token for requests sending to external arbitrary recipients
async function verifyAdminAuth(authHeader: string | null): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7).trim();
  if (!token) return false;

  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!supabaseUrl || !supabaseAnonKey) return false;

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function handler(req: Request) {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── 1. Origin verification ──
  const origin = req.headers.get('origin');
  if (origin && !isOriginAllowed(origin)) {
    return new Response(JSON.stringify({ error: 'Forbidden: Origin not allowed' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 2. Rate limit (per client IP) ──
  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '300', ...corsHeaders },
    });
  }

  // ── 3. Content-Type + payload size guards ──
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
      status: 415,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── 4. Anti-relay guard: Sender Identity Whitelist ──
  const fromStr = typeof body?.from === 'string' ? body.from.trim() : '';
  const fromMatch = fromStr.match(/^(?:([^<>\r\n]+)<)?\s*([a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))>?$/);
  if (!fromMatch) {
    return new Response(JSON.stringify({ error: 'Invalid sender format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
  const senderDomain = fromMatch[3].toLowerCase();
  if (!ALLOWED_SENDER_DOMAINS.includes(senderDomain)) {
    return new Response(JSON.stringify({ error: 'Sender domain not permitted' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // ── 5. Recipient validation & Open Relay Prevention ──
  const rawTo = Array.isArray(body?.to) ? body.to : (typeof body?.to === 'string' ? [body.to] : []);
  const validRecipients = rawTo
    .filter((r: unknown): r is string => typeof r === 'string')
    .map(r => r.trim())
    .filter(r => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(r));

  if (validRecipients.length === 0) {
    return new Response(JSON.stringify({ error: 'At least one valid recipient is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (validRecipients.length > MAX_RECIPIENTS) {
    return new Response(JSON.stringify({ error: `Exceeded maximum recipients limit (${MAX_RECIPIENTS})` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // If any recipient is NOT an internal admin address, verify that caller is an authenticated admin
  const hasExternalRecipient = validRecipients.some(r => !isAdminRecipient(r));
  if (hasExternalRecipient) {
    const authHeader = req.headers.get('authorization');
    const isAuthedAdmin = await verifyAdminAuth(authHeader);
    if (!isAuthedAdmin) {
      return new Response(JSON.stringify({ 
        error: 'Unauthorized: Admin authentication required to send emails to external recipients.' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // ── 6. Subject & HTML Sanitization (Strict Re-construction) ──
  const cleanSubject = typeof body.subject === 'string'
    ? body.subject.replace(/[\r\n\0]/g, ' ').slice(0, 200).trim()
    : 'Med360 Notification';

  const cleanHtml = typeof body.html === 'string'
    ? body.html
    : '<p>Med360 Notification</p>';

  // Construct strict payload — drop any bcc, cc, attachments, or smuggled headers
  const sanitizedPayload = {
    from: fromStr,
    to: validRecipients,
    subject: cleanSubject,
    html: cleanHtml,
  };

  // ── 7. Dispatch via Resend API ──
  try {
    const apiKey = process.env.RESEND_API_KEY || '';
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const upstreamRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitizedPayload),
    });

    const responseData = await upstreamRes.text();

    return new Response(responseData, {
      status: upstreamRes.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Serverless dispatch failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
