# 🎨 Med360 — UI/UX Architecture & Design System Guidelines

This document defines the interface design principles, visual hierarchy, interaction patterns, and strict usability rules enforced across the Med360 web and mobile platforms.

---

## 1. Core Visual Identity & Design Tokens

Med360 delivers a high-trust, premium healthcare aesthetic designed to inspire confidence in prospective patients and corporate partners.

### 1.1 Curated Three-Color Palette
Ad-hoc or generic browser colors are strictly prohibited. The interface is anchored around three primary semantic color tones:

| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| `--color-primary` | `#065f46` (Emerald Deep) / `#10b981` (Vibrant Emerald) | Primary actions, brand accents, success highlights, and active states. |
| `--color-dark` | `#090d10` (Dark Slate) | Primary headlines, dark hero backgrounds, footer surfaces, and high-contrast overlays. |
| `--color-surface` | `#ffffff` (Pure White) / `#f8fafc` (Surface Warm) | Card backgrounds, content containers, and subtle alternating section backgrounds. |
| `--color-accent` | `#0d9488` (Teal) | Gradient accents, interactive pill highlights, and secondary callouts. |
| `--color-border` | `rgba(226, 232, 240, 0.8)` / `#e2e8f0` | Subtle, clean separation borders (1px to 1.5px). |

### 1.2 Glassmorphism & Elevation
- **Backdrop Filters**: Floating badges, headers, and quick-filter chips utilize `backdrop-filter: blur(8px) -webkit-backdrop-filter: blur(8px)` with semi-transparent surfaces (`rgba(255, 255, 255, 0.15)` or `rgba(0, 0, 0, 0.55)`).
- **Subtle Elevation Shadows**:
  - Resting cards: `0 4px 16px rgba(0, 0, 0, 0.04)`
  - Elevated hover: `0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px color-mix(in srgb, var(--color-primary) 35%, transparent)` with `transform: translateY(-4px)` to `translateY(-6px)`.

---

## 2. Strict Zero-Modal CRUD Architecture

To maximize workflow speed and eliminate cognitive friction, **blocking modal popups / dialog overlays are strictly prohibited for core entity management**:

1. **No Popups for Record Management**:
   - Adding, editing, and deleting hospitals, specialties, procedures, inquiries, and case studies must never launch a modal window.
   - **Approved Patterns**:
     - **Inline Expandable Cards**: Clicking "Edit" replaces or expands the record in-place with an interactive form.
     - **In-Place Workstations**: Form fields render directly inside the list or grid container.
     - **Accordion Drawers**: Expandable panels that reveal rich sub-fields (e.g. procedure lists or doctor details).
2. **Inline Action Confirmations**:
   - Deletions, status changes, and resets must use inline confirmation bars (`Are you sure? [Confirm] [Cancel]`), banner toasts, or non-blocking slide-outs.
3. **Continuous Context Preservation**:
   - The user must never lose their scroll position or current list view when updating an item.

---

## 3. Scrollbar & Overflow Cleanliness

Unstyled default OS scrollbars degrade the visual quality of the application. The following rules are mandatory:

### 3.1 Quick Filter Chips & Navigation Tabs
- **Desktop (Viewport > 768px)**:
  - Containers must use `flex-wrap: wrap; gap: 0.5rem 0.75rem;`.
  - Content must wrap cleanly into multiple lines rather than overflowing horizontally.
  - Horizontal browser scrollbars must **NEVER** appear across desktop views.
- **Mobile Touch (Viewport $\le$ 768px)**:
  - If a horizontal scroll row is intentional for swipeability, the OS scrollbar thumb must be strictly hidden:
    ```css
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Edge */
    }
    ```

### 3.2 Content Cards & Hero Banners
- All card hero images must maintain explicit aspect ratios or height bounds (e.g., `205px` for specialty cards) with `overflow: hidden` and `object-fit: cover`.
- Card image zoom transitions should use cubic-bezier timing (`scale(1.08)` over `0.6s cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 4. Typography & Visual Hierarchy

1. **Typefaces**:
   - Primary Body: Modern sans-serif (`Inter`, `system-ui, -apple-system, sans-serif`).
   - Display & Headings: `Outfit` or geometric display sans-serif with high letter-spacing on subheadings (`letter-spacing: 0.05em`).
2. **Heading Strictness**:
   - Exactly **one `<h1>`** per page.
   - Logical descending hierarchy (`<h2>` for major sections, `<h3>` for cards and components).
3. **Contrast & Readability**:
   - Text over photography must always be backed by a multi-stop dark gradient overlay (e.g., `linear-gradient(to top, rgba(9, 13, 16, 0.92) 0%, rgba(9, 13, 16, 0.55) 45%, transparent 100%)`).
   - Text color must achieve at least **4.5:1** contrast ratio against backgrounds to ensure WCAG 2.1 AA compliance.

---

## 5. Multilingual Interface Standards (EN / FR / KR)

Med360 is built native for three languages: **English**, **Français**, and **Kreol Morisien**.

1. **Text Expansion Tolerance**:
   - French and Kreol translations frequently expand word count by 20% to 35% compared to English.
   - Fixed-width button containers and rigid text boxes are prohibited; use `min-width`, `flex`, or `clamp()` for dynamic resizing.
2. **Language Synchronization**:
   - Switching language must instantly synchronize:
     - The global state (`useL10n`).
     - The document root attribute (`document.documentElement.lang = 'fr' | 'kr' | 'en'`).
     - CMS content, form placeholders, and symptom search keywords.

---

## 6. Developer & Owner Attribution Standard

As specified by the project owner, every Med360 web deployment must include the official developer signature linked directly to the developer's WhatsApp line:

- **Display Text**: `Designed & Developed with ♥ by Deven`
- **Destination Link**: `https://wa.me/23058169420`
- **Location**: Footer metadata bar alongside copyright and legal notices.
- **Hotline Separation**:
  - Developer Mobile: `+230 58 16 94 20` (Attribution & technical support)
  - Med360 Consultation Hotline: `+230 5918 8275` (Patient medical triage)

---

*© 2026 Med360 Ltd. All rights reserved. Port Louis, Mauritius.*