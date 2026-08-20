# 🏛️ Medical 360 — Architecture & Technical Specifications

## 1. System Architecture Overview

Medical 360 is built as a single-page application (SPA) following domain-driven design (DDD) principles on the frontend. The codebase is organized into layers:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│  (Features, Pages, Inside Detail Views, Components)    │
├────────────────────────────────────────────────────────┤
│                    Application Layer                   │
│   (Custom Hooks: useCMS, useDoctors, useHospitals)     │
├────────────────────────────────────────────────────────┤
│                     Provider Layer                     │
│      (AuthProvider, DataProvider, ThemeProvider)       │
├────────────────────────────────────────────────────────┤
│                      Domain Layer                      │
│     (Entity Interfaces, Services, Formatting Rules)    │
├────────────────────────────────────────────────────────┤
│                   Data / Adapter Layer                 │
│   (MockEngine with LocalStorage Deep-Merge Store)      │
└────────────────────────────────────────────────────────┘
```

---

## 2. State & Data Flow

### The Mock Engine Singleton (`src/core/mock/engine.ts`)
The application currently operates on a local-first mock engine that simulates a real backend with configurable network latency:
- **Persistence**: All state (Hospitals, Specialties, Doctors, Case Studies, Inquiries, CMS Pages) is stored in `localStorage` under `med360_mock_store_v2`.
- **Deep Merge on Startup**: When new seed fields or pages are added in code, `mergeCms()` recursively combines existing local edits with fresh seed definitions, ensuring that no keys are ever missing or undefined.
- **Latency Simulator**: Emulates realistic network round-trips (`normal: 300ms`, `slow: 1000ms`, `instant: 0ms`).

---

## 3. The 7 Doctors Ecosystem Policy

In accordance with platform directives:
> **"There can be only 7 doctors in the whole of the ecosystem."**

The platform maintains exactly 7 world-leading specialists across key hospital affiliations and medical disciplines:
1. **Dr. Devi Prasad Shetty** (Cardiothoracic Surgery, Narayana Health)
2. **Dr. Naresh Trehan** (Cardiovascular & Robotic Surgery, Medanta)
3. **Dr. Suthep Udomsawaengsup** (Minimally Invasive & Bariatric Surgery, Bumrungrad International)
4. **Dr. Wong Chiung Ing** (Medical Oncology, Gleneagles Singapore)
5. **Prof. Dr. Subhash Gupta** (Liver Transplant, Apollo Hospitals Chennai)
6. **Dr. Firuza R. Parikh** (Assisted Reproduction & IVF, Fortis Memorial)
7. **Dr. Arun Saroha** (Neurosurgery & Spine Surgery, Apollo Hospitals Delhi)

---

## 4. Multilingual & Localization Architecture

Localization supports three primary languages:
- 🇫🇷 **French (`fr`)**
- 🇲🇺 **Kreol Morisien (`kr`)**
- 🇬🇧 **English (`en`)**

### Dynamic Fallback Pattern:
Components utilize the `tCms` and `l10n` helper pattern:
```typescript
const tCms = (key: string, fallback: string) => {
  if (!cms?.content?.[key]) return fallback;
  return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
};
```
This guarantees that if a translation key is edited in the Admin CMS, it immediately overrides static text; if left blank, it cleanly falls back to the default localized string.

---

## 5. Routing Hierarchy

| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Public hero, why Med360, 4 steps, specialties preview, testimonials |
| `/about` | `AboutPage` | Mission, 4 pillars, accreditation guarantees, patient statistics |
| `/hospitals` | `HospitalsPage` | Searchable directory with country & accreditation filters |
| `/hospitals/:id` | `HospitalDetailPage` | Inside view: specs, beds, ratings, procedures & affiliated doctors |
| `/specialties` | `SpecialtiesPage` | Specialty grid with key procedures & cost ranges |
| `/specialties/:id` | `SpecialtyDetailPage` | Inside view: comprehensive breakdown, procedures table, duration & hospitals |
| `/doctors` | `DoctorsPage` | Directory of the 7 world-renowned specialists with filtering |
| `/services` | `ServicesPage` | Detailed breakdown of the 6 core medical concierge services |
| `/case-studies` | `CaseStudiesPage` | Verified patient testimonials and recovery stories |
| `/describe-need` | `DescribeNeedPage` | Multi-step medical intake wizard with WhatsApp handoff |
| `/contact` | `ContactPage` | Office address, phone, email, and operating hours |
| `/admin/*` | `AdminLayout` | Protected admin management portal with auth guard |
