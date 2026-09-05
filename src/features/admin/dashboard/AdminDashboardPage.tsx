import { useState, useEffect } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  RefreshCw,
  Inbox,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockEngine } from '../../../core/mock/engine';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { DashboardDossierPanel } from './components/DashboardDossierPanel';
import { LatestActionsFeed } from './components/LatestActionsFeed';
import { CoordinatorTasksWorkstation } from './components/CoordinatorTasksWorkstation';
import { LatestRequestsTable } from './components/LatestRequestsTable';
import type { Inquiry, InquiryStatus } from '../../../core/types';
import { buildInquiryWhatsAppUrl } from '../../../core/services/whatsapp.service';
import '../AdminToolbar.css';

const STATUS_COLORS: Record<string, string> = {
  new: '#10b981',
  contacted: '#06b6d4',
  in_progress: '#f59e0b',
  awaiting_documents: '#8b5cf6',
  quoted: '#6366f1',
  confirmed: '#059669',
  completed: '#047857',
  cancelled: '#ef4444',
};

const STATUS_OPTIONS: InquiryStatus[] = [
  'new', 'contacted', 'in_progress', 'awaiting_documents',
  'quoted', 'confirmed', 'completed', 'cancelled'
];

export function AdminDashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { specialties } = useSpecialties();

  // Viewing dossier (inline drawer/card - strictly non-modal)
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  function getSpecialtyName(id: string) {
    return specialties.find((s) => s.id === id)?.name ?? id;
  }

  function getWhatsAppUrl(inq: Inquiry) {
    return buildInquiryWhatsAppUrl({
      firstName: inq.firstName,
      lastName: inq.lastName,
      country: inq.countryOfResidence,
      specialty: getSpecialtyName(inq.specialtyId),
      description: inq.description,
    });
  }

  function loadData() {
    setLoading(true);
    mockEngine.getInquiries()
      .then(setInquiries)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleStatusChange(id: string, status: InquiryStatus) {
    await mockEngine.updateInquiryStatus(id, status);
    loadData();
    if (viewingInquiry && viewingInquiry.id === id) {
      setViewingInquiry({ ...viewingInquiry, status });
    }
  }

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── 1. Top Mission & Operational Command Header ─────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-2) 100%)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              Operational Command Center
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}>
              <HeartHandshake size={13} />
              NGO Enn Rêv Enn Sourir
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Real-time coordinator task queues, latest clinical actions, and active patient consultations.
          </p>
        </div>

        {/* Operational Context & Action Triggers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.78rem',
            fontWeight: 600,
            padding: '5px 10px',
            borderRadius: '6px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}>
            <Clock size={13} />
            Coordinator Shift: <strong>Active (24/7 Hotline)</strong>
          </span>

          <button
            onClick={loadData}
            className="btn btn-sm btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            Refresh Stream
          </button>
        </div>
      </div>

      {/* ── 2. Top Split: Coordinator Tasks Workstation + 10 Latest Actions ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Left Column: User Tasks & Action Items */}
        <div>
          <CoordinatorTasksWorkstation />
        </div>

        {/* Right Column: 10 Latest Actions Feed */}
        <div>
          <LatestActionsFeed inquiries={inquiries} onRefresh={loadData} />
        </div>
      </div>

      {/* ── 3. Inline Patient Dossier Workstation (When an inquiry is selected) ─ */}
      {viewingInquiry && (
        <div style={{
          background: 'var(--color-bg)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              Active Clinical Dossier: {viewingInquiry.firstName} {viewingInquiry.lastName} ({viewingInquiry.id})
            </h3>
            <button
              onClick={() => setViewingInquiry(null)}
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '0.82rem' }}
            >
              Close Dossier Inspection
            </button>
          </div>

          <DashboardDossierPanel
            inquiry={viewingInquiry}
            specialtyName={getSpecialtyName(viewingInquiry.specialtyId)}
            statusColors={STATUS_COLORS}
            statusOptions={STATUS_OPTIONS}
            onClose={() => setViewingInquiry(null)}
            onStatusChange={(id, status) => handleStatusChange(id, status)}
            whatsAppUrl={getWhatsAppUrl(viewingInquiry)}
          />
        </div>
      )}

      {/* ── 4. Bottom Section: 10 Latest Patient Requests & Case Stream ──────── */}
      <div>
        <LatestRequestsTable
          inquiries={inquiries}
          specialties={specialties}
          onStatusChange={handleStatusChange}
          onViewDossier={(inq) => setViewingInquiry(inq)}
        />
      </div>

      {/* ── 5. Quick Navigation & Hospital Workstations Footer ───────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.85rem',
        marginTop: '0.5rem',
      }}>
        <Link
          to="/admin/inquiries"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'var(--color-text)',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Inquiries & WhatsApp Sync</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>Full triage & edge webhook logs</div>
          </div>
          <ExternalLink size={14} color="var(--color-primary)" />
        </Link>

        <Link
          to="/admin/hospitals"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'var(--color-text)',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Hospital Directory</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>Manage facilities & accreditations</div>
          </div>
          <ExternalLink size={14} color="var(--color-primary)" />
        </Link>

        <Link
          to="/admin/doctors"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'var(--color-text)',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Medical Specialists</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>Surgeons & clinical matrix</div>
          </div>
          <ExternalLink size={14} color="var(--color-primary)" />
        </Link>

        <Link
          to="/admin/campaigns"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'var(--color-text)',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Email Outreach</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)' }}>Patient communication & updates</div>
          </div>
          <ExternalLink size={14} color="var(--color-primary)" />
        </Link>
      </div>
    </div>
  );
}
