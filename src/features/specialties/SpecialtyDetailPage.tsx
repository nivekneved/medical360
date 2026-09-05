import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, MapPin, MessageCircle, Clock } from 'lucide-react';
import { useSpecialty } from '../../hooks/useSpecialties';
import { useHospitals } from '../../hooks/useHospitals';
import { useDoctors } from '../../hooks/useDoctors';
import { formatCostRange } from '../../core/services/format.service';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { ProcedureInlineManager } from './components/ProcedureInlineManager';
import './Specialties.css';

export function SpecialtyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { specialty, loading, setSpecialty, refetch } = useSpecialty(id);
  const { hospitals } = useHospitals({});
  const { doctors } = useDoctors(id);

  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj?.[`${field}_${i18n.language}`] || obj?.[field] || '';

  if (loading) {
    return (
      <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '80vh', padding: '3rem 1rem' }}>
        <div className="container" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 350, borderRadius: 24, marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: 150, borderRadius: 16 }} />
        </div>
      </main>
    );
  }

  if (!specialty) {
    return (
      <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '80vh', textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>{l10n('Spécialité Introuvable', 'Spesialite Pa Ena', 'Specialty Not Found')}</h2>
        <button className="btn btn-primary" onClick={() => navigate('/specialties')} style={{ marginTop: '1.5rem' }}>
          <ArrowLeft size={16} /> {l10n('Toutes les Spécialités', 'Tou Spesialite', 'All Specialties')}
        </button>
      </main>
    );
  }

  const affiliatedHospitals = hospitals.filter(h => h.specialties.includes(specialty.id));

  return (
    <main className="specialty-detail-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO
        title={`${l(specialty, 'name')} - Procedures & Costs | Med360`}
        description={l(specialty, 'shortDescription') || `Explore world-class ${specialty.name} treatments.`}
        canonical={`/specialties/${specialty.id}`}
      />

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: 360, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <img
          src={specialty.imageUrl}
          alt={specialty.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(9,13,16,0.95) 0%, rgba(9,13,16,0.6) 60%, rgba(9,13,16,0.3) 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '3rem var(--space-6)', width: '100%' }}>
          <button
            onClick={() => navigate('/specialties')}
            className="btn btn-outline btn-sm"
            style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={14} /> {l10n('Toutes les Spécialités', 'Tou Spesialite', 'All Specialties')}
          </button>

          <span className="section-label" style={{ color: 'var(--color-accent)' }}>
            {l10n('Centre d\'Excellence Médicale', 'Sant Ekselans Medikal', 'Center of Medical Excellence')}
          </span>
          <h1 className="text-h1" style={{ color: 'white', marginBottom: '0.75rem' }}>
            {l(specialty, 'name')}
          </h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 650 }}>
            {l(specialty, 'shortDescription')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
            {/* Left Column: Procedures, Hospitals, Doctors, Stories */}
            <div>
              {/* Procedures & Cost Estimates (100% Inline Management - Zero Popups) */}
              <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem', marginBottom: '2.5rem' }}>
                <ProcedureInlineManager
                  specialty={specialty}
                  onSaved={(updated) => {
                    setSpecialty(updated);
                    refetch();
                  }}
                  l10n={l10n}
                  l={l}
                  onQuoteClick={(sId) => navigate(`/describe-need?specialty=${sId}`)}
                />
              </div>

              {/* Partner Hospitals for this Specialty */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 className="text-h2" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
                  {l10n('Hôpitaux Partenaires Recommandés', 'Lopital Rekomande', 'Accredited Hospitals for this Specialty')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {affiliatedHospitals.map((hosp) => (
                    <div
                      key={hosp.id}
                      style={{
                        background: 'var(--color-surface)',
                        border: '1.5px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <img src={hosp.imageUrl} alt={hosp.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{hosp.name}</h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '0.25rem 0 0.75rem' }}>
                          <MapPin size={12} /> {hosp.city}, {hosp.country}
                        </p>
                        <Link
                          to={`/hospitals/${hosp.id}`}
                          className="btn btn-outline btn-sm"
                          style={{ marginTop: 'auto', width: '100%' }}
                        >
                          {l10n('Voir l\'Hôpital', 'Get Lopital', 'View Hospital')} <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Specialists */}
              {doctors.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h2 className="text-h2" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
                    {l10n('Spécialistes Consultants en Chef', 'Sef Dokter Konsiltan', 'Lead Consulting Specialists')}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        style={{
                          background: 'var(--color-surface)',
                          border: '1.5px solid var(--color-border)',
                          borderRadius: 'var(--radius-xl)',
                          padding: '1.25rem',
                          display: 'flex',
                          gap: '1.25rem',
                          alignItems: 'center',
                        }}
                      >
                        <img
                          src={doc.imageUrl}
                          alt={doc.name}
                          style={{ width: 70, height: 70, borderRadius: 'var(--radius-lg)', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{doc.name}</h3>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>{doc.title}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                            {doc.experience} years experience · {doc.surgeries.toLocaleString()}+ surgeries
                          </p>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/describe-need?specialty=${specialty.id}`)}
                        >
                          {l10n('Consulter', 'Konsilte', 'Consult')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: CTA */}
            <div style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 2rem)' }}>
              <div style={{
                background: 'linear-gradient(135deg, #090d10 0%, #111822 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-2xl)',
                padding: '2rem',
                color: '#ffffff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              }}>
                <span style={{
                  display: 'inline-block',
                  background: 'color-mix(in srgb, var(--color-accent) 20%, transparent)',
                  color: 'var(--color-accent-light)',
                  border: '1px solid color-mix(in srgb, var(--color-accent) 35%, transparent)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  marginBottom: '1rem',
                }}>
                  {l10n('Service 100% Gratuit', 'Servis 100% Gratis', '100% Free Service')}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
                  {l10n('Obtenir un Avis Médical Sur Mesure', 'Gagn Lavi Medikal Personnaliser', 'Get a Tailored Opinion')}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {l10n(
                    `Envoyez vos rapports médicaux pour ${l(specialty, 'name')}. Nos chefs de département évalueront votre dossier sous 48h.`,
                    `Avoy ou bann raport medikal pou ${l(specialty, 'name')}. Nou bann sef dokter pou evalie ou dosie dan 48h.`,
                    `Submit your medical reports for ${specialty.name}. Top department heads will review your case within 48 hours.`
                  )}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate(`/describe-need?specialty=${specialty.id}`)}
                    style={{ width: '100%' }}
                  >
                    {t('nav.freeOpinion')} <ArrowRight size={16} />
                  </button>
                  <a
                    href={buildMed360WhatsAppUrl(`Bonjour Med360, j'aimerais avoir des informations sur la spécialité ${l(specialty, 'name')}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-lg"
                    style={{ width: '100%' }}
                  >
                    <MessageCircle size={18} /> {t('nav.whatsapp')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
