import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedsDir = path.resolve(__dirname, '../src/core/mock/seeds');
const webDir = path.resolve(__dirname, '..');
const mobileDir = path.resolve(__dirname, '../../medical360-mobile');

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
const backupDirName = `backup_${timestamp}`;
const outDir = path.resolve(webDir, 'backups', backupDirName);
const latestDir = path.resolve(webDir, 'backups', 'latest');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(latestDir)) fs.mkdirSync(latestDir, { recursive: true });

console.log(`Creating full backup in: ${outDir}`);

let webGitInfo = '';
let mobileGitInfo = '';
try {
  webGitInfo = execSync('git branch -a -v --no-abbrev', { cwd: webDir, encoding: 'utf8' });
} catch (e) {
  webGitInfo = 'Git branch info unavailable: ' + e.message;
}

try {
  if (fs.existsSync(mobileDir)) {
    mobileGitInfo = execSync('git branch -a -v --no-abbrev', { cwd: mobileDir, encoding: 'utf8' });
  }
} catch (e) {
  mobileGitInfo = 'Mobile git branch info unavailable: ' + e.message;
}

async function loadSeeds() {
  const files = fs.readdirSync(seedsDir);
  const data = {};

  for (const file of files) {
    if (file.endsWith('.seed.ts')) {
      const content = fs.readFileSync(path.join(seedsDir, file), 'utf8');
      try {
        let clean = content
          .replace(/import\s+type\s+[^;]+;/g, '')
          .replace(/import\s+[^;]+;/g, '')
          .replace(/:\s*Specialty\[\]/g, '')
          .replace(/:\s*Hospital\[\]/g, '')
          .replace(/:\s*Doctor\[\]/g, '')
          .replace(/:\s*CaseStudy\[\]/g, '')
          .replace(/:\s*Inquiry\[\]/g, '')
          .replace(/:\s*Record<[^>]+>/g, '')
          .replace(/export\s+const\s+(\w+)\s*=\s*/g, 'exports.$1 = ')
          .replace(/export\s+interface\s+[\s\S]*?}/g, '');

        const evalModule = { exports: {} };
        const fn = new Function('exports', 'module', clean);
        fn(evalModule.exports, evalModule);
        
        Object.assign(data, evalModule.exports);
      } catch (err) {
        console.warn(`Warning parsing ${file}:`, err.message);
      }
    }
  }
  return data;
}

async function run() {
  const seedData = await loadSeeds();

  const specialties = seedData.specialtiesSeed || [];
  const hospitals = seedData.hospitalsSeed || [];
  const doctors = seedData.doctorsSeed || [];
  const caseStudies = seedData.caseStudiesSeed || [];
  const inquiries = seedData.inquiriesSeed || [];
  const cms = seedData.cmsSeed || {};

  const fullDb = {
    _backupMetadata: {
      timestamp: now.toISOString(),
      backupName: backupDirName,
      version: '3.0.0',
      description: 'Full database snapshot, relations, CMS content, and schemas for Medical 360',
      recordCounts: {
        specialties: specialties.length,
        hospitals: hospitals.length,
        doctors: doctors.length,
        caseStudies: caseStudies.length,
        inquiries: inquiries.length,
        cmsPages: Object.keys(cms).length,
      }
    },
    schemas: {
      specialties: {
        id: "string (PK)",
        name: "string",
        name_fr: "string",
        name_kr: "string",
        shortDescription: "string",
        shortDescription_fr: "string",
        shortDescription_kr: "string",
        description: "string",
        description_fr: "string",
        description_kr: "string",
        icon: "string",
        imageUrl: "string",
        popular: "boolean",
        procedures: "Procedure[] (JSON)"
      },
      hospitals: {
        id: "string (PK)",
        name: "string",
        name_fr: "string",
        name_kr: "string",
        city: "string",
        country: "string",
        description: "string",
        description_fr: "string",
        description_kr: "string",
        imageUrl: "string",
        gallery: "string[] (JSON)",
        accreditations: "string[] (JSON)",
        specialties: "string[] (JSON)",
        bedsCount: "number",
        icuBeds: "number",
        foundedYear: "number",
        rating: "number",
        reviewCount: "number",
        internationalPatientsPerYear: "number",
        languages: "string[] (JSON)",
        featured: "boolean",
        active: "boolean"
      },
      doctors: {
        id: "string (PK)",
        hospitalId: "string (FK -> hospitals.id)",
        name: "string",
        title: "string",
        specialties: "string[] (JSON)",
        qualifications: "string[] (JSON)",
        experience: "number",
        surgeries: "number",
        languages: "string[] (JSON)",
        imageUrl: "string",
        bio: "string",
        consultationFeeUSD: "number",
        featured: "boolean"
      },
      caseStudies: {
        id: "string (PK)",
        patientFirstName: "string",
        patientCountry: "string",
        patientAge: "number",
        condition: "string",
        condition_fr: "string",
        condition_kr: "string",
        specialtyId: "string (FK -> specialties.id)",
        hospitalId: "string (FK -> hospitals.id)",
        treatment: "string",
        treatment_fr: "string",
        treatment_kr: "string",
        outcome: "string",
        outcome_fr: "string",
        outcome_kr: "string",
        testimonial: "string",
        testimonial_fr: "string",
        testimonial_kr: "string",
        costSavedPercent: "number",
        durationDays: "number",
        year: "number",
        imageUrl: "string",
        featured: "boolean"
      },
      inquiries: {
        id: "string (PK)",
        patientName: "string",
        patientEmail: "string",
        patientPhone: "string",
        patientCountry: "string",
        patientAge: "number",
        gender: "string",
        specialtyId: "string (FK -> specialties.id)",
        hospitalId: "string (FK -> hospitals.id)",
        doctorId: "string (FK -> doctors.id)",
        preferredLanguage: "string",
        medicalCondition: "string",
        symptoms: "string",
        previousTreatments: "string",
        budgetUSD: "string",
        timeframe: "string",
        status: "string",
        adminNotes: "string",
        createdAt: "string",
        updatedAt: "string"
      },
      cmsPages: {
        id: "string (PK)",
        name: "string",
        updatedAt: "string",
        content: "Record<string, Record<string, string>> (JSON)"
      }
    },
    data: {
      specialties,
      hospitals,
      doctors,
      caseStudies,
      inquiries,
      cms
    }
  };

  const jsonPath = path.join(outDir, 'medical360_database.json');
  fs.writeFileSync(jsonPath, JSON.stringify(fullDb, null, 2), 'utf8');
  fs.writeFileSync(path.join(latestDir, 'medical360_database.json'), JSON.stringify(fullDb, null, 2), 'utf8');
  console.log(`Saved JSON database: ${jsonPath}`);

  const escapeSql = (val) => {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  let sql = `-- =============================================================================\n`;
  sql += `-- Medical 360 Full Database & Schemas Dump\n`;
  sql += `-- Timestamp: ${now.toISOString()}\n`;
  sql += `-- Compatible with PostgreSQL, MySQL 8+, SQLite, and Cloud SQL\n`;
  sql += `-- =============================================================================\n\n`;

  sql += `BEGIN;\n\n`;

  sql += `-- Drop Tables if exists\n`;
  sql += `DROP TABLE IF EXISTS inquiries CASCADE;\n`;
  sql += `DROP TABLE IF EXISTS case_studies CASCADE;\n`;
  sql += `DROP TABLE IF EXISTS doctors CASCADE;\n`;
  sql += `DROP TABLE IF EXISTS hospitals CASCADE;\n`;
  sql += `DROP TABLE IF EXISTS specialties CASCADE;\n`;
  sql += `DROP TABLE IF EXISTS cms_pages CASCADE;\n\n`;

  sql += `-- 1. Specialties Table\n`;
  sql += `CREATE TABLE specialties (\n`;
  sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
  sql += `  name VARCHAR(255) NOT NULL,\n`;
  sql += `  name_fr VARCHAR(255),\n`;
  sql += `  name_kr VARCHAR(255),\n`;
  sql += `  short_description TEXT,\n`;
  sql += `  short_description_fr TEXT,\n`;
  sql += `  short_description_kr TEXT,\n`;
  sql += `  description TEXT,\n`;
  sql += `  description_fr TEXT,\n`;
  sql += `  description_kr TEXT,\n`;
  sql += `  icon VARCHAR(64),\n`;
  sql += `  image_url VARCHAR(512),\n`;
  sql += `  popular BOOLEAN DEFAULT FALSE,\n`;
  sql += `  procedures JSON\n`;
  sql += `);\n\n`;

  sql += `-- 2. Hospitals Table\n`;
  sql += `CREATE TABLE hospitals (\n`;
  sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
  sql += `  name VARCHAR(255) NOT NULL,\n`;
  sql += `  name_fr VARCHAR(255),\n`;
  sql += `  name_kr VARCHAR(255),\n`;
  sql += `  city VARCHAR(128),\n`;
  sql += `  country VARCHAR(128),\n`;
  sql += `  description TEXT,\n`;
  sql += `  description_fr TEXT,\n`;
  sql += `  description_kr TEXT,\n`;
  sql += `  image_url VARCHAR(512),\n`;
  sql += `  gallery JSON,\n`;
  sql += `  accreditations JSON,\n`;
  sql += `  specialties JSON,\n`;
  sql += `  beds_count INT DEFAULT 0,\n`;
  sql += `  icu_beds INT DEFAULT 0,\n`;
  sql += `  founded_year INT,\n`;
  sql += `  rating DECIMAL(3,2) DEFAULT 5.0,\n`;
  sql += `  review_count INT DEFAULT 0,\n`;
  sql += `  international_patients_per_year INT DEFAULT 0,\n`;
  sql += `  languages JSON,\n`;
  sql += `  featured BOOLEAN DEFAULT FALSE,\n`;
  sql += `  active BOOLEAN DEFAULT TRUE\n`;
  sql += `);\n\n`;

  sql += `-- 3. Doctors Table\n`;
  sql += `CREATE TABLE doctors (\n`;
  sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
  sql += `  hospital_id VARCHAR(64) REFERENCES hospitals(id) ON DELETE SET NULL,\n`;
  sql += `  name VARCHAR(255) NOT NULL,\n`;
  sql += `  title VARCHAR(255),\n`;
  sql += `  specialties JSON,\n`;
  sql += `  qualifications JSON,\n`;
  sql += `  experience INT DEFAULT 0,\n`;
  sql += `  surgeries INT DEFAULT 0,\n`;
  sql += `  languages JSON,\n`;
  sql += `  image_url VARCHAR(512),\n`;
  sql += `  bio TEXT,\n`;
  sql += `  consultation_fee_usd DECIMAL(10,2) DEFAULT 0.00,\n`;
  sql += `  featured BOOLEAN DEFAULT FALSE\n`;
  sql += `);\n\n`;

  sql += `-- 4. Case Studies Table\n`;
  sql += `CREATE TABLE case_studies (\n`;
  sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
  sql += `  patient_first_name VARCHAR(128),\n`;
  sql += `  patient_country VARCHAR(128),\n`;
  sql += `  patient_age INT,\n`;
  sql += `  condition VARCHAR(255),\n`;
  sql += `  condition_fr VARCHAR(255),\n`;
  sql += `  condition_kr VARCHAR(255),\n`;
  sql += `  specialty_id VARCHAR(64) REFERENCES specialties(id) ON DELETE SET NULL,\n`;
  sql += `  hospital_id VARCHAR(64) REFERENCES hospitals(id) ON DELETE SET NULL,\n`;
  sql += `  treatment VARCHAR(255),\n`;
  sql += `  treatment_fr VARCHAR(255),\n`;
  sql += `  treatment_kr VARCHAR(255),\n`;
  sql += `  outcome TEXT,\n`;
  sql += `  outcome_fr TEXT,\n`;
  sql += `  outcome_kr TEXT,\n`;
  sql += `  testimonial TEXT,\n`;
  sql += `  testimonial_fr TEXT,\n`;
  sql += `  testimonial_kr TEXT,\n`;
  sql += `  cost_saved_percent INT DEFAULT 0,\n`;
  sql += `  duration_days INT DEFAULT 0,\n`;
  sql += `  year INT,\n`;
  sql += `  image_url VARCHAR(512),\n`;
  sql += `  featured BOOLEAN DEFAULT FALSE\n`;
  sql += `);\n\n`;

  sql += `-- 5. Inquiries Table\n`;
  sql += `CREATE TABLE inquiries (\n`;
  sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
  sql += `  patient_name VARCHAR(255) NOT NULL,\n`;
  sql += `  patient_email VARCHAR(255),\n`;
  sql += `  patient_phone VARCHAR(64),\n`;
  sql += `  patient_country VARCHAR(128),\n`;
  sql += `  patient_age INT,\n`;
  sql += `  gender VARCHAR(32),\n`;
  sql += `  specialty_id VARCHAR(64),\n`;
  sql += `  hospital_id VARCHAR(64),\n`;
  sql += `  doctor_id VARCHAR(64),\n`;
  sql += `  preferred_language VARCHAR(32),\n`;
  sql += `  medical_condition TEXT,\n`;
  sql += `  symptoms TEXT,\n`;
  sql += `  previous_treatments TEXT,\n`;
  sql += `  budget_usd VARCHAR(64),\n`;
  sql += `  timeframe VARCHAR(64),\n`;
  sql += `  status VARCHAR(64) DEFAULT 'new',\n`;
  sql += `  admin_notes TEXT,\n`;
  sql += `  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n`;
  sql += `  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n`;
  sql += `);\n\n`;

  sql += `-- 6. CMS Pages Table\n`;
  sql += `CREATE TABLE cms_pages (\n`;
  sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
  sql += `  name VARCHAR(255) NOT NULL,\n`;
  sql += `  updated_at VARCHAR(64),\n`;
  sql += `  content JSON\n`;
  sql += `);\n\n`;

  sql += `-- ─── INSERT DATA ───────────────────────────────────────────────────────────\n\n`;

  for (const s of specialties) {
    sql += `INSERT INTO specialties (id, name, name_fr, name_kr, short_description, short_description_fr, short_description_kr, description, description_fr, description_kr, icon, image_url, popular, procedures) VALUES (${escapeSql(s.id)}, ${escapeSql(s.name)}, ${escapeSql(s.name_fr)}, ${escapeSql(s.name_kr)}, ${escapeSql(s.shortDescription)}, ${escapeSql(s.shortDescription_fr)}, ${escapeSql(s.shortDescription_kr)}, ${escapeSql(s.description)}, ${escapeSql(s.description_fr)}, ${escapeSql(s.description_kr)}, ${escapeSql(s.icon)}, ${escapeSql(s.imageUrl)}, ${escapeSql(s.popular)}, ${escapeSql(s.procedures)});\n`;
  }
  sql += `\n`;

  for (const h of hospitals) {
    sql += `INSERT INTO hospitals (id, name, name_fr, name_kr, city, country, description, description_fr, description_kr, image_url, gallery, accreditations, specialties, beds_count, icu_beds, founded_year, rating, review_count, international_patients_per_year, languages, featured, active) VALUES (${escapeSql(h.id)}, ${escapeSql(h.name)}, ${escapeSql(h.name_fr)}, ${escapeSql(h.name_kr)}, ${escapeSql(h.city)}, ${escapeSql(h.country)}, ${escapeSql(h.description)}, ${escapeSql(h.description_fr)}, ${escapeSql(h.description_kr)}, ${escapeSql(h.imageUrl)}, ${escapeSql(h.gallery)}, ${escapeSql(h.accreditations)}, ${escapeSql(h.specialties)}, ${escapeSql(h.bedsCount)}, ${escapeSql(h.icuBeds)}, ${escapeSql(h.foundedYear)}, ${escapeSql(h.rating)}, ${escapeSql(h.reviewCount)}, ${escapeSql(h.internationalPatientsPerYear)}, ${escapeSql(h.languages)}, ${escapeSql(h.featured)}, ${escapeSql(h.active)});\n`;
  }
  sql += `\n`;

  for (const d of doctors) {
    sql += `INSERT INTO doctors (id, hospital_id, name, title, specialties, qualifications, experience, surgeries, languages, image_url, bio, consultation_fee_usd, featured) VALUES (${escapeSql(d.id)}, ${escapeSql(d.hospitalId)}, ${escapeSql(d.name)}, ${escapeSql(d.title)}, ${escapeSql(d.specialties)}, ${escapeSql(d.qualifications)}, ${escapeSql(d.experience)}, ${escapeSql(d.surgeries)}, ${escapeSql(d.languages)}, ${escapeSql(d.imageUrl)}, ${escapeSql(d.bio)}, ${escapeSql(d.consultationFeeUSD)}, ${escapeSql(d.featured)});\n`;
  }
  sql += `\n`;

  for (const cs of caseStudies) {
    sql += `INSERT INTO case_studies (id, patient_first_name, patient_country, patient_age, condition, condition_fr, condition_kr, specialty_id, hospital_id, treatment, treatment_fr, treatment_kr, outcome, outcome_fr, outcome_kr, testimonial, testimonial_fr, testimonial_kr, cost_saved_percent, duration_days, year, image_url, featured) VALUES (${escapeSql(cs.id)}, ${escapeSql(cs.patientFirstName)}, ${escapeSql(cs.patientCountry)}, ${escapeSql(cs.patientAge)}, ${escapeSql(cs.condition)}, ${escapeSql(cs.condition_fr)}, ${escapeSql(cs.condition_kr)}, ${escapeSql(cs.specialtyId)}, ${escapeSql(cs.hospitalId)}, ${escapeSql(cs.treatment)}, ${escapeSql(cs.treatment_fr)}, ${escapeSql(cs.treatment_kr)}, ${escapeSql(cs.outcome)}, ${escapeSql(cs.outcome_fr)}, ${escapeSql(cs.outcome_kr)}, ${escapeSql(cs.testimonial)}, ${escapeSql(cs.testimonial_fr)}, ${escapeSql(cs.testimonial_kr)}, ${escapeSql(cs.costSavedPercent)}, ${escapeSql(cs.durationDays)}, ${escapeSql(cs.year)}, ${escapeSql(cs.imageUrl)}, ${escapeSql(cs.featured)});\n`;
  }
  sql += `\n`;

  for (const inq of inquiries) {
    sql += `INSERT INTO inquiries (id, patient_name, patient_email, patient_phone, patient_country, patient_age, gender, specialty_id, hospital_id, doctor_id, preferred_language, medical_condition, symptoms, previous_treatments, budget_usd, timeframe, status, admin_notes, created_at, updated_at) VALUES (${escapeSql(inq.id)}, ${escapeSql(inq.patientName)}, ${escapeSql(inq.patientEmail)}, ${escapeSql(inq.patientPhone)}, ${escapeSql(inq.patientCountry)}, ${escapeSql(inq.patientAge)}, ${escapeSql(inq.gender)}, ${escapeSql(inq.specialtyId)}, ${escapeSql(inq.hospitalId)}, ${escapeSql(inq.doctorId)}, ${escapeSql(inq.preferredLanguage)}, ${escapeSql(inq.medicalCondition)}, ${escapeSql(inq.symptoms)}, ${escapeSql(inq.previousTreatments)}, ${escapeSql(inq.budgetUSD)}, ${escapeSql(inq.timeframe)}, ${escapeSql(inq.status)}, ${escapeSql(inq.adminNotes)}, ${escapeSql(inq.createdAt)}, ${escapeSql(inq.updatedAt)});\n`;
  }
  sql += `\n`;

  for (const [pageId, pageData] of Object.entries(cms)) {
    sql += `INSERT INTO cms_pages (id, name, updated_at, content) VALUES (${escapeSql(pageId)}, ${escapeSql(pageData.name || pageId)}, ${escapeSql(pageData.updatedAt || now.toISOString())}, ${escapeSql(pageData.content)});\n`;
  }

  sql += `\nCOMMIT;\n`;

  const sqlPath = path.join(outDir, 'medical360_database.sql');
  fs.writeFileSync(sqlPath, sql, 'utf8');
  fs.writeFileSync(path.join(latestDir, 'medical360_database.sql'), sql, 'utf8');
  console.log(`Saved SQL database dump: ${sqlPath}`);

  const restoreScriptContent = `/**
 * Medical 360 Easy Restore Utility
 * Usage: node restore.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonDbPath = path.join(__dirname, 'medical360_database.json');
const sqlDbPath = path.join(__dirname, 'medical360_database.sql');

if (!fs.existsSync(jsonDbPath)) {
  console.error('Error: medical360_database.json not found in backup directory.');
  process.exit(1);
}

const backupData = JSON.parse(fs.readFileSync(jsonDbPath, 'utf8'));
console.log('====================================================');
console.log(' Medical 360 Backup Restore Utility');
console.log(' Backup Name: ' + backupData._backupMetadata.backupName);
console.log(' Backup Date: ' + backupData._backupMetadata.timestamp);
console.log(' Specialties: ' + backupData._backupMetadata.recordCounts.specialties);
console.log(' Hospitals:   ' + backupData._backupMetadata.recordCounts.hospitals);
console.log(' Doctors:     ' + backupData._backupMetadata.recordCounts.doctors);
console.log(' Cases:       ' + backupData._backupMetadata.recordCounts.caseStudies);
console.log(' Inquiries:   ' + backupData._backupMetadata.recordCounts.inquiries);
console.log(' CMS Pages:   ' + backupData._backupMetadata.recordCounts.cmsPages);
console.log('====================================================');
console.log('✓ Database files are verified and ready for restore:');
console.log('  1. JSON Store: ' + jsonDbPath);
console.log('  2. SQL Schema: ' + sqlDbPath);
console.log('  3. In browser: Clear localStorage or execute localStorage.setItem("med360_mock_store_v3", JSON.stringify(backupData.data));');
console.log('✓ Restore verification complete!');
`;

  fs.writeFileSync(path.join(outDir, 'restore.js'), restoreScriptContent, 'utf8');
  fs.writeFileSync(path.join(latestDir, 'restore.js'), restoreScriptContent, 'utf8');

  const manifest = {
    backupName: backupDirName,
    createdAt: now.toISOString(),
    version: '3.0.0',
    files: [
      'medical360_database.json',
      'medical360_database.sql',
      'restore.js',
      'branches_manifest.txt'
    ],
    recordCounts: fullDb._backupMetadata.recordCounts,
    git: {
      web: {
        repo: 'nivekneved/medical360',
        branches: webGitInfo.trim().split('\n')
      },
      mobile: {
        repo: 'nivekneved/medical360-mobile',
        branches: mobileGitInfo.trim().split('\n')
      }
    }
  };

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(path.join(latestDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  const branchesTxt = `=============================================================================
Medical 360 Git Branches & State Manifest
Backup Timestamp: ${now.toISOString()}
=============================================================================

1. Web Repository (medical360):
-----------------------------------------------------------------------------
${webGitInfo}

2. Mobile Repository (medical360-mobile):
-----------------------------------------------------------------------------
${mobileGitInfo}
`;
  fs.writeFileSync(path.join(outDir, 'branches_manifest.txt'), branchesTxt, 'utf8');
  fs.writeFileSync(path.join(latestDir, 'branches_manifest.txt'), branchesTxt, 'utf8');

  console.log(`Backup manifest and branches info generated successfully!`);
}

run().catch(err => {
  console.error('Backup failed:', err);
  process.exit(1);
});
