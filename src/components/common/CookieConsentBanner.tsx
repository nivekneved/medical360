import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CONSENT_STORAGE_KEY = 'med360_cookie_consent_v1';

export function CookieConsentBanner() {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!hasConsented) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted_' + new Date().toISOString());
    setVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'dismissed_' + new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 24,
      right: 24,
      maxWidth: 620,
      margin: '0 auto',
      zIndex: 9999,
      background: 'var(--color-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: 'var(--radius-2xl)',
      padding: '1.25rem 1.5rem',
      boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(16px)',
      animation: 'fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-md)',
          background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}>
          <ShieldCheck size={20} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>
            {isFr ? 'Protection des Données & Confidentialité Médicale' : isKr ? 'Proteksion Doné & Konfidansialite Medikal' : 'Data Privacy & Healthcare Compliance'}
          </div>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {isFr
              ? 'Medical 360 utilise des cookies sécurisés et respecte la loi mauricienne sur la protection des données (DPA 2017) pour garantir la sécurité et la confidentialité de votre dossier médical.'
              : isKr
              ? 'Medical 360 servi bann cookies sekirize e respekte lalwa Moris lor proteksion doné (DPA 2017) pou protez ou bann linformasion lasante.'
              : 'Medical 360 uses essential cookies and adheres to the Mauritius Data Protection Act (DPA 2017) and GDPR to safeguard your medical inquiries and coordination data.'}{' '}
            <Link to="/privacy" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline' }}>
              {isFr ? 'Politique de Confidentialité' : 'Privacy Policy'}
            </Link>
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.85rem', alignItems: 'center' }}>
            <button
              onClick={handleAccept}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.4rem 1.1rem', fontSize: '0.8125rem', fontWeight: 700 }}
            >
              {isFr ? 'Accepter & Continuer' : isKr ? 'Aksepte & Kontinie' : 'Accept & Continue'}
            </button>
            <button
              onClick={handleDismiss}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}
            >
              {isFr ? 'Essentiels Seulement' : 'Essential Only'}
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
