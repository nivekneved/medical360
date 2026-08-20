import type { MockConfig, Inquiry, InquiryStatus, Hospital, Specialty, Doctor, CaseStudy } from '../types';
import { hospitalsSeed } from './seeds/hospitals.seed';
import { specialtiesSeed } from './seeds/specialties.seed';
import { doctorsSeed } from './seeds/doctors.seed';
import { caseStudiesSeed } from './seeds/case-studies.seed';
import { inquiriesSeed } from './seeds/inquiries.seed';
import { cmsSeed, CmsPage } from './seeds/cms.seed';

// ─── Default Config ──────────────────────────────────────────────────────────
const DEFAULT_CONFIG: MockConfig = {
  enabled: true,
  latency: 'normal',
  errorRate: 0,
};

const STORAGE_KEY = 'med360_mock_store_v2';
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
  // Also preserve any custom pages created
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
      return {
        hospitals: parsed.hospitals?.length ? parsed.hospitals : hospitalsSeed,
        specialties: parsed.specialties?.length ? parsed.specialties : specialtiesSeed,
        doctors: parsed.doctors?.length ? parsed.doctors : doctorsSeed,
        caseStudies: parsed.caseStudies?.length ? parsed.caseStudies : caseStudiesSeed,
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

// ─── Mock Data Engine ────────────────────────────────────────────────────────
class MockEngine {
  private store: MockStore;
  private config: MockConfig;

  constructor() {
    this.store   = loadStore();
    this.config  = loadMockConfig();
  }

  private async delay(): Promise<void> {
    await simulateDelay(getLatencyMs(this.config.latency));
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

  // ── Hospitals ──────────────────────────────────────────────────────────────
  async getHospitals(): Promise<Hospital[]> {
    await this.delay();
    return [...this.store.hospitals];
  }

  async getHospitalById(id: string): Promise<Hospital | null> {
    await this.delay();
    return this.store.hospitals.find(h => h.id === id) ?? null;
  }

  async getFeaturedHospitals(): Promise<Hospital[]> {
    await this.delay();
    return this.store.hospitals.filter(h => h.featured && h.active);
  }

  async getHospitalsBySpecialty(specialtyId: string): Promise<Hospital[]> {
    await this.delay();
    return this.store.hospitals.filter(h => h.specialties.includes(specialtyId) && h.active);
  }

  async updateHospital(id: string, updates: Partial<Hospital>): Promise<Hospital> {
    await this.delay();
    const idx = this.store.hospitals.findIndex(h => h.id === id);
    if (idx === -1) throw new Error('Hospital not found');
    const updated = { ...this.store.hospitals[idx], ...updates };
    this.store.hospitals[idx] = updated;
    this.save();
    return updated;
  }

  async createHospital(hospital: Omit<Hospital, 'id'>): Promise<Hospital> {
    await this.delay();
    const newHospital: Hospital = {
      ...hospital,
      id: `hosp-${Date.now()}`,
    };
    this.store.hospitals.unshift(newHospital);
    this.save();
    return newHospital;
  }

  // ── Specialties ────────────────────────────────────────────────────────────
  async getSpecialties(): Promise<Specialty[]> {
    await this.delay();
    return [...this.store.specialties];
  }

  async getSpecialtyById(id: string): Promise<Specialty | null> {
    await this.delay();
    return this.store.specialties.find(s => s.id === id) ?? null;
  }

  async getFeaturedSpecialties(): Promise<Specialty[]> {
    await this.delay();
    return this.store.specialties.filter(s => s.featured);
  }

  async updateSpecialty(id: string, updates: Partial<Specialty>): Promise<Specialty> {
    await this.delay();
    const idx = this.store.specialties.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Specialty not found');
    const updated = { ...this.store.specialties[idx], ...updates };
    this.store.specialties[idx] = updated;
    this.save();
    return updated;
  }

  // ── Doctors (The 7 Ecosystem Specialists) ──────────────────────────────────
  async getDoctors(): Promise<Doctor[]> {
    await this.delay();
    return [...this.store.doctors];
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    await this.delay();
    return this.store.doctors.find(d => d.id === id) ?? null;
  }

  async getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {
    await this.delay();
    return this.store.doctors.filter(d => d.specialties.includes(specialtyId));
  }

  async getDoctorsByHospital(hospitalId: string): Promise<Doctor[]> {
    await this.delay();
    return this.store.doctors.filter(d => d.hospitalId === hospitalId);
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    await this.delay();
    const idx = this.store.doctors.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Doctor not found');
    const updated = { ...this.store.doctors[idx], ...updates };
    this.store.doctors[idx] = updated;
    this.save();
    return updated;
  }

  // ── Case Studies ───────────────────────────────────────────────────────────
  async getCaseStudies(): Promise<CaseStudy[]> {
    await this.delay();
    return [...this.store.caseStudies];
  }

  async getCaseStudyById(id: string): Promise<CaseStudy | null> {
    await this.delay();
    return this.store.caseStudies.find(c => c.id === id) ?? null;
  }

  async getFeaturedCaseStudies(): Promise<CaseStudy[]> {
    await this.delay();
    return this.store.caseStudies.filter(c => c.featured);
  }

  async getCaseStudiesBySpecialty(specialtyId: string): Promise<CaseStudy[]> {
    await this.delay();
    return this.store.caseStudies.filter(c => c.specialtyId === specialtyId);
  }

  async updateCaseStudy(id: string, updates: Partial<CaseStudy>): Promise<CaseStudy> {
    await this.delay();
    const idx = this.store.caseStudies.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Case study not found');
    const updated = { ...this.store.caseStudies[idx], ...updates };
    this.store.caseStudies[idx] = updated;
    this.save();
    return updated;
  }

  // ── Inquiries ──────────────────────────────────────────────────────────────
  async getInquiries(): Promise<Inquiry[]> {
    await this.delay();
    return [...this.store.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getInquiryById(id: string): Promise<Inquiry | null> {
    await this.delay();
    return this.store.inquiries.find(i => i.id === id) ?? null;
  }

  async createInquiry(
    data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'notes' | 'documents'>
  ): Promise<Inquiry> {
    const lastSubmission = parseInt(localStorage.getItem('med360_last_inquiry_time') || '0', 10);
    if (Date.now() - lastSubmission < 10000) { // 10s rate limit for responsiveness
      throw new Error('Please wait a few seconds before submitting another inquiry.');
    }
    localStorage.setItem('med360_last_inquiry_time', Date.now().toString());

    await this.delay();
    const now = new Date().toISOString();
    const newInquiry: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      status: 'new',
      documents: [],
      notes: [],
    };
    this.store.inquiries.unshift(newInquiry);
    this.save();
    return newInquiry;
  }

  async updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    await this.delay();
    const idx = this.store.inquiries.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    const updated = { ...this.store.inquiries[idx], status, updatedAt: new Date().toISOString() };
    this.store.inquiries[idx] = updated;
    this.save();
    return updated;
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
    
    this.store.cms[id] = {
      ...base,
      content: { ...base.content, ...content }
    };
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

  async getInquiryStats() {
    const inquiries = this.store.inquiries;
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
}

// ─── Singleton Export ─────────────────────────────────────────────────────────
export const mockEngine = new MockEngine();
