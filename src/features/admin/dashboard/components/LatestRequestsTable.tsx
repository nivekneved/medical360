import {
  Inbox,
  Eye,
  MessageCircle,
  Clock,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../../../core/services/format.service';
import { buildInquiryWhatsAppUrl } from '../../../../core/services/whatsapp.service';
import type { Inquiry, InquiryStatus, Specialty } from '../../../../core/types';

interface LatestRequestsTableProps {
  inquiries: Inquiry[];
  specialties: Specialty[];
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onViewDossier: (inquiry: Inquiry) => void;
}

const URGENCY_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  emergency: { label: 'EMERGENCY', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  urgent: { label: 'URGENT', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  routine: { label: 'ROUTINE', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: 'New Lead', color: '#10b981' },
  contacted: { label: 'Contacted', color: '#06b6d4' },
  in_progress: { label: 'In Progress', color: '#f59e0b' },
  awaiting_documents: { label: 'Awaiting Docs', color: '#8b5cf6' },
  quoted: { label: 'Quoted', color: '#6366f1' },
  confirmed: { label: 'Confirmed', color: '#059669' },
  completed: { label: 'Completed', color: '#047857' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
};

export function LatestRequestsTable({
  inquiries,
  specialties,
  onStatusChange,
  onViewDossier,
}: LatestRequestsTableProps) {
  const latestTen = inquiries.slice(0, 10);

  const getSpecialtyName = (id: string) => {
    return specialties.find(s => s.id === id)?.name || id;
  };

  const getWhatsAppUrl = (inq: Inquiry) => {
    return buildInquiryWhatsAppUrl({
      firstName: inq.firstName,
      lastName: inq.lastName,
      country: inq.countryOfResidence,
      specialty: getSpecialtyName(inq.specialtyId),
      description: inq.description,
    });
  };

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Inbox size={18} color="var(--color-primary)" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
            10 Latest Patient Requests & Case Stream
          </h3>
        </div>

        <Link
          to="/admin/inquiries"
          className="btn btn-sm btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
        >
          View Full Inquiries Workspace ({inquiries.length})
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Table of 10 Latest Requests */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.65rem 0.5rem' }}>Patient & Origin</th>
              <th style={{ padding: '0.65rem 0.5rem' }}>Specialty & Need</th>
              <th style={{ padding: '0.65rem 0.5rem' }}>Urgency</th>
              <th style={{ padding: '0.65rem 0.5rem' }}>Status</th>
              <th style={{ padding: '0.65rem 0.5rem' }}>Submitted</th>
              <th style={{ padding: '0.65rem 0.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {latestTen.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                  No patient inquiries found.
                </td>
              </tr>
            ) : (
              latestTen.map((inq, idx) => {
                const urgency = URGENCY_BADGES[inq.urgency] || URGENCY_BADGES.routine;
                const statusInfo = STATUS_CONFIG[inq.status] || { label: inq.status, color: '#6b7280' };

                return (
                  <tr
                    key={inq.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {/* Patient Name & Origin */}
                    <td style={{ padding: '0.65rem 0.5rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', minWidth: '20px' }}>
                          #{idx + 1}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                            {inq.firstName} {inq.lastName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Globe size={11} /> {inq.countryOfResidence} · {inq.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Specialty & Need */}
                    <td style={{ padding: '0.65rem 0.5rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {getSpecialtyName(inq.specialtyId)}
                      </div>
                      <div style={{
                        fontSize: '0.74rem',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '280px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {inq.description}
                      </div>
                    </td>

                    {/* Urgency */}
                    <td style={{ padding: '0.65rem 0.5rem', verticalAlign: 'middle' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: urgency.bg,
                        color: urgency.color,
                        border: `1px solid ${urgency.color}30`,
                      }}>
                        {urgency.label}
                      </span>
                    </td>

                    {/* Status Updater Dropdown */}
                    <td style={{ padding: '0.65rem 0.5rem', verticalAlign: 'middle' }}>
                      <select
                        value={inq.status}
                        onChange={(e) => onStatusChange(inq.id, e.target.value as InquiryStatus)}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: `1px solid ${statusInfo.color}50`,
                          background: `${statusInfo.color}15`,
                          color: statusInfo.color,
                          cursor: 'pointer',
                        }}
                      >
                        {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                          <option key={k} value={k} style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
                            {cfg.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Submitted */}
                    <td style={{ padding: '0.65rem 0.5rem', verticalAlign: 'middle', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} />
                        {formatRelativeTime(inq.createdAt)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.65rem 0.5rem', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {/* Dossier Preview Button */}
                        <button
                          type="button"
                          onClick={() => onViewDossier(inq)}
                          className="btn btn-sm btn-ghost"
                          title="Inspect Clinical Dossier & Scan Viewer"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                        >
                          <Eye size={13} />
                          Dossier
                        </button>

                        {/* WhatsApp Hotline Action */}
                        <a
                          href={getWhatsAppUrl(inq)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-whatsapp"
                          title="Contact patient directly via WhatsApp"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', padding: '3px 8px' }}
                        >
                          <MessageCircle size={13} />
                          WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
