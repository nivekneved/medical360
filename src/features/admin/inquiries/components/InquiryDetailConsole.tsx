import React, { useState } from 'react';
import {
  RotateCcw,
  Printer,
  MessageCircle,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Eye,
  Activity,
  FileText,
} from 'lucide-react';
import type { Inquiry, InquiryStatus, Specialty } from '../../../../core/types';
import { buildInquiryWhatsAppUrl } from '../../../../core/services/whatsapp.service';
import { formatCostRange } from '../../../../core/services/format.service';
import { MedicalImagingViewer } from '../../../../components/common/MedicalImagingViewer';

interface InquiryDetailConsoleProps {
  inquiry: Inquiry;
  specialties: Specialty[];
  statusOptions: InquiryStatus[];
  onBack: () => void;
  onUpdateStatus: (id: string, status: InquiryStatus) => void;
  onDelete: (id: string, name: string) => void;
  onPrint: (inquiry: Inquiry) => void;
  newNoteText: string;
  onNewNoteTextChange: (text: string) => void;
  onAddNote: (e: React.FormEvent) => void;
  savingNote: boolean;
}

export const InquiryDetailConsole: React.FC<InquiryDetailConsoleProps> = ({
  inquiry,
  specialties,
  statusOptions,
  onBack,
  onUpdateStatus,
  onDelete,
  onPrint,
  newNoteText,
  onNewNoteTextChange,
  onAddNote,
  savingNote,
}) => {
  const [showScanViewer, setShowScanViewer] = useState(false);

  const getSpecialtyName = (sId: string) => {
    const s = specialties.find(item => item.id === sId);
    return s ? s.name : sId;
  };

  const urgencyColor = (u: string) =>
    u === 'emergency' ? '#dc2626' : u === 'urgent' ? '#d97706' : '#059669';

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
      {/* Top Sticky Action Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-surface)',
        padding: '1.25rem 1.75rem',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--color-border)',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={onBack}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <RotateCcw size={15} /> Back to Inquiries
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${urgencyColor(inquiry.urgency)}15`,
              color: urgencyColor(inquiry.urgency),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                {inquiry.firstName} {inquiry.lastName}
              </h1>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Inquiry Ref: <code>{inquiry.id}</code> • Submitted: {formatDate(inquiry.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setShowScanViewer(!showScanViewer)}
            className={`btn btn-sm ${showScanViewer ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Activity size={15} /> {showScanViewer ? 'Hide Clinical Viewer' : 'DICOM / Scans Viewer'}
          </button>

          <button
            type="button"
            onClick={() => onPrint(inquiry)}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Printer size={15} /> Print Dossier
          </button>

          <a
            href={buildInquiryWhatsAppUrl({
              firstName: inquiry.firstName,
              lastName: inquiry.lastName,
              country: inquiry.countryOfResidence,
              specialty: getSpecialtyName(inquiry.specialtyId),
              description: inquiry.description,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ color: '#25D366', borderColor: '#25D366', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <MessageCircle size={16} /> WhatsApp Patient
          </a>

          <button
            type="button"
            onClick={() => {
              const name = `${inquiry.firstName} ${inquiry.lastName}`;
              onDelete(inquiry.id, name);
            }}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      {/* ── Inline Medical Imaging / DICOM Viewer Section ── */}
      {showScanViewer && (
        <div style={{ marginBottom: '1.5rem' }}>
          <MedicalImagingViewer
            patientName={`${inquiry.firstName} ${inquiry.lastName}`}
            inquiryId={inquiry.id}
            specialtyName={getSpecialtyName(inquiry.specialtyId)}
            onClose={() => setShowScanViewer(false)}
          />
        </div>
      )}

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Triage Status & Demographics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Card */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-border)',
            padding: '1.5rem',
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 1rem 0' }}>
              Triage Status & Urgency
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
                  Current Workflow Status:
                </label>
                <select
                  value={inquiry.status}
                  onChange={e => onUpdateStatus(inquiry.id, e.target.value as InquiryStatus)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Triage Urgency:</span>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: `${urgencyColor(inquiry.urgency)}20`,
                  color: urgencyColor(inquiry.urgency),
                  padding: '4px 12px',
                  borderRadius: 999,
                }}>
                  {inquiry.urgency} Urgency
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-border)',
            padding: '1.5rem',
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 1rem 0' }}>
              Patient Contact Info
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={16} color="var(--color-primary)" />
                <a href={`tel:${inquiry.phone}`} style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600 }}>
                  {inquiry.phone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} color="var(--color-primary)" />
                <a href={`mailto:${inquiry.email}`} style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600 }}>
                  {inquiry.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={16} color="var(--color-primary)" />
                <span>Residence: <strong>{inquiry.countryOfResidence}</strong></span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-border)',
            padding: '1.5rem',
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 1rem 0' }}>
              Treatment Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              {inquiry.serviceName && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Requested Service:</span>
                  <strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>✦ {inquiry.serviceName}</strong>
                </div>
              )}
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Specialty Track:</span>
                <strong>{getSpecialtyName(inquiry.specialtyId)}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Preferred Destination:</span>
                <strong>{inquiry.preferredCountry || 'Any accredited partner hospital'}</strong>
              </div>
              {inquiry.budgetRangeUSD && (
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Budget Target:</span>
                  <strong>{formatCostRange(inquiry.budgetRangeUSD.min, inquiry.budgetRangeUSD.max)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Symptoms & Clinical Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Medical Need */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-border)',
            padding: '1.75rem',
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: '0 0 0.75rem 0' }}>
              Clinical Need & Symptoms
            </h3>
            <div style={{
              background: 'var(--color-surface-2)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
            }}>
              {inquiry.description}
            </div>
          </div>

          {/* Notes Timeline */}
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-border)',
            padding: '1.75rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
                Internal Clinical Notes ({inquiry.notes?.length || 0})
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Staff Only</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 320, overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.5rem' }}>
              {(!inquiry.notes || inquiry.notes.length === 0) ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>
                  No internal notes recorded yet.
                </p>
              ) : (
                inquiry.notes.map((note) => (
                  <div key={note.id} style={{ background: 'var(--color-surface-2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{note.authorId}</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={onAddNote} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add triage note or doctor follow-up update..."
                value={newNoteText}
                onChange={e => onNewNoteTextChange(e.target.value)}
                style={{ flex: 1, fontSize: '0.9rem' }}
              />
              <button type="submit" disabled={savingNote || !newNoteText.trim()} className="btn btn-primary" style={{ minWidth: 120 }}>
                {savingNote ? 'Adding...' : 'Add Note'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
