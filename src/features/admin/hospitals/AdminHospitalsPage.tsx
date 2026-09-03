import { useState, useMemo } from 'react';
import { Edit3, Eye, Star, MapPin, Shield, CheckCircle2, X, LayoutGrid, List, Search, ArrowUpDown, RotateCcw, Trash2, Printer, Download } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useHospitals } from '../../../hooks/useHospitals';
import { formatNumber } from '../../../core/services/format.service';
import { ImageField } from '../components/ImageField';
import { AdminPagination } from '../components/AdminPagination';
import { AdminBulkActionBar } from '../components/AdminBulkActionBar';
import { printOrExportPdf, exportToCsv, type ExportColumn } from '../../../core/services/export.service';
import type { Hospital } from '../../../core/types';
import '../AdminToolbar.css';

export function AdminHospitalsPage() {
  const { hospitals, loading, refetch } = useHospitals({});
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid');
  
  // Search, Filters, Sorting, Pagination
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedAccreditation, setSelectedAccreditation] = useState('all');
  const [selectedCountry, setSelectedCountry]   = useState('all');
  const [sortBy, setSortBy]                     = useState<'rating-desc' | 'beds-desc' | 'intl-desc' | 'name-asc' | 'name-desc'>('rating-desc');
  const [currentPage, setCurrentPage]           = useState(1);
  const [itemsPerPage, setItemsPerPage]         = useState(6);

  // Row selection
  const [selectedIds, setSelectedIds]           = useState<Set<string>>(new Set());

  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [viewingHospital, setViewingHospital] = useState<Hospital | null>(null);
  const [saving, setSaving]             = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filtered & Sorted Hospitals
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.name_fr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchAccreditation =
        selectedAccreditation === 'all' ||
        h.accreditations.includes(selectedAccreditation);

      const matchCountry =
        selectedCountry === 'all' || h.country === selectedCountry;

      return matchSearch && matchAccreditation && matchCountry;
    }).sort((a, b) => {
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'beds-desc') return b.bedsCount - a.bedsCount;
      if (sortBy === 'intl-desc') return b.internationalPatientsPerYear - a.internationalPatientsPerYear;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [hospitals, searchQuery, selectedAccreditation, selectedCountry, sortBy]);

  // Pagination calculation
  const paginatedHospitals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHospitals.slice(start, start + itemsPerPage);
  }, [filteredHospitals, currentPage, itemsPerPage]);

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
    setSelectedIds(new Set(filteredHospitals.map(h => h.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Export Columns Definition
  const exportColumns: ExportColumn[] = [
    { header: 'Hospital Name', key: 'name' },
    { header: 'City', key: 'city' },
    { header: 'Country', key: 'country' },
    { header: 'Rating', key: 'rating', format: (val) => `${val} ★` },
    { header: 'Accreditations', key: 'accreditations', format: (val) => (val || []).join(', ') },
    { header: 'Beds', key: 'bedsCount', format: (val) => String(val || 0) },
    { header: 'Intl Patients/Yr', key: 'internationalPatientsPerYear', format: (val) => String(val || 0) },
  ];

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} selected hospital partner records?`)) {
      for (const id of selectedIds) {
        await mockEngine.deleteHospital(id);
      }
      handleClearSelection();
      refetch();
    }
  };

  const handleDeleteSingle = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await mockEngine.deleteHospital(id);
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
      ? hospitals.filter(h => selectedIds.has(h.id))
      : filteredHospitals;
    printOrExportPdf('Partner Hospitals Directory Report', exportColumns, targetData, 'Accredited Medical Centers & Global Healthcare Partners');
  };

  const handleExportCsvSelected = () => {
    const targetData = selectedIds.size > 0
      ? hospitals.filter(h => selectedIds.has(h.id))
      : filteredHospitals;
    exportToCsv('medical360_hospitals', exportColumns, targetData);
  };

  const handlePrintSingle = (h: Hospital) => {
    printOrExportPdf(
      `Hospital Partner Dossier: ${h.name}`,
      exportColumns,
      [h],
      `${h.city}, ${h.country} • Accredited Clinical Facility`
    );
  };

  const handleEditClick = (h: Hospital) => {
    setEditingHospital(JSON.parse(JSON.stringify(h)));
    setViewingHospital(null);
    setSavedSuccess(false);
  };

  const handleViewClick = (h: Hospital) => {
    setViewingHospital(h);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;
    setSaving(true);
    try {
      await mockEngine.updateHospital(editingHospital.id, editingHospital);
      refetch();
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingHospital(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to save hospital.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>Partner Hospitals Directory</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Manage hospital credentials, clinical facilities, photos, and international patient volume.
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
              placeholder="Search hospitals, city, facilities..."
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
          {/* Accreditation Filter */}
          <select
            className="admin-toolbar__select"
            value={selectedAccreditation}
            onChange={(e) => { setSelectedAccreditation(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Accreditations</option>
            <option value="JCI">JCI Accredited</option>
            <option value="NABH">NABH Accredited</option>
            <option value="ISO">ISO Certified</option>
            <option value="NABL">NABL Labs</option>
          </select>

          {/* Country Filter */}
          <select
            className="admin-toolbar__select"
            value={selectedCountry}
            onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Countries</option>
            <option value="India">India</option>
            <option value="Mauritius">Mauritius</option>
            <option value="Reunion">Réunion</option>
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
              <option value="rating-desc">★ Highest Rated</option>
              <option value="beds-desc">🛏️ Most Beds</option>
              <option value="intl-desc">👥 Intl. Patients</option>
              <option value="name-asc">🔤 Name (A-Z)</option>
              <option value="name-desc">🔤 Name (Z-A)</option>
            </select>
          </div>

          {/* Count Badge */}
          <div className="admin-toolbar__count-badge">
            <span className="admin-toolbar__count-num">{filteredHospitals.length}</span>
            <span className="admin-toolbar__count-unit">{filteredHospitals.length <= 1 ? 'hospital' : 'hospitals'}</span>
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
          {(searchQuery || selectedAccreditation !== 'all' || selectedCountry !== 'all') && (
            <button
              className="admin-toolbar__reset-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedAccreditation('all');
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
        totalCount={filteredHospitals.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onDeleteSelected={handleDeleteSelected}
        onPrintPdfSelected={handlePrintPdfSelected}
        onExportCsvSelected={handleExportCsvSelected}
        unitName="hospitals"
      />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          ))}
        </div>
      ) : paginatedHospitals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: 'var(--color-surface)',
          border: '1.5px dashed var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          color: 'var(--color-text-muted)',
        }}>
          <Search size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>No hospitals match your search</h3>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Try clearing search keywords or adjusting your filters.</p>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setSearchQuery(''); setSelectedAccreditation('all'); setSelectedCountry('all'); }}
            style={{ marginTop: '1rem' }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {paginatedHospitals.map((hospital) => {
            const desc = hospital.description || hospital.description_fr || '';
            const accreditations = hospital.accreditations || [];
            const isSelected = selectedIds.has(hospital.id);

            return (
              <div
                key={hospital.id}
                style={{
                  background: 'var(--color-surface)',
                  border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: isSelected ? '0 4px 14px rgba(6,95,70,0.15)' : '0 2px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', borderBottom: '1px solid var(--color-border)', position: 'relative' }}>
                  {/* Card Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(hospital.id)}
                    style={{ position: 'absolute', top: 12, right: 12, width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)', zIndex: 2 }}
                    title="Select hospital"
                  />

                  <img
                    src={hospital.imageUrl}
                    alt={hospital.name}
                    style={{ width: 85, height: 85, borderRadius: 'var(--radius-lg)', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingRight: 20 }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      {accreditations.map((acc) => (
                        <span key={acc} className="badge badge-accent" style={{ fontSize: '0.65rem' }}>
                          <Shield size={9} /> {acc}
                        </span>
                      ))}
                      {hospital.featured && (
                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Featured</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 2px 0' }}>{hospital.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0 }}>
                      <MapPin size={12} /> {hospital.city}, {hospital.country}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      <Star size={14} fill="#ffb400" color="#ffb400" /> {hospital.rating} Rating
                    </span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{formatNumber(hospital.bedsCount || 0)} beds</span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {desc.length > 100 ? `${desc.slice(0, 100)}...` : desc}
                  </p>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-light)' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleViewClick(hospital)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEditClick(hospital)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.78rem' }}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handlePrintSingle(hospital)}
                      style={{ padding: '4px 8px' }}
                      title="Print / Export PDF Dossier"
                    >
                      <Printer size={13} />
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleDeleteSingle(hospital.id, hospital.name)}
                      style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '4px 8px' }}
                      title="Delete Hospital"
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
          {paginatedHospitals.map((hospital) => {
            const isSelected = selectedIds.has(hospital.id);
            return (
              <div
                key={hospital.id}
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
                    onChange={() => toggleSelect(hospital.id)}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)', flexShrink: 0 }}
                  />
                  <img
                    src={hospital.imageUrl}
                    alt={hospital.name}
                    style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{hospital.name}</h3>
                      {(hospital.accreditations || []).map((acc) => (
                        <span key={acc} className="badge badge-accent" style={{ fontSize: '0.65rem' }}>{acc}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: 3 }} /> {hospital.city}, {hospital.country}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1.5, justifyContent: 'space-around' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#eab308' }}>{hospital.rating} ★</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Rating</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{formatNumber(hospital.bedsCount || 0)}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Beds</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                      {formatNumber(hospital.internationalPatientsPerYear || 0)}+
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Intl/Yr</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewClick(hospital)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', padding: '4px 8px' }}
                  >
                    <Eye size={13} /> View
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEditClick(hospital)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', padding: '4px 8px' }}
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handlePrintSingle(hospital)}
                    style={{ padding: '4px 7px' }}
                    title="Print / Save PDF Dossier"
                  >
                    <Printer size={13} />
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDeleteSingle(hospital.id, hospital.name)}
                    style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '4px 7px' }}
                    title="Delete Hospital"
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
      {filteredHospitals.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalItems={filteredHospitals.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          pageSizeOptions={[6, 12, 24, 48]}
          unitName="partner hospitals"
        />
      )}

      {/* ─── VIEW HOSPITAL MODAL ───────────────────────────────────────────── */}
      {viewingHospital && (
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
            maxWidth: 650,
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            border: '1px solid var(--color-border)',
          }}>
            {/* Modal Image Banner */}
            <div style={{ position: 'relative', height: 200, background: '#0b131b' }}>
              <img
                src={viewingHospital.imageUrl}
                alt={viewingHospital.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 100%)',
              }} />
              <button
                onClick={() => setViewingHospital(null)}
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
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  {viewingHospital.accreditations.map((acc) => (
                    <span key={acc} style={{
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}>
                      {acc}
                    </span>
                  ))}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {viewingHospital.name}
                </h2>
                <div style={{ color: '#cbd5e1', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {viewingHospital.city}, {viewingHospital.country}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{viewingHospital.rating} ★</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Clinical Quality</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{formatNumber(viewingHospital.bedsCount || 0)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Hospital Beds</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{formatNumber(viewingHospital.internationalPatientsPerYear || 0)}+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Intl. Patients/Yr</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Hospital Profile & Facilities
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                  {viewingHospital.description}
                </p>
              </div>

              {/* Multi-language Descriptions */}
              {viewingHospital.description_fr && (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <strong>🇫🇷 Description en Français:</strong> {viewingHospital.description_fr}
                </div>
              )}

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setViewingHospital(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleEditClick(viewingHospital)}
                >
                  <Edit3 size={16} /> Edit Hospital
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT HOSPITAL MODAL ───────────────────────────────────────────── */}
      {editingHospital && (
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
              maxWidth: 650,
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Hospital Profile</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                  {editingHospital.name} · {editingHospital.city}, {editingHospital.country}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingHospital(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Hospital Name *</label>
                <input
                  className="form-input"
                  value={editingHospital.name}
                  onChange={(e) => setEditingHospital({ ...editingHospital, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    className="form-input"
                    value={editingHospital.city}
                    onChange={(e) => setEditingHospital({ ...editingHospital, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country *</label>
                  <input
                    className="form-input"
                    value={editingHospital.country}
                    onChange={(e) => setEditingHospital({ ...editingHospital, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <ImageField
                  label="Hospital Cover Image"
                  value={editingHospital.imageUrl}
                  onChange={(url) => setEditingHospital({ ...editingHospital, imageUrl: url })}
                  category="hospitals"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Beds Count</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingHospital.bedsCount || 0}
                    onChange={(e) => setEditingHospital({ ...editingHospital, bedsCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quality Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={editingHospital.rating}
                    onChange={(e) => setEditingHospital({ ...editingHospital, rating: parseFloat(e.target.value) || 0 })}
                    min="1"
                    max="5"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Intl. Patients/Yr</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingHospital.internationalPatientsPerYear || 0}
                    onChange={(e) => setEditingHospital({ ...editingHospital, internationalPatientsPerYear: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description (English) *</label>
                <textarea
                  className="form-textarea"
                  value={editingHospital.description}
                  onChange={(e) => setEditingHospital({ ...editingHospital, description: e.target.value })}
                  style={{ minHeight: 90 }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Français)</label>
                <textarea
                  className="form-textarea"
                  value={editingHospital.description_fr || ''}
                  onChange={(e) => setEditingHospital({ ...editingHospital, description_fr: e.target.value })}
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
                  onClick={() => setEditingHospital(null)}
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
