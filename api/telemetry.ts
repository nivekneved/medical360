export const config = {
  runtime: 'edge',
};

const MAX_BODY_BYTES = 32 * 1024;
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_MAX_REQUESTS = 20;
const ALLOWED_ORIGIN_HOSTS = new Set([
  'med360.mu',
  'www.med360.mu',
  'localhost',
  '127.0.0.1',
]);

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
  if (hits.size > 3000) hits.clear();
  return false;
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    const host = u.hostname.toLowerCase();
    if (ALLOWED_ORIGIN_HOSTS.has(host)) return true;
    if (host.endsWith('.med360.mu')) return true;
    const vercelHost = (process.env.VERCEL_URL || '').toLowerCase().trim();
    const vercelBranchHost = (process.env.VERCEL_BRANCH_URL || '').toLowerCase().trim();
    if (vercelHost && host === vercelHost) return true;
    if (vercelBranchHost && host === vercelBranchHost) return true;
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
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
  }
  return { 'Vary': 'Origin' };
}

export default async function handler(req: Request) {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const origin = req.headers.get('origin');
  if (!origin || !isOriginAllowed(origin)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '300', ...corsHeaders },
    });
  }

  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
      status: 415,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: 'Payload too large' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const body = JSON.parse(raw);
    const batch = Array.isArray(body?.batch) ? body.batch.slice(0, 50) : [];

    // Persist batch to Neon Data API (default) or Supabase telemetry_events fallback
    const neonDataApiUrl = (process.env.VITE_NEON_DATA_API_URL || '').trim();
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

    if ((neonDataApiUrl || (supabaseUrl && supabaseKey)) && batch.length > 0) {
      const rows = batch
        .filter((ev: any) => typeof ev?.eventName === 'string' && ev.eventName.length > 0)
        .map((ev: any) => {
          const safeParams = ev.params && typeof ev.params === 'object' ? ev.params : {};
          const serializedParams = JSON.stringify(safeParams);
          return {
            id: `tel-${crypto.randomUUID()}`,
            event_name: String(ev.eventName).slice(0, 100),
            params: serializedParams.length <= 2048 ? safeParams : {},
            url: typeof ev.url === 'string' ? ev.url.slice(0, 300) : '',
            created_at: ev.timestamp || new Date().toISOString(),
          };
        });

      if (rows.length > 0) {
        const targetUrl = neonDataApiUrl
          ? `${neonDataApiUrl.replace(/\/$/, '')}/telemetry_events`
          : `${supabaseUrl}/rest/v1/telemetry_events`;
        const targetHeaders: Record<string, string> = neonDataApiUrl
          ? {
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            }
          : {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            };
        await fetch(targetUrl, {
          method: 'POST',
          headers: targetHeaders,
          body: JSON.stringify(rows),
        }).catch(() => {});
      }
    }

    return new Response(JSON.stringify({ success: true, accepted: batch.length }), {
      status: 202,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid telemetry payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
