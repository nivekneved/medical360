import { useState, useEffect } from 'react';
import { Stethoscope, Edit3, Plus, X, Save, CheckCircle2, DollarSign } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatCostRange } from '../../../core/services/format.service';
import { ImageField } from '../components/ImageField';
import type { Specialty, Procedure } from '../../../core/types';

export function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading]         = useState(true);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [saving, setSaving]           = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  function load() {
    mockEngine.getSpecialties().then(setSpecialties).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const handleEditClick = (sp: Specialty) => {
    setEditingSpecialty(JSON.parse(JSON.stringify(sp)));
    setSavedSuccess(false);
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
              <div style={{ position: 'relative', height: 120 }}>
                <img
                  src={sp.imageUrl}
                  alt={sp.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                }} />
                <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', right: '1rem', color: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sp.name}</h3>
                    {sp.featured && <span className="badge badge-accent" style={{ fontSize: '0.65rem' }}>Featured</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
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

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleEditClick(sp)}
                  style={{ marginTop: 'auto', width: '100%' }}
                >
                  <Edit3 size={14} /> Edit Specialty & Costs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingSpecialty && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            maxWidth: 760,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  Edit Specialty: {editingSpecialty.name}
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>ID: {editingSpecialty.id}</span>
              </div>
              <button
                className="btn btn-icon btn-outline btn-sm"
                onClick={() => setEditingSpecialty(null)}
              >
                <X size={18} />
              </button>
            </div>

            {savedSuccess && (
              <div style={{
                background: 'rgba(22, 163, 74, 0.12)',
                color: '#16a34a',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 600,
              }}>
                <CheckCircle2 size={16} /> Saved successfully!
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Names in 3 languages */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">🇬🇧 Name (English)</label>
                  <input
                    className="form-input"
                    value={editingSpecialty.name}
                    onChange={(e) => setEditingSpecialty({ ...editingSpecialty, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🇫🇷 Name (French)</label>
                  <input
                    className="form-input"
                    value={editingSpecialty.name_fr || ''}
                    onChange={(e) => setEditingSpecialty({ ...editingSpecialty, name_fr: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🇲🇺 Name (Kreol)</label>
                  <input
                    className="form-input"
                    value={editingSpecialty.name_kr || ''}
                    onChange={(e) => setEditingSpecialty({ ...editingSpecialty, name_kr: e.target.value })}
                  />
                </div>
              </div>

              {/* Image Selection & URL */}
              <ImageField
                label="Specialty Banner Image"
                value={editingSpecialty.imageUrl}
                onChange={(url) => setEditingSpecialty({ ...editingSpecialty, imageUrl: url })}
                required
              />

              {/* Short Descriptions in 3 languages */}
              <div className="form-group">
                <label className="form-label">🇬🇧 Short Description (English)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={editingSpecialty.shortDescription}
                  onChange={(e) => setEditingSpecialty({ ...editingSpecialty, shortDescription: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">🇫🇷 Description (French)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={editingSpecialty.shortDescription_fr || ''}
                  onChange={(e) => setEditingSpecialty({ ...editingSpecialty, shortDescription_fr: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">🇲🇺 Description (Kreol)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={editingSpecialty.shortDescription_kr || ''}
                  onChange={(e) => setEditingSpecialty({ ...editingSpecialty, shortDescription_kr: e.target.value })}
                />
              </div>

              {/* Procedures & Pricing */}
              <div style={{ borderTop: '1.5px solid var(--color-border)', paddingTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Procedures & Pricing Estimates (USD)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {editingSpecialty.procedures.map((proc, pIdx) => (
                    <div
                      key={proc.id || pIdx}
                      style={{
                        background: 'rgba(0,0,0,0.02)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1rem',
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr 1fr',
                        gap: '0.75rem',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Procedure Name</label>
                        <input
                          className="form-input"
                          value={proc.name}
                          onChange={(e) => handleProcedureChange(pIdx, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Min Cost (USD)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={proc.estimatedCostUSD.min}
                          onChange={(e) => handleProcedureCostChange(pIdx, 'min', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Max Cost (USD)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={proc.estimatedCostUSD.max}
                          onChange={(e) => handleProcedureCostChange(pIdx, 'max', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingSpecialty(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Specialty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
