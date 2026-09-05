import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://vtcywighvyndtoxfvmny.supabase.co';
const supabaseAnonKey = 'sb_publishable_A5Ugg4ZnCDbak0_h8gjy5Q_ZXVauRm0';
const client = createClient(supabaseUrl, supabaseAnonKey);

const tables = [
  'hospitals',
  'specialties',
  'doctors',
  'case_studies',
  'inquiries',
];

async function runBackup() {
  const backupDir = path.join(__dirname, '..', 'backups', 'database');
  fs.mkdirSync(backupDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fullDump = {
    _timestamp: new Date().toISOString(),
    _supabaseUrl: supabaseUrl,
    tables: {},
  };

  console.log('📦 Starting Supabase Database Backup...');

  for (const table of tables) {
    try {
      const { data, error } = await client.from(table).select('*');
      if (error) {
        console.warn(`⚠️ Warning fetching ${table}:`, error.message);
        fullDump.tables[table] = { error: error.message };
      } else {
        console.log(`✅ Backed up ${table}: ${data?.length ?? 0} rows`);
        fullDump.tables[table] = data;
        fs.writeFileSync(
          path.join(backupDir, `${table}_${timestamp}.json`),
          JSON.stringify(data, null, 2)
        );
      }
    } catch (e) {
      console.error(`❌ Error fetching ${table}:`, e.message);
    }
  }

  const latestFile = path.join(backupDir, `latest_dump.json`);
  const stampedFile = path.join(backupDir, `supabase_full_dump_${timestamp}.json`);
  
  fs.writeFileSync(latestFile, JSON.stringify(fullDump, null, 2));
  fs.writeFileSync(stampedFile, JSON.stringify(fullDump, null, 2));

  console.log(`\n🎉 Backup Complete!`);
  console.log(`📁 Timestamped backup: ${stampedFile}`);
  console.log(`📁 Latest backup: ${latestFile}`);
}

runBackup();
