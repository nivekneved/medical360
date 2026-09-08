import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Share2,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Eye,
  Layers,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import { SEO_PAGES, SEOPageKey, LocalizedMeta } from '../../../core/config/seo.config';
import { SITE_URL, SITE_NAME } from '../../../core/config/site';
import { useToast } from '../../../providers/ToastProvider';
import './AdminSEO.css';

const SEO_PAGE_LIST: Array<{ key: SEOPageKey; label: string; icon: string }> = [
  { key: 'home', label: 'Homepage', icon: '🏠' },
  { key: 'about', label: 'Our Story & About', icon: 'ℹ️' },
  { key: 'hospitals', label: 'Hospitals Directory', icon: '🏢' },
  { key: 'specialties', label: 'Specialties Directory', icon: '🩺' },
  { key: 'howItWorks', label: 'How It Works', icon: '🤝' },
  { key: 'services', label: 'Services Concierge', icon: '🧰' },
  { key: 'costCalculator', label: 'Cost Calculator', icon: '🧮' },
  { key: 'visaGuide', label: 'Medical Visa Guide', icon: '✈️' },
  { key: 'caseStudies', label: 'Patient Stories', icon: '📖' },
  { key: 'contact', label: 'Contact & Hotline', icon: '✉️' },
  { key: 'describeNeed', label: 'Describe Need Intake', icon: '📝' },
  { key: 'privacy', label: 'Privacy Policy', icon: '🔒' },
  { key: 'terms', label: 'Terms of Service', icon: '📜' },
  { key: 'cookies', label: 'Cookie Policy', icon: '🍪' },
  { key: 'medicalDisclaimer', label: 'Medical Disclaimer', icon: '⚕️' },
  { key: 'notFound', label: '404 Not Found', icon: '🚫' },
  { key: 'maintenance', label: 'Under Maintenance', icon: '🚧' },
];

const OVERRIDES_STORAGE_KEY = 'med360_seo_custom_overrides';

export function AdminSEOPage() {
  const toast = useToast();
  const [selectedKey, setSelectedKey] = useState<SEOPageKey>('home');
  const [activeLang, setActiveLang] = useState<'en' | 'fr' | 'kr'>('en');
  const [overrides, setOverrides] = useState<Record<string, any>>(() => {
    try {
      const stored = localStorage.getItem(OVERRIDES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const baseMeta: LocalizedMeta = SEO_PAGES[selectedKey] || SEO_PAGES.home;

  const currentMeta = {
    title: {
      en: overrides[selectedKey]?.title?.en ?? baseMeta.title.en,
      fr: overrides[selectedKey]?.title?.fr ?? baseMeta.title.fr,
      kr: overrides[selectedKey]?.title?.kr ?? baseMeta.title.kr,
    },
    description: {
      en: overrides[selectedKey]?.description?.en ?? baseMeta.description.en,
      fr: overrides[selectedKey]?.description?.fr ?? baseMeta.description.fr,
      kr: overrides[selectedKey]?.description?.kr ?? baseMeta.description.kr,
    },
    canonical: overrides[selectedKey]?.canonical ?? baseMeta.canonical,
    image: overrides[selectedKey]?.image ?? baseMeta.image ?? `${SITE_URL}/assets/hero-banner.jpg`,
    noIndex: overrides[selectedKey]?.noIndex ?? !!baseMeta.noIndex,
    keywords: {
      en: overrides[selectedKey]?.keywords?.en ?? baseMeta.keywords?.en?.join(', ') ?? '',
      fr: overrides[selectedKey]?.keywords?.fr ?? baseMeta.keywords?.fr?.join(', ') ?? '',
      kr: overrides[selectedKey]?.keywords?.kr ?? baseMeta.keywords?.kr?.join(', ') ?? '',
    },
  };

  const handleFieldChange = (field: string, val: any) => {
    setOverrides(prev => {
      const pageOv = prev[selectedKey] || {};
      if (field === 'title' || field === 'description' || field === 'keywords') {
        return {
          ...prev,
          [selectedKey]: {
            ...pageOv,
            [field]: {
              ...(pageOv[field] || baseMeta[field as 'title' | 'description'] || {}),
              [activeLang]: val,
            },
          },
        };
      }
      return {
        ...prev,
        [selectedKey]: {
          ...pageOv,
          [field]: val,
        },
      };
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
      toast.success(`SEO metadata for "${selectedKey}" saved successfully.`);
    } catch (err) {
      toast.error('Failed to save SEO overrides.');
    }
  };

  const handleReset = () => {
    const next = { ...overrides };
    delete next[selectedKey];
    setOverrides(next);
    try {
      localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(next));
      toast.info(`Reset "${selectedKey}" SEO metadata to default.`);
    } catch {}
  };

  const activeTitle = currentMeta.title[activeLang] || currentMeta.title.en;
  const activeDesc = currentMeta.description[activeLang] || currentMeta.description.en;
  const activeKeywords = typeof currentMeta.keywords[activeLang] === 'string'
    ? currentMeta.keywords[activeLang]
    : (currentMeta.keywords[activeLang] as string[] || []).join(', ');

  const titleLen = activeTitle.length;
  const descLen = activeDesc.length;

  return (
    <div className="admin-seo-container">
      {/* ── Top Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Globe size={24} color="var(--color-primary)" />
            SEO & Social Sharing Manager
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Configure Google search snippets, OpenGraph share banners, and localized metadata in English, French, and Kreol.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-outline"
            style={{ fontWeight: 700, gap: '0.4rem' }}
          >
            <RotateCcw size={15} />
            <span>Reset Page Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary"
            style={{ fontWeight: 700, gap: '0.4rem' }}
          >
            <Save size={16} />
            <span>Save SEO Changes</span>
          </button>
        </div>
      </div>

      <div className="admin-seo-layout">
        {/* ── Left Sidebar: Page Selector ── */}
        <aside className="admin-seo-sidebar">
          <div style={{ padding: '0.5rem 0.5rem 0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Page ({SEO_PAGE_LIST.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '70vh', overflowY: 'auto' }}>
            {SEO_PAGE_LIST.map((page) => {
              const hasCustom = Boolean(overrides[page.key]);
              const isSelected = selectedKey === page.key;
              return (
                <button
                  key={page.key}
                  type="button"
                  onClick={() => setSelectedKey(page.key)}
                  className={`admin-seo-page-btn ${isSelected ? 'admin-seo-page-btn--active' : ''}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{page.icon}</span>
                    <span>{page.label}</span>
                  </span>
                  {hasCustom && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }} />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Main Editor & Previews ── */}
        <div className="admin-seo-main">
          {/* Language Switcher Bar */}
          <div className="admin-seo-card" style={{ padding: '1.25rem 1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>Active Editing Language:</span>
                <div style={{ display: 'inline-flex', background: 'var(--color-bg)', padding: '3px', borderRadius: '9999px', border: '1px solid var(--color-border)' }}>
                  {(['en', 'fr', 'kr'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setActiveLang(l)}
                      style={{
                        background: activeLang === l ? 'var(--color-primary)' : 'transparent',
                        color: activeLang === l ? '#ffffff' : 'var(--color-text-secondary)',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '4px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'Kreol'}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                <span>Canonical Path:</span>
                <code style={{ background: 'var(--color-bg)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                  {currentMeta.canonical}
                </code>
              </div>
            </div>
          </div>

          {/* Form Fields Card */}
          <div className="admin-seo-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={18} color="var(--color-primary)" />
              Metadata Configuration ({activeLang.toUpperCase()})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Title Field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Page Meta Title ({activeLang.toUpperCase()})
                  </label>
                  <span className={`char-counter ${titleLen >= 50 && titleLen <= 65 ? 'char-counter--optimal' : titleLen > 70 ? 'char-counter--danger' : 'char-counter--warn'}`}>
                    {titleLen} / 60 chars {titleLen >= 50 && titleLen <= 65 ? '✓ Optimal' : ''}
                  </span>
                </div>
                <input
                  type="text"
                  value={activeTitle}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Description Field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Page Meta Description ({activeLang.toUpperCase()})
                  </label>
                  <span className={`char-counter ${descLen >= 130 && descLen <= 165 ? 'char-counter--optimal' : descLen > 175 ? 'char-counter--danger' : 'char-counter--warn'}`}>
                    {descLen} / 155 chars {descLen >= 130 && descLen <= 165 ? '✓ Optimal' : ''}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={activeDesc}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="input"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              {/* Keywords Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                  Meta Search Keywords ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={activeKeywords}
                  onChange={(e) => handleFieldChange('keywords', e.target.value)}
                  placeholder="e.g. medical tourism Mauritius, cardiac surgery India, oncology..."
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Image & Indexing Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                    Social Share Image URL (OpenGraph)
                  </label>
                  <input
                    type="text"
                    value={currentMeta.image}
                    onChange={(e) => handleFieldChange('image', e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
                    Robots Indexing Directive
                  </label>
                  <select
                    value={currentMeta.noIndex ? 'noindex' : 'index'}
                    onChange={(e) => handleFieldChange('noIndex', e.target.value === 'noindex')}
                    className="input"
                    style={{ width: '100%' }}
                  >
                    <option value="index">Index, Follow (Public Search Results)</option>
                    <option value="noindex">Noindex, Nofollow (Hidden / Private)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Live Simulator Previews */}
          <div className="admin-seo-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} color="var(--color-primary)" />
              Live Search Engine & Social Media Simulators
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 1rem' }}>
              Preview how this page appears to patients on Google Search and when shared via WhatsApp / Facebook.
            </p>

            <div className="admin-seo-previews-grid">
              {/* Google SERP Card */}
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8, color: 'var(--color-text-secondary)' }}>
                  🔍 Google Search Snippet Preview
                </span>
                <div className="serp-preview-box">
                  <div className="serp-preview__url">
                    <img src="/favicon.svg" alt="" style={{ width: 14, height: 14 }} />
                    <span>www.med360.mu {currentMeta.canonical !== '/' ? `› ${currentMeta.canonical.replace('/', '')}` : ''}</span>
                  </div>
                  <div className="serp-preview__title">
                    {activeTitle.includes(SITE_NAME) ? activeTitle : `${activeTitle} | ${SITE_NAME}`}
                  </div>
                  <p className="serp-preview__desc">
                    {activeDesc}
                  </p>
                </div>
              </div>

              {/* WhatsApp / Facebook Card */}
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 8, color: 'var(--color-text-secondary)' }}>
                  💬 WhatsApp / Social Media Share Card
                </span>
                <div className="social-preview-box">
                  <img
                    src={currentMeta.image.startsWith('http') ? currentMeta.image : `${SITE_URL}${currentMeta.image}`}
                    alt="Preview"
                    className="social-preview__image"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/hero-banner.jpg';
                    }}
                  />
                  <div className="social-preview__content">
                    <div className="social-preview__domain">med360.mu</div>
                    <div className="social-preview__title">
                      {activeTitle}
                    </div>
                    <p className="social-preview__desc">
                      {activeDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
