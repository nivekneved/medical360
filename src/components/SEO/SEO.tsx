import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SITE_URL, SITE_NAME } from '../../core/config/site';
import { SEOPageKey, getPageSEO } from '../../core/config/seo.config';
import { getBreadcrumbSchema } from '../../core/services/schema.service';

export interface SEOProps {
  /** Optional key to load defaults from the centralized SEO registry */
  pageKey?: SEOPageKey;
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  keywords?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
  breadcrumbs?: Array<{ name: string; path: string }>;
  noIndex?: boolean;
}

export function SEO({
  pageKey,
  title: overrideTitle,
  description: overrideDesc,
  canonical: overrideCanonical,
  type: overrideType,
  image: overrideImage,
  keywords: overrideKeywords,
  schema,
  breadcrumbs,
  noIndex: overrideNoIndex,
}: SEOProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // 1. Resolve registry defaults if pageKey provided
  const registryDefaults = useMemo(() => {
    if (!pageKey) return null;
    return getPageSEO(pageKey, currentLang);
  }, [pageKey, currentLang]);

  // 2. Computed values with overrides
  const rawTitle = overrideTitle || registryDefaults?.title || `${SITE_NAME} | Patient-Centric Healthcare`;
  const cleanTitle = rawTitle.includes(SITE_NAME) ? rawTitle : `${rawTitle} | ${SITE_NAME}`;

  const description = overrideDesc || registryDefaults?.description || `${SITE_NAME} patient navigation & hospital coordination.`;

  const canonicalPath = overrideCanonical !== undefined ? overrideCanonical : (registryDefaults?.canonical ?? '');
  const cleanPath = canonicalPath ? (canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`) : '';
  const canonicalUrl = `${SITE_URL}${cleanPath || '/'}`;

  const rawImage = overrideImage || registryDefaults?.image || `${SITE_URL}/assets/hero-banner.jpg`;
  const fullImageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_URL}${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;

  const noIndex = overrideNoIndex !== undefined ? overrideNoIndex : (registryDefaults?.noIndex ?? false);
  const ogType = overrideType || registryDefaults?.ogType || 'website';
  const keywords = overrideKeywords || registryDefaults?.keywords;

  // 3. Assemble JSON-LD Schemas
  const combinedSchemas = useMemo(() => {
    const list: Array<Record<string, any>> = [];
    if (schema) {
      if (Array.isArray(schema)) {
        list.push(...schema);
      } else {
        list.push(schema);
      }
    }
    if (breadcrumbs && breadcrumbs.length > 0) {
      list.push(getBreadcrumbSchema(breadcrumbs));
    }
    return list;
  }, [schema, breadcrumbs]);

  useEffect(() => {
    // Dynamic lang attribute on <html> element
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <Helmet>
      {/* ── 1. Standard Search Engine Metadata ── */}
      <title>{cleanTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* ── 2. Robots Directives ── */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* ── 3. Multi-Lingual Hreflang Alternates ── */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="kr" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* ── 4. Open Graph Protocol (Facebook, WhatsApp, LinkedIn) ── */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={cleanTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={cleanTitle} />
      <meta
        property="og:locale"
        content={currentLang === 'fr' ? 'fr_FR' : currentLang === 'kr' ? 'mfe_MU' : 'en_US'}
      />
      <meta property="og:locale:alternate" content="fr_FR" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* ── 5. Twitter Card Protocol ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Med360Mu" />
      <meta name="twitter:creator" content="@Med360Mu" />
      <meta name="twitter:title" content={cleanTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* ── 6. Schema.org JSON-LD Structured Data ── */}
      {combinedSchemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

export * from '../../core/config/seo.config';
