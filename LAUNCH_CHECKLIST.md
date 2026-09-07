# 🚀 Med360 Production Launch Checklist (www.med360.mu)

Code-side launch work (SEO, security headers, legal pages, sitemaps, robots.txt, Google verification meta/file, and API hardening) is **complete in this repository**. The steps below outline the final deployment configurations and verification procedures.

---

## 1. DNS & Vercel Domain

| Record | Name | Value | Notes |
|--------|------|-------|-------|
| A      | `@` (med360.mu)      | `76.76.21.21`            | Points apex to Vercel |
| CNAME  | `www`                | `cname.vercel-dns.com`   | Points www to Vercel |
| TXT    | `@`                  | *(Google verification)*  | Domain-level DNS TXT verification |

1. Vercel Dashboard → **your project → Settings → Domains** → add `med360.mu` **and** `www.med360.mu`.
2. Set **`www.med360.mu` as the Primary Domain** — Vercel will 301 `med360.mu → www.med360.mu` automatically.
3. Wait for SSL certificates to issue (automatic, usually < 15 min). Verify `https://www.med360.mu` shows a valid SSL padlock.

---

## 2. Vercel Environment Variables

Project → Settings → Environment Variables (Production):

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_SITE_URL` | `https://www.med360.mu` | Production canonical base URL |
| `VITE_SUPABASE_URL` | your Supabase URL | PostgreSQL database connection |
| `VITE_SUPABASE_ANON_KEY` | your Supabase anon key | Public client API key |
| `VITE_ADMIN_EMAIL` | `kevinadlib@gmail.com` | Lead notification recipient (`info@med360.mu` for prod) |
| `VITE_WHATSAPP_PHONE` | `23059188275` | 24/7 WhatsApp consultation hotline |
| `RESEND_API_KEY` | your Resend server key | Secret serverless key (never expose to client) |
| `WHATSAPP_VERIFY_TOKEN` | a strong random token | Meta Graph webhook verification |

Then **Redeploy** (Deployments → latest → Redeploy) so all variables take effect.

---

## 3. Google Search Console (SERP Registration)

### Verification (Already Implemented in Codebase):
- **HTML Meta Tag**: `<meta name="google-site-verification" content="3j7riaRlLP4HA23dZvDIahErTsWiJSNjPMB2ksAi09I" />` is live in `index.html`.
- **HTML File Verification**: `public/google14ff20f76e301b28.html` is present in the public root.

### Action Items:
1. Go to <https://search.google.com/search-console> → **Add property** → Select URL prefix `https://www.med360.mu` or Domain `med360.mu` → Click **Verify** (verification will succeed immediately via the meta tag or HTML file).
2. **Submit Sitemap**: Search Console → Sitemaps → enter `https://www.med360.mu/sitemap.xml` → Click **Submit** (44 URLs: static pages + 15 hospitals + 15 specialties).
3. **URL Inspection**: Inspect `https://www.med360.mu/` → Click **Request Indexing**. Repeat for `/hospitals`, `/specialties`, `/about`, `/how-it-works`, `/cost-calculator`, and `/contact`.

---

## 4. Bing Webmaster (Yahoo/DuckDuckGo Reach)

1. Navigate to <https://www.bing.com/webmasters> → **Import from Google Search Console** (1-click sync).
2. Sitemaps and verified URLs will synchronize automatically.

---

## 5. Email Deliverability (Resend)

1. Resend Dashboard → **Domains → Add `med360.mu`** → add the shown **SPF + DKIM** DNS records.
2. Notifications are currently sent to `kevinadlib@gmail.com` with rich patient context and 1-click triage links.
3. Once the custom domain is verified in Resend, notifications will route from `Med360 <notifications@med360.mu>`.

---

## 6. Pre-Flight Validation Checklist

- [ ] `https://securityheaders.com` → grade **A** for `www.med360.mu`
- [ ] `https://www.ssllabs.com/ssltest/` → SSL grade A/A+
- [ ] `https://pagespeed.web.dev` → run mobile & desktop for `/`
- [ ] `https://search.google.com/test/rich-results` → validate `MedicalOrganization` + `WebSite` JSON-LD
- [ ] `https://developers.facebook.com/tools/debug/` → check Open Graph image & title for `/`
- [ ] Visit `https://www.med360.mu/robots.txt` and `https://www.med360.mu/sitemap.xml` — both resolve cleanly
- [ ] `https://www.med360.mu/.well-known/security.txt` resolves
- [ ] Old links redirect cleanly: `/doctors → /hospitals`, `/services → /how-it-works`, `/visa-guide → /how-it-works` (301)
- [ ] `/admin` returns header `X-Robots-Tag: noindex, nofollow`
- [ ] Test the inquiry wizard end-to-end (email arrives at `kevinadlib@gmail.com`) and WhatsApp click-to-chat
- [ ] Spot-check FR / KR / EN switching and dark mode

---

## 7. Security Hardening Notes

- Security headers (CSP, HSTS-preload, frame-deny, nosniff, referrer, permissions) enforced in `vercel.json` and `index.html`.
- `/api/resend/emails` is rate-limited, size-capped, and locked to `@resend.dev` / `@med360.mu` senders (anti-relay).
- WhatsApp webhook requires `WHATSAPP_VERIFY_TOKEN` env var.
- `robots.txt` blocks `/admin` & `/api/`; admin routes send `X-Robots-Tag: noindex`.
