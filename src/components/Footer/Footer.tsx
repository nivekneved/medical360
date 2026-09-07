import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { usePlatformSettings } from '../../core/services/settings.service';
import { 
  WHATSAPP_DISPLAY, 
  PHONE_DISPLAY, 
  PHONE_RAW, 
  CONTACT_EMAIL, 
  SITE_ADDRESS, 
  SITE_NAME, 
  PARENT_NGO_NAME, 
  SITE_METRICS 
} from '../../core/config/site';
import './Footer.css';

export function Footer() {
  const { t } = useTranslation();
  const { settings } = usePlatformSettings();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img 
                src="/assets/logo.png" 
                alt={SITE_NAME} 
                className="footer__logo-img" 
              />
            </Link>
            <p className="footer__tagline">
              {t('footer.tagline')}
            </p>
            <div className="footer__contact">
              <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="footer__contact-item">
                <MessageCircle size={16} /> {WHATSAPP_DISPLAY}
              </a>
              <a href={`tel:+${PHONE_RAW}`} className="footer__contact-item">
                <Phone size={16} /> {PHONE_DISPLAY}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="footer__contact-item">
                <Mail size={16} /> {CONTACT_EMAIL}
              </a>
              <div className="footer__contact-item" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                <MapPin size={16} style={{ flexShrink: 0 }} /> {SITE_ADDRESS.short}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">{t('footer.quickLinks')}</h4>
            <ul className="footer__links">
              <li><Link to="/specialties">{t('nav.specialties')}</Link></li>
              <li><Link to="/hospitals">{t('nav.hospitals')}</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              {settings.enableCostComparison && (
                <li><Link to="/cost-calculator">Cost Calculator</Link></li>
              )}
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Specialties */}
          <div className="footer__col">
            <h4 className="footer__heading">{t('footer.topSpecialties')}</h4>
            <ul className="footer__links">
              <li><Link to="/specialties/sp-oncology">🎗️ {t('footer.specialtiesList.oncology')}</Link></li>
              <li><Link to="/specialties/sp-cardiology">❤️ {t('footer.specialtiesList.cardiology')}</Link></li>
              <li><Link to="/specialties/sp-orthopedics">🦴 {t('footer.specialtiesList.orthopedics')}</Link></li>
              <li><Link to="/specialties/sp-neurology">🧠 {t('footer.specialtiesList.neurology')}</Link></li>
              <li><Link to="/specialties/sp-transplant">🫀 {t('footer.specialtiesList.transplant')}</Link></li>
              <li><Link to="/specialties/sp-haematology">🩸 Haematology & BMT</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div className="footer__col">
            <h4 className="footer__heading">{t('common.getStarted')}</h4>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              {t('footer.freeOpinionDesc')}
            </p>
            <Link to="/describe-need?from=Footer+CTA&serviceName=Free+Doctor+Review" className="btn btn-accent btn-sm" id="footer-cta-btn">
              {t('nav.freeOpinion')}
            </Link>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ marginTop: '0.75rem', display: 'inline-flex' }}
              id="footer-whatsapp-btn"
            >
              <MessageCircle size={16} /> {t('nav.whatsapp')}
            </a>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.78rem',
          color: 'rgba(255, 255, 255, 0.45)',
          lineHeight: 1.6,
          textAlign: 'center',
        }}>
          {SITE_NAME} is a social enterprise owned by the NGO {PARENT_NGO_NAME}. Backed by {SITE_METRICS.yearsExperience} of humanitarian care, {SITE_METRICS.impactPercent} of company profits are returned to the NGO to fund medical treatments and surgeries for patients in need. Medical diagnoses and surgical procedures are performed by accredited partner hospitals and licensed doctors.
        </div>

        <div className="footer__bottom">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved. | {SITE_ADDRESS.locality}, {SITE_ADDRESS.country}</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              Designed & Developed with <span style={{ color: '#ef4444' }}>♥</span> by <strong style={{ color: '#10b981' }}>Deven</strong>
            </p>
          </div>
          <div className="footer__bottom-links" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/cookies" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Cookies</Link>
            <Link to="/medical-disclaimer" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Medical Disclaimer</Link>
            <Link to="/deven" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
