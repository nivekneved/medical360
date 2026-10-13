// Creates / updates the SUPER ADMIN as a real Supabase Auth user + admin_users row.
//
//   $env:SUPER_ADMIN_EMAIL    = '...'
//   $env:SUPER_ADMIN_PASSWORD = '...'      # never stored in the repo or DB in plaintext
//   node scripts/create-super-admin.mjs
//
// The password is hashed with bcrypt (pgcrypto crypt/gen_salt) by Postgres itself and
// stored only in auth.users.encrypted_password — the same format GoTrue uses.
import { connect } from './db-introspect.mjs';

const email = (process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.SUPER_ADMIN_PASSWORD || '';
const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

if (!email || !password) {
  console.error('Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD environment variables.');
  process.exit(1);
}
if (password.length < 12) {
  console.error('Refusing: password must be at least 12 characters.');
  process.exit(1);
}

const c = await connect();
try {
  await c.query('begin');
  await c.query('create extension if not exists pgcrypto with schema extensions');

  const existing = await c.query('select id from auth.users where lower(email) = $1', [email]);

  if (existing.rows.length) {
    const id = existing.rows[0].id;
    await c.query(
      `update auth.users
          set encrypted_password = extensions.crypt($2, extensions.gen_salt('bf')),
              email_confirmed_at = coalesce(email_confirmed_at, now()),
              raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || '{"provider":"email","providers":["email"],"role":"super_admin"}'::jsonb,
              updated_at = now()
        where id = $1`,
      [id, password]
    );
    console.log('Updated existing auth user.');
  } else {
    const ins = await c.query(
      `insert into auth.users (
         instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
         raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
         confirmation_token, email_change, email_change_token_new, recovery_token
       ) values (
         '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
         $1, extensions.crypt($2, extensions.gen_salt('bf')), now(),
         '{"provider":"email","providers":["email"],"role":"super_admin"}'::jsonb,
         jsonb_build_object('full_name', $3::text, 'email_verified', true),
         now(), now(), '', '', '', ''
       ) returning id`,
      [email, password, name]
    );
    const id = ins.rows[0].id;
    await c.query(
      `insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
       values (gen_random_uuid(), $1::uuid, $2::text,
               jsonb_build_object('sub', $2::text, 'email', $3::text, 'email_verified', true),
               'email', now(), now(), now())`,
      [id, String(id), email]
    );
    console.log('Created auth user.');
  }

  // Role record used by RLS (is_admin / is_super_admin). No password stored here.
  await c.query(
    `insert into public.admin_users (id, email, name, role, active)
     values ('super-' || substr(md5($1), 1, 8), $1, $2, 'super_admin', true)
     on conflict (email) do update set role = 'super_admin', active = true, name = excluded.name`,
    [email, name]
  );

  await c.query('commit');
  console.log(`Super admin ready: ${email}`);
} catch (e) {
  await c.query('rollback').catch(() => {});
  console.error('FAILED:', e.message);
  process.exitCode = 1;
} finally {
  await c.end();
}
