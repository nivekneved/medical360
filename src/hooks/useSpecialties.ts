import { useMemo } from 'react';
import type { Specialty } from '../core/types';
import { useEntityCollection, useEntityItem } from './useEntity';

export function useSpecialties() {
  const { data: specialties, loading, error, refetch, setData: setSpecialties } = useEntityCollection('specialties');
  return { specialties, loading, error, refetch, setSpecialties };
}

export function useFeaturedSpecialties() {
  const filterFn = useMemo(() => (s: Specialty) => !!s.featured, []);
  const { data: specialties, loading } = useEntityCollection('specialties', { filterFn });
  return { specialties, loading };
}

export function useSpecialty(id: string | undefined) {
  const { item: specialty, loading, error, refetch, setItem: setSpecialty } = useEntityItem('specialties', id);
  return { specialty, loading, error, refetch, setSpecialty };
}
