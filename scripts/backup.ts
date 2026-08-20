import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Emulate simple import of the seeds (assuming tsx runs this)
import { hospitalsSeed } from '../src/core/mock/seeds/hospitals.seed';
import { specialtiesSeed } from '../src/core/mock/seeds/specialties.seed';
import { caseStudiesSeed } from '../src/core/mock/seeds/case-studies.seed';
import { inquiriesSeed } from '../src/core/mock/seeds/inquiries.seed';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getTimestamp() {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
}

const timestamp = getTimestamp();
const backupDir = path.join(__dirname, '..', `medical360_backup_${timestamp}`);

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// 1. JSON Dump
const db = {
  hospitals: hospitalsSeed,
  specialties: specialtiesSeed,
  caseStudies: caseStudiesSeed,
  inquiries: inquiriesSeed,
};

fs.writeFileSync(
  path.join(backupDir, 'database.json'),
  JSON.stringify(db, null, 2)
);

// 2. SQL Dump
let sql = `-- Medical360 Database Backup\n-- Date: ${new Date().toISOString()}\n\n`;

// Helper to escape SQL strings
const esc = (val: any) => {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return val;
};

// Hospitals table
sql += `CREATE TABLE hospitals (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  city VARCHAR(255),
  country VARCHAR(255),
  description TEXT,
  imageUrl VARCHAR(255),
  gallery JSON,
  accreditations JSON,
  specialties JSON,
  bedsCount INT,
  icuBeds INT,
  foundedYear INT,
  rating FLOAT,
  reviewCount INT,
  internationalPatientsPerYear INT,
  languages JSON,
  website VARCHAR(255),
  featured BOOLEAN,
  active BOOLEAN
);\n\n`;

for (const h of hospitalsSeed) {
  const keys = Object.keys(h).join(', ');
  const values = Object.values(h).map(esc).join(', ');
  sql += `INSERT INTO hospitals (${keys}) VALUES (${values});\n`;
}

// Specialties table
sql += `\nCREATE TABLE specialties (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  slug VARCHAR(255),
  icon VARCHAR(255),
  shortDescription TEXT,
  description TEXT,
  imageUrl VARCHAR(255),
  featured BOOLEAN,
  procedures JSON
);\n\n`;

for (const s of specialtiesSeed) {
  const keys = Object.keys(s).join(', ');
  const values = Object.values(s).map(esc).join(', ');
  sql += `INSERT INTO specialties (${keys}) VALUES (${values});\n`;
}

// Case Studies table
sql += `\nCREATE TABLE case_studies (
  id VARCHAR(255) PRIMARY KEY,
  specialtyId VARCHAR(255),
  hospitalId VARCHAR(255),
  patientName VARCHAR(255),
  patientCountry VARCHAR(255),
  condition VARCHAR(255),
  procedureName VARCHAR(255),
  story TEXT,
  costSavingsUSD INT,
  costSavingsPercentage INT,
  imageUrl VARCHAR(255),
  featured BOOLEAN
);\n\n`;

for (const c of caseStudiesSeed) {
  const keys = Object.keys(c).join(', ');
  const values = Object.values(c).map(esc).join(', ');
  sql += `INSERT INTO case_studies (${keys}) VALUES (${values});\n`;
}

// Inquiries table
sql += `\nCREATE TABLE inquiries (
  id VARCHAR(255) PRIMARY KEY,
  patientFirstName VARCHAR(255),
  patientLastName VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(255),
  country VARCHAR(255),
  specialtyId VARCHAR(255),
  preferredHospitalId VARCHAR(255),
  urgency VARCHAR(50),
  description TEXT,
  status VARCHAR(50),
  createdAt VARCHAR(255),
  updatedAt VARCHAR(255),
  documents JSON,
  notes JSON
);\n\n`;

for (const i of inquiriesSeed) {
  const keys = Object.keys(i).join(', ');
  const values = Object.values(i).map(esc).join(', ');
  sql += `INSERT INTO inquiries (${keys}) VALUES (${values});\n`;
}

fs.writeFileSync(path.join(backupDir, 'database.sql'), sql);

// 3. Restore Instructions
const readme = `Medical360 Backup
=================
Date: ${new Date().toISOString()}

This archive contains a full backup of the Medical360 repository, branches, and mock database.

Contents:
- database.json: A full JSON dump of the mock database (hospitals, specialties, case studies, inquiries).
- database.sql: A full SQL dump with CREATE TABLE and INSERT statements to easily import this data into a PostgreSQL or MySQL database.
- repo_branches.bundle: A full git bundle containing ALL branches and commit history of the repository.

How to Restore the Git Repository:
1. To clone from the bundle: 
   git clone repo_branches.bundle medical360-restored
2. This will restore the entire repository with all branches.

How to Restore the Database:
- To use the JSON: Simply replace the objects in \`src/core/mock/seeds/\` with the contents of the JSON.
- To use the SQL: Import \`database.sql\` into your SQL engine of choice. The JSON fields will map natively to JSON/JSONB columns in Postgres.
`;
fs.writeFileSync(path.join(backupDir, 'restore_instructions.txt'), readme);

console.log(`Backup successfully created at ${backupDir}`);
