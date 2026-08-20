import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Inbox, Building2, Settings, LogOut, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { useDataConfig } from '../../providers/DataProvider';
import './AdminLayout.css';

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/inquiries', label: 'Inquiries',  icon: Inbox },
  { to: '/admin/hospitals', label: 'Hospitals',  icon: Building2 },
  { to: '/admin/settings',  label: 'Settings',   icon: Settings },
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
            {!collapsed && 'MOCK DATA'}
          </div>
        )}

        {/* Nav */}
        <nav className="admin-sidebar__nav">
          {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`}
              id={`admin-nav-${label.toLowerCase().replace(' ', '-')}-btn`}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar__footer">
          {!collapsed && user && (
            <div className="admin-sidebar__user">
              <div className="admin-sidebar__avatar">{user.name[0]}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                  {user.role.replace('_', ' ')}
                </div>
              </div>
            </div>
          )}
          <button className="admin-sidebar__link" onClick={handleLogout} id="admin-logout-btn" title="Logout">
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button className="admin-sidebar__collapse" onClick={() => setCollapsed(c => !c)} id="admin-sidebar-collapse-btn">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
