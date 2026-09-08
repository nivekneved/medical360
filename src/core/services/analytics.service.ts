/**
 * Med360 — Centralized Analytics & Conversion Tracking Service
 * Unifies Google Analytics 4, Meta Pixel, and internal conversion tracking.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
  }
}

export type AnalyticsEventName =
  | 'page_view'
  | 'whatsapp_click'
  | 'phone_call'
  | 'inquiry_submitted'
  | 'hospital_compared'
  | 'cost_calculated'
  | 'specialty_viewed'
  | 'hospital_viewed'
  | 'filter_applied';

export interface AnalyticsEventParams {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

class AnalyticsService {
  /**
   * Dispatches a custom event to GA4, Meta Pixel, and local logs.
   */
  public trackEvent(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}): void {
    const enrichedParams = {
      ...params,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
    };

    // 1. Google Analytics 4 (gtag)
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, enrichedParams);
      } catch (err) {
        console.warn('[Analytics] GA4 event dispatch error:', err);
      }
    }

    // 2. Meta Pixel (fbq)
    if (typeof window.fbq === 'function') {
      try {
        if (eventName === 'inquiry_submitted') {
          window.fbq('track', 'Lead', {
            content_name: params.specialty || 'General Inquiry',
            content_category: params.category || 'Medical Tourism',
            currency: 'USD',
            value: params.value || 0,
          });
        } else if (eventName === 'whatsapp_click') {
          window.fbq('track', 'Contact', {
            content_name: `WhatsApp - ${params.source || 'General'}`,
          });
        } else {
          window.fbq('trackCustom', eventName, enrichedParams);
        }
      } catch (err) {
        console.warn('[Analytics] Meta Pixel event dispatch error:', err);
      }
    }

    // 3. Dev-mode debug telemetry
    if (import.meta.env.DEV) {
      console.log(`[Analytics] 📊 Event: "${eventName}"`, enrichedParams);
    }
  }

  /**
   * Tracks a virtual page view when navigating Single Page App routes.
   */
  public trackPageView(path: string, title?: string): void {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-MED360', {
        page_path: path,
        page_title: title || document.title,
      });
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }
}

export const analyticsService = new AnalyticsService();
