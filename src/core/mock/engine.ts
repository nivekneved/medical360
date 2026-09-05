import type { MockConfig, Inquiry, InquiryStatus, Hospital, Specialty, Doctor, CaseStudy } from '../types';
import { cmsSeed, CmsPage } from './seeds/cms.seed';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import {
  mapHospitalRow,
  mapSpecialtyRow,
  mapDoctorRow,
  mapCaseStudyRow,
  mapInquiryRow,
} from '../supabase/repositories';
import {
  associateSpecialtyHospitals as helperAssociateSpecialtyHospitals,
  associateSpecialtyDoctors as helperAssociateSpecialtyDoctors,
  associateHospitalDoctors as helperAssociateHospitalDoctors,
  saveAllDoctorAssociations as helperSaveAllDoctorAssociations,
} from './matrix.helpers';
import {
  loadStore,
  saveStore,
  loadMockConfig,
  saveMockConfig,
  resetMockData,
  getLatencyMs,
  simulateDelay,
  type MockStore,
} from './store';
import { deepSanitize, sanitizeInput } from '../services/security.service';

export { loadMockConfig, saveMockConfig, resetMockData };

// ─── Dual-Mode Data Engine (Supabase Live & Mock Fallback) ────────────────────
class MockEngine {
  private store: MockStore;
  private config: MockConfig;

  constructor() {
    this.store   = loadStore();
    this.config  = loadMockConfig();
  }

  private async delay(): Promise<void> {
    if (this.config.enabled) {
      await simulateDelay(getLatencyMs(this.config.latency));
    }
  }

  private save(): void {
    saveStore(this.store);
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

  // ── 1. HOSPITALS ───────────────────────────────────────────────────────────
  async getHospitals(): Promise<Hospital[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('hospitals').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(mapHospitalRow);
        }
      } catch (e) {
        console.warn('Supabase getHospitals failed, falling back to local store:', e);
      }
    }
    await this.delay();
    return [...this.store.hospitals];
  }

  async getHospitalById(id: string): Promise<Hospital | null> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('hospitals').select('*').eq('id', id).single();
        if (!error && data) return mapHospitalRow(data);
      } catch (e) {
        console.warn('Supabase getHospitalById failed:', e);
      }
    }
    await this.delay();
    return this.store.hospitals.find(h => h.id === id || h.slug === id) ?? null;
  }

  async getFeaturedHospitals(): Promise<Hospital[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('hospitals').select('*').eq('featured', true).eq('active', true);
        if (!error && data && data.length > 0) {
          return data.map(mapHospitalRow);
        }
      } catch (e) {
        console.warn('Supabase getFeaturedHospitals failed:', e);
      }
    }
    await this.delay();
    return this.store.hospitals.filter(h => h.featured && h.active);
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

  async updateHospital(id: string, updates: Partial<Hospital>): Promise<Hospital> {
    if (this.isLive()) {
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
    }
    await this.delay();
    const idx = this.store.hospitals.findIndex(h => h.id === id);
    if (idx === -1) throw new Error('Hospital not found');
    const updated = { ...this.store.hospitals[idx], ...updates };
    this.store.hospitals[idx] = updated;
    this.save();
    return updated;
  }

  async createHospital(hospital: Omit<Hospital, 'id'>): Promise<Hospital> {
    const id = `hosp-${Date.now()}`;
    const newHospital: Hospital = { ...hospital, id };

    if (this.isLive()) {
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
    }
    await this.delay();
    this.store.hospitals.unshift(newHospital);
    this.save();
    return newHospital;
  }

  async deleteHospital(id: string): Promise<boolean> {
    return this.deleteHospitals([id]);
  }

  async deleteHospitals(ids: string[]): Promise<boolean> {
    if (this.isLive()) {
      try {
        await supabase.from('hospitals').delete().in('id', ids);
      } catch (e) {
        console.warn('Supabase deleteHospitals failed:', e);
      }
    }
    await this.delay();
    const idSet = new Set(ids);
    this.store.hospitals = this.store.hospitals.filter(h => !idSet.has(h.id));
    this.save();
    return true;
  }

  // ── 2. SPECIALTIES ─────────────────────────────────────────────────────────
  async getSpecialties(): Promise<Specialty[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('specialties').select('*');
        if (!error && data && data.length > 0) {
          return data.map(mapSpecialtyRow);
        }
      } catch (e) {
        console.warn('Supabase getSpecialties failed:', e);
      }
    }
    await this.delay();
    return [...this.store.specialties];
  }

  async getSpecialtyById(id: string): Promise<Specialty | null> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('specialties').select('*').eq('id', id).single();
        if (!error && data) return mapSpecialtyRow(data);
      } catch (e) {
        console.warn('Supabase getSpecialtyById failed:', e);
      }
    }
    await this.delay();
    return this.store.specialties.find(s => s.id === id || s.slug === id) ?? null;
  }

  async getFeaturedSpecialties(): Promise<Specialty[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('specialties').select('*').eq('featured', true);
        if (!error && data && data.length > 0) return data.map(mapSpecialtyRow);
      } catch (e) {
        console.warn('Supabase getFeaturedSpecialties failed:', e);
      }
    }
    await this.delay();
    return this.store.specialties.filter(s => s.featured);
  }

  async createSpecialty(specialty: Specialty): Promise<Specialty> {
    const id = specialty.id || `sp-${Date.now()}`;
    const newSpecialty: Specialty = { ...specialty, id };
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('specialties').insert([newSpecialty]).select().single();
        if (!error && data) return mapSpecialtyRow(data);
      } catch (e) {
        console.warn('Supabase createSpecialty failed:', e);
      }
    }
    await this.delay();
    this.store.specialties.unshift(newSpecialty);
    this.save();
    return newSpecialty;
  }

  async updateSpecialty(id: string, updates: Partial<Specialty>): Promise<Specialty> {
    if (this.isLive()) {
      try {
        const rowUpdates: any = { ...updates, updated_at: new Date().toISOString() };
        if (updates.imageUrl) rowUpdates.image_url = updates.imageUrl;
        if (updates.shortDescription) rowUpdates.short_description = updates.shortDescription;
        const { data, error } = await supabase.from('specialties').update(rowUpdates).eq('id', id).select().single();
        if (!error && data) return mapSpecialtyRow(data);
      } catch (e) {
        console.warn('Supabase updateSpecialty failed:', e);
      }
    }
    await this.delay();
    const idx = this.store.specialties.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Specialty not found');
    const updated = { ...this.store.specialties[idx], ...updates };
    this.store.specialties[idx] = updated;
    this.save();
    return updated;
  }

  async deleteSpecialty(id: string): Promise<boolean> {
    return this.deleteSpecialties([id]);
  }

  async deleteSpecialties(ids: string[]): Promise<boolean> {
    if (this.isLive()) {
      try {
        await supabase.from('specialties').delete().in('id', ids);
      } catch (e) {
        console.warn('Supabase deleteSpecialties failed:', e);
      }
    }
    await this.delay();
    const idSet = new Set(ids);
    this.store.specialties = this.store.specialties.filter(s => !idSet.has(s.id));
    this.save();
    return true;
  }

  // ── 3. DOCTORS ─────────────────────────────────────────────────────────────
  async getDoctors(): Promise<Doctor[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(mapDoctorRow);
        }
      } catch (e) {
        console.warn('Supabase getDoctors failed:', e);
      }
    }
    await this.delay();
    return [...this.store.doctors];
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('doctors').select('*').eq('id', id).single();
        if (!error && data) return mapDoctorRow(data);
      } catch (e) {
        console.warn('Supabase getDoctorById failed:', e);
      }
    }
    await this.delay();
    return this.store.doctors.find(d => d.id === id) ?? null;
  }

  async getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {
    const list = await this.getDoctors();
    return list.filter(d => (d.specialties || []).includes(specialtyId));
  }

  async getDoctorsByHospital(hospitalId: string): Promise<Doctor[]> {
    const list = await this.getDoctors();
    return list.filter(d => (d.hospitalIds || (d.hospitalId ? [d.hospitalId] : [])).includes(hospitalId));
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

  async createDoctor(doctor: Doctor): Promise<Doctor> {
    const id = doctor.id || `doc-${Date.now()}`;
    const newDoctor: Doctor = { ...doctor, id };
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('doctors').insert([newDoctor]).select().single();
        if (!error && data) return mapDoctorRow(data);
      } catch (e) {
        console.warn('Supabase createDoctor failed:', e);
      }
    }
    await this.delay();
    this.store.doctors.unshift(newDoctor);
    this.save();
    return newDoctor;
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    if (this.isLive()) {
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
    }
    await this.delay();
    const idx = this.store.doctors.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Doctor not found');
    const updated = { ...this.store.doctors[idx], ...updates };
    this.store.doctors[idx] = updated;
    this.save();
    return updated;
  }

  async deleteDoctor(id: string): Promise<boolean> {
    return this.deleteDoctors([id]);
  }

  async deleteDoctors(ids: string[]): Promise<boolean> {
    if (this.isLive()) {
      try {
        await supabase.from('doctors').delete().in('id', ids);
      } catch (e) {
        console.warn('Supabase deleteDoctors failed:', e);
      }
    }
    await this.delay();
    const idSet = new Set(ids);
    this.store.doctors = this.store.doctors.filter(d => !idSet.has(d.id));
    this.save();
    return true;
  }

  // ── 4. CASE STUDIES ────────────────────────────────────────────────────────
  async getCaseStudies(): Promise<CaseStudy[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('case_studies').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(mapCaseStudyRow);
        }
      } catch (e) {
        console.warn('Supabase getCaseStudies failed:', e);
      }
    }
    await this.delay();
    return [...this.store.caseStudies];
  }

  async getCaseStudyById(id: string): Promise<CaseStudy | null> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('case_studies').select('*').eq('id', id).single();
        if (!error && data) return mapCaseStudyRow(data);
      } catch (e) {
        console.warn('Supabase getCaseStudyById failed:', e);
      }
    }
    await this.delay();
    return this.store.caseStudies.find(c => c.id === id) ?? null;
  }

  async getFeaturedCaseStudies(): Promise<CaseStudy[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('case_studies').select('*').eq('featured', true);
        if (!error && data && data.length > 0) return data.map(mapCaseStudyRow);
      } catch (e) {
        console.warn('Supabase getFeaturedCaseStudies failed:', e);
      }
    }
    await this.delay();
    return this.store.caseStudies.filter(c => c.featured);
  }

  async getCaseStudiesBySpecialty(specialtyId: string): Promise<CaseStudy[]> {
    const list = await this.getCaseStudies();
    return list.filter(c => c.specialtyId === specialtyId);
  }

  async createCaseStudy(caseStudy: CaseStudy): Promise<CaseStudy> {
    const id = caseStudy.id || `cs-${Date.now()}`;
    const newCase: CaseStudy = { ...caseStudy, id };
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('case_studies').insert([newCase]).select().single();
        if (!error && data) return mapCaseStudyRow(data);
      } catch (e) {
        console.warn('Supabase createCaseStudy failed:', e);
      }
    }
    await this.delay();
    this.store.caseStudies.unshift(newCase);
    this.save();
    return newCase;
  }

  async updateCaseStudy(id: string, updates: Partial<CaseStudy>): Promise<CaseStudy> {
    if (this.isLive()) {
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
    }
    await this.delay();
    const idx = this.store.caseStudies.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Case study not found');
    const updated = { ...this.store.caseStudies[idx], ...updates };
    this.store.caseStudies[idx] = updated;
    this.save();
    return updated;
  }

  async deleteCaseStudy(id: string): Promise<boolean> {
    return this.deleteCaseStudies([id]);
  }

  async deleteCaseStudies(ids: string[]): Promise<boolean> {
    if (this.isLive()) {
      try {
        await supabase.from('case_studies').delete().in('id', ids);
      } catch (e) {
        console.warn('Supabase deleteCaseStudies failed:', e);
      }
    }
    await this.delay();
    const idSet = new Set(ids);
    this.store.caseStudies = this.store.caseStudies.filter(c => !idSet.has(c.id));
    this.save();
    return true;
  }

  // ── 5. INQUIRIES ───────────────────────────────────────────────────────────
  async getInquiries(): Promise<Inquiry[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(mapInquiryRow);
        }
      } catch (e) {
        console.warn('Supabase getInquiries failed:', e);
      }
    }
    await this.delay();
    return [...this.store.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getInquiryById(id: string): Promise<Inquiry | null> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('inquiries').select('*').eq('id', id).single();
        if (!error && data) return mapInquiryRow(data);
      } catch (e) {
        console.warn('Supabase getInquiryById failed:', e);
      }
    }
    await this.delay();
    return this.store.inquiries.find(i => i.id === id) ?? null;
  }

  async createInquiry(
    data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'notes' | 'documents'>
  ): Promise<Inquiry> {
    const cleanData = deepSanitize(data);
    const id = `inq-${Date.now()}`;
    const now = new Date().toISOString();
    const newInquiry: Inquiry = {
      ...cleanData,
      id,
      createdAt: now,
      updatedAt: now,
      status: 'new',
      documents: [],
      notes: [],
    };

    // Persist to live Supabase cloud database if configured
    if (isSupabaseConfigured) {
      try {
        const row = {
          id,
          first_name: cleanData.firstName,
          last_name: cleanData.lastName,
          email: cleanData.email,
          phone: cleanData.phone,
          country_of_residence: cleanData.countryOfResidence,
          specialty_id: cleanData.specialtyId,
          description: cleanData.description,
          urgency: cleanData.urgency || 'routine',
          preferred_country: cleanData.preferredCountry || null,
          budget_min: cleanData.budgetRangeUSD?.min || null,
          budget_max: cleanData.budgetRangeUSD?.max || null,
          documents: [],
          status: 'new',
          assigned_case_manager_id: null,
          notes: [],
          created_at: now,
          updated_at: now,
        };
        const { data: resData, error } = await supabase.from('inquiries').insert([row]).select().single();
        if (!error && resData) {
          const mapped = mapInquiryRow(resData);
          this.store.inquiries.unshift(mapped);
          this.save();
          return mapped;
        }
      } catch (e) {
        console.warn('Supabase createInquiry error (falling back to local store):', e);
      }
    }

    await this.delay();
    this.store.inquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }

  async updateInquiry(id: string, updates: Partial<Inquiry>): Promise<Inquiry> {
    const now = new Date().toISOString();
    if (this.isLive()) {
      try {
        const rowUpdates: any = { ...updates, updated_at: now };
        const { data, error } = await supabase.from('inquiries').update(rowUpdates).eq('id', id).select().single();
        if (!error && data) return mapInquiryRow(data);
      } catch (e) {
        console.warn('Supabase updateInquiry failed:', e);
      }
    }
    await this.delay();
    const idx = this.store.inquiries.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Inquiry not found');
    const updated = { ...this.store.inquiries[idx], ...updates, updatedAt: now };
    this.store.inquiries[idx] = updated;
    this.save();
    return updated;
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

    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('inquiries').update({ notes: updatedNotes, updated_at: new Date().toISOString() }).eq('id', id).select().single();
        if (!error && data) return mapInquiryRow(data);
      } catch (e) {
        console.warn('Supabase addInquiryNote failed:', e);
      }
    }

    await this.delay();
    const idx = this.store.inquiries.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    const updated = { ...this.store.inquiries[idx], updatedAt: new Date().toISOString(), notes: updatedNotes };
    this.store.inquiries[idx] = updated;
    this.save();
    return updated;
  }

  async deleteInquiry(id: string): Promise<boolean> {
    if (this.isLive()) {
      try {
        await supabase.from('inquiries').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteInquiry failed:', e);
      }
    }
    await this.delay();
    this.store.inquiries = this.store.inquiries.filter(i => i.id !== id);
    this.save();
    return true;
  }

  async deleteInquiries(ids: string[]): Promise<boolean> {
    if (this.isLive()) {
      try {
        await supabase.from('inquiries').delete().in('id', ids);
      } catch (e) {
        console.warn('Supabase deleteInquiries failed:', e);
      }
    }
    await this.delay();
    const idSet = new Set(ids);
    this.store.inquiries = this.store.inquiries.filter(i => !idSet.has(i.id));
    this.save();
    return true;
  }

  async getInquiryStats() {
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
  }

  // ── CMS ───────────────────────────────────────────────────────────────────
  async getCmsPage(id: string): Promise<CmsPage> {
    await this.delay();
    const page = this.store.cms[id] || cmsSeed[id];
    if (!page) throw new Error(`CMS page ${id} not found`);
    return JSON.parse(JSON.stringify(page));
  }

  async getAllCmsPages(): Promise<CmsPage[]> {
    await this.delay();
    return Object.values(this.store.cms);
  }

  async updateCmsPage(id: string, content: Record<string, any>): Promise<CmsPage> {
    await this.delay();
    const base = this.store.cms[id] || cmsSeed[id] || { id, title: id, content: {} };
    this.store.cms[id] = { ...base, content: { ...base.content, ...content } };
    this.save();
    return this.store.cms[id];
  }

  async resetCmsPage(id: string): Promise<CmsPage> {
    await this.delay();
    const defaultPage = cmsSeed[id];
    if (defaultPage) {
      this.store.cms[id] = JSON.parse(JSON.stringify(defaultPage));
      this.save();
      return this.store.cms[id];
    }
    throw new Error(`Default seed for page ${id} not found`);
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────
export const mockEngine = new MockEngine();

