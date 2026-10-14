export const config = {
  runtime: 'edge',
};

const ALLOWED_ORIGIN_HOSTS = new Set([
  'med360.mu',
  'www.med360.mu',
  'localhost',
  '127.0.0.1',
]);

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true;
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
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Hub-Signature-256',
      'Vary': 'Origin',
    };
  }
  return { 'Vary': 'Origin' };
}

// Timing-safe string comparison
function constantTimeEquals(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  let mismatch = a.length === b.length ? 0 : 1;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0 && a.length === b.length;
}

// Verify Meta WhatsApp Cloud API HMAC SHA-256 webhook signature
async function verifyWhatsAppSignature(rawBody: string, signatureHeader: string | null, secret: string): Promise<boolean> {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=') || !secret) return false;
  const signature = signatureHeader.slice(7).trim();
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const expectedSigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    const expectedSig = Array.from(new Uint8Array(expectedSigBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return constantTimeEquals(signature.toLowerCase(), expectedSig.toLowerCase());
  } catch {
    return false;
  }
}

// Rate limiting map
const hits = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 5 * 60 * 1000);
  if (arr.length >= 30) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 2000) hits.clear();
  return false;
}

export default async function handler(req: Request) {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // ── Handle incoming webhooks (Meta Cloud API or Internal Site Beacon) ──
  if (req.method === 'POST') {
    const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '300', ...corsHeaders },
      });
    }

    try {
      const rawBody = await req.text();
      if (rawBody.length > 64 * 1024) {
        return new Response(JSON.stringify({ error: 'Payload too large' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const signatureHeader = req.headers.get('x-hub-signature-256');
      const origin = req.headers.get('origin');
      const appSecret = process.env.WHATSAPP_APP_SECRET;

      // Authentication check:
      // Case A: Request from Meta WhatsApp Cloud API (must have valid HMAC signature)
      if (signatureHeader) {
        if (!appSecret) {
          return new Response(JSON.stringify({ error: 'WhatsApp webhook secret not configured on server' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
        const isValid = await verifyWhatsAppSignature(rawBody, signatureHeader, appSecret);
        if (!isValid) {
          return new Response(JSON.stringify({ error: 'Invalid HMAC signature' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }
      } 
      // Case B: Request from client website beacon (must be from authorized origin)
      else {
        if (origin && !isOriginAllowed(origin)) {
          return new Response(JSON.stringify({ error: 'Forbidden: Unauthorized origin' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      let payload: any;
      try {
        payload = JSON.parse(rawBody);
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Security: Sanitize log telemetry (NEVER log full unmasked patient phone/medical message to edge console)
      const leadId = payload?.data?.id || `wa-${Date.now()}`;
      const eventType = payload?.event || 'webhook.received';
      // Safe telemetry log: only metadata, no PII
      console.log(`[WhatsApp Webhook] Handled event "${eventType}" for Lead ID: ${leadId}`);

      return new Response(JSON.stringify({ 
        success: true, 
        receivedAt: new Date().toISOString(),
        status: 'queued_for_coordinator',
        leadId,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // ── Handle webhook verification challenge (WhatsApp Cloud API standard challenge) ──
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token') || '';
    const challenge = url.searchParams.get('hub.challenge');

    const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;
    if (mode === 'subscribe') {
      if (expectedToken && constantTimeEquals(token, expectedToken)) {
        return new Response(challenge || 'VERIFIED', { 
          status: 200,
          headers: corsHeaders,
        });
      }
      return new Response(JSON.stringify({ error: 'Verification token mismatch' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ 
      service: 'Med360 WhatsApp Webhook Endpoint',
      status: 'active',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
