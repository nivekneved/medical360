import React, { useState, useMemo } from 'react';
import {
  Plane,
  FileCheck2,
  Users,
  MapPin,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  Building2,
  Plus,
  Compass,
} from 'lucide-react';
import { useToast } from '../../../providers/ToastProvider';
import { auditService } from '../../../core/services/audit.service';
import './AdminConcierge.css';

export interface ConciergeDossier {
  id: string;
  patientName: string;
  origin: string;
  destinationHub: 'Delhi' | 'Chennai' | 'Mumbai' | 'Bangalore' | 'Kochi';
  hospitalName: string;
  procedureName: string;
  visaStatus: 'pending_invitation' | 'letter_issued' | 'visa_granted' | 'travel_ready';
  flightDetails: string;
  travelDate: string;
  companionName: string;
  liaisonOfficer: string;
  emergencyPhone: string;
}

const INITIAL_DOSSIERS: ConciergeDossier[] = [
  {
    id: 'dos-101',
    patientName: 'Jean-Pierre L’Aiguille',
    origin: 'Port Louis, Mauritius',
    destinationHub: 'Chennai',
    hospitalName: 'Apollo Hospitals Greams Road',
    procedureName: 'Coronary Artery Bypass (CABG)',
    visaStatus: 'travel_ready',
    flightDetails: 'Air Mauritius MK 744 (SSR ➔ MAA)',
    travelDate: '2026-09-14',
    companionName: 'Marie-Claire L’Aiguille (Wife)',
    liaisonOfficer: 'Dr. K. Swaminathan (French Liaison)',
    emergencyPhone: '+230 5918 8275',
  },
  {
    id: 'dos-102',
    patientName: 'Amina Bibi Ramtoolah',
    origin: 'Curepipe, Mauritius',
    destinationHub: 'Delhi',
    hospitalName: 'Medanta The Medicity Gurugram',
    procedureName: 'Total Knee Replacement (Robotic)',
    visaStatus: 'letter_issued',
    flightDetails: 'Air India AI 968 (SSR ➔ DEL)',
    travelDate: '2026-09-22',
    companionName: 'Farhan Ramtoolah (Son)',
    liaisonOfficer: 'Priya Sharma (Kreol Coordinator)',
    emergencyPhone: '+230 5723 4410',
  },
  {
    id: 'dos-103',
    patientName: 'Kavita Devi Seetohul',
    origin: 'Flacq, Mauritius',
    destinationHub: 'Bangalore',
    hospitalName: 'Narayana Health City',
    procedureName: 'Pediatric Cardiac Surgery',
    visaStatus: 'visa_granted',
    flightDetails: 'IndiGo 6E 1802 (SSR ➔ BLR)',
    travelDate: '2026-09-18',
    companionName: 'Anil Seetohul (Father)',
    liaisonOfficer: 'Suresh Kumar (International Desk)',
    emergencyPhone: '+230 5844 1920',
  },
  {
    id: 'dos-104',
    patientName: 'Jacques Laval Domingue',
    origin: 'Beau Bassin, Mauritius',
    destinationHub: 'Mumbai',
    hospitalName: 'Kokilaben Dhirubhai Ambani Hospital',
    procedureName: 'CyberKnife Radiotherapy',
    visaStatus: 'pending_invitation',
    flightDetails: 'TBD upon medical clearance',
    travelDate: '2026-10-02',
    companionName: 'Solo Patient',
    liaisonOfficer: 'Anjali Desai (Lead Case Manager)',
    emergencyPhone: '+230 5255 8900',
  },
];

export function AdminConciergePage() {
  const toast = useToast();
  const [dossiers, setDossiers] = useState<ConciergeDossier[]>(() => {
    try {
      const saved = localStorage.getItem('med360_concierge_dossiers');
      return saved ? JSON.parse(saved) : INITIAL_DOSSIERS;
    } catch {
      return INITIAL_DOSSIERS;
    }
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDossiers = useMemo(() => {
    return dossiers.filter((d) => {
      const matchStatus = statusFilter === 'all' || d.visaStatus === statusFilter;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        d.patientName.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q) ||
        d.destinationHub.toLowerCase().includes(q) ||
        d.procedureName.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [dossiers, search, statusFilter]);

  const handleUpdateVisaStatus = (id: string, newStatus: ConciergeDossier['visaStatus']) => {
    const updated = dossiers.map((d) => (d.id === id ? { ...d, visaStatus: newStatus } : d));
    setDossiers(updated);
    try {
      localStorage.setItem('med360_concierge_dossiers', JSON.stringify(updated));
      const target = dossiers.find((d) => d.id === id);
      auditService.log({
        actorName: 'Deven Admin',
        actorRole: 'super_admin',
        action: 'update',
        entityType: 'inquiry',
        details: `Updated travel concierge visa status for patient "${target?.patientName}" ➔ ${newStatus.replace('_', ' ')}`,
      });
      toast.success(`Updated visa & travel progress for ${target?.patientName}.`, {
        title: 'Status Updated',
      });
    } catch (e) {}
  };

  const getStatusBadge = (status: ConciergeDossier['visaStatus']) => {
    switch (status) {
      case 'travel_ready':
        return <span className="admin-concierge-badge admin-concierge-badge--admitted">Travel Ready & Booked</span>;
      case 'visa_granted':
        return <span className="admin-concierge-badge admin-concierge-badge--flight">e-Visa Approved</span>;
      case 'letter_issued':
        return <span className="admin-concierge-badge admin-concierge-badge--visa">Hospital Letter Issued</span>;
      default:
        return <span className="admin-concierge-badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>Pending Docs</span>;
    }
  };

  return (
    <div className="admin-concierge-container">
      {/* ── Top Header ── */}
      <div className="admin-concierge-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Plane size={26} color="#38bdf8" /> Medical Visa & Patient Travel Concierge
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0.35rem 0 0', fontSize: '0.875rem' }}>
            Track Indian e-Medical Visa invitation letters, SSR airport flight schedules, and bilingual hospital companion liaisons.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            toast.info('New patient travel concierge wizard initiated.', { title: 'Concierge Booking' });
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} /> New Travel Dossier
        </button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="admin-concierge-stats-grid">
        <div className="admin-concierge-stat-card">
          <div className="admin-concierge-stat-icon"><FileCheck2 size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              {dossiers.filter((d) => d.visaStatus === 'travel_ready' || d.visaStatus === 'visa_granted').length} Active
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>e-Visas Confirmed</div>
          </div>
        </div>

        <div className="admin-concierge-stat-card">
          <div className="admin-concierge-stat-icon" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.12)' }}><Plane size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Air Mauritius & AI</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Direct SSR Route Priority</div>
          </div>
        </div>

        <div className="admin-concierge-stat-card">
          <div className="admin-concierge-stat-icon" style={{ color: '#a78bfa', background: 'rgba(167, 139, 250, 0.12)' }}><Users size={22} /></div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>100% Dedicated</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>FR / KR Hospital Liaison</div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="admin-concierge-controls">
        <div className="admin-concierge-search">
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input
            type="text"
            placeholder="Search patient, hospital, or flight hub..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <option value="all">All Visa & Flight Stages</option>
            <option value="pending_invitation">Pending Invitation</option>
            <option value="letter_issued">Hospital Letter Issued</option>
            <option value="visa_granted">Visa Granted</option>
            <option value="travel_ready">Travel Ready & Booked</option>
          </select>
        </div>
      </div>

      {/* ── Travel Dossier Cards Grid ── */}
      <div className="admin-concierge-grid">
        {filteredDossiers.map((d) => (
          <div key={d.id} className="admin-concierge-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.2rem' }}>
                  {d.patientName}
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={12} /> {d.origin} ➔ <strong>{d.destinationHub} Hub</strong>
                </div>
              </div>
              {getStatusBadge(d.visaStatus)}
            </div>

            <div style={{ fontSize: '0.8125rem', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <Building2 size={14} color="#38bdf8" /> <strong>{d.hospitalName}</strong>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                Procedure: <span style={{ color: '#fff' }}>{d.procedureName}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.6rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
                <Plane size={13} /> {d.flightDetails}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)' }}>
                <Calendar size={13} /> Departure Date: <span style={{ color: '#fff' }}>{d.travelDate}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)' }}>
                <Users size={13} /> Companion: <span style={{ color: '#fff' }}>{d.companionName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.6)' }}>
                <Compass size={13} /> Assigned Officer: <span style={{ color: '#34d399' }}>{d.liaisonOfficer}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem', marginTop: 'auto' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Update Status:</div>
              <select
                value={d.visaStatus}
                onChange={(e) => handleUpdateVisaStatus(d.id, e.target.value as any)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 6,
                  color: '#fff',
                  fontSize: '0.75rem',
                  padding: '2px 6px',
                  outline: 'none',
                }}
              >
                <option value="pending_invitation">Pending Invitation</option>
                <option value="letter_issued">Letter Issued</option>
                <option value="visa_granted">Visa Granted</option>
                <option value="travel_ready">Travel Ready</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
