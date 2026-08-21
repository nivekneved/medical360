import { useState, useMemo } from 'react';
import { UserCheck, Edit3, Eye, Award, Globe, Building2, Save, X, CheckCircle2, DollarSign, Activity, LayoutGrid, List, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useDoctors } from '../../../hooks/useDoctors';
import { useHospitals } from '../../../hooks/useHospitals';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { ImageField } from '../components/ImageField';
import type { Doctor } from '../../../core/types';
import '../AdminToolbar.css';

export function AdminDoctorsPage() {
  const { doctors, loading, refetch } = useDoctors();
  const { hospitals }                 = useHospitals({});
  const { specialties }               = useSpecialties();
  const [viewMode, setViewMode]       = useState<'grid' | 'list'>('grid');
  
  // Search, Filters, Sorting, Pagination
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedHospital, setSelectedHospital]   = useState('all');
  const [sortBy, setSortBy]                     = useState<'name-asc' | 'name-desc' | 'surgeries-desc' | 'exp-desc' | 'fee-asc' | 'fee-desc'>('surgeries-desc');
  const [currentPage, setCurrentPage]           = useState(1);
  const [itemsPerPage, setItemsPerPage]         = useState(6);

  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [saving, setSaving]           = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const getHospitalName = (hId: string) => {
    const h = hospitals.find(item => item.id === hId);
    return h ? `${h.name} (${h.city}, ${h.country})` : hId;
  };

  const getSpecialtyName = (sId: string) => {
    const s = specialties.find(item => item.id === sId);
    return s ? s.name : sId;
  };

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSpecialty =
        selectedSpecialty === 'all' || doc.specialties.includes(selectedSpecialty);

      const matchHospital =
        selectedHospital === 'all' || doc.hospitalId === selectedHospital;

      return matchSearch && matchSpecialty && matchHospital;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'surgeries-desc') return b.surgeries - a.surgeries;
      if (sortBy === 'exp-desc') return b.experience - a.experience;
      if (sortBy === 'fee-asc') return a.consultationFeeUSD - b.consultationFeeUSD;
      if (sortBy === 'fee-desc') return b.consultationFeeUSD - a.consultationFeeUSD;
      return 0;
    });
  }, [doctors, searchQuery, selectedSpecialty, selectedHospital, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage) || 1;
  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDoctors.slice(start, start + itemsPerPage);
  }, [filteredDoctors, currentPage, itemsPerPage]);

  const handleEditClick = (doc: Doctor) => {
    setEditingDoctor(JSON.parse(JSON.stringify(doc)));
    setViewingDoctor(null);
    setSavedSuccess(false);
  };

  const handleViewClick = (doc: Doctor) => {
    setViewingDoctor(doc);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    setSaving(true);
    try {
      await mockEngine.updateDoctor(editingDoctor.id, editingDoctor);
      refetch();
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setEditingDoctor(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to save doctor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
            Ecosystem Policy: Exactly 7 Elite Specialists
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Medical Specialists Management</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Manage profiles, hospital affiliations, credentials, and consultation fees for the top surgeons.
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
              placeholder="Search doctors, bio, title..."
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

          {/* Hospital Filter */}
          <select
            className="admin-toolbar__select"
            value={selectedHospital}
            onChange={(e) => { setSelectedHospital(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Hospitals</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
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
              <option value="surgeries-desc">🏆 Most Surgeries</option>
              <option value="exp-desc">⚡ Most Experience</option>
              <option value="name-asc">🔤 Name (A-Z)</option>
              <option value="name-desc">🔤 Name (Z-A)</option>
              <option value="fee-asc">💵 Fee (Low-High)</option>
              <option value="fee-desc">💵 Fee (High-Low)</option>
            </select>
          </div>

          {/* Count Badge */}
          <div className="admin-toolbar__count-badge">
            <span className="admin-toolbar__count-num">{filteredDoctors.length}</span>
            <span className="admin-toolbar__count-unit">{filteredDoctors.length <= 1 ? 'médecin' : 'médecins'}</span>
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
          {(searchQuery || selectedSpecialty !== 'all' || selectedHospital !== 'all') && (
            <button
              className="admin-toolbar__reset-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setSelectedHospital('all');
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
            <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />
          ))}
        </div>
      ) : paginatedDoctors.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: 'var(--color-surface)',
          border: '1.5px dashed var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          color: 'var(--color-text-muted)',
        }}>
          <Search size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>No specialists match your search</h3>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Try clearing search keywords or adjusting your filters.</p>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { setSearchQuery(''); setSelectedSpecialty('all'); setSelectedHospital('all'); }}
            style={{ marginTop: '1rem' }}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {paginatedDoctors.map((doc) => (
            <div
              key={doc.id}
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
              <div style={{ display: 'flex', padding: '1.25rem', gap: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <img
                  src={doc.imageUrl}
                  alt={doc.name}
                  style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    {doc.specialties.map((sId) => (
                      <span key={sId} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                        {getSpecialtyName(sId)}
                      </span>
                    ))}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 2px 0' }}>{doc.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                    <Building2 size={12} style={{ display: 'inline', marginRight: 3 }} />
                    {getHospitalName(doc.hospitalId)}
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  {doc.bio}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'var(--color-surface-2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginTop: 'auto' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{doc.experience} yrs</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Experience</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{doc.surgeries.toLocaleString()}+</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Surgeries</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>${doc.consultationFeeUSD}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Online Fee</div>
                  </div>
                </div>

                {/* Dual Action Buttons: View Profile & Edit */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewClick(doc)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <Eye size={14} /> View Profile
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEditClick(doc)}
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
          {paginatedDoctors.map((doc) => (
            <div
              key={doc.id}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 260, flex: 2 }}>
                <img
                  src={doc.imageUrl}
                  alt={doc.name}
                  style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{doc.name}</h3>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                      {doc.specialties.map(getSpecialtyName).join(', ')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                    {doc.title} • <span style={{ color: 'var(--color-primary)' }}>{getHospitalName(doc.hospitalId)}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1.5, justifyContent: 'space-around' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{doc.experience} yrs</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Exp</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{doc.surgeries.toLocaleString()}+</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Surgeries</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>${doc.consultationFeeUSD}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Fee</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleViewClick(doc)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Eye size={14} /> View
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleEditClick(doc)}
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
      {filteredDoctors.length > 0 && (
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
            Showing <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, filteredDoctors.length)}</strong> to{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredDoctors.length)}</strong> of{' '}
            <strong>{filteredDoctors.length}</strong> specialists
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

      {/* ─── VIEW DOCTOR MODAL ─────────────────────────────────────────────── */}
      {viewingDoctor && (
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
            {/* Modal Header */}
            <div style={{ display: 'flex', padding: '1.5rem', gap: '1.25rem', borderBottom: '1px solid var(--color-border)', position: 'relative' }}>
              <img
                src={viewingDoctor.imageUrl}
                alt={viewingDoctor.name}
                style={{ width: 100, height: 100, borderRadius: 'var(--radius-xl)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  {viewingDoctor.specialties.map((sId) => (
                    <span key={sId} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {getSpecialtyName(sId)}
                    </span>
                  ))}
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>{viewingDoctor.name}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
                  {viewingDoctor.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.35rem' }}>
                  <Building2 size={14} style={{ display: 'inline', marginRight: 4 }} />
                  {getHospitalName(viewingDoctor.hospitalId)}
                </div>
              </div>
              <button
                onClick={() => setViewingDoctor(null)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Surgical Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{viewingDoctor.experience} Years</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Clinical Practice</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{viewingDoctor.surgeries.toLocaleString()}+</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Surgical Volume</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)' }}>${viewingDoctor.consultationFeeUSD}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Opinion Fee</div>
                </div>
              </div>

              {/* Biography */}
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Professional Biography
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.6 }}>
                  {viewingDoctor.bio}
                </p>
              </div>

              {/* Qualifications & Languages */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                    Qualifications
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {viewingDoctor.qualifications.join(', ')}
                  </div>
                </div>
                <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                    Languages Spoken
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {viewingDoctor.languages.join(', ')}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setViewingDoctor(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleEditClick(viewingDoctor)}
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT DOCTOR MODAL ─────────────────────────────────────────────── */}
      {editingDoctor && (
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
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Edit Specialist Profile</h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                  {editingDoctor.name} · {editingDoctor.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name & Title *</label>
                <input
                  className="form-input"
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Subtitle *</label>
                <input
                  className="form-input"
                  value={editingDoctor.title}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <ImageField
                  label="Doctor Headshot / Portrait"
                  value={editingDoctor.imageUrl}
                  onChange={(url) => setEditingDoctor({ ...editingDoctor, imageUrl: url })}
                  category="doctors"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Hospital Affiliation *</label>
                <select
                  className="form-select"
                  value={editingDoctor.hospitalId}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, hospitalId: e.target.value })}
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>{h.name} ({h.city}, {h.country})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Experience (Years) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingDoctor.experience}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Surgeries Count *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingDoctor.surgeries}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, surgeries: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee ($) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingDoctor.consultationFeeUSD}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, consultationFeeUSD: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Doctor Bio & Surgical Track Record *</label>
                <textarea
                  className="form-textarea"
                  value={editingDoctor.bio}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                  style={{ minHeight: 90 }}
                  required
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
                  onClick={() => setEditingDoctor(null)}
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
