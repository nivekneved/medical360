// Applies a .sql migration file in ONE transaction (all-or-nothing).
//   node scripts/apply-migration.mjs supabase/migrations/<file>.sql
import fs from 'fs';
import { connect } from './db-introspect.mjs';

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/apply-migration.mjs <file.sql>'); process.exit(1); }
const sql = fs.readFileSync(file, 'utf8');

const c = await connect();
try {
  await c.query('begin');
  await c.query(sql);
  await c.query('commit');
  console.log(`Applied: ${file}`);
} catch (e) {
  await c.query('rollback').catch(() => {});
  console.error('ROLLED BACK:', e.message);
  process.exitCode = 1;
} finally {
  await c.end();
}
