import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About Us',            to: '/about' },
  { label: 'Hospitals',           to: '/hospitals' },
  { label: 'Specialties',         to: '/specialties' },
  { label: 'Our Services',        to: '/services' },
  { label: 'Case Studies',        to: '/case-studies' },
  { label: 'Contact',             to: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen]         = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme }      = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <span>M</span>
            <div className="navbar__logo-ring" />
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">Medical</span>
            <span className="navbar__logo-accent">360</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav" aria-label="Main navigation">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            id="theme-toggle-btn"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <a
            href={buildMed360WhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__whatsapp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/describe-need')}
            id="navbar-cta-btn"
          >
            Get Free Opinion
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar__toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${isOpen ? 'navbar__mobile--open' : ''}`}>
        <nav className="navbar__mobile-nav">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className="navbar__mobile-link"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="navbar__mobile-actions">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>Appearance</span>
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            </div>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              onClick={() => setIsOpen(false)}
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
            <button
              className="btn btn-primary"
              onClick={() => { navigate('/describe-need'); setIsOpen(false); }}
            >
              Get Free Opinion
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
