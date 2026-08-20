# 🩺 Medical 360 — Complete Database Backup & Restore Guide

> **Backup ID**: `backup_2026-08-20_23-50-00`  
> **Created**: `2026-08-20T23:50:00+04:00`  
> **Target Applications**: Web Platform (`medical360`) & Cross-Platform Mobile App (`medical360-mobile`)

---

## 📁 Backup Contents

| File | Type | Description |
| :--- | :--- | :--- |
| `schema.sql` | SQL DDL | Full table definitions, constraints, primary/foreign keys, and indexes |
| `data.sql` | SQL DML | Transactional inserts for all hospitals, specialties, doctors, cases, CMS |
| `restore.sql` | SQL Script | Idempotent drop-and-restore script for PostgreSQL, MySQL, SQLite, Neon |
| `full_database.json` | JSON Dump | Full database export with metadata and table dictionaries |
| `database_schema.json` | JSON Schema | Schema validation rules for JSON exports |
| `restore.js` | Node.js Script | Instant 1-command verification and MockEngine restore script |
| `backup_manifest.json` | Manifest | Checksums, git branch/commit hashes, and metadata |

---

## 🚀 Easy Restore Instructions

### Option 1: 1-Click Node.js Restore & Integrity Check
```bash
cd "D:\WEB 2026\backups\backup_2026-08-20_23-50-00"
node restore.js
```

### Option 2: Restore to PostgreSQL / Supabase / Neon
```bash
# Create database (if needed)
createdb medical360

# Run 1-click restore script:
psql -U postgres -d medical360 -f restore.sql
```

### Option 3: Restore to SQLite Database
```bash
sqlite3 medical360.db < restore.sql
```

### Option 4: Restore to MySQL 8.0+
```bash
mysql -u root -p medical360 < restore.sql
```

---

## 📊 Seed Data Summary

- **7 Accredited Quaternary Hospitals**: Apollo Chennai, Fortis Memorial, Bumrungrad Bangkok, Bangkok Hospital, Gleneagles Singapore, Sunway Medical KL, Manipal Bangalore.
- **6 Core Specialties & 18 Procedures**: Cardiac Surgery, Oncology, Orthopedics & Joint Replacement, Neurosurgery, Organ Transplants, IVF & Fertility.
- **The 7 Elite Specialists**: Dr. Devi Shetty, Dr. Ashok Seth, Dr. Suresh Joshi, Dr. S. Rajasekaran, Dr. Mohamed Rela, Dr. Naresh Trehan, Dr. B. Soma Raju.
- **Patient Case Studies**: Mauritius & Réunion patient outcomes with cost savings statistics (55% - 70%).
- **Trilingual CMS Content**: French, English, and Kreol Morisien dictionaries.
- **Admin & Case Manager Credentials**: Pre-seeded staff accounts with SHA-256 hashed authentication.

---
*© 2026 Med360 Ltd. Port Louis, Mauritius.*
