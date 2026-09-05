// ─── WhatsApp Service & Webhook Synchronization Engine ─────────────────────────
// Handles deep link building, conversion tracking, and real-time CRM webhook sync

const MED360_PHONE = '23059188275'; // Mauritius country code prefix (+230 5918 8275)
const LOCAL_STORAGE_WHATSAPP_LOGS = 'med360_whatsapp_consultation_logs';

export interface WhatsAppConsultationLog {
  id: string;
  timestamp: string;
  source: string;
  patientName?: string;
  country?: string;
  specialty?: string;
  phone?: string;
  prefilledMessage: string;
  webhookStatus: 'dispatched' | 'pending' | 'mock_logged';
}

/**
 * Builds a wa.me URL with optional pre-filled message.
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
  const message = `Hello Med360,\n\nMy name is ${params.firstName} ${params.lastName} from ${params.country}.${serviceLine}\n\nMedical Specialty: ${params.specialty}\n\n${params.description}\n\nPlease contact me at your earliest convenience.`;
  return buildWhatsAppUrl(MED360_PHONE, message);
}

/**
 * Logs a WhatsApp consultation lead in local CRM state and fires the webhook receiver.
 */
export async function trackWhatsAppConsultation(params: {
  source: string;
  patientName?: string;
  country?: string;
  specialty?: string;
  phone?: string;
  prefilledMessage?: string;
}): Promise<WhatsAppConsultationLog> {
  const id = `wa-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();
  const prefilledMessage = params.prefilledMessage || 'Direct WhatsApp 24/7 Consultation';

  const logEntry: WhatsAppConsultationLog = {
    id,
    timestamp,
    source: params.source,
    patientName: params.patientName || 'Anonymous Patient',
    country: params.country || 'Mauritius',
    specialty: params.specialty || 'General Concierge',
    phone: params.phone || '',
    prefilledMessage,
    webhookStatus: 'pending',
  };

  // 1. Persist to local CRM logs
  try {
    const existingRaw = localStorage.getItem(LOCAL_STORAGE_WHATSAPP_LOGS);
    const logs: WhatsAppConsultationLog[] = existingRaw ? JSON.parse(existingRaw) : [];
    logs.unshift(logEntry);
    // Keep last 100 entries
    localStorage.setItem(LOCAL_STORAGE_WHATSAPP_LOGS, JSON.stringify(logs.slice(0, 100)));
  } catch (err) {
    console.warn('Failed to save WhatsApp consultation log:', err);
  }

  // 2. Dispatch webhook payload to serverless endpoint if available
  try {
    const res = await fetch('/api/webhooks/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'whatsapp.consultation_initiated',
        data: logEntry,
        timestamp,
      }),
    });
    if (res.ok) {
      logEntry.webhookStatus = 'dispatched';
    } else {
      logEntry.webhookStatus = 'mock_logged';
    }
  } catch {
    logEntry.webhookStatus = 'mock_logged';
  }

  return logEntry;
}

/**
 * Retrieves all tracked WhatsApp consultation events for admin monitoring.
 */
export function getWhatsAppConsultationLogs(): WhatsAppConsultationLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_WHATSAPP_LOGS);
    if (!raw) {
      // Return default initial mock seeds if none exist
      const initialLogs: WhatsAppConsultationLog[] = [
        {
          id: 'wa-demo-1',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          source: 'Homepage Floating WhatsApp',
          patientName: 'Jean-Marc L.',
          country: 'Mauritius',
          specialty: 'Cardiology (CABG Surgery)',
          phone: '+230 5712 3456',
          prefilledMessage: 'Hello Med360, I am inquiring regarding cardiac bypass surgery in India.',
          webhookStatus: 'dispatched',
        },
        {
          id: 'wa-demo-2',
          timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
          source: 'Cost Calculator Widget',
          patientName: 'Marie Celine D.',
          country: 'Rodrigues',
          specialty: 'Orthopedics (Knee Replacement)',
          phone: '+230 5890 1122',
          prefilledMessage: 'Hello Med360, I compared knee replacement costs on your calculator and want a free review.',
          webhookStatus: 'dispatched',
        },
      ];
      localStorage.setItem(LOCAL_STORAGE_WHATSAPP_LOGS, JSON.stringify(initialLogs));
      return initialLogs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Convenience helper: tracks conversion and opens WhatsApp in a new tab.
 */
export function openTrackedWhatsApp(source: string, message?: string, patientInfo?: { name?: string; country?: string; specialty?: string }) {
  trackWhatsAppConsultation({
    source,
    patientName: patientInfo?.name,
    country: patientInfo?.country,
    specialty: patientInfo?.specialty,
    prefilledMessage: message,
  });
  window.open(buildMed360WhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}
