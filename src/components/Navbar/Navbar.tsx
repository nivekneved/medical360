import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  MessageCircle,
  Globe,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './Navbar.css';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Scroll detection for sticky blur navbar
  useEffect(() => {
    let ticking = false;
    let lastScrolled = window.scrollY > 15;
    setIsScrolled(lastScrolled);

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY > 15;
          if (current !== lastScrolled) {
            lastScrolled = current;
            setIsScrolled(current);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Language switcher (EN / FR / KR)
  const toggleLanguage = () => {
    const langs = ['en', 'fr', 'kr'];
    const currentIndex = langs.indexOf(i18n.language);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  const NAV_LINKS = [
    { to: '/specialties', label: isFr ? 'Spécialités' : isKr ? 'Spesialite' : 'Specialties' },
    { to: '/doctors', label: isFr ? 'Médecins' : isKr ? 'Dokter' : 'Surgeons' },
    { to: '/hospitals', label: isFr ? 'Hôpitaux' : isKr ? 'Lopital' : 'Hospitals' },
    { to: '/how-it-works', label: isFr ? 'Comment Ça Marche' : isKr ? 'Kouma Li Mase' : 'How It Works' },
    { to: '/about', label: isFr ? 'Notre Histoire' : isKr ? 'Nou Zistwar' : 'Our Story' },
    { to: '/contact', label: isFr ? 'Contact' : isKr ? 'Kontak' : 'Contact' },
  ];

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="Med360 Home">
          <img 
            src="/assets/logo.png" 
            alt="Med360" 
            className="navbar__logo-img" 
          />
        </Link>

        {/* Direct Desktop Links (Decluttered & Clean) */}
        <nav className="navbar__nav" aria-label="Main navigation">
          {NAV_LINKS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="navbar__actions">
          {/* Language Switcher */}
          <button
            className="navbar-icon-btn navbar-lang-btn"
            onClick={toggleLanguage}
            aria-label="Switch Language"
            title="Switch Language (EN / FR / KR)"
          >
            <Globe size={16} />
            <span className="lang-text">{i18n.language.toUpperCase()}</span>
          </button>

          {/* WhatsApp Direct Pill */}
          <a
            href={buildMed360WhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__whatsapp"
            aria-label="WhatsApp 24/7 Helpline"
            title="24/7 WhatsApp Medical Coordination"
          >
            <MessageCircle size={15} />
            <span className="navbar__whatsapp-text">WhatsApp</span>
          </a>

          {/* Primary Action CTA */}
          <button
            className="btn btn-primary btn-sm navbar__cta"
            onClick={() => navigate('/describe-need')}
            id="navbar-cta-btn"
          >
            <span>{isFr ? 'Avis Gratuit' : isKr ? 'Lavi Gratis' : 'Free Doctor Review'}</span>
            <ArrowRight size={14} />
          </button>

          {/* Discreet Admin Lock */}
          <Link
            to="/deven"
            className="navbar-admin-link"
            title="Staff Portal"
            aria-label="Staff Portal"
          >
            <Lock size={14} />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer (Clean & Direct) */}
      <div className={`navbar__mobile ${isOpen ? 'navbar__mobile--open' : ''}`}>
        <div className="navbar__mobile-inner">
          <nav className="navbar__mobile-nav">
            {NAV_LINKS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__mobile-actions">
            <button className="mobile-utility-btn" onClick={toggleLanguage} style={{ width: '100%' }}>
              <Globe size={18} color="var(--color-primary)" />
              <span>Language: <strong>{i18n.language.toUpperCase()}</strong></span>
            </button>

            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setIsOpen(false)}
            >
              <MessageCircle size={18} />
              <span>WhatsApp Hotline (+230 5918 8275)</span>
            </a>

            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                navigate('/describe-need');
                setIsOpen(false);
              }}
            >
              <span>{isFr ? 'Demander un Avis Médical Gratuit' : isKr ? 'Gagn Enn Lavi Dokter Gratis' : 'Get Free Doctor Review'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
