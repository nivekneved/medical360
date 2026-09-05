export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Handle incoming webhooks (from WhatsApp Business Cloud API / Twilio / Med360 client)
  if (req.method === 'POST') {
    try {
      const payload = await req.json();
      
      // Log received webhook payload in Edge console
      console.log('📥 Med360 WhatsApp Webhook Received:', JSON.stringify(payload, null, 2));

      // In production with Supabase/CRM, the payload is inserted into the real-time leads queue
      return new Response(JSON.stringify({ 
        success: true, 
        receivedAt: new Date().toISOString(),
        status: 'queued_for_coordinator',
        leadId: payload?.data?.id || `wa-${Date.now()}`
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || 'Webhook processing failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Handle webhook verification challenge (WhatsApp Cloud API standard challenge)
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === (process.env.WHATSAPP_VERIFY_TOKEN || 'med360_webhook_token')) {
      return new Response(challenge || 'VERIFIED', { status: 200 });
    }

    return new Response(JSON.stringify({ 
      service: 'Med360 WhatsApp Webhook Endpoint',
      status: 'active',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}
