import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Normalises hospital brand names in the live Supabase `hospitals` table:
// brand names (Apollo Hospitals, Medanta, etc.) are proper nouns and must
// remain identical to the English name in every language.
// Only `name_fr` and `name_kr` columns are touched, keyed by existing ids.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const { data, error } = await supabase
  .from('hospitals')
  .select('id, name, name_fr, name_kr')
  .order('id');

if (error) {
  console.error('ERROR querying hospitals:', error.message);
  process.exit(1);
}

console.log(`Loaded ${data.length} hospitals from live Supabase.\n`);

let updated = 0;
let failed = 0;

for (const h of data) {
  if (h.name_fr === h.name && h.name_kr === h.name) {
    console.log(`SKIP (already correct) | ${h.id} | ${h.name}`);
    continue;
  }

  console.log(`UPDATE | ${h.id} | ${h.name}`);
  console.log(`   fr: "${h.name_fr}" -> "${h.name}"`);
  console.log(`   kr: "${h.name_kr}" -> "${h.name}"`);

  const { error: updErr } = await supabase
    .from('hospitals')
    .update({ name_fr: h.name, name_kr: h.name, updated_at: new Date().toISOString() })
    .eq('id', h.id);

  if (updErr) {
    failed++;
    console.error(`   ❌ Failed: ${updErr.message}`);
  } else {
    updated++;
    console.log('   ✅ Updated');
  }
}

console.log(`\nDone. ${updated} row(s) updated, ${failed} failed, ${data.length - updated - failed} already correct.`);
process.exit(failed > 0 ? 1 : 0);
