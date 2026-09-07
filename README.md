# 🩺 Med360 — International Healthcare Concierge Platform

> **Connecting Mauritian and Indian Ocean patients to accredited world-class hospitals and specialists.**  
> Includes the **Web Application** (`medical360`) and **Cross-Platform Mobile App** (`medical360-mobile`).

---

## 📋 Table of Contents
1. [Overview & Mission](#-overview--mission)
2. [Key Platform Features](#-key-platform-features)
3. [Technology Stack & Design System](#-technology-stack--design-system)
4. [Architecture & Folder Structure](#-architecture--folder-structure)
5. [Getting Started](#-getting-started)
6. [Cross-Platform Mobile App (iOS & Android)](#-cross-platform-mobile-app)
7. [Admin Portal & CMS Guide](#-admin-portal--cms-guide)
8. [Database Backup & 1-Click Restore](#-database-backup--1-click-restore)
9. [Security & SEO Implementation](#-security--seo-implementation)
10. [Documentation Links](#-documentation-links)

---

## 🌟 Overview & Mission

**Med360** (Med360 Ltd) is a specialized medical concierge social enterprise based in Port Louis, Mauritius, wholly owned by the registered NGO **Enn Rêv Enn Sourir**. 

For over a decade, Enn Rêv Enn Sourir has funded and coordinated life-saving medical care abroad for underprivileged patients. Med360 extends world-class healthcare navigation services to private and corporate clients:
- **100% of net company profits** are reinvested into the NGO's medical assistance fund to sponsor surgeries for patients in need.
- **15 Accredited Premier Hospitals** across India (Apollo Hospitals Chennai & Navi Mumbai, Manipal Hospital Bengaluru, Fortis Memorial & Mulund, MGM Healthcare Chennai, MIOT International Chennai, Artemis Gurugram, BLK-Max Super Speciality New Delhi, Gleneagles HealthCity Chennai, Dr. Rela Institute Chennai, Amrita Hospital Kochi & Faridabad, SIMS Hospital Chennai, Yashoda Hospitals Hyderabad, Marengo Asia Gurugram, Kauvery Hospital Chennai, Max Super Speciality Saket New Delhi).
- **15 Medical Specialties & Detailed Procedures Catalog** (Oncology, Cardiology, Orthopedics, Organ Transplant, Neurosurgery & Spine, Robotic Surgery, IVF & Fertility, Urology & Andrology, Gastroenterology & Hepatology, Pediatric Cardiac & Surgery, Bariatrics, Ophthalmology, ENT, Pulmonology, Plastic Surgery).
- **Free expert medical second opinions** and all-inclusive treatment quotes within 24–48 hours.
- **Full end-to-end travel & visa logistics**: flight coordination, medical visa assistance, VIP airport transfers, local accommodation, and dedicated Mauritian patient navigators.

---

## 🚀 Key Platform Features

### 🌐 Patient-Facing Portal
- **Multilingual Support (EN / FR / KR)**: Seamless toggle between English, Français, and Kreol Morisien with automatic `<html>` attribute synchronization.
- **Interactive Intake Wizard (`/describe-need`)**: Multi-step medical intake form with specialty selection, urgency ratings, hospital preselection, traffic origin attribution, and automated email notification dispatch.
- **Hospital Directory & Detail Pages (`/hospitals` & `/hospitals/:id`)**: Search & filter by city, bed count, international patient volume, and accreditations (JCI, NABH, NABL).
- **Specialties & Procedures Catalog (`/specialties` & `/specialties/:id`)**: Comprehensive guides with price estimation in USD & MUR, recovery timelines, and affiliated hospitals.
- **Interactive Treatment Cost Calculator (`/cost-calculator`)**: Multi-currency benchmark comparing Western medical rates against accredited Indian hospitals with up to 90% savings.
- **Comprehensive 6-Stage Patient Guide (`/how-it-works`)**: Step-by-step breakdown from initial enquiry to post-treatment recovery care.
- **Verified Patient Success Stories (`/case-studies`)**: Real patient testimonials, outcomes, and cost-savings statistics.
- **Full Legal & Compliance Suite**: Privacy Policy (`/privacy`), Terms of Service (`/terms`), Cookie Policy (`/cookies`), and Medical Disclaimer (`/medical-disclaimer`).

### 🛡️ Admin & CMS Portal (`/admin`)
- **Real-Time CMS Page Editor (`/admin/pages/:pageId`)**: Live text editing for all pages with language tabs (FR, KR, EN) and instant site synchronization.
- **Email Template Customizer & Dispatch Engine (`/admin/email-templates`)**: Customizable notification templates, live HTML preview, and test dispatch to `kevinadlib@gmail.com`.
- **Core Data Management**: Dedicated CRUD interfaces with inline workstations for:
  - *Partner Hospitals* (`/admin/hospitals`)
  - *Medical Specialties & Procedures* (`/admin/specialties`)
  - *Patient Success Stories* (`/admin/case-studies`)
  - *Inquiry Management & Status Pipeline* (`/admin/inquiries`)
  - *Broadcast Campaign Center* (`/admin/campaigns`)
  - *Mission Marquee Ribbon Manager* (`/admin/marquee`)

---

## 🎨 Technology Stack & Design System

| Layer | Technology |
| :--- | :--- |
| **Core Framework** | React 19 + TypeScript + Vite |
| **Routing** | React Router v7 (`react-router-dom`) |
| **Styling** | Vanilla CSS with CSS Custom Properties (Clean responsive design system) |
| **Internationalization** | `i18next` + `react-i18next` (EN, FR, KR) |
| **SEO & Meta** | `react-helmet-async` + Schema.org JSON-LD + Sitemap XML |
| **Icons** | Lucide React (`lucide-react`) |
| **Data Engine** | Dual-Mode: Supabase Live PostgreSQL + LocalStorage Reactive Fallback |
| **Email Notification** | Resend API Integration (`/api/resend/emails`) with automated lead alerts |

### 🎨 Design Rules
- **Three-Color Palette**: 
  - Emerald Green (`#065f46` / `--color-primary`)
  - Dark Slate (`#090d10` / `--color-dark`)
  - Clean Surface White (`#ffffff` / `--color-surface`)
- **Typography**: Inter / Outfit modern sans-serif typography.
- **Visuals**: Full-width imagery, glassmorphism cards, micro-animations, and zero placeholder art.

---

## 📁 Architecture & Folder Structure

```
medical360/
├── public/                    # Static assets & optimized local banner imagery
│   └── assets/banners/        # High-definition local banners & medical imagery
├── src/
│   ├── components/            # Reusable UI components (Navbar, Footer, Pagination, SEO, WhatsApp)
│   ├── core/                  # Core domain architecture, types & services
│   │   ├── mock/              # Mock engine singleton & multilingual data seeds
│   │   ├── services/          # Services (backup, email, whatsapp, security, format, export)
│   │   ├── supabase/          # Supabase client & live PostgreSQL integration
│   │   └── types/             # Domain TypeScript interfaces
│   ├── features/              # Feature pages & routes (hospitals, doctors, wizard, admin)
│   │   ├── admin/             # Complete Admin CMS, Inquiries, Settings, Campaigns
│   │   └── ...                # Public pages (home, about, services, specialties, etc.)
│   ├── hooks/                 # Custom React data hooks (useCMS, useInquiry, useDoctors, etc.)
│   ├── i18n/                  # Multi-language configuration (EN / FR / KR)
│   ├── providers/             # Global Context Providers (Auth, Data, Theme)
│   └── styles/                # Design system tokens, typography & global utilities
├── docs/                      # Technical documentation & admin guides
└── package.json
```

---

## 📱 Cross-Platform Mobile App

The mobile codebase is located in [`d:\WEB 2026\medical360-mobile`](file:///d:/WEB%202026/medical360-mobile):
- **Framework**: React Native 0.76 + Expo SDK 52.
- **100% Feature Parity**: Full Patient Portal, Intake Wizard, The 7 Specialists, and Admin & Live CMS suite.
- **Store Compliance**: Aligned with Apple App Store 2025/2026 (Privacy Manifests, Guideline 1.4.1) and Google Play Android 15/16.

---

## 💾 Database Backup & 1-Click Restore

All database schemas (SQL DDL & JSON Schema), relational seed data, and CMS content are archived in versioned snapshots under `backups/`:
- **Create New Full Backup**: `npm run backup`
- **Verify & Restore Latest Backup**: `npm run restore:latest`
- **PostgreSQL / MySQL / SQLite Import**: `psql -U postgres -d medical360 -f backups/latest/medical360_database.sql`
- **Backup Manifest & Branch State**: See `backups/latest/manifest.json` and `backups/latest/branches_manifest.txt`.

---

## 💻 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (Vite)
npm run dev

# 3. Create a full database & git backup
npm run backup

# 4. Run typecheck & build bundle
npm run build
```

---

## 🔐 Admin Portal & Credentials

Navigate to `/admin` or `/admin/login`:
- **Admin Email**: `admin@med360.mu`
- **Case Manager Email**: `case@med360.mu`
- **Password**: `med360admin`

---

## 📚 Documentation Links
- [🏛️ Architectural Design Document](file:///d:/WEB%202026/medical360/docs/ARCHITECTURE.md)
- [🛡️ Admin & Content Manager Guide](file:///d:/WEB%202026/medical360/docs/ADMIN_GUIDE.md)
- [🛡️ SEO & Security Audit](file:///d:/WEB%202026/medical360/docs/SECURITY_AND_SEO.md)
- [📱 Mobile Architecture & Store Compliance](file:///d:/WEB%202026/medical360-mobile/docs/ARCHITECTURE.md)

---
*© 2026 Med360 Ltd. All rights reserved. Port Louis, Mauritius.*
