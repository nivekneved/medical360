import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  MessageCircle,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './Navbar.css';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  // Close mobile drawer & dropdown on route change
  useEffect(() => {
    setIsOpen(false);
    setAboutOpen(false);
  }, [location.pathname, location.hash]);

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

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  const ABOUT_SUBLINKS = [
    { to: '/about', label: isFr ? 'Notre Histoire' : isKr ? 'Nou Zistwar' : 'Our Story' },
    { to: '/about#board-members', label: isFr ? 'Conseil d\'Administration' : isKr ? 'Komite Direksion' : 'Board Members' },
  ];

  const isAboutActive = location.pathname === '/about';

  const NAV_LINKS_BEFORE = [
    { to: '/specialties', label: isFr ? 'Spécialités' : isKr ? 'Spesialite' : 'Specialties' },
    { to: '/hospitals', label: isFr ? 'Hôpitaux' : isKr ? 'Lopital' : 'Hospitals' },
    { to: '/how-it-works', label: isFr ? 'Comment Ça Marche' : isKr ? 'Kouma Li Mase' : 'How It Works' },
  ];

  const NAV_LINKS_AFTER = [
    { to: '/contact', label: isFr ? 'Contact' : isKr ? 'Kontak' : 'Contact' },
    { to: '/podcast', label: isFr ? 'Podcast' : isKr ? 'Podcast' : 'Podcast' },
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

        {/* Direct Desktop Links + About Us Submenu */}
        <nav className="navbar__nav" aria-label="Main navigation">
          {NAV_LINKS_BEFORE.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}

          {/* About Us Dropdown */}
          <div
            className={`navbar__dropdown ${aboutOpen ? 'navbar__dropdown--open' : ''}`}
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              type="button"
              className={`navbar__link navbar__dropdown-trigger ${isAboutActive ? 'navbar__link--active' : ''}`}
              aria-expanded={aboutOpen}
              aria-haspopup="menu"
              onClick={() => setAboutOpen(prev => !prev)}
            >
              <span>{isFr ? 'À Propos' : isKr ? 'Lor Nou' : 'About Us'}</span>
              <ChevronDown size={14} className="navbar__dropdown-chevron" />
            </button>
            <div className="navbar__dropdown-menu" role="menu">
              {ABOUT_SUBLINKS.map(sub => (
                <Link
                  key={sub.to}
                  to={sub.to}
                  role="menuitem"
                  className="navbar__dropdown-item"
                  onClick={() => setAboutOpen(false)}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          </div>

          {NAV_LINKS_AFTER.map(item => (
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
            onClick={() => navigate('/describe-need?from=Header+Navigation+CTA&serviceName=Free+Doctor+Review')}
            id="navbar-cta-btn"
          >
            <span>{isFr ? 'Avis Gratuit' : isKr ? 'Lavi Gratis' : 'Free Doctor Review'}</span>
            <ArrowRight size={14} />
          </button>
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
            {NAV_LINKS_BEFORE.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mobile-nav-group">
              <div className={`mobile-nav-link mobile-nav-group__title ${isAboutActive ? 'mobile-nav-link--active' : ''}`}>
                {isFr ? 'À Propos' : isKr ? 'Lor Nou' : 'About Us'}
              </div>
              <div className="mobile-nav-sublinks">
                {ABOUT_SUBLINKS.map(sub => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    className="mobile-nav-sublink"
                    onClick={() => setIsOpen(false)}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            </div>

            {NAV_LINKS_AFTER.map(item => (
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
                navigate('/describe-need?from=Mobile+Menu+CTA&serviceName=Free+Doctor+Review');
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
