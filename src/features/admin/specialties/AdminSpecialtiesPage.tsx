import { useState, useEffect } from 'react';
import { Stethoscope, Edit3, Eye, Plus, X, Save, CheckCircle2, DollarSign, Clock, FileText } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatCostRange, formatCostMur } from '../../../core/services/format.service';
import { ImageField } from '../components/ImageField';
import type { Specialty, Procedure } from '../../../core/types';

export function AdminSpecialtiesPage() {
  const [specialties, setSpecialties]           = useState<Specialty[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [viewingSpecialty, setViewingSpecialty] = useState<Specialty | null>(null);
  const [saving, setSaving]                     = useState(false);
  const [savedSuccess, setSavedSuccess]         = useState(false);

  function load() {
    mockEngine.getSpecialties().then(setSpecialties).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

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
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Medical Specialties Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage medical departments, procedures, multi-language descriptions, and estimated pricing.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {specialties.map((sp) => (
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
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.2) 100%)',
                }} />
                <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', right: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      margin: 0,
                      textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                    }}>
                      {sp.name}
                    </h3>
                    {sp.featured && (
                      <span style={{
                        background: '#059669',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        padding: '2px 8px',
                        borderRadius: 999,
                      }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#e2e8f0', marginTop: '0.2rem', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                    FR: {sp.name_fr || sp.name} · KR: {sp.name_kr || sp.name}
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {sp.shortDescription}
                </p>

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
