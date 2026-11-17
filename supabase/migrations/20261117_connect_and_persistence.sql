-- =============================================================================
-- Med360 — Connect Hub, WhatsApp Logs & Telemetry Persistence
-- Idempotent migration (2026-11-17)
-- =============================================================================

-- 1. Add missing attribution columns to public.inquiries
alter table public.inquiries add column if not exists service_id text;
alter table public.inquiries add column if not exists service_name text;
alter table public.inquiries add column if not exists hospital_id text;
alter table public.inquiries add column if not exists hospital_name text;
alter table public.inquiries add column if not exists source_page text;

-- 2. WhatsApp Consultation & Webhook Logs
create table if not exists public.whatsapp_logs (
  id text primary key,
  timestamp timestamptz default now(),
  source text not null,
  patient_name text,
  country text default 'Mauritius',
  specialty text,
  phone text,
  prefilled_message text,
  webhook_status text default 'dispatched',
  created_at timestamptz default now()
);

alter table public.whatsapp_logs enable row level security;

drop policy if exists "public insert whatsapp_logs" on public.whatsapp_logs;
create policy "public insert whatsapp_logs" on public.whatsapp_logs
  for insert to anon, authenticated
  with check (length(source) between 1 and 200);

drop policy if exists "admin all whatsapp_logs" on public.whatsapp_logs;
create policy "admin all whatsapp_logs" on public.whatsapp_logs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.whatsapp_logs from anon;
grant insert on public.whatsapp_logs to anon;
grant all on public.whatsapp_logs to authenticated;

-- 3. Telemetry Events
create table if not exists public.telemetry_events (
  id text primary key,
  event_name text not null,
  params jsonb default '{}'::jsonb,
  url text,
  created_at timestamptz default now()
);

alter table public.telemetry_events enable row level security;

drop policy if exists "public insert telemetry_events" on public.telemetry_events;
create policy "public insert telemetry_events" on public.telemetry_events
  for insert to anon, authenticated
  with check (length(event_name) between 1 and 100);

drop policy if exists "admin read telemetry_events" on public.telemetry_events;
create policy "admin read telemetry_events" on public.telemetry_events
  for select to authenticated using (public.is_admin());

revoke all on public.telemetry_events from anon;
grant insert on public.telemetry_events to anon;
grant select, insert on public.telemetry_events to authenticated;

-- 4. Medical Travel & Visa Concierge Dossiers
create table if not exists public.concierge_dossiers (
  id text primary key,
  inquiry_id text,
  patient_name text not null,
  origin text default 'Port Louis, Mauritius',
  destination_hub text not null,
  hospital_name text not null,
  procedure_name text not null,
  visa_status text default 'pending_invitation' check (visa_status in ('pending_invitation', 'letter_issued', 'visa_granted', 'travel_ready')),
  flight_details text,
  travel_date text,
  companion_name text,
  liaison_officer text,
  emergency_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.concierge_dossiers enable row level security;

drop policy if exists "admin all concierge_dossiers" on public.concierge_dossiers;
create policy "admin all concierge_dossiers" on public.concierge_dossiers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
