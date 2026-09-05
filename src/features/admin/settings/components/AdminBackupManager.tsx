import React, { useState } from 'react';
import {
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Database,
  Code,
} from 'lucide-react';
import {
  DatabaseBackup,
  createDatabaseSnapshot,
  getStoredBackups,
  saveBackupToHistory,
  deleteStoredBackup,
  downloadJsonBackup,
  restoreFromBackup,
  generateSqlDump,
} from '../../../../core/services/backup.service';

interface AdminBackupManagerProps {
  onNotify: (msg: { text: string; isError?: boolean }) => void;
}

export const AdminBackupManager: React.FC<AdminBackupManagerProps> = ({ onNotify }) => {
  const [snapshots, setSnapshots] = useState<DatabaseBackup[]>(() => getStoredBackups());
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [snapshotLabel, setSnapshotLabel] = useState('');
  const [snapshotDesc, setSnapshotDesc] = useState('');
  const [snapshotType, setSnapshotType] = useState<'manual' | 'auto_snapshot' | 'pre_restore_rollback'>('manual');
  const [activeSqlDump, setActiveSqlDump] = useState<string | null>(null);

  const refreshSnapshots = () => {
    setSnapshots(getStoredBackups());
  };

  const handleCreateSnapshotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotLabel.trim()) {
      onNotify({ text: 'Please enter a snapshot label.', isError: true });
      return;
    }

    try {
      const snap = await createDatabaseSnapshot(snapshotLabel.trim(), snapshotType);
      saveBackupToHistory(snap);
      refreshSnapshots();
      setIsCreatingSnapshot(false);
      setSnapshotLabel('');
      setSnapshotDesc('');
      onNotify({ text: `System snapshot "${snap.label}" created successfully.` });
    } catch (err) {
      console.error(err);
      onNotify({ text: 'Failed to create system snapshot.', isError: true });
    }
  };

  const handleDownloadSnapshot = async (snap: DatabaseBackup) => {
    await downloadJsonBackup(snap);
    onNotify({ text: `Downloading ${snap.label}.json` });
  };

  const handleRestore = async (snap: DatabaseBackup) => {
    if (!window.confirm(`Are you sure you want to restore snapshot "${snap.label}"? All current data will be rolled back.`)) return;
    try {
      const res = await restoreFromBackup(snap);
      if (res.success) {
        onNotify({ text: res.message });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        onNotify({ text: res.message, isError: true });
      }
    } catch (err) {
      console.error(err);
      onNotify({ text: 'Failed to restore snapshot.', isError: true });
    }
  };

  const handleDelete = (snap: DatabaseBackup) => {
    if (!window.confirm(`Delete snapshot "${snap.label}"?`)) return;
    deleteStoredBackup(snap.id);
    refreshSnapshots();
    onNotify({ text: 'Snapshot removed.' });
  };

  const handleExportSql = async () => {
    try {
      const snap = snapshots[0] || (await createDatabaseSnapshot('SQL Export Snapshot'));
      const dump = generateSqlDump(snap);
      setActiveSqlDump(dump);
      onNotify({ text: 'Generated PostgreSQL Schema & Data DDL Dump.' });
    } catch (err) {
      console.error(err);
      onNotify({ text: 'Failed to generate SQL dump.', isError: true });
    }
  };

  const handleDownloadSqlFile = () => {
    if (!activeSqlDump) return;
    const blob = new Blob([activeSqlDump], { type: 'application/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `med360_postgres_backup_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify({ text: 'Downloaded med360_postgres_backup.sql' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1rem',
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="var(--color-primary)" />
            Database Backups, Snapshots & SQL DDL
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
            Automated database snapshots, rollback recovery points, and full PostgreSQL migration exports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportSql}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Code size={15} /> Export SQL Dump
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingSnapshot(!isCreatingSnapshot)}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Plus size={15} /> {isCreatingSnapshot ? 'Close Form' : 'New Snapshot'}
          </button>
        </div>
      </div>

      {/* Inline Create Snapshot Form (Zero Popups) */}
      {isCreatingSnapshot && (
        <div style={{
          background: 'var(--color-surface-2)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
            Create Point-in-Time System Snapshot
          </h3>
          <form onSubmit={handleCreateSnapshotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                  Snapshot Label *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Pre-Update Hospital Pricing Sync"
                  value={snapshotLabel}
                  onChange={e => setSnapshotLabel(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                  Snapshot Category
                </label>
                <select
                  className="form-input"
                  value={snapshotType}
                  onChange={e => setSnapshotType(e.target.value as any)}
                >
                  <option value="manual">Manual Backup</option>
                  <option value="auto_snapshot">Automated Periodic Snapshot</option>
                  <option value="pre_restore_rollback">Pre-Restore Recovery Point</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                Clinical & Administrative Notes
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Optional context or backup reason..."
                value={snapshotDesc}
                onChange={e => setSnapshotDesc(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setIsCreatingSnapshot(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ fontWeight: 700 }}
              >
                Create Snapshot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SQL Dump Inspector (Inline - Zero Popups) */}
      {activeSqlDump && (
        <div style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Code size={16} color="var(--color-primary)" /> PostgreSQL DDL Migration Dump
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleDownloadSqlFile}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                <Download size={13} /> Download .sql
              </button>
              <button
                type="button"
                onClick={() => setActiveSqlDump(null)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                Close
              </button>
            </div>
          </div>
          <pre style={{
            background: 'var(--color-dark-2)',
            color: '#a7f3d0',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            maxHeight: 280,
            overflowY: 'auto',
            fontFamily: 'monospace',
            lineHeight: 1.5,
          }}>
            {activeSqlDump}
          </pre>
        </div>
      )}

      {/* Snapshots Table */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--color-border)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Snapshot Label</th>
              <th style={{ padding: '0.85rem 1rem' }}>Category</th>
              <th style={{ padding: '0.85rem 1rem' }}>Size</th>
              <th style={{ padding: '0.85rem 1rem' }}>Created</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  No point-in-time snapshots recorded yet.
                </td>
              </tr>
            ) : (
              snapshots.map(snap => (
                <tr key={snap.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{snap.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {snap.totalRecords} records ({snap.tableCounts ? `${snap.tableCounts.hospitals} hosp, ${snap.tableCounts.doctors} docs` : 'Full DB'})
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: snap.type === 'pre_restore_rollback' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(6, 95, 70, 0.1)',
                      color: snap.type === 'pre_restore_rollback' ? '#d97706' : 'var(--color-primary)',
                    }}>
                      {snap.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {(((snap.sizeBytes || 0)) / 1024).toFixed(1)} KB
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {new Date(snap.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => handleDownloadSnapshot(snap)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                        title="Download JSON Snapshot"
                      >
                        <Download size={13} />
                      </button>
                      <button
                        onClick={() => handleRestore(snap)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.75rem', color: 'var(--color-primary)' }}
                        title="Rollback to this snapshot"
                      >
                        <RotateCcw size={13} /> Restore
                      </button>
                      <button
                        onClick={() => handleDelete(snap)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.75rem', color: 'var(--color-danger)' }}
                        title="Delete snapshot"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
