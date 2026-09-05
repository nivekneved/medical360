import { useMemo } from 'react';
import {
  Activity,
  MessageCircle,
  FileText,
  Shield,
  Download,
  Edit3,
  Clock,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { formatRelativeTime } from '../../../../core/services/format.service';
import { getAuditLog } from '../../../../core/services/audit.service';
import { getWhatsAppConsultationLogs } from '../../../../core/services/whatsapp.service';
import type { Inquiry } from '../../../../core/types';

export interface ActionItem {
  id: string;
  type: 'inquiry' | 'whatsapp' | 'audit' | 'system';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  badgeText: string;
  badgeColor: string;
}

interface LatestActionsFeedProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

export function LatestActionsFeed({ inquiries, onRefresh }: LatestActionsFeedProps) {
  const latestActions = useMemo<ActionItem[]>(() => {
    const actions: ActionItem[] = [];

    // 1. Inquiries actions
    inquiries.slice(0, 10).forEach(inq => {
      actions.push({
        id: `act-inq-${inq.id}`,
        type: 'inquiry',
        title: `Patient Consultation Submitted: ${inq.firstName} ${inq.lastName}`,
        description: `Urgency: ${inq.urgency.toUpperCase()} · Status: ${inq.status.replace(/_/g, ' ')} · Country: ${inq.countryOfResidence}`,
        timestamp: inq.updatedAt || inq.createdAt,
        actor: inq.assignedCaseManagerId || 'Patient (Direct Web)',
        badgeText: inq.status.toUpperCase(),
        badgeColor: inq.status === 'new' ? '#10b981' : '#3b82f6',
      });
    });

    // 2. WhatsApp consultation logs
    const waLogs = getWhatsAppConsultationLogs();
    waLogs.slice(0, 5).forEach(wa => {
      actions.push({
        id: `act-wa-${wa.id}`,
        type: 'whatsapp',
        title: `WhatsApp Referral Dispatched: ${wa.patientName || 'Anonymous Patient'}`,
        description: `Specialty: ${wa.specialty || 'General Hotline'} · Phone: ${wa.phone || 'Direct App'} · Source: ${wa.source}`,
        timestamp: wa.timestamp,
        actor: 'WhatsApp 24/7 Hotline',
        badgeText: 'WHATSAPP',
        badgeColor: '#16a34a',
      });
    });

    // 3. Security & Admin Audit logs
    const auditLogs = getAuditLog();
    auditLogs.slice(0, 5).forEach(audit => {
      actions.push({
        id: `act-aud-${audit.id}`,
        type: 'audit',
        title: `System Action: ${audit.action}`,
        description: `Category: ${audit.category} · Checksum: ${audit.checksum}`,
        timestamp: audit.timestamp,
        actor: audit.user,
        badgeText: audit.category,
        badgeColor: audit.category === 'SECURITY_ALERT' ? '#ef4444' : '#6366f1',
      });
    });

    // Sort descending by timestamp and take top 10
    return actions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [inquiries]);

  const getActionIcon = (type: ActionItem['type'], title: string) => {
    if (type === 'whatsapp') return <MessageCircle size={16} color="#16a34a" />;
    if (type === 'audit') {
      if (title.includes('Export') || title.includes('PDF')) return <Download size={16} color="#6366f1" />;
      if (title.includes('CMS')) return <Edit3 size={16} color="#f59e0b" />;
      return <Shield size={16} color="#8b5cf6" />;
    }
    if (title.includes('Assigned')) return <UserCheck size={16} color="#3b82f6" />;
    return <FileText size={16} color="#10b981" />;
  };

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--color-primary)" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
            10 Latest Actions & Live Event Stream
          </h3>
        </div>
        <button
          onClick={onRefresh}
          className="btn btn-sm btn-ghost"
          title="Refresh activity stream"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
        >
          <RefreshCw size={13} />
          Sync
        </button>
      </div>

      {/* Action Items List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        overflowY: 'auto',
        maxHeight: '440px',
        paddingRight: '4px',
      }}>
        {latestActions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            No recent actions recorded.
          </div>
        ) : (
          latestActions.map((action, idx) => (
            <div
              key={action.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.65rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
            >
              {/* Sequence Index & Icon */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                marginTop: '2px',
                minWidth: '24px',
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  #{idx + 1}
                </span>
                {getActionIcon(action.type, action.title)}
              </div>

              {/* Main Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '2px' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {action.title}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: `${action.badgeColor}18`,
                    color: action.badgeColor,
                    border: `1px solid ${action.badgeColor}40`,
                    flexShrink: 0,
                  }}>
                    {action.badgeText}
                  </span>
                </div>

                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '0.78rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.35,
                }}>
                  {action.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.72rem',
                  color: 'var(--color-text-muted)',
                }}>
                  <span>Actor: <strong>{action.actor}</strong></span>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} />
                    {formatRelativeTime(action.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
