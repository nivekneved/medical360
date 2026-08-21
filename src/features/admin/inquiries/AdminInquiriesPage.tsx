import { useState, useEffect, useMemo } from 'react';
import { Eye, MessageCircle, Phone, Mail, Clock, CheckCircle2, X, Plus, AlertTriangle, ShieldCheck, User, Globe, Stethoscope, LayoutGrid, List, Search, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { formatRelativeTime, formatDate, formatCostRange } from '../../../core/services/format.service';
import { buildInquiryWhatsAppUrl } from '../../../core/services/whatsapp.service';
import type { Inquiry, InquiryStatus } from '../../../core/types';
import '../AdminToolbar.css';

const STATUS_OPTIONS: InquiryStatus[] = [
  'new', 'contacted', 'in_progress', 'awaiting_documents',
  'quoted', 'confirmed', 'completed', 'cancelled'
];

export function AdminInquiriesPage() {
  const [inquiries, setInquiries]           = useState<Inquiry[]>([]);
  const [loading, setLoading]               = useState(true);
  const [viewMode, setViewMode]             = useState<'list' | 'grid'>('list');
  
  // Search, Filters, Sorting, Pagination
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedStatus, setSelectedStatus]     = useState('all');
  const [selectedUrgency, setSelectedUrgency]   = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy]                     = useState<'date-desc' | 'date-asc' | 'urgency-desc' | 'name-asc'>('date-desc');
  const [currentPage, setCurrentPage]           = useState(1);
  const [itemsPerPage, setItemsPerPage]         = useState(8);

  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [newNoteText, setNewNoteText]       = useState('');
  const [savingNote, setSavingNote]         = useState(false);
  const { specialties }                     = useSpecialties();

  function load() {
    mockEngine.getInquiries().then(setInquiries).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  // Filtered & Sorted Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        `${inq.firstName} ${inq.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.countryOfResidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatus === 'all' || inq.status === selectedStatus;

      const matchUrgency =
        selectedUrgency === 'all' || inq.urgency === selectedUrgency;

      const matchSpecialty =
        selectedSpecialty === 'all' || inq.specialtyId === selectedSpecialty;

      return matchSearch && matchStatus && matchUrgency && matchSpecialty;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'urgency-desc') {
        const priority: Record<string, number> = { emergency: 3, urgent: 2, routine: 1 };
        return (priority[b.urgency] || 0) - (priority[a.urgency] || 0);
      }
      if (sortBy === 'name-asc') return a.firstName.localeCompare(b.firstName);
      return 0;
    });
  }, [inquiries, searchQuery, selectedStatus, selectedUrgency, selectedSpecialty, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage) || 1;
  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(start, start + itemsPerPage);
  }, [filteredInquiries, currentPage, itemsPerPage]);

  async function updateStatus(id: string, status: InquiryStatus) {
    await mockEngine.updateInquiryStatus(id, status);
    load();
    if (viewingInquiry && viewingInquiry.id === id) {
      setViewingInquiry({ ...viewingInquiry, status });
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!viewingInquiry || !newNoteText.trim()) return;
    setSavingNote(true);
    try {
      const updated = await mockEngine.addInquiryNote(viewingInquiry.id, newNoteText.trim(), 'Dr. Deven (Director)');
      setViewingInquiry(updated);
      setNewNoteText('');
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to add note.');
    } finally {
      setSavingNote(false);
    }
  }

  function getSpecialtyName(id: string) {
    return specialties.find((s) => s.id === id)?.name ?? id;
  }

  const urgencyColor = (u: string) =>
    u === 'emergency' ? '#dc2626' : u === 'urgent' ? '#d97706' : '#059669';

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Patient Inquiries & Triage</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Review, triage, and manage incoming patient treatment requests from Mauritius and the Indian Ocean.
        </p>
      </div>

      {/* ─── SEARCH, FILTERS & SORTING TOOLBAR ────────────────────────────── */}
      <div className="admin-toolbar">
        {/* Search Input */}
        <div className="admin-toolbar__left">
          <div className="admin-toolbar__search-box">
            <Search size={16} className="admin-toolbar__search-icon" />
            <input
              type="text"
              className="admin-toolbar__search-input"
              placeholder="Search patient, phone, email, notes..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
            {searchQuery && (
              <button
                className="admin-toolbar__clear-search"
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="admin-toolbar__right">
          {/* Status Filter */}
          <select
            className="admin-toolbar__select"
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            className="admin-toolbar__select"
            value={selectedUrgency}
            onChange={(e) => { setSelectedUrgency(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Urgencies</option>
            <option value="emergency">Emergency</option>
            <option value="urgent">Urgent</option>
            <option value="routine">Routine</option>
          </select>

          {/* Specialty Filter */}
          <select
            className="admin-toolbar__select"
            value={selectedSpecialty}
            onChange={(e) => { setSelectedSpecialty(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Specialties</option>
            {specialties.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Sort By Pill */}
          <div className="admin-toolbar__sort-pill">
            <ArrowUpDown size={14} className="admin-toolbar__sort-icon" />
            <span className="admin-toolbar__sort-label">Trier par :</span>
            <select
              className="admin-toolbar__sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date-desc">⚡ Newest First</option>
              <option value="date-asc">📅 Oldest First</option>
              <option value="urgency-desc">🚨 Highest Urgency</option>
              <option value="name-asc">🔤 Patient Name (A-Z)</option>
            </select>
          </div>

          {/* Count Badge */}
          <div className="admin-toolbar__count-badge">
            <span className="admin-toolbar__count-num">{filteredInquiries.length}</span>
            <span className="admin-toolbar__count-unit">{filteredInquiries.length <= 1 ? 'dossier' : 'dossiers'}</span>
          </div>

          {/* View Mode Switcher */}
          <div className="admin-toolbar__view-switcher">
            <button
              type="button"
              className={`admin-toolbar__view-btn ${viewMode === 'grid' ? 'admin-toolbar__view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vue Grille"
            >
              <LayoutGrid size={14} />
              <span>Grille</span>
            </button>
            <button
              type="button"
              className={`admin-toolbar__view-btn ${viewMode === 'list' ? 'admin-toolbar__view-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Vue Liste"
            >
              <List size={14} />
              <span>Liste</span>
            </button>
          </div>

          {/* Clear Filters Reset Button */}
          {(searchQuery || selectedStatus !== 'all' || selectedUrgency !== 'all' || selectedSpecialty !== 'all') && (
            <button
              className="admin-toolbar__reset-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedUrgency('all');
                setSelectedSpecialty('all');
                setCurrentPage(1);
              }}
              title="Reset all filters"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 72, borderRadius: 12 }} />
          ))}
        </div>
      ) : paginatedInquiries.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: 'var(--color-surface)',
          border: '1.5px dashed var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          color: 'var(--color-text-muted)',
        }}>
          <Search size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>No patient inquiries match your search</h3>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Try clearing search keywords or adjusting your filters.</p>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setSearchQuery(''); setSelectedStatus('all'); setSelectedUrgency('all'); setSelectedSpecialty('all'); }}
            style={{ marginTop: '1rem' }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ─── TRIAGE CARDS GRID VIEW ─── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {paginatedInquiries.map((inq) => (
            <div
              key={inq.id}
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                    {inq.firstName} {inq.lastName}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    <Globe size={11} style={{ display: 'inline', marginRight: 3 }} />
                    {inq.countryOfResidence} • {formatRelativeTime(inq.createdAt)}
                  </div>
                </div>
                <span style={{
                  background: `${urgencyColor(inq.urgency)}15`,
                  color: urgencyColor(inq.urgency),
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  padding: '3px 8px',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                }}>
                  {inq.urgency}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  {getSpecialtyName(inq.specialtyId)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {inq.phone}
                </span>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                {inq.description.length > 90 ? `${inq.description.slice(0, 90)}...` : inq.description}
              </p>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  value={inq.status}
                  onChange={e => updateStatus(inq.id, e.target.value as InquiryStatus)}
                  style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontWeight: 600 }}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setViewingInquiry(inq)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                >
                  <Eye size={13} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── DATA TABLE LIST VIEW ─── */
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'auto', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)' }}>
                {['Patient', 'Country', 'Specialty', 'Description', 'Urgency', 'Status', 'Submitted', 'Action'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedInquiries.map((inq, i) => (
                <tr key={inq.id} id={`inquiry-row-${inq.id}`} style={{ borderTop: '1px solid var(--color-border)', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                    {inq.firstName} {inq.lastName}
                    <br />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>{inq.phone}</span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                    {inq.countryOfResidence}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                    {getSpecialtyName(inq.specialtyId)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', maxWidth: 220 }}>
                    {inq.description.slice(0, 75)}...
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textTransform: 'capitalize', fontSize: '0.8125rem', fontWeight: 700, color: urgencyColor(inq.urgency) }}>
                    <span style={{
                      background: `${urgencyColor(inq.urgency)}15`,
                      color: urgencyColor(inq.urgency),
                      padding: '3px 8px',
                      borderRadius: 6,
                      display: 'inline-block'
                    }}>
                      {inq.urgency}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <select
                      id={`inquiry-status-${inq.id}`}
                      value={inq.status}
                      onChange={e => updateStatus(inq.id, e.target.value as InquiryStatus)}
                      style={{ fontSize: '0.8rem', padding: '5px 8px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer', fontWeight: 600 }}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {formatRelativeTime(inq.createdAt)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setViewingInquiry(inq)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
                    >
                      <Eye size={13} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── PAGINATION BAR ────────────────────────────────────────────────── */}
      {filteredInquiries.length > 0 && (
        <div style={{
          marginTop: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.75rem 1rem',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Showing <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, filteredInquiries.length)}</strong> to{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredInquiries.length)}</strong> of{' '}
            <strong>{filteredInquiries.length}</strong> patient inquiries
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn btn-outline btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-outline btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: currentPage >= totalPages ? 0.5 : 1 }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ─── VIEW INQUIRY DETAILS MODAL ────────────────────────────────────── */}
      {viewingInquiry && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem',
        }}>
          <div style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-2xl)',
            width: '100%',
            maxWidth: 680,
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'var(--color-surface)',
              zIndex: 2,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    {viewingInquiry.firstName} {viewingInquiry.lastName}
                  </h2>
                  <span style={{
                    background: `${urgencyColor(viewingInquiry.urgency)}15`,
                    color: urgencyColor(viewingInquiry.urgency),
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    padding: '3px 8px',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                  }}>
                    {viewingInquiry.urgency}
                  </span>
                </div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem', marginTop: 2 }}>
                  Case ID: #{viewingInquiry.id} · Submitted {formatDate(viewingInquiry.createdAt)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingInquiry(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Contact Actions Bar */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
                background: 'var(--color-surface-2)',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Patient Direct Contact
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    {viewingInquiry.phone} · {viewingInquiry.email}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={buildInquiryWhatsAppUrl({
                      firstName: viewingInquiry.firstName,
                      lastName: viewingInquiry.lastName,
                      country: viewingInquiry.countryOfResidence,
                      specialty: getSpecialtyName(viewingInquiry.specialtyId),
                      description: viewingInquiry.description,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                  <a
                    href={`tel:${viewingInquiry.phone}`}
                    className="btn btn-outline btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Phone size={15} /> Call
                  </a>
                </div>
              </div>

              {/* Patient Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ background: 'var(--color-surface-2)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Specialty</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: 2 }}>{getSpecialtyName(viewingInquiry.specialtyId)}</div>
                </div>
                <div style={{ background: 'var(--color-surface-2)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Country</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: 2 }}>{viewingInquiry.countryOfResidence}</div>
                </div>
                <div style={{ background: 'var(--color-surface-2)', padding: '0.875rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Preferred Destination</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: 2 }}>{viewingInquiry.preferredCountry || 'Best Option'}</div>
                </div>
              </div>

              {/* Medical Description */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Full Medical Description & Clinical Needs
                </h4>
                <div style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {viewingInquiry.description}
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(6,95,70,0.05)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(6,95,70,0.15)' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Current Triage Status:
                </label>
                <select
                  value={viewingInquiry.status}
                  onChange={(e) => updateStatus(viewingInquiry.id, e.target.value as InquiryStatus)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--color-primary)',
                    background: 'var(--color-surface)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Case Coordinator Notes Timeline */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Internal Case Coordinator Notes ({viewingInquiry.notes?.length || 0})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {viewingInquiry.notes && viewingInquiry.notes.length > 0 ? (
                    viewingInquiry.notes.map((note) => (
                      <div
                        key={note.id}
                        style={{
                          background: 'var(--color-surface-2)',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                          <strong>{note.authorId}</strong>
                          <span>{formatRelativeTime(note.createdAt)}</span>
                        </div>
                        <div style={{ color: 'var(--color-text)', lineHeight: 1.5 }}>
                          {note.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      No internal notes recorded for this patient case yet.
                    </div>
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="form-input"
                    placeholder="Add internal note (e.g. Sent MRI scans to Apollo Hospitals)..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={savingNote || !newNoteText.trim()}
                  >
                    {savingNote ? 'Adding...' : 'Add Note'}
                  </button>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setViewingInquiry(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
