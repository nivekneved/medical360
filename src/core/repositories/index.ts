import type { Hospital, Specialty, Doctor, CaseStudy, Inquiry, AdminUser } from '../types';

// ── Repository Interface Contracts ──────────────────────────────────────────

export interface IHospitalRepository {
  getAll(): Promise<Hospital[]>;
  getById(id: string): Promise<Hospital | null>;
  getFeatured(): Promise<Hospital[]>;
  getBySpecialty(specialtyId: string): Promise<Hospital[]>;
}

export interface ISpecialtyRepository {
  getAll(): Promise<Specialty[]>;
  getById(id: string): Promise<Specialty | null>;
  getFeatured(): Promise<Specialty[]>;
}

export interface IDoctorRepository {
  getAll(): Promise<Doctor[]>;
  getById(id: string): Promise<Doctor | null>;
  getByHospital(hospitalId: string): Promise<Doctor[]>;
  getBySpecialty(specialtyId: string): Promise<Doctor[]>;
  getFeatured(): Promise<Doctor[]>;
}

export interface ICaseStudyRepository {
  getAll(): Promise<CaseStudy[]>;
  getById(id: string): Promise<CaseStudy | null>;
  getFeatured(): Promise<CaseStudy[]>;
  getBySpecialty(specialtyId: string): Promise<CaseStudy[]>;
}

export interface IInquiryRepository {
  getAll(): Promise<Inquiry[]>;
  getById(id: string): Promise<Inquiry | null>;
  create(data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'notes'>): Promise<Inquiry>;
  updateStatus(id: string, status: Inquiry['status']): Promise<Inquiry>;
  assign(id: string, caseManagerId: string): Promise<Inquiry>;
  addNote(inquiryId: string, note: Omit<InquiryNote, 'id' | 'createdAt'>): Promise<Inquiry>;
  getStats(): Promise<InquiryStats>;
}

export interface InquiryNote {
  id: string;
  inquiryId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface InquiryStats {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  bySpecialty: Record<string, number>;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<AdminUser | null>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AdminUser | null>;
}
