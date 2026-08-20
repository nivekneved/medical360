# 📖 Medical 360 — Admin Portal & CMS User Guide

This manual covers the administrative operations, patient case workflow, core database management, and the dynamic CMS editor.

---

## 1. Accessing the Admin Portal

1. Navigate to `/admin` or click **Admin Only** in the main navigation bar.
2. Sign in using your credentials:
   - **Admin Account**: `admin@med360.mu` (Password: `med360admin`)
   - **Case Manager**: `case@med360.mu` (Password: `med360admin`)
3. The session is protected with client-side brute-force lockout (3 failed attempts locks out for 5 minutes).

---

## 2. Managing Patient Inquiries (`/admin/inquiries`)

The inquiries dashboard displays all requests submitted through the `/describe-need` wizard:
- **Status Pipeline**:
  - `New` (Unreviewed intake)
  - `Contacted` (Initial consultation completed via WhatsApp/phone)
  - `Awaiting Documents` (Waiting for patient scans/lab reports)
  - `In Progress` (Case shared with hospital department heads)
  - `Quoted` (Official treatment plan & quote received)
  - `Completed` (Patient travel arranged or recovery completed)
  - `Cancelled`
- **Case Actions**: Update status in real time and add case notes.

---

## 3. Managing Partner Hospitals (`/admin/hospitals`)

1. Click **Edit Hospital Details** on any hospital card.
2. The prefilled modal allows updating:
   - Hospital Name, City, and Country.
   - Bed Counts, Rating, and Founded Year.
   - Accreditations (JCI, NABH, ISO, etc.).
   - Image (via the **Select Image** button or Image URL).
   - Multilingual Descriptions (English, French, Kreol).
3. Click **Save Hospital** to apply changes instantly.

---

## 4. Managing Specialties & Procedures (`/admin/specialties`)

1. Click **Edit Specialty & Costs** on any medical department card.
2. Modify specialty names and short descriptions in 3 languages.
3. Edit individual procedures, including procedure name and Min/Max USD cost ranges.
4. Click **Save Specialty** to persist changes.

---

## 5. Managing the 7 Medical Specialists (`/admin/doctors`)

1. Click **Edit Specialist Profile** on any of the 7 doctor cards.
2. Modify doctor full name, hospital affiliation, experience years, total surgeries performed, credentials, and languages spoken.
3. Update profile photo using the **Select Image** button or preset gallery.
4. Update biography and consultation fees.
5. Click **Save Doctor**.

---

## 6. Real-Time CMS Page Editor (`/admin/pages/:pageId`)

The CMS allows non-technical team members to edit any copy across the website:

### Available Editors:
- **Global Sections**: Header & Navigation, Footer & Legal.
- **Main Pages**: Home Page, About Page, Services Page, Contact Page.
- **Inside Pages**: Specialties Page, Hospitals Page, Doctors Page, Case Studies Page, Describe Need Wizard.

### Editing Workflow:
1. Select the page from the **Page CMS Text** sidebar menu.
2. Choose your language tab (**Français**, **Kreol Morisien**, or **English**).
3. Update any text field or multiline textarea.
4. For images, click **Select Image** to upload from your computer or pick from the curated preset gallery.
5. Click **Save All Changes** at the top or bottom of the page.
6. Click **Preview Live Page** to review the live result.
7. To revert any accidental edits, click **Reset to Default** to restore the verified default seed copy.
