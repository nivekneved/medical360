import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">M</div>
              <div>
                <span className="footer__logo-name">Medical</span>
                <span className="footer__logo-accent">360</span>
              </div>
            </div>
            <p className="footer__tagline">
              Connecting Mauritius to world-class healthcare, one patient at a time.
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
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/hospitals">Associated Hospitals</Link></li>
              <li><Link to="/specialties">Our Specialties</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/case-studies">Case Studies</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Specialties */}
          <div className="footer__col">
            <h4 className="footer__heading">Top Specialties</h4>
            <ul className="footer__links">
              <li><Link to="/specialties/sp-cardiology">Cardiology</Link></li>
              <li><Link to="/specialties/sp-oncology">Oncology</Link></li>
              <li><Link to="/specialties/sp-orthopedics">Orthopedics</Link></li>
              <li><Link to="/specialties/sp-neurology">Neurology</Link></li>
              <li><Link to="/specialties/sp-transplant">Organ Transplants</Link></li>
              <li><Link to="/specialties/sp-ivf">IVF &amp; Fertility</Link></li>
            </ul>
          </div>

          {/* CTA */}
          <div className="footer__col">
            <h4 className="footer__heading">Get Started</h4>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Our service is free for patients. Get a free medical opinion today.
            </p>
            <Link to="/describe-need" className="btn btn-accent btn-sm" id="footer-cta-btn">
              Describe Your Need
            </Link>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ marginTop: '0.75rem', display: 'inline-flex' }}
              id="footer-whatsapp-btn"
            >
              <MessageCircle size={16} /> WhatsApp Us
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Med360 Ltd. All rights reserved. | Port Louis, Mauritius</p>
          <div className="footer__bottom-links">
            <Link to="/admin">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
