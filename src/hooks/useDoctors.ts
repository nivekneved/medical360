import { useState, useEffect, useCallback } from 'react';
import { mockEngine } from '../core/mock/engine';
import type { Doctor } from '../core/types';
import { cacheService } from '../core/services/cache.service';

export function useDoctors(specialtyId?: string, hospitalId?: string) {
  const cachedAll = cacheService.peek<Doctor[]>('doctors:all');
  let initialData: Doctor[] = [];
  if (cachedAll) {
    if (specialtyId) {
      initialData = cachedAll.filter(d => (d.specialties || []).includes(specialtyId));
    } else if (hospitalId) {
      initialData = cachedAll.filter(d => (d.hospitalIds || (d.hospitalId ? [d.hospitalId] : [])).includes(hospitalId));
    } else {
      initialData = cachedAll;
    }
  }

  const [doctors, setDoctors] = useState<Doctor[]>(initialData);
  const [loading, setLoading] = useState(!cachedAll);
  const [error, setError]     = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    if (!cacheService.peek<Doctor[]>('doctors:all')) {
      setLoading(true);
    }
    setError(null);
    try {
      let data: Doctor[];
      if (specialtyId) {
        data = await mockEngine.getDoctorsBySpecialty(specialtyId);
      } else if (hospitalId) {
        data = await mockEngine.getDoctorsByHospital(hospitalId);
      } else {
        data = await mockEngine.getDoctors();
      }
      setDoctors(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [specialtyId, hospitalId]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return { doctors, loading, error, refetch: fetchDoctors };
}

export function useDoctor(id?: string) {
  const cachedAll = cacheService.peek<Doctor[]>('doctors:all');
  const cachedSingle = cachedAll ? (cachedAll.find(d => d.id === id) || null) : null;
  const [doctor, setDoctor]   = useState<Doctor | null>(cachedSingle);
  const [loading, setLoading] = useState(!cachedSingle);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setDoctor(null);
      setLoading(false);
      return;
    }
    if (!cachedSingle) setLoading(true);
    mockEngine.getDoctorById(id)
      .then(setDoctor)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { doctor, loading, error };
}
