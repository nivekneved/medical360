import { useState, useEffect } from 'react';
import { mockEngine } from '../../../core/mock/engine';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { formatRelativeTime } from '../../../core/services/format.service';
import type { Inquiry, InquiryStatus } from '../../../core/types';

const STATUS_OPTIONS: InquiryStatus[] = [
  'new', 'contacted', 'in_progress', 'awaiting_documents',
  'quoted', 'confirmed', 'completed', 'cancelled'
];

export function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading]     = useState(true);
  const { specialties }           = useSpecialties();

  function load() {
    mockEngine.getInquiries().then(setInquiries).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: InquiryStatus) {
    await mockEngine.updateInquiryStatus(id, status);
    load();
  }

  function getSpecialtyName(id: string) {
    return specialties.find((s) => s.id === id)?.name ?? id;
  }

  const urgencyColor = (u: string) =>
    u === 'emergency' ? '#cc1133' : u === 'urgent' ? '#c88a00' : 'var(--color-success)';

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Patient Inquiries</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        All incoming patient inquiries. Update status as you progress each case.
      </p>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12 }} />
          ))}
        </div>
      ) : (
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)' }}>
                {['Patient', 'Country', 'Specialty', 'Description', 'Urgency', 'Status', 'Submitted'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq, i) => (
                <tr key={inq.id} id={`inquiry-row-${inq.id}`} style={{ borderTop: '1px solid var(--color-border)', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    {inq.firstName} {inq.lastName}
                    <br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>{inq.email}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                    {inq.countryOfResidence}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                    {getSpecialtyName(inq.specialtyId)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', maxWidth: 200 }}>
                    {inq.description.slice(0, 80)}...
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textTransform: 'capitalize', fontSize: '0.8125rem', fontWeight: 600, color: urgencyColor(inq.urgency) }}>
                    {inq.urgency}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <select
                      id={`inquiry-status-${inq.id}`}
                      value={inq.status}
                      onChange={e => updateStatus(inq.id, e.target.value as InquiryStatus)}
                      style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {formatRelativeTime(inq.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
