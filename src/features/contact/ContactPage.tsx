import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
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
        title={l10n('Nous Contacter', 'Kontakte Nou', 'Contact Us')}
        description={l10n('Contactez Med360 pour votre avis médical.', 'Kontakte Med360 pou ou lavi medikal.', 'Contact Med360 for your medical opinion.')}
        canonical="/contact"
      />
      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/about_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Contactez-Nous', 'Kontak Nou', 'Get in Touch'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Contact', 'Kontak', 'Contact Us'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Des questions ? Notre équipe est disponible 7 jours sur 7. Joignez-nous par WhatsApp, téléphone ou email.',
              'Ena kestion? Nou lekip la 7 zour lor 7. Kontak nou lor WhatsApp, telefonn ouswa email.',
              'Have questions? Our team is available 7 days a week. Reach us by WhatsApp, phone, or email.'
            ))}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            {/* Contact Info */}
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {tCms('reachUsTitle', l10n('Joignez-nous Directement', 'Koz Ar Nou Direk', 'Reach Us Directly'))}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                      {l10n('WhatsApp (Réponse Rapide)', 'WhatsApp (Pli Vit)', 'WhatsApp (Fastest Response)')}
                    </h3>
                    <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm" id="contact-whatsapp-btn" style={{ marginTop: 8 }}>
                      <MessageCircle size={16} /> +230 59188275
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                      {l10n('Téléphone', 'Telefonn', 'Phone')}
                    </h3>
                    <a href="tel:+23059188275" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>+230 59188275</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Email</h3>
                    <a href="mailto:info@med360.mu" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>info@med360.mu</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                      {l10n('Heures d\'Ouverture', 'Ler Ouver', 'Hours')}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      {l10n(
                        'Lun – Sam : 8h00 – 19h00 (MUT)\nWhatsApp disponible 7j/7',
                        'Lindi - Samdi: 08:00 - 19:00 (MUT)\nWhatsApp ouver 7 zour lor 7',
                        'Mon – Sat: 8:00 AM – 7:00 PM (MUT)\nWhatsApp available 7 days a week'
                      ).split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                      {l10n('Adresse', 'Adres', 'Location')}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      Med360 Ltd<br />Port Louis, {l10n('Île Maurice', 'Moris', 'Mauritius')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {l10n('Envoyer une demande rapide', 'Anvoy Enn Demann', 'Send a Quick Inquiry')}
              </h2>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {l10n('Message Transmis avec Succès !', 'Mesaz Inn Bien Sante !', 'Message Sent Successfully!')}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                    {l10n(
                      'Notre coordinateur médical vous contactera sous 24 heures.',
                      'Nou kordonater pou pran kontak ar ou dan 24h.',
                      'Our medical coordinator will review your request and contact you within 24 hours.'
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
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                      {l10n('Votre Nom *', 'Ou Nom *', 'Your Name *')}
                    </label>
                    <input
                      id="contact-name"
                      className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                      placeholder={l10n('Nom complet (ex: Priya Ramkhelawon)', 'Nom anantie', 'Full name (e.g. Priya Ramkhelawon)')}
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
                      {l10n('Comment pouvons-nous vous aider ? *', 'Kouma nou kapav ed ou? *', 'How can we help you? *')}
                    </label>
                    <textarea
                      id="contact-message"
                      className={`form-textarea ${errors.message ? 'form-input--error' : ''}`}
                      placeholder={l10n('Décrivez brièvement vos questions, soins recherchés...', 'Dekrir ou kestion...', 'Briefly describe your treatment questions...')}
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
                    <span>{l10n('Protection anti-spam et cryptage des données médicales activés.', 'Sekirite done medikal garanti.', 'Anti-spam protection & encrypted data exchange enabled.')}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ width: '100%', fontWeight: 700, marginTop: '0.25rem' }}
                    id="contact-send-btn"
                  >
                    {submitting ? (
                      <span>{l10n('Envoi en cours...', 'Pe anvoye...', 'Sending...')}</span>
                    ) : (
                      <>
                        <span>{l10n('Soumettre la Demande', 'Soumet Demann', 'Submit Inquiry')}</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
                    {l10n('Besoin d\'un devis détaillé ?', 'Bizin enn devi pli detaye?', 'Need a detailed medical cost estimate?')}{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/describe-need')}
                      style={{ color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {l10n('Formulaire complet →', 'Formiler konple →', 'Use Detailed Assessment →')}
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
