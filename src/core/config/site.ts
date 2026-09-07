/**
 * Med360 — Central Site Configuration
 *
 * Single source of truth for absolute URLs used by SEO artifacts
 * (canonical links, Open Graph, JSON-LD, hreflang). Override in
 * deployment environments with the VITE_SITE_URL environment variable.
 */
export const SITE_URL: string = ((import.meta.env.VITE_SITE_URL as string | undefined) || 'https://www.med360.mu').replace(/\/+$/, '');

export const SITE_NAME = 'Med360';
export const LEGAL_NAME = 'Med360 Ltd';
export const CONTACT_EMAIL = 'info@med360.mu';
export const PRIVACY_EMAIL = 'privacy@med360.mu';
export const WHATSAPP_DISPLAY = '+230 5918 8275';
