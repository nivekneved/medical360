-- =============================================================================
-- Med360 — Site Settings (Global Maintenance Mode & Config)
-- =============================================================================

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings for select using (true);

drop policy if exists "admin write site_settings" on public.site_settings;
create policy "admin write site_settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to authenticated;

-- Ensure default maintenance_mode is false (LIVE)
insert into public.site_settings (key, value)
values ('maintenance_mode', 'false'::jsonb)
on conflict (key) do update set value = 'false'::jsonb, updated_at = now();
