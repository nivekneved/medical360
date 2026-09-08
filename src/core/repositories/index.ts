import type { Hospital, Specialty, Doctor, CaseStudy, Inquiry } from '../types';
import { crudService } from '../services/crud.service';
import { mockEngine } from '../mock/engine';

// ── Repository Interface Contracts ──────────────────────────────────────────

export interface IHospitalRepository {
  getAll(): Promise<Hospital[]>;
  getById(id: string): Promise<Hospital | null>;
  getFeatured(): Promise<Hospital[]>;
  getBySpecialty(specialtyId: string): Promise<Hospital[]>;
  create(hospital: Partial<Hospital>): Promise<Hospital>;
  update(id: string, hospital: Partial<Hospital>): Promise<Hospital>;
  delete(ids: string[]): Promise<void>;
}

export interface ISpecialtyRepository {
  getAll(): Promise<Specialty[]>;
  getById(id: string): Promise<Specialty | null>;
  getFeatured(): Promise<Specialty[]>;
  create(specialty: Partial<Specialty>): Promise<Specialty>;
  update(id: string, specialty: Partial<Specialty>): Promise<Specialty>;
  delete(ids: string[]): Promise<void>;
}

export interface IDoctorRepository {
  getAll(): Promise<Doctor[]>;
  getById(id: string): Promise<Doctor | null>;
  getByHospital(hospitalId: string): Promise<Doctor[]>;
  getBySpecialty(specialtyId: string): Promise<Doctor[]>;
  getFeatured(): Promise<Doctor[]>;
  create(doctor: Partial<Doctor>): Promise<Doctor>;
  update(id: string, doctor: Partial<Doctor>): Promise<Doctor>;
  delete(ids: string[]): Promise<void>;
}

export interface ICaseStudyRepository {
  getAll(): Promise<CaseStudy[]>;
  getById(id: string): Promise<CaseStudy | null>;
  getFeatured(): Promise<CaseStudy[]>;
  getBySpecialty(specialtyId: string): Promise<CaseStudy[]>;
  create(caseStudy: Partial<CaseStudy>): Promise<CaseStudy>;
  update(id: string, caseStudy: Partial<CaseStudy>): Promise<CaseStudy>;
  delete(ids: string[]): Promise<void>;
}

export interface IInquiryRepository {
  getAll(): Promise<Inquiry[]>;
  getById(id: string): Promise<Inquiry | null>;
  create(data: Partial<Inquiry>): Promise<Inquiry>;
  updateStatus(id: string, status: Inquiry['status']): Promise<Inquiry>;
  addNote(inquiryId: string, noteText: string, author?: string): Promise<Inquiry>;
  delete(ids: string[]): Promise<void>;
}

// ── Concrete Implementations ────────────────────────────────────────────────

export class HospitalRepository implements IHospitalRepository {
  async getAll(): Promise<Hospital[]> {
    return crudService.getAll('hospitals');
  }

  async getById(id: string): Promise<Hospital | null> {
    return crudService.getById('hospitals', id);
  }

  async getFeatured(): Promise<Hospital[]> {
    const list = await this.getAll();
    return list.filter((h) => h.featured && h.active);
  }

  async getBySpecialty(specialtyId: string): Promise<Hospital[]> {
    const list = await this.getAll();
    return list.filter((h) => h.specialties?.includes(specialtyId));
  }

  async create(hospital: Partial<Hospital>): Promise<Hospital> {
    return crudService.create('hospitals', hospital as any);
  }

  async update(id: string, hospital: Partial<Hospital>): Promise<Hospital> {
    return crudService.update('hospitals', id, hospital);
  }

  async delete(ids: string[]): Promise<void> {
    await crudService.delete('hospitals', ids);
  }
}

export class SpecialtyRepository implements ISpecialtyRepository {
  async getAll(): Promise<Specialty[]> {
    return crudService.getAll('specialties');
  }

  async getById(id: string): Promise<Specialty | null> {
    return crudService.getById('specialties', id);
  }

  async getFeatured(): Promise<Specialty[]> {
    const list = await this.getAll();
    return list.filter((s) => s.featured);
  }

  async create(specialty: Partial<Specialty>): Promise<Specialty> {
    return crudService.create('specialties', specialty as any);
  }

  async update(id: string, specialty: Partial<Specialty>): Promise<Specialty> {
    return crudService.update('specialties', id, specialty);
  }

  async delete(ids: string[]): Promise<void> {
    await crudService.delete('specialties', ids);
  }
}

export class DoctorRepository implements IDoctorRepository {
  async getAll(): Promise<Doctor[]> {
    return crudService.getAll('doctors');
  }

  async getById(id: string): Promise<Doctor | null> {
    return crudService.getById('doctors', id);
  }

  async getByHospital(hospitalId: string): Promise<Doctor[]> {
    const list = await this.getAll();
    return list.filter((d) => d.hospitalId === hospitalId || d.hospitalIds?.includes(hospitalId));
  }

  async getBySpecialty(specialtyId: string): Promise<Doctor[]> {
    const list = await this.getAll();
    return list.filter((d) => d.specialties?.includes(specialtyId));
  }

  async getFeatured(): Promise<Doctor[]> {
    const list = await this.getAll();
    return list.filter((d) => d.featured);
  }

  async create(doctor: Partial<Doctor>): Promise<Doctor> {
    return crudService.create('doctors', doctor as any);
  }

  async update(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
    return crudService.update('doctors', id, doctor);
  }

  async delete(ids: string[]): Promise<void> {
    await crudService.delete('doctors', ids);
  }
}

export class CaseStudyRepository implements ICaseStudyRepository {
  async getAll(): Promise<CaseStudy[]> {
    return crudService.getAll('caseStudies');
  }

  async getById(id: string): Promise<CaseStudy | null> {
    return crudService.getById('caseStudies', id);
  }

  async getFeatured(): Promise<CaseStudy[]> {
    const list = await this.getAll();
    return list.filter((c) => c.featured);
  }

  async getBySpecialty(specialtyId: string): Promise<CaseStudy[]> {
    const list = await this.getAll();
    return list.filter((c) => c.specialtyId === specialtyId);
  }

  async create(caseStudy: Partial<CaseStudy>): Promise<CaseStudy> {
    return crudService.create('caseStudies', caseStudy as any);
  }

  async update(id: string, caseStudy: Partial<CaseStudy>): Promise<CaseStudy> {
    return crudService.update('caseStudies', id, caseStudy);
  }

  async delete(ids: string[]): Promise<void> {
    await crudService.delete('caseStudies', ids);
  }
}

export class InquiryRepository implements IInquiryRepository {
  async getAll(): Promise<Inquiry[]> {
    return crudService.getAll('inquiries');
  }

  async getById(id: string): Promise<Inquiry | null> {
    return crudService.getById('inquiries', id);
  }

  async create(data: Partial<Inquiry>): Promise<Inquiry> {
    return mockEngine.createInquiry(data as any);
  }

  async updateStatus(id: string, status: Inquiry['status']): Promise<Inquiry> {
    return mockEngine.updateInquiryStatus(id, status);
  }

  async addNote(inquiryId: string, noteText: string, author?: string): Promise<Inquiry> {
    return mockEngine.addInquiryNote(inquiryId, noteText, author);
  }

  async delete(ids: string[]): Promise<void> {
    await mockEngine.deleteInquiries(ids);
  }
}

// ── Singletons ───────────────────────────────────────────────────────────────
export const hospitalRepo = new HospitalRepository();
export const specialtyRepo = new SpecialtyRepository();
export const doctorRepo = new DoctorRepository();
export const caseStudyRepo = new CaseStudyRepository();
export const inquiryRepo = new InquiryRepository();
