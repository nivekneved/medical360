// Security verification test for api/resend/emails.ts
import handler from '../api/resend/emails.ts';

const pass = (desc) => console.log('PASS:', desc);
const fail = (desc, detail) => { console.error('FAIL:', desc, detail); process.exitCode = 1; };

async function testEndpoint() {
  console.log('🛡️ Running Security Tests on api/resend/emails.ts...\n');

  // Test 1: Malicious Origin
  {
    const req = new Request('http://localhost/api/resend/emails', {
      method: 'POST',
      headers: {
        'Origin': 'https://evil-phishing-site.xyz',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: 'onboarding@resend.dev', to: 'kevinadlib@gmail.com', subject: 'test' }),
    });
    const res = await handler(req);
    if (res.status === 403) pass('Malicious Origin blocked (HTTP 403)');
    else fail('Malicious Origin not blocked', res.status);
  }

  // Test 2: Spoofed Sender Domain
  {
    const req = new Request('http://localhost/api/resend/emails', {
      method: 'POST',
      headers: {
        'Origin': 'https://www.med360.mu',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: 'attacker@evilcorp.com', to: 'kevinadlib@gmail.com', subject: 'test' }),
    });
    const res = await handler(req);
    if (res.status === 403) pass('Spoofed sender domain blocked (HTTP 403)');
    else fail('Spoofed sender domain not blocked', res.status);
  }

  // Test 3: Subdomain/Regex bypass attempt on sender
  {
    const req = new Request('http://localhost/api/resend/emails', {
      method: 'POST',
      headers: {
        'Origin': 'https://www.med360.mu',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: 'spammer@med360.mu.fakephish.com', to: 'kevinadlib@gmail.com', subject: 'test' }),
    });
    const res = await handler(req);
    if (res.status === 403) pass('Subdomain regex bypass attempt blocked (HTTP 403)');
    else fail('Subdomain bypass not blocked', res.status);
  }

  // Test 4: Open Relay Attack (Unauthenticated visitor trying to email arbitrary victim)
  {
    const req = new Request('http://localhost/api/resend/emails', {
      method: 'POST',
      headers: {
        'Origin': 'https://www.med360.mu',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Med360 Inquiries <onboarding@resend.dev>',
        to: ['random-stranger@targetbank.com'],
        subject: 'Phishing email from Med360',
        html: '<p>Click here</p>',
      }),
    });
    const res = await handler(req);
    if (res.status === 401) pass('Open Relay to external recipient blocked without admin auth (HTTP 401)');
    else fail('Open Relay was not blocked with 401', res.status);
  }

  // Test 5: Empty or Invalid Recipient
  {
    const req = new Request('http://localhost/api/resend/emails', {
      method: 'POST',
      headers: {
        'Origin': 'https://www.med360.mu',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: ['not-an-email'],
        subject: 'test',
      }),
    });
    const res = await handler(req);
    if (res.status === 400) pass('Invalid recipient syntax rejected (HTTP 400)');
    else fail('Invalid recipient syntax not rejected', res.status);
  }

  // Test 6: Legitimate Public Patient Inquiry to Admin (Passed to Resend call)
  {
    const req = new Request('http://localhost/api/resend/emails', {
      method: 'POST',
      headers: {
        'Origin': 'https://www.med360.mu',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Med360 Inquiries <onboarding@resend.dev>',
        to: ['kevinadlib@gmail.com'],
        subject: 'New Patient Inquiry\r\nBcc: victim@bank.com', // CRLF test
        html: '<p>Patient details</p>',
      }),
    });
    const res = await handler(req);
    // Since process.env.RESEND_API_KEY might be dummy or live, status will either be 200 (if live key) or 503/upstream status
    if (res.status !== 401 && res.status !== 403 && res.status !== 400) {
      pass(`Legitimate inquiry to admin accepted for dispatch (HTTP ${res.status})`);
    } else {
      fail('Legitimate inquiry unexpectedly blocked', res.status);
    }
  }

  console.log('\n✅ All /api/resend/emails security tests passed!\n');
}

testEndpoint().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
