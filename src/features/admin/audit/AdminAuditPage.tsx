import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Download,
  Filter,
  Trash2,
  Clock,
  User,
  Activity,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';
import { auditService, type AuditLogEntry } from '../../../core/services/audit.service';
import { useToast } from '../../../providers/ToastProvider';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import './AdminAudit.css';

export function AdminAuditPage() {
  const toast = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const loadLogs = () => {
    setLogs(auditService.getLogs());
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchAction = actionFilter === 'all' || log.action === actionFilter;
      const matchEntity = entityFilter === 'all' || log.entityType === entityFilter;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        log.details.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q);
      return matchAction && matchEntity && matchSearch;
    });
  }, [logs, search, actionFilter, entityFilter]);

  const handleExportCsv = () => {
    const csvContent = auditService.exportCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `med360-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Full audit history exported to CSV successfully.', {
      title: 'Audit Trail Exported',
    });
  };

  const handleConfirmClear = () => {
    auditService.clearLogs();
    setLogs([]);
    setClearConfirmOpen(false);
    toast.info('Audit trail history has been reset.', {
      title: 'Audit Logs Cleared',
    });
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <span className="admin-audit-badge admin-audit-badge--create">Create</span>;
      case 'update':
      case 'update_seo':
        return <span className="admin-audit-badge admin-audit-badge--update">Update</span>;
      case 'delete':
        return <span className="admin-audit-badge admin-audit-badge--delete">Delete</span>;
      case 'toggle_maintenance':
      case 'export':
        return <span className="admin-audit-badge admin-audit-badge--system">System</span>;
      case 'login':
        return <span className="admin-audit-badge admin-audit-badge--login">Auth</span>;
      default:
        return <span className="admin-audit-badge">{action}</span>;
    }
  };

  return (
    <div className="admin-audit-container">
      {/* ── Header ── */}
      <div className="admin-audit-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={26} color="#34d399" /> Security & Activity Audit Trail
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.35rem 0 0', fontSize: '0.875rem' }}>
            Immutable administrative event logging, patient data access tracking, and system configuration history.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleExportCsv}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
          >
            <Download size={15} /> Export CSV
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setClearConfirmOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}
          >
            <Trash2 size={15} /> Clear History
          </button>
        </div>
      </div>

      {/* ── Filters & Controls ── */}
      <div className="admin-audit-controls">
        <div className="admin-audit-search">
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input
            type="text"
            placeholder="Search audit records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '0.5rem 0.75rem',
              color: '#fff',
              fontSize: '0.8125rem',
              outline: 'none',
            }}
          >
            <option value="all">All Actions</option>
            <option value="create">Entity Creation</option>
            <option value="update">Updates & Edits</option>
            <option value="delete">Deletions</option>
            <option value="update_seo">SEO Customizations</option>
            <option value="toggle_maintenance">Maintenance Toggles</option>
            <option value="login">Authentication</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '0.5rem 0.75rem',
              color: '#fff',
              fontSize: '0.8125rem',
              outline: 'none',
            }}
          >
            <option value="all">All Domains</option>
            <option value="hospital">Hospitals</option>
            <option value="specialty">Specialties</option>
            <option value="doctor">Doctors</option>
            <option value="case_study">Case Studies</option>
            <option value="inquiry">Patient Inquiries</option>
            <option value="seo">SEO & Metadata</option>
            <option value="system">System & Hotlines</option>
            <option value="auth">Admin Access</option>
          </select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="admin-audit-table-wrapper">
        {filteredLogs.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <Activity size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>No audit records match the selected filter</div>
            <div style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>Try clearing filters or search terms.</div>
          </div>
        ) : (
          <table className="admin-audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Administrator</th>
                <th>Domain</th>
                <th>Event Description & Details</th>
                <th>Client Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} color="rgba(255,255,255,0.4)" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td>{getActionBadge(log.action)}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{log.actorName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
                      {log.actorRole.replace('_', ' ')}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      background: 'rgba(255,255,255,0.06)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      textTransform: 'capitalize',
                    }}>
                      {log.entityType.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {log.details}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                    {log.ipAddress || 'Internal Direct'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Dialog for Clearing Logs */}
      <ConfirmDialog
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        title="Clear Entire Audit Trail?"
        message="Are you sure you want to purge the administrative audit history? This action cannot be undone."
        confirmLabel="Yes, Clear All Logs"
        variant="danger"
      />
    </div>
  );
}
