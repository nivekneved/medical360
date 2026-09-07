export const config = {
  runtime: 'edge',
};

// ─── Anti-abuse configuration ────────────────────────────────────────────────
// Only Med360-controlled sender identities may be relayed through this
// endpoint. Once the med360.mu domain is verified in Resend, switch client
// senders to e.g. "Med360 <notifications@med360.mu>".
const ALLOWED_SENDER_DOMAINS = ['resend.dev', 'med360.mu'];
const MAX_BODY_BYTES = 64 * 1024; // 64 KB — inquiry/campaign payloads are far smaller
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX_REQUESTS = 20;

// Best-effort per-isolate rate limiting (Vercel Edge). Primary DoS protection
// is provided at the platform level; this throttles abusive loops.
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
  if (hits.size > 5000) hits.clear(); // crude memory guard
  return false;
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Rate limit (per client IP) ──
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '300' },
    });
  }

  // ── Content-Type + payload size guards ──
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
      status: 415,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: 'Payload too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Anti-relay guard: only Med360 sender identities are permitted ──
  const from = typeof body?.from === 'string' ? body.from : '';
  const domainMatch = from.match(/@([A-Za-z0-9.\-]+)>?\s*$/);
  const senderDomain = domainMatch ? domainMatch[1].toLowerCase() : '';
  if (!ALLOWED_SENDER_DOMAINS.includes(senderDomain)) {
    return new Response(JSON.stringify({ error: 'Sender domain not permitted' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('authorization') || '';
    const apiKey = process.env.RESEND_API_KEY || (authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : '');

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Resend API key missing' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const upstreamRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: raw,
    });

    const responseData = await upstreamRes.text();

    return new Response(responseData, {
      status: upstreamRes.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Serverless dispatch failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

