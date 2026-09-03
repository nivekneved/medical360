import { X, Star, Building2, Globe, Award, Users, Bed, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Hospital } from '../../core/types';
import { useTranslation } from 'react-i18next';

interface HospitalCompareModalProps {
  hospitals: Hospital[];
  onClose: () => void;
  onRemove: (hospitalId: string) => void;
}

export function HospitalCompareModal({ hospitals, onClose, onRemove }: HospitalCompareModalProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  if (hospitals.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: 1100,
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'var(--color-surface)',
          zIndex: 10,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {isFr ? 'Comparateur d\'Hôpitaux Partenaires' : isKr ? 'Konparater Lopital Partner' : 'Side-by-Side Hospital Comparison'}
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {isFr
                ? `Comparaison directe de ${hospitals.length} établissement(s) accrédité(s)`
                : `Direct comparison of ${hospitals.length} accredited hospital(s)`}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Comparison Table / Columns */}
        <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `200px repeat(${hospitals.length}, minmax(260px, 1fr))`,
            gap: '1rem',
            minWidth: 700,
          }}>
            {/* Row 1: Hospital Header Cards */}
            <div style={{ fontWeight: 800, color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', paddingTop: '1rem' }}>
              {isFr ? 'Établissement' : 'Hospital'}
            </div>
            {hospitals.map(h => (
              <div
                key={h.id}
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <button
                  onClick={() => onRemove(h.id)}
                  title="Remove from comparison"
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.4)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={12} />
                </button>

                <img
                  src={h.imageUrl}
                  alt={h.name}
                  style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}
                />
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text)', lineHeight: 1.25 }}>
                  {isFr && h.name_fr ? h.name_fr : isKr && h.name_kr ? h.name_kr : h.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  📍 {h.city}, {h.country}
                </div>
              </div>
            ))}

            {/* Row 2: Accreditations */}
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <Award size={16} color="var(--color-primary)" />
              <span>{isFr ? 'Accréditations' : 'Accreditations'}</span>
            </div>
            {hospitals.map(h => (
              <div key={h.id} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {(h.accreditations || []).map(acc => (
                  <span
                    key={acc}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: 'rgba(16,185,129,0.12)',
                      color: '#059669',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 4,
                      border: '1px solid rgba(16,185,129,0.25)',
                    }}
                  >
                    ★ {acc}
                  </span>
                ))}
              </div>
            ))}

            {/* Row 3: Bed Capacity & ICU */}
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <Bed size={16} color="var(--color-primary)" />
              <span>{isFr ? 'Capacité Hospitalière' : 'Bed & ICU Capacity'}</span>
            </div>
            {hospitals.map(h => (
              <div key={h.id} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{h.bedsCount?.toLocaleString()} {isFr ? 'lits' : 'beds'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>{h.icuBeds} {isFr ? 'lits de réanimation (USI)' : 'ICU beds'}</div>
              </div>
            ))}

            {/* Row 4: International Patients Volume */}
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <Users size={16} color="var(--color-primary)" />
              <span>{isFr ? 'Patients Internationaux / An' : 'Intl Patients / Year'}</span>
            </div>
            {hospitals.map(h => (
              <div key={h.id} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                  {h.internationalPatientsPerYear ? `${h.internationalPatientsPerYear.toLocaleString()} +` : '20,000+'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{isFr ? 'Département international dédié' : 'Dedicated Intl Lounge'}</div>
              </div>
            ))}

            {/* Row 5: Rating & Reviews */}
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <Star size={16} color="#eab308" />
              <span>{isFr ? 'Avis Patients' : 'Patient Rating'}</span>
            </div>
            {hospitals.map(h => (
              <div key={h.id} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ background: '#fef08a', color: '#854d0e', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 800, fontSize: '0.85rem' }}>
                  ★ {h.rating}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({h.reviewCount} {isFr ? 'avis' : 'reviews'})</span>
              </div>
            ))}

            {/* Row 6: Languages Spoken */}
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <Globe size={16} color="var(--color-primary)" />
              <span>{isFr ? 'Langues Parlées' : 'Languages Spoken'}</span>
            </div>
            {hospitals.map(h => (
              <div key={h.id} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', fontSize: '0.825rem', color: 'var(--color-text)' }}>
                {(h.languages || ['English', 'French', 'Hindi']).join(', ')}
              </div>
            ))}

            {/* Row 7: Actions */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }} />
            {hospitals.map(h => (
              <div key={h.id} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/hospitals/${h.id}`);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', fontWeight: 700 }}
                >
                  {isFr ? 'Voir Fiche Complète' : 'View Full Profile'}
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/describe-need?hospital=${h.id}`);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                >
                  <span>{isFr ? 'Obtenir un Devis' : 'Get Free Quote'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
