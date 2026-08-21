import { MapPin, Phone, Mail, MessageCircle, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';

export function ContactPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { data: cms } = useCMS('contact');
  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
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
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(6,95,70,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
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
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(6,95,70,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Email</h3>
                    <a href="mailto:info@med360.mu" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>info@med360.mu</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(6,95,70,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
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
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(6,95,70,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    {l10n('Votre Nom', 'Ou Nom', 'Your Name')}
                  </label>
                  <input id="contact-name" className="form-input" placeholder={l10n('Nom complet', 'Nom anantie', 'Full name')} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-contact">
                    {l10n('Email ou WhatsApp', 'Email ouswa WhatsApp', 'Email or WhatsApp')}
                  </label>
                  <input id="contact-contact" className="form-input" placeholder={l10n('votre@email.com ou +230...', 'ou@email.com ouswa +230...', 'your@email.com or +230...')} />
                </div>
                <div className="form-group">
                  <textarea id="contact-message" className="form-textarea" placeholder={l10n('Comment pouvons-nous vous aider ?', 'Kouma nou kapav ed ou?', 'How can we help you?')} style={{ minHeight: 120 }} />
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} id="contact-send-btn" onClick={() => navigate('/describe-need')}>
                  {l10n('Soumettre', 'Soumet', 'Submit Inquiry')} <ArrowRight size={16} />
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
                  {l10n('Ou utilisez notre formulaire détaillé pour un service plus rapide.', 'Ouswa servi nou form medikal pou enn servis pli vit.', 'Or use our detailed medical inquiry form for faster service.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
