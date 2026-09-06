// ─── Format Service ───────────────────────────────────────────────────────────
// Single responsibility: data formatting utilities

import { getPlatformSettings } from './settings.service';

/**
 * Formats an ISO date string to a readable date.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formats an ISO date string to a relative time string (e.g. "2 hours ago").
 */
export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (days > 0)    return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0)   return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Truncates text to a maximum character count, appending ellipsis.
 */
export function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

/**
 * Formats a number with comma separators.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Formats a USD cost range with its Mauritian Rupee (Rs / MUR) equivalent right next to it.
 * Uses the dynamic USD to MUR exchange rate configured in Admin Settings.
 * e.g. "$5,000 – $8,000 (~Rs 232,500 – 372,000)"
 */
export function formatCostRange(min: number, max: number, murExchangeRate?: number): string {
  if (!min && !max) return 'Custom Quote';
  const rate = murExchangeRate ?? getPlatformSettings().murExchangeRate ?? 46.5;
  const minMur = Math.round(min * rate);
  const maxMur = Math.round(max * rate);
  return `$${formatNumber(min)} – $${formatNumber(max)} (~Rs ${formatNumber(minMur)} – ${formatNumber(maxMur)})`;
}

/**
 * Formats a single USD amount with Mauritian Rupee equivalent.
 */
export function formatSingleCost(usd: number, murExchangeRate?: number): string {
  const rate = murExchangeRate ?? getPlatformSettings().murExchangeRate ?? 46.5;
  const mur = Math.round(usd * rate);
  return `$${formatNumber(usd)} (~Rs ${formatNumber(mur)})`;
}

/**
 * Formats a USD amount to estimated Mauritian Rupees (MUR).
 */
export function formatCostMur(usd: number, exchangeRate?: number): string {
  const rate = exchangeRate ?? getPlatformSettings().murExchangeRate ?? 46.5;
  const mur = Math.round(usd * rate);
  return `Rs ${formatNumber(mur)}`;
}

/**
 * Converts a string to a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Returns star rating label from a numeric rating.
 */
export function formatRatingLabel(rating: number): string {
  if (rating >= 4.8) return 'Excellent';
  if (rating >= 4.5) return 'Very Good';
  if (rating >= 4.0) return 'Good';
  return 'Satisfactory';
}
