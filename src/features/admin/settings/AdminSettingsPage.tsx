import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDataConfig } from '../../../providers/DataProvider';
import {
  Database,
  Zap,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Cloud,
  Server,
  RefreshCw,
  Download,
  Upload,
  FileCode,
  FileJson,
  History,
  Trash2,
  Clock,
  Check,
  X,
  Copy,
  Eye,
  Plus,
  Palette,
  Sparkles,
  HardDriveDownload,
} from 'lucide-react';
import type { MockConfig } from '../../../core/types';
import { supabase, isSupabaseConfigured } from '../../../core/supabase/client';
import { useTheme } from '../../../providers/ThemeProvider';
import {
  DatabaseBackup,
  createDatabaseSnapshot,
  getStoredBackups,
  saveBackupToHistory,
  deleteStoredBackup,
  downloadJsonBackup,
  downloadSqlBackup,
  generateSqlDump,
  restoreFromBackup,
  restoreFromJsonFile,
} from '../../../core/services/backup.service';

export function AdminSettingsPage() {
  const { mockConfig, updateMockConfig, resetMock } = useDataConfig();
  const { theme, currentTheme, availableThemes, setTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    online: boolean;
    message: string;
    hospitalsCount?: number;
    inquiriesCount?: number;
  }>({ tested: false, online: false, message: '' });

  // ─── Backup & Restore State ────────────────────────────────────────────────
  const [backups, setBackups] = useState<DatabaseBackup[]>([]);
  const [actionProgress, setActionProgress] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sqlModalContent, setSqlModalContent] = useState<string | null>(null);
  
  const tabParam = searchParams.get('tab');
  const validTabs = ['themes', 'backup', 'supabase', 'simulation'] as const;
  type SettingsTab = typeof validTabs[number];

  const [settingsTab, setSettingsTab] = useState<SettingsTab>(() => {
    if (tabParam && validTabs.includes(tabParam as SettingsTab)) {
      return tabParam as SettingsTab;
    }
    return 'themes';
  });

  useEffect(() => {
    const currentTabParam = searchParams.get('tab');
    if (currentTabParam && validTabs.includes(currentTabParam as SettingsTab)) {
      setSettingsTab(currentTabParam as SettingsTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: SettingsTab) => {
    setSettingsTab(tab);
    setSearchParams({ tab });
  };
  const [copiedSql, setCopiedSql] = useState(false);
  const [newSnapshotLabel, setNewSnapshotLabel] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadBackupsList = () => {
    const list = getStoredBackups();
    setBackups(list);
  };

  useEffect(() => {
    loadBackupsList();
  }, []);

  function setLatency(latency: MockConfig['latency']) {
    updateMockConfig({ ...mockConfig, latency });
  }

  function setMode(live: boolean) {
    updateMockConfig({ ...mockConfig, enabled: !live });
  }

  const testSupabaseConnection = async () => {
    if (!isSupabaseConfigured) {
      setConnectionStatus({
        tested: true,
        online: false,
        message: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured in environment variables. Running in Local Mock Data mode.',
      });
      return;
    }

    setTestingConnection(true);
    try {
      const [hospRes, inqRes] = await Promise.all([
        supabase.from('hospitals').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      ]);

      if (hospRes.error) {
        setConnectionStatus({
          tested: true,
          online: false,
          message: `Supabase Error: ${hospRes.error.message}`,
        });
      } else {
        setConnectionStatus({
          tested: true,
          online: true,
          message: 'Connected to Supabase PostgreSQL Database (Cloud)',
          hospitalsCount: hospRes.count ?? 0,
          inquiriesCount: inqRes.count ?? 0,
        });
      }
    } catch (err: any) {
      setConnectionStatus({
        tested: true,
        online: false,
        message: err.message || 'Connection failed.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  // ─── Backup Handlers ───────────────────────────────────────────────────────
  const handleDownloadJson = async () => {
    setActionProgress('Generating JSON backup...');
    try {
      await downloadJsonBackup(undefined, newSnapshotLabel || 'Manual JSON Backup');
      loadBackupsList();
      setAlertMessage({ type: 'success', text: 'Database successfully backed up and downloaded as JSON.' });
      setTimeout(() => setAlertMessage(null), 5000);
    } catch (err: any) {
      setAlertMessage({ type: 'error', text: err.message || 'Failed to download JSON backup.' });
    } finally {
      setActionProgress(null);
    }
  };

  const handleDownloadSql = async () => {
    setActionProgress('Generating PostgreSQL SQL dump...');
    try {
      await downloadSqlBackup(undefined, newSnapshotLabel || 'Manual SQL Backup');
      loadBackupsList();
      setAlertMessage({ type: 'success', text: 'Database successfully generated and downloaded as SQL script.' });
      setTimeout(() => setAlertMessage(null), 5000);
    } catch (err: any) {
      setAlertMessage({ type: 'error', text: err.message || 'Failed to download SQL backup.' });
    } finally {
      setActionProgress(null);
    }
  };

  const handleCreateSnapshot = async () => {
    setActionProgress('Creating snapshot...');
    try {
      const label = newSnapshotLabel.trim() || `Snapshot ${new Date().toLocaleTimeString()}`;
      const snapshot = await createDatabaseSnapshot(label, 'manual');
      saveBackupToHistory(snapshot);
      loadBackupsList();
      setNewSnapshotLabel('');
      setShowCreateModal(false);
      setAlertMessage({ type: 'success', text: `Snapshot "${label}" created successfully!` });
      setTimeout(() => setAlertMessage(null), 4000);
    } catch (err: any) {
      setAlertMessage({ type: 'error', text: err.message || 'Failed to create snapshot.' });
    } finally {
      setActionProgress(null);
    }
  };

  const handleRestoreFromList = async (backup: DatabaseBackup) => {
    const confirmMsg = `⚠️ RESTORE DATABASE CONFIRMATION:\n\nAre you sure you want to restore the database to:\n"${backup.label}" (${new Date(backup.createdAt).toLocaleString()})?\n\nThis will replace current data with ${backup.totalRecords} records across all tables.\n(An automated pre-restore rollback point will be saved first).`;
    if (!confirm(confirmMsg)) return;

    setActionProgress(`Restoring from "${backup.label}"...`);
    try {
      const result = await restoreFromBackup(backup);
      if (result.success) {
        loadBackupsList();
        setAlertMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setAlertMessage({ type: 'error', text: result.message });
      }
    } catch (err: any) {
      setAlertMessage({ type: 'error', text: err.message || 'Restore failed.' });
    } finally {
      setActionProgress(null);
    }
  };

  const handleDeleteBackup = (backupId: string, label: string) => {
    if (!confirm(`Delete backup snapshot "${label}"?`)) return;
    deleteStoredBackup(backupId);
    loadBackupsList();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      if (!confirm(`Upload & Restore Database from file "${file.name}"?`)) {
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setActionProgress('Restoring uploaded database file...');
      try {
        const res = await restoreFromJsonFile(content);
        if (res.success) {
          loadBackupsList();
          setAlertMessage({ type: 'success', text: res.message });
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setAlertMessage({ type: 'error', text: res.message });
        }
      } catch (err: any) {
        setAlertMessage({ type: 'error', text: `Failed to restore file: ${err.message}` });
      } finally {
        setActionProgress(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleViewSql = (backup: DatabaseBackup) => {
    const sql = generateSqlDump(backup);
    setSqlModalContent(sql);
    setCopiedSql(false);
  };

  const copySqlToClipboard = () => {
    if (!sqlModalContent) return;
    navigator.clipboard.writeText(sqlModalContent);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const LATENCY_OPTIONS: Array<{ value: MockConfig['latency']; label: string }> = [
    { value: 'instant', label: 'Instant (0ms)' },
    { value: 'normal',  label: 'Normal (300ms)' },
    { value: 'slow',    label: 'Slow (1.0s)' },
  ];

  const isLive = !mockConfig.enabled;

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2.5rem)', maxWidth: 1040, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
            System Core
          </span>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>/</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Settings & Backup</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
          Database Settings, Backup & Restore
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Manage platform data source, perform 1-click database backups in JSON & SQL, view historical snapshots, and restore on demand.
        </p>
      </div>

      {/* Global Alert Notification */}
      {alertMessage && (
        <div style={{
          background: alertMessage.type === 'success' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1.5px solid ${alertMessage.type === 'success' ? 'rgba(22, 163, 74, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: alertMessage.type === 'success' ? '#16a34a' : '#ef4444',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 600,
          fontSize: '0.925rem',
        }}>
          {alertMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* Action Progress Overlay Banner */}
      {actionProgress && (
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-primary)',
          color: 'var(--color-primary)',
          padding: '0.875rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 700,
          fontSize: '0.9rem',
        }}>
          <RefreshCw size={16} className="spin" />
          <span>{actionProgress}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        padding: '6px',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '1.75rem',
        flexWrap: 'wrap',
      }}>
        {[
          { key: 'themes', label: '🎨 Themes & Branding', badge: currentTheme.shortName },
          { key: 'backup', label: '💾 Backup & Restore Hub', badge: `${backups.length} Snapshots` },
          { key: 'supabase', label: '☁️ Live Supabase Connection', badge: isLive ? '🟢 Connected' : '🟡 Standby' },
          { key: 'simulation', label: '⚡ Simulation & Cache', badge: mockConfig.latency.toUpperCase() },
        ].map(tab => {
          const isActive = settingsTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key as any)}
              style={{
                flex: 1,
                minWidth: 200,
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--color-surface-2)',
                color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 700,
              }}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* ─── 1. ONE-CLICK DATABASE BACKUP & RESTORE CENTER ────────────────── */}
        {settingsTab === 'backup' && (
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-2xl)',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <HardDriveDownload size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
                  Database Backup & Restore Hub
                </h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                  Complete 1-click full database export in JSON and PostgreSQL SQL format.
                </p>
              </div>
            </div>

            {/* Quick Trigger Buttons */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowCreateModal(true)}
                style={{ fontWeight: 700 }}
                id="create-snapshot-btn"
              >
                <Plus size={14} /> New Snapshot
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fileInputRef.current?.click()}
                style={{ fontWeight: 700 }}
                title="Upload and restore a JSON database file"
              >
                <Upload size={14} /> Restore File (JSON)
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* 1-Click Backup Action Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            
            {/* JSON Backup Card */}
            <div style={{
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <FileJson size={24} color="#0284c7" />
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>JSON Database Export</h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                  Complete serialized data package including hospitals, specialties, doctors, case studies, patient inquiries, email templates, and all CMS pages.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownloadJson}
                id="backup-json-btn"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 700, background: '#0284c7', borderColor: '#0284c7' }}
              >
                <Download size={15} /> 1-Click Backup (JSON)
              </button>
            </div>

            {/* SQL Backup Card */}
            <div style={{
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-surface-2)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <FileCode size={24} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.05rem' }}>SQL Database Dump</h3>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                  Standard PostgreSQL / Supabase SQL script containing table schemas, DDL, and transactional <code>INSERT INTO</code> statements for live migrations.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleDownloadSql}
                id="backup-sql-btn"
                style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
              >
                <Download size={15} /> 1-Click Backup (SQL)
              </button>
            </div>

          </div>

          {/* ─── SAVED BACKUPS LIST & POINT-IN-TIME RESTORE ──────────────────── */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1rem' }}>
                <History size={18} color="var(--color-primary)" />
                Historical Backup Snapshots ({backups.length})
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Select any backup point to restore your entire database with 1 click.
              </span>
            </div>

            {backups.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)' }}>
                <Clock size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontWeight: 600, margin: 0 }}>No historical backups found yet.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Click "1-Click Backup (JSON)" or "New Snapshot" to generate your first point-in-time backup.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {backups.map((b) => {
                  const dateFormatted = new Date(b.createdAt).toLocaleString();
                  const sizeKb = b.sizeBytes ? Math.round(b.sizeBytes / 1024) : 120;
                  const isRollback = b.type === 'pre_restore_rollback';

                  return (
                    <div
                      key={b.id}
                      style={{
                        background: isRollback ? 'rgba(234, 179, 8, 0.04)' : 'var(--color-surface-2)',
                        border: `1.5px solid ${isRollback ? 'rgba(234, 179, 8, 0.3)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {/* Left: Snapshot Info */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                            {b.label}
                          </span>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: isRollback ? 'rgba(234, 179, 8, 0.2)' : 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                            color: isRollback ? '#b45309' : 'var(--color-primary)',
                            padding: '2px 8px',
                            borderRadius: 999,
                          }}>
                            {isRollback ? 'Auto Rollback' : 'Snapshot'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} /> {dateFormatted}
                          </span>
                          <span>•</span>
                          <span><strong>{b.totalRecords}</strong> total records</span>
                          <span>•</span>
                          <span>Hospitals: {b.tableCounts?.hospitals ?? 0}, Specialties: {b.tableCounts?.specialties ?? 0}, Inquiries: {b.tableCounts?.inquiries ?? 0}, CMS: {b.tableCounts?.cmsPages ?? 0}</span>
                          <span>•</span>
                          <span style={{ fontFamily: 'monospace' }}>~{sizeKb} KB</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleRestoreFromList(b)}
                          title="Restore database to this point in time"
                          style={{ fontWeight: 700, fontSize: '0.8rem', gap: '0.35rem' }}
                        >
                          <RotateCcw size={13} /> Restore Database
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => downloadJsonBackup(b, b.label)}
                          title="Download this snapshot as JSON"
                          style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                        >
                          <FileJson size={13} /> JSON
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => downloadSqlBackup(b, b.label)}
                          title="Download this snapshot as SQL"
                          style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                        >
                          <FileCode size={13} /> SQL
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleViewSql(b)}
                          title="View PostgreSQL SQL script"
                          style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                        >
                          <Eye size={13} /> View SQL
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleDeleteBackup(b.id, b.label)}
                          title="Delete snapshot"
                          style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '4px 8px' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        )}

        {/* ─── 2. DATA SOURCE SELECTION CARDS ──────────────────────────────── */}
        {settingsTab === 'supabase' && (
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: isLive ? 'rgba(16,185,129,0.12)' : 'rgba(234,179,8,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isLive ? '#059669' : '#ca8a04' }}>
                <Database size={22} />
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Active Platform Data Source</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                  Currently running on: <strong>{isLive ? '🟢 Live Supabase Database' : '🟡 Mock Data Engine'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={testSupabaseConnection}
              disabled={testingConnection}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}
            >
              <RefreshCw size={13} className={testingConnection ? 'spin' : ''} />
              {testingConnection ? 'Pinging DB...' : 'Test Connection'}
            </button>
          </div>

          {/* Mode Cards Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            
            {/* Live Supabase Option */}
            <div
              onClick={() => setMode(true)}
              style={{
                border: isLive ? '2px solid #059669' : '1.5px solid var(--color-border)',
                background: isLive ? 'rgba(5, 150, 105, 0.05)' : 'var(--color-surface-2)',
                borderRadius: 12,
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cloud size={20} color="#059669" />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Live Supabase DB</span>
                </div>
                {isLive && (
                  <span style={{ background: '#059669', color: 'white', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase' }}>
                    Active
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                Real-time PostgreSQL read/write queries via Supabase Cloud. All patient inquiries, changes, and deletions persist live in your database.
              </p>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, fontFamily: 'monospace' }}>
                URL: https://vtcywighvyndtoxfvmny.supabase.co
              </div>
            </div>

            {/* Mock Data Center Option */}
            <div
              onClick={() => setMode(false)}
              style={{
                border: !isLive ? '2px solid #ca8a04' : '1.5px solid var(--color-border)',
                background: !isLive ? 'rgba(234, 179, 8, 0.05)' : 'var(--color-surface-2)',
                borderRadius: 12,
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={20} color="#ca8a04" />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Mock Data Center</span>
                </div>
                {!isLive && (
                  <span style={{ background: '#ca8a04', color: 'white', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase' }}>
                    Active
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem 0', lineHeight: 1.4 }}>
                Simulated offline data engine with persistent browser localStorage. Ideal for offline staging, high-speed demos, and stress tests.
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Storage Key: localStorage('med360_mock_store_v4')
              </div>
            </div>

          </div>

          {/* Connection Status Box */}
          {connectionStatus.tested && (
            <div style={{
              background: connectionStatus.online ? 'rgba(5, 150, 105, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1.5px solid ${connectionStatus.online ? 'rgba(5, 150, 105, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
              borderRadius: 10,
              padding: '1rem',
              color: connectionStatus.online ? '#059669' : '#ef4444',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {connectionStatus.online ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{connectionStatus.message}</span>
              </div>
              {connectionStatus.online && (
                <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                  {connectionStatus.hospitalsCount} Hospitals • {connectionStatus.inquiriesCount} Inquiries registered
                </div>
              )}
            </div>
          )}
        </div>
        )}

        {/* ─── 3. SIMULATED LATENCY & CACHE RESET ─────────────────────────── */}
        {settingsTab === 'simulation' && (
        <>
          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(26,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Zap size={20} />
              </div>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>Simulated Network Latency</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>Test responsive UI loading skeletons and state transitions</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {LATENCY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  id={`settings-latency-${value}-btn`}
                  onClick={() => setLatency(value)}
                  style={{
                    flex: 1,
                    minWidth: 140,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px solid ' + (mockConfig.latency === value ? 'var(--color-primary)' : 'var(--color-border)'),
                    background: mockConfig.latency === value ? 'rgba(26,107,255,0.06)' : 'var(--color-surface-2)',
                    color: mockConfig.latency === value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger)' }}>
                  <RotateCcw size={18} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', margin: 0 }}>Reset Local Data Cache</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>Reset local storage data to initial fresh seed state</p>
                </div>
              </div>
              <button
                onClick={resetMock}
                id="settings-reset-btn"
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.3)', fontWeight: 700 }}
              >
                Reset Local Storage
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 4 }}>System Access Credentials:</div>
            <div>👑 <strong>Administrator (Full Access):</strong> <code style={{ color: 'var(--color-primary)' }}>admin@med360.mu</code> / <code style={{ color: 'var(--color-primary)' }}>med360admin</code></div>
            <div>📋 <strong>Case Manager (Inquiries):</strong> <code style={{ color: '#0284c7' }}>case@med360.mu</code> / <code style={{ color: '#0284c7' }}>med360admin</code></div>
          </div>
        </>
        )}

        {/* ─── 4. THEMES & BRANDING MANAGER ───────────────────────────────── */}
        {settingsTab === 'themes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Active Theme Highlight Banner */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.accentColor})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  }}>
                    <Palette size={24} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                        Current Theme: {currentTheme.name}
                      </h2>
                      {currentTheme.badge && (
                        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                          {currentTheme.badge}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                      {currentTheme.description}
                    </p>
                  </div>
                </div>

                {theme !== 'Med-default' && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setTheme('Med-default');
                      setAlertMessage({ type: 'success', text: 'Reset theme to Med-default signature design!' });
                      setTimeout(() => setAlertMessage(null), 4000);
                    }}
                    style={{ fontWeight: 700 }}
                  >
                    <RotateCcw size={14} /> Reset to Med-default
                  </button>
                )}
              </div>

              {/* Live Preview Strip */}
              <div style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                    Active Color Swatches:
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600 }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: currentTheme.primaryColor, display: 'inline-block', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      <span>Primary ({currentTheme.primaryColor})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 600 }}>
                      <span style={{ width: 16, height: 16, borderRadius: '50%', background: currentTheme.accentColor, display: 'inline-block', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      <span>Accent ({currentTheme.accentColor})</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button type="button" className="btn btn-primary btn-sm" style={{ pointerEvents: 'none' }}>
                    Primary Button Preview
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" style={{ pointerEvents: 'none' }}>
                    Outline Button
                  </button>
                </div>
              </div>
            </div>

            {/* Theme Presets Catalog */}
            <div style={{
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--color-text)' }}>
                  Available Theme Presets
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Select any preset below to instantaneously switch the visual design system across patient portals, calculators, and admin views.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}>
                {availableThemes.map(t => {
                  const isActive = theme === t.id;
                  return (
                    <div
                      key={t.id}
                      style={{
                        border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-xl)',
                        padding: '1.25rem',
                        background: isActive ? 'var(--color-surface-2)' : 'var(--color-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 8px 24px var(--shadow-primary)' : 'none',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Top Bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})`,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            }} />
                            <div>
                              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--color-text)' }}>
                                {t.name}
                              </h4>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                ID: <code>{t.id}</code>
                              </span>
                            </div>
                          </div>
                          {t.badge && (
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 6,
                              background: t.isDark ? '#1e293b' : 'var(--color-surface-3)',
                              color: t.isDark ? '#f8fafc' : 'var(--color-text-secondary)',
                            }}>
                              {t.badge}
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                          {t.description}
                        </p>

                        {/* Palette Swatches Bar */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
                          <div title="Primary" style={{ flex: 1, height: 10, borderRadius: 3, background: t.primaryColor }} />
                          <div title="Accent" style={{ flex: 1, height: 10, borderRadius: 3, background: t.accentColor }} />
                          <div title="Surface" style={{ flex: 1, height: 10, borderRadius: 3, background: t.previewBg, border: '1px solid #cbd5e1' }} />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        className={`btn ${isActive ? 'btn-primary' : 'btn-outline'} btn-sm`}
                        onClick={() => {
                          setTheme(t.id);
                          setAlertMessage({ type: 'success', text: `Theme successfully set to ${t.name}!` });
                          setTimeout(() => setAlertMessage(null), 4000);
                        }}
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          fontWeight: 700,
                        }}
                      >
                        {isActive ? (
                          <>
                            <Check size={14} /> Active Theme
                          </>
                        ) : (
                          <>
                            <Sparkles size={14} /> Activate {t.shortName}
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── NEW SNAPSHOT MODAL ────────────────────────────────────────────── */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: 480,
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Create Database Snapshot</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
              Save a point-in-time snapshot of your database to local storage history. You can restore it anytime with 1 click.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                Snapshot Label / Description
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Pre-campaign state, Q3 medical catalog update..."
                value={newSnapshotLabel}
                onChange={(e) => setNewSnapshotLabel(e.target.value)}
                style={{ width: '100%' }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateSnapshot}
                style={{ fontWeight: 700 }}
              >
                Save Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SQL DUMP PREVIEW MODAL ────────────────────────────────────────── */}
      {sqlModalContent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            width: '100%',
            maxWidth: 820,
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCode size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.15rem' }}>PostgreSQL SQL Dump Preview</h3>
              </div>
              <button
                type="button"
                onClick={() => setSqlModalContent(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.25rem 1.5rem', flex: 1, overflowY: 'auto', background: '#090d10', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.8125rem', lineHeight: 1.55 }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {sqlModalContent}
              </pre>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {sqlModalContent.split('\n').length} lines • Ready for pgAdmin / Supabase SQL Editor
              </span>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={copySqlToClipboard}
                  style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {copiedSql ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const blob = new Blob([sqlModalContent], { type: 'application/sql' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `medical360_export_${Date.now()}.sql`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  style={{ fontWeight: 700 }}
                >
                  <Download size={14} /> Download .sql
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
