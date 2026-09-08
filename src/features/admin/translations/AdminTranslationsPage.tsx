import React, { useState, useMemo } from 'react';
import {
  Languages,
  Search,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Globe2,
  FileText,
  Filter,
} from 'lucide-react';
import { useToast } from '../../../providers/ToastProvider';
import { auditService } from '../../../core/services/audit.service';
import './AdminTranslations.css';

interface TranslationEntry {
  key: string;
  category: 'header' | 'hero' | 'cta' | 'trust' | 'cost_calculator' | 'inquiry_form';
  en: string;
  fr: string;
  kr: string;
}

const INITIAL_DICTIONARY: TranslationEntry[] = [
  {
    key: 'hero_title',
    category: 'hero',
    en: 'World-Class Healthcare, Made Effortless for Mauritian Families.',
    fr: 'Des Soins Médicaux d’Excellence, Sans Souci pour les Familles Mauriciennes.',
    kr: 'Bann Meyor Swen Lasante Mondyal, San Traka pou Bann Fami Morisien.',
  },
  {
    key: 'hero_subtitle',
    category: 'hero',
    en: 'Connecting you directly to premier accredited hospitals in India with full travel and medical concierge support.',
    fr: 'Nous vous connectons directement aux meilleurs hôpitaux accrédités en Inde avec un accompagnement complet.',
    kr: 'Nou konekt zot direkt ar bann meyer lopital an Inde avek lasistans konple pou vwayaz ek tretman.',
  },
  {
    key: 'cta_find_care',
    category: 'cta',
    en: 'Describe Your Medical Need',
    fr: 'Décrivez Votre Besoin Médical',
    kr: 'Dekrir Zot Bezwin Lasante',
  },
  {
    key: 'cta_whatsapp_urgent',
    category: 'cta',
    en: 'Chat with Care Coordinator',
    fr: 'Discuter avec un Coordinateur',
    kr: 'Koz ar Nou Kordinater WhatsApp',
  },
  {
    key: 'trust_accredited',
    category: 'trust',
    en: 'JCI & NABH Accredited Hospital Network',
    fr: 'Réseau d’Hôpitaux Accrédités JCI & NABH',
    kr: 'Rezo Lopital Akredite JCI & NABH',
  },
  {
    key: 'trust_savings',
    category: 'trust',
    en: 'Save up to 80% on Complex Procedures',
    fr: 'Économisez jusqu’à 80% sur les interventions complexes',
    kr: 'Ekonemiz ziska 80% lor bann gran operasion',
  },
  {
    key: 'calc_compare_title',
    category: 'cost_calculator',
    en: 'Compare International Treatment Costs',
    fr: 'Comparez les Coûts des Traitements Internationaux',
    kr: 'Konpar Pri Tretman Internasional',
  },
  {
    key: 'inquiry_privacy_notice',
    category: 'inquiry_form',
    en: 'Your medical records are encrypted and protected under strict clinical confidentiality standards.',
    fr: 'Vos dossiers médicaux sont chiffrés et protégés selon les normes strictes de confidentialité clinique.',
    kr: 'Zot bann dosie medikal sekirize ek proteze dapre bann regleman strik.',
  },
];

export function AdminTranslationsPage() {
  const toast = useToast();
  const [dictionary, setDictionary] = useState<TranslationEntry[]>(() => {
    try {
      const saved = localStorage.getItem('med360_custom_i18n_dictionary');
      return saved ? JSON.parse(saved) : INITIAL_DICTIONARY;
    } catch {
      return INITIAL_DICTIONARY;
    }
  });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredEntries = useMemo(() => {
    return dictionary.filter((entry) => {
      const matchCategory = categoryFilter === 'all' || entry.category === categoryFilter;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        entry.key.toLowerCase().includes(q) ||
        entry.en.toLowerCase().includes(q) ||
        entry.fr.toLowerCase().includes(q) ||
        entry.kr.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [dictionary, search, categoryFilter]);

  const handleUpdateText = (key: string, lang: 'en' | 'fr' | 'kr', val: string) => {
    setDictionary((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [lang]: val } : item))
    );
  };

  const handleSaveDictionary = () => {
    try {
      localStorage.setItem('med360_custom_i18n_dictionary', JSON.stringify(dictionary));
      auditService.log({
        actorName: 'Deven Admin',
        actorRole: 'super_admin',
        action: 'update',
        entityType: 'seo',
        details: `Updated multi-lingual UI dictionary entries (${dictionary.length} keys synchronized)`,
      });
      toast.success('Multi-lingual translation keys saved and synchronized.', {
        title: 'Dictionary Updated',
      });
    } catch (e) {
      toast.error('Failed to save dictionary keys.', { title: 'Save Error' });
    }
  };

  const handleResetDefaults = () => {
    setDictionary(INITIAL_DICTIONARY);
    localStorage.removeItem('med360_custom_i18n_dictionary');
    toast.info('Restored multi-lingual dictionary to institutional defaults.', {
      title: 'Defaults Restored',
    });
  };

  return (
    <div className="admin-translations-container">
      {/* ── Top Header ── */}
      <div className="admin-translations-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Languages size={26} color="#c084fc" /> Live Multi-Lingual Translation & UI Dictionary
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.35rem 0 0', fontSize: '0.875rem' }}>
            Central dictionary manager for English, French, and Kreol Morisien UI labels, CTA buttons, and reassurance banners.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleResetDefaults}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
          >
            <RotateCcw size={15} /> Reset Defaults
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveDictionary}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} /> Save All Translations
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="admin-translations-stats-grid">
        <div className="admin-translations-stat-card">
          <div className="admin-translations-stat-icon"><Globe2 size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>3 Active Languages</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>English · Français · Kreol</div>
          </div>
        </div>

        <div className="admin-translations-stat-card">
          <div className="admin-translations-stat-icon" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.12)' }}><CheckCircle2 size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>100% Complete</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>All UI Strings Translated</div>
          </div>
        </div>

        <div className="admin-translations-stat-card">
          <div className="admin-translations-stat-icon" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)' }}><Sparkles size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Instant Hot-Reload</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>No Code Redeploy Needed</div>
          </div>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="admin-translations-controls">
        <div className="admin-translations-search">
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input
            type="text"
            placeholder="Search key or localized text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '0.5rem 0.75rem',
              color: '#fff',
              fontSize: '0.8125rem',
              outline: 'none',
            }}
          >
            <option value="all">All UI Categories</option>
            <option value="hero">Hero Section</option>
            <option value="cta">CTA Buttons</option>
            <option value="trust">Trust & Guarantees</option>
            <option value="cost_calculator">Cost Calculator</option>
            <option value="inquiry_form">Inquiry & Intake</option>
          </select>
        </div>
      </div>

      {/* ── Translation Table ── */}
      <div className="admin-translations-table-wrapper">
        <table className="admin-translations-table">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Translation Key</th>
              <th style={{ width: '28%' }}>🇬🇧 English</th>
              <th style={{ width: '28%' }}>🇫🇷 Français</th>
              <th style={{ width: '28%' }}>🇲🇺 Kreol Morisien</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.key}>
                <td>
                  <code style={{ fontSize: '0.75rem', color: '#c084fc', background: 'rgba(192, 132, 252, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                    {entry.key}
                  </code>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase' }}>
                    {entry.category.replace('_', ' ')}
                  </div>
                </td>
                <td>
                  <textarea
                    value={entry.en}
                    onChange={(e) => handleUpdateText(entry.key, 'en', e.target.value)}
                    className="admin-translations-input"
                  />
                </td>
                <td>
                  <textarea
                    value={entry.fr}
                    onChange={(e) => handleUpdateText(entry.key, 'fr', e.target.value)}
                    className="admin-translations-input"
                  />
                </td>
                <td>
                  <textarea
                    value={entry.kr}
                    onChange={(e) => handleUpdateText(entry.key, 'kr', e.target.value)}
                    className="admin-translations-input"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
