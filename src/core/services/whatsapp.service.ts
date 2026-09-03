// ─── WhatsApp Service ─────────────────────────────────────────────────────────
// Single responsibility: build WhatsApp URLs

const MED360_PHONE = '23059188275'; // Mauritius country code prefix

/**
 * Builds a wa.me URL with optional pre-filled message.
 * @param phone - Phone number without + (e.g. '23059188275')
 * @param message - Optional pre-filled message text
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds the default Med360 WhatsApp URL with optional message.
 */
export function buildMed360WhatsAppUrl(message?: string): string {
  return buildWhatsAppUrl(MED360_PHONE, message);
}

/**
 * Builds a pre-filled WhatsApp message from inquiry form data.
 */
export function buildInquiryWhatsAppUrl(params: {
  firstName: string;
  lastName: string;
  country: string;
  specialty: string;
  serviceName?: string;
  description: string;
}): string {
  const serviceLine = params.serviceName ? `\nRequested Service: ${params.serviceName}` : '';
  const message = `Hello Medical 360,\n\nMy name is ${params.firstName} ${params.lastName} from ${params.country}.${serviceLine}\n\nMedical Specialty: ${params.specialty}\n\n${params.description}\n\nPlease contact me at your earliest convenience.`;
  return buildWhatsAppUrl(MED360_PHONE, message);
}
