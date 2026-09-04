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
            <span className="admin-toolbar__sort-label">Sort:</span>
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
            <span className="admin-toolbar__count-unit">{filteredInquiries.length <= 1 ? 'record' : 'records'}</span>
          </div>

          {/* View Mode Switcher */}
          <div className="admin-toolbar__view-switcher">
            <button
              type="button"
              className={`admin-toolbar__view-btn ${viewMode === 'grid' ? 'admin-toolbar__view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
            <button
              type="button"
              className={`admin-toolbar__view-btn ${viewMode === 'list' ? 'admin-toolbar__view-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={14} />
              <span>List</span>
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

      {/* ─── BULK ACTION BAR (ACTIVE WHEN ROWS SELECTED) ──────────────────── */}
      <AdminBulkActionBar
        selectedCount={selectedIds.size}
        totalCount={filteredInquiries.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onDeleteSelected={handleDeleteSelected}
        onPrintPdfSelected={handlePrintPdfSelected}
        onExportCsvSelected={handleExportCsvSelected}
        unitName="inquiries"
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: 72, background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px dashed var(--color-border)' }}>
          <User size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Inquiries Found</h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 450, margin: '0.5rem auto 1.5rem' }}>
            No patient inquiries matched your search or filter criteria. Try resetting the filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ─── GRID CARDS VIEW ─── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {paginatedInquiries.map((inq) => {
            const isSelected = selectedIds.has(inq.id);
            return (
              <div
                key={inq.id}
                style={{
                  background: 'var(--color-surface)',
                  border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: isSelected ? 'var(--shadow-primary)' : '0 2px 8px rgba(0,0,0,0.03)',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    {/* Row Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(inq.id)}
                      style={{ marginTop: 3, width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                        {inq.firstName} {inq.lastName}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        <Globe size={11} style={{ display: 'inline', marginRight: 3 }} />
                        {inq.countryOfResidence} • {formatRelativeTime(inq.createdAt)}
                      </div>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    {getSpecialtyName(inq.specialtyId)}
                  </span>
                  {inq.serviceName && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: 700, background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', padding: '2px 6px', borderRadius: 4 }}>
                      ✦ {inq.serviceName}
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {inq.phone}
                  </span>
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                  {inq.description.length > 90 ? `${inq.description.slice(0, 90)}...` : inq.description}
                </p>

                {/* Card Action Row */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <select
                    value={inq.status}
                    onChange={e => updateStatus(inq.id, e.target.value as InquiryStatus)}
                    style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontWeight: 600 }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>

                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handlePrintSingle(inq)}
                      style={{ padding: '3px 6px' }}
                      title="Print / PDF Dossier"
                    >
                      <Printer size={13} />
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setViewingInquiry(inq)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: '3px 8px' }}
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDeleteSingle(inq.id, `${inq.firstName} ${inq.lastName}`)}
                      style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '3px 6px' }}
                      title="Delete Inquiry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ─── DATA TABLE LIST VIEW ─── */
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'auto', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)' }}>
                {/* Select All Checkbox */}
                <th style={{ width: 44, padding: '0.875rem 0.75rem', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={filteredInquiries.length > 0 && selectedIds.size === filteredInquiries.length}
                    onChange={selectedIds.size === filteredInquiries.length ? handleClearSelection : handleSelectAll}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                    title="Select all rows"
                  />
                </th>
                {['Patient', 'Country', 'Specialty', 'Description', 'Urgency', 'Status', 'Submitted', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 0.85rem', textAlign: h === 'Actions' ? 'right' : 'left', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedInquiries.map((inq, idx) => {
                const isSelected = selectedIds.has(inq.id);
                return (
                  <tr
                    key={inq.id}
                    style={{
                      borderTop: '1px solid var(--color-border)',
                      background: isSelected ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : idx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {/* Row Checkbox */}
                    <td style={{ padding: '0.875rem 0.75rem', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(inq.id)}
                        style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                      />
                    </td>

                    <td style={{ padding: '0.875rem 0.85rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>
                        {inq.firstName} {inq.lastName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {inq.phone}
                      </div>
                    </td>

                    <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {inq.countryOfResidence}
                    </td>

                    <td style={{ padding: '0.875rem 0.85rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span className="badge badge-primary" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          {getSpecialtyName(inq.specialtyId)}
                        </span>
                        {inq.serviceName && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap', display: 'inline-block', width: 'fit-content' }}>
                            ✦ {inq.serviceName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '0.875rem 0.85rem', maxWidth: 220 }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {inq.description}
                      </p>
                    </td>

                    <td style={{ padding: '0.875rem 0.85rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: `${urgencyColor(inq.urgency)}15`,
                        color: urgencyColor(inq.urgency),
                        padding: '3px 8px',
                        borderRadius: 6,
                        display: 'inline-block'
                      }}>
                        {inq.urgency}
                      </span>
                    </td>

                    <td style={{ padding: '0.875rem 0.85rem' }}>
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

                    <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      {formatRelativeTime(inq.createdAt)}
                    </td>

                    {/* Actions Column */}
                    <td style={{ padding: '0.875rem 0.85rem', whiteSpace: 'nowrap', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handlePrintSingle(inq)}
                          style={{ padding: '4px 7px' }}
                          title="Print / Save PDF Dossier"
                        >
                          <Printer size={13} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setViewingInquiry(inq)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', padding: '4px 8px' }}
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleDeleteSingle(inq.id, `${inq.firstName} ${inq.lastName}`)}
                          style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '4px 7px' }}
                          title="Delete Inquiry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
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

      {/* ─── VIEW INQUIRY DETAILS MODAL ────────────────────────────────────── */}
      {viewingInquiry && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', width: '100%', maxWidth: 720, borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${urgencyColor(viewingInquiry.urgency)}15`, color: urgencyColor(viewingInquiry.urgency), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                    {viewingInquiry.firstName} {viewingInquiry.lastName}
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 2 }}>
                    <span>Inquiry #{viewingInquiry.id}</span>
                    <span>•</span>
                    <span>{formatDate(viewingInquiry.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={() => handlePrintSingle(viewingInquiry)}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Printer size={14} /> Print / PDF
                </button>
                <button
                  onClick={() => setViewingInquiry(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Quick Status Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Triage Status:</span>
                  <select
                    value={viewingInquiry.status}
                    onChange={e => updateStatus(viewingInquiry.id, e.target.value as InquiryStatus)}
                    style={{ fontSize: '0.85rem', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontWeight: 700 }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>

                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: `${urgencyColor(viewingInquiry.urgency)}20`,
                  color: urgencyColor(viewingInquiry.urgency),
                  padding: '4px 10px',
                  borderRadius: 999,
                }}>
                  {viewingInquiry.urgency} Urgency
                </span>
              </div>

              {/* Patient Contact & Medical Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Contact Details
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} color="var(--color-text-muted)" />
                      <a href={`tel:${viewingInquiry.phone}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        {viewingInquiry.phone}
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} color="var(--color-text-muted)" />
                      <a href={`mailto:${viewingInquiry.email}`} style={{ color: 'var(--color-text)' }}>
                        {viewingInquiry.email}
                      </a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe size={14} color="var(--color-text-muted)" />
                      <span>{viewingInquiry.countryOfResidence}</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Treatment Preferences
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem' }}>
                    {viewingInquiry.serviceName && (
                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Requested Service: </span>
                        <strong style={{ color: 'var(--color-primary)' }}>✦ {viewingInquiry.serviceName}</strong>
                      </div>
                    )}
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Specialty: </span>
                      <strong>{getSpecialtyName(viewingInquiry.specialtyId)}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Destination: </span>
                      <strong>{viewingInquiry.preferredCountry || 'Any accredited country'}</strong>
                    </div>
                    {viewingInquiry.budgetRangeUSD && (
                      <div>
                        <span style={{ color: 'var(--color-text-muted)' }}>Budget: </span>
                        <strong>{formatCostRange(viewingInquiry.budgetRangeUSD.min, viewingInquiry.budgetRangeUSD.max)}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Patient Clinical Need Description */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  Medical Need & Symptoms
                </h3>
                <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-lg)', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-text)' }}>
                  {viewingInquiry.description}
                </div>
              </div>

              {/* Clinical Notes & History */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  Internal Clinical Notes ({viewingInquiry.notes?.length || 0})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {(viewingInquiry.notes || []).map((n) => (
                    <div key={n.id} style={{ background: 'var(--color-surface-2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                        <strong>{n.authorId}</strong>
                        <span>{formatRelativeTime(n.createdAt)}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem' }}>{n.content}</div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add clinical note or follow-up update..."
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  />
                  <button type="submit" disabled={savingNote || !newNoteText.trim()} className="btn btn-primary btn-sm">
                    {savingNote ? 'Adding...' : 'Add Note'}
                  </button>
                </form>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-2)' }}>
              <button
                type="button"
                onClick={() => {
                  const id = viewingInquiry.id;
                  const name = `${viewingInquiry.firstName} ${viewingInquiry.lastName}`;
                  setViewingInquiry(null);
                  handleDeleteSingle(id, name);
                }}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <Trash2 size={14} /> Delete Record
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                  className="btn btn-outline"
                  style={{ color: '#25D366', borderColor: '#25D366', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <MessageCircle size={16} /> Open WhatsApp
                </a>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setViewingInquiry(null)}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
