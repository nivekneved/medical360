import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Building2 } from 'lucide-react';
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
import { sendContactEmail } from '../../core/services/email.service';

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

      // Dispatch notification email to test recipient
      sendContactEmail({
        name: cleanName,
        contact: cleanContact,
        message: cleanMessage,
        sourcePage: 'Contact Us Page (/contact)',
      }).catch(err => console.warn('Contact email dispatch failed:', err));

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
        title={l10n("Quand Votre Santé Ne Peut Pas Attendre · Contact Med360", "Kan Ou Lasante Pa Kapav Atann · Kontak Med360", "When Your Health Can’t Wait, Neither Should You · Contact Med360")}
        description={l10n(
          "Parlez à un Patient Navigator dès aujourd'hui. Sedeco Ltée, Port-Louis, Maurice. WhatsApp: +230 5918 8275.",
          "Koz ar enn Patient Navigator zordi. Sedeco Ltée, Porlwi, Moris. WhatsApp: +230 5918 8275.",
          "Speak to a Patient Navigator today. Sedeco Ltée, 4ème étage, IKS Building, Cnr R. Seeneevassen & Farquhar Streets, Port-Louis 11613, Mauritius. WhatsApp: +230 5918 8275."
        )}
        canonical="/contact"
      />

      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/about_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('✦ Contactez Notre Équipe de Navigation Patient', '✦ Pran Kontak ar Nou Lekip Patient Navigator', '✦ Contact Us · Dedicated Patient Navigation'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Quand Votre Santé Ne Peut Pas Attendre, Vous Non Plus.', 'Kan Ou Lasante Pa Kapav Atann, Ou Osi Pa Bizin Atann.', 'When Your Health Can’t Wait, Neither Should You.'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Faire face à un diagnostic ou envisager un traitement à l\'étranger soulève de nombreuses questions. Vous n\'avez pas à parcourir ce chemin seul. Que vous recherchiez un deuxième avis médical, une consultation de spécialiste, des soins à l\'étranger ou une assistance complète, l\'équipe de Med360 est prête à vous écouter et vous guider vers la prochaine étape.',
              'Gagn enn diagnostik ouswa pans al swanye a letranze amenn boukou kestion. Ou pa tousel dan sa vwayaz la. Ki ou pe rod enn deziem lavi dokter, telekonsiltasion spesialis ouswa lasistans konple, lekip Med360 pre pou ekout ou ek gid ou.',
              'Facing a diagnosis or considering treatment abroad can bring many questions. You don\'t have to navigate the journey alone. Whether you are looking for a second medical opinion, specialist consultation, treatment abroad, hospital recommendation or complete medical travel assistance, the Med360 team is ready to listen, understand your needs and guide you towards the next step.'
            ))}
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="section" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="container">
          {/* Top Callout Box */}
          <div style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, var(--color-surface)) 0%, var(--color-surface) 100%)',
            border: '1.5px solid color-mix(in srgb, var(--color-primary) 30%, transparent)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '3rem',
          }}>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 0.5rem' }}>
              {l10n(
                '« Une conversation peut changer la trajectoire de vos soins. Commencez la vôtre dès aujourd\'hui. »',
                '« Enn konversasion kapav sanz ou vwayaz lasante. Koumans ou par zordi. »',
                '“One conversation could change the direction of your healthcare journey. Start yours today.”'
              )}
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', margin: '0 0 1.5rem' }}>
              {l10n(
                'Parlez à un Patient Navigator dès aujourd\'hui et faites le premier pas vers les soins dont vous avez besoin.',
                'Koz ar enn Patient Navigator zordi mem ek fer premie pa ver bann meyer swen.',
                'Speak to a Patient Navigator today and take the first step towards the care you need.'
              )}
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
            }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/describe-need')}
                style={{ fontWeight: 800 }}
                id="contact-cta-book-btn"
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
                id="contact-whatsapp-top-btn"
              >
                <MessageCircle size={20} />
                <span>{l10n('DISCUTER SUR WHATSAPP', 'KOZ AR NOU LOR WHATSAPP', 'CHAT WITH US ON WHATSAPP')}</span>
              </a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            {/* Contact Info Card */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.75rem', color: 'var(--color-text)' }}>
                {tCms('reachUsTitle', l10n('Prendre Contact (Get in Touch)', 'Pran Kontak', 'Get in Touch'))}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>
                      {l10n('WhatsApp & Téléphone', 'WhatsApp & Telefonn', 'WhatsApp & Phone')}
                    </h3>
                    <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {l10n('Échangez directement avec un coordinateur patient', 'Koz direk ar enn kordonater', 'Speak directly with a Patient Navigator')}
                    </p>
                    <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm" id="contact-whatsapp-btn">
                      <MessageCircle size={16} /> +230 5918 8275
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>
                      {l10n('Email', 'Email', 'Email')}
                    </h3>
                    <a href="mailto:info@med360.mu" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}>info@med360.mu</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>
                      {l10n('Nos Bureaux (Visit Our Office)', 'Nou Biro', 'Visit Our Office')}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      <strong>Med360</strong><br />
                      Sedeco Ltée, 4ème étage, IKS Building<br />
                      Cnr R. Seeneevassen & Farquhar Streets<br />
                      Port-Louis 11613, Mauritius
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--color-text)' }}>
                      {l10n('Horaires d\'Ouverture', 'Ler Ouver Biro', 'Office Operating Hours')}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {l10n(
                        'Lundi – Samedi : 08h00 – 19h00 (MUT)\nService d\'astreinte WhatsApp actif 7j/7',
                        'Lindi - Samdi: 08:00 - 19:00 (MUT)\nWhatsApp ouver 7 zour lor 7',
                        'Monday – Saturday: 8:00 AM – 7:00 PM (MUT)\nWhatsApp helpline active 7 days a week'
                      ).split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
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
                {l10n('Votre santé mérite l\'action, pas l\'incertitude. Laissez-nous vos coordonnées, un coordinateur vous répond rapidement.', 'Ou lasante merite laksion. Les ou kontak, enn kordonater repon ou bien vit.', 'Your health deserves action, not uncertainty. Leave your details, a Patient Navigator will reach out shortly.')}
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={48} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {l10n('Message Transmis avec Succès !', 'Mesaz Inn Bien Sante !', 'Message Sent Successfully!')}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {l10n(
                      'Notre Patient Navigator étudie votre demande et prendra contact avec vous très rapidement.',
                      'Nou Patient Navigator pe get ou dosie ek pou pran kontak ar ou bien vit.',
                      'Our Patient Navigator is reviewing your request and will contact you shortly.'
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
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  {/* Email or Phone Input */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email-phone">
                      {l10n('Numéro de Téléphone / WhatsApp ou Email *', 'Nimero Telefonn / WhatsApp ouswa Email *', 'Phone / WhatsApp Number or Email *')}
                    </label>
                    <input
                      id="contact-email-phone"
                      className={`form-input ${errors.contact ? 'form-input--error' : ''}`}
                      placeholder={l10n('Ex: 5918 8275 ou email@example.mu', '59188275 ouswa email', 'E.g. +230 5918 8275 or email@domain.com')}
                      value={contact}
                      onChange={(e) => { setContact(e.target.value); if (errors.contact) setErrors(prev => ({ ...prev, contact: undefined })); }}
                      style={{ borderColor: errors.contact ? '#ef4444' : undefined }}
                    />
                    {errors.contact && <span className="form-error">{errors.contact}</span>}
                  </div>

                  {/* Message Input */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">
                      {l10n('Décrivez Brièvement Vos Besoins Médicaux *', 'Dekrir Ou Bezwin Medikal *', 'Briefly Describe Your Medical Needs *')}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      className={`form-input ${errors.message ? 'form-input--error' : ''}`}
                      placeholder={l10n('Décrivez vos symptômes, examens ou questions pour nos spécialistes...', 'Dekrir ou bann sintom, rapor ouswa kestion...', 'Describe your symptoms, scans, or questions for our specialists...')}
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors(prev => ({ ...prev, message: undefined })); }}
                      style={{ borderColor: errors.message ? '#ef4444' : undefined, resize: 'vertical' }}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                    style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', fontWeight: 800 }}
                  >
                    {submitting ? l10n('Transmission en cours...', 'Pe avoye...', 'Submitting...') : l10n('Envoyer Mon Message', 'Avoy Mo Mesaz', 'Send Message')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default ContactPage;
