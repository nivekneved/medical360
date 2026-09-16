import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Calculator,
  Sliders,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  DollarSign,
  Languages,
  Activity,
  Cookie,
  Radio,
  FileSearch,
  Search,
} from 'lucide-react';
import { getPlatformSettings, savePlatformSettings, PlatformSettings } from '../../../../core/services/settings.service';

interface AdminGeneralSettingsProps {
  onNotify: (msg: { text: string; isError?: boolean }) => void;
}

export const AdminGeneralSettings: React.FC<AdminGeneralSettingsProps> = ({ onNotify }) => {
  const initial = getPlatformSettings();
  const [siteName, setSiteName] = useState(initial.siteName);
  const [tagline, setTagline] = useState(initial.tagline);
  const [supportEmail, setSupportEmail] = useState(initial.supportEmail);
  const [supportPhone, setSupportPhone] = useState(initial.supportPhone);
  const [whatsAppNumber, setWhatsAppNumber] = useState(initial.whatsAppNumber);
  const [defaultCurrency, setDefaultCurrency] = useState(initial.defaultCurrency);
  const [murExchangeRate, setMurExchangeRate] = useState(initial.murExchangeRate);
  const [ngoHeritageName, setNgoHeritageName] = useState(initial.ngoHeritageName);
  const [enableCostComparison, setEnableCostComparison] = useState(initial.enableCostComparison);

  // Addon State Registry
  const [addons, setAddons] = useState({
    addonFloatingWhatsApp: initial.addonFloatingWhatsApp ?? true,
    addonCostCalculator: initial.addonCostCalculator ?? true,
    addonPatientStories: initial.addonPatientStories ?? true,
    addonDoctorProfiles: initial.addonDoctorProfiles ?? true,
    addonMultiCurrency: initial.addonMultiCurrency ?? true,
    addonMultiLanguage: initial.addonMultiLanguage ?? true,
    addonLiveAnalytics: initial.addonLiveAnalytics ?? true,
    addonCookieConsent: initial.addonCookieConsent ?? true,
    addonEmergencyBar: initial.addonEmergencyBar ?? true,
    addonMedicalImagingViewer: initial.addonMedicalImagingViewer ?? true,
    addonSeoRichSnippets: initial.addonSeoRichSnippets ?? true,
  });

  const toggleAddon = (key: keyof typeof addons) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePlatformSettings({
      siteName,
      tagline,
      supportEmail,
      supportPhone,
      whatsAppNumber,
      defaultCurrency,
      murExchangeRate,
      ngoHeritageName,
      enableCostComparison,
      ...addons,
    });
    onNotify({ text: 'Platform general settings & Addon modules updated successfully.' });
  };

  const renderAddonToggle = (
    key: keyof typeof addons,
    icon: React.ReactNode,
    title: string,
    description: string
  ) => {
    const active = addons[key];
    return (
      <div
        key={key}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          padding: '1rem',
          background: active ? 'rgba(16, 185, 129, 0.04)' : 'rgba(241, 245, 249, 0.5)',
          border: `1px solid ${active ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-lg)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            {icon}
            <strong style={{ fontSize: '0.92rem', color: 'var(--color-text)' }}>{title}</strong>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '1px 6px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                background: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                color: active ? '#059669' : '#64748b',
              }}
            >
              {active ? 'Active' : 'Disabled'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            {description}
          </p>
        </div>

        <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 4 }}>
          <input
            type="checkbox"
            checked={active}
            onChange={() => toggleAddon(key)}
            style={{ display: 'none' }}
          />
          <div style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            background: active ? 'var(--color-primary)' : '#cbd5e1',
            position: 'relative',
            transition: 'background 0.2s ease',
          }}>
            <div style={{
              position: 'absolute',
              top: 2,
              left: active ? 22 : 2,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transition: 'left 0.2s ease',
            }} />
          </div>
        </label>
      </div>
    );
  };

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={20} color="var(--color-primary)" />
          General Platform Branding & Contact Channels
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
          Global parameters for customer communication, currency conversion rates, and NGO attribution.
        </p>
      </div>

      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            Website Title
          </label>
          <input
            type="text"
            className="form-input"
            value={siteName}
            onChange={e => setSiteName(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            Parent NGO Enterprise Name
          </label>
          <input
            type="text"
            className="form-input"
            value={ngoHeritageName}
            onChange={e => setNgoHeritageName(e.target.value)}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            Tagline / Subheading
          </label>
          <input
            type="text"
            className="form-input"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            Support / Contact Email
          </label>
          <input
            type="email"
            className="form-input"
            value={supportEmail}
            onChange={e => setSupportEmail(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            Support Phone Number
          </label>
          <input
            type="text"
            className="form-input"
            value={supportPhone}
            onChange={e => setSupportPhone(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            WhatsApp Number (Intl format, no +)
          </label>
          <input
            type="text"
            className="form-input"
            value={whatsAppNumber}
            onChange={e => setWhatsAppNumber(e.target.value)}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            Default Base Currency
          </label>
          <select
            className="form-input"
            value={defaultCurrency}
            onChange={e => setDefaultCurrency(e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="MUR">MUR (Rs)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="ZAR">ZAR (R)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            MUR Exchange Rate (1 USD = X MUR)
          </label>
          <input
            type="number"
            step="0.1"
            className="form-input"
            value={murExchangeRate}
            onChange={e => setMurExchangeRate(parseFloat(e.target.value) || 46.5)}
          />
        </div>
      </div>

      {/* ─── ADDON MODULES REGISTRY ─────────────────────────────────────────── */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--color-primary)" />
          Addon Modules & Feature Flags (Activate / Deactivate in Backend)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
          Core architectural principle: Every major feature is an independent addon that can be toggled live without code changes.
        </p>
      </div>

      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1rem',
      }}>
        {renderAddonToggle(
          'addonFloatingWhatsApp',
          <MessageCircle size={18} color="#10b981" />,
          'Floating WhatsApp Fast-Contact CTA',
          'Renders the 24/7 patient WhatsApp floating helper button across all public pages.'
        )}

        {renderAddonToggle(
          'addonCostCalculator',
          <Calculator size={18} color="#06b6d4" />,
          'Treatment Cost Calculator & Comparison',
          'Enables the interactive cross-country medical procedure cost estimator.'
        )}

        {renderAddonToggle(
          'addonPatientStories',
          <FileSearch size={18} color="#8b5cf6" />,
          'Verified Patient Stories & Case Studies',
          'Displays patient recovery testimonials and before/after clinical outcomes.'
        )}

        {renderAddonToggle(
          'addonDoctorProfiles',
          <Building2 size={18} color="#f59e0b" />,
          'Specialist Doctors & Credentials Directory',
          'Enables doctor bio cards, qualifications, and hospital affiliation directories.'
        )}

        {renderAddonToggle(
          'addonMultiCurrency',
          <DollarSign size={18} color="#10b981" />,
          'Live Multi-Currency Conversion Engine',
          'Allows patients to switch pricing seamlessly between USD, MUR, EUR, GBP, and ZAR.'
        )}

        {renderAddonToggle(
          'addonMultiLanguage',
          <Languages size={18} color="#6366f1" />,
          'Multi-Lingual Localization (EN / FR / Creole)',
          'Enables the 3-way language switcher in navigation and auto-translates content.'
        )}

        {renderAddonToggle(
          'addonLiveAnalytics',
          <Activity size={18} color="#ec4899" />,
          'GA4 & Meta Conversion Telemetry',
          'Dispatches aggregated, privacy-compliant event tracking and funnel analytics.'
        )}

        {renderAddonToggle(
          'addonCookieConsent',
          <Cookie size={18} color="#f97316" />,
          'Cookie Consent & Privacy Policy Banner',
          'Complies with GDPR and Mauritius Data Protection Act 2017 consent requirements.'
        )}

        {renderAddonToggle(
          'addonEmergencyBar',
          <Radio size={18} color="#ef4444" />,
          'Top Marquee & Emergency Alert Banner',
          'Renders the emergency broadcast marquee and live patient notices on header.'
        )}

        {renderAddonToggle(
          'addonMedicalImagingViewer',
          <Eye size={18} color="#06b6d4" />,
          'Medical DICOM & Scan Viewer',
          'Enables the interactive high-resolution radiological and diagnostic scan viewer.'
        )}

        {renderAddonToggle(
          'addonSeoRichSnippets',
          <Search size={18} color="#059669" />,
          'JSON-LD Schema & Rich Snippets Engine',
          'Injects Schema.org structured data (Hospital, Doctor, FAQPage) for Google SERP dominance.'
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button type="submit" className="btn btn-primary" style={{ fontWeight: 700, padding: '0.65rem 1.5rem' }}>
          Save Platform Settings & Addon Rules
        </button>
      </div>
    </form>
  );
};
