import { useState, useEffect } from 'react';
import { mockEngine } from '../core/mock/engine';
import type { CmsPage } from '../core/mock/seeds/cms.seed';
import { cacheService } from '../core/services/cache.service';

export function useCMS(pageId: string) {
  const cached = cacheService.peek<CmsPage>(`cms:${pageId}`);
  const [data, setData]       = useState<CmsPage | null>(cached);
  const [loading, setLoading] = useState(!cached);

  function load() {
    if (!cacheService.peek<CmsPage>(`cms:${pageId}`)) {
      setLoading(true);
    }
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
