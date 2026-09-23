# 🛡️ Med360 — Top 25 SEO & Security Measures (Google SERP & Search Console)

This document details the 25 core search engine optimization (SEO), Google Search Console (GSC), SERP rich results, and defense-in-depth platform security implementations active in Med360 (`www.med360.mu`).

---

## 📈 Search Engine Optimization (SEO) & Google SERP Rich Snippets

1. **Google Search Console Ownership Verification**: Dual verification active via root meta tag (`<meta name="google-site-verification" content="3j7riaRlLP4HA23dZvDIahErTsWiJSNjPMB2ksAi09I" />`) and static target file (`public/google14ff20f76e301b28.html`).
2. **SERP Google Sitelinks Searchbox (`SearchAction`)**: Integrated `WebSite` JSON-LD schema with `potentialAction: SearchAction` targeting `https://www.med360.mu/specialties?q={search_term_string}` enabling Google site search directly on the SERP.
3. **SERP Expandable FAQ Rich Snippets (`FAQPage`)**: Embedded comprehensive `FAQPage` JSON-LD schema with real patient Q&As (free second opinions, partner hospital network, NGO ownership, cost savings), qualifying for Google SERP expandable accordion widgets.
4. **Local Business & Geo Coordinates (`MedicalBusiness`)**: Injected `MedicalBusiness` schema with physical Port Louis coordinates (`-20.1609`, `57.5012`), 24/7 operating hours, currency definitions (`MUR`, `USD`, `EUR`), and accepted payment methods.
5. **Medical Knowledge Graph (`MedicalOrganization`)**: Injected `MedicalOrganization` schema linking NGO ownership (*Enn Rêv Enn Sourir*), phone hotline, contact points, and 10 clinical specialties for Google Knowledge Panel activation.
6. **Multi-Lingual XML Sitemap with `xhtml:link`**: 42 canonical indexable routes in `public/sitemap.xml` with `xmlns:xhtml="http://www.w3.org/1999/xhtml"` defining alternate language targets (`en`, `fr`, `fr-MU`, `x-default`).
7. **Sitemap Index (`sitemap_index.xml`)**: Clean entrypoint sitemap index referencing `https://www.med360.mu/sitemap.xml` with updated `lastmod` timestamps.
8. **Canonical URL Enforcement**: Every page dynamically generates fully qualified canonical link tags (`https://www.med360.mu/...`), eliminating duplicate content penalties.
9. **Zero-Redirect Sitemap Hygiene**: Sitemaps and robots rules strictly exclude internal redirects (`/cost-calculator`, `/visa-guide`), ensuring only 200 OK canonical pages are submitted to Google Search Console.
10. **Robots.txt Directives (GEO & AI Agents)**: Full crawler permissions for traditional engines (Googlebot, Bingbot) and modern Generative Search agents (GPTBot, ClaudeBot, PerplexityBot) with explicit `Sitemap:` pointers and `/admin` exclusion.
11. **Multi-Lingual BCP 47 `<link rel="alternate">` Tags**: Dynamic `<head>` injection of `hreflang="en"`, `hreflang="fr"`, `hreflang="fr-MU"` (Mauritius localization), and `hreflang="x-default"`.
12. **Dynamic `<html lang="...">` Root Synchronization**: Real-time synchronization of the HTML document language attribute when users toggle between English, French, and Kreol Morisien.
13. **Semantic HTML5 & Single `<h1>` Hierarchy**: Strict single `<h1>` heading per page with logical descending hierarchy (`<h2>`, `<h3>`) and semantic landmark elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).
14. **Image Optimization & Native Lazy Loading**: Below-the-fold photography enforces `loading="lazy"` and `decoding="async"` with explicit aspect ratio bounding to eliminate Cumulative Layout Shift (CLS).
15. **Open Graph & Twitter Cards**: High-resolution 1200×630 `og:image`, `og:title`, `og:description`, `og:site_name`, and `twitter:card="summary_large_image"` on all public pages for rich social previews.

---

## 🔒 Platform Security & Developer Console Hygiene

16. **Clean Developer Console Engine (Zero Red Errors)**: Google Tag Manager and Analytics scripts guarded to prevent 404 network fetch errors or unhandled promise exceptions when running without live tracking tokens, while providing a synchronous `window.gtag` event queue.
17. **Strict Content Security Policy (CSP)**: Defense-in-depth CSP applied in `vercel.json` and `index.html` restricting scripts, styles, fonts, frames, and connections to verified hosts (Google, Cloudflare, Resend, Supabase).
18. **HTTP Strict Transport Security (HSTS)**: Enforced `max-age=63072000; includeSubDomains; preload` for full HTTPS enforcement.
19. **Clickjacking & Frame Hijacking Defense**: Hardened with `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`, prohibiting unauthorized iframe embedding.
20. **MIME Sniffing Prevention**: Enforced `X-Content-Type-Options: nosniff`.
21. **Strict Referrer Policy**: Enforced `strict-origin-when-cross-origin` across all HTTP responses, shielding sensitive patient health query strings.
22. **Browser Permissions Policy**: Explicitly denies sensitive browser sensors (`camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`).
23. **Outbound External Link Hardening**: All third-party links implement `target="_blank"` with `rel="noopener noreferrer"`.
24. **Anti-Spam & Admin Brute-Force Lockout**: Inquiry forms throttled by client-side flood protection; admin authentication protected by progressive 3-attempt lockout defense.
25. **Serverless Email Proxy Validation**: `/api/resend/emails` enforces payload size caps, rate limiting, and restricts sender addresses to approved domains (`@med360.mu`, `@resend.dev`).

---

*© 2026 Med360 Ltd. All rights reserved. Port Louis, Mauritius.*
