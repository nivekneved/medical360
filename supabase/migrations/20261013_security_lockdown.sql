-- =============================================================================
-- Med360 — Security lockdown migration (RLS) — 2026-10-13
-- Idempotent. Contains NO credentials.
--
-- Model:
--   * Catalog tables (hospitals, specialties, doctors, case_studies): public READ,
--     writes only by active admins.
--   * inquiries: public INSERT only (patient forms). No public read/update/delete.
--   * campaigns / audiences / contacts / admin_users: admins only.
--   * admin_users: only super_admin can modify.
--
-- "Admin" = an authenticated Supabase Auth user whose JWT email matches an
-- ACTIVE row in public.admin_users. Role comes from admin_users (server-side),
-- never from user-editable metadata.
-- =============================================================================

-- 1. Allow the super_admin role -----------------------------------------------
alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users
  add constraint admin_users_role_check
  check (role in ('super_admin', 'admin', 'case_manager'));

-- 2. Helper functions (SECURITY DEFINER avoids RLS recursion on admin_users) ---
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users u
    where lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and u.active
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users u
    where lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and u.active
      and u.role = 'super_admin'
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_super_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_super_admin() to anon, authenticated;

-- 3. Drop every existing policy on the managed tables --------------------------
do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public'
      and tablename in ('hospitals','specialties','doctors','case_studies',
                        'inquiries','campaigns','audiences','contacts','admin_users')
  loop
    execute format('drop policy if exists %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

alter table public.hospitals    enable row level security;
alter table public.specialties  enable row level security;
alter table public.doctors      enable row level security;
alter table public.case_studies enable row level security;
alter table public.inquiries    enable row level security;
alter table public.campaigns    enable row level security;
alter table public.audiences    enable row level security;
alter table public.contacts     enable row level security;
alter table public.admin_users  enable row level security;

-- 4. Catalog: public read, admin write -----------------------------------------
create policy "public read hospitals"    on public.hospitals    for select using (true);
create policy "public read specialties"  on public.specialties  for select using (true);
create policy "public read doctors"      on public.doctors      for select using (true);
create policy "public read case_studies" on public.case_studies for select using (true);

create policy "admin write hospitals"    on public.hospitals    for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write specialties"  on public.specialties  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write doctors"      on public.doctors      for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin write case_studies" on public.case_studies for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5. Inquiries: public INSERT only (with sanity checks), admin everything -------
create policy "public insert inquiries" on public.inquiries
  for insert to anon, authenticated
  with check (
    status = 'new'
    and assigned_case_manager_id is null
    and length(first_name) between 1 and 100
    and length(last_name)  between 1 and 100
    and length(email)      between 3 and 254
    and length(phone)      between 3 and 40
    and length(description) <= 5000
  );

create policy "admin all inquiries" on public.inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 6. Marketing tables: admin only ----------------------------------------------
create policy "admin all campaigns" on public.campaigns for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all audiences" on public.audiences for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all contacts"  on public.contacts  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 7. admin_users: admins read, only super_admin writes -------------------------
create policy "admin read admin_users"  on public.admin_users for select to authenticated using (public.is_admin());
create policy "super write admin_users" on public.admin_users for all    to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- 8. Defence in depth: strip default broad grants from anon on sensitive tables -
revoke all on public.inquiries, public.campaigns, public.audiences, public.contacts, public.admin_users from anon;
grant insert on public.inquiries to anon;
