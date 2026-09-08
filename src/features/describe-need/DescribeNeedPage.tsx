import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useL10n } from '../../hooks/useL10n';
import { useInquiry } from '../../hooks/useInquiry';
import { useSpecialties } from '../../hooks/useSpecialties';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { Honeypot } from '../../components/Honeypot/Honeypot';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateDescription,
} from '../../core/services/validation.service';
import { SPECIALTY_SYMPTOMS_MAP } from '../specialties/specialtySymptoms';
import './DescribeNeed.css';

const COUNTRIES = ['Mauritius', 'Réunion Island', 'Comoros', 'Madagascar', 'Seychelles', 'Maldives', 'South Africa', 'Kenya', 'France', 'United Kingdom', 'Other'];

export function DescribeNeedPage() {
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const { i18n, lang, l10n, l } = useL10n();
  const { specialties } = useSpecialties();
  const {
    step, totalSteps, formData, honeypot, setHoneypot, submitting, submitted,
    updateField, nextStep, prevStep, submit, reset, error
  } = useInquiry();
  const { data: cms } = useCMS('describe-need');

  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    specialtyId?: string;
    description?: string;
    budget?: string;
  }>({});

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][lang] || cms.content[key]['en'] || fallback;
  };


  const URGENCY_OPTIONS = [
    { value: 'routine',   label: l10n('Routine', 'Routinn', 'Routine'),   desc: l10n('Aucune urgence immédiate', 'Pena okenn irzans', 'No immediate urgency') },
    { value: 'urgent',    label: l10n('Urgent', 'Irzan', 'Urgent'),    desc: l10n('Besoin d\'un rendez-vous sous 2 semaines', 'Bizin enn randevou dan mwins ki 2 semenn', 'Need appointment within 2 weeks') },
    { value: 'emergency', label: l10n('Urgence', 'Irzans Extrem', 'Emergency'), desc: l10n('Nécessite une assistance immédiate', 'Bizin led lamem', 'Require immediate assistance') },
  ] as const;

  const STEPS = i18n.language === 'fr' 
    ? ['Détails Personnels', 'Besoin Médical', 'Préférences', 'Vérifier & Soumettre'] 
    : i18n.language === 'kr'
    ? ['Detay Personel', 'Bizin Medikal', 'Preferans', 'Revize & Soumet']
    : ['Personal Details', 'Medical Need', 'Preferences', 'Review & Submit'];

  // Pre-select specialty, service, hospital & origin source from URL params
  const preSpecialty = params.get('specialty');
  if (preSpecialty && !formData.specialtyId) updateField('specialtyId', preSpecialty);

  const preService = params.get('service');
  const preServiceName = params.get('serviceName');
  if (preService && !formData.serviceId) {
    updateField('serviceId', preService);
  }
  if (preServiceName && !formData.serviceName) {
    updateField('serviceName', decodeURIComponent(preServiceName));
  }

  const preHospital = params.get('hospital') || params.get('hospitalId');
  const preHospitalName = params.get('hospitalName');
  if (preHospital && !formData.hospitalId) {
    updateField('hospitalId', preHospital);
  }
  if (preHospitalName && !formData.hospitalName) {
    updateField('hospitalName', decodeURIComponent(preHospitalName));
  }

  const preSource = params.get('from') || params.get('source');
  if (preSource && !formData.sourcePage) {
    updateField('sourcePage', decodeURIComponent(preSource));
  }

  const selectedSpecialty = specialties.find(s => s.id === formData.specialtyId);

  const handleNext = () => {
    const errors: typeof fieldErrors = {};

    if (step === 1) {
      const fnVal = validateName(formData.firstName, l10n('Prénom', 'Prenon', 'First Name'), 2);
      if (!fnVal.isValid) errors.firstName = fnVal.error;

      const lnVal = validateName(formData.lastName, l10n('Nom', 'Nom', 'Last Name'), 1);
      if (!lnVal.isValid) errors.lastName = lnVal.error;

      const emVal = validateEmail(formData.email, true);
      if (!emVal.isValid) errors.email = emVal.error;

      const phVal = validatePhone(formData.phone, true);
      if (!phVal.isValid) errors.phone = phVal.error;
    } else if (step === 2) {
      if (!formData.specialtyId) {
        errors.specialtyId = l10n('Veuillez sélectionner une spécialité médicale.', 'Swazir enn spesialite medikal silvouple.', 'Please select a medical specialty.');
      }
      const descVal = validateDescription(formData.description, l10n('Description de votre besoin', 'Deskripsion ou bizin', 'Medical Need Description'), 10);
      if (!descVal.isValid) errors.description = descVal.error;
    } else if (step === 3) {
      if (formData.budgetMin && formData.budgetMax) {
        if (Number(formData.budgetMin) > Number(formData.budgetMax)) {
          errors.budget = l10n('Le budget minimum ne peut pas dépasser le budget maximum.', 'Bidze minimum pa kapav pli gran ki maximum.', 'Minimum budget cannot exceed maximum budget.');
        }
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      nextStep();
    }
  };

  if (submitted) {
    return (
      <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div className="success-icon">
            <Check size={40} />
          </div>
          <h1 className="text-h2" style={{ marginBottom: '1rem' }}>
            {tCms('successTitle', l10n('Demande Soumise !', 'Demann Soumet !', 'Inquiry Submitted!'))}
          </h1>
          <p className="text-lead" style={{ marginBottom: '2rem' }}>
            {i18n.language === 'fr' 
              ? <>Merci ! Votre dossier a été reçu. Un gestionnaire de cas dédié de Med360 vous contactera dans les <strong>24 heures</strong>. Nous avons également ouvert WhatsApp pour que vous puissiez discuter avec nous dès maintenant.</>
              : i18n.language === 'kr'
              ? <>Mersi! Nou finn gagn ou dosie. Enn koordinater Med360 pou pran kontak ar ou dan <strong>24 er-tan</strong>. Nou finn osi ouver WhatsApp pou ou kapav koz ar nou lamem.</>
              : <>Thank you! Your case has been received. A dedicated case manager from Med360 will contact you within <strong>24 hours</strong>. We've also opened WhatsApp for you to chat with us right now.</>}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
              <MessageCircle size={18} /> {l10n('Contactez-nous sur WhatsApp', 'Koz ar nou lor WhatsApp', 'WhatsApp Us Now')}
            </a>
            <button className="btn btn-outline" onClick={() => { reset(); navigate('/'); }}>
              {l10n('Retour à l\'Accueil', 'Retourn akey', 'Back to Home')}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="describe-need-page" style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO pageKey="describeNeed" />
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/consultation-support.jpg)', minHeight: 280, padding: '4rem 0 3rem' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Avis Médical Gratuit & Confidentiel', 'Lavi Dokter Gratis & Konfidansyel', 'Free & Confidential Medical Review'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Nous Sommes Là Pour Vous Aider', 'Nou La Pou Ed Ou', 'We Are Here to Listen & Help'))}
          </h1>
          <p className="text-lead" style={{ maxWidth: 640 }}>
            {tCms('heroDesc', l10n(
              'Prenez le temps de nous expliquer ce que vous ou votre proche traversez. Nos médecins étudieront attentivement votre dossier en toute confidentialité pour vous guider sans aucun frais.',
              'Pran ou letan pou dir nou ki pe arive. Nou bann dokter pou get ou dosie avek swin dan konfidansialite net pou gid ou san okenn fre.',
              'Take your time to share what you or your loved one are experiencing. Our caring doctors will review your situation with complete confidentiality and give you free, honest guidance.'
            ))}
          </p>
        </div>
      </section>

      <div className="container wizard-container">
        {/* Step Indicator */}
        <div className="wizard-steps">
          {STEPS.map((label, i) => (
            <div key={label} className={`wizard-step ${i + 1 === step ? 'wizard-step--active' : ''} ${i + 1 < step ? 'wizard-step--done' : ''}`}>
              <div className="wizard-step__num">
                {i + 1 < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="wizard-step__label">{label}</span>
              {i < STEPS.length - 1 && <div className="wizard-step__line" />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="wizard-card">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="wizard-body animate-fade-in">
              {/* Security Honeypot */}
              <Honeypot value={honeypot} onChange={setHoneypot} id="wiz_security_hp" name="wiz_security_hp" />

              <h2 className="wizard-title">{l10n('Vos Détails Personnels', 'Ou Bann Detay', 'Your Personal Details')}</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-firstName">{l10n('Prénom *', 'Prenon *', 'First Name *')}</label>
                  <input
                    id="wiz-firstName"
                    className={`form-input ${fieldErrors.firstName ? 'form-input--error' : ''}`}
                    value={formData.firstName}
                    onChange={e => {
                      updateField('firstName', e.target.value);
                      if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: undefined }));
                    }}
                    placeholder="e.g. Rajesh"
                    style={{ borderColor: fieldErrors.firstName ? '#ef4444' : undefined }}
                    required
                  />
                  {fieldErrors.firstName && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{fieldErrors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-lastName">{l10n('Nom *', 'Nom *', 'Last Name *')}</label>
                  <input
                    id="wiz-lastName"
                    className={`form-input ${fieldErrors.lastName ? 'form-input--error' : ''}`}
                    value={formData.lastName}
                    onChange={e => {
                      updateField('lastName', e.target.value);
                      if (fieldErrors.lastName) setFieldErrors(prev => ({ ...prev, lastName: undefined }));
                    }}
                    placeholder="e.g. Ramkhelawon"
                    style={{ borderColor: fieldErrors.lastName ? '#ef4444' : undefined }}
                    required
                  />
                  {fieldErrors.lastName && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{fieldErrors.lastName}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-email">{l10n('Adresse Email *', 'Adres Email *', 'Email Address *')}</label>
                  <input
                    id="wiz-email"
                    className={`form-input ${fieldErrors.email ? 'form-input--error' : ''}`}
                    type="email"
                    value={formData.email}
                    onChange={e => {
                      updateField('email', e.target.value);
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="your@email.com"
                    style={{ borderColor: fieldErrors.email ? '#ef4444' : undefined }}
                    required
                  />
                  {fieldErrors.email && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{fieldErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-phone">{l10n('Téléphone / WhatsApp *', 'Telefonn / WhatsApp *', 'Phone / WhatsApp *')}</label>
                  <input
                    id="wiz-phone"
                    className={`form-input ${fieldErrors.phone ? 'form-input--error' : ''}`}
                    type="tel"
                    value={formData.phone}
                    onChange={e => {
                      updateField('phone', e.target.value);
                      if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: undefined }));
                    }}
                    placeholder="+230 5x xxx xxx"
                    style={{ borderColor: fieldErrors.phone ? '#ef4444' : undefined }}
                    required
                  />
                  {fieldErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{fieldErrors.phone}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wiz-country">{l10n('Pays de Résidence *', 'Pei Kot Ou Reste *', 'Country of Residence *')}</label>
                <select id="wiz-country" className="form-select" value={formData.countryOfResidence} onChange={e => updateField('countryOfResidence', e.target.value)}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Medical Need */}
          {step === 2 && (
            <div className="wizard-body animate-fade-in">
              <h2 className="wizard-title">{l10n('Décrivez Votre Besoin Médical', 'Dekrir Ou Maladi', 'Describe Your Medical Need')}</h2>
              
              {formData.serviceName && (
                <div style={{
                  background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
                  border: '1.5px solid var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.25rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                    <span>🎯</span>
                    <span>{l10n('Service Sélectionné :', 'Servis Seleksione :', 'Requested Service:')} <strong>{formData.serviceName}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { updateField('serviceId', ''); updateField('serviceName', ''); }}
                    style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {l10n('Changer', 'Sanze', 'Change')}
                  </button>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="wiz-specialty">{l10n('Spécialité Médicale ou Motif de Consultation *', 'Spesialite Medikal ouswa Rezon Konsiltasion *', 'Medical Specialty or Main Care Need *')}</label>
                <select
                  id="wiz-specialty"
                  className={`form-select ${fieldErrors.specialtyId ? 'form-input--error' : ''}`}
                  value={formData.specialtyId}
                  onChange={e => {
                    updateField('specialtyId', e.target.value);
                    if (fieldErrors.specialtyId) setFieldErrors(prev => ({ ...prev, specialtyId: undefined }));
                  }}
                  style={{ borderColor: fieldErrors.specialtyId ? '#ef4444' : undefined }}
                >
                  <option value="">{l10n('-- Sélectionnez selon vos besoins ou symptômes --', '-- Swazir dapre ou douler ouswa bezwen --', '-- Select based on your condition / symptoms --')}</option>
                  {specialties.map(s => {
                    const langKey = (i18n.language === 'fr' || i18n.language === 'kr') ? i18n.language : 'en';
                    const sEntry = SPECIALTY_SYMPTOMS_MAP[s.id]?.[langKey];
                    const plain = sEntry ? sEntry.badge : l(s, 'name');
                    return (
                      <option key={s.id} value={s.id}>
                        {plain} ({l(s, 'name')})
                      </option>
                    );
                  })}
                </select>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4, display: 'block' }}>
                  💡 {l10n(
                    'Pas certain(e) ? Choisissez l\'option la plus proche et décrivez simplement vos douleurs ci-dessous.',
                    'Pa tro sir ? Swazir seki paret pli pre ek zis dir nou ki douler ou gagne anba.',
                    'Not sure? Choose the closest option and simply describe your symptoms below.'
                  )}
                </span>
                {fieldErrors.specialtyId && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{fieldErrors.specialtyId}</span>}
              </div>
              {/* 1-Click Quick Fill Chips for Zero-Friction Pre-filling */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <span>⚡</span>
                  <span>{l10n('Remplissage Rapide en 1 Clic (Optionnel) :', 'Rempli Vit an 1 Klik :', '1-Click Quick Pre-fill (Optional):')}</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[
                    {
                      id: 'sp-cardiology',
                      label: l10n('❤️ Cardiologie & Coeur', '❤️ Kardiolozi & Leker', '❤️ Cardiology & Heart'),
                      text: l10n(
                        'Je sollicite un deuxième avis médical et une estimation de devis pour un diagnostic cardiaque (chirurgie/pontage/valve) dans un hôpital de référence en Inde.',
                        'Mo pe rod enn deziem lavi dokter ek estimasion pri pou enn problem leker dan enn bon lopital dan L\'inde.',
                        'I would like a medical second opinion and treatment cost estimate for a cardiac condition from a leading accredited hospital in India.'
                      ),
                    },
                    {
                      id: 'sp-oncology',
                      label: l10n('🎗️ Oncologie / Cancer', '🎗️ Onkolozi / Kanser', '🎗️ Oncology & Cancer Care'),
                      text: l10n(
                        'Je souhaite obtenir l\'avis d\'un oncologue référent et un devis de prise en charge pour un protocole de traitement oncologique complet.',
                        'Mo pe rod lavi enn espesyalis onkolog ek estimasion pri pou enn tretman kanser konple.',
                        'I am requesting a specialist oncologist review, treatment protocol, and hospital estimate for cancer therapy.'
                      ),
                    },
                    {
                      id: 'sp-orthopedics',
                      label: l10n('🦴 Orthopédie / Prothèse', '🦴 Zwin / Zenou / Lars', '🦴 Orthopedics / Joint'),
                      text: l10n(
                        'Je recherche un chirurgien orthopédique pour une prothèse (genou/hanche/rachis) et souhaite connaître les délais et devis complets.',
                        'Mo pe rod enn sirizien pou zwin/zenou ek mo anvi konn pri ek letan tretman.',
                        'I am seeking an orthopedic surgeon for joint replacement (knee/hip/spine) and would like full cost estimates and timeline.'
                      ),
                    },
                    {
                      id: 'sp-ivf',
                      label: l10n('👶 PMA / FIV & Fertilité', '👶 FIV & Fertidie', '👶 IVF & Fertility'),
                      text: l10n(
                        'Nous souhaitons des informations détaillées et les forfaits d\'accompagnement pour un parcours de PMA / FIV dans une clinique spécialisée.',
                        'Nou pe rod ranseynman ek pri pou enn tretman FIV dan enn klinik spesialize.',
                        'We are seeking detailed information and package estimates for an IVF / fertility treatment cycle at an accredited center.'
                      ),
                    },
                    {
                      id: 'sp-general',
                      label: l10n('📋 2ème Avis Médical Général', '📋 2em Lavi Dokter Gratis', '📋 2nd Medical Opinion'),
                      text: l10n(
                        'J\'ai des bilans et rapports médicaux récents et souhaite un avis médical d\'expert avec orientation vers le bon spécialiste en Inde.',
                        'Mo ena bann rapor medikal ek mo anvi gagn lavi enn dokter spesialis pou gid mwa ver bon lopital.',
                        'I have recent medical reports and test results and would like an expert second opinion and guidance to the right specialist in India.'
                      ),
                    },
                  ].map(chip => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => {
                        updateField('specialtyId', chip.id);
                        updateField('description', chip.text);
                        setFieldErrors(prev => ({ ...prev, specialtyId: undefined, description: undefined }));
                      }}
                      style={{
                        background: formData.specialtyId === chip.id ? 'var(--color-primary)' : 'var(--color-surface)',
                        color: formData.specialtyId === chip.id ? '#ffffff' : 'var(--color-text)',
                        border: `1.5px solid ${formData.specialtyId === chip.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: '999px',
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="wiz-description">{l10n('Décrivez Votre Condition *', 'Dekrir Ou Problem Sant *', 'Describe Your Condition *')}</label>
                <textarea
                  id="wiz-description"
                  className={`form-textarea ${fieldErrors.description ? 'form-input--error' : ''}`}
                  value={formData.description}
                  onChange={e => {
                    updateField('description', e.target.value);
                    if (fieldErrors.description) setFieldErrors(prev => ({ ...prev, description: undefined }));
                  }}
                  placeholder={l10n(
                    'Veuillez décrire votre état de santé, tout diagnostic que vous avez reçu et le type de traitement ou d\'avis que vous recherchez…',
                    'Silvouple dekrir ou maladi, si dokter inn dir ou kitsoz, ek ki kalite tretman ou pe rode…',
                    'Please describe your medical condition, any diagnosis you have received, and what type of treatment or opinion you are looking for…'
                  )}
                  style={{ minHeight: 140, borderColor: fieldErrors.description ? '#ef4444' : undefined }}
                  required
                />
                {fieldErrors.description && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{fieldErrors.description}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">{l10n('Urgence *', 'Irzans *', 'Urgency *')}</label>
                <div className="urgency-options">
                  {URGENCY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`urgency-option ${formData.urgency === opt.value ? 'urgency-option--selected' : ''}`}
                      onClick={() => updateField('urgency', opt.value)}
                      id={`urgency-${opt.value}-btn`}
                    >
                      <strong>{opt.label}</strong>
                      <span>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="wizard-body animate-fade-in">
              <h2 className="wizard-title">{l10n('Vos Préférences', 'Ou Preferans', 'Your Preferences')}</h2>
              <div className="form-group">
                <label className="form-label" htmlFor="wiz-preferredCountry">{l10n('Destination Préférée (optionnel)', 'Destinasion (opsionel)', 'Preferred Destination (optional)')}</label>
                <select id="wiz-preferredCountry" className="form-select" value={formData.preferredCountry} onChange={e => updateField('preferredCountry', e.target.value)}>
                  <option value="">{l10n('Pas de préférence — recommandez la meilleure option', 'Pena preferans — rekomann pli bon opsion', 'No preference — recommend best option')}</option>
                  <option value="India">{l10n('Inde', 'L\'inde', 'India')}</option>
                  <option value="Thailand">{l10n('Thaïlande', 'Taylann', 'Thailand')}</option>
                  <option value="Malaysia">{l10n('Malaisie', 'Malaisie', 'Malaysia')}</option>
                  <option value="Singapore">{l10n('Singapour', 'Singapour', 'Singapore')}</option>
                  <option value="UAE">{l10n('Émirats Arabes Unis', 'Dubai (UAE)', 'UAE')}</option>
                  <option value="Turkey">{l10n('Turquie', 'Turquie', 'Turkey')}</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{l10n('Budget Approximatif (USD) (optionnel)', 'Bidze Aprox. (USD) (opsionel)', 'Approximate Budget (USD) (optional)')}</label>
                <div className="form-row">
                  <div className="form-group">
                    <input id="wiz-budgetMin" className="form-input" type="number" placeholder={l10n('Min (ex. 5000)', 'Min (ex. 5000)', 'Min (e.g. 5000)')} value={formData.budgetMin} onChange={e => updateField('budgetMin', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <input id="wiz-budgetMax" className="form-input" type="number" placeholder={l10n('Max (ex. 20000)', 'Max (ex. 20000)', 'Max (e.g. 20000)')} value={formData.budgetMax} onChange={e => updateField('budgetMax', e.target.value)} />
                  </div>
                </div>
                {fieldErrors.budget && <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>{fieldErrors.budget}</span>}
              </div>
              <div className="wizard-info">
                <p>💡 <strong>{l10n('Pas de budget ?', 'Pena bidze ?', 'No budget?')}</strong> {l10n('Ne vous inquiétez pas — nous vous fournirons les meilleures options à tous les prix. Le service de Med360 est toujours', 'Pa trakase — nou pou donn ou bann meyer opsion pou tou pri. Servis Med360 li touzour', 'Don\'t worry — we\'ll provide you with the best options across all price points. Med360\'s service is always')} <strong>{l10n('gratuit pour les patients', 'gratis pou bann pasian', 'free for patients')}</strong>.</p>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="wizard-body animate-fade-in">
              <h2 className="wizard-title">{l10n('Vérifier & Soumettre', 'Revize & Soumet', 'Review & Submit')}</h2>
              <div className="review-summary">
                <div className="review-row"><span>{l10n('Nom', 'Nom', 'Name')}</span><strong>{formData.firstName} {formData.lastName}</strong></div>
                <div className="review-row"><span>Email</span><strong>{formData.email}</strong></div>
                <div className="review-row"><span>{l10n('Téléphone', 'Telefonn', 'Phone')}</span><strong>{formData.phone}</strong></div>
                <div className="review-row"><span>{l10n('Pays', 'Pei', 'Country')}</span><strong>{formData.countryOfResidence}</strong></div>
                {formData.serviceName && (
                  <div className="review-row" style={{ background: 'color-mix(in srgb, var(--color-primary) 6%, transparent)', padding: '0.4rem 0.6rem', borderRadius: 6 }}>
                    <span>{l10n('Service Demandé', 'Servis Demande', 'Requested Service')}</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{formData.serviceName}</strong>
                  </div>
                )}
                <div className="review-row"><span>{l10n('Spécialité', 'Spesialite', 'Specialty')}</span><strong>{selectedSpecialty ? l(selectedSpecialty, 'name') : formData.specialtyId}</strong></div>
                <div className="review-row"><span>{l10n('Urgence', 'Irzans', 'Urgency')}</span><strong style={{ textTransform: 'capitalize' }}>{formData.urgency}</strong></div>
                {formData.preferredCountry && <div className="review-row"><span>{l10n('Destination', 'Destinasion', 'Destination')}</span><strong>{formData.preferredCountry}</strong></div>}
              </div>
              <div className="review-note">
                <p>{l10n('En soumettant, vous acceptez que Med360 vous contacte concernant votre demande. Vos informations sont strictement confidentielles.', 'Kan ou soumet form la, ou dakor ki Med360 kontakte ou. Tou ou linformasion pou res sekre.', 'By submitting, you agree that Med360 will contact you regarding your inquiry. Your information is kept strictly confidential.')}</p>
                <p>{l10n('Après la soumission, WhatsApp s\'ouvrira pour vous connecter instantanément avec nous.', 'Apre ki ou finn soumet form la, WhatsApp pou ouver otomatikman pou ou kapav koz ar nou lamem.', 'After submission, WhatsApp will open so you can connect with us instantly.')}</p>
              </div>
              {error && <div className="wizard-error">{error}</div>}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="wizard-footer">
            {step > 1 && (
              <button className="btn btn-outline" onClick={prevStep} id="wiz-prev-btn">
                <ArrowLeft size={16} /> {l10n('Retour', 'Retour', 'Back')}
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < totalSteps ? (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                id="wiz-next-btn"
              >
                {l10n('Continuer', 'Kontinie', 'Continue')} <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => submit(selectedSpecialty ? l(selectedSpecialty, 'name') : formData.specialtyId)}
                id="wiz-submit-btn"
                disabled={submitting}
              >
                {submitting ? l10n('Soumission…', 'Pe Soumet…', 'Submitting…') : l10n('Soumettre & Ouvrir WhatsApp', 'Soumet & Ouver WhatsApp', 'Submit & Open WhatsApp')}
                <MessageCircle size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
