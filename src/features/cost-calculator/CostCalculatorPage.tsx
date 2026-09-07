import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck, Clock, Sparkles, HeartPulse, EyeOff, Lock, Settings, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSpecialties } from '../../hooks/useSpecialties';
import { useTranslation } from 'react-i18next';
import { useCMS } from '../../hooks/useCMS';
import { usePlatformSettings } from '../../core/services/settings.service';
import { useAuth } from '../../providers/AuthProvider';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SPECIALTY_SYMPTOMS_MAP } from '../specialties/specialtySymptoms';

interface CountryCostProfile {
  country: string;
  flag: string;
  hospitalExample: string;
  costMultiplier: number;
  durationDays: number;
  featured?: boolean;
}

const COUNTRY_PROFILES: CountryCostProfile[] = [
  { country: 'India', flag: '🇮🇳', hospitalExample: 'Apollo / Medanta / Fortis', costMultiplier: 1.0, durationDays: 10, featured: true },
  { country: 'Thailand', flag: '🇹🇭', hospitalExample: 'Bumrungrad Hospital', costMultiplier: 1.35, durationDays: 8 },
  { country: 'Malaysia', flag: '🇲🇾', hospitalExample: 'Gleneagles Hospital', costMultiplier: 1.25, durationDays: 9 },
  { country: 'Singapore', flag: '🇸🇬', hospitalExample: 'Mount Elizabeth', costMultiplier: 2.4, durationDays: 8 },
  { country: 'Mauritius (Private)', flag: '🇲🇺', hospitalExample: 'Local Private Clinic', costMultiplier: 2.2, durationDays: 10 },
  { country: 'France / UK', flag: '🇫🇷', hospitalExample: 'European Private Care', costMultiplier: 3.5, durationDays: 10 },
];

export function CostCalculatorPage() {
  const { specialties } = useSpecialties();
  const { i18n } = useTranslation();
  const { data: cms } = useCMS('cost-calculator');
  const { settings } = usePlatformSettings();
  const { isAuthenticated } = useAuth();
  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const langKey = (isFr || isKr) ? (i18n.language as 'fr' | 'kr') : 'en';
  const l10n = (fr: string, kr: string, en: string) => isFr ? fr : isKr ? kr : en;
  const navigate = useNavigate();

  const MUR_RATE = settings.murExchangeRate || 46.5;

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>('sp-cardiology');
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>('proc-c1');
  const [currency, setCurrency] = useState<'USD' | 'MUR'>('USD');

  // Find active specialty and procedures
  const activeSpecialty = useMemo(() => {
    return specialties.find(s => s.id === selectedSpecialtyId) || specialties[0];
  }, [specialties, selectedSpecialtyId]);

  const activeProcedure = useMemo(() => {
    if (!activeSpecialty) return null;
    return activeSpecialty.procedures.find(p => p.id === selectedProcedureId) || activeSpecialty.procedures[0];
  }, [activeSpecialty, selectedProcedureId]);

  const handleSpecialtyChange = (specId: string) => {
    setSelectedSpecialtyId(specId);
    const spec = specialties.find(s => s.id === specId);
    if (spec && spec.procedures.length > 0) {
      setSelectedProcedureId(spec.procedures[0].id);
    }
  };

  const formatPrice = (usdAmount: number) => {
    if (currency === 'MUR') {
      const mur = Math.round(usdAmount * MUR_RATE);
      return `Rs ${mur.toLocaleString('en-US')}`;
    }
    return `$${Math.round(usdAmount).toLocaleString('en-US')}`;
  };

  const baseMinUSD = activeProcedure?.estimatedCostUSD.min ?? 5000;
  const baseMaxUSD = activeProcedure?.estimatedCostUSD.max ?? 9000;
  const baseAvgUSD = (baseMinUSD + baseMaxUSD) / 2;

  // Comparison with Mauritius local private
  const localPrivateAvgUSD = baseAvgUSD * 2.2;
  const savingsUSD = Math.max(0, localPrivateAvgUSD - baseAvgUSD);
  const savingsPercent = Math.round((savingsUSD / localPrivateAvgUSD) * 100);

  // If disabled and not admin, show graceful direct assistance state
  if (!settings.enableCostComparison && !isAuthenticated) {
    return (
      <div style={{ minHeight: '80vh', background: 'var(--color-bg)', paddingTop: 'calc(var(--navbar-height) + 3rem)', paddingBottom: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Helmet>
          <title>Medical Treatment Assessment | Med360</title>
        </Helmet>
        <div className="container" style={{ maxWidth: 640, textAlign: 'center' }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <HeartPulse size={28} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: 'var(--color-text)' }}>
              {isFr ? 'Estimation Personnalisée de Traitement' : isKr ? 'Estimasion Pri Personalize' : 'Personalized Treatment Cost Assessment'}
            </h1>
            <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              {isFr
                ? 'Pour vous fournir un devis médical précis et adapté à votre diagnostic clinique, notre équipe médicale examine votre dossier directement avec nos chirurgiens chefs partenaires.'
                : 'To ensure 100% accuracy tailored to your specific clinical diagnostic, our medical coordinators prepare personalized, itemized hospital quotes directly with senior surgical specialists.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/describe-need" className="btn btn-primary btn-lg" style={{ fontWeight: 700, gap: '0.5rem', textDecoration: 'none' }}>
                <span>{isFr ? 'Demander Mon Évaluation Gratuite' : 'Request Free Medical Assessment'}</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/hospitals" className="btn btn-outline btn-lg" style={{ fontWeight: 700, textDecoration: 'none' }}>
                <span>{isFr ? 'Explorer les Hôpitaux' : 'View Partner Hospitals'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '5rem' }}>
      <Helmet>
        <title>Medical Treatment Cost Calculator & Comparison | Med360</title>
        <meta name="description" content="Calculate and compare international medical treatment costs for Mauritian patients across India, Thailand, Singapore, and Europe. Save up to 70% with transparent pricing." />
      </Helmet>

      {/* Admin Preview Mode Banner (When Cost Calculator is hidden from public) */}
      {!settings.enableCostComparison && isAuthenticated && (
        <div style={{
          background: '#fef3c7',
          borderBottom: '1.5px solid #f59e0b',
          color: '#92400e',
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          position: 'sticky',
          top: 'var(--navbar-height, 64px)',
          zIndex: 40,
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <EyeOff size={16} />
              <span><strong>Private Admin Preview:</strong> Cost Comparison is currently <strong>HIDDEN</strong> from public website visitors.</span>
            </div>
            <Link to="/admin/settings" style={{ color: '#b45309', fontWeight: 800, textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Settings size={14} /> Open Admin Settings to Activate
            </Link>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/calculator_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            <Calculator size={14} />
            <span>{tCms('heroLabel', isFr ? 'Transparence & Estimation des Coûts' : isKr ? 'Pri Kler & San Sipriz' : 'Clear & Transparent Treatment Costs')}</span>
          </span>

          <h1 className="text-h1">
            {tCms('heroTitle', isFr ? 'Estimer le Coût de Vos Soins en Toute Clarté' : isKr ? 'Konn Pri Ou Tretman an Tout Trankilite' : 'Understand & Estimate Your Treatment Costs')}
          </h1>
          
          <p className="text-lead" style={{ marginBottom: '1.5rem' }}>
            {tCms('heroDesc', isFr
              ? 'Nous croyons en une totale transparence, sans mauvaise surprise. Obtenez une estimation claire et réaliste des coûts dans nos hôpitaux partenaires pour préparer vos soins l\'esprit tranquille.'
              : isKr
              ? 'Nou krwar dan enn transparans total san okenn fre kasiet. Get bann pri estimatif pou planifie ou tretman ek rekiperasion an tout trankilite.'
              : 'We believe in honest, clear pricing with no hidden costs. Explore realistic treatment estimates across accredited partner hospitals so you and your family can plan with complete peace of mind.')}
          </p>

          {/* Currency Switcher */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.1)', padding: 4, borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', gap: 4 }}>
            <button
              onClick={() => setCurrency('USD')}
              style={{
                background: currency === 'USD' ? 'var(--color-primary)' : 'transparent',
                color: currency === 'USD' ? '#ffffff' : 'rgba(255,255,255,0.85)',
                border: 'none',
                padding: '0.45rem 1.25rem',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('MUR')}
              style={{
                background: currency === 'MUR' ? 'var(--color-primary)' : 'transparent',
                color: currency === 'MUR' ? '#ffffff' : 'rgba(255,255,255,0.85)',
                border: 'none',
                padding: '0.45rem 1.25rem',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              MUR (Rs)
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool Container */}
      <div className="container" style={{ maxWidth: 1140, margin: '-2rem auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        
        {/* Patient Helper Card */}
        <div className="spec-helper-card" style={{ marginBottom: '1.5rem' }}>
          <div className="spec-helper-card__left">
            <div className="spec-helper-card__icon" aria-hidden="true">
              <HelpCircle size={28} />
            </div>
            <div>
              <h3 className="spec-helper-card__title">
                {l10n(
                  'Besoin d\'un devis personnalisé sans frais cachés ?',
                  'Bizin enn estimasion pri kler san fre kasiet ?',
                  'Need an exact personalized quote with zero hidden fees?'
                )}
              </h3>
              <p className="spec-helper-card__desc">
                {l10n(
                  'Ces estimations incluent les forfaits hospitaliers complets. Envoyez votre bilan médical pour obtenir un plan de traitement chiffré et officiel sous 24 à 48 heures.',
                  'Bann pri montre isi inklir perkour lopital konple. Avoy ou bann rapor pou gagn enn devis ofisiel detaye dan 24 a 48 er-tan.',
                  'These estimates cover full comprehensive hospital packages. Submit your medical reports to receive an official, all-inclusive treatment plan within 24–48 hours.'
                )}
              </p>
            </div>
          </div>
          <div className="spec-helper-card__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/describe-need?specialty=${selectedSpecialtyId}&from=Cost+Calculator+Top+Banner&serviceName=Cost+Estimation+Quote`)}
            >
              ✍️ {l10n('Demander mon devis officiel', 'Demann mo devis ofisiel', 'Request Official Quote')}
            </button>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Step 1: Specialty & Procedure Picker Card */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
          marginBottom: '2rem',
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeartPulse size={20} color="var(--color-primary)" />
            <span>1. {isFr ? 'Choisissez Votre Spécialité et Intervention' : isKr ? 'Swazir Ou Spesialite ek Loperasion' : 'Select Specialty & Surgical Procedure'}</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Specialty Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                {isFr ? 'Spécialité Médicale' : isKr ? 'Spesialite Medikal' : 'Medical Specialty'}
              </label>
              <select
                className="form-select"
                value={selectedSpecialtyId}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
                style={{ fontWeight: 600, borderRadius: 'var(--radius-lg)' }}
              >
                {specialties.map(spec => {
                  const sEntry = SPECIALTY_SYMPTOMS_MAP[spec.id]?.[langKey];
                  const plainLabel = sEntry ? sEntry.badge : (isFr && spec.name_fr ? spec.name_fr : isKr && spec.name_kr ? spec.name_kr : spec.name);
                  return (
                    <option key={spec.id} value={spec.id}>
                      {plainLabel} ({isFr && spec.name_fr ? spec.name_fr : isKr && spec.name_kr ? spec.name_kr : spec.name})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Procedure Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                {isFr ? 'Procédure / Traitement Spécifique' : isKr ? 'Tretman / Operasion Spesifik' : 'Specific Procedure / Treatment'}
              </label>
              <select
                className="form-select"
                value={selectedProcedureId}
                onChange={(e) => setSelectedProcedureId(e.target.value)}
                style={{ fontWeight: 600, borderRadius: 'var(--radius-lg)' }}
              >
                {(activeSpecialty?.procedures || []).map(proc => (
                  <option key={proc.id} value={proc.id}>
                    {isFr && proc.name_fr ? proc.name_fr : isKr && proc.name_kr ? proc.name_kr : proc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Procedure Description Pill */}
          {activeProcedure && (
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                  {isFr && activeProcedure.name_fr ? activeProcedure.name_fr : isKr && activeProcedure.name_kr ? activeProcedure.name_kr : activeProcedure.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {isFr && activeProcedure.description_fr ? activeProcedure.description_fr : isKr && activeProcedure.description_kr ? activeProcedure.description_kr : activeProcedure.description}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{isFr ? 'Durée Séjour' : 'Hospital Stay'}</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} /> ~{activeProcedure.estimatedDurationDays} {isFr ? 'jours' : 'days'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Savings Highlight Banner */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid color-mix(in srgb, var(--color-primary) 30%, transparent)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={16} />
              <span>{isFr ? 'Économie Estimée pour Patient Mauricien' : isKr ? 'Lekonomi Estime Pou Pasian Morisien' : 'Estimated Patient Savings'}</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text)', marginTop: 4 }}>
              {isFr ? `Économisez environ ${savingsPercent}% (${formatPrice(savingsUSD)})` : `Save approx. ${savingsPercent}% (${formatPrice(savingsUSD)})`}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              {isFr
                ? 'Coût moyen tout-inclus en Inde par rapport aux cliniques privées locales ou hôpitaux occidentaux.'
                : 'Average all-inclusive package in India compared to local private clinics or European facilities.'}
            </p>
          </div>

          <button
            onClick={() => navigate(`/describe-need?specialty=${selectedSpecialtyId}&from=Cost+Calculator+Quote+Button&serviceName=Treatment+Cost+Quote`)}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
          >
            <span>{isFr ? 'Demander Mon Devis Gratuit' : isKr ? 'Demann Mo Devi Gratis' : 'Get Exact Personalized Quote'}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Step 2: Multi-Country Cost Comparison Grid */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          2. {isFr ? 'Comparatif Détaillé par Destination' : isKr ? 'Konparatif Pri par Destinasion' : 'Country-by-Country Price Comparison'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {COUNTRY_PROFILES.map((profile) => {
            const countryMin = baseMinUSD * profile.costMultiplier;
            const countryMax = baseMaxUSD * profile.costMultiplier;
            const isBestValue = profile.featured;

            return (
              <div
                key={profile.country}
                style={{
                  background: 'var(--color-surface)',
                  border: isBestValue ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: isBestValue ? 'var(--shadow-primary)' : '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                {isBestValue && (
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    right: 20,
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.75rem',
                    borderRadius: '999px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    ★ {isFr ? 'Meilleur Rapport Qualité/Prix' : 'Top Value Choice'}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{profile.flag}</span>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)' }}>{profile.country}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{profile.hospitalExample}</div>
                  </div>
                </div>

                {/* Estimated Price Range */}
                <div style={{
                  background: isBestValue ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  textAlign: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {isFr ? 'Fourchette de Prix Estimée' : 'Estimated Cost Range'}
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: isBestValue ? 'var(--color-primary)' : 'var(--color-text)', marginTop: 2 }}>
                    {formatPrice(countryMin)} – {formatPrice(countryMax)}
                  </div>
                </div>

                {/* Inclusions checklist for this destination */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle2 size={14} color="var(--color-primary)" />
                    <span>{isFr ? 'Honoraires chirurgicaux & bloc opératoire' : 'Surgeon & OT charges included'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle2 size={14} color="var(--color-primary)" />
                    <span>{isFr ? `Séjour hospitalier (${activeProcedure?.estimatedDurationDays || 10} jours)` : `Hospital stay (${activeProcedure?.estimatedDurationDays || 10} days)`}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle2 size={14} color="var(--color-primary)" />
                    <span>{isFr ? 'Accompagnement Med360 gratuit' : '100% Free Med360 Concierge Support'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                    <CheckCircle2 size={14} color="var(--color-primary)" />
                    <span>{isFr ? 'Accueil VIP aéroport & transferts' : 'VIP Airport meet & transfer'}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/describe-need?specialty=${selectedSpecialtyId}&preferredCountry=${encodeURIComponent(profile.country)}&from=Cost+Calculator+${encodeURIComponent(profile.country)}+Card&serviceName=Treatment+in+${encodeURIComponent(profile.country)}`)}
                  className={`btn ${isBestValue ? 'btn-primary' : 'btn-outline'} btn-sm`}
                  style={{ width: '100%', fontWeight: 700 }}
                >
                  {isFr ? `Choisir ${profile.country}` : `Select ${profile.country}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Step 3: What's Included in Every Med360 Package */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <ShieldCheck size={16} />
              <span>{isFr ? 'Transparence Totale' : 'Zero Hidden Costs'}</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {isFr ? 'Ce qui est Toujours Inclus dans Votre Prise en Charge' : 'What is Included in Your Medical Package'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {isFr
                ? 'Contrairement à une démarche individuelle, nos forfaits négociés auprès des hôpitaux partenaires couvrent l\'ensemble du séjour médical.'
                : 'Every package arranged through Med360 includes end-to-end clinical and concierge coordination with zero extra fees for the patient.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: 4 }}>🏥 {isFr ? 'Soins Cliniques Complets' : 'Complete Clinical Care'}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {isFr ? 'Chirurgien chef de service, anesthésie, bloc opératoire et examens préopératoires.' : 'Chief surgeon fees, anesthesia, operating theater, ICU, and pre-op diagnostic panels.'}
              </div>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: 4 }}>🛏️ {isFr ? 'Chambre Privée & Repas' : 'Private Room & Meals'}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {isFr ? 'Séjour en chambre individuelle avec lit pour accompagnant et repas diététiques adaptés.' : 'Single private room with companion sleeper bed and customized patient meal plan.'}
              </div>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: 4 }}>🛂 {isFr ? 'Visa Médical & Accueil VIP' : 'Visa & VIP Transfers'}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {isFr ? 'Lettre d\'invitation urgente pour visa et véhicule privé d\'accueil à l\'aéroport.' : 'Fast-track Medical Visa invitation letter and private chauffeured airport pickup.'}
              </div>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: 4 }}>🩺 {isFr ? 'Téléconsultation Suivi Retour' : 'Post-Op Telemedicine'}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {isFr ? 'Consultations de suivi à distance avec votre chirurgien une fois rentré à Maurice.' : 'Remote video follow-up consultations with your surgeon once back home in Mauritius.'}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
