import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  schema?: Record<string, any>;
}

export function SEO({
  title,
  description,
  canonical,
  type = 'website',
  image = 'https://medical360.com/og-image.jpg',
  schema,
}: SEOProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  
  const siteName = 'Medical 360';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const url = canonical ? `https://medical360.com${canonical}` : 'https://medical360.com';

  useEffect(() => {
    // Dynamic lang update on the HTML tag
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={url} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
