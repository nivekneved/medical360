import { useMemo } from 'react';
import type { CaseStudy } from '../core/types';
import { useEntityCollection, useEntityItem } from './useEntity';

export function useCaseStudies() {
  const { data: caseStudies, loading, error, refetch, setData: setCaseStudies } = useEntityCollection('caseStudies');
  return { caseStudies, loading, error, refetch, setCaseStudies };
}

export function useFeaturedCaseStudies() {
  const filterFn = useMemo(() => (c: CaseStudy) => !!c.featured, []);
  const { data: caseStudies, loading, error, refetch } = useEntityCollection('caseStudies', { filterFn });
  return { caseStudies, loading, error, refetch };
}

export function useCaseStudy(id: string | undefined) {
  const { item: caseStudy, loading, error, refetch, setItem: setCaseStudy } = useEntityItem('caseStudies', id);
  return { caseStudy, loading, error, refetch, setCaseStudy };
}
