import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Read-only diagnostic: lists the live Supabase `hospitals` rows and flags
// any row whose name_fr / name_kr differs from the English brand name.

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

console.log(`Total hospitals in live Supabase: ${data.length}\n`);

let mismatches = 0;
for (const h of data) {
  const mismatch = h.name_fr !== h.name || h.name_kr !== h.name;
  if (mismatch) mismatches++;
  console.log(
    `${mismatch ? 'MISMATCH' : 'OK      '} | ${h.id} | ${h.name} | fr="${h.name_fr}" | kr="${h.name_kr}"`
  );
}

console.log(`\n${mismatches} row(s) with translated brand names need fixing.`);
