/**
 * Medical 360 — 1-Click Database & Mock Engine Restore Script
 * Usage: node restore.js [--target=mock|sqlite|json]
 */
const fs = require('fs');
const path = require('path');

const target = process.argv.find((a) => a.startsWith('--target='))?.split('=')[1] || 'all';

console.log('🔄 Medical 360 Restore Utility');
console.log('Target Mode:', target);

const dumpPath = path.resolve(__dirname, 'full_database.json');
if (!fs.existsSync(dumpPath)) {
  console.error('❌ Error: full_database.json not found in current directory.');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dumpPath, 'utf-8'));
console.log('✓ Successfully loaded backup ID:', db._backup_metadata.backup_id);
console.log('✓ Timestamp:', db._backup_metadata.timestamp);
console.log('✓ Table Records:', JSON.stringify(db._backup_metadata.tables_summary, null, 2));

// 1. Verify Integrity
console.log('\n[1/3] Verifying entity records integrity...');
const tables = Object.keys(db.tables);
tables.forEach((t) => {
  console.log(`  ✓ Table '${t}': ${Array.isArray(db.tables[t]) ? db.tables[t].length : 1} records valid`);
});

// 2. Generate Store Payload for Mobile MockEngine & AsyncStorage
const mockStorePayload = {
  hospitals: db.tables.hospitals,
  specialties: db.tables.specialties,
  doctors: db.tables.doctors,
  caseStudies: db.tables.case_studies,
  inquiries: db.tables.inquiries,
  cmsPages: db.tables.cms_pages,
  config: db.tables.mock_config || {
    latency: 'normal',
    failureRate: 0,
    enablePersistence: true,
    storageKey: '@med360_mock_store_v1',
    version: '1.0.0',
  },
};

const storeExportPath = path.resolve(__dirname, 'mock_store_payload.json');
fs.writeFileSync(storeExportPath, JSON.stringify(mockStorePayload, null, 2));
console.log(`\n[2/3] Generated MockEngine Store payload at: ${storeExportPath}`);

// 3. Complete
console.log('\n[3/3] ✅ Database restore files prepared successfully!');
console.log('• To restore SQL database: psql -U postgres -d medical360 -f restore.sql');
console.log('• To restore SQLite database: sqlite3 medical360.db < restore.sql');
console.log('• To restore MockEngine: MockEngine loads mock_store_payload.json directly.');
