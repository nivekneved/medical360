import { useState, useEffect, useMemo } from 'react';
import { Stethoscope, Edit3, Eye, Plus, X, Save, CheckCircle2, DollarSign, Clock, FileText, LayoutGrid, List, Search, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatCostRange, formatCostMur } from '../../../core/services/format.service';
import { ImageField } from '../components/ImageField';
import type { Specialty, Procedure } from '../../../core/types';
import '../AdminToolbar.css';

export function AdminSpecialtiesPage() {
  const [specialties, setSpecialties]           = useState<Specialty[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [viewMode, setViewMode]                 = useState<'grid' | 'list'>('grid');
  
  // Search, Sorting, Pagination
  const [searchQuery, setSearchQuery]           = useState('');
  const [sortBy, setSortBy]                     = useState<'name-asc' | 'name-desc' | 'procs-desc'>('name-asc');
  const [currentPage, setCurrentPage]           = useState(1);
  const [itemsPerPage, setItemsPerPage]         = useState(6);

  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [viewingSpecialty, setViewingSpecialty] = useState<Specialty | null>(null);
  const [saving, setSaving]                     = useState(false);
  const [savedSuccess, setSavedSuccess]         = useState(false);

  function load() {
    mockEngine.getSpecialties().then(setSpecialties).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  // Filtered & Sorted Specialties
  const filteredSpecialties = useMemo(() => {
    return specialties.filter((sp) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        sp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sp.name_fr || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sp.procedures.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'procs-desc') return b.procedures.length - a.procedures.length;
      return 0;
    });
  }, [specialties, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSpecialties.length / itemsPerPage) || 1;
  const paginatedSpecialties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSpecialties.slice(start, start + itemsPerPage);
  }, [filteredSpecialties, currentPage, itemsPerPage]);

  const handleEditClick = (sp: Specialty) => {
    setEditingSpecialty(JSON.parse(JSON.stringify(sp)));
    setViewingSpecialty(null);
    setSavedSuccess(false);
  };

  const handleViewClick = (sp: Specialty) => {
    setViewingSpecialty(sp);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecialty) return;
    setSaving(true);
    try {
      await mockEngine.updateSpecialty(editingSpecialty.id, editingSpecialty);
      load();
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingSpecialty(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to save specialty.');
    } finally {
      setSaving(false);
    }
  };

  const handleProcedureChange = (index: number, field: keyof Procedure, value: any) => {
    if (!editingSpecialty) return;
    const procs = [...editingSpecialty.procedures];
    procs[index] = { ...procs[index], [field]: value };
    setEditingSpecialty({ ...editingSpecialty, procedures: procs });
  };

  const handleProcedureCostChange = (index: number, minOrMax: 'min' | 'max', value: number) => {
    if (!editingSpecialty) return;
    const procs = [...editingSpecialty.procedures];
    procs[index] = {
      ...procs[index],
      estimatedCostUSD: {
        ...procs[index].estimatedCostUSD,
        [minOrMax]: value,
      },
    };
    setEditingSpecialty({ ...editingSpecialty, procedures: procs });
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Medical Specialties Management</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Manage medical departments, procedures, multi-language descriptions, and estimated pricing.
        </p>
      </div>

      {/* ─── SEARCH & SORT TOOLBAR ────────────────────────────────────────── */}
      <div className="admin-toolbar">
        {/* Search Input */}
        <div className="admin-toolbar__left">
          <div className="admin-toolbar__search-box">
            <Search size={16} className="admin-toolbar__search-icon" />
            <input
              type="text"
              className="admin-toolbar__search-input"
              placeholder="Search specialties, procedures, descriptions..."
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
          {/* Sort By Pill */}
          <div className="admin-toolbar__sort-pill">
            <ArrowUpDown size={14} className="admin-toolbar__sort-icon" />
            <span className="admin-toolbar__sort-label">Trier par :</span>
            <select
              className="admin-toolbar__sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name-asc">🔤 Name (A-Z)</option>
              <option value="name-desc">🔤 Name (Z-A)</option>
              <option value="procs-desc">🩺 Most Procedures</option>
            </select>
          </div>

          {/* Count Badge */}
          <div className="admin-toolbar__count-badge">
            <span className="admin-toolbar__count-num">{filteredSpecialties.length}</span>
            <span className="admin-toolbar__count-unit">{filteredSpecialties.length <= 1 ? 'spécialité' : 'spécialités'}</span>
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
          {searchQuery && (
            <button
              className="admin-toolbar__reset-btn"
              onClick={() => {
                setSearchQuery('');
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />
          ))}
        </div>
      ) : paginatedSpecialties.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: 'var(--color-surface)',
          border: '1.5px dashed var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          color: 'var(--color-text-muted)',
        }}>
          <Search size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>No specialties match your search</h3>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Try clearing search keywords.</p>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setSearchQuery('')}
            style={{ marginTop: '1rem' }}
          >
            Clear Search
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {paginatedSpecialties.map((sp) => (
            <div
              key={sp.id}
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              }}
            >
              {/* Image Banner with High Contrast Text */}
              <div style={{ position: 'relative', height: 140, background: '#0b131b' }}>
                <img
                  src={sp.imageUrl}
                  alt={sp.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.2) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1rem',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      alignSelf: 'flex-start',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#34d399',
                      letterSpacing: '0.04em',
                      marginBottom: '2px',
                    }}
                  >
                    {sp.name_fr || 'Specialty'}
                  </span>
                  <h3
                    style={{
                      color: '#ffffff !important' as any,
                      fontWeight: 800,
                      fontSize: '1.15rem',
                      margin: 0,
                      textShadow: '0 2px 4px rgba(0,0,0,0.85)',
                    }}
                  >
                    {sp.name}
                  </h3>
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {sp.shortDescription}
                </p>

                {/* Key Procedures Preview */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Key Procedures ({sp.procedures.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {sp.procedures.slice(0, 3).map((proc) => (
                      <div key={proc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span>{proc.name}</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                          {formatCostRange(proc.estimatedCostUSD.min, proc.estimatedCostUSD.max)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dual Action Buttons: View & Edit */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewClick(sp)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEditClick(sp)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── COMPACT LIST VIEW ─── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {paginatedSpecialties.map((sp) => (
            <div
              key={sp.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.25rem',
                flexWrap: 'wrap',
                boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 280, flex: 2 }}>
                <img
                  src={sp.imageUrl}
                  alt={sp.name}
                  style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{sp.name}</h3>
                    {sp.name_fr && (
                      <span className="badge badge-secondary" style={{ fontSize: '0.65rem' }}>{sp.name_fr}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {sp.shortDescription.length > 80 ? `${sp.shortDescription.slice(0, 80)}...` : sp.shortDescription}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1.5, justifyContent: 'space-around' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{sp.procedures.length}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Procedures</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    {sp.procedures[0] ? formatCostRange(sp.procedures[0].estimatedCostUSD.min, sp.procedures[0].estimatedCostUSD.max) : 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>From (USD)</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleViewClick(sp)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Eye size={14} /> View
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleEditClick(sp)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Edit3 size={14} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── PAGINATION BAR ────────────────────────────────────────────────── */}
      {filteredSpecialties.length > 0 && (
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
            Showing <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, filteredSpecialties.length)}</strong> to{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredSpecialties.length)}</strong> of{' '}
            <strong>{filteredSpecialties.length}</strong> specialties
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

      {/* ─── VIEW SPECIALTY MODAL ──────────────────────────────────────────── */}
      {viewingSpecialty && (
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
          }}>
            {/* Modal Image Banner */}
            <div style={{ position: 'relative', height: 180, background: '#0b131b' }}>
              <img
                src={viewingSpecialty.imageUrl}
                alt={viewingSpecialty.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 100%)',
              }} />
              <button
                onClick={() => setViewingSpecialty(null)}
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
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {viewingSpecialty.name}
                </h2>
                <div style={{ color: '#cbd5e1', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  🇫🇷 {viewingSpecialty.name_fr} · 🇲🇺 {viewingSpecialty.name_kr}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Overview & Description
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {viewingSpecialty.description || viewingSpecialty.shortDescription}
                </p>
              </div>

              {/* Procedures & Price Catalog */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Procedures & Pricing Catalog ({viewingSpecialty.procedures.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {viewingSpecialty.procedures.map((proc) => (
                    <div
                      key={proc.id}
                      style={{
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.875rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.95rem' }}>{proc.name}</strong>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.9rem' }}>
                          {formatCostRange(proc.estimatedCostUSD.min, proc.estimatedCostUSD.max)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        <span>Est. Duration: {proc.estimatedDurationDays || 3} days</span>
                        <span>Approx. {formatCostMur(proc.estimatedCostUSD.min)} – {formatCostMur(proc.estimatedCostUSD.max)}</span>
                      </div>
                      {proc.description && (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                          {proc.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setViewingSpecialty(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleEditClick(viewingSpecialty)}
                >
                  <Edit3 size={16} /> Edit Specialty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT SPECIALTY MODAL ──────────────────────────────────────────── */}
      {editingSpecialty && (
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
              maxWidth: 700,
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Medical Specialty</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                  {editingSpecialty.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingSpecialty(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Name (EN) *</label>
                  <input
                    className="form-input"
                    value={editingSpecialty.name}
                    onChange={(e) => setEditingSpecialty({ ...editingSpecialty, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Name (FR)</label>
                  <input
                    className="form-input"
                    value={editingSpecialty.name_fr || ''}
                    onChange={(e) => setEditingSpecialty({ ...editingSpecialty, name_fr: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Name (KR)</label>
                  <input
                    className="form-input"
                    value={editingSpecialty.name_kr || ''}
                    onChange={(e) => setEditingSpecialty({ ...editingSpecialty, name_kr: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <ImageField
                  label="Specialty Cover Image"
                  value={editingSpecialty.imageUrl}
                  onChange={(url) => setEditingSpecialty({ ...editingSpecialty, imageUrl: url })}
                  category="specialties"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary *</label>
                <input
                  className="form-input"
                  value={editingSpecialty.shortDescription}
                  onChange={(e) => setEditingSpecialty({ ...editingSpecialty, shortDescription: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Clinical Description *</label>
                <textarea
                  className="form-textarea"
                  value={editingSpecialty.description}
                  onChange={(e) => setEditingSpecialty({ ...editingSpecialty, description: e.target.value })}
                  style={{ minHeight: 90 }}
                  required
                />
              </div>

              {/* Procedures Section */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Procedures & Estimated Cost</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {editingSpecialty.procedures.map((proc, index) => (
                    <div
                      key={proc.id}
                      style={{
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Procedure Name</label>
                          <input
                            className="form-input"
                            value={proc.name}
                            onChange={(e) => handleProcedureChange(index, 'name', e.target.value)}
                            style={{ marginTop: 4 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Min USD ($)</label>
                          <input
                            type="number"
                            className="form-input"
                            value={proc.estimatedCostUSD.min}
                            onChange={(e) => handleProcedureCostChange(index, 'min', parseInt(e.target.value) || 0)}
                            style={{ marginTop: 4 }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Max USD ($)</label>
                          <input
                            type="number"
                            className="form-input"
                            value={proc.estimatedCostUSD.max}
                            onChange={(e) => handleProcedureCostChange(index, 'max', parseInt(e.target.value) || 0)}
                            style={{ marginTop: 4 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                  onClick={() => setEditingSpecialty(null)}
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
