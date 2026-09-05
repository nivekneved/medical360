import { useMemo } from 'react';
import type { Doctor } from '../core/types';
import { useEntityCollection, useEntityItem } from './useEntity';

export function useDoctors(specialtyId?: string, hospitalId?: string) {
  const filterFn = useMemo(() => {
    if (specialtyId) {
      return (d: Doctor) => (d.specialties || []).includes(specialtyId);
    }
    if (hospitalId) {
      return (d: Doctor) => (d.hospitalIds || (d.hospitalId ? [d.hospitalId] : [])).includes(hospitalId);
    }
    return undefined;
  }, [specialtyId, hospitalId]);

  const { data: doctors, loading, error, refetch, setData: setDoctors } = useEntityCollection('doctors', {
    filterFn,
  });

  return { doctors, loading, error, refetch, setDoctors };
}

export function useDoctor(id?: string) {
  const { item: doctor, loading, error, refetch, setItem: setDoctor } = useEntityItem('doctors', id);
  return { doctor, loading, error, refetch, setDoctor };
}
