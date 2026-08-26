import { useState, useEffect, useMemo } from 'react';
import {
  Inbox,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  User,
  Globe,
  Stethoscope,
  X,
  LayoutGrid,
  List,
  Search,
  ArrowRight,
  Trash2,
  Printer,
  Download,
} from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { formatRelativeTime, formatDate, formatCostRange } from '../../../core/services/format.service';
import { buildInquiryWhatsAppUrl } from '../../../core/services/whatsapp.service';
import { AdminPagination } from '../components/AdminPagination';
import { AdminBulkActionBar } from '../components/AdminBulkActionBar';
import { printOrExportPdf, exportToCsv, type ExportColumn } from '../../../core/services/export.service';
import type { Inquiry, InquiryStatus } from '../../../core/types';
import '../AdminToolbar.css';

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

const STATUS_OPTIONS: InquiryStatus[] = [
  'new', 'contacted', 'in_progress', 'awaiting_documents',
  'quoted', 'confirmed', 'completed', 'cancelled'
];

export function AdminDashboardPage() {
  const [stats, setStats]               = useState({ total: 0, new: 0, inProgress: 0, completed: 0 });
  const [inquiries, setInquiries]       = useState<Inquiry[]>([]);
  const [loading, setLoading]           = useState(true);
  const { specialties }                 = useSpecialties();

  // Controls for Inquiries List
  const [viewMode, setViewMode]         = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Row selection
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());

  // View modal
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  function loadData() {
    mockEngine.getInquiryStats().then(setStats);
    mockEngine.getInquiries().then((inqs) => {
      setInquiries(inqs);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

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

  async function handleStatusChange(id: string, status: InquiryStatus) {
    await mockEngine.updateInquiryStatus(id, status);
    loadData();
    if (viewingInquiry && viewingInquiry.id === id) {
      setViewingInquiry({ ...viewingInquiry, status });
    }
  }

  // Selection Helpers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(filteredInquiries.map(i => i.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Export Columns Definition
  const exportColumns: ExportColumn[] = [
    { header: 'Patient Name', key: 'firstName', format: (_, r) => `${r.firstName} ${r.lastName}` },
    { header: 'Specialty', key: 'specialtyId', format: (val) => getSpecialtyName(val) },
    { header: 'Urgency', key: 'urgency', format: (val) => String(val).toUpperCase() },
    { header: 'Status', key: 'status', format: (val) => String(val).replace(/_/g, ' ') },
    { header: 'Country', key: 'countryOfResidence' },
    { header: 'Phone', key: 'phone' },
    { header: 'Email', key: 'email' },
    { header: 'Submitted', key: 'createdAt', format: (val) => formatDate(val) },
  ];

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected inquiry records?`)) {
      await mockEngine.deleteInquiries(Array.from(selectedIds));
      handleClearSelection();
      loadData();
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
      loadData();
    }
  };

  const handlePrintPdfSelected = () => {
    const targetData = selectedIds.size > 0
      ? inquiries.filter(i => selectedIds.has(i.id))
      : filteredInquiries;
    printOrExportPdf('Patient Inquiries Summary Report', exportColumns, targetData, 'Medical360 Executive Dashboard Dossier');
  };

  const handleExportCsvSelected = () => {
    const targetData = selectedIds.size > 0
      ? inquiries.filter(i => selectedIds.has(i.id))
      : filteredInquiries;
    exportToCsv('medical360_dashboard_inquiries', exportColumns, targetData);
  };

  const handlePrintSingle = (inq: Inquiry) => {
    printOrExportPdf(
      `Patient Inquiry: ${inq.firstName} ${inq.lastName}`,
      exportColumns,
      [inq],
      `Inquiry #${inq.id} • Registered: ${formatDate(inq.createdAt)}`
    );
  };

  // Filtered & Paginated Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        `${inq.firstName} ${inq.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.countryOfResidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'all' || inq.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [inquiries, searchQuery, selectedStatus]);

  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(start, start + itemsPerPage);
  }, [filteredInquiries, currentPage, itemsPerPage]);

  const urgencyColor = (urgency: string) => {
    if (urgency === 'emergency') return '#cc1133';
    if (urgency === 'urgent') return '#c88a00';
    return '#007a5a';
  };

  const STAT_CARDS = [
    { icon: Inbox,       label: 'Total Inquiries', value: stats.total,      color: 'var(--color-primary)' },
    { icon: Clock,       label: 'New / Pending',   value: stats.new,        color: '#ffb400' },
    { icon: TrendingUp,  label: 'In Progress',      value: stats.inProgress, color: 'var(--color-accent)' },
    { icon: CheckCircle, label: 'Completed',        value: stats.completed,  color: 'var(--color-success)' },
  ];

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 1440, margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Overview of Medical360 platform activity, patient inquiries, and specialist referrals.
        </p>
      </div>

      {/* ─── METRIC STAT CARDS (RESPONSIVE GRID) ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STAT_CARDS.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            style={{
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-lg)',
                background: color + '18',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
                flexShrink: 0,
              }}
            >
              <Icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── INQUIRIES CONTAINER & TOOLBAR ─────────────────────────────────── */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
      >
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 2px 0' }}>Patient Inquiries Directory</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Live patient requests submitted through the portal and Describe Need wizard.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handlePrintPdfSelected()}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '0.78rem' }}
              title="Print or Save current list as PDF"
            >
              <Printer size={13} /> Print / PDF
            </button>
            <button
              type="button"
              onClick={() => handleExportCsvSelected()}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, fontSize: '0.78rem' }}
              title="Download CSV spreadsheet"
            >
              <Download size={13} /> Export CSV
            </button>
            <a
              href="/admin/inquiries"
              style={{
                fontSize: '0.85rem',
                color: 'var(--color-primary)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginLeft: 4,
              }}
            >
              Manage Inquiries <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Toolbar: Search, Status Filter & View Mode Switcher */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            background: 'var(--color-surface-2)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.25rem',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 360 }}>
            <Search size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: 10, top: 11 }} />
            <input
              type="text"
              placeholder="Search patient, phone, country..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                height: 36,
                padding: '0 10px 0 32px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: '0.825rem',
                color: 'var(--color-text)',
                outline: 'none',
              }}
            />
          </div>

          {/* Filters & View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              style={{
                height: 36,
                padding: '0 8px',
                borderRadius: 6,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 10px',
                  background: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: viewMode === 'list' ? '#ffffff' : 'var(--color-text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
                title="List View"
              >
                <List size={14} /> List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 10px',
                  background: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: viewMode === 'grid' ? '#ffffff' : 'var(--color-text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
                title="Grid View"
              >
                <LayoutGrid size={14} /> Grid
              </button>
            </div>
          </div>
        </div>

        {/* ─── BULK ACTION BAR ──────────────────────────────────────────────── */}
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

        {/* Content: List or Grid */}
        {filteredInquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-secondary)' }}>
            <Inbox size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No matching inquiries found.</p>
          </div>
        ) : viewMode === 'list' ? (
          /* ─── LIST TABLE VIEW ─── */
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                  {/* Select All Checkbox */}
                  <th style={{ width: 40, padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={filteredInquiries.length > 0 && selectedIds.size === filteredInquiries.length}
                      onChange={selectedIds.size === filteredInquiries.length ? handleClearSelection : handleSelectAll}
                      style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                      title="Select all rows"
                    />
                  </th>
                  {['Patient', 'Specialty', 'Urgency', 'Status', 'Submitted', 'Actions'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '0.75rem 0.85rem',
                        textAlign: h === 'Actions' ? 'right' : 'left',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedInquiries.map((inq, i) => {
                  const waUrl = getWhatsAppUrl(inq);
                  const isSelected = selectedIds.has(inq.id);
                  return (
                    <tr
                      key={inq.id}
                      style={{
                        borderBottom: '1px solid var(--color-border-light)',
                        background: isSelected ? 'rgba(6, 95, 70, 0.05)' : i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)',
                      }}
                    >
                      {/* Row Checkbox */}
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(inq.id)}
                          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                        />
                      </td>

                      <td style={{ padding: '0.85rem 0.85rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          {inq.firstName} {inq.lastName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {inq.countryOfResidence} • {inq.phone}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 0.85rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        {getSpecialtyName(inq.specialtyId)}
                      </td>

                      <td style={{ padding: '0.85rem 0.85rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6,
                            textTransform: 'capitalize',
                            background: `${urgencyColor(inq.urgency)}15`,
                            color: urgencyColor(inq.urgency),
                            display: 'inline-block',
                          }}
                        >
                          {inq.urgency}
                        </span>
                      </td>

                      <td style={{ padding: '0.85rem 0.85rem' }}>
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                          style={{
                            fontSize: '0.78rem',
                            padding: '4px 6px',
                            borderRadius: 6,
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-surface)',
                            color: STATUS_COLORS[inq.status] ?? 'inherit',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </td>

                      <td style={{ padding: '0.85rem 0.85rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                        {formatRelativeTime(inq.createdAt)}
                      </td>

                      {/* Action Buttons */}
                      <td style={{ padding: '0.85rem 0.85rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                            style={{ color: '#25D366', borderColor: '#25D366', padding: '4px 7px' }}
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={13} />
                          </a>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => handlePrintSingle(inq)}
                            style={{ padding: '4px 7px' }}
                            title="Print / Save PDF Dossier"
                          >
                            <Printer size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setViewingInquiry(inq)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', padding: '4px 8px' }}
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            type="button"
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
        ) : (
          /* ─── GRID CARDS VIEW ─── */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {paginatedInquiries.map((inq) => {
              const waUrl = getWhatsAppUrl(inq);
              const isSelected = selectedIds.has(inq.id);
              return (
                <div
                  key={inq.id}
                  style={{
                    background: isSelected ? 'rgba(6, 95, 70, 0.04)' : 'var(--color-surface-2)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                    borderRadius: 10,
                    padding: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(inq.id)}
                        style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{inq.firstName} {inq.lastName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{inq.countryOfResidence}</div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: 4,
                        textTransform: 'capitalize',
                        background: `${urgencyColor(inq.urgency)}15`,
                        color: urgencyColor(inq.urgency),
                      }}
                    >
                      {inq.urgency}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    {getSpecialtyName(inq.specialtyId)}
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0', lineClamp: 2 }}>
                    {inq.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-light)', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 6px',
                        borderRadius: 6,
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        color: STATUS_COLORS[inq.status] ?? 'inherit',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>

                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ color: '#25D366', borderColor: '#25D366', padding: '3px 6px' }}
                        title="WhatsApp"
                      >
                        <MessageCircle size={13} />
                      </a>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handlePrintSingle(inq)}
                        style={{ padding: '3px 6px' }}
                        title="Print Dossier"
                      >
                        <Printer size={13} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewingInquiry(inq)}
                        style={{ padding: '3px 7px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3 }}
                      >
                        <Eye size={13} /> View
                      </button>
                      <button
                        type="button"
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
        )}

        {/* ─── PAGINATION BAR ──────────────────────────────────────────────── */}
        {filteredInquiries.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            totalItems={filteredInquiries.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            pageSizeOptions={[5, 10, 20, 50]}
            unitName="recent inquiries"
          />
        )}
      </div>

      {/* ─── VIEW INQUIRY DETAILS MODAL ────────────────────────────────────── */}
      {viewingInquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              width: '100%',
              maxWidth: 580,
              borderRadius: 16,
              border: '1.5px solid var(--color-border)',
              padding: '1.75rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 2px 0' }}>
                  {viewingInquiry.firstName} {viewingInquiry.lastName}
                </h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  Inquiry #{viewingInquiry.id} • {formatDate(viewingInquiry.createdAt)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewingInquiry(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Specialty</span>
                <strong>{getSpecialtyName(viewingInquiry.specialtyId)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Urgency</span>
                <strong style={{ color: urgencyColor(viewingInquiry.urgency), textTransform: 'capitalize' }}>
                  {viewingInquiry.urgency}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Email</span>
                <a href={`mailto:${viewingInquiry.email}`} style={{ color: 'var(--color-primary)' }}>{viewingInquiry.email}</a>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem' }}>Phone</span>
                <a href={`tel:${viewingInquiry.phone}`} style={{ color: 'var(--color-primary)' }}>{viewingInquiry.phone}</a>
              </div>
            </div>

            {/* Patient Clinical Need */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>
                Clinical Condition / Description
              </span>
              <div style={{ background: 'var(--color-surface-2)', padding: '0.85rem', borderRadius: 8, fontSize: '0.875rem', lineHeight: 1.5 }}>
                {viewingInquiry.description}
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <a
                href={getWhatsAppUrl(viewingInquiry)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ color: '#25D366', borderColor: '#25D366', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <MessageCircle size={16} /> Open WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setViewingInquiry(null)}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
