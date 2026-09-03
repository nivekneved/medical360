import { useState, useMemo } from 'react';
import { Edit3, Eye, X, CheckCircle2, Quote, LayoutGrid, List, Search, ArrowUpDown, RotateCcw, Trash2, Printer, Download } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useCaseStudies } from '../../../hooks/useCaseStudies';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { useHospitals } from '../../../hooks/useHospitals';
import { ImageField } from '../components/ImageField';
import { AdminPagination } from '../components/AdminPagination';
import { AdminBulkActionBar } from '../components/AdminBulkActionBar';
import { printOrExportPdf, exportToCsv, type ExportColumn } from '../../../core/services/export.service';
import type { CaseStudy } from '../../../core/types';
import '../AdminToolbar.css';

export function AdminCaseStudiesPage() {
  const { caseStudies, loading, refetch } = useCaseStudies();
  const { specialties }                   = useSpecialties();
  const { hospitals }                     = useHospitals({});
  const [viewMode, setViewMode]           = useState<'grid' | 'list'>('grid');
  
  // Search, Filters, Sorting, Pagination
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedCountry, setSelectedCountry]   = useState('all');
  const [sortBy, setSortBy]                     = useState<'saved-desc' | 'year-desc' | 'stay-asc' | 'name-asc'>('saved-desc');
  const [currentPage, setCurrentPage]           = useState(1);
  const [itemsPerPage, setItemsPerPage]         = useState(6);

  // Row selection
  const [selectedIds, setSelectedIds]           = useState<Set<string>>(new Set());

  const [editingCase, setEditingCase]           = useState<CaseStudy | null>(null);
  const [viewingCase, setViewingCase]           = useState<CaseStudy | null>(null);
  const [saving, setSaving]                     = useState(false);
  const [savedSuccess, setSavedSuccess]         = useState(false);

  const getSpecialtyName = (sId: string) => {
    const s = specialties.find(item => item.id === sId);
    return s ? s.name : sId;
  };

  const getHospitalName = (hId: string) => {
    const h = hospitals.find(item => item.id === hId);
    return h ? h.name : hId;
  };

  // Filtered & Sorted Case Studies
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter((cs) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        cs.patientFirstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cs.condition_fr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.patientCountry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSpecialty = selectedSpecialty === 'all' || cs.specialtyId === selectedSpecialty;
      const matchCountry   = selectedCountry === 'all' || cs.patientCountry === selectedCountry;

      return matchSearch && matchSpecialty && matchCountry;
    }).sort((a, b) => {
      if (sortBy === 'saved-desc') return b.costSavedPercent - a.costSavedPercent;
      if (sortBy === 'year-desc') return (b.year || 2026) - (a.year || 2026);
      if (sortBy === 'stay-asc') return (a.durationDays || 0) - (b.durationDays || 0);
      if (sortBy === 'name-asc') return a.patientFirstName.localeCompare(b.patientFirstName);
      return 0;
    });
  }, [caseStudies, searchQuery, selectedSpecialty, selectedCountry, sortBy]);

  // Pagination calculation
  const paginatedCaseStudies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCaseStudies.slice(start, start + itemsPerPage);
  }, [filteredCaseStudies, currentPage, itemsPerPage]);

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
    setSelectedIds(new Set(filteredCaseStudies.map(cs => cs.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Export Columns Definition
  const exportColumns: ExportColumn[] = [
    { header: 'Patient Name', key: 'patientFirstName', format: (val, r) => `${val}, ${r.patientAge}` },
    { header: 'Origin Country', key: 'patientCountry' },
    { header: 'Medical Condition', key: 'condition' },
    { header: 'Treatment Received', key: 'treatment' },
    { header: 'Hospital Partner', key: 'hospitalId', format: (val) => getHospitalName(val) },
    { header: 'Specialty', key: 'specialtyId', format: (val) => getSpecialtyName(val) },
    { header: 'Cost Savings', key: 'costSavedPercent', format: (val) => `${val}% Saved` },
    { header: 'Year', key: 'year', format: (val) => String(val || 2026) },
  ];

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected patient success stories?`)) {
      for (const id of selectedIds) {
        await mockEngine.deleteCaseStudy(id);
      }
      handleClearSelection();
      refetch();
    }
  };

  const handleDeleteSingle = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete case study for "${name}"?`)) {
      await mockEngine.deleteCaseStudy(id);
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      refetch();
    }
  };

  const handlePrintPdfSelected = () => {
    const targetData = selectedIds.size > 0
      ? caseStudies.filter(c => selectedIds.has(c.id))
      : filteredCaseStudies;
    printOrExportPdf('Patient Success Stories & Case Studies Report', exportColumns, targetData, 'Medical360 Cross-Border Patient Outcomes & Savings Dossier');
  };

  const handleExportCsvSelected = () => {
    const targetData = selectedIds.size > 0
      ? caseStudies.filter(c => selectedIds.has(c.id))
      : filteredCaseStudies;
    exportToCsv('medical360_case_studies', exportColumns, targetData);
  };

  const handlePrintSingle = (cs: CaseStudy) => {
    printOrExportPdf(
      `Patient Success Story: ${cs.patientFirstName} (${cs.patientCountry})`,
      exportColumns,
      [cs],
      `${cs.condition} &rarr; ${cs.treatment} • Saved ${cs.costSavedPercent}%`
    );
  };

  const handleEditClick = (cs: CaseStudy) => {
    setEditingCase(JSON.parse(JSON.stringify(cs)));
    setViewingCase(null);
    setSavedSuccess(false);
  };

  const handleViewClick = (cs: CaseStudy) => {
    setViewingCase(cs);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;
    setSaving(true);
    try {
      await mockEngine.updateCaseStudy(editingCase.id, editingCase);
      refetch();
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingCase(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to save patient story.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 1440, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Patient Success Stories & Testimonials</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Manage verified Mauritian patient outcomes, cost savings statistics, and multilingual testimonials.
          </p>
        </div>

        {/* Global Action Buttons */}
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
              placeholder="Search patient stories, treatments, conditions..."
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
          {/* Specialty Filter */}
          <select
            className="admin-toolbar__select"
            value={selectedSpecialty}
            onChange={(e) => { setSelectedSpecialty(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Specialties</option>
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            className="admin-toolbar__select"
            value={selectedCountry}
            onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Countries</option>
            <option value="Mauritius">Mauritius</option>
            <option value="Reunion">Réunion</option>
            <option value="Madagascar">Madagascar</option>
            <option value="Seychelles">Seychelles</option>
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
              <option value="saved-desc">💰 Cost Savings (%)</option>
              <option value="year-desc">⚡ Most Recent</option>
              <option value="stay-asc">⏱️ Shortest Stay</option>
              <option value="name-asc">🔤 Patient Name (A-Z)</option>
            </select>
          </div>

          {/* Count Badge */}
          <div className="admin-toolbar__count-badge">
            <span className="admin-toolbar__count-num">{filteredCaseStudies.length}</span>
            <span className="admin-toolbar__count-unit">{filteredCaseStudies.length <= 1 ? 'case study' : 'case studies'}</span>
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
          {(searchQuery || selectedSpecialty !== 'all' || selectedCountry !== 'all') && (
            <button
              className="admin-toolbar__reset-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setSelectedCountry('all');
                setCurrentPage(1);
              }}
              title="Reset all filters"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* ─── BULK ACTION BAR ──────────────────────────────────────────────── */}
      <AdminBulkActionBar
        selectedCount={selectedIds.size}
        totalCount={filteredCaseStudies.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onDeleteSelected={handleDeleteSelected}
        onPrintPdfSelected={handlePrintPdfSelected}
        onExportCsvSelected={handleExportCsvSelected}
        unitName="case studies"
      />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />
          ))}
        </div>
      ) : paginatedCaseStudies.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: 'var(--color-surface)',
          border: '1.5px dashed var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          color: 'var(--color-text-muted)',
        }}>
          <Search size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>No patient stories match your search</h3>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Try clearing search keywords or adjusting your filters.</p>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); setSelectedCountry('all'); }}
            style={{ marginTop: '1rem' }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {paginatedCaseStudies.map((cs) => {
            const isSelected = selectedIds.has(cs.id);
            return (
              <div
                key={cs.id}
                style={{
                  background: 'var(--color-surface)',
                  border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isSelected ? '0 4px 14px rgba(6,95,70,0.15)' : '0 2px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', height: 160, background: '#0b131b' }}>
                  {/* Card Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(cs.id)}
                    style={{ position: 'absolute', top: 12, right: 12, width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)', zIndex: 2 }}
                    title="Select case study"
                  />

                  <img
                    src={cs.imageUrl}
                    alt={cs.patientFirstName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.2) 100%)',
                  }} />
                  
                  <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', right: '1rem', paddingRight: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        margin: 0,
                        textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                      }}>
                        {cs.patientFirstName}, {cs.patientAge} ({cs.patientCountry})
                      </h3>
                      <span style={{
                        background: '#059669',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: 999,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }}>
                        Saved {cs.costSavedPercent}%
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#e2e8f0', marginTop: '0.2rem', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                      {cs.condition}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.8125rem' }}>
                    <strong>Treatment:</strong> {cs.treatment}
                  </div>
                  <div style={{ fontSize: '0.8125rem' }}>
                    <strong>Hospital:</strong> {getHospitalName(cs.hospitalId)}
                  </div>

                  <div style={{
                    background: 'var(--color-surface-2)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'auto',
                    lineHeight: 1.5,
                  }}>
                    "{cs.testimonial.slice(0, 100)}..."
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.4rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-light)' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleViewClick(cs)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEditClick(cs)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handlePrintSingle(cs)}
                      style={{ padding: '4px 8px' }}
                      title="Print / Save PDF Dossier"
                    >
                      <Printer size={13} />
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDeleteSingle(cs.id, cs.patientFirstName)}
                      style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '4px 8px' }}
                      title="Delete Case Study"
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
        /* ─── COMPACT LIST VIEW ─── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {paginatedCaseStudies.map((cs) => {
            const isSelected = selectedIds.has(cs.id);
            return (
              <div
                key={cs.id}
                style={{
                  background: isSelected ? 'rgba(6, 95, 70, 0.04)' : 'var(--color-surface)',
                  border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 260, flex: 2 }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(cs.id)}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)', flexShrink: 0 }}
                  />
                  <img
                    src={cs.imageUrl}
                    alt={cs.patientFirstName}
                    style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                        {cs.patientFirstName}, {cs.patientAge}
                      </h3>
                      <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>{cs.patientCountry}</span>
                      <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Saved {cs.costSavedPercent}%</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      <strong>{cs.condition}</strong> &rarr; {cs.treatment} • <span style={{ color: 'var(--color-primary)' }}>{getHospitalName(cs.hospitalId)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1.5, justifyContent: 'space-around' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)' }}>{cs.year}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Year</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{cs.durationDays || 7} d</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Stay</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewClick(cs)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', padding: '4px 8px' }}
                  >
                    <Eye size={13} /> View
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEditClick(cs)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', padding: '4px 8px' }}
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handlePrintSingle(cs)}
                    style={{ padding: '4px 7px' }}
                    title="Print / Save PDF Dossier"
                  >
                    <Printer size={13} />
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDeleteSingle(cs.id, cs.patientFirstName)}
                    style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '4px 7px' }}
                    title="Delete Case Study"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── PAGINATION BAR ────────────────────────────────────────────────── */}
      {filteredCaseStudies.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalItems={filteredCaseStudies.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          pageSizeOptions={[6, 12, 24, 48]}
          unitName="patient stories"
        />
      )}

      {/* ─── VIEW MODAL ────────────────────────────────────────────────────── */}
      {viewingCase && (
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
            maxWidth: 620,
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid var(--color-border)',
          }}>
            {/* Modal Header Image */}
            <div style={{ position: 'relative', height: 200, background: '#0b131b' }}>
              <img
                src={viewingCase.imageUrl}
                alt={viewingCase.patientFirstName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 100%)',
              }} />
              <button
                onClick={() => setViewingCase(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
              <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem' }}>
                <span style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  borderRadius: 999,
                  display: 'inline-block',
                  marginBottom: '0.5rem',
                }}>
                  Saved {viewingCase.costSavedPercent}% Compared to Local Quotas
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {viewingCase.patientFirstName}, {viewingCase.patientAge} ({viewingCase.patientCountry})
                </h2>
                <div style={{ color: '#cbd5e1', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {viewingCase.condition} · {getSpecialtyName(viewingCase.specialtyId)}
                </div>
              </div>
            </div>

            {/* Modal Body Content */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Treatment Performed
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: 2 }}>
                    {viewingCase.treatment}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Hospital Center
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: 2 }}>
                    {getHospitalName(viewingCase.hospitalId)}
                  </div>
                </div>
              </div>

              {/* Full Testimonial */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Quote size={16} color="var(--color-primary)" /> Verified Patient Testimonial
                </h3>
                <div style={{
                  background: 'rgba(6,95,70,0.04)',
                  border: '1px solid rgba(6,95,70,0.12)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  fontSize: '0.925rem',
                  lineHeight: 1.65,
                  fontStyle: 'italic',
                  color: 'var(--color-text)',
                }}>
                  "{viewingCase.testimonial}"
                </div>
              </div>

              {/* Multi-language Translations */}
              {(viewingCase.testimonial_fr || viewingCase.testimonial_kr) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {viewingCase.testimonial_fr && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      <strong>🇫🇷 Version Française:</strong> "{viewingCase.testimonial_fr}"
                    </div>
                  )}
                  {viewingCase.testimonial_kr && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      <strong>🇲🇺 Version Kreol:</strong> "{viewingCase.testimonial_kr}"
                    </div>
                  )}
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setViewingCase(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleEditClick(viewingCase)}
                >
                  <Edit3 size={16} /> Edit Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT MODAL ────────────────────────────────────────────────────── */}
      {editingCase && (
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
          <form
            onSubmit={handleSave}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl)',
              width: '100%',
              maxWidth: 620,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Patient Story & Testimonial</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                  {editingCase.patientFirstName}, {editingCase.patientAge} · {editingCase.condition}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCase(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Patient First Name *</label>
                  <input
                    className="form-input"
                    value={editingCase.patientFirstName}
                    onChange={(e) => setEditingCase({ ...editingCase, patientFirstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Age *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingCase.patientAge}
                    onChange={(e) => setEditingCase({ ...editingCase, patientAge: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country *</label>
                  <input
                    className="form-input"
                    value={editingCase.patientCountry}
                    onChange={(e) => setEditingCase({ ...editingCase, patientCountry: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <ImageField
                  label="Patient Photo / Story Cover Image"
                  value={editingCase.imageUrl}
                  onChange={(url) => setEditingCase({ ...editingCase, imageUrl: url })}
                  category="patients"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Medical Specialty *</label>
                  <select
                    className="form-select"
                    value={editingCase.specialtyId}
                    onChange={(e) => setEditingCase({ ...editingCase, specialtyId: e.target.value })}
                  >
                    {specialties.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Hospital Center *</label>
                  <select
                    className="form-select"
                    value={editingCase.hospitalId}
                    onChange={(e) => setEditingCase({ ...editingCase, hospitalId: e.target.value })}
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>{h.name} ({h.country})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Medical Condition Diagnosed *</label>
                  <input
                    className="form-input"
                    value={editingCase.condition}
                    onChange={(e) => setEditingCase({ ...editingCase, condition: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cost Saved (%) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingCase.costSavedPercent}
                    onChange={(e) => setEditingCase({ ...editingCase, costSavedPercent: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="99"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Treatment Performed *</label>
                <input
                  className="form-input"
                  value={editingCase.treatment}
                  onChange={(e) => setEditingCase({ ...editingCase, treatment: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Testimonial (English) *</label>
                <textarea
                  className="form-textarea"
                  value={editingCase.testimonial}
                  onChange={(e) => setEditingCase({ ...editingCase, testimonial: e.target.value })}
                  style={{ minHeight: 90 }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Testimonial (Français)</label>
                <textarea
                  className="form-textarea"
                  value={editingCase.testimonial_fr || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, testimonial_fr: e.target.value })}
                  style={{ minHeight: 80 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Testimonial (Kreol Morisien)</label>
                <textarea
                  className="form-textarea"
                  value={editingCase.testimonial_kr || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, testimonial_kr: e.target.value })}
                  style={{ minHeight: 80 }}
                />
              </div>
            </div>

            <div style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              bottom: 0,
              background: 'var(--color-surface)',
            }}>
              <div>
                {savedSuccess && (
                  <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={16} /> Saved successfully!
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingCase(null)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
