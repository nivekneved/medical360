import type { MockConfig, Inquiry, InquiryStatus } from '../types';
import { hospitalsSeed } from './seeds/hospitals.seed';
import { specialtiesSeed } from './seeds/specialties.seed';
import { caseStudiesSeed } from './seeds/case-studies.seed';
import { inquiriesSeed } from './seeds/inquiries.seed';

// ─── Default Config ──────────────────────────────────────────────────────────
const DEFAULT_CONFIG: MockConfig = {
  enabled: true,
  latency: 'normal',
  errorRate: 0,
};

const STORAGE_KEY = 'med360_mock_store';
const CONFIG_KEY  = 'med360_mock_config';

// ─── Latency Simulator ───────────────────────────────────────────────────────
function getLatencyMs(latency: MockConfig['latency']): number {
  const map = { instant: 0, normal: 350, slow: 1200 };
  return map[latency];
}

function simulateDelay(ms: number): Promise<void> {
  if (ms === 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Store Shape ─────────────────────────────────────────────────────────────
interface MockStore {
  hospitals: typeof hospitalsSeed;
  specialties: typeof specialtiesSeed;
  caseStudies: typeof caseStudiesSeed;
  inquiries: Inquiry[];
}

function loadStore(): MockStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as MockStore;
      // Sync fresh seeds for specialties and hospitals so image updates reflect immediately
      parsed.specialties = specialtiesSeed;
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return {
    hospitals: hospitalsSeed,
    specialties: specialtiesSeed,
    caseStudies: caseStudiesSeed,
    inquiries: inquiriesSeed,
  };
}

function saveStore(store: MockStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage errors (e.g. private mode)
  }
}

function resetStore(): MockStore {
  const fresh: MockStore = {
    hospitals: hospitalsSeed,
    specialties: specialtiesSeed,
    caseStudies: caseStudiesSeed,
    inquiries: inquiriesSeed,
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
  async getHospitals() {
    await this.delay();
    return [...this.store.hospitals.filter(h => h.active)];
  }

  async getHospitalById(id: string) {
    await this.delay();
    return this.store.hospitals.find(h => h.id === id) ?? null;
  }

  async getFeaturedHospitals() {
    await this.delay();
    return this.store.hospitals.filter(h => h.featured && h.active);
  }

  async getHospitalsBySpecialty(specialtyId: string) {
    await this.delay();
    return this.store.hospitals.filter(h => h.specialties.includes(specialtyId) && h.active);
  }

  // ── Specialties ────────────────────────────────────────────────────────────
  async getSpecialties() {
    await this.delay();
    return [...this.store.specialties];
  }

  async getSpecialtyById(id: string) {
    await this.delay();
    return this.store.specialties.find(s => s.id === id) ?? null;
  }

  async getFeaturedSpecialties() {
    await this.delay();
    return this.store.specialties.filter(s => s.featured);
  }

  // ── Case Studies ───────────────────────────────────────────────────────────
  async getCaseStudies() {
    await this.delay();
    return [...this.store.caseStudies];
  }

  async getCaseStudyById(id: string) {
    await this.delay();
    return this.store.caseStudies.find(c => c.id === id) ?? null;
  }

  async getFeaturedCaseStudies() {
    await this.delay();
    return this.store.caseStudies.filter(c => c.featured);
  }

  async getCaseStudiesBySpecialty(specialtyId: string) {
    await this.delay();
    return this.store.caseStudies.filter(c => c.specialtyId === specialtyId);
  }

  // ── Inquiries ──────────────────────────────────────────────────────────────
  async getInquiries() {
    await this.delay();
    return [...this.store.inquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getInquiryById(id: string) {
    await this.delay();
    return this.store.inquiries.find(i => i.id === id) ?? null;
  }

  async createInquiry(
    data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'notes' | 'documents'>
  ): Promise<Inquiry> {
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

  async updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry | null> {
    await this.delay();
    const inquiry = this.store.inquiries.find(i => i.id === id);
    if (!inquiry) return null;
    inquiry.status = status;
    inquiry.updatedAt = new Date().toISOString();
    this.save();
    return { ...inquiry };
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
