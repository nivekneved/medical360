import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, MapPin, Shield, Calendar, BedDouble, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { useHospital } from '../../hooks/useHospitals';
import { useSpecialties } from '../../hooks/useSpecialties';
import { useDoctors } from '../../hooks/useDoctors';
import { formatNumber, formatCostRange } from '../../core/services/format.service';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import './Hospitals.css';

export function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { hospital, loading } = useHospital(id);
  const { specialties } = useSpecialties();
  const { doctors } = useDoctors(undefined, id);

  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj?.[`${field}_${i18n.language}`] || obj?.[field] || '';

  if (loading) {
    return (
      <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '80vh', padding: '3rem 1rem' }}>
        <div className="container" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="skeleton" style={{ height: 400, borderRadius: 24, marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: 100, borderRadius: 16, marginBottom: '1.5rem' }} />
          <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
        </div>
      </main>
    );
  }

  if (!hospital) {
    return (
      <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '80vh', textAlign: 'center', padding: '5rem 1rem' }}>
        <h2>{l10n('Hôpital Introuvable', 'Lopital Pa Ena', 'Hospital Not Found')}</h2>
        <button className="btn btn-primary" onClick={() => navigate('/hospitals')} style={{ marginTop: '1.5rem' }}>
          <ArrowLeft size={16} /> {l10n('Retour aux Hôpitaux', 'Retourn Lopital', 'Back to Hospitals')}
        </button>
      </main>
    );
  }

  const hospitalSpecialties = specialties.filter(s => hospital.specialties.includes(s.id));

  return (
    <main className="hospital-detail-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO
        title={`${hospital.name} - ${hospital.city}, ${hospital.country} | Medical 360`}
        description={l(hospital, 'overview') || `Explore ${hospital.name} accredited healthcare services.`}
        canonical={`/hospitals/${hospital.id}`}
      />

      {/* Hero Banner */}
      <section style={{ position: 'relative', minHeight: 380, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <img
          src={hospital.imageUrl}
          alt={hospital.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(9,13,16,0.95) 0%, rgba(9,13,16,0.5) 60%, rgba(9,13,16,0.3) 100%)',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '3rem var(--space-6)', width: '100%' }}>
          <button
            onClick={() => navigate('/hospitals')}
            className="btn btn-outline btn-sm"
            style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={14} /> {l10n('Tous les Hôpitaux', 'Tou Lopital', 'All Hospitals')}
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {hospital.accreditations.map((acc) => (
              <span key={acc} className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                <Shield size={12} /> {acc} Accredited
              </span>
            ))}
            {hospital.featured && (
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                ⭐ {l10n('Partenaire d\'Excellence', 'Partner Ekselans', 'Center of Excellence')}
              </span>
            )}
          </div>

          <h1 className="text-h1" style={{ color: 'white', marginBottom: '0.5rem' }}>
            {hospital.name}
          </h1>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={16} style={{ color: 'var(--color-accent)' }} /> {hospital.city}, {hospital.country}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Star size={16} fill="#ffb400" color="#ffb400" /> <strong>{hospital.rating}</strong> (International Patient Rating)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BedDouble size={16} /> {formatNumber(hospital.bedsCount)} {l10n('Lits', 'Lili', 'Beds')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={16} /> {l10n('Établi en', 'Etabli an', 'Established')} {hospital.foundedYear || 2000}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="section">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem', alignItems: 'start' }}>
            {/* Left Column: Overview, Specialties & Doctors */}
            <div>
              {/* Overview */}
              <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '2rem', marginBottom: '2.5rem' }}>
                <h2 className="text-h2" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                  {l10n('Présentation de l\'Établissement', 'Prezantasion Lopital', 'About the Hospital')}
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: 1.75, color: 'var(--color-text-secondary)' }}>
                  {l(hospital, 'description')}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>{hospital.accreditations.join(' · ')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Quality Certifications</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>100%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>English & French Assistance</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>0 Days</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Waitlist via Med360</div>
                  </div>
                </div>
              </div>

              {/* Specialties & Treatments Offered */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 className="text-h2" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
                  {l10n('Centres d\'Excellence Disponibles', 'Bann Spesialite Disponib', 'Specialties & Procedures Available')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {hospitalSpecialties.map((sp) => (
                    <div
                      key={sp.id}
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                        {l(sp, 'name')}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', flex: 1 }}>
                        {sp.procedures.slice(0, 2).map((proc) => (
                          <div key={proc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                            <span style={{ color: 'var(--color-text-secondary)' }}>{l(proc, 'name')}</span>
                            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                              {formatCostRange(proc.estimatedCostUSD.min, proc.estimatedCostUSD.max)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to={`/specialties/${sp.id}`}
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: 'auto', width: '100%' }}
                      >
                        {l10n('Détails Spécialité', 'Detay Spesialite', 'Specialty Details')} <ArrowRight size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affiliated Specialists (from 7 doctors) */}
              {doctors.length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h2 className="text-h2" style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>
                    {l10n('Médecins Consultants Principaux', 'Bann Sef Dokter Konsiltan', 'Lead Consulting Specialists')}
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
                          onClick={() => navigate(`/describe-need?specialty=${doc.specialties[0]}`)}
                        >
                          {l10n('Consulter', 'Konsilte', 'Consult')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Direct Booking & Fast-Track Card */}
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
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em',
                  marginBottom: '1rem',
                }}>
                  {l10n('Accès Direct Garanti', 'Akse Direk Garanti', 'Free Fast-Track Service')}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
                  {l10n('Demandez Votre Avis Médical Gratuit', 'Gagn Ou Lavi Medikal Gratis', 'Request a Free Medical Opinion')}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {l10n(
                    `Obtenez une évaluation directe et un devis de ${hospital.name} sous 48 heures sans aucun frais.`,
                    `Gagn enn lavi direk ek estimasion pri depi ${hospital.name} dan 48h san okenn fré.`,
                    `Get a direct medical assessment and transparent quote from ${hospital.name} within 48 hours completely free.`
                  )}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate(`/describe-need`)}
                    style={{ width: '100%' }}
                  >
                    {t('nav.freeOpinion')} <ArrowRight size={16} />
                  </button>
                  <a
                    href={buildMed360WhatsAppUrl(`Bonjour Medical 360, je souhaite obtenir un avis médical pour ${hospital.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-lg"
                    style={{ width: '100%' }}
                  >
                    <MessageCircle size={18} /> {t('nav.whatsapp')}
                  </a>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '1.5rem', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={14} color="#10b981" /> 100% Free for Mauritian Patients
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={14} color="#10b981" /> Visa, Flights & Hotel Assistance
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={14} color="#10b981" /> On-ground Coordinator at Destination
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
