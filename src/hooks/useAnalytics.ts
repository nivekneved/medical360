import { useCallback } from 'react';
import { analyticsService, type AnalyticsEventName, type AnalyticsEventParams } from '../core/services/analytics.service';

/**
 * React hook for tracking analytics and conversion events across components.
 */
export function useAnalytics() {
  const trackEvent = useCallback((eventName: AnalyticsEventName, params?: AnalyticsEventParams) => {
    analyticsService.trackEvent(eventName, params);
  }, []);

  const trackPageView = useCallback((path: string, title?: string) => {
    analyticsService.trackPageView(path, title);
  }, []);

  return {
    trackEvent,
    trackPageView,
  };
}
