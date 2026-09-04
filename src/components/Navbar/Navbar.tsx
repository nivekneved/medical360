import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  MessageCircle,
  Globe,
  ChevronDown,
  Stethoscope,
  Building2,
  UserCheck,
  Calculator,
  Plane,
  HeartHandshake,
  MessageSquareQuote,
  Info,
  ArrowRight,
  Lock,
  Palette,
  Check,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../providers/ThemeProvider';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './Navbar.css';

interface NavSubItem {
  label: string;
  sublabel: string;
  to: string;
  icon: any;
  badge?: string;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavSubItem[];
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>('treatments');
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<any>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const { theme, currentTheme, availableThemes, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();

  // Close menus on outside click or route change
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setThemeMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Scroll detection for sticky blur navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Language switcher
  const toggleLanguage = () => {
    const langs = ['en', 'fr', 'kr'];
    const currentIndex = langs.indexOf(i18n.language);
    const nextLang = langs[(currentIndex + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  const NAV_GROUPS: NavGroup[] = [
    {
      id: 'treatments',
      label: isFr ? 'Soins & Hôpitaux' : isKr ? 'Swen & Lopital' : 'Treatments & Care',
      items: [
        {
          label: isFr ? 'Spécialités & Chirurgie' : isKr ? 'Spesialite & Sirizi' : 'Medical Specialties',
          sublabel: isFr ? 'Cardiologie, Oncologie, Greffes & plus' : 'Cardiology, Oncology, Transplants & more',
          to: '/specialties',
          icon: Stethoscope,
        },
        {
          label: isFr ? 'Nos 7 Spécialistes d\'Élite' : isKr ? 'Nou 7 Sef Dokter Spesialist' : 'Elite Specialists (7)',
          sublabel: isFr ? 'Chirurgiens de renommée mondiale' : 'World-leading chief surgeons & consultants',
          to: '/doctors',
          icon: UserCheck,
          badge: isFr ? 'Élite' : 'Top',
        },
        {
          label: isFr ? 'Hôpitaux Associés' : isKr ? 'Lopital Partner' : 'Partner Hospitals',
          sublabel: isFr ? 'Établissements accrédités JCI / NABH' : 'Accredited hospitals in India, Thailand, SG',
          to: '/hospitals',
          icon: Building2,
        },
      ],
    },
    {
      id: 'travel-costs',
      label: isFr ? 'Prix & Voyage' : isKr ? 'Pri & Vwayaz' : 'Travel & Costs',
      items: [
        {
          label: isFr ? 'Calculateur de Coûts & Devis' : isKr ? 'Kalkilatris Pri & Lekonomi' : 'Cost & Savings Calculator',
          sublabel: isFr ? 'Comparez les tarifs par pays en USD & MUR' : 'Interactive comparison across countries',
          to: '/cost-calculator',
          icon: Calculator,
          badge: isFr ? 'Nouveau' : 'New',
        },
        {
          label: isFr ? 'Guide Visa Médical' : isKr ? 'Gid Viza Medikal' : 'Medical Visa Guide',
          sublabel: isFr ? 'Lettre officielle sous 24h & checklist' : 'Fast-track visa letters & patient checklist',
          to: '/visa-guide',
          icon: Plane,
        },
        {
          label: isFr ? 'Services de Conciergerie' : isKr ? 'Nou Bann Servis' : 'Concierge Services',
          sublabel: isFr ? 'Les 6 étapes de votre prise en charge' : 'End-to-end patient care & VIP transfers',
          to: '/services',
          icon: HeartHandshake,
        },
      ],
    },
    {
      id: 'about-us',
      label: isFr ? 'À Propos & Avis' : isKr ? 'A Propo & Temwagnaz' : 'About & Stories',
      items: [
        {
          label: isFr ? 'Notre Mission & Équipe' : isKr ? 'Nou Mision & Lekip' : 'About Medical 360',
          sublabel: isFr ? 'Pionnier de la santé pour l\'océan Indien' : 'Our standards, leadership & story',
          to: '/about',
          icon: Info,
        },
        {
          label: isFr ? 'Témoignages & Rétablissements' : isKr ? 'Temwagnaz Pasian' : 'Patient Recovery Stories',
          sublabel: isFr ? 'Histoires de guérison et économies réelles' : 'Real recoveries, verified savings & reviews',
          to: '/about#stories',
          icon: MessageSquareQuote,
        },
      ],
    },
  ];

  const handleMouseEnter = (groupId: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(groupId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const toggleMobileGroup = (groupId: string) => {
    setMobileExpandedGroup(prev => (prev === groupId ? null : groupId));
  };

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img 
            src="/assets/logo.png" 
            alt="Medical 360" 
            className="navbar__logo-img" 
          />
        </Link>

        {/* Desktop Grouped Navigation Menu */}
        <nav className="navbar__nav" aria-label="Main navigation">
          {NAV_GROUPS.map(group => {
            const isDropdownActive = activeDropdown === group.id;
            const isGroupCurrent = group.items.some(item => location.pathname.startsWith(item.to));

            return (
              <div
                key={group.id}
                className="nav-dropdown-wrapper"
                onMouseEnter={() => handleMouseEnter(group.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`nav-dropdown-btn ${isGroupCurrent ? 'nav-dropdown-btn--current' : ''} ${isDropdownActive ? 'nav-dropdown-btn--open' : ''}`}
                  onClick={() => setActiveDropdown(prev => (prev === group.id ? null : group.id))}
                  aria-expanded={isDropdownActive}
                >
                  <span>{group.label}</span>
                  <ChevronDown size={14} className={`nav-chevron ${isDropdownActive ? 'nav-chevron--rotated' : ''}`} />
                </button>

                {/* Dropdown Menu Panel */}
                {isDropdownActive && (
                  <div className="nav-dropdown-menu">
                    <div className="nav-dropdown-menu__grid">
                      {group.items.map(item => {
                        const IconComponent = item.icon;
                        const isItemActive = location.pathname === item.to;

                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={`nav-dropdown-item ${isItemActive ? 'nav-dropdown-item--active' : ''}`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="nav-dropdown-item__icon">
                              <IconComponent size={18} />
                            </div>
                            <div className="nav-dropdown-item__content">
                              <div className="nav-dropdown-item__title-row">
                                <span className="nav-dropdown-item__title">{item.label}</span>
                                {item.badge && <span className="nav-dropdown-item__badge">{item.badge}</span>}
                              </div>
                              <span className="nav-dropdown-item__sublabel">{item.sublabel}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-dropdown-btn ${isActive ? 'nav-dropdown-btn--current' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <span>{isFr ? 'Contact' : isKr ? 'Kontak' : 'Contact'}</span>
          </NavLink>
        </nav>

        {/* Action Controls */}
        <div className="navbar__actions">
          {/* Language Switcher */}
          <button
            className="navbar-icon-btn"
            onClick={toggleLanguage}
            aria-label="Switch Language"
            title="Switch language (EN / FR / KR)"
          >
            <Globe size={17} />
            <span className="lang-text">{i18n.language.toUpperCase()}</span>
          </button>

          {/* Theme Dropdown */}
          <div className="navbar-theme-dropdown" ref={themeMenuRef}>
            <button
              className="navbar-icon-btn navbar-theme-btn"
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              aria-label="Select website theme"
              title={`Active Theme: ${currentTheme.name}`}
              aria-expanded={themeMenuOpen}
            >
              <Palette size={17} />
              <span
                className="theme-indicator-dot"
                style={{ background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.accentColor})` }}
              />
            </button>

            {themeMenuOpen && (
              <div className="navbar-theme-menu" role="menu">
                <div className="navbar-theme-menu__header">
                  <span>Theme Presets</span>
                  <span className="navbar-theme-menu__tag">{availableThemes.length} Themes</span>
                </div>
                <div className="navbar-theme-menu__list">
                  {availableThemes.map(t => {
                    const isActive = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`navbar-theme-item ${isActive ? 'navbar-theme-item--active' : ''}`}
                        onClick={() => {
                          setTheme(t.id);
                          setThemeMenuOpen(false);
                        }}
                      >
                        <div
                          className="navbar-theme-swatch"
                          style={{
                            background: `linear-gradient(135deg, ${t.primaryColor} 0%, ${t.accentColor} 100%)`,
                          }}
                        />
                        <div className="navbar-theme-info">
                          <div className="navbar-theme-name-row">
                            <span className="navbar-theme-name">{t.name}</span>
                            {t.badge && (
                              <span className="navbar-theme-badge">{t.badge}</span>
                            )}
                          </div>
                          <span className="navbar-theme-desc">{t.description}</span>
                        </div>
                        {isActive && <Check size={16} className="navbar-theme-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Direct */}
          <a
            href={buildMed360WhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__whatsapp"
            aria-label="WhatsApp 24/7"
            title="24/7 WhatsApp Medical Coordination"
          >
            <MessageCircle size={16} />
            <span className="navbar__whatsapp-text">WhatsApp 24/7</span>
          </a>

          {/* Primary Action CTA */}
          <button
            className="btn btn-primary btn-sm navbar__cta"
            onClick={() => navigate('/describe-need')}
            id="navbar-cta-btn"
          >
            <span>{isFr ? 'Devis Gratuit' : isKr ? 'Devi Gratis' : 'Free Quote'}</span>
            <ArrowRight size={14} />
          </button>

          {/* Admin Lock link */}
          <Link
            to="/admin"
            className="navbar-admin-link"
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Lock size={15} />
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

      {/* Mobile Drawer / Accordion Menu */}
      <div className={`navbar__mobile ${isOpen ? 'navbar__mobile--open' : ''}`}>
        <div className="navbar__mobile-inner">
          <nav className="navbar__mobile-nav">
            {NAV_GROUPS.map(group => {
              const isGroupExpanded = mobileExpandedGroup === group.id;

              return (
                <div key={group.id} className="mobile-group">
                  <button
                    className="mobile-group__header"
                    onClick={() => toggleMobileGroup(group.id)}
                  >
                    <span className="mobile-group__title">{group.label}</span>
                    <ChevronDown
                      size={18}
                      className={`mobile-group__chevron ${isGroupExpanded ? 'mobile-group__chevron--rotated' : ''}`}
                    />
                  </button>

                  {isGroupExpanded && (
                    <div className="mobile-group__items">
                      {group.items.map(item => {
                        const IconComponent = item.icon;
                        const isItemActive = location.pathname === item.to;

                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className={`mobile-subitem ${isItemActive ? 'mobile-subitem--active' : ''}`}
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="mobile-subitem__icon">
                              <IconComponent size={18} />
                            </div>
                            <div className="mobile-subitem__content">
                              <div className="mobile-subitem__title-row">
                                <span className="mobile-subitem__title">{item.label}</span>
                                {item.badge && <span className="nav-dropdown-item__badge">{item.badge}</span>}
                              </div>
                              <span className="mobile-subitem__sublabel">{item.sublabel}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              to="/contact"
              className="mobile-group__header"
              style={{ textDecoration: 'none', color: 'var(--color-text-main)' }}
              onClick={() => setIsOpen(false)}
            >
              <span className="mobile-group__title">{isFr ? 'Contact' : isKr ? 'Kontak' : 'Contact Us'}</span>
            </Link>
          </nav>

          {/* Mobile Theme Selector */}
          <div className="mobile-theme-section">
            <div className="mobile-theme-section__title">
              <Palette size={15} />
              <span>Theme: <strong>{currentTheme.shortName}</strong></span>
            </div>
            <div className="mobile-theme-grid">
              {availableThemes.map(t => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`mobile-theme-card ${isActive ? 'mobile-theme-card--active' : ''}`}
                    onClick={() => setTheme(t.id)}
                  >
                    <span
                      className="mobile-theme-card__swatch"
                      style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})` }}
                    />
                    <span className="mobile-theme-card__name">{t.shortName}</span>
                    {isActive && <Check size={12} className="mobile-theme-card__check" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer Actions */}
          <div className="navbar__mobile-actions">
            <div className="mobile-utility-row">
              <button className="mobile-utility-btn" onClick={toggleLanguage} style={{ width: '100%' }}>
                <Globe size={18} color="var(--color-primary)" />
                <span>Language: <strong>{i18n.language.toUpperCase()}</strong></span>
              </button>
            </div>

            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setIsOpen(false)}
            >
              <MessageCircle size={18} />
              <span>WhatsApp 24/7 Helpline</span>
            </a>

            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                navigate('/describe-need');
                setIsOpen(false);
              }}
            >
              <span>{isFr ? 'Demander un Devis & Avis Gratuit' : isKr ? 'Demann Devi & Lavi Gratis' : 'Get Free Opinion & Quote'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
