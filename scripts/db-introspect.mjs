// Read-only: lists public tables, RLS status and policies on the live Supabase DB.
// Usage: node scripts/db-introspect.mjs   (reads SUPABASE_DB_PASSWORD + VITE_SUPABASE_URL from .env)
import fs from 'fs';
import pg from 'pg';

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/).filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)])
);
const ref = new URL(env.VITE_SUPABASE_URL).hostname.split('.')[0];

export async function connect() {
  // Direct host is IPv6-only; set SUPABASE_DB_HOST (e.g. aws-0-<region>.pooler.supabase.com)
  // to use the IPv4 session pooler. Pooler username is "postgres.<ref>".
  const host = process.env.SUPABASE_DB_HOST || env.SUPABASE_DB_HOST || `db.${ref}.supabase.co`;
  const pooled = host.includes('pooler.supabase.com');
  const client = new pg.Client({
    host,
    port: 5432,
    user: pooled ? `postgres.${ref}` : 'postgres',
    password: env.SUPABASE_DB_PASSWORD,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  await client.connect();
  return client;
}

import { fileURLToPath } from 'url';
import path from 'path';
if (path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const c = await connect();
  const t = await c.query(`select c.relname, c.relrowsecurity as rls from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' order by 1`);
  console.log('TABLES:'); t.rows.forEach(r => console.log(' ', r.relname, r.rls ? '[RLS on]' : '[RLS OFF]'));
  const p = await c.query(`select tablename, policyname, cmd, roles, qual, with_check from pg_policies where schemaname='public' order by 1,2`);
  console.log('POLICIES:'); p.rows.forEach(r => console.log(' ', r.tablename, '|', r.policyname, '|', r.cmd, '|', r.roles, '| using:', r.qual, '| check:', r.with_check));
  const a = await c.query(`select email, raw_app_meta_data->>'role' as role from auth.users order by created_at`);
  console.log('AUTH USERS:', a.rows.length); a.rows.forEach(r => console.log(' ', r.email, r.role));
  await c.end();
}
