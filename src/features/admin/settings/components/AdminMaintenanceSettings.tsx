import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  MessageCircle,
  Power,
  RefreshCw,
  Sparkles,
  Phone,
} from 'lucide-react';
import {
  isMaintenanceModeActive,
  setMaintenanceMode,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
  CONTACT_EMAIL,
  SITE_URL,
} from '../../../../core/config/site';

interface AdminMaintenanceSettingsProps {
  onNotify: (msg: { text: string; isError?: boolean }) => void;
}

export const AdminMaintenanceSettings: React.FC<AdminMaintenanceSettingsProps> = ({ onNotify }) => {
  const [isActive, setIsActive] = useState<boolean>(isMaintenanceModeActive());
  const [copied, setCopied] = useState<boolean>(false);
  const [emergencyPhone, setEmergencyPhone] = useState<string>(WHATSAPP_DISPLAY);
  const [emergencyEmail, setEmergencyEmail] = useState<string>(CONTACT_EMAIL);

  const previewUrl = `${SITE_URL || window.location.origin}/preview`;

  const handleToggle = () => {
    const nextState = !isActive;
    setMaintenanceMode(nextState);
    setIsActive(nextState);
    onNotify({
      text: nextState
        ? 'Maintenance Mode ENABLED. Public visitors now see the Under Maintenance page.'
        : 'Maintenance Mode DISABLED. Public website is now 100% LIVE.',
      isError: nextState,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(previewUrl).then(() => {
      setCopied(true);
      onNotify({ text: 'Client Preview Link copied to clipboard.' });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} color="var(--color-primary)" />
          Platform Maintenance & Emergency Hotlines
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
          Manage global site availability, emergency patient dispatch hotlines, and client preview tokens.
        </p>
      </div>

      {/* ── 1. Status & Master Switch Banner ── */}
      <div style={{
        background: isActive ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
        border: `1.5px solid ${isActive ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
        borderRadius: 'var(--radius-xl, 1rem)',
        padding: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: isActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isActive ? '#ef4444' : '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 16px ${isActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          }}>
            <Power size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {isActive ? 'Site Status: UNDER MAINTENANCE' : 'Site Status: 100% LIVE TO PUBLIC'}
              </span>
              <span style={{
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: isActive ? '#ef4444' : '#10b981',
                color: '#fff',
              }}>
                {isActive ? 'Active' : 'Live'}
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {isActive
                ? 'Public visitors see the maintenance page with 24/7 WhatsApp hotline. Admin routes remain open.'
                : 'All medical catalogs, inquiry wizards, and hospital pages are publicly accessible.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
          style={{
            fontWeight: 700,
            padding: '0.75rem 1.5rem',
            gap: '0.5rem',
            borderColor: isActive ? 'transparent' : 'var(--color-danger, #ef4444)',
            color: isActive ? '#fff' : 'var(--color-danger, #ef4444)',
            cursor: 'pointer',
          }}
        >
          <Power size={18} />
          <span>{isActive ? 'Disable Maintenance (Go Live)' : 'Enable Maintenance Mode'}</span>
        </button>
      </div>

      {/* ── 2. Client Preview Token Generator ── */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl, 1rem)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--color-primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            Client Preview Bypass Gateway
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Share this direct preview URL with directors or clients. Opening this link once instantly unlocks full browsing access for their browser even when Maintenance Mode is active.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--color-bg)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md, 0.5rem)',
          border: '1px solid var(--color-border)',
        }}>
          <input
            type="text"
            readOnly
            value={previewUrl}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="btn btn-outline btn-sm"
            style={{ fontWeight: 700, gap: '0.4rem' }}
          >
            {copied ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 700, gap: '0.4rem', textDecoration: 'none' }}
          >
            <ExternalLink size={14} />
            <span>Open Preview</span>
          </a>
        </div>
      </div>

      {/* ── 3. Emergency Hotline Dispatch Channels ── */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl, 1rem)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageCircle size={18} color="#16a34a" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            Emergency Clinical Coordination Lines
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
              Active WhatsApp Hotline
            </label>
            <input
              type="text"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 4, display: 'block' }}>
              Displayed on Maintenance page, Floating widget, and Emergency Banners.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
              Clinical Coordination Email
            </label>
            <input
              type="email"
              value={emergencyEmail}
              onChange={(e) => setEmergencyEmail(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 4, display: 'block' }}>
              Direct clinical inbox receiving urgent dossier inquiries.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onNotify({ text: 'Emergency coordination channels saved.' })}
            className="btn btn-primary"
            style={{ fontWeight: 700 }}
          >
            Save Emergency Hotlines
          </button>
        </div>
      </div>
    </div>
  );
};
