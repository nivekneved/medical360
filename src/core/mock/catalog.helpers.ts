import type { Hospital, Specialty, Doctor, CaseStudy } from '../types';
import { supabase } from '../supabase/client';
import {
  mapHospitalRow,
  mapSpecialtyRow,
  mapDoctorRow,
  mapCaseStudyRow,
} from '../supabase/repositories';
import type { MockStore } from './store';

// ── Hospital CRUD Helpers ───────────────────────────────────────────────────
export async function dbCreateHospital(hospital: Omit<Hospital, 'id'>, id: string): Promise<Hospital | null> {
  try {
    const row = {
      id,
      name: hospital.name,
      name_fr: hospital.name_fr || null,
      name_kr: hospital.name_kr || null,
      city: hospital.city,
      country: hospital.country,
      description: hospital.description,
      image_url: hospital.imageUrl,
      gallery: hospital.gallery || [],
      accreditations: hospital.accreditations || [],
      specialties: hospital.specialties || [],
      beds_count: hospital.bedsCount || 0,
      icu_beds: hospital.icuBeds || 0,
      founded_year: hospital.foundedYear || 2000,
      rating: hospital.rating || 4.8,
      review_count: hospital.reviewCount || 0,
      international_patients_per_year: hospital.internationalPatientsPerYear || 0,
      languages: hospital.languages || ['English', 'French'],
      website: hospital.website || null,
      contact_email: hospital.contactEmail || null,
      contact_phone: hospital.contactPhone || null,
      featured: !!hospital.featured,
      active: hospital.active !== false,
    };
    const { data, error } = await supabase.from('hospitals').insert([row]).select().single();
    if (!error && data) return mapHospitalRow(data);
  } catch (e) {
    console.warn('Supabase createHospital failed:', e);
  }
  return null;
}

export async function dbUpdateHospital(id: string, updates: Partial<Hospital>): Promise<Hospital | null> {
  try {
    const rowUpdates: any = { ...updates, updated_at: new Date().toISOString() };
    if (updates.imageUrl) rowUpdates.image_url = updates.imageUrl;
    if (updates.bedsCount) rowUpdates.beds_count = updates.bedsCount;
    if (updates.icuBeds) rowUpdates.icu_beds = updates.icuBeds;
    if (updates.foundedYear) rowUpdates.founded_year = updates.foundedYear;
    if (updates.reviewCount) rowUpdates.review_count = updates.reviewCount;
    if (updates.internationalPatientsPerYear) rowUpdates.international_patients_per_year = updates.internationalPatientsPerYear;
    if (updates.contactEmail) rowUpdates.contact_email = updates.contactEmail;
    if (updates.contactPhone) rowUpdates.contact_phone = updates.contactPhone;

    const { data, error } = await supabase.from('hospitals').update(rowUpdates).eq('id', id).select().single();
    if (!error && data) return mapHospitalRow(data);
  } catch (e) {
    console.warn('Supabase updateHospital failed:', e);
  }
  return null;
}

// ── Specialty CRUD Helpers ──────────────────────────────────────────────────
export async function dbCreateSpecialty(specialty: Specialty): Promise<Specialty | null> {
  try {
    const { data, error } = await supabase.from('specialties').insert([specialty]).select().single();
    if (!error && data) return mapSpecialtyRow(data);
  } catch (e) {
    console.warn('Supabase createSpecialty failed:', e);
  }
  return null;
}

export async function dbUpdateSpecialty(id: string, updates: Partial<Specialty>): Promise<Specialty | null> {
  try {
    const rowUpdates: any = { ...updates, updated_at: new Date().toISOString() };
    if (updates.imageUrl) rowUpdates.image_url = updates.imageUrl;
    if (updates.shortDescription) rowUpdates.short_description = updates.shortDescription;
    const { data, error } = await supabase.from('specialties').update(rowUpdates).eq('id', id).select().single();
    if (!error && data) return mapSpecialtyRow(data);
  } catch (e) {
    console.warn('Supabase updateSpecialty failed:', e);
  }
  return null;
}

// ── Doctor CRUD Helpers ─────────────────────────────────────────────────────
export async function dbCreateDoctor(doctor: Doctor): Promise<Doctor | null> {
  try {
    const { data, error } = await supabase.from('doctors').insert([doctor]).select().single();
    if (!error && data) return mapDoctorRow(data);
  } catch (e) {
    console.warn('Supabase createDoctor failed:', e);
  }
  return null;
}

export async function dbUpdateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor | null> {
  try {
    const rowUpdates: any = { ...updates, updated_at: new Date().toISOString() };
    if (updates.imageUrl) rowUpdates.image_url = updates.imageUrl;
    if (updates.bio) { rowUpdates.bio = updates.bio; rowUpdates.biography = updates.bio; }
    if (updates.hospitalId) rowUpdates.hospital_id = updates.hospitalId;
    if (updates.experience) { rowUpdates.experience = updates.experience; rowUpdates.years_experience = updates.experience; }
    const { data, error } = await supabase.from('doctors').update(rowUpdates).eq('id', id).select().single();
    if (!error && data) return mapDoctorRow(data);
  } catch (e) {
    console.warn('Supabase updateDoctor failed:', e);
  }
  return null;
}

// ── Case Study CRUD Helpers ─────────────────────────────────────────────────
export async function dbCreateCaseStudy(caseStudy: CaseStudy): Promise<CaseStudy | null> {
  try {
    const { data, error } = await supabase.from('case_studies').insert([caseStudy]).select().single();
    if (!error && data) return mapCaseStudyRow(data);
  } catch (e) {
    console.warn('Supabase createCaseStudy failed:', e);
  }
  return null;
}

export async function dbUpdateCaseStudy(id: string, updates: Partial<CaseStudy>): Promise<CaseStudy | null> {
  try {
    const rowUpdates: any = { ...updates, updated_at: new Date().toISOString() };
    if (updates.imageUrl) rowUpdates.image_url = updates.imageUrl;
    if (updates.patientFirstName) { rowUpdates.patient_first_name = updates.patientFirstName; rowUpdates.patient_name_anonymized = updates.patientFirstName; }
    if (updates.condition) { rowUpdates.condition = updates.condition; rowUpdates.title = updates.condition; }
    if (updates.treatment) { rowUpdates.treatment = updates.treatment; rowUpdates.summary = updates.treatment; }
    const { data, error } = await supabase.from('case_studies').update(rowUpdates).eq('id', id).select().single();
    if (!error && data) return mapCaseStudyRow(data);
  } catch (e) {
    console.warn('Supabase updateCaseStudy failed:', e);
  }
  return null;
}
