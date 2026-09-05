import { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Download,
  Eye,
  CheckSquare,
  Square,
  Phone,
  Mail,
  MapPin,
  Clock,
  Inbox,
} from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useSpecialties } from '../../../hooks/useSpecialties';
import type { Inquiry, InquiryStatus } from '../../../core/types';
import { exportInquiriesToCsv, printInquiriesPdf, printInquiryPdf } from '../../../core/services/export.service';
import { AdminBulkActionBar } from '../components/AdminBulkActionBar';
import { AdminPagination } from '../components/AdminPagination';
import { InquiryDetailConsole } from './components/InquiryDetailConsole';
import { InquiryFilterToolbar } from './components/InquiryFilterToolbar';
import { WhatsAppSyncLogPanel } from './components/WhatsAppSyncLogPanel';
import { MessageCircle } from 'lucide-react';
import '../AdminToolbar.css';

const STATUS_OPTIONS: InquiryStatus[] = [
  'new',
  'contacted',
  'in_progress',
  'awaiting_documents',
  'quoted',
  'confirmed',
  'completed',
  'cancelled',
];

export function AdminInquiriesPage() {
  const [activeTab, setActiveTab]               = useState<'inquiries' | 'whatsapp'>('inquiries');
  const [inquiries, setInquiries]               = useState<Inquiry[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedStatus, setSelectedStatus]     = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency]   = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [sortBy, setSortBy]                     = useState<'date-desc' | 'date-asc' | 'urgency-desc' | 'name-asc'>('date-desc');
  const [viewMode, setViewMode]                 = useState<'grid' | 'table'>('table');
  const [currentPage, setCurrentPage]           = useState(1);
  const [itemsPerPage, setItemsPerPage]         = useState(8);
  const [selectedIds, setSelectedIds]           = useState<Set<string>>(new Set());

  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [newNoteText, setNewNoteText]       = useState('');
  const [savingNote, setSavingNote]         = useState(false);
  const { specialties } = useSpecialties();

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

  const paginatedInquiries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInquiries.slice(start, start + itemsPerPage);
  }, [filteredInquiries, currentPage, itemsPerPage]);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedInquiries.length && paginatedInquiries.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedInquiries.map(i => i.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkStatusChange = async (newStatus: InquiryStatus) => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => mockEngine.updateInquiry(id, { status: newStatus })));
      setSelectedIds(new Set());
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to update selected inquiries.');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedIds.size} inquiries?`)) return;
    try {
      await Promise.all(Array.from(selectedIds).map(id => mockEngine.deleteInquiry(id)));
      setSelectedIds(new Set());
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to delete selected inquiries.');
    }
  };

  const handleDeleteSingle = async (id: string, name: string) => {
    if (!window.confirm(`Delete inquiry for ${name}?`)) return;
    try {
      await mockEngine.deleteInquiry(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to delete inquiry.');
    }
  };

  const handleExportCsvSelected = () => {
    const target = selectedIds.size > 0
      ? inquiries.filter(i => selectedIds.has(i.id))
      : filteredInquiries;
    exportInquiriesToCsv(target, specialties);
  };

  const handlePrintPdfSelected = () => {
    const target = selectedIds.size > 0
      ? inquiries.filter(i => selectedIds.has(i.id))
      : filteredInquiries;
    printInquiriesPdf(target, specialties);
  };

  const handlePrintSingle = (inquiry: Inquiry) => {
    printInquiryPdf(inquiry, getSpecialtyName(inquiry.specialtyId));
  };

  const updateStatus = async (id: string, status: InquiryStatus) => {
    await mockEngine.updateInquiry(id, { status });
    if (viewingInquiry && viewingInquiry.id === id) {
      setViewingInquiry({ ...viewingInquiry, status });
    }
    load();
  };

  const handleAddNote = async (e: React.FormEvent) => {
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
  };

  const urgencyColor = (u: string) =>
    u === 'emergency' ? '#dc2626' : u === 'urgent' ? '#d97706' : '#059669';

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <p>Loading patient inquiries & clinical triage console...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 1440, margin: '0 auto' }}>
      {viewingInquiry ? (
        <InquiryDetailConsole
          inquiry={viewingInquiry}
          specialties={specialties}
          statusOptions={STATUS_OPTIONS}
          onBack={() => setViewingInquiry(null)}
          onUpdateStatus={updateStatus}
          onDelete={handleDeleteSingle}
          onPrint={handlePrintSingle}
          newNoteText={newNoteText}
          onNewNoteTextChange={setNewNoteText}
          onAddNote={handleAddNote}
          savingNote={savingNote}
        />
      ) : (
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
                onClick={handlePrintPdfSelected}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                title="Print or Save current list as PDF"
              >
                <Printer size={15} /> Print / Export PDF
              </button>
              <button
                type="button"
                onClick={handleExportCsvSelected}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                title="Download CSV spreadsheet"
              >
                <Download size={15} /> Export CSV
              </button>
            </div>
          </div>

          {/* Navigation View Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--color-surface-2)', padding: '0.35rem', borderRadius: 'var(--radius-lg)', width: 'fit-content' }}>
            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className="btn btn-sm"
              style={{
                background: activeTab === 'inquiries' ? 'var(--color-surface)' : 'transparent',
                color: activeTab === 'inquiries' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: 700,
                border: activeTab === 'inquiries' ? '1px solid var(--color-border)' : '1px solid transparent',
                boxShadow: activeTab === 'inquiries' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Inbox size={15} /> Clinical Inquiries ({inquiries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className="btn btn-sm"
              style={{
                background: activeTab === 'whatsapp' ? 'var(--color-surface)' : 'transparent',
                color: activeTab === 'whatsapp' ? '#25D366' : 'var(--color-text-secondary)',
                fontWeight: 700,
                border: activeTab === 'whatsapp' ? '1px solid var(--color-border)' : '1px solid transparent',
                boxShadow: activeTab === 'whatsapp' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <MessageCircle size={15} /> WhatsApp 24/7 Webhooks & Sync
            </button>
          </div>

          {activeTab === 'whatsapp' ? (
            <WhatsAppSyncLogPanel />
          ) : (
            <>

              {/* Search, Filters & Sorting Toolbar */}
              <InquiryFilterToolbar
                searchQuery={searchQuery}
                onSearchChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
                selectedStatus={selectedStatus}
                onStatusChange={(val) => { setSelectedStatus(val); setCurrentPage(1); }}
                selectedUrgency={selectedUrgency}
                onUrgencyChange={(val) => { setSelectedUrgency(val); setCurrentPage(1); }}

            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={(val) => { setSelectedSpecialty(val); setCurrentPage(1); }}
            sortBy={sortBy}
            onSortChange={(val) => setSortBy(val)}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            statusOptions={STATUS_OPTIONS}
            specialties={specialties}
          />

          {/* Bulk Action Bar */}
          <AdminBulkActionBar
            selectedCount={selectedIds.size}
            totalCount={paginatedInquiries.length}
            onClearSelection={() => setSelectedIds(new Set())}
            onDeleteSelected={handleBulkDelete}
            onStatusChangeSelected={(st) => handleBulkStatusChange(st as InquiryStatus)}
            statusOptions={STATUS_OPTIONS.map(s => ({ label: s.replace(/_/g, ' ').toUpperCase(), value: s }))}
            onExportCsvSelected={handleExportCsvSelected}
            onPrintPdfSelected={handlePrintPdfSelected}
          />

          {/* Data Presentation (Table or Grid) */}
          {filteredInquiries.length === 0 ? (
            <div style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px dashed var(--color-border)',
              padding: '4rem 2rem',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
            }}>
              <Inbox size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>
                No inquiries found
              </h3>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                {hasActiveFilters ? 'Try changing your search terms or clearing your filters.' : 'New patient inquiries will appear here.'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {paginatedInquiries.map((inq) => {
                const isSelected = selectedIds.has(inq.id);
                return (
                  <div
                    key={inq.id}
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-xl)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => toggleSelectOne(inq.id)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            {isSelected ? <CheckSquare size={18} color="var(--color-primary)" /> : <Square size={18} color="var(--color-text-muted)" />}
                          </button>
                          <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                              {inq.firstName} {inq.lastName}
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{inq.countryOfResidence}</span>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          background: `${urgencyColor(inq.urgency)}15`,
                          color: urgencyColor(inq.urgency),
                          padding: '2px 8px',
                          borderRadius: 999,
                        }}>
                          {inq.urgency}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: 2 }}>
                          ✦ {getSpecialtyName(inq.specialtyId)}
                        </div>
                        <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>
                          {inq.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {formatDate(inq.createdAt)}
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setViewingInquiry(inq)}
                          className="btn btn-primary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem' }}
                        >
                          <Eye size={14} /> Open
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--color-border)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.875rem 0.85rem', width: 40 }}>
                      <button type="button" onClick={toggleSelectAll} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                        {selectedIds.size === paginatedInquiries.length && paginatedInquiries.length > 0 ? (
                          <CheckSquare size={16} color="var(--color-primary)" />
                        ) : (
                          <Square size={16} color="var(--color-text-muted)" />
                        )}
                      </button>
                    </th>
                    <th style={{ padding: '0.875rem 0.85rem' }}>Patient & Origin</th>
                    <th style={{ padding: '0.875rem 0.85rem' }}>Specialty</th>
                    <th style={{ padding: '0.875rem 0.85rem' }}>Urgency</th>
                    <th style={{ padding: '0.875rem 0.85rem' }}>Date</th>
                    <th style={{ padding: '0.875rem 0.85rem' }}>Status</th>
                    <th style={{ padding: '0.875rem 0.85rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInquiries.map((inq) => {
                    const isSelected = selectedIds.has(inq.id);
                    return (
                      <tr key={inq.id} style={{ borderBottom: '1px solid var(--color-border)', background: isSelected ? 'rgba(6,95,70,0.03)' : 'transparent' }}>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <button type="button" onClick={() => toggleSelectOne(inq.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                            {isSelected ? <CheckSquare size={16} color="var(--color-primary)" /> : <Square size={16} color="var(--color-text-muted)" />}
                          </button>
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{inq.firstName} {inq.lastName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{inq.phone} · {inq.countryOfResidence}</div>
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{getSpecialtyName(inq.specialtyId)}</span>
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            background: `${urgencyColor(inq.urgency)}15`,
                            color: urgencyColor(inq.urgency),
                            padding: '3px 8px',
                            borderRadius: 999,
                          }}>
                            {inq.urgency}
                          </span>
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                          {formatDate(inq.createdAt)}
                        </td>
                        <td style={{ padding: '0.875rem 0.85rem' }}>
                          <select
                            value={inq.status}
                            onChange={(e) => updateStatus(inq.id, e.target.value as InquiryStatus)}
                            className="form-input"
                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', height: 'auto', fontWeight: 600 }}
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

          {/* Pagination Bar */}
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
        </>
      )}
    </div>
  );
}

