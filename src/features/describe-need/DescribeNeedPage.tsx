import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useInquiry } from '../../hooks/useInquiry';
import { useSpecialties } from '../../hooks/useSpecialties';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import './DescribeNeed.css';

const COUNTRIES = ['Mauritius', 'Réunion Island', 'Comoros', 'Madagascar', 'Seychelles', 'Maldives', 'South Africa', 'Kenya', 'France', 'United Kingdom', 'Other'];

export function DescribeNeedPage() {
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const { t, i18n } = useTranslation();
  const { specialties } = useSpecialties();
  const {
    step, totalSteps, formData, submitting, submitted,
    updateField, nextStep, prevStep, submit, reset, error
  } = useInquiry();
  const { data: cms } = useCMS('describe-need');

  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
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

  // Pre-select specialty from URL param
  const preSpecialty = params.get('specialty');
  if (preSpecialty && !formData.specialtyId) updateField('specialtyId', preSpecialty);

  const selectedSpecialty = specialties.find(s => s.id === formData.specialtyId);

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
              ? <>Merci ! Votre dossier a été reçu. Un gestionnaire de cas dédié de Medical 360 vous contactera dans les <strong>24 heures</strong>. Nous avons également ouvert WhatsApp pour que vous puissiez discuter avec nous dès maintenant.</>
              : i18n.language === 'kr'
              ? <>Mersi! Nou finn gagn ou dosie. Enn koordinater Medical 360 pou pran kontak ar ou dan <strong>24 er-tan</strong>. Nou finn osi ouver WhatsApp pou ou kapav koz ar nou lamem.</>
              : <>Thank you! Your case has been received. A dedicated case manager from Medical 360 will contact you within <strong>24 hours</strong>. We've also opened WhatsApp for you to chat with us right now.</>}
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
      <SEO 
        title={l10n('Décrivez Votre Besoin', 'Dekrir Ou Bizin', 'Describe Your Need')}
        description={l10n('Obtenez un avis médical gratuit.', 'Gagn ou lavi medikal gratis.', 'Get a free medical opinion.')}
        canonical="/describe-need"
      />
      <section className="page-hero page-hero--sm">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <h1 className="text-h1" style={{ color: 'white' }}>
            {tCms('heroTitle', l10n('Décrivez Votre Besoin', 'Dekrir Ou Bizin', 'Describe Your Need'))}
          </h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500 }}>
            {tCms('heroDesc', l10n(
              'Remplissez le formulaire ci-dessous et notre équipe médicale vous répondra avec des recommandations personnalisées — gratuitement.',
              'Ranpli form ki anba la e nou lekip medikal pou reponn ou avek bann rekomandasion lopital personalize — pou nanye ditou.',
              'Fill in the form below and our medical team will get back to you with personalised hospital recommendations — free of charge.'
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
              <h2 className="wizard-title">{l10n('Vos Détails Personnels', 'Ou Bann Detay', 'Your Personal Details')}</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-firstName">{l10n('Prénom *', 'Prenon *', 'First Name *')}</label>
                  <input id="wiz-firstName" className="form-input" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="e.g. Rajesh" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-lastName">{l10n('Nom *', 'Nom *', 'Last Name *')}</label>
                  <input id="wiz-lastName" className="form-input" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="e.g. Ramkhelawon" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-email">{l10n('Adresse Email *', 'Adres Email *', 'Email Address *')}</label>
                  <input id="wiz-email" className="form-input" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-phone">{l10n('Téléphone / WhatsApp *', 'Telefonn / WhatsApp *', 'Phone / WhatsApp *')}</label>
                  <input id="wiz-phone" className="form-input" type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+230 5x xxx xxx" required />
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
              <div className="form-group">
                <label className="form-label" htmlFor="wiz-specialty">{l10n('Spécialité Médicale *', 'Spesialite Medikal *', 'Medical Specialty *')}</label>
                <select id="wiz-specialty" className="form-select" value={formData.specialtyId} onChange={e => updateField('specialtyId', e.target.value)}>
                  <option value="">{l10n('-- Sélectionnez la Spécialité --', '-- Swazir Spesialite --', '-- Select Specialty --')}</option>
                  {specialties.map(s => <option key={s.id} value={s.id}>{l(s, 'name')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wiz-description">{l10n('Décrivez Votre Condition *', 'Dekrir Ou Problem Sant *', 'Describe Your Condition *')}</label>
                <textarea
                  id="wiz-description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder={l10n(
                    'Veuillez décrire votre état de santé, tout diagnostic que vous avez reçu et le type de traitement ou d\'avis que vous recherchez…',
                    'Silvouple dekrir ou maladi, si dokter inn dir ou kitsoz, ek ki kalite tretman ou pe rode…',
                    'Please describe your medical condition, any diagnosis you have received, and what type of treatment or opinion you are looking for…'
                  )}
                  style={{ minHeight: 160 }}
                  required
                />
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
                <div className="review-row"><span>{l10n('Spécialité', 'Spesialite', 'Specialty')}</span><strong>{selectedSpecialty ? l(selectedSpecialty, 'name') : formData.specialtyId}</strong></div>
                <div className="review-row"><span>{l10n('Urgence', 'Irzans', 'Urgency')}</span><strong style={{ textTransform: 'capitalize' }}>{formData.urgency}</strong></div>
                {formData.preferredCountry && <div className="review-row"><span>{l10n('Destination', 'Destinasion', 'Destination')}</span><strong>{formData.preferredCountry}</strong></div>}
              </div>
              <div className="review-note">
                <p>{l10n('En soumettant, vous acceptez que Medical 360 vous contacte concernant votre demande. Vos informations sont strictement confidentielles.', 'Kan ou soumet form la, ou dakor ki Medical 360 kontakte ou. Tou ou linformasion pou res sekre.', 'By submitting, you agree that Medical 360 will contact you regarding your inquiry. Your information is kept strictly confidential.')}</p>
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
                onClick={nextStep}
                id="wiz-next-btn"
                disabled={
                  (step === 1 && (!formData.firstName || !formData.email || !formData.phone)) ||
                  (step === 2 && (!formData.specialtyId || !formData.description))
                }
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
