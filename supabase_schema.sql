-- =============================================================================
-- Medical360 — Supabase PostgreSQL Database Schema
-- Run this in your Supabase SQL Editor: (https://supabase.com/dashboard/project/vtcywighvyndtoxfvmny/sql)
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. HOSPITALS TABLE
create table if not exists public.hospitals (
  id text primary key,
  name text not null,
  name_fr text,
  name_kr text,
  city text not null,
  country text not null,
  description text not null,
  description_fr text,
  description_kr text,
  image_url text not null,
  gallery jsonb default '[]'::jsonb,
  accreditations jsonb default '[]'::jsonb,
  specialties jsonb default '[]'::jsonb,
  beds_count integer default 0,
  icu_beds integer default 0,
  founded_year integer default 2000,
  rating numeric(3,2) default 4.8,
  review_count integer default 0,
  international_patients_per_year integer default 0,
  languages jsonb default '["English", "French"]'::jsonb,
  website text,
  contact_email text,
  contact_phone text,
  featured boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. SPECIALTIES TABLE
create table if not exists public.specialties (
  id text primary key,
  name text not null,
  name_fr text,
  name_kr text,
  slug text not null unique,
  icon text not null,
  description text not null,
  description_fr text,
  description_kr text,
  short_description text not null,
  short_description_fr text,
  short_description_kr text,
  image_url text not null,
  procedures jsonb default '[]'::jsonb,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. DOCTORS TABLE
create table if not exists public.doctors (
  id text primary key,
  hospital_id text,
  name text not null,
  name_fr text,
  name_kr text,
  title text not null,
  specialties jsonb default '[]'::jsonb,
  specialty_id text,
  qualifications jsonb default '[]'::jsonb,
  experience integer default 10,
  years_experience integer default 10,
  surgeries integer default 0,
  languages jsonb default '["English", "French"]'::jsonb,
  image_url text not null,
  bio text,
  biography text,
  consultation_fee_usd numeric default 60,
  rating numeric(3,2) default 4.9,
  review_count integer default 0,
  procedures jsonb default '[]'::jsonb,
  featured boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. CASE STUDIES TABLE
create table if not exists public.case_studies (
  id text primary key,
  patient_first_name text,
  patient_name_anonymized text,
  patient_country text not null,
  patient_age integer default 45,
  condition text,
  condition_fr text,
  condition_kr text,
  specialty_id text,
  hospital_id text,
  doctor_id text,
  treatment text,
  treatment_fr text,
  treatment_kr text,
  title text,
  title_fr text,
  title_kr text,
  summary text,
  summary_fr text,
  summary_kr text,
  outcome text not null,
  outcome_fr text,
  outcome_kr text,
  testimonial text,
  testimonial_fr text,
  testimonial_kr text,
  cost_saved_percent integer default 50,
  duration_days integer default 7,
  year integer default 2025,
  image_url text not null,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. PATIENT INQUIRIES TABLE
create table if not exists public.inquiries (
  id text primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  country_of_residence text not null,
  specialty_id text,
  description text not null,
  urgency text default 'routine' check (urgency in ('routine', 'urgent', 'emergency')),
  preferred_country text,
  budget_min numeric,
  budget_max numeric,
  documents jsonb default '[]'::jsonb,
  status text default 'new' check (status in ('new', 'contacted', 'in_progress', 'awaiting_documents', 'quoted', 'confirmed', 'completed', 'cancelled')),
  assigned_case_manager_id text,
  notes jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. CAMPAIGNS TABLE (Nexus Email Marketing)
create table if not exists public.campaigns (
  id text primary key,
  title text not null,
  subject text not null,
  preheader text,
  status text default 'draft' check (status in ('draft', 'scheduled', 'sent', 'archived')),
  audience_id text,
  audience_name text,
  recipient_count integer default 0,
  sent_count integer default 0,
  opened_count integer default 0,
  clicked_count integer default 0,
  sent_at timestamptz,
  template jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. AUDIENCES TABLE
create table if not exists public.audiences (
  id text primary key,
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. CONTACTS / SENDERS TABLE
create table if not exists public.contacts (
  id text primary key,
  audience_id text references public.audiences(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  country text default 'Mauritius',
  added_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. ADMIN USERS TABLE
create table if not exists public.admin_users (
  id text primary key,
  email text not null unique,
  name text not null,
  role text default 'admin' check (role in ('admin', 'case_manager')),
  active boolean default true,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.hospitals enable row level security;
alter table public.specialties enable row level security;
alter table public.doctors enable row level security;
alter table public.case_studies enable row level security;
alter table public.inquiries enable row level security;
alter table public.campaigns enable row level security;
alter table public.audiences enable row level security;
alter table public.contacts enable row level security;
alter table public.admin_users enable row level security;

-- Public read policies for catalogs
create policy "Allow public read on hospitals" on public.hospitals for select using (true);
create policy "Allow public read on specialties" on public.specialties for select using (true);
create policy "Allow public read on doctors" on public.doctors for select using (true);
create policy "Allow public read on case_studies" on public.case_studies for select using (true);

-- Allow public insert on inquiries (for web contact / Describe Need forms)
create policy "Allow public insert on inquiries" on public.inquiries for insert with check (true);

-- Full access for platform management
create policy "Allow full access on inquiries" on public.inquiries for all using (true);
create policy "Allow full access on hospitals" on public.hospitals for all using (true);
create policy "Allow full access on specialties" on public.specialties for all using (true);
create policy "Allow full access on doctors" on public.doctors for all using (true);
create policy "Allow full access on case_studies" on public.case_studies for all using (true);
create policy "Allow full access on campaigns" on public.campaigns for all using (true);
create policy "Allow full access on audiences" on public.audiences for all using (true);
create policy "Allow full access on contacts" on public.contacts for all using (true);
create policy "Allow full access on admin_users" on public.admin_users for all using (true);
