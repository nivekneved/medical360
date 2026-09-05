import { useState, useRef, useEffect } from 'react';
import {
  Settings,
  Database,
  Shield,
  CheckCircle2,
  AlertCircle,
  HardDriveDownload,
  Key,
} from 'lucide-react';
import { AdminBackupManager } from './components/AdminBackupManager';
import { AdminSecuritySettings } from './components/AdminSecuritySettings';
import { AdminGeneralSettings } from './components/AdminGeneralSettings';

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'backups' | 'security'>('general');
  const [notification, setNotification] = useState<{ text: string; isError?: boolean } | null>(null);
  const notifyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (notifyTimerRef.current) clearTimeout(notifyTimerRef.current);
    };
  }, []);

  const showNotification = (msg: { text: string; isError?: boolean }) => {
    if (notifyTimerRef.current) clearTimeout(notifyTimerRef.current);
    setNotification(msg);
    notifyTimerRef.current = setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 0' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
            System Settings & Administration
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Manage platform branding, point-in-time database backups, and security defenses.
          </p>
        </div>

        {notification && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: notification.isError ? 'rgba(239, 68, 68, 0.12)' : 'rgba(6, 95, 70, 0.12)',
            color: notification.isError ? 'var(--color-danger)' : 'var(--color-primary)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 700,
            fontSize: '0.85rem',
            animation: 'fadeIn 0.2s ease',
          }}>
            {notification.isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{notification.text}</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'general' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            color: activeTab === 'general' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Settings size={16} /> General Settings
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('backups')}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'backups' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            color: activeTab === 'backups' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Database size={16} /> Backups & SQL DDL
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          style={{
            padding: '0.75rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'security' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
            color: activeTab === 'security' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Shield size={16} /> Security & Anti-Bot
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'general' && (
        <AdminGeneralSettings onNotify={showNotification} />
      )}

      {activeTab === 'backups' && (
        <AdminBackupManager onNotify={showNotification} />
      )}

      {activeTab === 'security' && (
        <AdminSecuritySettings onNotify={showNotification} />
      )}
    </div>
  );
}
