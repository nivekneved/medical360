import type { MockConfig, Inquiry, InquiryStatus, Hospital, Specialty, Doctor, CaseStudy } from '../types';
import { cmsSeed, CmsPage } from './seeds/cms.seed';
import {
  associateSpecialtyHospitals as helperAssociateSpecialtyHospitals,
  associateSpecialtyDoctors as helperAssociateSpecialtyDoctors,
  associateHospitalDoctors as helperAssociateHospitalDoctors,
  saveAllDoctorAssociations as helperSaveAllDoctorAssociations,
} from './matrix.helpers';
import {
  loadMockConfig,
  saveMockConfig,
  resetMockData,
  getLatencyMs,
  simulateDelay,
} from './store';
import { crudService, type EntityCollection, type EntityTypeMap } from '../services/crud.service';
import { cacheService } from '../services/cache.service';
import { sanitizeInput } from '../services/security.service';

export { loadMockConfig, saveMockConfig, resetMockData };

// ─── Centralized Universal Data Engine (Supabase Live & Resilient Store) ───────
class MockEngine {
  private config: MockConfig;

  constructor() {
    this.config = loadMockConfig();
  }

  private async delay(): Promise<void> {
    if (this.config.enabled) {
      await simulateDelay(getLatencyMs(this.config.latency));
    }
  }

  updateConfig(config: MockConfig): void {
    this.config = config;
    saveMockConfig(config);
  }

  getConfig(): MockConfig {
    return { ...this.config };
  }

  isLive(): boolean {
    return !this.config.enabled;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ── UNIVERSAL CENTRALIZED CRUD OPERATIONS (Single Source of Truth) ─────────
  // ═══════════════════════════════════════════════════════════════════════════

  async getAll<K extends EntityCollection>(collection: K): Promise<EntityTypeMap[K][]> {
    await this.delay();
    return crudService.getAll(collection);
  }

  async get<K extends EntityCollection>(collection: K, id: string): Promise<EntityTypeMap[K] | null> {
    await this.delay();
    return crudService.getById(collection, id);
  }

  async create<K extends EntityCollection>(
    collection: K,
    data: Omit<EntityTypeMap[K], 'id'> & { id?: string }
  ): Promise<EntityTypeMap[K]> {
    await this.delay();
    return crudService.create(collection, data);
  }

  async update<K extends EntityCollection>(
    collection: K,
    id: string,
    updates: Partial<EntityTypeMap[K]>
  ): Promise<EntityTypeMap[K]> {
    await this.delay();
    return crudService.update(collection, id, updates);
  }

  async delete<K extends EntityCollection>(collection: K, idOrIds: string | string[]): Promise<boolean> {
    await this.delay();
    return crudService.delete(collection, idOrIds);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ── DOMAIN CONVENIENCE ACCESSORS (Delegated to Centralized CRUD) ────────────
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 1. HOSPITALS ───────────────────────────────────────────────────────────
  async getHospitals(): Promise<Hospital[]> {
    return this.getAll('hospitals');
  }

  async getHospitalById(id: string): Promise<Hospital | null> {
    return this.get('hospitals', id);
  }

  async getFeaturedHospitals(): Promise<Hospital[]> {
    const all = await this.getHospitals();
    return all.filter(h => h.featured && h.active);
  }

  async getHospitalsBySpecialty(specialtyId: string): Promise<Hospital[]> {
    const list = await this.getHospitals();
    return list.filter(h => h.specialties.includes(specialtyId) && h.active);
  }

  async getSpecialtiesByHospital(hospitalId: string): Promise<Specialty[]> {
    const hospital = await this.getHospitalById(hospitalId);
    if (!hospital) return [];
    const allSpecialties = await this.getSpecialties();
    return allSpecialties.filter(s => hospital.specialties.includes(s.id));
  }

  async createHospital(hospital: Omit<Hospital, 'id'>): Promise<Hospital> {
    return this.create('hospitals', hospital);
  }

  async updateHospital(id: string, updates: Partial<Hospital>): Promise<Hospital> {
    return this.update('hospitals', id, updates);
  }

  async deleteHospital(id: string): Promise<boolean> {
    return this.delete('hospitals', id);
  }

  async deleteHospitals(ids: string[]): Promise<boolean> {
    return this.delete('hospitals', ids);
  }

  async associateHospitalSpecialties(hospitalId: string, specialtyIds: string[]): Promise<Hospital> {
    return this.updateHospital(hospitalId, { specialties: Array.from(new Set(specialtyIds)) });
  }

  async associateSpecialtyHospitals(specialtyId: string, hospitalIds: string[]): Promise<void> {
    return helperAssociateSpecialtyHospitals(
      specialtyId,
      hospitalIds,
      () => this.getHospitals(),
      (id, updates) => this.updateHospital(id, updates)
    );
  }

  async saveAllHospitalSpecialtyAssociations(mapping: Record<string, string[]>): Promise<void> {
    for (const [hospitalId, specialtyIds] of Object.entries(mapping)) {
      await this.updateHospital(hospitalId, { specialties: Array.from(new Set(specialtyIds)) });
    }
  }

  // ── 2. SPECIALTIES ─────────────────────────────────────────────────────────
  async getSpecialties(): Promise<Specialty[]> {
    return this.getAll('specialties');
  }

  async getSpecialtyById(id: string): Promise<Specialty | null> {
    return this.get('specialties', id);
  }

  async getFeaturedSpecialties(): Promise<Specialty[]> {
    const all = await this.getSpecialties();
    return all.filter(s => s.featured);
  }

  async createSpecialty(specialty: Specialty): Promise<Specialty> {
    return this.create('specialties', specialty);
  }

  async updateSpecialty(id: string, updates: Partial<Specialty>): Promise<Specialty> {
    return this.update('specialties', id, updates);
  }

  async deleteSpecialty(id: string): Promise<boolean> {
    return this.delete('specialties', id);
  }

  async deleteSpecialties(ids: string[]): Promise<boolean> {
    return this.delete('specialties', ids);
  }

  // ── 3. DOCTORS ─────────────────────────────────────────────────────────────
  async getDoctors(): Promise<Doctor[]> {
    return this.getAll('doctors');
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    return this.get('doctors', id);
  }

  async getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {
    const list = await this.getDoctors();
    return list.filter(d => (d.specialties || []).includes(specialtyId));
  }

  async getDoctorsByHospital(hospitalId: string): Promise<Doctor[]> {
    const list = await this.getDoctors();
    return list.filter(d => (d.hospitalIds || (d.hospitalId ? [d.hospitalId] : [])).includes(hospitalId));
  }

  async createDoctor(doctor: Doctor): Promise<Doctor> {
    return this.create('doctors', doctor);
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    return this.update('doctors', id, updates);
  }

  async deleteDoctor(id: string): Promise<boolean> {
    return this.delete('doctors', id);
  }

  async deleteDoctors(ids: string[]): Promise<boolean> {
    return this.delete('doctors', ids);
  }

  async associateDoctorSpecialties(doctorId: string, specialtyIds: string[]): Promise<Doctor> {
    return this.updateDoctor(doctorId, { specialties: Array.from(new Set(specialtyIds)) });
  }

  async associateDoctorHospital(doctorId: string, hospitalId: string): Promise<Doctor> {
    const doc = await this.getDoctorById(doctorId);
    const existing = doc?.hospitalIds || (doc?.hospitalId ? [doc.hospitalId] : []);
    const updated = Array.from(new Set([...existing, hospitalId]));
    return this.updateDoctor(doctorId, { hospitalId, hospitalIds: updated });
  }

  async associateDoctorHospitals(doctorId: string, hospitalIds: string[]): Promise<Doctor> {
    const clean = Array.from(new Set(hospitalIds));
    return this.updateDoctor(doctorId, { hospitalIds: clean, hospitalId: clean[0] || '' });
  }

  async associateSpecialtyDoctors(specialtyId: string, doctorIds: string[]): Promise<void> {
    return helperAssociateSpecialtyDoctors(
      specialtyId,
      doctorIds,
      () => this.getDoctors(),
      (id, updates) => this.updateDoctor(id, updates)
    );
  }

  async associateHospitalDoctors(hospitalId: string, doctorIds: string[]): Promise<void> {
    return helperAssociateHospitalDoctors(
      hospitalId,
      doctorIds,
      () => this.getDoctors(),
      (id, updates) => this.updateDoctor(id, updates)
    );
  }

  async saveAllDoctorAssociations(mapping: { doctorId: string; hospitalId?: string; hospitalIds?: string[]; specialtyIds?: string[] }[]): Promise<void> {
    return helperSaveAllDoctorAssociations(
      mapping,
      (id, updates) => this.updateDoctor(id, updates)
    );
  }

  // ── 4. CASE STUDIES ────────────────────────────────────────────────────────
  async getCaseStudies(): Promise<CaseStudy[]> {
    return this.getAll('caseStudies');
  }

  async getCaseStudyById(id: string): Promise<CaseStudy | null> {
    return this.get('caseStudies', id);
  }

  async getFeaturedCaseStudies(): Promise<CaseStudy[]> {
    const all = await this.getCaseStudies();
    return all.filter(c => c.featured);
  }

  async getCaseStudiesBySpecialty(specialtyId: string): Promise<CaseStudy[]> {
    const list = await this.getCaseStudies();
    return list.filter(c => c.specialtyId === specialtyId);
  }

  async createCaseStudy(caseStudy: CaseStudy): Promise<CaseStudy> {
    return this.create('caseStudies', caseStudy);
  }

  async updateCaseStudy(id: string, updates: Partial<CaseStudy>): Promise<CaseStudy> {
    return this.update('caseStudies', id, updates);
  }

  async deleteCaseStudy(id: string): Promise<boolean> {
    return this.delete('caseStudies', id);
  }

  async deleteCaseStudies(ids: string[]): Promise<boolean> {
    return this.delete('caseStudies', ids);
  }

  // ── 5. INQUIRIES ───────────────────────────────────────────────────────────
  async getInquiries(): Promise<Inquiry[]> {
    return this.getAll('inquiries');
  }

  async getInquiryById(id: string): Promise<Inquiry | null> {
    return this.get('inquiries', id);
  }

  async createInquiry(
    data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'notes' | 'documents'>
  ): Promise<Inquiry> {
    return this.create('inquiries', data as any);
  }

  async updateInquiry(id: string, updates: Partial<Inquiry>): Promise<Inquiry> {
    return this.update('inquiries', id, updates);
  }

  async updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    return this.updateInquiry(id, { status });
  }

  async addInquiryNote(id: string, content: string, authorId: string = 'admin'): Promise<Inquiry> {
    const inq = await this.getInquiryById(id);
    const cleanContent = sanitizeInput(content);
    const newNote = {
      id: `note-${Date.now()}`,
      inquiryId: id,
      authorId: sanitizeInput(authorId),
      content: cleanContent,
      createdAt: new Date().toISOString(),
    };
    const updatedNotes = [...(inq?.notes || []), newNote];
    return this.updateInquiry(id, { notes: updatedNotes });
  }

  async deleteInquiry(id: string): Promise<boolean> {
    return this.delete('inquiries', id);
  }

  async deleteInquiries(ids: string[]): Promise<boolean> {
    return this.delete('inquiries', ids);
  }

  async getInquiryStats() {
    return cacheService.cachedFetch(
      'inquiries:stats',
      async () => {
        const inquiries = await this.getInquiries();
        const bySpecialty: Record<string, number> = {};
        inquiries.forEach(i => {
          bySpecialty[i.specialtyId] = (bySpecialty[i.specialtyId] ?? 0) + 1;
        });
        return {
          total: inquiries.length,
          new: inquiries.filter(i => i.status === 'new').length,
          inProgress: inquiries.filter(i => ['contacted', 'in_progress', 'awaiting_documents', 'quoted'].includes(i.status)).length,
          completed: inquiries.filter(i => i.status === 'completed').length,
          bySpecialty,
        };
      },
      { ttlMs: 45 * 1000, tags: ['inquiries'] }
    );
  }

  // ── 6. CMS ────────────────────────────────────────────────────────────────
  async getCmsPage(id: string): Promise<CmsPage> {
    return cacheService.cachedFetch(
      `cms:${id}`,
      async () => {
        await this.delay();
        const page = (crudService as any).store?.cms?.[id] || cmsSeed[id];
        if (!page) throw new Error(`CMS page ${id} not found`);
        return JSON.parse(JSON.stringify(page));
      },
      { ttlMs: 15 * 60 * 1000, tags: ['cms'], persist: true }
    );
  }

  async getAllCmsPages(): Promise<CmsPage[]> {
    return cacheService.cachedFetch(
      'cms:all',
      async () => {
        await this.delay();
        return Object.values((crudService as any).store?.cms || cmsSeed);
      },
      { ttlMs: 15 * 60 * 1000, tags: ['cms'], persist: true }
    );
  }

  async updateCmsPage(id: string, content: Record<string, any>): Promise<CmsPage> {
    cacheService.invalidateTag('cms');
    await this.delay();
    const current = (crudService as any).store?.cms?.[id] || cmsSeed[id] || { id, title: id, content: {} };
    const updated = { ...current, content: { ...current.content, ...content } };
    if ((crudService as any).store?.cms) {
      (crudService as any).store.cms[id] = updated;
      (crudService as any).save();
    }
    return updated;
  }

  async resetCmsPage(id: string): Promise<CmsPage> {
    cacheService.invalidateTag('cms');
    await this.delay();
    const defaultPage = cmsSeed[id];
    if (defaultPage) {
      if ((crudService as any).store?.cms) {
        (crudService as any).store.cms[id] = JSON.parse(JSON.stringify(defaultPage));
        (crudService as any).save();
      }
      return defaultPage;
    }
    throw new Error(`Default seed for page ${id} not found`);
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────
export const mockEngine = new MockEngine();
