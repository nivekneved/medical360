import type { InquiryFormData } from '../../hooks/useInquiry';

export interface EmailTemplateConfig {
  subject: string;
  banner: {
    enabled: boolean;
    title: string;
    subtitle: string;
    bgColor: string;
    textColor: string;
  };
  patientInfo: {
    enabled: boolean;
    title: string;
    showName: boolean;
    showEmail: boolean;
    showPhone: boolean;
    showCountry: boolean;
  };
  medicalDetails: {
    enabled: boolean;
    title: string;
    showSpecialty: boolean;
    showService: boolean;
    showHospital: boolean;
    showUrgency: boolean;
    showDescription: boolean;
    accentColor: string;
  };
  preferences: {
    enabled: boolean;
    title: string;
    showDestination: boolean;
    showBudget: boolean;
    showSource: boolean;
  };
  callToAction: {
    enabled: boolean;
    showWhatsAppBtn: boolean;
    showEmailBtn: boolean;
    showDashboardBtn: boolean;
    customNote: string;
  };
  footer: {
    enabled: boolean;
    disclaimer: string;
    brandingText: string;
  };
}

export const DEFAULT_TEMPLATE_CONFIG: EmailTemplateConfig = {
  subject: '[New Patient Request] {{patientName}} — {{service}} / {{specialty}} (from {{source}})',
  banner: {
    enabled: true,
    title: 'New Patient Medical Request',
    subtitle: 'A patient has submitted an inquiry via the Med360 website portal.',
    bgColor: '#090d10',
    textColor: '#ffffff',
  },
  patientInfo: {
    enabled: true,
    title: '👤 Patient & Contact Details (Who Sent)',
    showName: true,
    showEmail: true,
    showPhone: true,
    showCountry: true,
  },
  medicalDetails: {
    enabled: true,
    title: '🩺 Requested Service & Clinical Details',
    showSpecialty: true,
    showService: true,
    showHospital: true,
    showUrgency: true,
    showDescription: true,
    accentColor: '#065f46',
  },
  preferences: {
    enabled: true,
    title: '📍 Request Origin & Preferences',
    showDestination: true,
    showBudget: true,
    showSource: true,
  },
  callToAction: {
    enabled: true,
    showWhatsAppBtn: true,
    showEmailBtn: true,
    showDashboardBtn: true,
    customNote: 'Please contact this patient as soon as possible to coordinate their medical request.',
  },
  footer: {
    enabled: true,
    disclaimer: 'Sent automatically from Med360 Healthcare Concierge • Strict Medical Confidentiality',
    brandingText: 'Med360 Ltd (Owned by NGO Enn Rêv Enn Sourir) • Port Louis, Mauritius',
  },
};

const TEMPLATE_STORAGE_KEY = 'med360_email_template_v1';
export const DEFAULT_TEST_RECIPIENT = 'kevinadlib@gmail.com';

export function getEmailTemplateConfig(): EmailTemplateConfig {
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_TEMPLATE_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('Failed to load email template config from storage:', err);
  }
  return { ...DEFAULT_TEMPLATE_CONFIG };
}

export function saveEmailTemplateConfig(config: EmailTemplateConfig): void {
  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to save email template config:', err);
  }
}

export function resetEmailTemplateConfig(): EmailTemplateConfig {
  try {
    localStorage.removeItem(TEMPLATE_STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to reset email template config:', err);
  }
  return { ...DEFAULT_TEMPLATE_CONFIG };
}

export interface RenderEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  specialtyName?: string;
  serviceName?: string;
  hospitalName?: string;
  sourcePage?: string;
  sourceUrl?: string;
  description: string;
  urgency: string;
  preferredCountry?: string;
  budgetMin?: string;
  budgetMax?: string;
}

export function renderEmailHtml(
  config: EmailTemplateConfig,
  data: RenderEmailData
): string {
  const patientFullName = `${data.firstName} ${data.lastName}`.trim() || 'Valued Patient';
  const budgetText = data.budgetMin && data.budgetMax 
    ? `$${data.budgetMin} - $${data.budgetMax} USD` 
    : 'Not specified';

  const urgencyColor = data.urgency === 'emergency' 
    ? '#dc2626' 
    : data.urgency === 'urgent' 
    ? '#ea580c' 
    : '#16a34a';

  const displayService = data.serviceName || 'Free Medical Review / Consultation';
  const displaySpecialty = data.specialtyName || 'General Healthcare / Not specified';
  const displayHospital = data.hospitalName || 'Any Accredited Partner Hospital';
  const displaySource = data.sourcePage || 'Website Portal Direct';
  const cleanPhoneDigits = (data.phone || '').replace(/[^0-9+]/g, '');

  const sections: string[] = [];

  // 1. Banner Component with Official Med360 Logo
  if (config.banner?.enabled) {
    sections.push(`
      <div style="background-color: ${config.banner.bgColor}; color: ${config.banner.textColor}; padding: 24px; border-radius: 8px 8px 0 0; text-align: left;">
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px; width: 100%;">
          <tr>
            <td style="vertical-align: middle;">
              <img src="https://www.med360.mu/assets/logo.png" alt="Med360" height="42" style="height: 42px; max-width: 180px; display: block; border: 0;" />
            </td>
            <td style="text-align: right; vertical-align: middle;">
              <span style="display: inline-block; background: #065f46; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                ${data.urgency || 'NEW'}
              </span>
            </td>
          </tr>
        </table>
        <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 800; color: ${config.banner.textColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          ${config.banner.title}
        </h2>
        <p style="margin: 0; font-size: 13px; opacity: 0.9; line-height: 1.4; color: ${config.banner.textColor};">
          ${config.banner.subtitle}
        </p>
      </div>
    `);
  }

  // Content Container Start
  sections.push(`<div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; ${config.banner?.enabled ? 'border-top: none;' : 'border-radius: 8px 8px 0 0;'}">`);

  // Quick Action Response Bar at the top of the body
  if (config.callToAction?.enabled) {
    const waReplyText = encodeURIComponent(
      `Hello ${patientFullName}, thank you for contacting Med360 regarding your request for ${displayService}. I am your dedicated patient coordinator.`
    );
    const waLink = `https://wa.me/${cleanPhoneDigits.replace('+', '')}?text=${waReplyText}`;
    const emailSubject = encodeURIComponent(`Med360 - Follow-up on your medical request (${displayService})`);
    const emailBody = encodeURIComponent(`Dear ${patientFullName},\n\nThank you for reaching out to Med360 regarding ${displayService}.\n\nBest regards,\nMed360 Patient Coordination Team\n+230 5918 8275`);

    sections.push(`
      <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 8px; padding: 14px 16px; margin-bottom: 22px;">
        <div style="font-size: 12px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
          ⚡ Rapid Response Actions (Get Back to Patient)
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${data.phone ? `
            <a href="${waLink}" target="_blank" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 8px 14px; border-radius: 6px; margin-right: 6px; margin-bottom: 6px;">
              💬 Reply via WhatsApp (${data.phone})
            </a>
          ` : ''}
          ${data.email ? `
            <a href="mailto:${data.email}?subject=${emailSubject}&body=${emailBody}" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 8px 14px; border-radius: 6px; margin-right: 6px; margin-bottom: 6px;">
              ✉️ Reply via Email (${data.email})
            </a>
          ` : ''}
          ${data.phone ? `
            <a href="tel:${cleanPhoneDigits}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 8px 14px; border-radius: 6px; margin-bottom: 6px;">
              📞 Call Patient
            </a>
          ` : ''}
        </div>
      </div>
    `);
  }

  // 2. Patient Info Component (Who Sent)
  if (config.patientInfo?.enabled) {
    const rows: string[] = [];
    if (config.patientInfo.showName) {
      rows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 13px; width: 38%; font-weight: 600;">Full Name:</td>
          <td style="padding: 9px 0; color: #0f172a; font-size: 14px; font-weight: 800;">${patientFullName}</td>
        </tr>
      `);
    }
    if (config.patientInfo.showEmail && data.email) {
      rows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 13px; font-weight: 600;">Email:</td>
          <td style="padding: 9px 0; font-size: 14px;"><a href="mailto:${data.email}" style="color: #0284c7; text-decoration: none; font-weight: 700;">${data.email}</a></td>
        </tr>
      `);
    }
    if (config.patientInfo.showPhone && data.phone) {
      rows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 13px; font-weight: 600;">Phone / WhatsApp:</td>
          <td style="padding: 9px 0; font-size: 14px;"><a href="tel:${cleanPhoneDigits}" style="color: #0284c7; text-decoration: none; font-weight: 700;">${data.phone}</a></td>
        </tr>
      `);
    }
    if (config.patientInfo.showCountry) {
      rows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 13px; font-weight: 600;">Country of Residence:</td>
          <td style="padding: 9px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${data.countryOfResidence || 'Mauritius'}</td>
        </tr>
      `);
    }

    if (rows.length > 0) {
      sections.push(`
        <div style="margin-bottom: 22px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
            ${config.patientInfo.title}
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${rows.join('')}
          </table>
        </div>
      `);
    }
  }

  // 3. Medical Details Component & Requested Service
  if (config.medicalDetails?.enabled) {
    const medRows: string[] = [];

    if (config.medicalDetails.showService !== false && displayService) {
      medRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: rgba(6, 95, 70, 0.05);">
          <td style="padding: 10px 8px; color: #065f46; font-size: 13px; width: 38%; font-weight: 700;">🎯 Requested Service:</td>
          <td style="padding: 10px 8px; color: #065f46; font-size: 14px; font-weight: 800;">
            <span style="display: inline-block; background: #065f46; color: #ffffff; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700;">
              ${displayService}
            </span>
          </td>
        </tr>
      `);
    }

    if (config.medicalDetails.showSpecialty && displaySpecialty) {
      medRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 8px; color: #64748b; font-size: 13px; width: 38%; font-weight: 600;">Medical Specialty:</td>
          <td style="padding: 9px 8px; color: #0f172a; font-size: 14px; font-weight: 700;">${displaySpecialty}</td>
        </tr>
      `);
    }

    if (config.medicalDetails.showHospital && data.hospitalName) {
      medRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 8px; color: #64748b; font-size: 13px; font-weight: 600;">Requested Hospital:</td>
          <td style="padding: 9px 8px; color: #0f172a; font-size: 14px; font-weight: 700;">🏥 ${displayHospital}</td>
        </tr>
      `);
    }

    if (config.medicalDetails.showUrgency) {
      medRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 8px; color: #64748b; font-size: 13px; font-weight: 600;">Urgency Level:</td>
          <td style="padding: 9px 8px; font-size: 14px;">
            <span style="display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #ffffff; background-color: ${urgencyColor};">
              ${data.urgency || 'routine'}
            </span>
          </td>
        </tr>
      `);
    }

    sections.push(`
      <div style="margin-bottom: 22px;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
          ${config.medicalDetails.title}
        </h3>
        ${medRows.length > 0 ? `<table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">${medRows.join('')}</table>` : ''}
        ${config.medicalDetails.showDescription ? `
          <div style="background-color: #f8fafc; padding: 14px 16px; border-radius: 6px; border-left: 4px solid ${config.medicalDetails.accentColor}; margin-top: 8px;">
            <div style="font-size: 11px; font-weight: 800; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Medical Problem / Patient Message:</div>
            <div style="color: #1e293b; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">${data.description || 'No additional details provided.'}</div>
          </div>
        ` : ''}
      </div>
    `);
  }

  // 4. Request Origin & Preferences Component
  if (config.preferences?.enabled) {
    const prefRows: string[] = [];
    if (config.preferences.showSource) {
      prefRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: #f8fafc;">
          <td style="padding: 9px 8px; color: #64748b; font-size: 13px; width: 38%; font-weight: 600;">📍 Origin / Page:</td>
          <td style="padding: 9px 8px; color: #0f172a; font-size: 13px; font-weight: 700;">${displaySource}</td>
        </tr>
      `);
    }
    if (config.preferences.showDestination && data.preferredCountry) {
      prefRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 8px; color: #64748b; font-size: 13px; font-weight: 600;">Preferred Destination:</td>
          <td style="padding: 9px 8px; color: #0f172a; font-size: 13px;">${data.preferredCountry}</td>
        </tr>
      `);
    }
    if (config.preferences.showBudget && (data.budgetMin || data.budgetMax)) {
      prefRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 8px; color: #64748b; font-size: 13px; font-weight: 600;">Budget Range:</td>
          <td style="padding: 9px 8px; color: #0f172a; font-size: 13px;">${budgetText}</td>
        </tr>
      `);
    }

    if (prefRows.length > 0) {
      sections.push(`
        <div style="margin-bottom: 22px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
            ${config.preferences.title}
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${prefRows.join('')}
          </table>
        </div>
      `);
    }
  }

  // Content Container End
  sections.push(`</div>`);

  // 5. Footer Component
  if (config.footer?.enabled) {
    sections.push(`
      <div style="background-color: #f8fafc; padding: 16px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; text-align: center;">
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b;">
          ${config.footer.disclaimer}
        </p>
        ${config.footer.brandingText ? `
          <p style="margin: 0; font-size: 11px; color: #94a3b8; font-weight: 600;">
            ${config.footer.brandingText}
          </p>
        ` : ''}
      </div>
    `);
  }

  return `
    <div style="background-color: #f1f5f9; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        ${sections.join('')}
      </div>
    </div>
  `;
}

export function formatSubject(
  subjectTemplate: string,
  data: {
    firstName: string;
    lastName: string;
    specialtyName?: string;
    serviceName?: string;
    urgency?: string;
    countryOfResidence?: string;
    sourcePage?: string;
  }
): string {
  const patientFullName = `${data.firstName} ${data.lastName}`.trim() || 'Patient';
  const displayService = data.serviceName || 'Medical Inquiry';
  const displaySpecialty = data.specialtyName || 'General';
  const displaySource = data.sourcePage || 'Web';

  return subjectTemplate
    .replace(/\{\{patientName\}\}/g, patientFullName)
    .replace(/\{\{service\}\}/g, displayService)
    .replace(/\{\{specialty\}\}/g, displaySpecialty)
    .replace(/\{\{urgency\}\}/g, data.urgency || 'Routine')
    .replace(/\{\{country\}\}/g, data.countryOfResidence || 'Mauritius')
    .replace(/\{\{source\}\}/g, displaySource);
}

export async function sendInquiryEmail(formData: InquiryFormData, specialtyName?: string): Promise<boolean> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
  const recipient = import.meta.env.VITE_ADMIN_EMAIL || DEFAULT_TEST_RECIPIENT;
  const config = getEmailTemplateConfig();

  const sourcePage = formData.sourcePage || (typeof window !== 'undefined' ? window.location.pathname : 'Portal');
  const serviceName = formData.serviceName || 'Free Medical Second Opinion';

  const subject = formatSubject(config.subject, {
    firstName: formData.firstName,
    lastName: formData.lastName,
    specialtyName: specialtyName || formData.specialtyId,
    serviceName,
    urgency: formData.urgency,
    countryOfResidence: formData.countryOfResidence,
    sourcePage,
  });

  const html = renderEmailHtml(config, {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    countryOfResidence: formData.countryOfResidence,
    specialtyName,
    serviceName,
    hospitalName: formData.hospitalName,
    sourcePage,
    description: formData.description,
    urgency: formData.urgency,
    preferredCountry: formData.preferredCountry,
    budgetMin: formData.budgetMin,
    budgetMax: formData.budgetMax,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const res = await fetch('/api/resend/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: 'Med360 Inquiries <onboarding@resend.dev>',
        to: [recipient],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Resend API returned non-200:', err);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to send email via Resend:', err);
    return false;
  }
}

export async function sendContactEmail(data: {
  name: string;
  contact: string;
  message: string;
  sourcePage?: string;
}): Promise<boolean> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
  const recipient = import.meta.env.VITE_ADMIN_EMAIL || DEFAULT_TEST_RECIPIENT;
  const config = getEmailTemplateConfig();

  const isEmail = data.contact.includes('@');
  const email = isEmail ? data.contact : '';
  const phone = !isEmail ? data.contact : '';
  const nameParts = data.name.trim().split(' ');
  const firstName = nameParts[0] || data.name;
  const lastName = nameParts.slice(1).join(' ') || '';
  const sourcePage = data.sourcePage || 'Contact Page (/contact)';

  const subject = `[Contact Form Message] ${data.name} — Quick Inquiry (from ${sourcePage})`;

  const html = renderEmailHtml(config, {
    firstName,
    lastName,
    email,
    phone,
    countryOfResidence: 'Mauritius',
    specialtyName: 'General Inquiry / Patient Navigation',
    serviceName: 'Quick Contact Message',
    sourcePage,
    description: data.message,
    urgency: 'routine',
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const res = await fetch('/api/resend/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: 'Med360 Inquiries <onboarding@resend.dev>',
        to: [recipient],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('Resend API contact dispatch returned non-200:', err);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to dispatch contact email:', err);
    return false;
  }
}

export async function sendTestEmail(recipientEmail: string, config: EmailTemplateConfig): Promise<{ success: boolean; error?: string }> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';

  const mockData = {
    firstName: 'Jean-Luc',
    lastName: 'Marie',
    email: 'jeanluc.marie@example.mu',
    phone: '+230 5918 8275',
    countryOfResidence: 'Mauritius',
    specialtyName: 'Cardiology & Heart Surgery',
    serviceName: 'Free Medical Second Opinion',
    hospitalName: 'Apollo Hospitals – Chennai & Navi Mumbai',
    sourcePage: 'Header Navigation CTA',
    description: 'Seeking a second opinion for coronary artery bypass vs stenting. Previous angiography results available for review.',
    urgency: 'urgent',
    preferredCountry: 'India',
    budgetMin: '6000',
    budgetMax: '12000',
  };

  const subject = `[TEST PREVIEW] ` + formatSubject(config.subject, {
    firstName: mockData.firstName,
    lastName: mockData.lastName,
    specialtyName: mockData.specialtyName,
    serviceName: mockData.serviceName,
    urgency: mockData.urgency,
    countryOfResidence: mockData.countryOfResidence,
    sourcePage: mockData.sourcePage,
  });

  const html = renderEmailHtml(config, mockData);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    const res = await fetch('/api/resend/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: 'Med360 Inquiries <onboarding@resend.dev>',
        to: [recipientEmail || DEFAULT_TEST_RECIPIENT],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.message || 'Resend error: Failed to send test email.' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error sending test email.' };
  }
}
