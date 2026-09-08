import { useCallback } from 'react';
import { buildMed360WhatsAppUrl, trackWhatsAppConsultation } from '../core/services/whatsapp.service';
import { useAnalytics } from './useAnalytics';

export interface OpenWhatsAppOptions {
  source: string;
  message?: string;
  patientName?: string;
  country?: string;
  specialty?: string;
  phone?: string;
}

/**
 * Unified hook for opening WhatsApp conversations, tracking analytics conversions,
 * and dispatching CRM synchronization events seamlessly.
 */
export function useWhatsAppAction() {
  const { trackEvent } = useAnalytics();

  const openWhatsApp = useCallback((options: OpenWhatsAppOptions) => {
    const { source, message, patientName, country, specialty, phone } = options;

    // 1. Build destination link
    const url = buildMed360WhatsAppUrl(message);

    // 2. Track analytics conversion event
    trackEvent('whatsapp_click', {
      source,
      country,
      specialty,
      patientName,
    });

    // 3. Log consultation lead asynchronously in background
    trackWhatsAppConsultation({
      source,
      patientName,
      country,
      specialty,
      phone,
      prefilledMessage: message || 'General Inquiry',
    }).catch((err) => {
      console.warn('[WhatsApp] Lead tracking error:', err);
    });

    // 4. Open WhatsApp in a new window/tab safely
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [trackEvent]);

  return { openWhatsApp };
}
