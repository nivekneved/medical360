import { useState, useEffect } from 'react';
import { mockEngine } from '../core/mock/engine';
import type { CmsPage } from '../core/mock/seeds/cms.seed';

export function useCMS(pageId: string) {
  const [data, setData] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    mockEngine.getCmsPage(pageId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [pageId]);

  return { data, loading, reload: load };
}
