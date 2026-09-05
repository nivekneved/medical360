import React, { useState } from 'react';
import { Building2, Globe, Mail, Phone, MessageCircle } from 'lucide-react';

interface AdminGeneralSettingsProps {
  onNotify: (msg: { text: string; isError?: boolean }) => void;
}

export const AdminGeneralSettings: React.FC<AdminGeneralSettingsProps> = ({ onNotify }) => {
  const [siteName, setSiteName] = useState('Medical 360');
  const [tagline, setTagline] = useState('Specialised Medical Care in Private Clinics & Abroad');
  const [supportEmail, setSupportEmail] = useState('info@med360.mu');
  const [supportPhone, setSupportPhone] = useState('+230 59188275');
  const [whatsAppNumber, setWhatsAppNumber] = useState('23059188275');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [murExchangeRate, setMurExchangeRate] = useState(46.5);
  const [ngoHeritageName, setNgoHeritageName] = useState('NGO Enn Rev Enn Sourir');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onNotify({ text: 'Platform general settings updated.' });
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

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
          Save General Settings
        </button>
      </div>
    </form>
  );
};
