import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

/**
 * One-off migration: aligns the live Supabase catalog with the 15-hospital
 * / 15-specialty PPTX catalog and repairs all cross-references.
 *
 *  1. Upserts the 15 PPTX specialties + 15 PPTX hospitals (from seed files).
 *  2. Remaps legacy `hosp-1..hosp-10` references on doctors & case studies
 *     to the closest in-catalog hospital (context-aware per row).
 *  3. Remaps legacy `sp-ivf` specialty references to `sp-fertility`.
 *  4. Patches testimonial/bio text that still names removed hospitals.
 *  5. Deletes legacy catalog rows that are not part of the PPTX catalog.
 *  6. Verifies referential integrity and prints a report.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
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
  const clean = content
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

const seedsDir = path.join(__dirname, '..', 'src', 'core', 'mock', 'seeds');
const { hospitalsSeed } = loadSeedTs(path.join(seedsDir, 'hospitals.seed.ts'));
const { specialtiesSeed } = loadSeedTs(path.join(seedsDir, 'specialties.seed.ts'));

// Legacy hospital id -> closest PPTX-catalog hospital
const HOSPITAL_MAP = {
  'hosp-1': 'hosp-apollo',
  'hosp-2': 'hosp-fortis-escorts',
  'hosp-3': 'hosp-kims',
  'hosp-4': 'hosp-kokilaben',
  'hosp-5': 'hosp-aster-prime',
  'hosp-6': 'hosp-medanta',
  'hosp-7': 'hosp-max-saket',
  'hosp-8': 'hosp-kokilaben',
  'hosp-9': 'hosp-manipal',
  'hosp-10': 'hosp-paras',
};

// Context-aware targets for doctors (DB doc-7 is the orthopaedic profile)
const DOCTOR_HOSPITAL = {
  'doc-1': 'hosp-apollo',
  'doc-2': 'hosp-medanta',
  'doc-3': 'hosp-max-saket',
  'doc-4': 'hosp-kokilaben',
  'doc-5': 'hosp-apollo',
  'doc-6': 'hosp-manipal',
  'doc-7': 'hosp-miot',
};
const DOCTOR_SPECIALTY = { 'doc-6': 'sp-fertility' };

// Context-aware targets for case studies
const CASE_HOSPITAL = {
  'cs-1': 'hosp-apollo',
  'cs-2': 'hosp-medanta',
  'cs-3': 'hosp-manipal',
  'cs-4': 'hosp-kokilaben',
  'cs-5': 'hosp-miot',
  'cs-6': 'hosp-paras',
  'cs-7': 'hosp-sankara',
  'cs-8': 'hosp-medanta',
};
const CASE_SPECIALTY = { 'cs-3': 'sp-fertility' };

// Text patches — applied only when the legacy phrase is still present,
// so any admin-customised copy is preserved.
const TEXT_PATCHES = [
  { field: 'testimonial', old: 'Mount Elizabeth in Singapore gave us hope', nw: 'Kokilaben Hospital in Mumbai gave us hope' },
  { field: 'testimonial_fr', old: 'Mount Elizabeth à Singapour nous a redonné espoir', nw: 'Kokilaben Hospital à Mumbai nous a redonné espoir' },
  { field: 'testimonial_kr', old: 'Mount Elizabeth Singapour ti donn nou lespwar', nw: 'Kokilaben Mumbai ti donn nou lespwar' },
  { field: 'testimonial', old: 'Bumrungrad is world-class.', nw: 'MIOT International is world-class.' },
  { field: 'testimonial_fr', old: 'Bumrungrad est de classe mondiale.', nw: 'MIOT International est de classe mondiale.' },
  { field: 'testimonial_kr', old: 'Bumrungrad klas mondial.', nw: 'MIOT International klas mondial.' },
  { field: 'testimonial', old: 'Artemis treated me like family.', nw: 'Paras Health treated me like family.' },
  { field: 'testimonial_fr', old: 'Artemis m\'a traité', nw: 'Paras Health m\'a traité' },
  { field: 'testimonial_kr', old: 'Artemis ti tret mwa', nw: 'Paras Health ti tret mwa' },
  { field: 'testimonial', old: 'surgery in Kuala Lumpur', nw: 'surgery in Chennai' },
  { field: 'testimonial_fr', old: 'la chirurgie à Kuala Lumpur', nw: 'la chirurgie à Chennai' },
  { field: 'testimonial_kr', old: 'ek organiz tou Kuala Lumpur', nw: 'ek organiz tou Chennai' },
];
const BIO_PATCHES = [
  { field: 'biography', old: 'at Gleneagles Singapore', nw: 'across international multidisciplinary tumour boards' },
];

function applyPatches(row, patches) {
  let changed = false;
  for (const p of patches) {
    if (typeof row[p.field] === 'string' && row[p.field].includes(p.old)) {
      row[p.field] = row[p.field].split(p.old).join(p.nw);
      changed = true;
    }
  }
  return changed;
}

async function main() {
  console.log('🚚 Migrating live Supabase catalog to the PPTX 15/15 catalog...\n');

  // ── 1. Specialties upsert ────────────────────────────────────────────
  const specialtyRows = specialtiesSeed.map(s => ({
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
  {
    const { error } = await supabase.from('specialties').upsert(specialtyRows);
    if (error) { console.error('❌ Specialties upsert failed:', error.message); process.exit(1); }
    console.log(`✅ Specialties upserted: ${specialtyRows.length}`);
  }

  // ── 2. Hospitals upsert ──────────────────────────────────────────────
  const hospitalRows = hospitalsSeed.map(h => ({
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
  {
    const { error } = await supabase.from('hospitals').upsert(hospitalRows);
    if (error) { console.error('❌ Hospitals upsert failed:', error.message); process.exit(1); }
    console.log(`✅ Hospitals upserted: ${hospitalRows.length}`);
  }

  // ── 3. Doctors reference remap ───────────────────────────────────────
  {
    const { data: doctors, error } = await supabase.from('doctors').select('*');
    if (error) { console.error('❌ Doctors fetch failed:', error.message); process.exit(1); }
    let patched = 0;
    for (const doc of doctors || []) {
      const updates = {};
      const targetHosp = DOCTOR_HOSPITAL[doc.id] || HOSPITAL_MAP[doc.hospital_id];
      if (targetHosp && doc.hospital_id !== targetHosp) updates.hospital_id = targetHosp;
      const targetSpec = DOCTOR_SPECIALTY[doc.id];
      if (targetSpec && doc.specialty_id !== targetSpec) updates.specialty_id = targetSpec;
      const bioRow = { biography: doc.biography };
      if (applyPatches(bioRow, BIO_PATCHES)) updates.biography = bioRow.biography;
      if (Object.keys(updates).length === 0) continue;
      const { error: updErr } = await supabase.from('doctors').update(updates).eq('id', doc.id);
      if (updErr) { console.error(`❌ Doctor ${doc.id} update failed:`, updErr.message); process.exit(1); }
      patched++;
      console.log(`   🔗 doctor ${doc.id} (${doc.name}): ${JSON.stringify(updates)}`);
    }
    console.log(`✅ Doctors remapped: ${patched}/${(doctors || []).length}`);
  }

  // ── 4. Case studies reference remap + testimonial patches ────────────
  {
    const { data: cases, error } = await supabase.from('case_studies').select('*');
    if (error) { console.error('❌ Case studies fetch failed:', error.message); process.exit(1); }
    let patched = 0;
    for (const cs of cases || []) {
      const updates = {};
      const targetHosp = CASE_HOSPITAL[cs.id] || HOSPITAL_MAP[cs.hospital_id];
      if (targetHosp && cs.hospital_id !== targetHosp) updates.hospital_id = targetHosp;
      const targetSpec = CASE_SPECIALTY[cs.id];
      if (targetSpec && cs.specialty_id !== targetSpec) updates.specialty_id = targetSpec;
      const textRow = {
        testimonial: cs.testimonial,
        testimonial_fr: cs.testimonial_fr,
        testimonial_kr: cs.testimonial_kr,
      };
      if (applyPatches(textRow, TEXT_PATCHES)) {
        updates.testimonial = textRow.testimonial;
        updates.testimonial_fr = textRow.testimonial_fr;
        updates.testimonial_kr = textRow.testimonial_kr;
      }
      if (Object.keys(updates).length === 0) continue;
      const { error: updErr } = await supabase.from('case_studies').update(updates).eq('id', cs.id);
      if (updErr) { console.error(`❌ Case study ${cs.id} update failed:`, updErr.message); process.exit(1); }
      patched++;
      console.log(`   🔗 case study ${cs.id}: ${Object.keys(updates).join(', ')} updated`);
    }
    console.log(`✅ Case studies remapped: ${patched}/${(cases || []).length}`);
  }

  // ── 5. Delete legacy rows not in the PPTX catalog ────────────────────
  {
    const seedHospitalIds = new Set(hospitalsSeed.map(h => h.id));
    const { data: allHospitals, error } = await supabase.from('hospitals').select('id');
    if (error) { console.error('❌ Hospitals fetch failed:', error.message); process.exit(1); }
    const legacyHospitals = (allHospitals || []).map(h => h.id).filter(id => !seedHospitalIds.has(id));
    if (legacyHospitals.length) {
      const { error: delErr } = await supabase.from('hospitals').delete().in('id', legacyHospitals);
      if (delErr) { console.error('❌ Legacy hospital delete failed:', delErr.message); process.exit(1); }
      console.log(`🗑️  Deleted legacy hospitals: ${legacyHospitals.join(', ')}`);
    } else {
      console.log('✅ No legacy hospital rows to delete.');
    }

    const seedSpecialtyIds = new Set(specialtiesSeed.map(s => s.id));
    const { data: allSpecialties, error: specErr } = await supabase.from('specialties').select('id');
    if (specErr) { console.error('❌ Specialties fetch failed:', specErr.message); process.exit(1); }
    const legacySpecialties = (allSpecialties || []).map(s => s.id).filter(id => !seedSpecialtyIds.has(id));
    if (legacySpecialties.length) {
      const { error: delErr } = await supabase.from('specialties').delete().in('id', legacySpecialties);
      if (delErr) { console.error('❌ Legacy specialty delete failed:', delErr.message); process.exit(1); }
      console.log(`🗑️  Deleted legacy specialties: ${legacySpecialties.join(', ')}`);
    } else {
      console.log('✅ No legacy specialty rows to delete.');
    }
  }

  // ── 6. Verification ──────────────────────────────────────────────────
  console.log('\n🔍 Verification...');
  let failures = 0;

  const { data: finalHospitals, error: vhErr } = await supabase.from('hospitals').select('id, name, name_fr, name_kr');
  if (vhErr) { console.error('❌ Verification fetch failed:', vhErr.message); process.exit(1); }
  console.log(`   hospitals: ${finalHospitals.length} rows (expected ${hospitalsSeed.length})`);
  if (finalHospitals.length !== hospitalsSeed.length) failures++;
  for (const h of finalHospitals) {
    if (h.name_fr !== h.name || h.name_kr !== h.name) {
      failures++;
      console.log(`   ❌ ${h.id}: brand name mismatch (fr="${h.name_fr}", kr="${h.name_kr})`);
    }
  }

  const { data: finalDoctors, error: vdErr } = await supabase.from('doctors').select('id, hospital_id, specialty_id');
  if (vdErr) { console.error('❌ Doctors verification failed:', vdErr.message); process.exit(1); }
  for (const d of finalDoctors || []) {
    if (/^hosp-\d+$/.test(d.hospital_id || '') || d.specialty_id === 'sp-ivf') {
      failures++;
      console.log(`   ❌ doctor ${d.id}: stale reference (hospital_id=${d.hospital_id}, specialty_id=${d.specialty_id})`);
    }
  }
  console.log(`   doctors: ${(finalDoctors || []).length} rows checked for stale references`);

  const { data: finalCases, error: vcErr } = await supabase.from('case_studies').select('id, hospital_id, specialty_id, testimonial, testimonial_fr, testimonial_kr');
  if (vcErr) { console.error('❌ Case studies verification failed:', vcErr.message); process.exit(1); }
  const staleTextSnippets = ['Mount Elizabeth', 'Bumrungrad', 'Artemis', 'Kuala Lumpur', 'Gleneagles'];
  for (const c of finalCases || []) {
    if (/^hosp-\d+$/.test(c.hospital_id || '') || c.specialty_id === 'sp-ivf') {
      failures++;
      console.log(`   ❌ case study ${c.id}: stale reference (hospital_id=${c.hospital_id}, specialty_id=${c.specialty_id})`);
    }
    for (const f of ['testimonial', 'testimonial_fr', 'testimonial_kr']) {
      if (staleTextSnippets.some(s => (c[f] || '').includes(s))) {
        failures++;
        console.log(`   ❌ case study ${c.id}: "${f}" still names a removed hospital`);
      }
    }
  }
  console.log(`   case studies: ${(finalCases || []).length} rows checked for stale references`);

  if (failures > 0) {
    console.log(`\n💥 Migration completed with ${failures} verification failure(s).`);
    process.exit(1);
  }
  console.log('\n🏆 Migration complete — catalog, references and brand names all consistent.');




}
main();
