import { useState } from 'react';
import { Plane, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';

interface VisaDestination {
  id: string;
  country: string;
  flag: string;
  visaType: string;
  processingTime: string;
  validity: string;
  attendantsAllowed: number;
  keyRequirements: string[];
  med360Assistance: string;
}

const DESTINATIONS: VisaDestination[] = [
  {
    id: 'india',
    country: 'India',
    flag: '🇮🇳',
    visaType: 'Indian e-Medical Visa (e-Med)',
    processingTime: '24 – 48 Hours',
    validity: '60 Days (Triple Entry)',
    attendantsAllowed: 2,
    keyRequirements: [
      'Valid passport with minimum 6 months validity from travel date',
      'Official Medical Visa Invitation Letter from our partner hospital (Apollo, Medanta, Fortis, etc.)',
      'Recent medical history, doctor referral letter or diagnosis report',
      'e-Medical Attendant Visa for up to 2 family members/caregivers',
    ],
    med360Assistance: 'Med360 secures and delivers your official hospital visa invitation letter within 24 hours at zero cost.',
  },
  {
    id: 'thailand',
    country: 'Thailand',
    flag: '🇹🇭',
    visaType: 'Medical Tourism Entry & Non-MT Visa',
    processingTime: 'Instant (Visa-Free / VOA) or 3 Days',
    validity: '30 to 90 Days (Extendable)',
    attendantsAllowed: 3,
    keyRequirements: [
      'Passport valid for at least 6 months with 2 blank pages',
      'Hospital confirmation letter from Bumrungrad or accredited hospital',
      'Proof of confirmed return flight and accommodation booking',
      'Medical clearance certificate for fit-to-fly patients',
    ],
    med360Assistance: 'Direct hospital patient registration, fast-track Bangkok immigration clearance, and limousine transfer.',
  },
  {
    id: 'singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    visaType: 'Short-Term Medical Visit Pass',
    processingTime: 'Online SG Arrival Card (24h)',
    validity: '30 Days (Extendable up to 90 Days)',
    attendantsAllowed: 2,
    keyRequirements: [
      'Mauritian passport holders enjoy 30-day visa-free entry',
      'Specialist appointment confirmation letter from Mount Elizabeth / Gleneagles',
      'Submission of Singapore Arrival Card (SGAC) with electronic health declaration',
      'Medical extension application support for surgeries requiring prolonged stay',
    ],
    med360Assistance: 'Direct coordination with hospital International Patient Centre for stay extension and concierge escort.',
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    visaType: 'MHTC Medical Travel Visa (e-VISA Medical)',
    processingTime: '48 – 72 Hours',
    validity: '30 Days (Extendable)',
    attendantsAllowed: 2,
    keyRequirements: [
      'Passport valid for at least 6 months',
      'Malaysia Healthcare Travel Council (MHTC) member hospital appointment letter',
      'Recent diagnostic imaging and clinical reports',
      'MHTC VIP Airport Lounge fast-track clearance card',
    ],
    med360Assistance: 'Full MHTC registry accreditation and airside meet-and-greet at Kuala Lumpur International Airport (KLIA).',
  },
];

export function VisaGuidePage() {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('india');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'check-passport': true,
    'check-records': true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedDestination = DESTINATIONS.find(d => d.id === activeTab) || DESTINATIONS[0];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingBottom: '5rem' }}>
      <Helmet>
        <title>Medical Visa & Travel Guide for Mauritian Patients | Med360</title>
        <meta name="description" content="Complete step-by-step medical visa and travel coordination guide for patients travelling from Mauritius to India, Thailand, Singapore, and Malaysia." />
      </Helmet>

      {/* Hero Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/visaguide_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'color-mix(in srgb, var(--color-primary) 25%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-accent-light) 45%, transparent)',
            borderRadius: '999px',
            padding: '0.35rem 1rem',
            color: '#ffffff',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1rem',
          }}>
            <Plane size={15} />
            <span>{isFr ? 'Guide Visa Médical & Voyage pour Patients Mauriciens' : isKr ? 'Gid Viza Medikal & Vwayaz' : 'Mauritian Patient Visa & Travel Readiness Guide'}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1.15, marginBottom: '1rem', color: '#ffffff' }}>
            {isFr ? 'Voyagez en Toute Sérénité pour Vos Soins' : isKr ? 'Vwayaze San Traka Pou Ou Tretman' : 'Hassle-Free Medical Travel & Fast-Track Visas'}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', maxWidth: 720, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            {isFr
              ? 'Med360 s\'occupe gratuitement de vos démarches de visa médical : obtention des lettres d\'invitation officielles des hôpitaux sous 24h, visas pour accompagnants et transferts aéroport VIP.'
              : isKr
              ? 'Med360 okip tou ou bann demars viza medikal gratis : let linvitasion lopital dan 24h, viza akonpagnan, ek transpor VIP.'
              : 'Med360 manages your medical visa assistance free of charge: 24h hospital invitation letters, family companion visas, priority flights, and VIP airport reception.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <PhoneCall size={16} />
              <span>{isFr ? 'Assistance Visa d\'Urgence (WhatsApp 24/7)' : '24/7 Visa Assistance Helpline'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ maxWidth: 1140, margin: '-2rem auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        
        {/* Country Selector Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--color-surface)',
          padding: '0.5rem',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--color-border)',
          gap: '0.5rem',
          overflowX: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          marginBottom: '2rem',
        }}>
          {DESTINATIONS.map(d => {
            const isActive = d.id === activeTab;
            return (
              <button
                key={d.id}
                onClick={() => setActiveTab(d.id)}
                style={{
                  flex: 1,
                  minWidth: 160,
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: 'none',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--color-text)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{d.flag}</span>
                <span>{d.country}</span>
              </button>
            );
          })}
        </div>

        {/* Active Destination Card Details */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          marginBottom: '2.5rem',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{selectedDestination.flag}</span>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedDestination.country} — {selectedDestination.visaType}</h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {isFr ? 'Protocole officiel pour les ressortissants mauriciens et résidents de l\'océan Indien' : 'Official medical travel protocol for Mauritian citizens and Indian Ocean residents'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ background: 'var(--color-surface-2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{isFr ? 'Délai Obtention' : 'Processing Time'}</div>
                <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{selectedDestination.processingTime}</div>
              </div>
              <div style={{ background: 'var(--color-surface-2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{isFr ? 'Validité Séjour' : 'Stay Validity'}</div>
                <div style={{ fontWeight: 800, color: 'var(--color-text)' }}>{selectedDestination.validity}</div>
              </div>
              <div style={{ background: 'var(--color-surface-2)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{isFr ? 'Accompagnants Autorisés' : 'Caregivers Allowed'}</div>
                <div style={{ fontWeight: 800, color: 'var(--color-text)' }}>Jusqu'à {selectedDestination.attendantsAllowed}</div>
              </div>
            </div>
          </div>

          {/* Requirements List */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
            {isFr ? 'Documents & Justificatifs Requis :' : 'Mandatory Travel & Medical Documents:'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {selectedDestination.keyRequirements.map((req, idx) => (
              <div key={idx} style={{
                background: 'var(--color-surface)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}>
                <CheckCircle2 size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.45 }}>{req}</span>
              </div>
            ))}
          </div>

          {/* Med360 Free Concierge Value-Add Box */}
          <div style={{
            background: 'color-mix(in srgb, var(--color-primary) 8%, var(--color-surface-2))',
            border: '1.5px solid color-mix(in srgb, var(--color-primary) 30%, var(--color-border))',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
              <ShieldCheck size={28} color="var(--color-primary)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                  {isFr ? 'Notre Prise en Charge 100% Gratuite' : 'Med360 Full Concierge Commitment'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {selectedDestination.med360Assistance}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/describe-need?preferredCountry=${encodeURIComponent(selectedDestination.country)}`)}
              className="btn btn-primary"
              style={{ fontWeight: 700, padding: '0.65rem 1.25rem' }}
            >
              {isFr ? `Demander mon invitation ${selectedDestination.country}` : `Get ${selectedDestination.country} Invitation Letter`}
            </button>
          </div>
        </div>

        {/* Step-by-Step 4-Stage Travel Timeline */}
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          {isFr ? 'Chronologie de Votre Prise en Charge Médicale' : 'Step-by-Step Medical Travel Timeline'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '0.75rem' }}>1</div>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>{isFr ? 'Jours 1 – 2 : Avis Médical' : 'Days 1 – 2: Free Opinion'}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {isFr ? 'Examen de vos comptes-rendus par les chirurgiens chefs de service et devis détaillé.' : 'Your clinical records are reviewed directly by chief surgeons to form treatment plan & quote.'}
            </p>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '0.75rem' }}>2</div>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>{isFr ? 'Jours 3 – 4 : Lettre & Visa' : 'Days 3 – 4: Fast Visa'}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {isFr ? 'Émission de la lettre officielle de l\'hôpital et dépôt express de votre visa e-Medical.' : 'Official hospital letter issued, expedited e-Medical Visa and flight tickets booked.'}
            </p>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '0.75rem' }}>3</div>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>{isFr ? 'Jour 5 : Accueil VIP & Soins' : 'Day 5: VIP Arrival & Surgery'}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {isFr ? 'Accueil à la descente d\'avion, transfert à la clinique et admission directe sans attente.' : 'Airside VIP meet & greet, chauffeur transfer to hospital, direct admission to private room.'}
            </p>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, marginBottom: '0.75rem' }}>4</div>
            <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>{isFr ? 'Retour : Téléconsultation' : 'Recovery & Telemedicine'}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {isFr ? 'Vol de retour à Maurice en cabine adaptée et suivi médical à distance avec le médecin traitant.' : 'Safe return flight to Mauritius and scheduled follow-up telemedicine consultations.'}
            </p>
          </div>
        </div>

        {/* Interactive Patient Readiness Checklist */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {isFr ? 'Checklist Pré-Départ du Patient' : 'Interactive Patient Pre-Departure Checklist'}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            {isFr ? 'Cochez les éléments au fur et à mesure de votre préparation avant de monter à bord :' : 'Check off items as you prepare for your medical departure:'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {[
              { id: 'check-passport', label: isFr ? 'Passeport valide au moins 6 mois après la date de retour' : 'Passport valid for 6+ months from travel date' },
              { id: 'check-records', label: isFr ? 'Dossier médical complet (scans, radios, bilans sanguins récents)' : 'Full medical dossier (recent MRI, CT scans, blood panels)' },
              { id: 'check-invitation', label: isFr ? 'Lettre officielle d\'invitation de l\'hôpital partenaire Med360' : 'Official Hospital Visa Invitation Letter from Med360' },
              { id: 'check-meds', label: isFr ? 'Traitements en cours dans leurs boîtes d\'origine avec ordonnances' : 'Current medications in original packaging with prescriptions' },
              { id: 'check-currency', label: isFr ? 'Moyens de paiement (carte internationale / devises USD)' : 'International payment methods (Forex card / USD cash)' },
              { id: 'check-companion', label: isFr ? 'Passeports et billets d\'avion des accompagnants' : 'Companion passports, visas, and flight tickets' },
            ].map(item => (
              <label
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  background: checkedItems[item.id] ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-lg)',
                  border: checkedItems[item.id] ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[item.id]}
                  onChange={() => {}}
                  style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: checkedItems[item.id] ? 600 : 400, color: 'var(--color-text)' }}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
