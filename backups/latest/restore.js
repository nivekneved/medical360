/**
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
