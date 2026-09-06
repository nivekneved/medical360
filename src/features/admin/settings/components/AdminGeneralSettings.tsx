import React, { useState } from 'react';
import { Building2, Globe, Mail, Phone, MessageCircle, Calculator, Sliders, CheckCircle2, Eye, EyeOff } from 'lucide-react';
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
    });
    onNotify({ text: 'Platform general settings & module visibility updated.' });
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
            Public Phone / Hotline
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
            WhatsApp Number (Digits with country code)
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
            USD to Mauritian Rupee (MUR) Exchange Rate
          </label>
          <input
            type="number"
            step={0.1}
            className="form-input"
            value={murExchangeRate}
            onChange={e => setMurExchangeRate(parseFloat(e.target.value) || 46.5)}
          />
        </div>
      </div>

      {/* Feature & Module Activation Section */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={20} color="var(--color-primary)" />
          Public Features & Module Activation
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
          Instantly control public visibility of optional modules like treatment cost comparison and calculators.
        </p>
      </div>

      <div style={{
        background: 'var(--color-surface)',
        border: enableCostComparison ? '1.5px solid var(--color-primary)' : '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        transition: 'all 0.2s ease',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <Calculator size={20} color="var(--color-primary)" />
              <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>
                Treatment Cost Comparison & Calculator Module
              </strong>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: enableCostComparison ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                color: enableCostComparison ? '#059669' : '#64748b',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}>
                {enableCostComparison ? (
                  <>
                    <Eye size={12} /> Active on Website
                  </>
                ) : (
                  <>
                    <EyeOff size={12} /> Hidden from Website
                  </>
                )}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              When enabled, visitors can access the interactive Multi-Country Cost Calculator (comparing India, Thailand, Malaysia, Singapore, and Europe) via navigation menus, doctor profile cards, and footer links. When disabled, all public access and links to cost comparisons are hidden.
            </p>
          </div>

          <label style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            marginTop: '0.25rem',
          }}>
            <input
              type="checkbox"
              checked={enableCostComparison}
              onChange={e => setEnableCostComparison(e.target.checked)}
              style={{ display: 'none' }}
            />
            <div style={{
              width: 52,
              height: 28,
              borderRadius: 14,
              background: enableCostComparison ? 'var(--color-primary)' : '#cbd5e1',
              position: 'relative',
              transition: 'background 0.25s ease',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                position: 'absolute',
                top: 3,
                left: enableCostComparison ? 27 : 3,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'left 0.25s ease',
              }} />
            </div>
            <span style={{ marginLeft: 10, fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
              {enableCostComparison ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button type="submit" className="btn btn-primary" style={{ fontWeight: 700, padding: '0.65rem 1.5rem' }}>
          Save Platform Settings & Module Rules
        </button>
      </div>
    </form>
  );
};

