import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FolderKanban,
  FileCode2,
  Send,
  Layers,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  HardDriveDownload,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { isSupabaseConfigured } from '../../core/supabase/client';
import {
  CORE_NAV,
  DIRECTORY_NAV,
  MARKETING_NAV,
  CMS_MEDIA_NAV,
  CMS_PAGES_NAV,
  SETTINGS_NAV,
  getSectionForPath,
  getCurrentPageTitle,
} from './adminNavConfig';
import type { MenuSection } from './adminNavConfig';
import './AdminLayout.css';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
  const [pagesSubmenuOpen, setPagesSubmenuOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('med360_admin_sidebar_collapsed', String(next));
      } catch {}
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

  // Accordion state
  const [openSection, setOpenSection] = useState<MenuSection | null>(() =>
    getSectionForPath(location.pathname)
  );

  // Auto-expand active section and close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
    const activeSec = getSectionForPath(location.pathname);
    if (activeSec) {
      setOpenSection(activeSec);
    }
    if (location.pathname.startsWith('/admin/pages/')) {
      setPagesSubmenuOpen(true);
    }
  }, [location.pathname, location.search]);

  const toggleSection = (section: MenuSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  // Active check helper for exact and query-parameter routes
  const isItemActive = (to: string) => {
    if (to.includes('?')) {
      const [targetPath, targetQuery] = to.split('?');
      if (location.pathname !== targetPath) return false;
      const currentParams = new URLSearchParams(location.search);
      const targetParams = new URLSearchParams(targetQuery);
      const targetTab = targetParams.get('tab');
      const currentTab = currentParams.get('tab') || (targetPath === '/admin/settings' ? 'general' : null);
      return targetTab === currentTab;
    }
    return location.pathname === to;
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
            src="/med360-logo.png"
            alt="Med360"
            style={{ height: 32, objectFit: 'contain' }}
          />
        </div>

        <button
          type="button"
          className="admin-mobile-header__logout"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside
        className={`admin-sidebar${collapsed ? ' admin-sidebar--collapsed' : ''}${
          mobileOpen ? ' admin-sidebar--mobile-open' : ''
        }`}
      >
        {/* Brand Header */}
        <div className="admin-sidebar__logo">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            <img
              src="/med360-logo.png"
              alt="Med360"
              style={{
                height: collapsed ? 30 : 40,
                maxWidth: collapsed ? 36 : 165,
                objectFit: 'contain',
                objectPosition: 'left center',
                transition: 'all 0.2s ease',
              }}
            />
          </div>

          <button
            type="button"
            className="admin-sidebar__toggle-header-btn"
            onClick={toggleCollapsed}
            title={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        {/* Database Status Beacon */}
        <NavLink
          to="/admin/settings?tab=backups"
          className="admin-live-badge"
          title={isSupabaseConfigured ? 'Connected to Live Supabase Database' : 'Mock Engine Mode Active'}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: isSupabaseConfigured ? '#10b981' : '#f59e0b',
              display: 'inline-block',
              boxShadow: `0 0 6px ${isSupabaseConfigured ? '#10b981' : '#f59e0b'}`,
            }}
          />
          {!collapsed && (
            <span>{isSupabaseConfigured ? 'LIVE SUPABASE' : 'MOCK ENGINE'}</span>
          )}
        </NavLink>

        {/* Nav Accordion */}
        <nav className="admin-sidebar__nav">
          {/* ─── TOP SECTION: CORE OPERATIONS ─── */}
          <div className="admin-sidebar__section" style={{ marginBottom: '0.35rem' }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  padding: '0.35rem 0.65rem 0.15rem',
                }}
              >
                Core Operations
              </div>
            )}
            {CORE_NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={`admin-sidebar__nav-link ${
                  isItemActive(to) ? 'admin-sidebar__nav-link--active' : ''
                }`}
                title={label}
                aria-label={label}
              >
                <Icon size={18} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>

          {/* ─── SECTION 1: MEDICAL DIRECTORY ─── */}
          <div className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-header ${
                openSection === 'directory' ? 'admin-sidebar__section-header--open' : ''
              }`}
              onClick={() => toggleSection('directory')}
              title="Medical Directory"
              aria-label="Medical Directory"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '0.5rem',
                  width: '100%',
                  minWidth: 0,
                }}
              >
                <FolderKanban size={18} className="admin-sidebar__section-icon" />
                {!collapsed && (
                  <span className="admin-sidebar__section-title">Medical Directory</span>
                )}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-sidebar__section-count">{DIRECTORY_NAV.length}</span>
                  <ChevronDown
                    size={14}
                    className={`admin-sidebar__chevron ${
                      openSection === 'directory' ? 'admin-sidebar__chevron--open' : ''
                    }`}
                  />
                </div>
              )}
            </button>

            {(openSection === 'directory' || collapsed) && (
              <div className="admin-sidebar__submenu">
                {DIRECTORY_NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={`admin-sidebar__nav-link ${
                      isItemActive(to) ? 'admin-sidebar__nav-link--active' : ''
                    }`}
                    title={label}
                    aria-label={label}
                  >
                    <Icon size={17} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ─── SECTION 2: MARKETING & OUTREACH ─── */}
          <div className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-header ${
                openSection === 'marketing' ? 'admin-sidebar__section-header--open' : ''
              }`}
              onClick={() => toggleSection('marketing')}
              title="Marketing & Outreach"
              aria-label="Marketing & Outreach"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '0.5rem',
                  width: '100%',
                  minWidth: 0,
                }}
              >
                <Send size={18} className="admin-sidebar__section-icon" />
                {!collapsed && (
                  <span className="admin-sidebar__section-title">Marketing & Outreach</span>
                )}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-sidebar__section-count">{MARKETING_NAV.length}</span>
                  <ChevronDown
                    size={14}
                    className={`admin-sidebar__chevron ${
                      openSection === 'marketing' ? 'admin-sidebar__chevron--open' : ''
                    }`}
                  />
                </div>
              )}
            </button>

            {(openSection === 'marketing' || collapsed) && (
              <div className="admin-sidebar__submenu">
                {MARKETING_NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={`admin-sidebar__nav-link ${
                      isItemActive(to) ? 'admin-sidebar__nav-link--active' : ''
                    }`}
                    title={label}
                    aria-label={label}
                  >
                    <Icon size={17} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ─── SECTION 3: CONTENT & CMS ─── */}
          <div className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-header ${
                openSection === 'cms' ? 'admin-sidebar__section-header--open' : ''
              }`}
              onClick={() => toggleSection('cms')}
              title="Content & CMS"
              aria-label="Content & CMS"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '0.5rem',
                  width: '100%',
                  minWidth: 0,
                }}
              >
                <Layers size={18} className="admin-sidebar__section-icon" />
                {!collapsed && (
                  <span className="admin-sidebar__section-title">Content & CMS</span>
                )}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-sidebar__section-count">
                    {CMS_MEDIA_NAV.length + CMS_PAGES_NAV.length}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`admin-sidebar__chevron ${
                      openSection === 'cms' ? 'admin-sidebar__chevron--open' : ''
                    }`}
                  />
                </div>
              )}
            </button>

            {(openSection === 'cms' || collapsed) && (
              <div className="admin-sidebar__submenu">
                {CMS_MEDIA_NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={`admin-sidebar__nav-link ${
                      isItemActive(to) ? 'admin-sidebar__nav-link--active' : ''
                    }`}
                    title={label}
                    aria-label={label}
                  >
                    <Icon size={17} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}

                {/* Nested Collapsible Pages Sub-List */}
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => setPagesSubmenuOpen(!pagesSubmenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.45rem 0.65rem 0.45rem 0.85rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      borderRadius: '6px',
                      marginTop: '2px',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <FileCode2 size={15} color="#38bdf8" /> Page Templates
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span className="admin-sidebar__section-count" style={{ fontSize: '0.62rem' }}>
                        {CMS_PAGES_NAV.length}
                      </span>
                      <ChevronDown
                        size={12}
                        style={{
                          transform: pagesSubmenuOpen ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.15s ease',
                        }}
                      />
                    </div>
                  </button>
                )}

                {(pagesSubmenuOpen || collapsed) &&
                  CMS_PAGES_NAV.map(({ to, label, icon: PageIcon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={`admin-sidebar__nav-link admin-sidebar__nav-link--sub ${
                        isItemActive(to) ? 'admin-sidebar__nav-link--active' : ''
                      }`}
                      title={label}
                      aria-label={label}
                    >
                      <PageIcon size={15} />
                      {!collapsed && <span>{label}</span>}
                    </NavLink>
                  ))}
              </div>
            )}
          </div>

          {/* ─── SECTION 4: SYSTEM & SETTINGS (SUBMENU) ─── */}
          <div className="admin-sidebar__section">
            <button
              type="button"
              className={`admin-sidebar__section-header ${
                openSection === 'settings' ? 'admin-sidebar__section-header--open' : ''
              }`}
              onClick={() => toggleSection('settings')}
              title="System & Settings"
              aria-label="System & Settings"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '0.5rem',
                  width: '100%',
                  minWidth: 0,
                }}
              >
                <Settings size={18} className="admin-sidebar__section-icon" />
                {!collapsed && (
                  <span className="admin-sidebar__section-title">System & Settings</span>
                )}
              </div>
              {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span className="admin-sidebar__section-count">{SETTINGS_NAV.length}</span>
                  <ChevronDown
                    size={14}
                    className={`admin-sidebar__chevron ${
                      openSection === 'settings' ? 'admin-sidebar__chevron--open' : ''
                    }`}
                  />
                </div>
              )}
            </button>

            {(openSection === 'settings' || collapsed) && (
              <div className="admin-sidebar__submenu">
                {SETTINGS_NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={`admin-sidebar__nav-link ${
                      isItemActive(to) ? 'admin-sidebar__nav-link--active' : ''
                    }`}
                    title={label}
                    aria-label={label}
                  >
                    <Icon size={17} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer User Pill */}
        <div className="admin-sidebar__footer">
          {!collapsed && user && (
            <div className="admin-sidebar__user">
              <div className="admin-sidebar__avatar">{user.name[0]}</div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'white',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'capitalize',
                  }}
                >
                  {user.role.replace('_', ' ')}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: collapsed ? 0 : '0.75rem',
            }}
          >
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
                style={{
                  flex: 1,
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div
        className={`admin-main-wrapper${
          collapsed ? ' admin-main-wrapper--collapsed' : ''
        }`}
      >
        {/* Desktop Sticky Header Bar */}
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
              <span className="admin-topbar__breadcrumb-root">Med360 Admin</span>
              <span className="admin-topbar__breadcrumb-separator">/</span>
              <span className="admin-topbar__breadcrumb-active">
                {getCurrentPageTitle(location.pathname, location.search)}
              </span>
            </div>
          </div>

          <div className="admin-topbar__right">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: isSupabaseConfigured
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(245, 158, 11, 0.12)',
                border: `1px solid ${
                  isSupabaseConfigured
                    ? 'rgba(16, 185, 129, 0.3)'
                    : 'rgba(245, 158, 11, 0.3)'
                }`,
                color: isSupabaseConfigured ? '#34d399' : '#f59e0b',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isSupabaseConfigured ? '#10b981' : '#f59e0b',
                  boxShadow: `0 0 6px ${
                    isSupabaseConfigured ? '#10b981' : '#f59e0b'
                  }`,
                }}
              />
              <span>{isSupabaseConfigured ? 'Supabase Live' : 'Mock Engine'}</span>
            </div>

            <Link
              to="/admin/settings?tab=backups"
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
              <div
                className="admin-sidebar__avatar"
                style={{ width: 26, height: 26, fontSize: '0.75rem' }}
              >
                {user?.name?.[0] || 'A'}
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                {user?.name || 'Administrator'}
              </span>
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
