# 🛡️ Med360 — Top 25 SEO & Security Measures

This document outlines the 25 core search engine optimization (SEO) and platform security implementations built into the Med360 application.

---

## 📈 Search Engine Optimization (SEO)

1. **Dynamic Document Head Tags**: Configured `react-helmet-async` across every route for customized titles, meta descriptions, and keywords.
2. **Canonical URL Enforcement**: Canonical link tags dynamically generated for all pages (`https://www.med360.mu/...`) preventing duplicate content penalties.
3. **Structured Data (JSON-LD)**: Injected `MedicalOrganization`, `WebSite`, and `BreadcrumbList` schemas enabling Google Rich Results and Knowledge Panels.
4. **Google Site Verification (Meta Tag)**: Integrated official verification token `<meta name="google-site-verification" content="3j7riaRlLP4HA23dZvDIahErTsWiJSNjPMB2ksAi09I" />`.
5. **Google Site Verification (HTML File)**: Uploaded `public/google14ff20f76e301b28.html` root verification target.
6. **Multi-Language XML Sitemaps**: 44 indexable routes registered in `/sitemap.xml` and `/sitemap_index.xml` featuring `xhtml:link` alternate language definitions (`fr`, `kr`, `en`).
7. **Search Engine Directives (`robots.txt`)**: Allows full crawling of public routes while blocking administrative portals (`/admin`) and API endpoints (`/api`).
8. **Multi-Language HTML Tag Synchronization**: Dynamically binds `<html lang="...">` with the user's active language (`fr`, `kr`, `en`) in real time.
9. **Semantic HTML5 Architecture**: Implements standard semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
10. **Strict Single `<h1>` Hierarchy**: Ensures one primary heading per page with logical cascading subheadings (`<h2>`, `<h3>`).
11. **Image Optimization & Native Lazy Loading**: All below-the-fold photography implements `loading="lazy"` with explicit aspect ratio constraints.
12. **Descriptive Localization-Aware `alt` Attributes**: All imagery contains meaningful, localized descriptions.
13. **Open Graph Protocol (OG)**: Injects rich social preview cards (`og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`).
14. **Twitter Card Metadata**: Supports `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image`.
15. **Google Tag Manager & Analytics**: Compatible with Google Analytics (gtag.js) and GTM container tracking with zero CSP violations.

---

## 🔒 Platform Security

16. **Strict Content Security Policy (CSP)**: Injected in `index.html` and `vercel.json` restricting scripts, styles, fonts, frames, and connections to trusted domains (Google, Cloudflare, Resend, Supabase).
17. **Referrer Policy**: Enforced `strict-origin-when-cross-origin` across all responses to prevent PII leakage.
18. **Browser Permissions Policy**: Explicitly disables sensitive browser features (`camera=(), microphone=(), geolocation=()`).
19. **Clickjacking Defense**: Applied `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` directives preventing iframe embedding.
20. **MIME Sniffing Prevention**: Enforced `X-Content-Type-Options: nosniff`.
21. **HTTP Strict Transport Security (HSTS)**: Enforced `max-age=63072000; includeSubDomains; preload` for full HTTPS enforcement.
22. **External Link Hardening**: All outbound links targeting external domains implement `target="_blank"` with `rel="noopener noreferrer"`.
23. **Anti-Spam & Rate Limiting**: Inquiry submissions throttled by client-side anti-flooding controls, and admin login protected by brute-force lockout (3 failed attempts $\to$ 5-minute lockout).
24. **Serverless Email Proxy Hardening**: `/api/resend/emails` validates payload sizes, enforces strict rate limits, and restricts sender addresses to approved domains (`@med360.mu`, `@resend.dev`).
25. **Admin Route Guards & Search Index Exclusion**: Protected admin routes require valid authentication and deliver `X-Robots-Tag: noindex, nofollow` headers.
