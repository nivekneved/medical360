export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  addedAt: string;
}

export interface AudienceList {
  id: string;
  name: string;
  description: string;
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignTemplate {
  bannerTitle: string;
  bannerBg: string;
  bannerTextColor: string;
  headline: string;
  introText: string;
  heroImageUrl?: string;
  bulletPoints: string[];
  ctaText: string;
  ctaUrl: string;
  ctaBgColor: string;
  showWhatsAppButton: boolean;
  whatsAppText?: string;
  showFooter: boolean;
  footerNote: string;
}

export interface Campaign {
  id: string;
  title: string;
  subject: string;
  preheader: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  audienceId: string;
  audienceName: string;
  recipientCount: number;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  createdAt: string;
  sentAt?: string;
  template: CampaignTemplate;
}

const STORAGE_KEY_CAMPAIGNS = 'med360_campaigns_v1';
const STORAGE_KEY_AUDIENCES = 'med360_audiences_v1';

// ─── Default Initial Seed Data ────────────────────────────────────────────────
const INITIAL_AUDIENCES: AudienceList[] = [
  {
    id: 'aud-all-inquiries',
    name: 'All Patient Inquiries (Regional)',
    description: 'Active inquiries and prospective patients from Mauritius, Réunion, and Seychelles.',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-20T14:30:00.000Z',
    contacts: [
      { id: 'c1', name: 'Rajesh Ramkhelawon', email: 'rajesh.r@example.mu', phone: '+230 5918 8275', country: 'Mauritius', addedAt: '2026-08-01T10:00:00.000Z' },
      { id: 'c2', name: 'Ananya Patel', email: 'ananya.patel@example.mu', phone: '+230 5723 4410', country: 'Mauritius', addedAt: '2026-08-03T11:20:00.000Z' },
      { id: 'c3', name: 'Jean-Luc Marie', email: 'jeanluc.marie@example.mu', phone: '+230 5255 1199', country: 'Mauritius', addedAt: '2026-08-05T09:15:00.000Z' },
      { id: 'c4', name: 'Sophie Dupont', email: 's.dupont@example.re', phone: '+262 692 123456', country: 'Réunion Island', addedAt: '2026-08-08T15:40:00.000Z' },
      { id: 'c5', name: 'Kevin Adlib', email: 'kevinadlib@gmail.com', phone: '+230 5918 8275', country: 'Mauritius', addedAt: '2026-08-10T12:00:00.000Z' },
      { id: 'c6', name: 'Farhad Goolam', email: 'farhad.g@example.com', phone: '+230 5811 0022', country: 'Mauritius', addedAt: '2026-08-12T16:10:00.000Z' },
      { id: 'c7', name: 'Devika Seeboo', email: 'devika.s@example.mu', phone: '+230 5700 8899', country: 'Mauritius', addedAt: '2026-08-14T08:30:00.000Z' },
      { id: 'c8', name: 'Marc Fontaine', email: 'm.fontaine@example.re', phone: '+262 693 456789', country: 'Réunion Island', addedAt: '2026-08-18T10:45:00.000Z' },
    ],
  },
  {
    id: 'aud-cardio-surgery',
    name: 'Cardiology & Cardiac Surgery Leads',
    description: 'Patients seeking heart valve surgery, CABG, and advanced cardiology treatments.',
    createdAt: '2026-08-05T14:00:00.000Z',
    updatedAt: '2026-08-22T09:00:00.000Z',
    contacts: [
      { id: 'c1', name: 'Rajesh Ramkhelawon', email: 'rajesh.r@example.mu', phone: '+230 5918 8275', country: 'Mauritius', addedAt: '2026-08-01T10:00:00.000Z' },
      { id: 'c3', name: 'Jean-Luc Marie', email: 'jeanluc.marie@example.mu', phone: '+230 5255 1199', country: 'Mauritius', addedAt: '2026-08-05T09:15:00.000Z' },
      { id: 'c5', name: 'Kevin Adlib', email: 'kevinadlib@gmail.com', phone: '+230 5918 8275', country: 'Mauritius', addedAt: '2026-08-10T12:00:00.000Z' },
    ],
  },
  {
    id: 'aud-newsletter',
    name: 'Health & Medical Tourism Subscribers',
    description: 'Monthly medical insights and international healthcare updates subscribers.',
    createdAt: '2026-08-02T11:00:00.000Z',
    updatedAt: '2026-08-25T17:00:00.000Z',
    contacts: [
      { id: 'c2', name: 'Ananya Patel', email: 'ananya.patel@example.mu', phone: '+230 5723 4410', country: 'Mauritius', addedAt: '2026-08-03T11:20:00.000Z' },
      { id: 'c4', name: 'Sophie Dupont', email: 's.dupont@example.re', phone: '+262 692 123456', country: 'Réunion Island', addedAt: '2026-08-08T15:40:00.000Z' },
      { id: 'c5', name: 'Kevin Adlib', email: 'kevinadlib@gmail.com', phone: '+230 5918 8275', country: 'Mauritius', addedAt: '2026-08-10T12:00:00.000Z' },
      { id: 'c6', name: 'Farhad Goolam', email: 'farhad.g@example.com', phone: '+230 5811 0022', country: 'Mauritius', addedAt: '2026-08-12T16:10:00.000Z' },
    ],
  },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-second-opinion-week',
    title: '🌟 Free Second Opinion Week - India & Thailand Specialists',
    subject: 'Get a Free Second Medical Opinion from Top International Hospitals',
    preheader: 'Medical360 connects you with leading cardiac & orthopedic surgeons this month.',
    status: 'sent',
    audienceId: 'aud-all-inquiries',
    audienceName: 'All Patient Inquiries (Regional)',
    recipientCount: 8,
    sentCount: 8,
    openedCount: 6,
    clickedCount: 4,
    createdAt: '2026-08-15T09:00:00.000Z',
    sentAt: '2026-08-16T10:30:00.000Z',
    template: {
      bannerTitle: 'International Healthcare Concierge',
      bannerBg: '#090d10',
      bannerTextColor: '#ffffff',
      headline: 'Special Focus: Complimentary Medical Second Opinions',
      introText: 'Dear {{name}},\n\nIf you or your loved ones are considering specialized medical treatment abroad, Medical360 is offering complimentary dossier evaluations with senior department heads in Apollo Hospitals (India) and Bumrungrad International (Thailand).',
      heroImageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      bulletPoints: [
        'Direct case review by accredited specialist doctors',
        'Transparent procedure cost estimates within 48 hours',
        'Full medical visa and flight concierge assistance',
        'Zero fee for patients — 100% complimentary service',
      ],
      ctaText: 'Request Your Free Doctor Review',
      ctaUrl: 'https://med360.mu/describe-need',
      ctaBgColor: '#065f46',
      showWhatsAppButton: true,
      whatsAppText: 'Chat on WhatsApp (+230 59188275)',
      showFooter: true,
      footerNote: 'You received this email because you registered on Medical360 Mauritius. Strict medical privacy upheld.',
    },
  },
  {
    id: 'cmp-robotic-surgery-guide',
    title: '🤖 Robotic Joint Replacement & Minimally Invasive Surgery Guide',
    subject: 'Faster Recovery: How Robotic Knee & Hip Surgery Works',
    preheader: 'Discover the latest surgical advancements with our accredited partner hospitals.',
    status: 'sent',
    audienceId: 'aud-cardio-surgery',
    audienceName: 'Cardiology & Cardiac Surgery Leads',
    recipientCount: 3,
    sentCount: 3,
    openedCount: 3,
    clickedCount: 2,
    createdAt: '2026-08-18T14:00:00.000Z',
    sentAt: '2026-08-19T08:15:00.000Z',
    template: {
      bannerTitle: 'Medical360 • Clinical Excellence Series',
      bannerBg: '#065f46',
      bannerTextColor: '#ffffff',
      headline: 'Robotic Precision & Faster Post-Operative Mobility',
      introText: 'Hello {{name}},\n\nRobotic-assisted surgery allows for millimeter-level precision, less tissue trauma, and up to 50% faster recovery times for orthopedic procedures. Learn what makes it the gold standard.',
      heroImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      bulletPoints: [
        'Sub-millimeter implant alignment accuracy',
        'Reduced post-operative pain and hospital stay duration',
        'Available in certified Centers of Excellence in India & UAE',
      ],
      ctaText: 'Calculate Estimated Surgery Costs',
      ctaUrl: 'https://med360.mu/cost-calculator',
      ctaBgColor: '#059669',
      showWhatsAppButton: true,
      whatsAppText: 'Ask Our Case Manager on WhatsApp',
      showFooter: true,
      footerNote: 'Medical360 Healthcare Services • Port Louis, Mauritius',
    },
  },
  {
    id: 'cmp-visa-travel-update',
    title: '✈️ 2026 Medical Visa & Concierge Travel Update',
    subject: 'Seamless Medical Travel from Mauritius: Fast-Track Medical Visas',
    preheader: 'Complete travel guide, attendant visas, and airport transfer services.',
    status: 'draft',
    audienceId: 'aud-newsletter',
    audienceName: 'Health & Medical Tourism Subscribers',
    recipientCount: 4,
    sentCount: 0,
    openedCount: 0,
    clickedCount: 0,
    createdAt: '2026-08-24T11:00:00.000Z',
    template: {
      bannerTitle: 'Medical360 • Travel & Concierge Advisory',
      bannerBg: '#1e1b4b',
      bannerTextColor: '#ffffff',
      headline: 'Fast-Track Medical Visas & Complete Travel Concierge',
      introText: 'Dear {{name}},\n\nTraveling for healthcare should be stress-free. Medical360 provides end-to-end support including urgent embassy hospital invitation letters, attendant visa facilitation, and airport ambulances.',
      heroImageUrl: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
      bulletPoints: [
        'Priority Medical Visa invitation letters issued within 24 hours',
        'Dedicated VIP airport pickup & bilingual patient coordinator',
        'Special hotel and serviced apartment partner rates for families',
      ],
      ctaText: 'Read Our Complete Medical Visa Guide',
      ctaUrl: 'https://med360.mu/visa-guide',
      ctaBgColor: '#4f46e5',
      showWhatsAppButton: true,
      whatsAppText: 'Speak to our Travel Coordinator',
      showFooter: true,
      footerNote: 'Medical360 Ltd • Port Louis, Mauritius',
    },
  },
];

// ─── Data Access Helpers ──────────────────────────────────────────────────────
export function getCampaigns(): Campaign[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load campaigns:', err);
  }
  return INITIAL_CAMPAIGNS;
}

export function saveCampaign(campaign: Campaign): Campaign[] {
  const current = getCampaigns();
  const idx = current.findIndex(c => c.id === campaign.id);
  let updated: Campaign[];
  if (idx !== -1) {
    updated = [...current];
    updated[idx] = campaign;
  } else {
    updated = [campaign, ...current];
  }
  try {
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save campaign:', err);
  }
  return updated;
}

export function deleteCampaign(id: string): Campaign[] {
  const current = getCampaigns();
  const updated = current.filter(c => c.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to delete campaign:', err);
  }
  return updated;
}

export function getAudiences(): AudienceList[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIENCES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load audiences:', err);
  }
  return INITIAL_AUDIENCES;
}

export function saveAudience(audience: AudienceList): AudienceList[] {
  const current = getAudiences();
  const idx = current.findIndex(a => a.id === audience.id);
  let updated: AudienceList[];
  if (idx !== -1) {
    updated = [...current];
    updated[idx] = { ...audience, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...audience, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...current];
  }
  try {
    localStorage.setItem(STORAGE_KEY_AUDIENCES, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save audience:', err);
  }
  return updated;
}

export function deleteAudience(id: string): AudienceList[] {
  const current = getAudiences();
  const updated = current.filter(a => a.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_AUDIENCES, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to delete audience:', err);
  }
  return updated;
}

// ─── CSV Parser Helper ────────────────────────────────────────────────────────
export function parseCSVContacts(csvText: string): Contact[] {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const headerLine = lines[0].toLowerCase();
  const hasHeader = headerLine.includes('email') || headerLine.includes('name');
  
  let emailIdx = 0;
  let nameIdx = 1;
  let phoneIdx = -1;
  let countryIdx = -1;

  const startIndex = hasHeader ? 1 : 0;

  if (hasHeader) {
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    emailIdx = headers.findIndex(h => h.includes('email'));
    nameIdx = headers.findIndex(h => h.includes('name'));
    phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('whatsapp'));
    countryIdx = headers.findIndex(h => h.includes('country') || h.includes('pays') || h.includes('location'));
  }

  const contacts: Contact[] = [];
  const seenEmails = new Set<string>();

  for (let i = startIndex; i < lines.length; i++) {
    const parts = lines[i].split(',').map(p => p.trim().replace(/^['"]|['"]$/g, ''));
    let email = emailIdx !== -1 && parts[emailIdx] ? parts[emailIdx] : parts.find(p => p.includes('@'));
    if (email && email.includes('@')) {
      const cleanEmail = email.toLowerCase().trim();
      if (!seenEmails.has(cleanEmail)) {
        seenEmails.add(cleanEmail);
        contacts.push({
          id: 'cnt-' + Math.random().toString(36).substr(2, 9),
          email: cleanEmail,
          name: nameIdx !== -1 && parts[nameIdx] ? parts[nameIdx] : cleanEmail.split('@')[0],
          phone: phoneIdx !== -1 && parts[phoneIdx] ? parts[phoneIdx] : '',
          country: countryIdx !== -1 && parts[countryIdx] ? parts[countryIdx] : 'Mauritius',
          addedAt: new Date().toISOString(),
        });
      }
    }
  }
  return contacts;
}

// ─── Campaign HTML Generator ──────────────────────────────────────────────────
export function renderCampaignHtml(campaign: Campaign, contact: Partial<Contact>): string {
  const name = contact.name || 'Valued Patient';
  const country = contact.country || 'Mauritius';
  const t = campaign.template;

  const introText = (t.introText || '')
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{country\}\}/g, country)
    .replace(/\n/g, '<br/>');

  const bulletsHtml = (t.bulletPoints || [])
    .filter(Boolean)
    .map(b => `<li style="margin-bottom: 8px; color: #334155; font-size: 14px; line-height: 1.5;">${b}</li>`)
    .join('');

  return `
    <div style="background-color: #f1f5f9; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        
        <!-- Header Banner with Official Medical360 Logo -->
        <div style="background-color: ${t.bannerBg}; color: ${t.bannerTextColor}; padding: 20px 24px; text-align: left;">
          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
            <tr>
              <td style="vertical-align: middle;">
                <img src="https://medical360-zeta.vercel.app/assets/logo.png" alt="Medical 360" height="32" style="height: 32px; max-width: 150px; display: block; border: 0;" />
              </td>
            </tr>
          </table>
          <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: ${t.bannerTextColor}; font-family: 'Outfit', 'Inter', -apple-system, sans-serif; opacity: 0.95;">
            ${t.bannerTitle}
          </h3>
        </div>

        ${t.heroImageUrl ? `
          <div>
            <img src="${t.heroImageUrl}" alt="Hero" style="width: 100%; height: 220px; object-fit: cover; display: block;" />
          </div>
        ` : ''}

        <!-- Main Body -->
        <div style="padding: 24px;">
          <h2 style="margin: 0 0 14px 0; font-size: 20px; font-weight: 800; color: #0f172a; line-height: 1.3;">
            ${t.headline}
          </h2>

          <div style="font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
            ${introText}
          </div>

          ${bulletsHtml ? `
            <div style="background-color: #f8fafc; padding: 16px 20px; border-radius: 6px; border-left: 4px solid ${t.ctaBgColor}; margin-bottom: 24px;">
              <ul style="margin: 0; padding-left: 18px;">
                ${bulletsHtml}
              </ul>
            </div>
          ` : ''}

          <!-- Primary CTA Button -->
          <div style="text-align: center; margin: 28px 0 16px 0;">
            <a href="${t.ctaUrl}" target="_blank" style="display: inline-block; background-color: ${t.ctaBgColor}; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 12px 28px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${t.ctaText}
            </a>
          </div>

          ${t.showWhatsAppButton ? `
            <div style="text-align: center; margin-bottom: 16px;">
              <a href="https://wa.me/23059188275?text=${encodeURIComponent(`Hello Medical360, I received your email regarding "${campaign.subject}" and would like to learn more.`)}" target="_blank" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 9px 20px; border-radius: 6px;">
                💬 ${t.whatsAppText || 'Chat on WhatsApp (+230 59188275)'}
              </a>
            </div>
          ` : ''}
        </div>

        <!-- Footer -->
        ${t.showFooter ? `
          <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b; line-height: 1.4;">
              ${t.footerNote}
            </p>
            <p style="margin: 0; font-size: 11px; color: #94a3b8;">
              © ${new Date().getFullYear()} Medical360 Ltd • Port Louis, Mauritius. All rights reserved.
            </p>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}

// ─── Dispatch Campaign via Resend ─────────────────────────────────────────────
export async function sendTestCampaignEmail(campaign: Campaign, testEmail: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
  const html = renderCampaignHtml(campaign, { name: 'Dr. / Patient (Preview)', country: 'Mauritius', email: testEmail });

  try {
    const res = await fetch('/api/resend/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Med360 Nexus <onboarding@resend.dev>',
        to: [testEmail],
        subject: `[CAMPAIGN TEST] ${campaign.subject}`,
        html,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.message || 'Resend error: Failed to send test campaign email.' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during test dispatch.' };
  }
}

export async function dispatchCampaign(
  campaign: Campaign,
  contacts: Contact[],
  onProgress?: (sent: number, total: number) => void
): Promise<{ success: boolean; sentCount: number; errors: string[] }> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
  const errors: string[] = [];
  let sentCount = 0;

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const html = renderCampaignHtml(campaign, contact);

    try {
      const res = await fetch('/api/resend/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Med360 Nexus <onboarding@resend.dev>',
          to: [contact.email],
          subject: campaign.subject.replace(/\{\{name\}\}/g, contact.name),
          html,
        }),
      });

      if (res.ok) {
        sentCount++;
      } else {
        const err = await res.json().catch(() => ({}));
        errors.push(`${contact.email}: ${err.message || 'Resend error'}`);
      }
    } catch (err: any) {
      errors.push(`${contact.email}: ${err.message}`);
    }

    if (onProgress) {
      onProgress(i + 1, contacts.length);
    }

    // Small delay to respect rate limit smoothly
    await new Promise(r => setTimeout(r, 200));
  }

  // Update campaign status
  const updatedCampaign: Campaign = {
    ...campaign,
    status: 'sent',
    sentCount: sentCount,
    recipientCount: contacts.length,
    sentAt: new Date().toISOString(),
  };
  saveCampaign(updatedCampaign);

  return {
    success: sentCount > 0,
    sentCount,
    errors,
  };
}
