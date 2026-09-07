# 🚀 Med360 Production Launch Checklist (www.med360.mu)

Code-side launch work (SEO, security headers, legal pages, sitemap, robots,
API hardening) is **complete in this repository**. The steps below are the
manual actions that require your accounts (DNS registrar, Google, Bing, Vercel,
Resend).

---

## 1. DNS & Vercel Domain

| Record | Name | Value | Notes |
|--------|------|-------|-------|
| A      | `@` (med360.mu)      | `76.76.21.21`            | Points apex to Vercel |
| CNAME  | `www`                | `cname.vercel-dns.com`   | Points www to Vercel |
| TXT    | `@`                  | *(Google verification — step 3)* | Added later |

1. Vercel Dashboard → **your project → Settings → Domains** → add `med360.mu` **and** `www.med360.mu`.
2. Set **`www.med360.mu` as the Primary Domain** — Vercel will 301 `med360.mu → www.med360.mu` automatically.
3. Wait for SSL certificates to issue (automatic, usually < 15 min). Verify `https://www.med360.mu` shows a padlock.

## 2. Vercel Environment Variables

Project → Settings → Environment Variables (Production):

| Variable | Value |
|----------|-------|
| `VITE_SITE_URL` | `https://www.med360.mu` |
| `VITE_SUPABASE_URL` | your Supabase URL |
| `VITE_SUPABASE_ANON_KEY` | your Supabase anon key |
| `VITE_ADMIN_EMAIL` | your admin inbox (e.g. `info@med360.mu`) |
| `VITE_WHATSAPP_PHONE` | `23059188275` |
| `RESEND_API_KEY` | your Resend **server** key (keep secret) |
| `WHATSAPP_VERIFY_TOKEN` | a strong random token (webhook verification) |

Then **Redeploy** (Deployments → latest → Redeploy) so all variables take effect.

## 3. Google Search Console (SERP registration)

**Recommended: Domain property**
1. Go to <https://search.google.com/search-console> → **Add property → Domain** → enter `med360.mu`.
2. Google shows a **TXT record** — add it in your DNS (table above) and click **Verify**.
3. **Submit the sitemap**: Search Console → Sitemaps → enter `https://www.med360.mu/sitemap.xml` → Submit. (43 URLs: static pages + 15 hospitals + 15 specialties.)
4. **URL Inspection** → paste `https://www.med360.mu/` → **Request Indexing**. Repeat for `/hospitals`, `/specialties`, `/about`, `/how-it-works`, `/contact`.
5. Alternative (URL-prefix property): choose `https://www.med360.mu` → "HTML tag" method → paste the token into `index.html` where the marked `google-site-verification` placeholder sits (search for `PASTE_GSC_TOKEN_HERE`).

## 4. Bing Webmaster (Yahoo/DuckDuckGo reach)

1. <https://www.bing.com/webmasters> → **Import from Google Search Console** (fastest).
2. Optionally add the Bing meta token at the `msvalidate.01` placeholder in `index.html`.

## 5. Email Deliverability (Resend)

1. Resend Dashboard → **Domains → Add `med360.mu`** → add the shown **SPF + DKIM** DNS records.
2. Once verified, update the senders in `src/core/services/email.service.ts` & `campaign.service.ts` from `onboarding@resend.dev` to `Med360 <notifications@med360.mu>` (the API allowlist already accepts `@med360.mu`).

## 6. Pre-Flight Validation (run after first production deploy)

- [ ] `https://securityheaders.com` → grade **A** for `www.med360.mu`
- [ ] `https://www.ssllabs.com/ssltest/` → SSL grade A/A+
- [ ] `https://pagespeed.web.dev` → run mobile & desktop for `/`
- [ ] `https://search.google.com/test/rich-results` → validate `MedicalOrganization` + `WebSite` JSON-LD
- [ ] `https://developers.facebook.com/tools/debug/` → check Open Graph image & title for `/`
- [ ] Visit `https://www.med360.mu/robots.txt` and `https://www.med360.mu/sitemap.xml` — both resolve
- [ ] `https://www.med360.mu/.well-known/security.txt` resolves
- [ ] Old links redirect: `/doctors → /`, `/services → /how-it-works`, `/visa-guide → /how-it-works` (301)
- [ ] `/admin` returns header `X-Robots-Tag: noindex, nofollow` (DevTools → Network)
- [ ] Test the inquiry wizard end-to-end (email arrives) and WhatsApp click-to-chat
- [ ] Spot-check EN / FR / KR switching and dark mode

## 7. Security Notes (already implemented, FYI)

- Security headers (CSP, HSTS-preload, frame-deny, nosniff, referrer, permissions) enforced in `vercel.json`; equivalent Apache config in `deploy/.htaccess` if you ever self-host.
- `/api/resend/emails` is rate-limited, size-capped, and locked to `@resend.dev` / `@med360.mu` senders (anti-relay).
- WhatsApp webhook requires the `WHATSAPP_VERIFY_TOKEN` env var (no insecure default).
- `robots.txt` blocks `/admin` & `/api/`; admin routes send `X-Robots-Tag: noindex`.
- **Residual risk to know about:** `VITE_*` variables are public by nature. The Resend key has a client-side fallback (`VITE_RESEND_API_KEY`) for local dev — keep it **unset in production** so email sending only happens through the hardened server endpoint.

## 8. Optional (recommended next 30 days)

- Google Business Profile for the Port-Louis office (local SEO).
- GA4 analytics — note our cookie banner records consent before any tracking should load.
- Add real social profile URLs to the `sameAs` array in `src/core/services/schema.service.ts`.
- Monitor Search Console Performance weekly for the first month.
