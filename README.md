# 🩺 Medical 360 — International Healthcare Concierge Platform

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

**Medical 360** (Med360 Ltd) is a specialized medical concierge platform based in Port Louis, Mauritius. The platform assists patients seeking advanced treatments abroad (cardiac surgery, oncology, organ transplants, orthopedics, IVF, neurosurgery) by coordinating:
- **Free expert medical opinions** from leading hospital department heads within 48 hours.
- **Accredited partner hospitals** across India, Thailand, Singapore, Malaysia, and the UAE.
- **7 World-Renowned Medical Specialists** handpicked across key medical disciplines.
- **Full travel & visa logistics**: flight booking, medical visas, airport transfers, accommodation, and on-ground translators.

---

## 🚀 Key Platform Features

### 🌐 Patient-Facing Portal
- **Multilingual Support (EN / FR / KR)**: Seamless toggle between English, Français, and Kreol Morisien with automatic `<html>` attribute synchronization.
- **Interactive Inquiry Wizard (`/describe-need`)**: Multi-step medical intake form with specialty selection, urgency ratings, and WhatsApp instant handoff.
- **Hospital Directory & Detail Pages (`/hospitals` & `/hospitals/:id`)**: Search & filter by country/accreditation (JCI, NABH, ISO), bed counts, international patient volumes, and practicing specialists.
- **Specialties & Procedures Catalog (`/specialties` & `/specialties/:id`)**: Comprehensive guides with price estimation in USD & MUR, recovery timelines, and affiliated doctors.
- **The 7 Elite Specialists Page (`/doctors`)**: Direct access to verified surgical track records (100,000+ surgeries combined), bios, languages, and consultation booking.
- **Verified Patient Success Stories (`/case-studies`)**: Real patient testimonials, outcomes, and cost-savings statistics.
- **Full Concierge Services (`/services`)**: Coverage of all 6 stages from initial diagnosis to post-treatment recovery care.

### 🛡️ Admin & CMS Portal (`/admin`)
- **Real-Time CMS Page Editor (`/admin/pages/:pageId`)**: Live text editing for all 11 pages/sections with language tabs (FR, KR, EN) and instant site synchronization.
- **Integrated Image Manager**: "Select Image" file upload, preset medical gallery, and custom image URL support.
- **Core Data Management**: Dedicated CRUD interfaces with prefilled edit modals for:
  - *Partner Hospitals* (`/admin/hospitals`)
  - *Medical Specialties & Procedures* (`/admin/specialties`)
  - *7 Elite Medical Specialists* (`/admin/doctors`)
  - *Patient Success Stories* (`/admin/case-studies`)
  - *Inquiry Management & Status Tracking* (`/admin/inquiries`)

---

## 🎨 Technology Stack & Design System

| Layer | Technology |
| :--- | :--- |
| **Core Framework** | React 19 + TypeScript + Vite |
| **Routing** | React Router v7 (`react-router-dom`) |
| **Styling** | Vanilla CSS with CSS Custom Properties (Three-color palette) |
| **Internationalization** | `i18next` + `react-i18next` |
| **SEO & Meta** | `react-helmet-async` + Schema.org JSON-LD |
| **Icons** | Lucide React (`lucide-react`) |
| **Data Engine** | LocalStorage-backed reactive Mock Engine with simulated latency |

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
├── backups/                   # Full SQL & JSON database backup snapshots
│   └── backup_2026-08-20_23-50-00/
├── public/                    # Static assets (robots.txt, sitemap.xml)
├── src/
│   ├── assets/                # Local brand images & media
│   ├── components/            # Reusable UI components (FloatingWhatsApp, Footer, Navbar, SEO)
│   ├── core/                  # Domain entities, types & mock services
│   │   ├── mock/              # Mock engine singleton & data seeds
│   │   ├── services/          # Pure helper services (format, whatsapp, hospital)
│   │   └── types/             # TypeScript domain interfaces
│   ├── features/              # Feature pages & routes (hospitals, doctors, wizard, admin)
│   ├── hooks/                 # Custom React data hooks (useCMS, useDoctors, etc.)
│   ├── i18n/                  # Multi-language configuration & dictionaries
│   ├── providers/             # Global Context Providers (Auth, Data, Theme)
│   └── styles/                # Global design system tokens & utilities
├── docs/                      # Architectural & Admin documentation
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
