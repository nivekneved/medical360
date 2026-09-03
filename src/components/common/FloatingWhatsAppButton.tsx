import { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';

export function FloatingWhatsAppButton() {
  const { i18n } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9998,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8,
    }}>
      {/* Tooltip Popup */}
      {showTooltip && (
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '0.85rem 1rem',
          boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
          maxWidth: 260,
          animation: 'fadeIn 0.2s ease',
          fontSize: '0.8125rem',
          color: 'var(--color-text)',
          lineHeight: 1.4,
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              {isFr ? 'Assistance 24/7 en Ligne' : isKr ? 'Asistans 24/7 An Lign' : '24/7 Patient Concierge'}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={13} />
            </button>
          </div>
          <p style={{ margin: '0 0 6px 0', color: 'var(--color-text-secondary)' }}>
            {isFr
              ? 'Besoin d\'un avis médical rapide ? Discutez avec un coordinateur mauricien.'
              : isKr
              ? 'Bizin enn lavi medikal vit? Koz direk ar enn koordinater Morisien.'
              : 'Need a fast medical opinion or treatment estimate? Chat with a Mauritian coordinator.'}
          </p>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Phone size={12} />
            <span>+230 59188275</span>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={buildMed360WhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: 'scale(1)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        title="Chat on WhatsApp with Medical 360 Patient Assistance"
        aria-label="Chat with Medical 360 on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
