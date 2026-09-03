// ---------------------------------------------
// Medical 360 — Core Domain Types
// ---------------------------------------------

export interface Hospital {
  id: string;
  slug?: string;
  name: string;
  name_fr?: string;
  name_kr?: string;
  city: string;
  country: string;
  description: string;
  description_fr?: string;
  description_kr?: string;
  imageUrl: string;
  gallery: string[];
  accreditations: string[];
  specialties: string[];
  bedsCount: number;
  icuBeds: number;
  foundedYear: number;
  rating: number;
  reviewCount: number;
  internationalPatientsPerYear: number;
  languages: string[];
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  featured: boolean;
  active: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  name_fr?: string;
  name_kr?: string;
  slug: string;
  icon: string;
  description: string;
  description_fr?: string;
  description_kr?: string;
  shortDescription: string;
  shortDescription_fr?: string;
  shortDescription_kr?: string;
  imageUrl: string;
  procedures: Procedure[];
  featured: boolean;
}

export interface Procedure {
  id: string;
  specialtyId: string;
  name: string;
  name_fr?: string;
  name_kr?: string;
  description: string;
  description_fr?: string;
  description_kr?: string;
  estimatedDurationDays: number;
  estimatedCostUSD: { min: number; max: number };
}

export interface Doctor {
  id: string;
  hospitalId: string;
  name: string;
  title: string;
  specialties: string[];
  qualifications: string[];
  experience: number;
  surgeries: number;
  languages: string[];
  imageUrl: string;
  bio: string;
  consultationFeeUSD: number;
  featured: boolean;
}

export interface CaseStudy {
  id: string;
  patientFirstName: string;
  patientCountry: string;
  patientAge: number;
  condition: string;
  condition_fr?: string;
  condition_kr?: string;
  specialtyId: string;
  hospitalId: string;
  doctorId?: string;
  treatment: string;
  treatment_fr?: string;
  treatment_kr?: string;
  outcome: string;
  outcome_fr?: string;
  outcome_kr?: string;
  testimonial: string;
  testimonial_fr?: string;
  testimonial_kr?: string;
  costSavedPercent: number;
  durationDays: number;
  year: number;
  imageUrl: string;
  featured: boolean;
}

export type InquiryStatus =
  | 'new'
  | 'contacted'
  | 'in_progress'
  | 'awaiting_documents'
  | 'quoted'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type InquiryUrgency = 'routine' | 'urgent' | 'emergency';

export interface Inquiry {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  specialtyId: string;
  serviceId?: string;
  serviceName?: string;
  description: string;
  urgency: InquiryUrgency;
  preferredCountry?: string;
  budgetRangeUSD?: { min: number; max: number };
  documents: InquiryDocument[];
  status: InquiryStatus;
  assignedCaseManagerId?: string;
  notes: InquiryNote[];
}

export interface InquiryDocument {
  id: string;
  inquiryId: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface InquiryNote {
  id: string;
  inquiryId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'case_manager';
  active: boolean;
}

export interface MockConfig {
  enabled: boolean;
  latency: 'instant' | 'normal' | 'slow';
  errorRate: number;
}
