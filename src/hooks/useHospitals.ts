import { useState, useEffect, useCallback } from 'react';
import type { Hospital } from '../core/types';
import { mockEngine } from '../core/mock/engine';
import { filterHospitals, type HospitalFilters } from '../core/services/hospital.service';

export function useHospitals(filters?: HospitalFilters) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
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
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    mockEngine.getFeaturedHospitals().then(setHospitals).finally(() => setLoading(false));
  }, []);

  return { hospitals, loading };
}

export function useHospital(id: string | undefined) {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    mockEngine.getHospitalById(id)
      .then(setHospital)
      .catch(() => setError('Hospital not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  return { hospital, loading, error };
}
