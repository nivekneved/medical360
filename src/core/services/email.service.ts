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
    showUrgency: boolean;
    showDescription: boolean;
    accentColor: string;
  };
  preferences: {
    enabled: boolean;
    title: string;
    showDestination: boolean;
    showBudget: boolean;
  };
  callToAction: {
    enabled: boolean;
    showWhatsAppBtn: boolean;
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
  subject: '[New Inquiry] {{patientName}} - {{service}} ({{specialty}})',
  banner: {
    enabled: true,
    title: 'New Patient Medical Inquiry',
    subtitle: 'A new patient inquiry has been submitted via the Describe Need portal.',
    bgColor: '#090d10',
    textColor: '#ffffff',
  },
  patientInfo: {
    enabled: true,
    title: 'Patient Details',
    showName: true,
    showEmail: true,
    showPhone: true,
    showCountry: true,
  },
  medicalDetails: {
    enabled: true,
    title: 'Medical Requirements & Requested Service',
    showSpecialty: true,
    showService: true,
    showUrgency: true,
    showDescription: true,
    accentColor: '#065f46',
  },
  preferences: {
    enabled: true,
    title: 'Preferences & Budget',
    showDestination: true,
    showBudget: true,
  },
  callToAction: {
    enabled: true,
    showWhatsAppBtn: true,
    showDashboardBtn: true,
    customNote: 'Please review patient details and coordinate with doctor team within 24 hours.',
  },
  footer: {
    enabled: true,
    disclaimer: 'Sent automatically from Medical360 Patient Portal • Strict Medical Confidentiality',
    brandingText: 'Medical360 Healthcare Concierge • Port Louis, Mauritius',
  },
};

const TEMPLATE_STORAGE_KEY = 'med360_email_template_v1';

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

export function renderEmailHtml(
  config: EmailTemplateConfig,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryOfResidence: string;
    specialtyName: string;
    serviceName?: string;
    description: string;
    urgency: string;
    preferredCountry?: string;
    budgetMin?: string;
    budgetMax?: string;
  }
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

  const sections: string[] = [];

  // 1. Banner Component with Official Medical360 Logo
  if (config.banner?.enabled) {
    sections.push(`
      <div style="background-color: ${config.banner.bgColor}; color: ${config.banner.textColor}; padding: 22px 24px; border-radius: 8px 8px 0 0; text-align: left;">
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 14px;">
          <tr>
            <td style="vertical-align: middle;">
              <img src="https://medical360-zeta.vercel.app/assets/logo.png" alt="Medical 360" height="34" style="height: 34px; max-width: 160px; display: block; border: 0;" />
            </td>
          </tr>
        </table>
        <h2 style="margin: 0 0 4px 0; font-size: 19px; font-weight: 700; color: ${config.banner.textColor}; font-family: 'Outfit', 'Inter', -apple-system, sans-serif;">
          ${config.banner.title}
        </h2>
        ${config.banner.subtitle ? `<p style="margin: 0; font-size: 13px; opacity: 0.85; line-height: 1.4; color: ${config.banner.textColor};">${config.banner.subtitle}</p>` : ''}
      </div>
    `);
  }

  // Content Container Start
  sections.push(`<div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; ${config.banner?.enabled ? 'border-top: none;' : 'border-radius: 8px 8px 0 0;'}">`);

  // 2. Patient Info Component
  if (config.patientInfo?.enabled) {
    const rows: string[] = [];
    if (config.patientInfo.showName) {
      rows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 14px; width: 38%; font-weight: 600;">Full Name:</td>
          <td style="padding: 9px 0; color: #0f172a; font-size: 14px; font-weight: 700;">${patientFullName}</td>
        </tr>
      `);
    }
    if (config.patientInfo.showEmail) {
      rows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 14px; font-weight: 600;">Email:</td>
          <td style="padding: 9px 0; font-size: 14px;"><a href="mailto:${data.email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${data.email}</a></td>
        </tr>
      `);
    }
    if (config.patientInfo.showPhone) {
      rows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 14px; font-weight: 600;">Phone / WhatsApp:</td>
          <td style="padding: 9px 0; font-size: 14px;"><a href="tel:${data.phone}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${data.phone}</a></td>
        </tr>
      `);
    }
    if (config.patientInfo.showCountry) {
      rows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 14px; font-weight: 600;">Country:</td>
          <td style="padding: 9px 0; color: #0f172a; font-size: 14px;">${data.countryOfResidence}</td>
        </tr>
      `);
    }

    if (rows.length > 0) {
      sections.push(`
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">${config.patientInfo.title}</h3>
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

    if (config.medicalDetails.showService !== false && data.serviceName) {
      medRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9; background-color: rgba(6, 95, 70, 0.04);">
          <td style="padding: 10px 8px; color: #065f46; font-size: 14px; width: 38%; font-weight: 700;">🎯 Requested Service:</td>
          <td style="padding: 10px 8px; color: #065f46; font-size: 14px; font-weight: 800;">
            <span style="display: inline-block; background: #065f46; color: #ffffff; padding: 3px 10px; border-radius: 999px; font-size: 12px; letter-spacing: 0.2px;">
              ${data.serviceName}
            </span>
          </td>
        </tr>
      `);
    }

    if (config.medicalDetails.showSpecialty) {
      medRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 14px; width: 38%; font-weight: 600;">Specialty:</td>
          <td style="padding: 9px 0; color: #0f172a; font-size: 14px; font-weight: 700;">${data.specialtyName}</td>
        </tr>
      `);
    }

    if (config.medicalDetails.showUrgency) {
      medRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 14px; font-weight: 600;">Urgency:</td>
          <td style="padding: 9px 0; font-size: 14px;">
            <span style="display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #ffffff; background-color: ${urgencyColor};">
              ${data.urgency}
            </span>
          </td>
        </tr>
      `);
    }

    sections.push(`
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">${config.medicalDetails.title}</h3>
        ${medRows.length > 0 ? `<table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">${medRows.join('')}</table>` : ''}
        ${config.medicalDetails.showDescription ? `
          <div style="background-color: #f8fafc; padding: 14px 16px; border-radius: 6px; border-left: 4px solid ${config.medicalDetails.accentColor}; margin-top: 8px;">
            <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px; text-transform: uppercase;">Condition / Problem Description:</div>
            <div style="color: #1e293b; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${data.description || 'No description provided.'}</div>
          </div>
        ` : ''}
      </div>
    `);
  }

  // 4. Preferences Component
  if (config.preferences?.enabled) {
    const prefRows: string[] = [];
    if (config.preferences.showDestination) {
      prefRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 14px; width: 38%; font-weight: 600;">Preferred Destination:</td>
          <td style="padding: 9px 0; color: #0f172a; font-size: 14px;">${data.preferredCountry || 'No preference (Recommend best option)'}</td>
        </tr>
      `);
    }
    if (config.preferences.showBudget) {
      prefRows.push(`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 9px 0; color: #64748b; font-size: 14px; font-weight: 600;">Budget Estimate:</td>
          <td style="padding: 9px 0; color: #0f172a; font-size: 14px;">${budgetText}</td>
        </tr>
      `);
    }

    if (prefRows.length > 0) {
      sections.push(`
        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.5px;">${config.preferences.title}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${prefRows.join('')}
          </table>
        </div>
      `);
    }
  }

  // 5. Call To Action Component
  if (config.callToAction?.enabled) {
    const cleanPhoneDigits = (data.phone || '').replace(/[^0-9]/g, '');
    const waLink = `https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(`Hello ${data.firstName}, thank you for contacting Medical360 regarding your inquiry for ${data.serviceName || data.specialtyName}.`)}`;

    sections.push(`
      <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0;">
        ${config.callToAction.customNote ? `
          <p style="margin: 0 0 14px 0; font-size: 13px; color: #475569; font-style: italic;">
            📌 ${config.callToAction.customNote}
          </p>
        ` : ''}
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${config.callToAction.showWhatsAppBtn ? `
            <a href="${waLink}" target="_blank" style="display: inline-block; background-color: #16a34a; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 18px; border-radius: 6px; margin-right: 8px; margin-bottom: 8px;">
              💬 Reply via WhatsApp
            </a>
          ` : ''}
          ${config.callToAction.showDashboardBtn ? `
            <a href="https://med360.mu/admin/inquiries" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 18px; border-radius: 6px; margin-bottom: 8px;">
              📋 View in Admin Portal
            </a>
          ` : ''}
        </div>
      </div>
    `);
  }

  // Content Container End
  sections.push(`</div>`);

  // 6. Footer Component
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
      <div style="max-width: 580px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
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
    specialtyName: string;
    serviceName?: string;
    urgency: string;
    countryOfResidence: string;
  }
): string {
  const patientFullName = `${data.firstName} ${data.lastName}`.trim() || 'Patient';
  const displayService = data.serviceName || 'General Facilitation';
  return subjectTemplate
    .replace(/\{\{patientName\}\}/g, patientFullName)
    .replace(/\{\{service\}\}/g, displayService)
    .replace(/\{\{specialty\}\}/g, data.specialtyName || 'Medical Need')
    .replace(/\{\{urgency\}\}/g, data.urgency)
    .replace(/\{\{country\}\}/g, data.countryOfResidence);
}

export async function sendInquiryEmail(formData: InquiryFormData, specialtyName: string): Promise<boolean> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';
  const recipient = import.meta.env.VITE_ADMIN_EMAIL || 'kevinadlib@gmail.com';
  const config = getEmailTemplateConfig();

  const subject = formatSubject(config.subject, {
    firstName: formData.firstName,
    lastName: formData.lastName,
    specialtyName,
    serviceName: formData.serviceName,
    urgency: formData.urgency,
    countryOfResidence: formData.countryOfResidence,
  });

  const html = renderEmailHtml(config, {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    countryOfResidence: formData.countryOfResidence,
    specialtyName,
    serviceName: formData.serviceName,
    description: formData.description,
    urgency: formData.urgency,
    preferredCountry: formData.preferredCountry,
    budgetMin: formData.budgetMin,
    budgetMax: formData.budgetMax,
  });

  try {
    const res = await fetch('/api/resend/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
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

export async function sendTestEmail(recipientEmail: string, config: EmailTemplateConfig): Promise<{ success: boolean; error?: string }> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || '';

  const mockData = {
    firstName: 'Jean-Luc',
    lastName: 'Marie',
    email: 'jeanluc.marie@example.mu',
    phone: '+230 5918 8275',
    countryOfResidence: 'Mauritius',
    specialtyName: 'Cardiology & Heart Surgery',
    serviceName: 'Medical Visa & Travel Planning',
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
  });

  const html = renderEmailHtml(config, mockData);

  try {
    const res = await fetch('/api/resend/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Med360 Inquiries <onboarding@resend.dev>',
        to: [recipientEmail],
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
