import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck, Clock, Sparkles, HeartPulse } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSpecialties } from '../../hooks/useSpecialties';
import { useTranslation } from 'react-i18next';
import { useCMS } from '../../hooks/useCMS';

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

const MUR_RATE = 46.5; // 1 USD = 46.5 Mauritian Rupees

export function CostCalculatorPage() {
  const { specialties } = useSpecialties();
  const { i18n } = useTranslation();
  const { data: cms } = useCMS('cost-calculator');
  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const navigate = useNavigate();

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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '5rem' }}>
      <Helmet>
        <title>Medical Treatment Cost Calculator & Comparison | Med360</title>
        <meta name="description" content="Calculate and compare international medical treatment costs for Mauritian patients across India, Thailand, Singapore, and Europe. Save up to 70% with transparent pricing." />
      </Helmet>

      {/* Hero Header */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/calculator_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            <Calculator size={14} />
            <span>{tCms('heroLabel', isFr ? 'Simulateur & Comparateur de Coûts Médicaux' : isKr ? 'Kalkilatris Pri & Konparater Lasante' : 'Interactive Medical Treatment Cost Calculator')}</span>
          </span>

          <h1 className="text-h1">
            {tCms('heroTitle', isFr ? 'Comparez les Prix des Soins dans le Monde' : isKr ? 'Konpar Pri Tretman dan Lemond' : 'Compare Treatment Costs Across Global Hospitals')}
          </h1>
          
          <p className="text-lead" style={{ marginBottom: '1.5rem' }}>
            {tCms('heroDesc', isFr
              ? 'Sélectionnez votre intervention chirurgicale et visualisez instantanément les économies réalisables en Inde, Thaïlande et Singapour par rapport aux tarifs locaux et européens.'
              : isKr
              ? 'Swazir ou loperasion e trouv toutswit komie ou kapav sove dan l\'Inde, Tayland ek Singapour konpare ar tarif lokal.'
              : 'Select your surgical procedure to see instant, transparent cost estimates and real savings in India, Thailand, Singapore, and Europe compared to local private care.')}
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
                {specialties.map(spec => (
                  <option key={spec.id} value={spec.id}>
                    {isFr && spec.name_fr ? spec.name_fr : isKr && spec.name_kr ? spec.name_kr : spec.name}
                  </option>
                ))}
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
            onClick={() => navigate(`/describe-need?specialty=${selectedSpecialtyId}`)}
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
                  onClick={() => navigate(`/describe-need?specialty=${selectedSpecialtyId}&preferredCountry=${encodeURIComponent(profile.country)}`)}
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
