import { supabase, isSupabaseConfigured } from './client';
import type { Hospital, Specialty, Doctor, CaseStudy, Inquiry } from '../types';

export function mapHospitalRow(row: any): Hospital {
  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name,
    name_fr: row.name_fr || undefined,
    name_kr: row.name_kr || undefined,
    city: row.city,
    country: row.country,
    description: row.description,
    description_fr: row.description_fr || undefined,
    description_kr: row.description_kr || undefined,
    imageUrl: row.image_url || '/assets/hero-banner.jpg',
    gallery: row.gallery || [],
    accreditations: row.accreditations || [],
    specialties: row.specialties || [],
    bedsCount: row.beds_count || 500,
    icuBeds: row.icu_beds || 50,
    foundedYear: row.founded_year || 1990,
    rating: row.rating || 4.8,
    reviewCount: row.review_count || 100,
    internationalPatientsPerYear: row.international_patients_per_year || 5000,
    languages: row.languages || ['English'],
    website: row.website,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    featured: row.featured ?? false,
    active: row.active ?? true,
  };
}

export function mapSpecialtyRow(row: any): Specialty {
  return {
    id: row.id,
    name: row.name,
    name_fr: row.name_fr || undefined,
    name_kr: row.name_kr || undefined,
    slug: row.slug || row.id,
    icon: row.icon || 'Stethoscope',
    description: row.description,
    description_fr: row.description_fr || undefined,
    description_kr: row.description_kr || undefined,
    shortDescription: row.short_description || row.description,
    shortDescription_fr: row.short_description_fr || undefined,
    shortDescription_kr: row.short_description_kr || undefined,
    imageUrl: row.image_url || '/assets/hero-banner.jpg',
    procedures: row.procedures || [],
    featured: row.featured ?? false,
  };
}

export function mapDoctorRow(row: any): Doctor {
  const hIds = row.hospital_ids || (row.hospital_id ? [row.hospital_id] : []);
  const specs = Array.isArray(row.specialties) && row.specialties.length > 0
    ? row.specialties
    : (row.specialty_id ? [row.specialty_id] : []);

  return {
    id: row.id,
    hospitalId: hIds[0],
    hospitalIds: hIds,
    name: row.name,
    title: row.title,
    specialties: specs,
    qualifications: row.qualifications || [],
    experience: row.years_experience || row.experience || 10,
    surgeries: row.surgeries || 1000,
    languages: row.languages || ['English'],
    imageUrl: row.image_url || '/assets/consultation-support.jpg',
    bio: row.biography || row.bio || '',
    consultationFeeUSD: row.consultation_fee_usd || 60,
    featured: row.featured ?? false,
  };
}

export function mapCaseStudyRow(row: any): CaseStudy {
  return {
    id: row.id,
    patientFirstName: row.patient_first_name,
    patientCountry: row.patient_country,
    patientAge: row.patient_age || 45,
    condition: row.condition,
    condition_fr: row.condition_fr,
    condition_kr: row.condition_kr,
    specialtyId: row.specialty_id,
    hospitalId: row.hospital_id,
    doctorId: row.doctor_id,
    treatment: row.treatment,
    treatment_fr: row.treatment_fr,
    treatment_kr: row.treatment_kr,
    outcome: row.outcome,
    outcome_fr: row.outcome_fr,
    outcome_kr: row.outcome_kr,
    testimonial: row.testimonial,
    testimonial_fr: row.testimonial_fr,
    testimonial_kr: row.testimonial_kr,
    costSavedPercent: row.cost_saved_percent || 60,
    durationDays: row.duration_days || 10,
    year: row.year || 2024,
    imageUrl: row.image_url || '/assets/consultation-support.jpg',
    featured: row.featured ?? false,
  };
}

export function mapInquiryRow(row: any): Inquiry {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    countryOfResidence: row.country_of_residence,
    specialtyId: row.specialty_id,
    serviceId: row.service_id,
    serviceName: row.service_name,
    description: row.description,
    urgency: row.urgency || 'routine',
    preferredCountry: row.preferred_country,
    budgetRangeUSD: row.budget_min && row.budget_max ? { min: row.budget_min, max: row.budget_max } : undefined,
    documents: row.documents || [],
    status: row.status || 'new',
    assignedCaseManagerId: row.assigned_case_manager_id,
    notes: row.notes || [],
  };
}
