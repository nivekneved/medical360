import type { MockConfig, Inquiry, InquiryStatus, Hospital, Specialty, Doctor, CaseStudy } from '../types';
import { hospitalsSeed } from './seeds/hospitals.seed';
import { specialtiesSeed } from './seeds/specialties.seed';
import { doctorsSeed } from './seeds/doctors.seed';
import { caseStudiesSeed } from './seeds/case-studies.seed';
import { inquiriesSeed } from './seeds/inquiries.seed';
import { cmsSeed, CmsPage } from './seeds/cms.seed';
import { supabase, isSupabaseConfigured } from '../supabase/client';

// ─── Default Config ──────────────────────────────────────────────────────────
const DEFAULT_CONFIG: MockConfig = {
  enabled: true, // Default to mock, toggleable to live Supabase
  latency: 'normal',
  errorRate: 0,
};

const STORAGE_KEY = 'med360_mock_store_v4';
const CONFIG_KEY  = 'med360_mock_config';

// ─── Latency Simulator ───────────────────────────────────────────────────────
function getLatencyMs(latency: MockConfig['latency']): number {
  const map = { instant: 0, normal: 300, slow: 1000 };
  return map[latency];
}

function simulateDelay(ms: number): Promise<void> {
  if (ms === 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Deep Merge Helper ───────────────────────────────────────────────────────
function mergeCms(seed: Record<string, CmsPage>, existing: Record<string, CmsPage>): Record<string, CmsPage> {
  const result: Record<string, CmsPage> = { ...seed };
  if (!existing) return result;
  
  for (const [pageId, seedPage] of Object.entries(seed)) {
    const exPage = existing[pageId];
    if (exPage && exPage.content) {
      result[pageId] = {
        ...seedPage,
        ...exPage,
        content: {
          ...seedPage.content,
          ...exPage.content,
        },
      };
    }
  }
  for (const [pageId, exPage] of Object.entries(existing)) {
    if (!result[pageId]) {
      result[pageId] = exPage;
    }
  }
  return result;
}

// ─── Store Shape ─────────────────────────────────────────────────────────────
interface MockStore {
  hospitals: Hospital[];
  specialties: Specialty[];
  doctors: Doctor[];
  caseStudies: CaseStudy[];
  inquiries: Inquiry[];
  cms: Record<string, CmsPage>;
}

function loadStore(): MockStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockStore;
      const specMap = new Map(specialtiesSeed.map(s => [s.id, s.imageUrl]));
      const docMap = new Map(doctorsSeed.map(d => [d.id, d.imageUrl]));
      const hospMap = new Map(hospitalsSeed.map(h => [h.id, h.imageUrl]));
      const csMap = new Map(caseStudiesSeed.map(c => [c.id, c.imageUrl]));

      const hospitals = (parsed.hospitals?.length ? parsed.hospitals : hospitalsSeed).map(h => hospMap.has(h.id) ? { ...h, imageUrl: hospMap.get(h.id)! } : h);
      const specialties = (parsed.specialties?.length ? parsed.specialties : specialtiesSeed).map(s => specMap.has(s.id) ? { ...s, imageUrl: specMap.get(s.id)! } : s);
      const doctors = (parsed.doctors?.length ? parsed.doctors : doctorsSeed).map(d => docMap.has(d.id) ? { ...d, imageUrl: docMap.get(d.id)! } : d);
      const caseStudies = (parsed.caseStudies?.length ? parsed.caseStudies : caseStudiesSeed).map(c => csMap.has(c.id) ? { ...c, imageUrl: csMap.get(c.id)! } : c);

      return {
        hospitals,
        specialties,
        doctors,
        caseStudies,
        inquiries: parsed.inquiries ?? inquiriesSeed,
        cms: mergeCms(cmsSeed, parsed.cms ?? {}),
      };
    }
  } catch {
    // ignore parse errors
  }
  return {
    hospitals: hospitalsSeed,
    specialties: specialtiesSeed,
    doctors: doctorsSeed,
    caseStudies: caseStudiesSeed,
    inquiries: inquiriesSeed,
    cms: cmsSeed,
  };
}

function saveStore(store: MockStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage errors
  }
}

function resetStore(): MockStore {
  const fresh: MockStore = {
    hospitals: hospitalsSeed,
    specialties: specialtiesSeed,
    doctors: doctorsSeed,
    caseStudies: caseStudiesSeed,
    inquiries: inquiriesSeed,
    cms: cmsSeed,
  };
  saveStore(fresh);
  return fresh;
}

// ─── Config Helpers ──────────────────────────────────────────────────────────
export function loadMockConfig(): MockConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULT_CONFIG };
}

export function saveMockConfig(config: MockConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch { /* ignore */ }
}

export function resetMockData(): void {
  resetStore();
}

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
          return data.map(this.mapHospitalRow);
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
        if (!error && data) return this.mapHospitalRow(data);
      } catch (e) {
        console.warn('Supabase getHospitalById failed:', e);
      }
    }
    await this.delay();
    return this.store.hospitals.find(h => h.id === id) ?? null;
  }

  async getFeaturedHospitals(): Promise<Hospital[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('hospitals').select('*').eq('featured', true).eq('active', true);
        if (!error && data && data.length > 0) {
          return data.map(this.mapHospitalRow);
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
        if (!error && data) return this.mapHospitalRow(data);
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
        if (!error && data) return this.mapHospitalRow(data);
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
    if (this.isLive()) {
      try {
        await supabase.from('hospitals').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteHospital failed:', e);
      }
    }
    await this.delay();
    this.store.hospitals = this.store.hospitals.filter(h => h.id !== id);
    this.save();
    return true;
  }

  // ── 2. SPECIALTIES ─────────────────────────────────────────────────────────
  async getSpecialties(): Promise<Specialty[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('specialties').select('*');
        if (!error && data && data.length > 0) {
          return data.map(this.mapSpecialtyRow);
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
        if (!error && data) return this.mapSpecialtyRow(data);
      } catch (e) {
        console.warn('Supabase getSpecialtyById failed:', e);
      }
    }
    await this.delay();
    return this.store.specialties.find(s => s.id === id) ?? null;
  }

  async getFeaturedSpecialties(): Promise<Specialty[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('specialties').select('*').eq('featured', true);
        if (!error && data && data.length > 0) return data.map(this.mapSpecialtyRow);
      } catch (e) {
        console.warn('Supabase getFeaturedSpecialties failed:', e);
      }
    }
    await this.delay();
    return this.store.specialties.filter(s => s.featured);
  }

  async updateSpecialty(id: string, updates: Partial<Specialty>): Promise<Specialty> {
    if (this.isLive()) {
      try {
        const rowUpdates: any = { ...updates, updated_at: new Date().toISOString() };
        if (updates.imageUrl) rowUpdates.image_url = updates.imageUrl;
        if (updates.shortDescription) rowUpdates.short_description = updates.shortDescription;
        const { data, error } = await supabase.from('specialties').update(rowUpdates).eq('id', id).select().single();
        if (!error && data) return this.mapSpecialtyRow(data);
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
    if (this.isLive()) {
      try {
        await supabase.from('specialties').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteSpecialty failed:', e);
      }
    }
    await this.delay();
    this.store.specialties = this.store.specialties.filter(s => s.id !== id);
    this.save();
    return true;
  }

  // ── 3. DOCTORS ─────────────────────────────────────────────────────────────
  async getDoctors(): Promise<Doctor[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('doctors').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(this.mapDoctorRow);
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
        if (!error && data) return this.mapDoctorRow(data);
      } catch (e) {
        console.warn('Supabase getDoctorById failed:', e);
      }
    }
    await this.delay();
    return this.store.doctors.find(d => d.id === id) ?? null;
  }

  async getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {
    const list = await this.getDoctors();
    return list.filter(d => d.specialties.includes(specialtyId));
  }

  async getDoctorsByHospital(hospitalId: string): Promise<Doctor[]> {
    const list = await this.getDoctors();
    return list.filter(d => d.hospitalId === hospitalId);
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
        if (!error && data) return this.mapDoctorRow(data);
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
    if (this.isLive()) {
      try {
        await supabase.from('doctors').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteDoctor failed:', e);
      }
    }
    await this.delay();
    this.store.doctors = this.store.doctors.filter(d => d.id !== id);
    this.save();
    return true;
  }

  // ── 4. CASE STUDIES ────────────────────────────────────────────────────────
  async getCaseStudies(): Promise<CaseStudy[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('case_studies').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(this.mapCaseStudyRow);
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
        if (!error && data) return this.mapCaseStudyRow(data);
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
        if (!error && data && data.length > 0) return data.map(this.mapCaseStudyRow);
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

  async updateCaseStudy(id: string, updates: Partial<CaseStudy>): Promise<CaseStudy> {
    if (this.isLive()) {
      try {
        const rowUpdates: any = { ...updates, updated_at: new Date().toISOString() };
        if (updates.imageUrl) rowUpdates.image_url = updates.imageUrl;
        if (updates.patientFirstName) { rowUpdates.patient_first_name = updates.patientFirstName; rowUpdates.patient_name_anonymized = updates.patientFirstName; }
        if (updates.condition) { rowUpdates.condition = updates.condition; rowUpdates.title = updates.condition; }
        if (updates.treatment) { rowUpdates.treatment = updates.treatment; rowUpdates.summary = updates.treatment; }
        const { data, error } = await supabase.from('case_studies').update(rowUpdates).eq('id', id).select().single();
        if (!error && data) return this.mapCaseStudyRow(data);
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
    if (this.isLive()) {
      try {
        await supabase.from('case_studies').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteCaseStudy failed:', e);
      }
    }
    await this.delay();
    this.store.caseStudies = this.store.caseStudies.filter(c => c.id !== id);
    this.save();
    return true;
  }

  // ── 5. INQUIRIES ───────────────────────────────────────────────────────────
  async getInquiries(): Promise<Inquiry[]> {
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(this.mapInquiryRow);
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
        if (!error && data) return this.mapInquiryRow(data);
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
    const id = `inq-${Date.now()}`;
    const now = new Date().toISOString();
    const newInquiry: Inquiry = {
      ...data,
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
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          country_of_residence: data.countryOfResidence,
          specialty_id: data.specialtyId,
          description: data.description,
          urgency: data.urgency || 'routine',
          preferred_country: data.preferredCountry || null,
          budget_min: data.budgetRangeUSD?.min || null,
          budget_max: data.budgetRangeUSD?.max || null,
          documents: [],
          status: 'new',
          assigned_case_manager_id: null,
          notes: [],
          created_at: now,
          updated_at: now,
        };
        const { data: resData, error } = await supabase.from('inquiries').insert([row]).select().single();
        if (!error && resData) {
          const mapped = this.mapInquiryRow(resData);
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

  async updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    const now = new Date().toISOString();
    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('inquiries').update({ status, updated_at: now }).eq('id', id).select().single();
        if (!error && data) return this.mapInquiryRow(data);
      } catch (e) {
        console.warn('Supabase updateInquiryStatus failed:', e);
      }
    }
    await this.delay();
    const idx = this.store.inquiries.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    const updated = { ...this.store.inquiries[idx], status, updatedAt: now };
    this.store.inquiries[idx] = updated;
    this.save();
    return updated;
  }

  async addInquiryNote(id: string, content: string, authorId: string = 'admin'): Promise<Inquiry> {
    const inq = await this.getInquiryById(id);
    const newNote = {
      id: `note-${Date.now()}`,
      inquiryId: id,
      authorId,
      content,
      createdAt: new Date().toISOString(),
    };
    const updatedNotes = [...(inq?.notes || []), newNote];

    if (this.isLive()) {
      try {
        const { data, error } = await supabase.from('inquiries').update({ notes: updatedNotes, updated_at: new Date().toISOString() }).eq('id', id).select().single();
        if (!error && data) return this.mapInquiryRow(data);
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

  // ── Database Row Mappers ───────────────────────────────────────────────────
  private mapHospitalRow(r: any): Hospital {
    return {
      id: r.id,
      name: r.name,
      name_fr: r.name_fr,
      name_kr: r.name_kr,
      city: r.city,
      country: r.country,
      description: r.description,
      description_fr: r.description_fr,
      description_kr: r.description_kr,
      imageUrl: r.image_url || r.imageUrl,
      gallery: r.gallery || [],
      accreditations: r.accreditations || [],
      specialties: r.specialties || [],
      bedsCount: r.beds_count ?? r.bedsCount ?? 0,
      icuBeds: r.icu_beds ?? r.icuBeds ?? 0,
      foundedYear: r.founded_year ?? r.foundedYear ?? 2000,
      rating: Number(r.rating) || 4.8,
      reviewCount: r.review_count ?? r.reviewCount ?? 0,
      internationalPatientsPerYear: r.international_patients_per_year ?? r.internationalPatientsPerYear ?? 0,
      languages: r.languages || ['English', 'French'],
      website: r.website,
      contactEmail: r.contact_email || r.contactEmail,
      contactPhone: r.contact_phone || r.contactPhone,
      featured: !!r.featured,
      active: r.active !== false,
    };
  }

  private mapSpecialtyRow(r: any): Specialty {
    return {
      id: r.id,
      name: r.name,
      name_fr: r.name_fr,
      name_kr: r.name_kr,
      slug: r.slug,
      icon: r.icon,
      description: r.description,
      description_fr: r.description_fr,
      description_kr: r.description_kr,
      shortDescription: r.short_description || r.shortDescription || '',
      shortDescription_fr: r.short_description_fr || r.shortDescription_fr,
      shortDescription_kr: r.short_description_kr || r.shortDescription_kr,
      imageUrl: r.image_url || r.imageUrl,
      procedures: r.procedures || [],
      featured: !!r.featured,
    };
  }

  private mapDoctorRow(r: any): Doctor {
    return {
      id: r.id,
      hospitalId: r.hospital_id || r.hospitalId || '',
      name: r.name,
      title: r.title,
      specialties: r.specialties || (r.specialty_id ? [r.specialty_id] : []),
      qualifications: r.qualifications || [],
      experience: r.experience ?? r.years_experience ?? 10,
      surgeries: r.surgeries ?? r.review_count ?? 100,
      languages: r.languages || ['English', 'French'],
      imageUrl: r.image_url || r.imageUrl,
      bio: r.bio || r.biography || '',
      consultationFeeUSD: Number(r.consultation_fee_usd) || 60,
      featured: !!r.featured,
    };
  }

  private mapCaseStudyRow(r: any): CaseStudy {
    return {
      id: r.id,
      patientFirstName: r.patient_first_name || r.patient_name_anonymized || 'Anonymous',
      patientCountry: r.patient_country || r.patientCountry || 'Mauritius',
      patientAge: r.patient_age ?? r.patientAge ?? 45,
      condition: r.condition || r.title || '',
      condition_fr: r.condition_fr || r.title_fr,
      condition_kr: r.condition_kr || r.title_kr,
      specialtyId: r.specialty_id || r.specialtyId || '',
      hospitalId: r.hospital_id || r.hospitalId || '',
      doctorId: r.doctor_id || r.doctorId,
      treatment: r.treatment || r.summary || '',
      treatment_fr: r.treatment_fr || r.summary_fr,
      treatment_kr: r.treatment_kr || r.summary_kr,
      outcome: r.outcome || '',
      outcome_fr: r.outcome_fr,
      outcome_kr: r.outcome_kr,
      testimonial: r.testimonial || '',
      testimonial_fr: r.testimonial_fr,
      testimonial_kr: r.testimonial_kr,
      costSavedPercent: r.cost_saved_percent ?? r.costSavedPercent ?? 50,
      durationDays: r.duration_days ?? r.durationDays ?? 7,
      year: r.year ?? 2024,
      imageUrl: r.image_url || r.imageUrl,
      featured: !!r.featured,
    };
  }

  private mapInquiryRow(r: any): Inquiry {
    return {
      id: r.id,
      firstName: r.first_name || r.firstName,
      lastName: r.last_name || r.lastName,
      email: r.email,
      phone: r.phone,
      countryOfResidence: r.country_of_residence || r.countryOfResidence,
      specialtyId: r.specialty_id || r.specialtyId,
      description: r.description,
      urgency: r.urgency || 'routine',
      preferredCountry: r.preferred_country || r.preferredCountry,
      budgetRangeUSD: (r.budget_min !== undefined && r.budget_max !== undefined)
        ? { min: Number(r.budget_min), max: Number(r.budget_max) }
        : r.budgetRangeUSD,
      documents: r.documents || [],
      status: r.status || 'new',
      assignedCaseManagerId: r.assigned_case_manager_id || r.assignedCaseManagerId,
      notes: r.notes || [],
      createdAt: r.created_at || r.createdAt || new Date().toISOString(),
      updatedAt: r.updated_at || r.updatedAt || new Date().toISOString(),
    };
  }
}

// ─── Singleton Export ─────────────────────────────────────────────────────────
export const mockEngine = new MockEngine();
