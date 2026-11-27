import pg from 'pg';
import { hospitalsSeed } from '../src/core/mock/seeds/hospitals.seed.ts';
import { specialtiesSeed } from '../src/core/mock/seeds/specialties.seed.ts';
import { caseStudiesSeed } from '../src/core/mock/seeds/case-studies.seed.ts';

const connStr = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connStr) {
  console.error('Missing DATABASE_URL');
  process.exit(1);
}

const client = new pg.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  await client.query('BEGIN');

  for (const h of hospitalsSeed) {
    await client.query(
      `INSERT INTO public.hospitals (
        id, slug, name, name_fr, name_kr, city, country,
        description, description_fr, description_kr,
        image_url, gallery, accreditations, specialties,
        beds_count, icu_beds, founded_year, rating, review_count,
        international_patients_per_year, languages, website,
        contact_email, contact_phone, featured, active
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb,$14::jsonb,
        $15,$16,$17,$18,$19,$20,$21::jsonb,$22,$23,$24,$25,$26
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        name = EXCLUDED.name,
        name_fr = EXCLUDED.name_fr,
        name_kr = EXCLUDED.name_kr,
        city = EXCLUDED.city,
        country = EXCLUDED.country,
        description = EXCLUDED.description,
        description_fr = EXCLUDED.description_fr,
        description_kr = EXCLUDED.description_kr,
        image_url = EXCLUDED.image_url,
        gallery = EXCLUDED.gallery,
        accreditations = EXCLUDED.accreditations,
        specialties = EXCLUDED.specialties,
        beds_count = EXCLUDED.beds_count,
        icu_beds = EXCLUDED.icu_beds,
        founded_year = EXCLUDED.founded_year,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count,
        international_patients_per_year = EXCLUDED.international_patients_per_year,
        languages = EXCLUDED.languages,
        website = EXCLUDED.website,
        featured = EXCLUDED.featured,
        active = EXCLUDED.active,
        updated_at = now()`,
      [
        h.id, h.slug || h.id, h.name, h.name_fr || null, h.name_kr || null,
        h.city, h.country, h.description, h.description_fr || null, h.description_kr || null,
        h.imageUrl, JSON.stringify(h.gallery || []), JSON.stringify(h.accreditations || []),
        JSON.stringify(h.specialties || []), h.bedsCount || 0, h.icuBeds || 0,
        h.foundedYear || 2000, h.rating || 4.8, h.reviewCount || 0,
        h.internationalPatientsPerYear || 0, JSON.stringify(h.languages || ['English']),
        h.website || null, h.contactEmail || null, h.contactPhone || null,
        Boolean(h.featured), h.active !== false,
      ]
    );
  }

  for (const s of specialtiesSeed) {
    await client.query(
      `INSERT INTO public.specialties (
        id, name, name_fr, name_kr, slug, icon,
        description, description_fr, description_kr,
        short_description, short_description_fr, short_description_kr,
        image_url, procedures, featured
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        name_fr = EXCLUDED.name_fr,
        name_kr = EXCLUDED.name_kr,
        slug = EXCLUDED.slug,
        icon = EXCLUDED.icon,
        description = EXCLUDED.description,
        description_fr = EXCLUDED.description_fr,
        description_kr = EXCLUDED.description_kr,
        short_description = EXCLUDED.short_description,
        short_description_fr = EXCLUDED.short_description_fr,
        short_description_kr = EXCLUDED.short_description_kr,
        image_url = EXCLUDED.image_url,
        procedures = EXCLUDED.procedures,
        featured = EXCLUDED.featured,
        updated_at = now()`,
      [
        s.id, s.name, s.name_fr || null, s.name_kr || null, s.slug, s.icon,
        s.description, s.description_fr || null, s.description_kr || null,
        s.shortDescription, s.shortDescription_fr || null, s.shortDescription_kr || null,
        s.imageUrl, JSON.stringify(s.procedures || []), Boolean(s.featured),
      ]
    );
  }

  for (const c of caseStudiesSeed) {
    await client.query(
      `INSERT INTO public.case_studies (
        id, patient_first_name, patient_country, patient_age,
        condition, condition_fr, condition_kr, specialty_id, hospital_id, doctor_id,
        treatment, treatment_fr, treatment_kr, outcome, outcome_fr, outcome_kr,
        testimonial, testimonial_fr, testimonial_kr,
        cost_saved_percent, duration_days, year, image_url, featured
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
      )
      ON CONFLICT (id) DO UPDATE SET
        image_url = EXCLUDED.image_url,
        outcome = EXCLUDED.outcome,
        testimonial = EXCLUDED.testimonial,
        featured = EXCLUDED.featured,
        updated_at = now()`,
      [
        c.id, c.patientFirstName || null, c.patientCountry, c.patientAge || 45,
        c.condition || null, c.condition_fr || null, c.condition_kr || null,
        c.specialtyId || null, c.hospitalId || null, c.doctorId || null,
        c.treatment || null, c.treatment_fr || null, c.treatment_kr || null,
        c.outcome, c.outcome_fr || null, c.outcome_kr || null,
        c.testimonial || null, c.testimonial_fr || null, c.testimonial_kr || null,
        c.costSavedPercent || 50, c.durationDays || 7, c.year || 2025,
        c.imageUrl, Boolean(c.featured),
      ]
    );
  }

  await client.query('COMMIT');
  console.log(`SEEDED NEON OK: ${hospitalsSeed.length} hospitals, ${specialtiesSeed.length} specialties, ${caseStudiesSeed.length} case studies`);
} catch (err) {
  await client.query('ROLLBACK');
  console.error('SEED ERROR:', err);
  process.exit(1);
} finally {
  await client.end();
}
