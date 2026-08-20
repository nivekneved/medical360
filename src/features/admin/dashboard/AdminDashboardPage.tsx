import { useState, useEffect } from 'react';
import { Inbox, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { formatRelativeTime } from '../../../core/services/format.service';
import type { Inquiry } from '../../../core/types';

const STATUS_COLORS: Record<string, string> = {
  new: '#1a6bff',
  contacted: '#00a88b',
  in_progress: '#c88a00',
  awaiting_documents: '#4444cc',
  quoted: '#7744cc',
  confirmed: '#007a5a',
  completed: '#005c43',
  cancelled: '#cc1133',
};

export function AdminDashboardPage() {
  const [stats, setStats]   = useState({ total: 0, new: 0, inProgress: 0, completed: 0 });
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const { specialties }     = useSpecialties();

  useEffect(() => {
    mockEngine.getInquiryStats().then(setStats);
    mockEngine.getInquiries().then((inqs: Inquiry[]) => setRecent(inqs.slice(0, 5)));
  }, []);

  function getSpecialtyName(id: string) {
    return specialties.find((s) => s.id === id)?.name ?? id;
  }

  const STAT_CARDS = [
    { icon: Inbox,       label: 'Total Inquiries', value: stats.total,      color: 'var(--color-primary)' },
    { icon: Clock,       label: 'New / Pending',   value: stats.new,        color: '#ffb400' },
    { icon: TrendingUp,  label: 'In Progress',      value: stats.inProgress, color: 'var(--color-accent)' },
    { icon: CheckCircle, label: 'Completed',        value: stats.completed,  color: 'var(--color-success)' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        Overview of Medical 360 patient inquiries.
      </p>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {STAT_CARDS.map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
              <Icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Inquiries Table */}
      <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Inquiries</h2>
          <a href="/admin/inquiries" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 600 }}>View all</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-2)' }}>
              {['Patient', 'Specialty', 'Urgency', 'Status', 'Submitted'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((inq, i) => (
              <tr key={inq.id} style={{ borderTop: '1px solid var(--color-border)', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)' }}>
                <td style={{ padding: '0.875rem 1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  {inq.firstName} {inq.lastName}
                </td>
                <td style={{ padding: '0.875rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  {getSpecialtyName(inq.specialtyId)}
                </td>
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999, textTransform: 'capitalize', background: inq.urgency === 'emergency' ? 'rgba(255,69,96,0.1)' : inq.urgency === 'urgent' ? 'rgba(255,180,0,0.1)' : 'rgba(0,196,140,0.1)', color: inq.urgency === 'emergency' ? '#cc1133' : inq.urgency === 'urgent' ? '#c88a00' : '#007a5a' }}>
                    {inq.urgency}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999, textTransform: 'capitalize', background: (STATUS_COLORS[inq.status] ?? '#888') + '18', color: STATUS_COLORS[inq.status] ?? '#888' }}>
                    {inq.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ padding: '0.875rem 1.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  {formatRelativeTime(inq.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
