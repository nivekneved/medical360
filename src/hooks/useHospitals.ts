import { useMemo } from 'react';
import type { Hospital } from '../core/types';
import { filterHospitals, type HospitalFilters } from '../core/services/hospital.service';
import { useEntityCollection, useEntityItem } from './useEntity';

export function useHospitals(filters?: HospitalFilters) {
  const filterFn = useMemo(() => {
    if (!filters) return undefined;
    return (h: Hospital) => filterHospitals([h], filters).length > 0;
  }, [JSON.stringify(filters)]); // eslint-disable-line

  const { data: hospitals, loading, error, refetch, setData: setHospitals } = useEntityCollection('hospitals', {
    filterFn,
  });

  return { hospitals, loading, error, refetch, setHospitals };
}

export function useFeaturedHospitals() {
  const filterFn = useMemo(() => (h: Hospital) => !!(h.featured && h.active), []);
  const { data: hospitals, loading } = useEntityCollection('hospitals', { filterFn });
  return { hospitals, loading };
}

export function useHospital(id: string | undefined) {
  const { item: hospital, loading, error, refetch, setItem: setHospital } = useEntityItem('hospitals', id);
  return { hospital, loading, error, refetch, setHospital };
}
