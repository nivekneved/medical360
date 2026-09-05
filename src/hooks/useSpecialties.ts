import { useState, useEffect } from 'react';
import type { Specialty } from '../core/types';
import { mockEngine } from '../core/mock/engine';
import { cacheService } from '../core/services/cache.service';

export function useSpecialties() {
  const cached = cacheService.peek<Specialty[]>('specialties:all');
  const [specialties, setSpecialties] = useState<Specialty[]>(cached || []);
  const [loading, setLoading]         = useState(!cached);

  useEffect(() => {
    mockEngine.getSpecialties().then(setSpecialties).finally(() => setLoading(false));
  }, []);

  return { specialties, loading };
}

export function useFeaturedSpecialties() {
  const cachedAll = cacheService.peek<Specialty[]>('specialties:all');
  const cachedFeatured = cachedAll ? cachedAll.filter(s => s.featured) : null;
  const [specialties, setSpecialties] = useState<Specialty[]>(cachedFeatured || []);
  const [loading, setLoading]         = useState(!cachedFeatured);

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
