import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
  noIndex?: boolean;
}

const PRODUCTION_DOMAIN = 'https://medical360-zeta.vercel.app';

export function SEO({
  title,
  description,
  canonical = '',
  type = 'website',
  image = `${PRODUCTION_DOMAIN}/assets/banners/home_banner.jpg`,
  schema,
  noIndex = false,
}: SEOProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const siteName = 'Med360';
  const cleanTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const cleanPath = canonical ? (canonical.startsWith('/') ? canonical : `/${canonical}`) : '';
  const canonicalUrl = `${PRODUCTION_DOMAIN}${cleanPath}`;
  const fullImageUrl = image.startsWith('http') ? image : `${PRODUCTION_DOMAIN}${image.startsWith('/') ? image : `/${image}`}`;

  useEffect(() => {
    // Dynamic lang attribute on <html> element
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <Helmet>
      {/* ── 1. Standard Search Engine Metadata ── */}
      <title>{cleanTitle}</title>
      <meta name="description" content={description} />
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
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={cleanTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={cleanTitle} />
      <meta property="og:locale" content={currentLang === 'fr' ? 'fr_FR' : currentLang === 'kr' ? 'mfe_MU' : 'en_US'} />
      <meta property="og:locale:alternate" content="fr_FR" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* ── 5. Twitter Card Protocol ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Medical360Mu" />
      <meta name="twitter:creator" content="@Medical360Mu" />
      <meta name="twitter:title" content={cleanTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* ── 6. Schema.org JSON-LD Structured Data ── */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
