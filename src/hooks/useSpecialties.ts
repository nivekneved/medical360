import { useState, useEffect } from 'react';
import type { Specialty } from '../core/types';
import { mockEngine } from '../core/mock/engine';

export function useSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    mockEngine.getSpecialties().then(setSpecialties).finally(() => setLoading(false));
  }, []);

  return { specialties, loading };
}

export function useFeaturedSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    mockEngine.getFeaturedSpecialties().then(setSpecialties).finally(() => setLoading(false));
  }, []);

  return { specialties, loading };
}

export function useSpecialty(id: string | undefined) {
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [loading, setLoading]     = useState(true);

  const fetchSpecialty = () => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    mockEngine.getSpecialtyById(id).then(setSpecialty).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSpecialty();
  }, [id]);

  return { specialty, loading, refetch: fetchSpecialty, setSpecialty };
}
