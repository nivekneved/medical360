# 📖 Med360 — Admin Portal & CMS User Guide

This manual covers administrative operations, patient case triage, hospital and specialty catalog management, live CMS page editing, and system backups.

---

## 1. Accessing the Admin Portal

1. Navigate to `/admin` or click **Admin Portal** in the footer / navigation.
2. Sign in using administrative credentials:
   - **Administrator**: `admin@med360.mu` (Password: configured in `VITE_ADMIN_PASSWORD` or fallback `med360admin`)
   - **Case Coordinator**: `case@med360.mu` (Password: `med360admin`)
3. **Security Safeguard**: Client-side rate-limiting locks the portal after 3 consecutive failed attempts for 5 minutes.

---

## 2. Managing Patient Inquiries & Leads (`/admin/inquiries`)

The inquiries dashboard tracks all submissions originating from the `/describe-need` wizard, contact forms, and contextual page CTAs.

### 2.1 Triage Status Pipeline
- **`New`**: Newly received inquiry awaiting review.
- **`Contacted`**: Coordinator initiated contact via WhatsApp / phone / email.
- **`Awaiting Documents`**: Patient requested to provide medical reports / imaging scans.
- **`In Progress`**: Medical file shared with partner hospital clinical boards for second opinion.
- **`Quoted`**: Multi-hospital cost estimates and treatment plan delivered to patient.
- **`Completed`**: Travel booked or treatment successfully completed.
- **`Cancelled`**: Duplicate or withdrawn case.

### 2.2 Inquiry Operations (Zero-Modal)
- Click on any inquiry card to expand its full clinical context (medical description, urgency, preferred hospital, budget range, source page).
- Update status in real time.
- Add and save internal coordinator case notes.
- Use 1-click triage buttons to launch WhatsApp or email the patient directly.

---

## 3. Managing Partner Hospitals (`/admin/hospitals`)

Med360 catalogs 15 premier Indian partner hospitals.

### 3.1 Editing Hospital Records
1. Click **Edit Hospital** on any hospital card to open the **inline editor card** (no blocking modal popups).
2. Update:
   - **General Info**: Hospital Name, City, Country, Established Year, Bed Count, Rating.
   - **Accreditations**: Toggle JCI, NABH, NABL, ISO, AAHRPP.
   - **Multilingual Overview**: Edit descriptions in French, Kreol Morisien, and English.
   - **Media**: Upload an image or select from the preset medical photography gallery.
   - **Clinical Offerings**: Add/edit key procedures and departments.
3. Click **Save Changes** (or **Cancel**) to close the inline editor.

---

## 4. Managing Specialties & Procedures (`/admin/specialties`)

Manage the 15 core clinical disciplines and associated surgical procedures.

### 4.1 Editing Specialty Records
1. Click **Edit Specialty** to expand the inline editor.
2. Update:
   - Specialty title and overview in French, Kreol, and English.
   - Clinical procedures table: Procedure Name, Minimum USD Cost, Maximum USD Cost, Typical Duration.
   - Associated hospital affiliations.
3. Click **Save Specialty** to persist changes immediately.

---

## 5. Managing Medical Specialists (`/admin/doctors`)

Manage profiles for affiliated senior consultants, department heads, and surgical specialists.
- Update doctor credentials, experience years, surgeries performed, and spoken languages.
- Update profile photography and multilingual biographies.
- Changes update live with zero modal popups.

---

## 6. Live CMS Page Copy Editor (`/admin/pages/:pageId`)

The dynamic CMS allows non-technical administrators to customize website copy in real time without redeploying code.

### 6.1 Editable Pages
- **Global Elements**: Header Navigation, Footer, Legal Notices, Cookie Banner.
- **Primary Pages**: Home Page, About Us, How It Works, Contact Page, Cost Calculator.
- **Catalog Pages**: Hospitals Directory, Specialties Directory, Case Studies, Describe Need Intake Wizard.

### 6.2 Editing Workflow
1. Select the target page from the CMS sidebar.
2. Select your language tab (**Français**, **Kreol Morisien**, or **English**).
3. Modify any headline, subtitle, descriptive paragraph, or call-to-action text.
4. Click **Save All Changes** to persist to storage.
5. Click **Preview Live Page** to inspect changes in a new tab.
6. If needed, click **Reset to Default** to restore the verified seed content.

---

## 7. Mission Marquee Ribbon Editor (`/admin/marquee`)

Configure the scrolling top announcement bar:
- Enable/disable ribbon visibility.
- Customize announcement text in all 3 languages.
- Adjust scrolling speed and visual positioning (above or below navigation).

---

## 8. Lead Telemetry & WhatsApp Logs (`/admin/leads`)

Inspect inbound and outbound communication events:
- Review WhatsApp click-to-chat referrals with timestamp, source page, and pre-filled inquiry parameters.
- Monitor lead conversion pathways across desktop and mobile visitors.

---

## 9. Backups & Disaster Recovery (`/admin/settings`)

- **Export Backup**: Click **"Generate Complete System Backup"** to download a complete JSON snapshot of all hospitals, specialties, doctors, case studies, inquiries, and CMS copy.
- **Restore Backup**: Drop a previously exported `.json` file into the restore dropzone to restore the database instantly.
