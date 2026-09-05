import type { MockConfig, Inquiry, Hospital, Specialty, Doctor, CaseStudy } from '../types';
import { hospitalsSeed } from './seeds/hospitals.seed';
import { specialtiesSeed } from './seeds/specialties.seed';
import { doctorsSeed } from './seeds/doctors.seed';
import { caseStudiesSeed } from './seeds/case-studies.seed';
import { inquiriesSeed } from './seeds/inquiries.seed';
import { cmsSeed, CmsPage } from './seeds/cms.seed';

export const DEFAULT_CONFIG: MockConfig = {
  enabled: false, // 100% Live Supabase Database
  latency: 'instant',
  errorRate: 0,
};

export const STORAGE_KEY = 'med360_mock_store_v4';
export const CONFIG_KEY = 'med360_mock_config';

export function getLatencyMs(latency: MockConfig['latency']): number {
  const map = { instant: 0, normal: 300, slow: 1000 };
  return map[latency];
}

export function simulateDelay(ms: number): Promise<void> {
  if (ms === 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mergeCms(seed: Record<string, CmsPage>, existing: Record<string, CmsPage>): Record<string, CmsPage> {
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

export interface MockStore {
  hospitals: Hospital[];
  specialties: Specialty[];
  doctors: Doctor[];
  caseStudies: CaseStudy[];
  inquiries: Inquiry[];
  cms: Record<string, CmsPage>;
}

export function loadStore(): MockStore {
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

export function saveStore(store: MockStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage errors
  }
}

export function resetStore(): MockStore {
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
