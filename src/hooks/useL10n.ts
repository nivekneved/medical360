import { useTranslation } from 'react-i18next';

export type SupportedLanguage = 'en' | 'fr' | 'kr' | 'cre';

/**
 * Centralized localization hook for Med360.
 * Provides unified multi-lingual string selection and localized entity field extraction.
 */
export function useL10n() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.language || 'en') as SupportedLanguage;

  const isFr = lang === 'fr';
  const isKr = lang === 'kr' || lang === 'cre';
  const isEn = !isFr && !isKr;

  /**
   * Selects the appropriate localized string based on the active language.
   * Order: French, Kreol, English (fallback).
   */
  const l10n = (fr: string, kr: string, en: string): string => {
    if (isFr) return fr;
    if (isKr) return kr;
    return en;
  };

  /**
   * Extracts localized field value from an entity object (e.g., name_fr, name_kr, or fallback name).
   */
  const l = <T extends Record<string, any>>(obj: T | undefined | null, field: string): string => {
    if (!obj) return '';
    const localizedKey = `${field}_${lang}`;
    return (obj as any)[localizedKey] || (obj as any)[field] || '';
  };

  return {
    i18n,
    t,
    lang,
    isFr,
    isKr,
    isEn,
    l10n,
    l,
  };
}
