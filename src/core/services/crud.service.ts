/**
 * Med360 — Centralized Universal Entity CRUD Engine
 * 
 * Unifies all Create, Read, Update, and Delete operations for any entity
 * (Hospitals, Doctors, Specialties, Case Studies, Inquiries) under a single,
 * type-safe, cache-optimized, and audit-logged architecture.
 */

import type { Hospital, Specialty, Doctor, CaseStudy, Inquiry } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import {
  mapHospitalRow,
  mapSpecialtyRow,
  mapDoctorRow,
  mapCaseStudyRow,
  mapInquiryRow,
} from '../supabase/repositories';
import { cacheService } from './cache.service';
import { deepSanitize } from './security.service';
import { logSecurityEvent } from './audit.service';
import {
  loadStore,
  saveStore,
  type MockStore,
} from '../mock/store';

export type EntityCollection = 'hospitals' | 'specialties' | 'doctors' | 'caseStudies' | 'inquiries';

export interface EntityTypeMap {
  hospitals: Hospital;
  specialties: Specialty;
  doctors: Doctor;
  caseStudies: CaseStudy;
  inquiries: Inquiry;
}

interface CollectionConfig<T> {
  tableName: string;
  idPrefix: string;
  mapRow: (row: any) => T;
  toRow?: (data: any, id: string) => any;
  cacheTtlMs: number;
}

const COLLECTION_REGISTRY: { [K in EntityCollection]: CollectionConfig<EntityTypeMap[K]> } = {
  hospitals: {
    tableName: 'hospitals',
    idPrefix: 'hosp',
    mapRow: mapHospitalRow,
    cacheTtlMs: 10 * 60 * 1000,
    toRow: (h: Partial<Hospital>, id: string) => ({
      id,
      name: h.name,
      name_fr: h.name_fr || null,
      name_kr: h.name_kr || null,
      city: h.city,
      country: h.country,
      description: h.description,
      image_url: h.imageUrl,
      gallery: h.gallery || [],
      accreditations: h.accreditations || [],
      specialties: h.specialties || [],
      beds_count: h.bedsCount || 0,
      icu_beds: h.icuBeds || 0,
      founded_year: h.foundedYear || 2000,
      rating: h.rating || 4.8,
      review_count: h.reviewCount || 0,
      international_patients_per_year: h.internationalPatientsPerYear || 0,
      languages: h.languages || ['English', 'French'],
      website: h.website || null,
      contact_email: h.contactEmail || null,
      contact_phone: h.contactPhone || null,
      featured: !!h.featured,
      active: h.active !== false,
      updated_at: new Date().toISOString(),
    }),
  },
  specialties: {
    tableName: 'specialties',
    idPrefix: 'sp',
    mapRow: mapSpecialtyRow,
    cacheTtlMs: 15 * 60 * 1000,
    toRow: (s: Partial<Specialty>, id: string) => ({
      ...s,
      id,
      updated_at: new Date().toISOString(),
    }),
  },
  doctors: {
    tableName: 'doctors',
    idPrefix: 'doc',
    mapRow: mapDoctorRow,
    cacheTtlMs: 10 * 60 * 1000,
    toRow: (d: Partial<Doctor>, id: string) => ({
      ...d,
      id,
      updated_at: new Date().toISOString(),
    }),
  },
  caseStudies: {
    tableName: 'case_studies',
    idPrefix: 'cs',
    mapRow: mapCaseStudyRow,
    cacheTtlMs: 10 * 60 * 1000,
    toRow: (c: Partial<CaseStudy>, id: string) => ({
      ...c,
      id,
      updated_at: new Date().toISOString(),
    }),
  },
  inquiries: {
    tableName: 'inquiries',
    idPrefix: 'inq',
    mapRow: mapInquiryRow,
    cacheTtlMs: 60 * 1000,
    toRow: (i: Partial<Inquiry>, id: string) => ({
      id,
      first_name: i.firstName,
      last_name: i.lastName,
      email: i.email,
      phone: i.phone,
      country_of_residence: i.countryOfResidence,
      specialty_id: i.specialtyId,
      description: i.description,
      urgency: i.urgency || 'routine',
      preferred_country: i.preferredCountry || null,
      budget_min: i.budgetRangeUSD?.min || null,
      budget_max: i.budgetRangeUSD?.max || null,
      documents: i.documents || [],
      status: i.status || 'new',
      assigned_case_manager_id: i.assignedCaseManagerId || null,
      notes: i.notes || [],
      created_at: i.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  },
};

class CentralizedCrudEngine {
  private store: MockStore;

  constructor() {
    this.store = loadStore();
  }

  private getStoreArray<K extends EntityCollection>(collection: K): EntityTypeMap[K][] {
    return this.store[collection] as unknown as EntityTypeMap[K][];
  }

  private save(): void {
    saveStore(this.store);
  }

  /**
   * 1. GET ALL: Unified retrieval of any collection with SingleFlight & L1/L2 Caching
   */
  async getAll<K extends EntityCollection>(collection: K): Promise<EntityTypeMap[K][]> {
    const cfg = COLLECTION_REGISTRY[collection];
    return cacheService.cachedFetch(
      `${collection}:all`,
      async () => {
        if (isSupabaseConfigured) {
          try {
            const { data, error } = await supabase.from(cfg.tableName).select('*').order('created_at', { ascending: false });
            if (!error && data && data.length > 0) {
              return data.map(cfg.mapRow) as EntityTypeMap[K][];
            }
          } catch (e) {
            console.warn(`Supabase getAll(${collection}) failed, falling back to local store:`, e);
          }
        }
        return [...this.getStoreArray(collection)];
      },
      { ttlMs: cfg.cacheTtlMs, tags: [collection], persist: true }
    );
  }

  /**
   * 2. GET BY ID: Unified single-entity lookup with zero-query in-memory derived resolution
   */
  async getById<K extends EntityCollection>(collection: K, id: string): Promise<EntityTypeMap[K] | null> {
    const cfg = COLLECTION_REGISTRY[collection];

    // Zero-query derived resolution from master cache
    const cachedAll = cacheService.peek<EntityTypeMap[K][]>(`${collection}:all`);
    if (cachedAll) {
      const match = cachedAll.find((item: any) => item.id === id || item.slug === id);
      if (match) return match;
    }

    return cacheService.cachedFetch(
      `${collection}:${id}`,
      async () => {
        if (isSupabaseConfigured) {
          try {
            const { data, error } = await supabase.from(cfg.tableName).select('*').eq('id', id).single();
            if (!error && data) return cfg.mapRow(data) as EntityTypeMap[K];
          } catch (e) {
            console.warn(`Supabase getById(${collection}, ${id}) failed:`, e);
          }
        }
        const items = this.getStoreArray(collection);
        return items.find((item: any) => item.id === id || item.slug === id) ?? null;
      },
      { ttlMs: cfg.cacheTtlMs, tags: [collection] }
    );
  }

  /**
   * 3. CREATE: Unified entity creation with automatic sanitization, ID generation, and cache invalidation
   */
  async create<K extends EntityCollection>(
    collection: K,
    data: Omit<EntityTypeMap[K], 'id'> & { id?: string }
  ): Promise<EntityTypeMap[K]> {
    const cfg = COLLECTION_REGISTRY[collection];
    const cleanData = deepSanitize(data) as any;
    const id = cleanData.id || `${cfg.idPrefix}-${Date.now()}`;
    const newEntity = { ...cleanData, id } as EntityTypeMap[K];

    cacheService.invalidateTag(collection);

    if (isSupabaseConfigured && cfg.toRow) {
      try {
        const row = cfg.toRow(newEntity, id);
        const { data: resData, error } = await supabase.from(cfg.tableName).insert([row]).select().single();
        if (!error && resData) {
          const mapped = cfg.mapRow(resData) as EntityTypeMap[K];
          (this.store[collection] as any).unshift(mapped);
          this.save();
          logSecurityEvent('CMS_EDIT', `Created ${collection} entity: ${id}`);
          return mapped;
        }
      } catch (e) {
        console.warn(`Supabase create(${collection}) failed, using local store:`, e);
      }
    }

    (this.store[collection] as any).unshift(newEntity);
    this.save();
    logSecurityEvent('CMS_EDIT', `Created ${collection} entity: ${id}`);
    return newEntity;
  }

  /**
   * 4. UPDATE: Unified entity update with tag-based cache invalidation and live sync
   */
  async update<K extends EntityCollection>(
    collection: K,
    id: string,
    updates: Partial<EntityTypeMap[K]>
  ): Promise<EntityTypeMap[K]> {
    const cfg = COLLECTION_REGISTRY[collection];
    const cleanUpdates = deepSanitize(updates);

    cacheService.invalidateTag(collection);

    if (isSupabaseConfigured) {
      try {
        const rowUpdates = { ...cleanUpdates, updated_at: new Date().toISOString() };
        const { data, error } = await supabase.from(cfg.tableName).update(rowUpdates).eq('id', id).select().single();
        if (!error && data) {
          const mapped = cfg.mapRow(data) as EntityTypeMap[K];
          const items = this.store[collection] as any[];
          const idx = items.findIndex(i => i.id === id);
          if (idx !== -1) items[idx] = mapped;
          this.save();
          logSecurityEvent('CMS_EDIT', `Updated ${collection} entity: ${id}`);
          return mapped;
        }
      } catch (e) {
        console.warn(`Supabase update(${collection}) failed:`, e);
      }
    }

    const items = this.store[collection] as any[];
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`${collection} entity ${id} not found`);
    const updated = { ...items[idx], ...cleanUpdates, updatedAt: new Date().toISOString() };
    items[idx] = updated;
    this.save();
    logSecurityEvent('CMS_EDIT', `Updated ${collection} entity: ${id}`);
    return updated as EntityTypeMap[K];
  }

  /**
   * 5. DELETE: Unified single or batch deletion
   */
  async delete<K extends EntityCollection>(collection: K, idOrIds: string | string[]): Promise<boolean> {
    const cfg = COLLECTION_REGISTRY[collection];
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];

    cacheService.invalidateTag(collection);

    if (isSupabaseConfigured) {
      try {
        await supabase.from(cfg.tableName).delete().in('id', ids);
      } catch (e) {
        console.warn(`Supabase delete(${collection}) failed:`, e);
      }
    }

    const idSet = new Set(ids);
    (this.store[collection] as any) = (this.store[collection] as any[]).filter(i => !idSet.has(i.id));
    this.save();
    logSecurityEvent('CMS_EDIT', `Deleted ${ids.length} entity(ies) from ${collection}`);
    return true;
  }
}

export const crudService = new CentralizedCrudEngine();
