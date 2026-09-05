import { useState, useEffect, useMemo } from 'react';
import {
  Eye,
  MessageCircle,
  Phone,
  Mail,
  X,
  User,
  Globe,
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  RotateCcw,
  Trash2,
  Printer,
  Download,
} from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { formatRelativeTime, formatDate, formatCostRange } from '../../../core/services/format.service';
import { buildInquiryWhatsAppUrl } from '../../../core/services/whatsapp.service';
import { printOrExportPdf, exportToCsv, type ExportColumn } from '../../../core/services/export.service';
import { AdminPagination } from '../components/AdminPagination';
import { AdminBulkActionBar } from '../components/AdminBulkActionBar';
import type { Inquiry, InquiryStatus } from '../../../core/types';
import '../AdminToolbar.css';

const STATUS_OPTIONS: InquiryStatus[] = [
  'new', 'contacted', 'in_progress', 'awaiting_documents',
  'quoted', 'confirmed', 'completed', 'cancelled'
];

export function AdminInquiriesPage() {
  const [inquiries, setInquiries]       = useState<Inquiry[]>([]);
  const [loading, setLoading]           = useState(true);
  const { specialties }                 = useSpecialties();
  const [viewMode, setViewMode]         = useState<'list' | 'grid'>('list');
  
  // Search, Filters, Sorting, Pagination
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedStatus, setSelectedStatus]     = useState('all');
  const [selectedUrgency, setSelectedUrgency]   = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [sortBy, setSortBy]                     = useState<'date-desc' | 'date-asc' | 'urgency-desc' | 'name-asc'>('date-desc');
  const [currentPage, setCurrentPage]           = useState(1);
  const [itemsPerPage, setItemsPerPage]         = useState(8);

  // Row selection
  const [selectedIds, setSelectedIds]           = useState<Set<string>>(new Set());

  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [newNoteText, setNewNoteText]       = useState('');
  const [savingNote, setSavingNote]         = useState(false);

  function load() {
    mockEngine.getInquiries().then(setInquiries).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const getSpecialtyName = (sId: string) => {
    const s = specialties.find(item => item.id === sId);
    return s ? s.name : sId;
  };

  const urgencyWeight = (u: string) => {
    switch (u) {
      case 'emergency': return 4;
      case 'urgent': return 3;
      case 'soon': return 2;
      default: return 1;
    }
  };

  // Filtered & Sorted Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        `${inq.firstName} ${inq.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.countryOfResidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inq.serviceName && inq.serviceName.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
      if (sortBy === 'urgency-desc') return urgencyWeight(b.urgency) - urgencyWeight(a.urgency);
      if (sortBy === 'name-asc') return a.firstName.localeCompare(b.firstName);
      return 0;
    });
  }, [inquiries, searchQuery, selectedStatus, selectedUrgency, selectedSpecialty, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || selectedStatus !== 'all' || selectedUrgency !== 'all' || selectedSpecialty !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedUrgency('all');
    setSelectedSpecialty('all');
    setCurrentPage(1);
  };

  // Pagination calculation
  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(start, start + itemsPerPage);
  }, [filteredInquiries, currentPage, itemsPerPage]);

  // Row Selection Helpers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    const allIds = filteredInquiries.map(i => i.id);
    setSelectedIds(new Set(allIds));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Export Columns Definition
  const exportColumns: ExportColumn[] = [
    { header: 'Patient Name', key: 'firstName', format: (_, r) => `${r.firstName} ${r.lastName}` },
    { header: 'Requested Service', key: 'serviceName', format: (val) => val || 'General Facilitation' },
    { header: 'Specialty', key: 'specialtyId', format: (val) => getSpecialtyName(val) },
    { header: 'Urgency', key: 'urgency', format: (val) => String(val).toUpperCase() },
    { header: 'Status', key: 'status', format: (val) => String(val).replace(/_/g, ' ') },
    { header: 'Country', key: 'countryOfResidence' },
    { header: 'Phone', key: 'phone' },
    { header: 'Email', key: 'email' },
    { header: 'Description', key: 'description' },
    { header: 'Submitted', key: 'createdAt', format: (val) => formatDate(val) },
  ];

  // Actions: Delete, Print, Export
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected inquiry records?`)) {
      await mockEngine.deleteInquiries(Array.from(selectedIds));
      handleClearSelection();
      load();
    }
  };

  const handleDeleteSingle = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the inquiry for "${name}"?`)) {
      await mockEngine.deleteInquiry(id);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      load();
    }
  };

  const handlePrintPdfSelected = () => {
    const targetData = selectedIds.size > 0
      ? inquiries.filter(i => selectedIds.has(i.id))
      : filteredInquiries;
    printOrExportPdf('Patient Inquiries & Triage Report', exportColumns, targetData, 'Medical360 Referral System Dossier');
  };

  const handleExportCsvSelected = () => {
    const targetData = selectedIds.size > 0
      ? inquiries.filter(i => selectedIds.has(i.id))
      : filteredInquiries;
    exportToCsv('medical360_inquiries', exportColumns, targetData);
  };

  const handlePrintSingle = (inq: Inquiry) => {
    printOrExportPdf(
      `Patient Inquiry: ${inq.firstName} ${inq.lastName}`,
      exportColumns,
      [inq],
      `Inquiry #${inq.id} • Registered: ${formatDate(inq.createdAt)}`
    );
  };

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

  const urgencyColor = (u: string) =>
    u === 'emergency' ? '#dc2626' : u === 'urgent' ? '#d97706' : '#059669';

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 1440, margin: '0 auto' }}>
      
      {viewingInquiry ? (
        /* ─── FULL-PAGE INQUIRY TRIAGE & CLINICAL CONSOLE (NO POPUPS) ──────── */
        <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
          {/* Top Sticky Header */}
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
                onClick={() => setViewingInquiry(null)}
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
                  background: `${urgencyColor(viewingInquiry.urgency)}15`,
                  color: urgencyColor(viewingInquiry.urgency),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User size={22} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                    {viewingInquiry.firstName} {viewingInquiry.lastName}
                  </h1>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 2 }}>
                    <span>Inquiry #{viewingInquiry.id}</span>
                    <span>•</span>
                    <span>Received {formatDate(viewingInquiry.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handlePrintSingle(viewingInquiry)}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Printer size={15} /> Print / Export PDF
              </button>

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
                className="btn btn-outline btn-sm"
                style={{ color: '#25D366', borderColor: '#25D366', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                <MessageCircle size={16} /> WhatsApp Patient
              </a>

              <button
                type="button"
                onClick={() => {
                  const id = viewingInquiry.id;
                  const name = `${viewingInquiry.firstName} ${viewingInquiry.lastName}`;
                  setViewingInquiry(null);
                  handleDeleteSingle(id, name);
                }}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>

          {/* Full-Page Content Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(360px, 1.4fr)', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left Column: Triage Status & Patient Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Triage & Urgency Card */}
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
                      value={viewingInquiry.status}
                      onChange={e => updateStatus(viewingInquiry.id, e.target.value as InquiryStatus)}
                      className="form-input"
                      style={{ width: '100%', fontSize: '0.9rem', fontWeight: 700 }}
                    >
                      {STATUS_OPTIONS.map(s => (
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
                      background: `${urgencyColor(viewingInquiry.urgency)}20`,
                      color: urgencyColor(viewingInquiry.urgency),
                      padding: '4px 12px',
                      borderRadius: 999,
                    }}>
                      {viewingInquiry.urgency} Urgency
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Contact & Demographics */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Phone size={16} color="var(--color-text-muted)" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Direct Phone / WhatsApp</span>
                      <a href={`tel:${viewingInquiry.phone}`} style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                        {viewingInquiry.phone}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail size={16} color="var(--color-text-muted)" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Email Address</span>
                      <a href={`mailto:${viewingInquiry.email}`} style={{ color: 'var(--color-text)', fontWeight: 600 }}>
                        {viewingInquiry.email}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Globe size={16} color="var(--color-text-muted)" />
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Country of Residence</span>
                      <span style={{ fontWeight: 600 }}>{viewingInquiry.countryOfResidence}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment Specifications */}
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
                  {viewingInquiry.serviceName && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Requested Service:</span>
                      <strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>✦ {viewingInquiry.serviceName}</strong>
                    </div>
                  )}
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Specialty Track:</span>
                    <strong>{getSpecialtyName(viewingInquiry.specialtyId)}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Preferred Destination:</span>
                    <strong>{viewingInquiry.preferredCountry || 'Any accredited partner hospital'}</strong>
                  </div>
                  {viewingInquiry.budgetRangeUSD && (
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Budget Target:</span>
                      <strong>{formatCostRange(viewingInquiry.budgetRangeUSD.min, viewingInquiry.budgetRangeUSD.max)}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Medical Symptoms Description & Clinical History Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Medical Need & Symptoms */}
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
                  {viewingInquiry.description}
                </div>
              </div>

              {/* Internal Clinical Notes */}
              <div style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid var(--color-border)',
                padding: '1.75rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
                    Internal Clinical Notes ({viewingInquiry.notes?.length || 0})
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Staff Only</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: 350, overflowY: 'auto' }}>
                  {(!viewingInquiry.notes || viewingInquiry.notes.length === 0) ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                      No clinical notes logged yet for this inquiry.
                    </div>
                  ) : (
                    viewingInquiry.notes.map((n) => (
                      <div key={n.id} style={{ background: 'var(--color-surface-2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                          <strong style={{ color: 'var(--color-text)' }}>{n.authorId}</strong>
                          <span>{formatRelativeTime(n.createdAt)}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{n.content}</div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add triage note or doctor follow-up update..."
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
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
      ) : (
        /* ─── INQUIRIES LIST / GRID VIEW ────────────────────────────────────── */
        <>
          {/* Top Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Patient Inquiries & Triage</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                Review, triage, and manage incoming patient treatment requests from Mauritius and the Indian Ocean.
              </p>
            </div>

            {/* Global Print / Export Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handlePrintPdfSelected()}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                title="Print or Save current list as PDF"
              >
                <Printer size={15} /> Print / Export PDF
              </button>
              <button
                type="button"
                onClick={() => handleExportCsvSelected()}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                title="Download CSV spreadsheet"
              >
                <Download size={15} /> Export CSV
              </button>
            </div>
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
                  placeholder="Search patient, phone, specialty..."
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

            {/* Filters and View Switcher */}
            <div className="admin-toolbar__right">
              {/* Status Filter */}
              <select
                className="admin-toolbar__select"
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>

              {/* Urgency Filter */}
              <select
                className="admin-toolbar__select"
                value={selectedUrgency}
                onChange={(e) => { setSelectedUrgency(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Urgencies</option>
                <option value="routine">Routine</option>
                <option value="soon">Soon</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>

              {/* Specialty Filter */}
              <select
                className="admin-toolbar__select"
                value={selectedSpecialty}
                onChange={(e) => { setSelectedSpecialty(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">All Specialties</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>{spec.name}</option>
                ))}
              </select>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  className="admin-toolbar__reset-btn"
                  onClick={resetFilters}
                  title="Reset all filters"
                >
                  <RotateCcw size={14} /> Clear
                </button>
              )}

              {/* Sort By Dropdown */}
              <div className="admin-toolbar__sort-wrapper">
                <ArrowUpDown size={15} className="admin-toolbar__sort-icon" />
                <select
                  className="admin-toolbar__select admin-toolbar__select--sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="urgency-desc">Highest Urgency</option>
                  <option value="name-asc">Patient Name (A-Z)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="admin-toolbar__view-toggles">
                <button
                  type="button"
                  className={`admin-toolbar__view-btn ${viewMode === 'list' ? 'admin-toolbar__view-btn--active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Table View"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className={`admin-toolbar__view-btn ${viewMode === 'grid' ? 'admin-toolbar__view-btn--active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Card View"
                >
                  <LayoutGrid size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ─── BULK ACTIONS BAR ────────────────────────────────────────────── */}
          <AdminBulkActionBar
            selectedCount={selectedIds.size}
            totalCount={filteredInquiries.length}
            unitName="inquiry"
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onDeleteSelected={handleDeleteSelected}
            onPrintPdfSelected={handlePrintPdfSelected}
            onExportCsvSelected={handleExportCsvSelected}
          />

          {/* ─── MAIN CONTENT: LIST OR GRID VIEW ──────────────────────────────── */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-xl)' }} />
              ))}
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px dashed var(--color-border)', marginTop: '1.5rem' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', margin: '0 0 1rem' }}>
                No patient inquiries found matching your filters.
              </p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="btn btn-outline btn-sm">
                  Reset Filters
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {paginatedInquiries.map((inq) => {
                const isSelected = selectedIds.has(inq.id);
                return (
                  <div
                    key={inq.id}
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-xl)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      boxShadow: 'var(--shadow-sm)',
                      position: 'relative',
                    }}
                  >
                    {/* Top Row: Checkbox, Name, Urgency */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(inq.id)}
                          style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                        />
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                            {inq.firstName} {inq.lastName}
                          </h3>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {formatRelativeTime(inq.createdAt)}
                          </span>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: `${urgencyColor(inq.urgency)}20`,
                        color: urgencyColor(inq.urgency),
                        padding: '3px 8px',
                        borderRadius: 6,
                      }}>
                        {inq.urgency}
                      </span>
                    </div>

                    {/* Specialty & Service */}
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>Specialty & Need:</div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        {getSpecialtyName(inq.specialtyId)}
                        {inq.serviceName && <span style={{ color: 'var(--color-text)' }}> • {inq.serviceName}</span>}
                      </div>
                    </div>

                    {/* Patient Description Preview */}
                    <div style={{
                      fontSize: '0.82rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                      background: 'var(--color-surface-2)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {inq.description}
                    </div>

                    {/* Status & Actions Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                      <select
                        value={inq.status}
                        onChange={e => updateStatus(inq.id, e.target.value as InquiryStatus)}
                        style={{
                          fontSize: '0.78rem',
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-surface-2)',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => setViewingInquiry(inq)}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Eye size={14} /> Open
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--color-border)', overflow: 'hidden', marginTop: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ width: 44, padding: '0.875rem 0.75rem', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.size > 0 && selectedIds.size === filteredInquiries.length}
                        onChange={(e) => { e.target.checked ? handleSelectAll() : handleClearSelection(); }}
                        style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                      />
                    </th>
                    <th style={{ padding: '0.875rem 0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Patient</th>
                    <th style={{ padding: '0.875rem 0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Specialty / Service</th>
                    <th style={{ padding: '0.875rem 0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Contact</th>
                    <th style={{ padding: '0.875rem 0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Urgency</th>
                    <th style={{ padding: '0.875rem 0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Status</th>
                    <th style={{ padding: '0.875rem 0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', fontSize: '0.8rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInquiries.map((inq) => {
                    const isSelected = selectedIds.has(inq.id);
                    return (
                      <tr
                        key={inq.id}
                        style={{
                          borderBottom: '1px solid var(--color-border)',
                          background: isSelected ? 'var(--color-primary-10, rgba(16,185,129,0.05))' : 'transparent',
                        }}
                      >
                        <td style={{ padding: '0.875rem 0.75rem', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(inq.id)}
                            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                          />
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <div style={{ fontWeight: 700 }}>{inq.firstName} {inq.lastName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDate(inq.createdAt)}</div>
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <div style={{ fontWeight: 600 }}>{getSpecialtyName(inq.specialtyId)}</div>
                          {inq.serviceName && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{inq.serviceName}</div>}
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <div>{inq.phone}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{inq.email}</div>
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            background: `${urgencyColor(inq.urgency)}20`,
                            color: urgencyColor(inq.urgency),
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}>
                            {inq.urgency}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <select
                            value={inq.status}
                            onChange={e => updateStatus(inq.id, e.target.value as InquiryStatus)}
                            style={{
                              fontSize: '0.78rem',
                              padding: '4px 8px',
                              borderRadius: 6,
                              border: '1px solid var(--color-border)',
                              background: 'var(--color-surface-2)',
                              fontWeight: 700,
                            }}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem', textAlign: 'right' }}>
                          <button
                            onClick={() => setViewingInquiry(inq)}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <Eye size={14} /> Open
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── PAGINATION BAR ────────────────────────────────────────────────── */}
          {filteredInquiries.length > 0 && (
            <AdminPagination
              currentPage={currentPage}
              totalItems={filteredInquiries.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              pageSizeOptions={[8, 16, 32, 64]}
              unitName="patient inquiries"
            />
          )}
        </>
      )}

    </div>
  );
}
