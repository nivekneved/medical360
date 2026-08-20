import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
  { to: '/admin/pages/header', label: 'Header & Navigation', icon: PanelTop },
  { to: '/admin/pages/footer', label: 'Footer & Legal',      icon: PanelBottom },
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

export function AdminLayout() {
  const { user, logout }   = useAuth();
  const { mockConfig }     = useDataConfig();
  const navigate           = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar${collapsed ? ' admin-sidebar--collapsed' : ''}`}>
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

        {/* Mock Badge */}
        {mockConfig.enabled && (
          <div className="admin-mock-badge">
            <Database size={12} />
            {!collapsed && 'MOCK DATABASE'}
          </div>
        )}

        {/* Nav */}
        <nav className="admin-sidebar__nav">
          {/* Section: Core Data Management */}
          <div style={{ marginTop: '0.5rem', marginBottom: '0.35rem', paddingLeft: '0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {!collapsed && 'Data Management'}
          </div>
          {DATA_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}

          {/* Section: Global Components */}
          <div style={{ marginTop: '1.25rem', marginBottom: '0.35rem', paddingLeft: '0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {!collapsed && 'Global Sections'}
          </div>
          {CMS_GLOBAL_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}

          {/* Section: Page Content Editors */}
          <div style={{ marginTop: '1.25rem', marginBottom: '0.35rem', paddingLeft: '0.75rem', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {!collapsed && 'Page CMS Text (EN/FR/KR)'}
          </div>
          {CMS_PAGES_NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
            >
              <FileText size={16} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}

          {/* Section: Settings */}
          <div style={{ marginTop: '1.25rem', marginBottom: '0.35rem' }}></div>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
          >
            <Settings size={18} />
            {!collapsed && <span>System Settings</span>}
          </NavLink>
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
