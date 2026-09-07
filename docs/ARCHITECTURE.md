# 🏛️ Med360 — Architecture & Technical Specifications

## 1. System Architecture Overview

Med360 is a high-performance single-page application (SPA) designed for international medical tourism and healthcare concierge services. Owned and operated by the Mauritian registered NGO **Enn Rêv Enn Sourir**, Med360 follows domain-driven design (DDD) principles with a resilient dual-mode data layer:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Presentation Layer                            │
│  (Features: Home, About, Hospitals, Specialties, How It Works,         │
│   Cost Calculator, Case Studies, Describe Need Wizard, Contact, Legal) │
├────────────────────────────────────────────────────────────────────────┤
│                           Application Layer                            │
│     (Custom Hooks: useCMS, useHospitals, useSpecialties, useDoctors,   │
│      useInquiry, useCaseStudies, useToast, useCurrency)                │
├────────────────────────────────────────────────────────────────────────┤
│                            Provider Layer                              │
│       (AuthProvider, DataProvider, ThemeProvider, HelmetProvider)      │
├────────────────────────────────────────────────────────────────────────┤
│                             Domain Layer                               │
│       (Entities, Schemas, Formatting, L10n, Cost Engine, Resend)       │
├────────────────────────────────────────────────────────────────────────┤
│                     Data & Persistence Layer                           │
│  ┌─────────────────────────────────┐ ┌───────────────────────────────┐ │
│  │   Supabase Cloud Backend        │ │    Resilient Mock Engine      │ │
│  │   (PostgreSQL, RLS, Auth)       │ │ (LocalStorage & Deep Merge)   │ │
│  └─────────────────────────────────┘ └───────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. State & Data Persistence Layer

### 2.1 Dual-Mode Data Architecture
The platform runs seamlessly in two operational modes:
1. **Cloud Mode (Supabase)**: When configured via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, queries execute directly against production PostgreSQL tables with Row-Level Security (RLS).
2. **Local / Fallback Mode (MockEngine)**: When offline, during testing, or if credentials are unset, the application automatically runs on `src/core/mock/engine.ts`:
   - **LocalStorage Store**: Persisted under `med360_mock_store_v2`.
   - **Deep-Merge on Initialization**: `mergeCms()` dynamically reconciles local modifications with updated seed schemas, ensuring zero undefined keys or UI breaks.
   - **Configurable Network Latency**: Simulates realistic network round-trips (`normal: 300ms`, `slow: 1000ms`, `instant: 0ms`).

### 2.2 5-Layer Request Minimization Cache
- **Inflight Request Collapsing**: Deduplicates simultaneous duplicate requests into a single network Promise.
- **L1 RAM Hot Cache**: In-memory cache providing sub-millisecond retrieval (0ms latency).
- **L2 Persistent Storage Cache**: LocalStorage-backed cache with time-to-live (TTL).
- **Derived Projections**: Single entity lookups derive locally from cached master collections.
- **Tag-Based Invalidation**: Mutations invalidate only related resource tags (e.g. `hospitals`, `specialties`).

---

## 3. Hospital & Specialty Catalog Matrix

### 3.1 15 Premier Indian Accredited Hospitals
Med360 maintains direct clinical concierge partnerships with 15 leading hospitals across India:
1. **Apollo Hospitals** – Chennai & Navi Mumbai (JCI, NABH)
2. **Manipal Hospital** – Bengaluru (NABH, AAHRPP)
3. **Fortis Memorial Research Institute & Fortis Hospital** – Gurugram & Mulund (JCI, NABH)
4. **MGM Healthcare** – Chennai (JCI, NABH)
5. **MIOT International** – Chennai (NABH, NABL)
6. **Artemis Hospital** – Gurugram (JCI, NABH)
7. **BLK-Max Super Speciality Hospital** – New Delhi (JCI, NABH)
8. **Gleneagles HealthCity** – Chennai (NABH, NABL)
9. **Dr. Rela Institute & Medical Centre** – Chennai (JCI, NABH)
10. **Amrita Hospital** – Kochi & Faridabad (NABH, ISO)
11. **SIMS Hospital (SRM Institutes for Medical Science)** – Chennai (JCI, NABH)
12. **Yashoda Hospitals** – Hyderabad (NABH, NABL)
13. **Marengo Asia Hospitals** – Gurugram (NABH, JCI)
14. **Kauvery Hospital** – Chennai (NABH, NABL)
15. **Max Super Speciality Hospital** – Saket, New Delhi (NABH, JCI)

### 3.2 15 Core Clinical Specialties
1. **Oncology & Cancer Care** (Chemotherapy, Radiation, Surgical Oncology, Bone Marrow Transplant)
2. **Cardiology & Heart Surgery** (CABG, Valve Replacement, Angioplasty, TAVR, Pediatric Cardiac)
3. **Orthopedics & Joint Replacement** (Total Knee/Hip Replacement, Spine Surgery, Arthroscopy)
4. **Organ Transplant** (Liver, Kidney, Heart, Lung, Bone Marrow)
5. **Neurosurgery & Spine Surgery** (Brain Tumor Resection, Minimally Invasive Spine Surgery, DBS)
6. **Robotic Surgery** (Da Vinci Robotic Prostatectomy, Gynecologic & Bariatric Surgery)
7. **IVF & Assisted Reproduction** (IVF, ICSI, Egg Freezing, PGT-A Genetic Screening)
8. **Urology & Andrology** (Laser Kidney Stone, Robotic Prostatectomy, Reconstructive Urology)
9. **Gastroenterology & Hepatology** (GI Endoscopy, ERCP, Cirrhosis, Pancreatic Care)
10. **Pediatric Cardiac & Surgery** (Congenital Heart Defects, Pediatric Neurosurgery, Neonatal Care)
11. **Bariatric & Metabolic Surgery** (Gastric Bypass, Sleeve Gastrectomy, Diabetes Resolution)
12. **Ophthalmology & Retina** (Laser Cataract, Vitreoretinal Surgery, LASIK, Corneal Transplant)
13. **ENT, Head & Neck Surgery** (Cochlear Implants, Thyroidectomy, Skull Base Surgery)
14. **Pulmonology & Lung Transplant** (Advanced COPD, Interventional Pulmonology, ECMO)
15. **Reconstructive & Plastic Surgery** (Post-Trauma Reconstruction, Microvascular Surgery, Burn Care)

---

## 4. Email Notification & Lead Tracking Pipeline

Med360 implements an end-to-end lead attribution and notification service (`src/core/services/email.service.ts`):

```
┌────────────────────────────────────────────────────────────────────────┐
│  Patient / Client Submissions:                                         │
│  - Multi-step Intake Wizard (/describe-need)                           │
│  - Contact Page (/contact)                                             │
│  - Header / Mobile Menu CTA                                            │
│  - Footer CTA                                                          │
│  - Hospital / Specialty / Cost Calculator / Case Studies CTAs          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Attribution & Payload Enrichment:                                     │
│  - Sender Identity (Full Name, Email, Phone/WhatsApp, Country)         │
│  - Context (Target Hospital, Specialty, Procedure/Service, Budget)     │
│  - Traffic Origin (Source Page, Full Referrer URL, Urgency Level)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Resend Serverless Email Dispatcher:                                   │
│  - Recipient: kevinadlib@gmail.com (Testing) / VITE_ADMIN_EMAIL        │
│  - Actionable HTML Template:                                           │
│    • 1-Click WhatsApp Button (Pre-filled response in French/English)   │
│    • 1-Click Direct Email Reply (mailto:)                              │
│    • 1-Click Direct Phone Dial (tel:)                                  │
│    • 1-Click Open Lead in Admin Portal                                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Multilingual & Localization Architecture

The platform supports 3 primary languages:
- 🇫🇷 **French (`fr`)** — Primary language for Mauritius, Réunion, Madagascar, and Francophone Africa.
- 🇲🇺 **Kreol Morisien (`kr`)** — Local vernacular for Mauritian accessibility.
- 🇬🇧 **English (`en`)** — International patient standard.

### Dynamic CMS Translation Fallback:
```typescript
export const tCms = (key: string, fallback: string) => {
  if (!cms?.content?.[key]) return fallback;
  return cms.content[key][i18n.language] || cms.content[key]['fr'] || cms.content[key]['en'] || fallback;
};
```
Content edited in `/admin/pages` immediately overrides static copy in the active language, cleanly falling back to seed copy when unpopulated.

---

## 6. Routing Hierarchy & Public Endpoints

| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Hero, NGO mission banner, 4-step concierge process, featured specialties & hospitals |
| `/about` | `AboutPage` | Enn Rêv Enn Sourir NGO ownership, 4 core pillars, clinical standards |
| `/how-it-works` | `HowItWorksPage` | Full concierge process (Second Opinion, Medical Visa, Travel, Care & Post-Op) |
| `/hospitals` | `HospitalsPage` | Searchable directory of all 15 Indian partner hospitals with city/accreditation filters |
| `/hospitals/:id` | `HospitalDetailPage` | Inside hospital specs: bed counts, accreditations, specialties, procedures & contact |
| `/specialties` | `SpecialtiesPage` | Searchable directory of all 15 medical specialties with procedures & price benchmarks |
| `/specialties/:id` | `SpecialtyDetailPage` | Inside specialty breakdown: procedures list, duration, cost ranges, partner hospitals |
| `/cost-calculator` | `CostCalculatorPage` | Multi-currency interactive savings calculator (USD/MUR vs. Western pricing) |
| `/case-studies` | `CaseStudiesPage` | Real verified patient recovery testimonials and clinical outcomes |
| `/describe-need` | `DescribeNeedPage` | Multi-step medical intake wizard with dynamic query param preselection |
| `/contact` | `ContactPage` | Mauritius office location, 24/7 WhatsApp hotline, direct contact form |
| `/privacy` | `PrivacyPolicyPage` | Data protection, GDPR & Mauritian Data Protection Act compliance |
| `/terms` | `TermsOfServicePage` | Terms of service and concierge service agreement |
| `/cookies` | `CookiePolicyPage` | Cookie policy and user tracking preferences |
| `/medical-disclaimer` | `MedicalDisclaimerPage` | Non-diagnostic legal medical disclaimer |
| `/admin/*` | `AdminLayout` | Protected administrative management portal |
| `/doctors` | *Redirect* | 301 Redirect to `/hospitals` / `/` |
| `/services` | *Redirect* | 301 Redirect to `/how-it-works` |
| `/visa-guide` | *Redirect* | 301 Redirect to `/how-it-works` |

---

## 7. Search Engine Optimization & Verification

- **Sitemaps**: 44 indexable routes registered in `/sitemap.xml` and `/sitemap_index.xml` with `xhtml:link` multi-language alternates.
- **Search Engine Directives**: `public/robots.txt` indexing public routes while blocking `/admin` and `/api`.
- **Google Site Verification**:
  - Meta tag in `index.html`: `<meta name="google-site-verification" content="3j7riaRlLP4HA23dZvDIahErTsWiJSNjPMB2ksAi09I" />`
  - HTML verification file: `public/google14ff20f76e301b28.html`
- **Analytics & Tracking**: Google Tag Manager & Google Analytics (gtag.js) integrations with strict CSP compatibility.
- **Structured Data**: Injected JSON-LD schemas (`MedicalOrganization`, `WebSite`, `BreadcrumbList`).
