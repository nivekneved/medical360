# 📚 Med360 Documentation Hub

Welcome to the centralized documentation repository for **Med360** (`www.med360.mu`), the specialized international healthcare concierge platform wholly owned by the registered Mauritian NGO **Enn Rêv Enn Sourir**.

This hub indexes all technical architecture documents, administrative manuals, UI/UX design standards, security audits, and production operation runbooks.

---

## 🗺️ Documentation Directory

| Document | Primary Audience | Description |
| :--- | :--- | :--- |
| **[🏛️ Architecture & Technical Specifications](ARCHITECTURE.md)** | Developers, DevOps | Dual-mode data persistence, Supabase + LocalStorage fallback, MCP integrations (Higgsfield, Supabase, Firebase), routing, and email/WhatsApp services. |
| **[🎨 UI/UX Architecture & Guidelines](UX_GUIDELINES.md)** | Designers, Frontend Devs | Three-color design system, Zero-Modal CRUD rules, scrollbar cleanliness standards, typography, accessibility, and signature standards. |
| **[📖 Admin Portal & CMS User Guide](ADMIN_GUIDE.md)** | Operations, Case Managers | Patient inquiry triage, zero-modal hospital/specialty CRUD, live CMS page editor, email template customization, and database backups. |
| **[🛡️ SEO & Security Measures](SECURITY_AND_SEO.md)** | DevOps, Security Auditors | Top 25 SEO and security protections including CSP headers, HSTS, anti-spam rate limiting, JSON-LD schemas, and multilingual sitemaps. |
| **[📋 Production Operations Runbook](../RUNBOOK.md)** | Operations, Leads | Master business logic, NGO 100% reinvestment model, currency conversion formulas, WhatsApp webhook specifications, and disaster recovery. |
| **[🚀 Production Launch Checklist](../LAUNCH_CHECKLIST.md)** | DevOps, Release Leads | Step-by-step pre-flight checklist for Vercel DNS, SSL, domain routing, Google Search Console, Bing Webmaster, and Resend email verification. |

---

## 🏗️ High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Presentation Layer                            │
│  (React 19 + React Router v7 + Vanilla CSS Design Tokens + Lucide)     │
│  Features: Home, About, Hospitals, Specialties, How It Works,          │
│            Cost Calculator, Case Studies, Describe Need Wizard, Admin  │
├────────────────────────────────────────────────────────────────────────┤
│                           Application Layer                            │
│  Hooks: useCMS, useHospitals, useSpecialties, useInquiry, useL10n      │
│  Multi-Language: English, Français, Kreol Morisien (Dynamic HTML sync) │
├────────────────────────────────────────────────────────────────────────┤
│                        Domain & Services Layer                         │
│  WhatsApp Concierge (+230 5918 8275) | Resend Serverless Email Proxy  │
│  Multilingual Symptom Matcher | Multi-Currency Savings Engine          │
├────────────────────────────────────────────────────────────────────────┤
│                     Dual-Mode Persistence Layer                        │
│  ┌───────────────────────────────────┐ ┌─────────────────────────────┐ │
│  │     Supabase Live PostgreSQL      │ │    Resilient Mock Engine    │ │
│  │ (Tables, RLS, Real-Time Queries)  │ │ (LocalStorage v2 Deep Merge)│ │
│  └───────────────────────────────────┘ └─────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Links for Common Tasks

### 1. Running Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run automated test suite
npm test

# Build production bundle & check TypeScript
npm run build
```

### 2. Backing Up the Database
```bash
# Exports timestamped JSON dumps of all Supabase tables to backups/database/
npm run backup
```

### 3. Accessing the Admin CMS
- URL: `https://www.med360.mu/admin` or `http://localhost:5173/admin`
- Credentials:
  - **Administrator**: `admin@med360.mu`
  - **Case Manager**: `case@med360.mu`
  - **Password**: configured in `VITE_ADMIN_PASSWORD` (default: `med360admin`)

---

*© 2026 Med360 Ltd. Wholly owned by NGO Enn Rêv Enn Sourir. Port Louis, Mauritius.*
