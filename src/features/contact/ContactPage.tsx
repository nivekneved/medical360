import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle, Sparkles, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { Honeypot } from '../../components/Honeypot/Honeypot';
import {
  validateName,
  validateEmailOrPhone,
  validateDescription,
  isHoneypotClean,
} from '../../core/services/validation.service';
import { sanitizeInput, checkRateLimit } from '../../core/services/security.service';
import { mockEngine } from '../../core/mock/engine';

export function ContactPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { data: cms } = useCMS('contact');
  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;

  // Form State
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<{ name?: string; contact?: string; message?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const nameVal = validateName(name, l10n('Votre nom', 'Ou nom', 'Your name'), 2);
    if (!nameVal.isValid) newErrors.name = nameVal.error;

    const contactVal = validateEmailOrPhone(contact, true);
    if (!contactVal.isValid) newErrors.contact = contactVal.error;

    const msgVal = validateDescription(message, l10n('Votre message', 'Ou mesaz', 'Your message'), 8);
    if (!msgVal.isValid) newErrors.message = msgVal.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot check
    if (!isHoneypotClean(honeypot)) {
      console.warn('🛡️ Security: Honeypot triggered on contact form. Bot discarded.');
      setSubmitted(true);
      return;
    }

    // 2. Validate all fields
    if (!validateForm()) {
      return;
    }

    // 3. Rate limiting check
    const rateCheck = checkRateLimit('contact_quick_inquiry', 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      setErrors({ form: `Too many submissions. Please wait ${rateCheck.remainingCooldownSeconds}s.` });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const cleanName = sanitizeInput(name);
      const cleanContact = sanitizeInput(contact);
      const cleanMessage = sanitizeInput(message);
      const isEmail = cleanContact.includes('@');

      await mockEngine.createInquiry({
        firstName: cleanName.split(' ')[0] || cleanName,
        lastName: cleanName.split(' ').slice(1).join(' ') || '-',
        email: isEmail ? cleanContact : `${cleanName.toLowerCase().replace(/\s+/g, '')}@patient.mu`,
        phone: !isEmail ? cleanContact : '+230 59188275',
        countryOfResidence: 'Mauritius',
        specialtyId: 'sp-general',
        description: `[Quick Contact Inquiry]: ${cleanMessage} (Contact: ${cleanContact})`,
        urgency: 'routine',
      });

      setSubmitted(true);
    } catch (err: any) {
      setErrors({ form: err?.message || 'Failed to submit inquiry. Please WhatsApp us directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('Nous Contacter & Prendre Rendez-vous · Medical 360 Ltd', 'Kontakte Nou & Pran Randevou · Medical 360 Ltd', 'Contact Us & Book Medical Consultation · Medical 360 Ltd')}
        description={l10n(
          'Contactez l\'équipe de coordinateurs médicaux de Medical 360 Ltd à Port-Louis, Île Maurice. WhatsApp: +230 5918 8275. Avis médical gratuit en 24-48h.',
          'Pran kontak ar lekip Medical 360 Ltd dan Port-Louis, Moris. WhatsApp: +230 5918 8275. Lavi dokter gratis dan 24-48h.',
          'Connect with Medical 360 Ltd coordinators in Port Louis, Mauritius. WhatsApp: +230 5918 8275. Free specialist second opinion within 24-48 hours.'
        )}
        canonical="/contact"
      />

      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/about_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Une Équipe Attentionnée à Votre Écoute 7j/7', 'Enn Lekip avek Leker Pre ar Ou 7j/7', 'A Caring Clinical Team by Your Side 7 Days a Week'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Contactez Medical 360 Ltd', 'Kontakte Medical 360 Ltd', 'Contact Medical 360 Ltd'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Que vous ayez une interrogation sur un traitement, besoin d\'un avis rapide ou simplement envie de parler à un coordinateur dévoué — notre équipe vous répond avec écoute et bienveillance 7 jours sur 7.',
              'Ki ou ena enn kestion lor enn loperasion, bezin enn lavi rapid ouswa zis anvi koz ar enn kordonater — nou la pou reponn ou avek bon leker 7 zour lor 7.',
              'Whether you have questions about a surgery, need a fast opinion, or simply wish to speak with someone who cares — our dedicated team is here for you every single day.'
            ))}
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="section" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="container">
          {/* Top Quick Actions */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '3rem',
          }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/describe-need')}
              style={{ fontWeight: 800 }}
            >
              <Sparkles size={18} />
              <span>{l10n('RÉSERVER UNE CONSULTATION MÉDICALE', 'REZERV OU KONSILTASION MEDIKAL', 'BOOK YOUR MEDICAL CONSULTATION')}</span>
              <ArrowRight size={18} />
            </button>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
              style={{ fontWeight: 800 }}
            >
              <MessageCircle size={20} />
              <span>{l10n('DISCUTER SUR WHATSAPP', 'KOZ AR NOU LOR WHATSAPP', 'CHAT WITH US ON WHATSAPP')}</span>
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            {/* Contact Info Card */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.75rem', color: 'var(--color-text)' }}>
                {tCms('reachUsTitle', l10n('Coordonnées & Siège', 'Nou Ladres & Nimero', 'Contact Details & Office'))}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>
                      {l10n('WhatsApp & Urgences (Réponse Prioritaire)', 'WhatsApp & Irzans (Pli Vit)', 'WhatsApp & Emergency Dispatch')}
                    </h3>
                    <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {l10n('Disponible 24h/24 et 7j/7 pour transmission de bilans', 'Disponib 24/7 pou avoy rapor', 'Available 24/7 for instant medical file review')}
                    </p>
                    <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm" id="contact-whatsapp-btn">
                      <MessageCircle size={16} /> +230 5918 8275
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>
                      {l10n('Ligne Directe', 'Telefonn', 'Direct Line')}
                    </h3>
                    <a href="tel:+23059188275" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}>+230 5918 8275</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>Email</h3>
                    <a href="mailto:info@med360.mu" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}>info@med360.mu</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>
                      {l10n('Heures d\'Ouverture des Bureaux', 'Ler Ouver Biro', 'Office Operating Hours')}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {l10n(
                        'Lundi – Samedi : 08h00 – 19h00 (MUT)\nService d\'astreinte WhatsApp actif 7j/7',
                        'Lindi - Samdi: 08:00 - 19:00 (MUT)\nWhatsApp ouver 7 zour lor 7',
                        'Monday – Saturday: 8:00 AM – 7:00 PM (MUT)\nWhatsApp hotline active 7 days a week'
                      ).split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>
                      {l10n('Adresse de l\'Entité', 'Ladres Lakonpanyi', 'Company Office')}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      <strong>Medical 360 Ltd</strong><br />
                      Port Louis, {l10n('Île Maurice', 'Moris', 'Mauritius')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
                {l10n('Envoyer une Demande Rapide', 'Anvoy Enn Demann Rapid', 'Send a Quick Message')}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                {l10n('Laissez-nous vos coordonnées, un coordinateur vous répond dans les 2 heures.', 'Les ou kontak, enn kordonater repon ou dan 2 erd-tan.', 'Leave your details, a coordinator will reach out within 2 hours.')}
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {l10n('Message Transmis avec Succès !', 'Mesaz Inn Bien Sante !', 'Message Sent Successfully!')}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {l10n(
                      'Notre coordinateur médical étudie votre demande et prendra contact avec vous très rapidement.',
                      'Nou kordonater medikal pe get ou dosie ek pou pran kontak ar ou bien vit.',
                      'Our medical coordinator is reviewing your request and will contact you shortly.'
                    )}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => { setSubmitted(false); setName(''); setContact(''); setMessage(''); }}
                  >
                    {l10n('Envoyer un autre message', 'Anvoy enn lot mesaz', 'Send another message')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  {/* Anti-Bot Honeypot */}
                  <Honeypot value={honeypot} onChange={setHoneypot} id="contact_verification_hp" name="contact_verification_hp" />

                  {errors.form && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <AlertCircle size={16} /> {errors.form}
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-name">
                      {l10n('Votre Nom Complet *', 'Ou Nom Anantie *', 'Your Full Name *')}
                    </label>
                    <input
                      id="contact-name"
                      className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                      placeholder={l10n('Ex: Priya Ramkhelawon', 'Nom anantie', 'E.g. Priya Ramkhelawon')}
                      value={name}
                      onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: undefined })); }}
                      style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                    />
                    {errors.name && (
                      <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Contact Input (Email / WhatsApp) */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-contact">
                      {l10n('Email ou Numéro WhatsApp *', 'Email ouswa WhatsApp *', 'Email or WhatsApp Number *')}
                    </label>
                    <input
                      id="contact-contact"
                      className={`form-input ${errors.contact ? 'form-input--error' : ''}`}
                      placeholder={l10n('votre@email.com ou +230 5...', 'ou@email.com ouswa +230 5...', 'your@email.com or +230 5...')}
                      value={contact}
                      onChange={(e) => { setContact(e.target.value); if (errors.contact) setErrors(prev => ({ ...prev, contact: undefined })); }}
                      style={{ borderColor: errors.contact ? '#ef4444' : undefined }}
                    />
                    {errors.contact && (
                      <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>
                        {errors.contact}
                      </span>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">
                      {l10n('Votre Message ou Situation Médicale *', 'Ou Mesaz ouswa Sitiasion Medikal *', 'Your Message or Medical Situation *')}
                    </label>
                    <textarea
                      id="contact-message"
                      className={`form-textarea ${errors.message ? 'form-input--error' : ''}`}
                      placeholder={l10n('Précisez la spécialité recherchée, symptômes ou questions...', 'Dekrir ou kestion...', 'Describe your symptoms, condition, or desired hospital/specialty...')}
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors(prev => ({ ...prev, message: undefined })); }}
                      style={{ minHeight: 120, borderColor: errors.message ? '#ef4444' : undefined }}
                    />
                    {errors.message && (
                      <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: 4, display: 'block', fontWeight: 600 }}>
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    <ShieldCheck size={14} color="var(--color-primary)" />
                    <span>{l10n('Protection anti-spam et stricte confidentialité des données médicales.', 'Sekirite done medikal garanti.', 'Anti-spam protection & strict patient data confidentiality.')}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', fontWeight: 800, marginTop: '0.25rem' }}
                    id="contact-send-btn"
                  >
                    {submitting ? (
                      <span>{l10n('Envoi en cours...', 'Pe anvoye...', 'Sending...')}</span>
                    ) : (
                      <>
                        <span>{l10n('ENVOYER LA DEMANDE', 'SOUSET DEMANN', 'SUBMIT INQUIRY')}</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
                    {l10n('Vous disposez déjà de rapports et d\'analyses ?', 'Ou finn fini gagn bann analiz?', 'Have medical scans and doctor reports ready?')}{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/describe-need')}
                      style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {l10n('Demande d\'avis détaillée →', 'Formiler konple →', 'Use Detailed Review Form →')}
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
