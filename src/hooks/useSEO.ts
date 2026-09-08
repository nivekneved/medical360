import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOPageKey, getPageSEO, SEO_PAGES } from '../core/config/seo.config';

/**
 * Hook to retrieve centralized localized SEO metadata for any page key.
 */
export function useSEO(pageKey?: SEOPageKey) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const metadata = useMemo(() => {
    if (!pageKey) return null;
    return getPageSEO(pageKey, currentLang);
  }, [pageKey, currentLang]);

  return {
    metadata,
    allPages: SEO_PAGES,
    lang: currentLang,
    getPageSEO: (key: SEOPageKey) => getPageSEO(key, currentLang),
  };
}
