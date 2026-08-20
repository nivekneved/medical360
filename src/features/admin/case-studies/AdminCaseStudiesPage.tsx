import { useState, useEffect } from 'react';
import { Star, Edit3, Save, X, CheckCircle2, User, Percent } from 'lucide-react';
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
    setSavedSuccess(false);
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
              <div style={{ position: 'relative', height: 140 }}>
                <img
                  src={cs.imageUrl}
                  alt={cs.patientFirstName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                }} />
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                  <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                    Saved {cs.costSavedPercent}%
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', right: '1rem', color: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {cs.patientFirstName}, {cs.patientAge} ({cs.patientCountry})
                  </h3>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
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
                  background: 'rgba(0,0,0,0.02)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontStyle: 'italic',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'auto',
                }}>
                  "{cs.testimonial.slice(0, 100)}..."
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleEditClick(cs)}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Edit3 size={14} /> Edit Story & Testimonial
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingCase && (
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
            maxWidth: 750,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  Edit Patient Case: {editingCase.patientFirstName}
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>ID: {editingCase.id}</span>
              </div>
              <button
                className="btn btn-icon btn-outline btn-sm"
                onClick={() => setEditingCase(null)}
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
                <CheckCircle2 size={16} /> Patient story saved successfully!
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Patient Name</label>
                  <input
                    className="form-input"
                    value={editingCase.patientFirstName}
                    onChange={(e) => setEditingCase({ ...editingCase, patientFirstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Patient Age</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingCase.patientAge}
                    onChange={(e) => setEditingCase({ ...editingCase, patientAge: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    className="form-input"
                    value={editingCase.patientCountry}
                    onChange={(e) => setEditingCase({ ...editingCase, patientCountry: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Specialty</label>
                  <select
                    className="form-select"
                    value={editingCase.specialtyId}
                    onChange={(e) => setEditingCase({ ...editingCase, specialtyId: e.target.value })}
                  >
                    {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Hospital</label>
                  <select
                    className="form-select"
                    value={editingCase.hospitalId}
                    onChange={(e) => setEditingCase({ ...editingCase, hospitalId: e.target.value })}
                  >
                    {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'flex-start' }}>
                <ImageField
                  label="Patient Photo"
                  value={editingCase.imageUrl}
                  onChange={(url) => setEditingCase({ ...editingCase, imageUrl: url })}
                  required
                />
                <div className="form-group" style={{ marginTop: '0.2rem' }}>
                  <label className="form-label">Cost Saved (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingCase.costSavedPercent}
                    onChange={(e) => setEditingCase({ ...editingCase, costSavedPercent: Number(e.target.value) })}
                    required
                    style={{ marginTop: '0.25rem' }}
                  />
                </div>
              </div>

              {/* Conditions in 3 languages */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">🇬🇧 Condition</label>
                  <input
                    className="form-input"
                    value={editingCase.condition}
                    onChange={(e) => setEditingCase({ ...editingCase, condition: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🇫🇷 Condition</label>
                  <input
                    className="form-input"
                    value={editingCase.condition_fr || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, condition_fr: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🇲🇺 Condition</label>
                  <input
                    className="form-input"
                    value={editingCase.condition_kr || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, condition_kr: e.target.value })}
                  />
                </div>
              </div>

              {/* Treatments in 3 languages */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">🇬🇧 Treatment</label>
                  <input
                    className="form-input"
                    value={editingCase.treatment}
                    onChange={(e) => setEditingCase({ ...editingCase, treatment: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🇫🇷 Treatment</label>
                  <input
                    className="form-input"
                    value={editingCase.treatment_fr || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, treatment_fr: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">🇲🇺 Treatment</label>
                  <input
                    className="form-input"
                    value={editingCase.treatment_kr || ''}
                    onChange={(e) => setEditingCase({ ...editingCase, treatment_kr: e.target.value })}
                  />
                </div>
              </div>

              {/* Testimonials */}
              <div className="form-group">
                <label className="form-label">🇬🇧 Testimonial (English)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editingCase.testimonial}
                  onChange={(e) => setEditingCase({ ...editingCase, testimonial: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">🇫🇷 Testimonial (French)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editingCase.testimonial_fr || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, testimonial_fr: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">🇲🇺 Testimonial (Kreol)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editingCase.testimonial_kr || ''}
                  onChange={(e) => setEditingCase({ ...editingCase, testimonial_kr: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingCase(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
