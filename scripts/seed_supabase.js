import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env
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

function loadSeedTs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let clean = content
    .replace(/import\s+type\s+[^;]+;/g, '')
    .replace(/import\s+[^;]+;/g, '')
    .replace(/:\s*Specialty\[\]/g, '')
    .replace(/:\s*Hospital\[\]/g, '')
    .replace(/:\s*Doctor\[\]/g, '')
    .replace(/:\s*CaseStudy\[\]/g, '')
    .replace(/:\s*Inquiry\[\]/g, '')
    .replace(/:\s*Record<[^>]+>/g, '')
    .replace(/export\s+const\s+(\w+)\s*=\s*/g, 'exports.$1 = ')
    .replace(/export\s+interface\s+[\s\S]*?}/g, '');

  const sandbox = { exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(clean, sandbox);
  return sandbox.exports;
}

async function seed() {
  console.log('🌱 Starting Supabase Seeding for Medical360...\n');
  const seedsDir = path.join(__dirname, '..', 'src', 'core', 'mock', 'seeds');

  // 1. HOSPITALS
  const hospitalsFile = path.join(seedsDir, 'hospitals.seed.ts');
  if (fs.existsSync(hospitalsFile)) {
    const { hospitalsSeed } = loadSeedTs(hospitalsFile);
    if (hospitalsSeed) {
      console.log(`🏥 Seeding ${hospitalsSeed.length} Hospitals...`);
      const rows = hospitalsSeed.map(h => ({
        id: h.id,
        name: h.name,
        name_fr: h.name_fr || null,
        name_kr: h.name_kr || null,
        city: h.city,
        country: h.country,
        description: h.description,
        description_fr: h.description_fr || null,
        description_kr: h.description_kr || null,
        image_url: h.imageUrl,
        gallery: h.gallery || [],
        accreditations: h.accreditations || [],
        specialties: h.specialties || [],
        beds_count: h.bedsCount || 0,
        icu_beds: h.icuBeds || 0,
        founded_year: h.foundedYear || 2000,
        rating: h.rating || 4.8,
        review_count: h.reviewCount || 0,
        international_patients_per_year: h.internationalPatientsPerYear || 0,
        languages: h.languages || ['English', 'French'],
        website: h.website || null,
        contact_email: h.contactEmail || null,
        contact_phone: h.contactPhone || null,
        featured: !!h.featured,
        active: h.active !== false,
      }));

      const { error } = await supabase.from('hospitals').upsert(rows);
      if (error) console.error('  ❌ Hospitals Error:', error.message);
      else console.log('  ✅ Hospitals seeded successfully.');
    }
  }

  // 2. SPECIALTIES
  const specialtiesFile = path.join(seedsDir, 'specialties.seed.ts');
  if (fs.existsSync(specialtiesFile)) {
    const { specialtiesSeed } = loadSeedTs(specialtiesFile);
    if (specialtiesSeed) {
      console.log(`\n🩺 Seeding ${specialtiesSeed.length} Specialties...`);
      const rows = specialtiesSeed.map(s => ({
        id: s.id,
        name: s.name,
        name_fr: s.name_fr || null,
        name_kr: s.name_kr || null,
        slug: s.slug,
        icon: s.icon,
        description: s.description,
        description_fr: s.description_fr || null,
        description_kr: s.description_kr || null,
        short_description: s.shortDescription,
        short_description_fr: s.shortDescription_fr || null,
        short_description_kr: s.shortDescription_kr || null,
        image_url: s.imageUrl,
        procedures: s.procedures || [],
        featured: !!s.featured,
      }));

      const { error } = await supabase.from('specialties').upsert(rows);
      if (error) console.error('  ❌ Specialties Error:', error.message);
      else console.log('  ✅ Specialties seeded successfully.');
    }
  }

  // 3. DOCTORS
  const doctorsFile = path.join(seedsDir, 'doctors.seed.ts');
  if (fs.existsSync(doctorsFile)) {
    const { doctorsSeed } = loadSeedTs(doctorsFile);
    if (doctorsSeed) {
      console.log(`\n👨‍⚕️ Seeding ${doctorsSeed.length} Doctors...`);
      const rows = doctorsSeed.map(d => ({
        id: d.id,
        name: d.name,
        name_fr: null,
        name_kr: null,
        title: d.title,
        title_fr: null,
        title_kr: null,
        specialty_id: d.specialties?.[0] || 'sp-cardiology',
        hospital_id: d.hospitalId || null,
        biography: d.bio || 'Accredited specialist and surgeon.',
        biography_fr: null,
        biography_kr: null,
        qualifications: d.qualifications || [],
        years_experience: d.experience || 10,
        languages: d.languages || ['English', 'French'],
        image_url: d.imageUrl,
        rating: 4.9,
        review_count: d.surgeries || 100,
        procedures: [],
        featured: !!d.featured,
        active: true,
      }));

      const { error } = await supabase.from('doctors').upsert(rows);
      if (error) console.error('  ❌ Doctors Error:', error.message);
      else console.log('  ✅ Doctors seeded successfully.');
    }
  }

  // 4. CASE STUDIES
  const caseStudiesFile = path.join(seedsDir, 'case-studies.seed.ts');
  if (fs.existsSync(caseStudiesFile)) {
    const { caseStudiesSeed } = loadSeedTs(caseStudiesFile);
    if (caseStudiesSeed) {
      console.log(`\n📋 Seeding ${caseStudiesSeed.length} Case Studies...`);
      const rows = caseStudiesSeed.map(c => ({
        id: c.id,
        patient_name_anonymized: c.patientFirstName || 'Anonymous Patient',
        patient_country: c.patientCountry || 'Mauritius',
        specialty_id: c.specialtyId || null,
        hospital_id: c.hospitalId || null,
        doctor_id: c.doctorId || null,
        title: c.condition || 'Medical Recovery Case',
        title_fr: c.condition_fr || null,
        title_kr: c.condition_kr || null,
        summary: c.treatment || 'Specialized surgical treatment abroad.',
        summary_fr: c.treatment_fr || null,
        summary_kr: c.treatment_kr || null,
        outcome: c.outcome || 'Full patient recovery.',
        outcome_fr: c.outcome_fr || null,
        outcome_kr: c.outcome_kr || null,
        testimonial: c.testimonial || null,
        testimonial_fr: c.testimonial_fr || null,
        testimonial_kr: c.testimonial_kr || null,
        cost_saved_percent: c.costSavedPercent || 50,
        duration_days: c.durationDays || 7,
        year: c.year || 2024,
        image_url: c.imageUrl,
        featured: !!c.featured,
      }));

      const { error } = await supabase.from('case_studies').upsert(rows);
      if (error) console.error('  ❌ Case Studies Error:', error.message);
      else console.log('  ✅ Case Studies seeded successfully.');
    }
  }

  // 5. INQUIRIES
  const inquiriesFile = path.join(seedsDir, 'inquiries.seed.ts');
  if (fs.existsSync(inquiriesFile)) {
    const { inquiriesSeed } = loadSeedTs(inquiriesFile);
    if (inquiriesSeed) {
      console.log(`\n📩 Seeding ${inquiriesSeed.length} Inquiries...`);
      const rows = inquiriesSeed.map(i => ({
        id: i.id,
        first_name: i.firstName,
        last_name: i.lastName,
        email: i.email,
        phone: i.phone,
        country_of_residence: i.countryOfResidence,
        specialty_id: i.specialtyId,
        description: i.description,
        urgency: i.urgency || 'routine',
        preferred_country: i.preferredCountry || null,
        budget_min: i.budgetRangeUSD?.min || null,
        budget_max: i.budgetRangeUSD?.max || null,
        documents: i.documents || [],
        status: i.status || 'new',
        assigned_case_manager_id: i.assignedCaseManagerId || null,
        notes: i.notes || [],
        created_at: i.createdAt,
        updated_at: i.updatedAt,
      }));

      const { error } = await supabase.from('inquiries').upsert(rows);
      if (error) console.error('  ❌ Inquiries Error:', error.message);
      else console.log('  ✅ Inquiries seeded successfully.');
    }
  }

  // 6. AUDIENCE LISTS & CONTACTS
  console.log('\n👥 Seeding Audience Lists & Senders...');
  const defaultAudience = {
    id: 'aud-all-inquiries',
    name: 'All Patient Inquiries (Mauritius & Regional)',
    description: 'Live patient leads and inquiry submissions for medical tourism.',
  };
  const { error: audErr } = await supabase.from('audiences').upsert([defaultAudience]);
  if (audErr) console.error('  ❌ Audiences Error:', audErr.message);
  else console.log('  ✅ Default Audience list seeded.');

  const sampleContacts = [
    { id: 'cnt-1', audience_id: 'aud-all-inquiries', name: 'Sanjiv Ramkhelawon', email: 'sanjiv.r@gmail.com', phone: '+23057123456', country: 'Mauritius' },
    { id: 'cnt-2', audience_id: 'aud-all-inquiries', name: 'Laetitia Bonnenfant', email: 'laetitia.b@hotmail.com', phone: '+23058234567', country: 'Mauritius' },
    { id: 'cnt-3', audience_id: 'aud-all-inquiries', name: 'Omar Abdallah', email: 'omar.a@yahoo.com', phone: '+26961345678', country: 'Comoros' },
    { id: 'cnt-4', audience_id: 'aud-all-inquiries', name: 'Kevin', email: 'kevinadlib@gmail.com', phone: '+23059188275', country: 'Mauritius' },
  ];
  const { error: cntErr } = await supabase.from('contacts').upsert(sampleContacts);
  if (cntErr) console.error('  ❌ Contacts Error:', cntErr.message);
  else console.log('  ✅ Sample Senders / Contacts seeded.');

  console.log('\n✨ Supabase Seeding Complete! All records live in your PostgreSQL database.\n');
}

seed().catch(err => {
  console.error('Fatal seed error:', err);
});
