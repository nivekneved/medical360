import { useState, useEffect } from 'react';
import type { CaseStudy } from '../core/types';
import { mockEngine } from '../core/mock/engine';

export function useCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    mockEngine.getCaseStudies().then(setCaseStudies).finally(() => setLoading(false));
  }, []);

  return { caseStudies, loading };
}

export function useFeaturedCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    mockEngine.getFeaturedCaseStudies().then(setCaseStudies).finally(() => setLoading(false));
  }, []);

  return { caseStudies, loading };
}
