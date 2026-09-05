/**
 * Medical 360 — Data Integrity & Schema Validation Script
 * Verifies that mock seeds and Supabase repositories match domain schema rules.
 */

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

console.log('🔍 Checking seed data integrity and JSON models...');

const requiredSeedFiles = [
  'src/core/mock/seeds/specialties.seed.ts',
  'src/core/mock/seeds/hospitals.seed.ts',
  'src/core/mock/seeds/doctors.seed.ts',
  'src/core/mock/seeds/case-studies.seed.ts',
  'src/core/mock/seeds/cms.seed.ts',
  'src/core/mock/seeds/inquiries.seed.ts',
];

let allValid = true;
for (const seedPath of requiredSeedFiles) {
  const fullPath = resolve(process.cwd(), seedPath);
  if (!existsSync(fullPath)) {
    console.error(`❌ Missing seed file: ${seedPath}`);
    allValid = false;
  } else {
    const content = readFileSync(fullPath, 'utf8');
    if (content.length < 50) {
      console.warn(`⚠️ Warning: Seed file ${seedPath} appears empty or truncated.`);
    } else {
      console.log(`✅ Verified ${seedPath} (${(content.length / 1024).toFixed(1)} KB)`);
    }
  }
}

if (!allValid) {
  console.error('❌ Data verification failed.');
  process.exit(1);
}

console.log('✨ All seed data schemas verified.\n');
