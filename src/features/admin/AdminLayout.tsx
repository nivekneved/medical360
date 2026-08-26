import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Globe,
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
} from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { useDataConfig } from '../../providers/DataProvider';
import './AdminLayout.css';

const DATA_NAV = [
  { to: '/admin/dashboard',    label: 'Dashboard',             icon: LayoutDashboard },
  { to: '/admin/inquiries',    label: 'Patient Inquiries',     icon: Inbox },
  { to: '/admin/hospitals',    label: 'Partner Hospitals',     icon: Building2 },
  { to: '/admin/specialties',  label: 'Medical Specialties',   icon: Stethoscope },
  { to: '/admin/doctors',      label: '7 Elite Specialists',   icon: UserCheck },
  { to: '/admin/case-studies',  label: 'Patient Stories',       icon: Award },
];

const CMS_GLOBAL_NAV = [
  { to: '/admin/pages/header',     label: 'Header & Navigation',     icon: PanelTop },
  { to: '/admin/pages/footer',     label: 'Footer & Legal',          icon: PanelBottom },
  { to: '/admin/campaigns',       label: 'Email Campaigns (Nexus)', icon: Send },
  { to: '/admin/email-templates', label: 'Email Templates',         icon: Mail },
];

const CMS_PAGES_NAV = [
  { to: '/admin/pages/home',          label: 'Home Page' },
  { to: '/admin/pages/about',         label: 'About Page' },
  { to: '/admin/pages/services',      label: 'Services Page' },
  { to: '/admin/pages/specialties',   label: 'Specialties Page' },
  { to: '/admin/pages/hospitals',     label: 'Hospitals Page' },
  { to: '/admin/pages/doctors',       label: 'Doctors Page' },
  { to: '/admin/pages/case-studies',   label: 'Case Studies Page' },
  { to: '/admin/pages/describe-need', label: 'Describe Need Wizard' },
  { to: '/admin/pages/contact',       label: 'Contact Page' },
];

type MenuSection = 'data' | 'global' | 'cms';

export function AdminLayout() {
  const { user, logout }   = useAuth();
  const { mockConfig }     = useDataConfig();
  const navigate           = useNavigate();
  const location           = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Accordion state: only one section can be open at a time
  const [openSection, setOpenSection] = useState<MenuSection | null>(() => {
    const path = location.pathname;
    if (path.startsWith('/admin/pages/header') || path.startsWith('/admin/pages/footer') || path.startsWith('/admin/email-templates') || path.startsWith('/admin/campaigns')) {
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
    if (path.startsWith('/admin/pages/header') || path.startsWith('/admin/pages/footer') || path.startsWith('/admin/email-templates') || path.startsWith('/admin/campaigns')) {
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
  }, [location.pathname]);

  const toggleSection = (section: MenuSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

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
          <div className="admin-sidebar__logo-icon" style={{ width: 30, height: 30, fontSize: '0.85rem' }}>M</div>
          <div className="admin-sidebar__logo-text" style={{ fontSize: '0.95rem' }}>
            <span>Medical</span>
            <span className="admin-sidebar__logo-accent">360</span>
          </div>
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

      <aside className={`admin-sidebar${collapsed ? ' admin-sidebar--collapsed' : ''}${mobileOpen ? ' admin-sidebar--mobile-open' : ''}`}>
        {/* Logo */}
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-icon">M</div>
          {!collapsed && (
            <div className="admin-sidebar__logo-text">
              <span>Medical</span>
              <span className="admin-sidebar__logo-accent">360</span>
            </div>
          )}
        </div>

        {/* Data Source Badge */}
        <NavLink
          to="/admin/settings"
          className={mockConfig.enabled ? 'admin-mock-badge' : 'admin-live-badge'}
          title={mockConfig.enabled ? 'Running on Mock Data Center (Click to change)' : 'Running on Live Supabase Database (Click to change)'}
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
                    className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
                  >
                    <Icon size={17} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ─── SECTION 2: GLOBAL SECTIONS ─── */}
          <div className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-header ${openSection === 'global' ? 'admin-sidebar__section-header--open' : ''}`}
              onClick={() => toggleSection('global')}
              title="Global Sections"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                <Layers size={15} className="admin-sidebar__section-icon" />
                {!collapsed && (
                  <span className="admin-sidebar__section-title">Global Sections</span>
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

            {/* Submenu Links */}
            {(openSection === 'global' || collapsed) && (
              <div className="admin-sidebar__submenu">
                {CMS_GLOBAL_NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
                  >
                    <Icon size={17} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ─── SECTION 3: PAGE CMS TEXT (EN/FR/KR) ─── */}
          <div className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-header ${openSection === 'cms' ? 'admin-sidebar__section-header--open' : ''}`}
              onClick={() => toggleSection('cms')}
              title="Page CMS Text (EN/FR/KR)"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                <FileCode2 size={15} className="admin-sidebar__section-icon" />
                {!collapsed && (
                  <span className="admin-sidebar__section-title">Page CMS Text</span>
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

            {/* Submenu Links */}
            {(openSection === 'cms' || collapsed) && (
              <div className="admin-sidebar__submenu">
                {CMS_PAGES_NAV.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
                  >
                    <FileText size={15} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ─── SECTION: SETTINGS ─── */}
          <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
            >
              <Settings size={18} />
              {!collapsed && <span>System Settings</span>}
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
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
