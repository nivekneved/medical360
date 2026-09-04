import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './Footer.css';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img 
                src="/assets/logo.png" 
                alt="Med360" 
                className="footer__logo-img" 
              />
            </Link>
            <p className="footer__tagline">
              {t('footer.tagline')}
            </p>
            <div className="footer__contact">
              <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="footer__contact-item">
                <MessageCircle size={16} /> +230 59188275
              </a>
              <a href="tel:+23059188275" className="footer__contact-item">
                <Phone size={16} /> +230 59188275
              </a>
              <a href="mailto:info@med360.mu" className="footer__contact-item">
                <Mail size={16} /> info@med360.mu
              </a>
              <div className="footer__contact-item">
                <MapPin size={16} /> Port Louis, Mauritius
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__heading">{t('footer.quickLinks')}</h4>
            <ul className="footer__links">
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/hospitals">{t('nav.hospitals')}</Link></li>
              <li><Link to="/specialties">{t('nav.specialties')}</Link></li>
              <li><Link to="/doctors">{t('nav.doctors')}</Link></li>
              <li><Link to="/services">{t('nav.services')}</Link></li>
              <li><Link to="/case-studies">{t('nav.caseStudies')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Specialties */}
          <div className="footer__col">
            <h4 className="footer__heading">{t('footer.topSpecialties')}</h4>
            <ul className="footer__links">
              <li><Link to="/specialties/sp-cardiology">{t('footer.specialtiesList.cardiology')}</Link></li>
              <li><Link to="/specialties/sp-oncology">{t('footer.specialtiesList.oncology')}</Link></li>
              <li><Link to="/specialties/sp-orthopedics">{t('footer.specialtiesList.orthopedics')}</Link></li>
              <li><Link to="/specialties/sp-neurology">{t('footer.specialtiesList.neurology')}</Link></li>
              <li><Link to="/specialties/sp-transplant">{t('footer.specialtiesList.transplant')}</Link></li>
              <li><Link to="/specialties/sp-ivf">{t('footer.specialtiesList.ivf')}</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div className="footer__col">
            <h4 className="footer__heading">{t('common.getStarted')}</h4>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              {t('footer.freeOpinionDesc')}
            </p>
            <Link to="/describe-need" className="btn btn-accent btn-sm" id="footer-cta-btn">
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
          Med360 is a social enterprise owned by the NGO Enn Rev Enn Sourir. Backed by 10+ years of humanitarian care, 100% of company profits are returned to the NGO to fund medical treatments and surgeries for patients in need. Medical diagnoses and surgical procedures are performed by accredited partner hospitals and licensed doctors.
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Med360. All rights reserved. | Port Louis, Mauritius</p>
          <div className="footer__bottom-links" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <Link to="/privacy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/admin" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem' }}>Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
