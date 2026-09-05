import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Building2,
  Stethoscope,
  UserCheck,
  Award,
  Settings,
  LogOut,
  Database,
  FileText,
  PanelTop,
  PanelBottom,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  FolderKanban,
  FileCode2,
  Mail,
  Send,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  HardDriveDownload,
  Palette,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { useDataConfig } from '../../providers/DataProvider';
import './AdminLayout.css';

const DATA_NAV = [
  { to: '/admin/dashboard',    label: 'Dashboard',                     icon: LayoutDashboard },
  { to: '/admin/inquiries',    label: 'All Patient Requests & Inquiries', icon: Inbox },
  { to: '/admin/hospitals',    label: 'Partner Hospitals',             icon: Building2 },
  { to: '/admin/specialties',  label: 'Medical Specialties',           icon: Stethoscope },
  { to: '/admin/doctors',      label: '7 Elite Specialists',           icon: UserCheck },
  { to: '/admin/case-studies',  label: 'Patient Stories',               icon: Award },
];

const CMS_GLOBAL_NAV = [
  { to: '/admin/marquee',             label: 'Scrolling Mission Ticker', icon: Megaphone },
  { to: '/admin/settings?tab=themes', label: 'Themes & Branding',        icon: Palette },
  { to: '/admin/pages/header',        label: 'Header & Navigation',      icon: PanelTop },
  { to: '/admin/pages/footer',        label: 'Footer & Legal',           icon: PanelBottom },
  { to: '/admin/campaigns',          label: 'Email Campaigns (Nexus)',   icon: Send },
  { to: '/admin/email-templates',    label: 'Email Templates',          icon: Mail },
];


const CMS_PAGES_NAV = [
  { to: '/admin/pages/home',            label: 'Home Page' },
  { to: '/admin/pages/about',           label: 'About Page' },
  { to: '/admin/pages/services',        label: 'Services Page' },
  { to: '/admin/pages/specialties',     label: 'Specialties Page' },
  { to: '/admin/pages/hospitals',       label: 'Hospitals Page' },
  { to: '/admin/pages/doctors',         label: 'Doctors Page' },
  { to: '/admin/pages/case-studies',     label: 'Case Studies Page' },
  { to: '/admin/pages/visa-guide',      label: 'Visa & Travel Guide' },
  { to: '/admin/pages/cost-calculator', label: 'Cost Calculator' },
  { to: '/admin/pages/describe-need',   label: 'Describe Need Wizard' },
  { to: '/admin/pages/contact',         label: 'Contact Page' },
  { to: '/admin/pages/privacy',         label: 'Privacy Policy' },
  { to: '/admin/pages/terms',           label: 'Terms of Service' },
];

type MenuSection = 'data' | 'global' | 'cms';

export function AdminLayout() {
  const { user, logout }   = useAuth();
  const { mockConfig }     = useDataConfig();
  const navigate           = useNavigate();
  const location           = useLocation();

  // Persistent sidebar collapsed state
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('med360_admin_sidebar_collapsed');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('med360_admin_sidebar_collapsed', String(next));
      } catch { /* ignore */ }
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Accordion state: only one section can be open at a time
  const [openSection, setOpenSection] = useState<MenuSection | null>(() => {
    const path = location.pathname;
    const search = location.search;
    if (path.startsWith('/admin/pages/header') || path.startsWith('/admin/pages/footer') || path.startsWith('/admin/email-templates') || path.startsWith('/admin/campaigns') || (path === '/admin/settings' && search.includes('tab=themes'))) {
      return 'global';
    }
    if (path.startsWith('/admin/pages/')) {
      return 'cms';
    }
    return 'data';
  });

  // Auto-expand active section and close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
    const path = location.pathname;
    const search = location.search;
    if (path.startsWith('/admin/pages/header') || path.startsWith('/admin/pages/footer') || path.startsWith('/admin/email-templates') || path.startsWith('/admin/campaigns') || (path === '/admin/settings' && search.includes('tab=themes'))) {
      setOpenSection('global');
    } else if (path.startsWith('/admin/pages/')) {
      setOpenSection('cms');
    } else if (
      path.startsWith('/admin/dashboard') ||
      path.startsWith('/admin/inquiries') ||
      path.startsWith('/admin/hospitals') ||
      path.startsWith('/admin/specialties') ||
      path.startsWith('/admin/doctors') ||
      path.startsWith('/admin/case-studies')
    ) {
      setOpenSection('data');
    }
  }, [location.pathname, location.search]);

  const toggleSection = (section: MenuSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  // Get active page breadcrumb name
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'Dashboard';
    if (path === '/admin/inquiries') return 'All Patient Requests';
    if (path === '/admin/hospitals') return 'Partner Hospitals';
    if (path === '/admin/specialties') return 'Medical Specialties';
    if (path === '/admin/doctors') return 'Elite Specialists';
    if (path === '/admin/case-studies') return 'Patient Stories';
    if (path === '/admin/settings') {
      const params = new URLSearchParams(location.search);
      if (params.get('tab') === 'themes') return 'Themes & Branding';
      return 'System & Database Backup';
    }
    if (path === '/admin/email-templates') return 'Email Templates';
    if (path === '/admin/campaigns') return 'Campaigns';
    if (path.startsWith('/admin/pages/')) {
      const pageId = path.replace('/admin/pages/', '');
      const found = CMS_PAGES_NAV.find(p => p.to === path);
      return found ? `CMS: ${found.label}` : `CMS: ${pageId}`;
    }
    return 'Admin Portal';
  };

  return (
    <div className="admin-layout">
      {/* Mobile Top Navigation Header */}
      <header className="admin-mobile-header">
        <button
          type="button"
          className="admin-mobile-header__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="admin-sidebar__logo" style={{ padding: 0, border: 'none' }}>
          <img 
            src="/assets/logo.png" 
            alt="Med360" 
            style={{ height: 38, width: 'auto', maxWidth: 170, objectFit: 'contain' }} 
          />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="admin-mobile-header__logout"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside className={`admin-sidebar${collapsed ? ' admin-sidebar--collapsed' : ''}${mobileOpen ? ' admin-sidebar--mobile-open' : ''}`}>
        
        {/* Logo & Header Toggle */}
        <div className="admin-sidebar__logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            <img 
              src="/assets/logo.png" 
              alt="Med360" 
              style={{ 
                height: collapsed ? 30 : 42, 
                maxWidth: collapsed ? 36 : 170, 
                objectFit: 'contain',
                objectPosition: 'left center',
                transition: 'all 0.2s ease'
              }} 
            />
          </div>

          {/* Top Collapse / Expand Button */}
          <button
            type="button"
            className="admin-sidebar__toggle-header-btn"
            onClick={toggleCollapsed}
            title={collapsed ? 'Open sidebar (Ctrl+B)' : 'Close sidebar (Ctrl+B)'}
            aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        {/* Data Source Badge */}
        <NavLink
          to="/admin/settings"
          className={mockConfig.enabled ? 'admin-mock-badge' : 'admin-live-badge'}
          title={mockConfig.enabled ? 'Running on Mock Data Center (Click to configure & backup)' : 'Running on Live Supabase Database (Click to configure & backup)'}
        >
          {mockConfig.enabled ? (
            <>
              <Database size={12} />
              {!collapsed && <span>MOCK DATA</span>}
            </>
          ) : (
            <>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
              {!collapsed && <span>LIVE DB</span>}
            </>
          )}
        </NavLink>

        {/* Nav Accordion */}
        <nav className="admin-sidebar__nav">
          
          {/* ─── SECTION 1: DATA MANAGEMENT ─── */}
          <div className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-header ${openSection === 'data' ? 'admin-sidebar__section-header--open' : ''}`}
              onClick={() => toggleSection('data')}
              title="Data Management"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                <FolderKanban size={15} className="admin-sidebar__section-icon" />
                {!collapsed && (
                  <span className="admin-sidebar__section-title">Data Management</span>
                )}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-sidebar__section-count">{DATA_NAV.length}</span>
                  <ChevronDown
                    size={14}
                    className={`admin-sidebar__chevron ${openSection === 'data' ? 'admin-sidebar__chevron--open' : ''}`}
                  />
                </div>
              )}
            </button>

            {/* Submenu Links */}
            {(openSection === 'data' || collapsed) && (
              <div className="admin-sidebar__submenu">
                {DATA_NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `admin-sidebar__nav-link ${isActive ? 'admin-sidebar__nav-link--active' : ''}`
                    }
                    title={collapsed ? label : undefined}
                  >
                    <Icon size={16} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ─── SECTION 2: GLOBAL & SYSTEM ─── */}
          <div className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-header ${openSection === 'global' ? 'admin-sidebar__section-header--open' : ''}`}
              onClick={() => toggleSection('global')}
              title="Global & System Layouts"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                <Layers size={15} className="admin-sidebar__section-icon" />
                {!collapsed && (
                  <span className="admin-sidebar__section-title">Global Layouts</span>
                )}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-sidebar__section-count">{CMS_GLOBAL_NAV.length}</span>
                  <ChevronDown
                    size={14}
                    className={`admin-sidebar__chevron ${openSection === 'global' ? 'admin-sidebar__chevron--open' : ''}`}
                  />
                </div>
              )}
            </button>

            {(openSection === 'global' || collapsed) && (
              <div className="admin-sidebar__submenu">
                {CMS_GLOBAL_NAV.map(({ to, label, icon: Icon }) => {
                  const isActive = to.includes('?') 
                    ? (location.pathname + location.search) === to 
                    : location.pathname === to;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      className={`admin-sidebar__nav-link ${isActive ? 'admin-sidebar__nav-link--active' : ''}`}
                      title={collapsed ? label : undefined}
                    >
                      <Icon size={16} />
                      {!collapsed && <span>{label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── SECTION 3: PAGES CONTENT CMS ─── */}
          <div className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-header ${openSection === 'cms' ? 'admin-sidebar__section-header--open' : ''}`}
              onClick={() => toggleSection('cms')}
              title="Pages Content CMS"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                <FileCode2 size={15} className="admin-sidebar__section-icon" />
                {!collapsed && (
                  <span className="admin-sidebar__section-title">Pages Content CMS</span>
                )}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-sidebar__section-count">{CMS_PAGES_NAV.length}</span>
                  <ChevronDown
                    size={14}
                    className={`admin-sidebar__chevron ${openSection === 'cms' ? 'admin-sidebar__chevron--open' : ''}`}
                  />
                </div>
              )}
            </button>

            {(openSection === 'cms' || collapsed) && (
              <div className="admin-sidebar__submenu">
                {CMS_PAGES_NAV.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `admin-sidebar__nav-link admin-sidebar__nav-link--sub ${isActive ? 'admin-sidebar__nav-link--active' : ''}`
                    }
                    title={collapsed ? label : undefined}
                  >
                    <FileText size={14} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ─── SYSTEM SETTINGS & BACKUP ─── */}
          <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <NavLink
              to="/admin/settings"
              className={`admin-sidebar__nav-link ${location.pathname === '/admin/settings' && !location.search.includes('tab=themes') ? 'admin-sidebar__nav-link--active' : ''}`}
              title={collapsed ? 'System Settings & Backup' : undefined}
            >
              <Settings size={18} />
              {!collapsed && <span>System & Backup</span>}
            </NavLink>
          </div>
        </nav>

        {/* Footer */}
        <div className="admin-sidebar__footer">
          {!collapsed && user && (
            <div className="admin-sidebar__user">
              <div className="admin-sidebar__avatar">{user.name[0]}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
                  {user.role.replace('_', ' ')}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: collapsed ? 0 : '0.75rem' }}>
            <button
              className="admin-sidebar__collapse-btn"
              onClick={toggleCollapsed}
              title={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            {!collapsed && (
              <button
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
                style={{ flex: 1, borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}
              >
                <LogOut size={14} /> Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className={`admin-main-wrapper${collapsed ? ' admin-main-wrapper--collapsed' : ''}`}>
        
        {/* Desktop Sticky Header Bar with Sidebar Open/Close Toggle */}
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              type="button"
              className="admin-topbar__toggle"
              onClick={toggleCollapsed}
              title={collapsed ? 'Open sidebar (Ctrl + B)' : 'Close sidebar (Ctrl + B)'}
              aria-label={collapsed ? 'Open sidebar' : 'Close sidebar'}
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
              <span className="admin-topbar__toggle-label">
                {collapsed ? 'Open Menu' : 'Close Menu'}
              </span>
            </button>

            <div className="admin-topbar__breadcrumb">
              <span className="admin-topbar__breadcrumb-root">Medical360 Admin</span>
              <span className="admin-topbar__breadcrumb-separator">/</span>
              <span className="admin-topbar__breadcrumb-active">{getCurrentPageTitle()}</span>
            </div>
          </div>

          <div className="admin-topbar__right">
            <Link
              to="/admin/settings"
              className="admin-topbar__action-btn"
              title="Database Backup & Restore Hub"
            >
              <HardDriveDownload size={14} />
              <span>Backup</span>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-topbar__action-btn"
              title="Open Public Website in new tab"
            >
              <ExternalLink size={14} />
              <span>Live Site</span>
            </a>

            <div className="admin-topbar__user-pill">
              <div className="admin-sidebar__avatar" style={{ width: 26, height: 26, fontSize: '0.75rem' }}>
                {user?.name?.[0] || 'A'}
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{user?.name || 'Administrator'}</span>
            </div>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
