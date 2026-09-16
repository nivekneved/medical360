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

interface QueuedEvent {
  eventName: AnalyticsEventName;
  params: AnalyticsEventParams;
  timestamp: string;
  url: string;
}

class AnalyticsService {
  private queue: QueuedEvent[] = [];
  private flushTimer: number | null = null;
  private readonly FLUSH_INTERVAL_MS = 4000;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush();
        }
      });
      window.addEventListener('pagehide', () => {
        this.flush();
      });
    }
  }

  /**
   * Dispatches a custom event to GA4, Meta Pixel, and local logs with batching.
   */
  public trackEvent(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}, immediate = false): void {
    const enrichedParams = {
      ...params,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.pathname : '',
    };

    // Immediate dispatch for high-priority conversion events
    const isCriticalConversion = eventName === 'inquiry_submitted' || eventName === 'phone_call' || immediate;

    if (isCriticalConversion) {
      this.dispatchSingle(eventName, enrichedParams);
      return;
    }

    // Queue lower-priority telemetry to collapse network payload
    this.queue.push({
      eventName,
      params: enrichedParams,
      timestamp: enrichedParams.timestamp,
      url: enrichedParams.url,
    });

    if (!this.flushTimer) {
      this.flushTimer = window.setTimeout(() => {
        this.flush();
      }, this.FLUSH_INTERVAL_MS);
    }
  }

  private dispatchSingle(eventName: AnalyticsEventName, params: AnalyticsEventParams): void {
    // 1. Google Analytics 4 (gtag)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, params);
      } catch (err) {
        console.warn('[Analytics] GA4 event dispatch error:', err);
      }
    }

    // 2. Meta Pixel (fbq)
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
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
          window.fbq('trackCustom', eventName, params);
        }
      } catch (err) {
        console.warn('[Analytics] Meta Pixel event dispatch error:', err);
      }
    }

    // 3. Dev-mode debug telemetry
    if (import.meta.env.DEV) {
      console.log(`[Analytics] 📊 Event: "${eventName}"`, params);
    }
  }

  /**
   * Flushes queued analytics batch.
   */
  public flush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.queue.length === 0) return;

    const eventsToFlush = [...this.queue];
    this.queue = [];

    // Dispatch batch to GA4 / Meta Pixel
    for (const item of eventsToFlush) {
      this.dispatchSingle(item.eventName, item.params);
    }

    // Dispatch telemetry beacon if backend endpoint configured
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      try {
        const payload = JSON.stringify({ batch: eventsToFlush });
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/telemetry', blob);
      } catch {
        // Beacon fallback silent
      }
    }
  }

  /**
   * Tracks a virtual page view when navigating Single Page App routes.
   */
  public trackPageView(path: string, title?: string): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'G-MED360', {
        page_path: path,
        page_title: title || document.title,
      });
    }

    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }
}

export const analyticsService = new AnalyticsService();

