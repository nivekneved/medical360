import { useState, useEffect, useCallback } from 'react';
import type { Hospital } from '../core/types';
import { mockEngine } from '../core/mock/engine';
import { filterHospitals, type HospitalFilters } from '../core/services/hospital.service';
import { cacheService } from '../core/services/cache.service';

export function useHospitals(filters?: HospitalFilters) {
  const cached = cacheService.peek<Hospital[]>('hospitals:all');
  const initialData = cached ? (filters ? filterHospitals(cached, filters) : cached) : [];
  const [hospitals, setHospitals] = useState<Hospital[]>(initialData);
  const [loading, setLoading]     = useState(!cached);
  const [error, setError]         = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!cacheService.peek<Hospital[]>('hospitals:all')) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await mockEngine.getHospitals();
      setHospitals(filters ? filterHospitals(data, filters) : data);
    } catch {
      setError('Failed to load hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);
  return { hospitals, loading, error, refetch: load };
}

export function useFeaturedHospitals() {
  const cachedAll = cacheService.peek<Hospital[]>('hospitals:all');
  const cachedFeatured = cachedAll ? cachedAll.filter(h => h.featured && h.active) : null;
  const [hospitals, setHospitals] = useState<Hospital[]>(cachedFeatured || []);
  const [loading, setLoading]     = useState(!cachedFeatured);

  useEffect(() => {
    mockEngine.getFeaturedHospitals().then(setHospitals).finally(() => setLoading(false));
  }, []);

  return { hospitals, loading };
}

export function useHospital(id: string | undefined) {
  const cachedAll = cacheService.peek<Hospital[]>('hospitals:all');
  const cachedSingle = cachedAll ? (cachedAll.find(h => h.id === id || h.slug === id) || null) : null;
  const [hospital, setHospital] = useState<Hospital | null>(cachedSingle);
  const [loading, setLoading]   = useState(!cachedSingle);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    if (!cachedSingle) setLoading(true);
    mockEngine.getHospitalById(id)
      .then(setHospital)
      .catch(() => setError('Hospital not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  return { hospital, loading, error };
}
