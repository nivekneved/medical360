import { useState } from 'react';
import { Edit3, Eye, X, CheckCircle2, User, Building2, Stethoscope, DollarSign, Quote } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useCaseStudies } from '../../../hooks/useCaseStudies';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { useHospitals } from '../../../hooks/useHospitals';
import { ImageField } from '../components/ImageField';
import type { CaseStudy } from '../../../core/types';

export function AdminCaseStudiesPage() {
  const { caseStudies, loading, refetch } = useCaseStudies();
  const { specialties }                   = useSpecialties();
  const { hospitals }                     = useHospitals({});
  const [editingCase, setEditingCase]     = useState<CaseStudy | null>(null);
  const [viewingCase, setViewingCase]     = useState<CaseStudy | null>(null);
  const [saving, setSaving]               = useState(false);
  const [savedSuccess, setSavedSuccess]   = useState(false);

  const getSpecialtyName = (sId: string) => {
    const s = specialties.find(item => item.id === sId);
    return s ? s.name : sId;
  };

  const getHospitalName = (hId: string) => {
    const h = hospitals.find(item => item.id === hId);
    return h ? h.name : hId;
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
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Patient Success Stories & Testimonials</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage verified Mauritian patient outcomes, cost savings statistics, and multilingual testimonials.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
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
              {/* Image Banner with High Contrast Overlay */}
              <div style={{ position: 'relative', height: 160, background: '#0b131b' }}>
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
                
                {/* Cost Saved Badge */}
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                  <span style={{
                    background: '#059669',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    borderRadius: 999,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    display: 'inline-block'
                  }}>
                    Saved {cs.costSavedPercent}%
                  </span>
                </div>

                {/* Patient Name & Condition Overlay */}
                <div style={{ position: 'absolute', bottom: '0.85rem', left: '1rem', right: '1rem' }}>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    margin: 0,
                    textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                    letterSpacing: '-0.01em',
                  }}>
                    {cs.patientFirstName}, {cs.patientAge} ({cs.patientCountry})
                  </h3>
                  <div style={{
                    fontSize: '0.78rem',
                    color: '#e2e8f0',
                    marginTop: '0.2rem',
                    textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                    fontWeight: 500,
                  }}>
                    {cs.condition} · {getSpecialtyName(cs.specialtyId)}
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

                {/* Dual Action Buttons: View & Edit */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleViewClick(cs)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                  >
                    <Eye size={14} /> View Story
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEditClick(cs)}
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
