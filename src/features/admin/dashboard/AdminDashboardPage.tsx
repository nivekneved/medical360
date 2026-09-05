import { useState, useEffect, useMemo } from 'react';
import {
  Inbox,
  Eye,
  MessageCircle,
  LayoutGrid,
  List,
  Search,
  ArrowRight,
  Printer,
  Download,
} from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { formatRelativeTime, formatDate } from '../../../core/services/format.service';
import { buildInquiryWhatsAppUrl } from '../../../core/services/whatsapp.service';
import { AdminPagination } from '../components/AdminPagination';
import { AdminBulkActionBar } from '../components/AdminBulkActionBar';
import { printOrExportPdf, exportToCsv, type ExportColumn } from '../../../core/services/export.service';
import { DashboardStatWidgets } from './components/DashboardStatWidgets';
import { DashboardDossierPanel } from './components/DashboardDossierPanel';
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
  const { specialties }                 = useSpecialties();

  // Controls for Inquiries List
  const [viewMode, setViewMode]         = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery]   = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Row selection
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());

  // View dossier
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  function loadData() {
    mockEngine.getInquiryStats().then(setStats);
    mockEngine.getInquiries().then(setInquiries);
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

  const handleExportSelectedCsv = () => {
    const dataToExport = selectedIds.size > 0 
      ? inquiries.filter(i => selectedIds.has(i.id))
      : filteredInquiries;
    exportToCsv('med360-inquiries-export', exportColumns, dataToExport);
  };

  const handlePrintSelectedPdf = () => {
    const dataToExport = selectedIds.size > 0 
      ? inquiries.filter(i => selectedIds.has(i.id))
      : filteredInquiries;
    printOrExportPdf(
      'Medical 360 — Patient Inquiries Report',
      exportColumns,
      dataToExport,
      `Generated on ${new Date().toLocaleDateString()} · Total Records: ${dataToExport.length}`
    );
  };

  // Bulk Operations
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} inquiries?`)) return;
    for (const id of selectedIds) {
      await mockEngine.deleteInquiry(id);
    }
    setSelectedIds(new Set());
    loadData();
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    for (const id of selectedIds) {
      await mockEngine.updateInquiryStatus(id, newStatus as InquiryStatus);
    }
    setSelectedIds(new Set());
    loadData();
  };

  // Filtered & Paginated List
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        `${inq.firstName} ${inq.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.countryOfResidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getSpecialtyName(inq.specialtyId).toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatus === 'all' || inq.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [inquiries, searchQuery, selectedStatus, specialties]);

  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(start, start + itemsPerPage);
  }, [filteredInquiries, currentPage, itemsPerPage]);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '1.5rem 0' }}>
      {/* Dashboard KPI Stat Widgets */}
      <DashboardStatWidgets stats={stats} />

      {/* Inline Inquiry Dossier Panel (Zero Popups) */}
      {viewingInquiry && (
        <DashboardDossierPanel
          inquiry={viewingInquiry}
          specialtyName={getSpecialtyName(viewingInquiry.specialtyId)}
          statusColors={STATUS_COLORS}
          statusOptions={STATUS_OPTIONS}
          onStatusChange={handleStatusChange}
          onClose={() => setViewingInquiry(null)}
          whatsAppUrl={getWhatsAppUrl(viewingInquiry)}
        />
      )}

      {/* Main Section Header */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Recent Patient Inquiries</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0 0' }}>
              Live triage queue of medical requests from Mauritius and international patients.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handlePrintSelectedPdf}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              title="Print current inquiries report"
            >
              <Printer size={14} /> Print / Export PDF
            </button>
            <button
              type="button"
              onClick={handleExportSelectedCsv}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              title="Export to CSV spreadsheet"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="admin-toolbar" style={{ marginBottom: '1.25rem' }}>
          <div className="admin-toolbar__left">
            <div className="admin-toolbar__search-box">
              <Search size={16} className="admin-toolbar__search-icon" />
              <input
                type="text"
                placeholder="Search patient, phone, specialty..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="admin-toolbar__search-input"
              />
            </div>
          </div>

          <div className="admin-toolbar__right">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="admin-toolbar__select"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
              ))}
            </select>

            <div className="admin-toolbar__view-toggle">
              <button
                className={`admin-toolbar__view-btn ${viewMode === 'list' ? 'admin-toolbar__view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Table List View"
              >
                <List size={16} />
              </button>
              <button
                className={`admin-toolbar__view-btn ${viewMode === 'grid' ? 'admin-toolbar__view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        <AdminBulkActionBar
          selectedCount={selectedIds.size}
          totalCount={paginatedInquiries.length}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onDeleteSelected={handleBulkDelete}
          onStatusChangeSelected={handleBulkStatusChange}
          statusOptions={STATUS_OPTIONS.map(s => ({ label: s.replace(/_/g, ' '), value: s }))}
          onExportCsvSelected={handleExportSelectedCsv}
          onPrintPdfSelected={handlePrintSelectedPdf}
        />

        {/* Inquiries Table / Grid */}
        {filteredInquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <Inbox size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No inquiries match your current filters.</p>
          </div>
        ) : viewMode === 'list' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 0.5rem', width: 36 }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === paginatedInquiries.length && paginatedInquiries.length > 0}
                      onChange={(e) => e.target.checked ? handleSelectAll() : handleClearSelection()}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Patient</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Specialty</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Received</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
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
                        background: isSelected ? 'rgba(6, 95, 70, 0.04)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(inq.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
                          {inq.firstName} {inq.lastName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {inq.countryOfResidence} · {inq.phone}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                          {getSpecialtyName(inq.specialtyId)}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem' }}>
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                          className="form-input"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            height: 'auto',
                            fontWeight: 700,
                            borderRadius: '999px',
                            background: `${STATUS_COLORS[inq.status]}15`,
                            color: STATUS_COLORS[inq.status],
                            border: `1px solid ${STATUS_COLORS[inq.status]}40`,
                            cursor: 'pointer',
                          }}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>{st.replace(/_/g, ' ').toUpperCase()}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                        {formatRelativeTime(inq.createdAt)}
                      </td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setViewingInquiry(inq)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            title="Open Dossier"
                          >
                            <Eye size={13} />
                          </button>
                          <a
                            href={getWhatsAppUrl(inq)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-whatsapp btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={13} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {paginatedInquiries.map((inq) => {
              const isSelected = selectedIds.has(inq.id);
              return (
                <div
                  key={inq.id}
                  style={{
                    background: 'var(--color-surface-2)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: STATUS_COLORS[inq.status],
                        background: `${STATUS_COLORS[inq.status]}20`,
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}>
                        {inq.status.replace(/_/g, ' ')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {formatRelativeTime(inq.createdAt)}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem' }}>
                      {inq.firstName} {inq.lastName}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {getSpecialtyName(inq.specialtyId)}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {inq.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                    <button
                      onClick={() => setViewingInquiry(inq)}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
                    >
                      <Eye size={13} /> View Dossier
                    </button>
                    <a
                      href={getWhatsAppUrl(inq)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp btn-sm btn-icon"
                    >
                      <MessageCircle size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {filteredInquiries.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            totalItems={filteredInquiries.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            pageSizeOptions={[5, 10, 20]}
            unitName="inquiries"
          />
        )}
      </div>
    </div>
  );
}
