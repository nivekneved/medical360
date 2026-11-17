export const config = {
  runtime: 'edge',
};

const MAX_BODY_BYTES = 32 * 1024;
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
    if (host.startsWith('med360') && host.endsWith('.vercel.app')) return true;
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
  if (origin && !isOriginAllowed(origin)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
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

    // Persist batch to Supabase telemetry_events if configured
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

    if (supabaseUrl && supabaseKey && batch.length > 0) {
      const rows = batch
        .filter((ev: any) => typeof ev?.eventName === 'string' && ev.eventName.length > 0)
        .map((ev: any, idx: number) => ({
          id: `tel-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          event_name: String(ev.eventName).slice(0, 100),
          params: ev.params && typeof ev.params === 'object' ? ev.params : {},
          url: typeof ev.url === 'string' ? ev.url.slice(0, 300) : '',
          created_at: ev.timestamp || new Date().toISOString(),
        }));

      if (rows.length > 0) {
        await fetch(`${supabaseUrl}/rest/v1/telemetry_events`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
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
