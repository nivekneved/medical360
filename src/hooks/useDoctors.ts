import { useState, useEffect, useCallback } from 'react';
import { mockEngine } from '../core/mock/engine';
import type { Doctor } from '../core/types';

export function useDoctors(specialtyId?: string, hospitalId?: string) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
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
  const [doctor, setDoctor]   = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setDoctor(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    mockEngine.getDoctorById(id)
      .then(setDoctor)
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { doctor, loading, error };
}
