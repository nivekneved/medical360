/**
 * Medical360 Database Backup & Restore Service
 * Provides full database exports in JSON and SQL, historical snapshot storage,
 * and point-in-time database restoration with automated rollback safeguards.
 */

import { mockEngine } from '../mock/engine';
import { getEmailTemplateConfig, saveEmailTemplateConfig } from './email.service';
import type { Hospital, Specialty, Doctor, CaseStudy, Inquiry } from '../types';
import type { CmsPage } from '../mock/seeds/cms.seed';

export interface DatabaseBackup {
  id: string;
  label: string;
  createdAt: string;
  schemaVersion: string;
  type: 'manual' | 'auto_snapshot' | 'pre_restore_rollback';
  totalRecords: number;
  tableCounts: {
    hospitals: number;
    specialties: number;
    doctors: number;
    caseStudies: number;
    inquiries: number;
    cmsPages: number;
  };
  data: {
    hospitals: Hospital[];
    specialties: Specialty[];
    doctors: Doctor[];
    caseStudies: CaseStudy[];
    inquiries: Inquiry[];
    cms: Record<string, CmsPage>;
    emailTemplate?: any;
    campaigns?: any[];
  };
  sizeBytes?: number;
}

const BACKUP_STORAGE_KEY = 'med360_database_backups_v1';
const MAIN_STORE_KEY = 'med360_mock_store_v4';

/**
 * Creates an in-memory database snapshot of all tables.
 */
export async function createDatabaseSnapshot(
  label = 'Full System Backup',
  type: 'manual' | 'auto_snapshot' | 'pre_restore_rollback' = 'manual'
): Promise<DatabaseBackup> {
  const [hospitals, specialties, doctors, caseStudies, inquiries, cmsArray] = await Promise.all([
    mockEngine.getHospitals(),
    mockEngine.getSpecialties(),
    mockEngine.getDoctors(),
    mockEngine.getCaseStudies(),
    mockEngine.getInquiries(),
    mockEngine.getAllCmsPages(),
  ]);

  const cmsMap: Record<string, CmsPage> = {};
  cmsArray.forEach((page) => {
    cmsMap[page.id] = page;
  });

  const emailTemplate = getEmailTemplateConfig();
  let campaigns: any[] = [];
  try {
    const rawCamp = localStorage.getItem('med360_campaigns_v1');
    if (rawCamp) campaigns = JSON.parse(rawCamp);
  } catch (e) {
    // Ignore if not present
  }

  const tableCounts = {
    hospitals: hospitals.length,
    specialties: specialties.length,
    doctors: doctors.length,
    caseStudies: caseStudies.length,
    inquiries: inquiries.length,
    cmsPages: Object.keys(cmsMap).length,
  };

  const totalRecords = Object.values(tableCounts).reduce((a, b) => a + b, 0);
  const now = new Date().toISOString();
  const id = `backup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const snapshotData = {
    hospitals,
    specialties,
    doctors,
    caseStudies,
    inquiries,
    cms: cmsMap,
    emailTemplate,
    campaigns,
  };

  const jsonStr = JSON.stringify(snapshotData);
  const sizeBytes = new Blob([jsonStr]).size;

  const backup: DatabaseBackup = {
    id,
    label,
    createdAt: now,
    schemaVersion: '2.0',
    type,
    totalRecords,
    tableCounts,
    data: snapshotData,
    sizeBytes,
  };

  return backup;
}

/**
 * Retrieves all stored backup snapshots from history.
 */
export function getStoredBackups(): DatabaseBackup[] {
  try {
    const raw = localStorage.getItem(BACKUP_STORAGE_KEY);
    if (!raw) return [];
    const list: DatabaseBackup[] = JSON.parse(raw);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Failed to load backups from storage:', err);
    return [];
  }
}

/**
 * Saves a backup to local backup history (capped at 20 snapshots).
 */
export function saveBackupToHistory(backup: DatabaseBackup): void {
  try {
    const existing = getStoredBackups();
    // Prevent duplicate IDs
    const filtered = existing.filter(b => b.id !== backup.id);
    const updated = [backup, ...filtered].slice(0, 20); // Keep last 20 backups
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save backup to history:', err);
  }
}

/**
 * Deletes a stored backup from history.
 */
export function deleteStoredBackup(backupId: string): void {
  try {
    const existing = getStoredBackups();
    const updated = existing.filter(b => b.id !== backupId);
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete backup:', err);
  }
}

/**
 * Triggers a browser download of the full database in JSON format.
 */
export async function downloadJsonBackup(existingSnapshot?: DatabaseBackup, customLabel?: string): Promise<DatabaseBackup> {
  const snapshot = existingSnapshot || await createDatabaseSnapshot(customLabel || 'Manual JSON Backup');
  
  // Save to history list as well
  saveBackupToHistory(snapshot);

  const exportPayload = {
    format: 'Medical360 Database Dump',
    version: snapshot.schemaVersion,
    exportedAt: snapshot.createdAt,
    metadata: {
      id: snapshot.id,
      label: snapshot.label,
      totalRecords: snapshot.totalRecords,
      tableCounts: snapshot.tableCounts,
    },
    database: snapshot.data,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const filename = `medical360_db_backup_${dateStr}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return snapshot;
}

/**
 * Generates an SQL dump file compliant with PostgreSQL / Supabase.
 */
export function generateSqlDump(snapshot: DatabaseBackup): string {
  const lines: string[] = [];
  const escapeSql = (val: any): string => {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  lines.push(`-- ============================================================`);
  lines.push(`-- Medical360 PostgreSQL Database Backup Dump`);
  lines.push(`-- ID: ${snapshot.id}`);
  lines.push(`-- Label: ${snapshot.label}`);
  lines.push(`-- Exported At: ${snapshot.createdAt}`);
  lines.push(`-- Total Records: ${snapshot.totalRecords}`);
  lines.push(`-- ============================================================`);
  lines.push(`\nBEGIN;\n`);

  // 1. HOSPITALS TABLE
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`-- 1. Table: hospitals (${snapshot.data.hospitals?.length || 0} records)`);
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`CREATE TABLE IF NOT EXISTS hospitals (`);
  lines.push(`  id TEXT PRIMARY KEY,`);
  lines.push(`  name TEXT NOT NULL,`);
  lines.push(`  name_fr TEXT,`);
  lines.push(`  name_kr TEXT,`);
  lines.push(`  city TEXT,`);
  lines.push(`  country TEXT,`);
  lines.push(`  description TEXT,`);
  lines.push(`  description_fr TEXT,`);
  lines.push(`  description_kr TEXT,`);
  lines.push(`  image_url TEXT,`);
  lines.push(`  gallery JSONB,`);
  lines.push(`  accreditations JSONB,`);
  lines.push(`  specialties JSONB,`);
  lines.push(`  beds_count INTEGER,`);
  lines.push(`  icu_beds INTEGER,`);
  lines.push(`  founded_year INTEGER,`);
  lines.push(`  rating NUMERIC,`);
  lines.push(`  review_count INTEGER,`);
  lines.push(`  international_patients_per_year INTEGER,`);
  lines.push(`  languages JSONB,`);
  lines.push(`  website TEXT,`);
  lines.push(`  contact_email TEXT,`);
  lines.push(`  contact_phone TEXT,`);
  lines.push(`  featured BOOLEAN DEFAULT false,`);
  lines.push(`  active BOOLEAN DEFAULT true`);
  lines.push(`);\n`);

  if (snapshot.data.hospitals?.length) {
    snapshot.data.hospitals.forEach((h) => {
      lines.push(
        `INSERT INTO hospitals (id, name, name_fr, name_kr, city, country, description, description_fr, description_kr, image_url, gallery, accreditations, specialties, beds_count, icu_beds, founded_year, rating, review_count, international_patients_per_year, languages, website, contact_email, contact_phone, featured, active) ` +
        `VALUES (${escapeSql(h.id)}, ${escapeSql(h.name)}, ${escapeSql(h.name_fr)}, ${escapeSql(h.name_kr)}, ${escapeSql(h.city)}, ${escapeSql(h.country)}, ${escapeSql(h.description)}, ${escapeSql(h.description_fr)}, ${escapeSql(h.description_kr)}, ${escapeSql(h.imageUrl)}, ${escapeSql(h.gallery)}, ${escapeSql(h.accreditations)}, ${escapeSql(h.specialties)}, ${escapeSql(h.bedsCount)}, ${escapeSql(h.icuBeds)}, ${escapeSql(h.foundedYear)}, ${escapeSql(h.rating)}, ${escapeSql(h.reviewCount)}, ${escapeSql(h.internationalPatientsPerYear)}, ${escapeSql(h.languages)}, ${escapeSql(h.website)}, ${escapeSql(h.contactEmail)}, ${escapeSql(h.contactPhone)}, ${escapeSql(h.featured)}, ${escapeSql(h.active)}) ` +
        `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;`
      );
    });
  }
  lines.push(`\n`);

  // 2. SPECIALTIES TABLE
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`-- 2. Table: specialties (${snapshot.data.specialties?.length || 0} records)`);
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`CREATE TABLE IF NOT EXISTS specialties (`);
  lines.push(`  id TEXT PRIMARY KEY,`);
  lines.push(`  name TEXT NOT NULL,`);
  lines.push(`  name_fr TEXT,`);
  lines.push(`  name_kr TEXT,`);
  lines.push(`  slug TEXT,`);
  lines.push(`  icon TEXT,`);
  lines.push(`  description TEXT,`);
  lines.push(`  description_fr TEXT,`);
  lines.push(`  description_kr TEXT,`);
  lines.push(`  short_description TEXT,`);
  lines.push(`  image_url TEXT,`);
  lines.push(`  procedures JSONB,`);
  lines.push(`  featured BOOLEAN DEFAULT false`);
  lines.push(`);\n`);

  if (snapshot.data.specialties?.length) {
    snapshot.data.specialties.forEach((s) => {
      lines.push(
        `INSERT INTO specialties (id, name, name_fr, name_kr, slug, icon, description, description_fr, description_kr, short_description, image_url, procedures, featured) ` +
        `VALUES (${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.name_fr)}, ${escapeSql(s.name_kr)}, ${escapeSql(s.slug)}, ${escapeSql(s.icon)}, ${escapeSql(s.description)}, ${escapeSql(s.description_fr)}, ${escapeSql(s.description_kr)}, ${escapeSql(s.shortDescription)}, ${escapeSql(s.imageUrl)}, ${escapeSql(s.procedures)}, ${escapeSql(s.featured)}) ` +
        `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;`
      );
    });
  }
  lines.push(`\n`);

  // 3. DOCTORS TABLE
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`-- 3. Table: doctors (${snapshot.data.doctors?.length || 0} records)`);
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`CREATE TABLE IF NOT EXISTS doctors (`);
  lines.push(`  id TEXT PRIMARY KEY,`);
  lines.push(`  hospital_id TEXT,`);
  lines.push(`  name TEXT NOT NULL,`);
  lines.push(`  title TEXT,`);
  lines.push(`  specialties JSONB,`);
  lines.push(`  qualifications JSONB,`);
  lines.push(`  experience INTEGER,`);
  lines.push(`  surgeries INTEGER,`);
  lines.push(`  languages JSONB,`);
  lines.push(`  image_url TEXT,`);
  lines.push(`  bio TEXT,`);
  lines.push(`  consultation_fee_usd INTEGER,`);
  lines.push(`  featured BOOLEAN DEFAULT false`);
  lines.push(`);\n`);

  if (snapshot.data.doctors?.length) {
    snapshot.data.doctors.forEach((d) => {
      lines.push(
        `INSERT INTO doctors (id, hospital_id, name, title, specialties, qualifications, experience, surgeries, languages, image_url, bio, consultation_fee_usd, featured) ` +
        `VALUES (${escapeSql(d.id)}, ${escapeSql(d.hospitalId)}, ${escapeSql(d.name)}, ${escapeSql(d.title)}, ${escapeSql(d.specialties)}, ${escapeSql(d.qualifications)}, ${escapeSql(d.experience)}, ${escapeSql(d.surgeries)}, ${escapeSql(d.languages)}, ${escapeSql(d.imageUrl)}, ${escapeSql(d.bio)}, ${escapeSql(d.consultationFeeUSD)}, ${escapeSql(d.featured)}) ` +
        `ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;`
      );
    });
  }
  lines.push(`\n`);

  // 4. INQUIRIES & SERVICE REQUESTS TABLE
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`-- 4. Table: inquiries & patient requests (${snapshot.data.inquiries?.length || 0} records)`);
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`CREATE TABLE IF NOT EXISTS inquiries (`);
  lines.push(`  id TEXT PRIMARY KEY,`);
  lines.push(`  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),`);
  lines.push(`  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),`);
  lines.push(`  first_name TEXT NOT NULL,`);
  lines.push(`  last_name TEXT NOT NULL,`);
  lines.push(`  email TEXT NOT NULL,`);
  lines.push(`  phone TEXT NOT NULL,`);
  lines.push(`  country_of_residence TEXT,`);
  lines.push(`  specialty_id TEXT,`);
  lines.push(`  service_id TEXT,`);
  lines.push(`  service_name TEXT,`);
  lines.push(`  description TEXT,`);
  lines.push(`  urgency TEXT,`);
  lines.push(`  preferred_country TEXT,`);
  lines.push(`  budget_range_usd JSONB,`);
  lines.push(`  status TEXT DEFAULT 'new',`);
  lines.push(`  notes JSONB`);
  lines.push(`);\n`);

  if (snapshot.data.inquiries?.length) {
    snapshot.data.inquiries.forEach((inq) => {
      lines.push(
        `INSERT INTO inquiries (id, created_at, updated_at, first_name, last_name, email, phone, country_of_residence, specialty_id, service_id, service_name, description, urgency, preferred_country, budget_range_usd, status, notes) ` +
        `VALUES (${escapeSql(inq.id)}, ${escapeSql(inq.createdAt)}, ${escapeSql(inq.updatedAt)}, ${escapeSql(inq.firstName)}, ${escapeSql(inq.lastName)}, ${escapeSql(inq.email)}, ${escapeSql(inq.phone)}, ${escapeSql(inq.countryOfResidence)}, ${escapeSql(inq.specialtyId)}, ${escapeSql(inq.serviceId)}, ${escapeSql(inq.serviceName)}, ${escapeSql(inq.description)}, ${escapeSql(inq.urgency)}, ${escapeSql(inq.preferredCountry)}, ${escapeSql(inq.budgetRangeUSD)}, ${escapeSql(inq.status)}, ${escapeSql(inq.notes)}) ` +
        `ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, updated_at = EXCLUDED.updated_at;`
      );
    });
  }
  lines.push(`\n`);

  // 5. CMS PAGES TABLE
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`-- 5. Table: cms_pages (${Object.keys(snapshot.data.cms || {}).length} pages)`);
  lines.push(`-- ------------------------------------------------------------`);
  lines.push(`CREATE TABLE IF NOT EXISTS cms_pages (`);
  lines.push(`  id TEXT PRIMARY KEY,`);
  lines.push(`  title TEXT NOT NULL,`);
  lines.push(`  content JSONB NOT NULL`);
  lines.push(`);\n`);

  if (snapshot.data.cms) {
    Object.entries(snapshot.data.cms).forEach(([pageId, pageObj]) => {
      lines.push(
        `INSERT INTO cms_pages (id, title, content) ` +
        `VALUES (${escapeSql(pageId)}, ${escapeSql(pageObj.title)}, ${escapeSql(pageObj.content)}) ` +
        `ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;`
      );
    });
  }

  lines.push(`\nCOMMIT;\n`);
  lines.push(`-- Backup export completed successfully.`);
  return lines.join('\n');
}

/**
 * Triggers a browser download of the full database in SQL format.
 */
export async function downloadSqlBackup(existingSnapshot?: DatabaseBackup, customLabel?: string): Promise<DatabaseBackup> {
  const snapshot = existingSnapshot || await createDatabaseSnapshot(customLabel || 'Manual SQL Backup');
  saveBackupToHistory(snapshot);

  const sqlContent = generateSqlDump(snapshot);
  const blob = new Blob([sqlContent], { type: 'application/sql;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  const filename = `medical360_db_backup_${dateStr}.sql`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return snapshot;
}

/**
 * Restores database state from a DatabaseBackup object.
 */
export async function restoreFromBackup(backup: DatabaseBackup): Promise<{ success: boolean; message: string }> {
  try {
    if (!backup.data || (!backup.data.hospitals && !backup.data.cms)) {
      throw new Error('Invalid backup package: Missing table datasets.');
    }

    // 1. Create a safety rollback point before restoring
    try {
      const rollbackPoint = await createDatabaseSnapshot('Auto Pre-Restore Rollback Point', 'pre_restore_rollback');
      saveBackupToHistory(rollbackPoint);
    } catch (e) {
      console.warn('Could not create rollback point:', e);
    }

    // 2. Format store shape for mock engine
    const storeToSave = {
      hospitals: backup.data.hospitals || [],
      specialties: backup.data.specialties || [],
      doctors: backup.data.doctors || [],
      caseStudies: backup.data.caseStudies || [],
      inquiries: backup.data.inquiries || [],
      cms: backup.data.cms || {},
    };

    localStorage.setItem(MAIN_STORE_KEY, JSON.stringify(storeToSave));

    // 3. Restore Email templates if present
    if (backup.data.emailTemplate) {
      saveEmailTemplateConfig(backup.data.emailTemplate);
    }

    // 4. Restore campaigns if present
    if (backup.data.campaigns) {
      localStorage.setItem('med360_campaigns_v1', JSON.stringify(backup.data.campaigns));
    }

    return {
      success: true,
      message: `Database restored successfully from "${backup.label}" (${backup.totalRecords} records).`,
    };
  } catch (err: any) {
    console.error('Database restore error:', err);
    return {
      success: false,
      message: err.message || 'Failed to restore database.',
    };
  }
}

/**
 * Parses and restores database from an uploaded JSON file string.
 */
export async function restoreFromJsonFile(fileContent: string): Promise<{ success: boolean; message: string }> {
  try {
    const parsed = JSON.parse(fileContent);
    const backupData: DatabaseBackup = parsed.database ? {
      id: parsed.metadata?.id || `backup_upload_${Date.now()}`,
      label: parsed.metadata?.label || 'Uploaded JSON Backup',
      createdAt: parsed.exportedAt || new Date().toISOString(),
      schemaVersion: parsed.version || '2.0',
      type: 'manual',
      totalRecords: parsed.metadata?.totalRecords || 0,
      tableCounts: parsed.metadata?.tableCounts || {
        hospitals: parsed.database.hospitals?.length || 0,
        specialties: parsed.database.specialties?.length || 0,
        doctors: parsed.database.doctors?.length || 0,
        caseStudies: parsed.database.caseStudies?.length || 0,
        inquiries: parsed.database.inquiries?.length || 0,
        cmsPages: Object.keys(parsed.database.cms || {}).length,
      },
      data: parsed.database,
    } : parsed;

    return await restoreFromBackup(backupData);
  } catch (err: any) {
    return {
      success: false,
      message: `Invalid JSON file: ${err.message}`,
    };
  }
}
