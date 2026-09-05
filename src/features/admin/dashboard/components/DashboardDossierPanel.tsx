import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import type { Inquiry, InquiryStatus } from '../../../../core/types';
import { formatRelativeTime } from '../../../../core/services/format.service';

interface DashboardDossierPanelProps {
  inquiry: Inquiry;
  specialtyName: string;
  statusColors: Record<string, string>;
  statusOptions: InquiryStatus[];
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onClose: () => void;
  whatsAppUrl: string;
}

export const DashboardDossierPanel: React.FC<DashboardDossierPanelProps> = ({
  inquiry,
  specialtyName,
  statusColors,
  statusOptions,
  onStatusChange,
  onClose,
  whatsAppUrl,
}) => {
  return (
    <div style={{
      marginBottom: '2rem',
      background: 'var(--color-surface)',
      border: '2px solid var(--color-primary)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.75rem',
      boxShadow: 'var(--shadow-lg)',
      animation: 'fadeIn 0.25s ease-out',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {inquiry.firstName} {inquiry.lastName}
            </h2>
            <span style={{
              background: `${statusColors[inquiry.status]}20`,
              color: statusColors[inquiry.status],
              padding: '2px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}>
              {inquiry.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Submitted {formatRelativeTime(inquiry.createdAt)} · Resident of {inquiry.countryOfResidence}
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <X size={14} /> Close Dossier
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Contact Channels
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div><strong>Phone:</strong> {inquiry.phone}</div>
            <div><strong>Email:</strong> {inquiry.email}</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Clinical Track
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
            <div><strong>Specialty:</strong> {specialtyName}</div>
            {inquiry.serviceName && <div><strong>Service:</strong> {inquiry.serviceName}</div>}
            <div><strong>Urgency:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{inquiry.urgency}</span></div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Workflow State
          </div>
          <select
            value={inquiry.status}
            onChange={e => onStatusChange(inquiry.id, e.target.value as InquiryStatus)}
            className="form-input"
            style={{ fontWeight: 700, fontSize: '0.875rem' }}
          >
            {statusOptions.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
          Medical Need Description
        </div>
        <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.6, border: '1px solid var(--color-border)' }}>
          {inquiry.description}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontWeight: 700 }}
        >
          <MessageCircle size={16} /> WhatsApp Patient Now
        </a>
      </div>
    </div>
  );
};
