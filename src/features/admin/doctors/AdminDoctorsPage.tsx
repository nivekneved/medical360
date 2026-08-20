import { useState, useEffect } from 'react';
import { UserCheck, Edit3, Award, Globe, Building2, Save, X, CheckCircle2, DollarSign } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useDoctors } from '../../../hooks/useDoctors';
import { useHospitals } from '../../../hooks/useHospitals';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { ImageField } from '../components/ImageField';
import type { Doctor } from '../../../core/types';

export function AdminDoctorsPage() {
  const { doctors, loading, refetch } = useDoctors();
  const { hospitals }                 = useHospitals({});
  const { specialties }               = useSpecialties();
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
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

  const handleEditClick = (doc: Doctor) => {
    setEditingDoctor(JSON.parse(JSON.stringify(doc)));
    setSavedSuccess(false);
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
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
              Ecosystem Policy: Exactly 7 Elite Specialists
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Medical Specialists Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage profiles, hospital affiliations, credentials, and consultation fees for the 7 top surgeons.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 260, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {doctors.map((doc) => (
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
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{doc.name}</h3>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginTop: 'auto' }}>
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

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleEditClick(doc)}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  <Edit3 size={14} /> Edit Specialist Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingDoctor && (
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
            maxWidth: 720,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                  Edit Doctor Profile
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>ID: {editingDoctor.id}</span>
              </div>
              <button
                className="btn btn-icon btn-outline btn-sm"
                onClick={() => setEditingDoctor(null)}
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
                <CheckCircle2 size={16} /> Doctor saved successfully!
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Doctor Full Name</label>
                  <input
                    className="form-input"
                    value={editingDoctor.name}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Affiliated Hospital</label>
                  <select
                    className="form-select"
                    value={editingDoctor.hospitalId}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, hospitalId: e.target.value })}
                  >
                    {hospitals.map(h => (
                      <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Professional Title / Position</label>
                <input
                  className="form-input"
                  value={editingDoctor.title}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, title: e.target.value })}
                  required
                />
              </div>

              <ImageField
                label="Doctor Profile Photo"
                value={editingDoctor.imageUrl}
                onChange={(url) => setEditingDoctor({ ...editingDoctor, imageUrl: url })}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingDoctor.experience}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, experience: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Surgeries Performed</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingDoctor.surgeries}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, surgeries: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Online Opinion Fee ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingDoctor.consultationFeeUSD}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, consultationFeeUSD: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Qualifications (Comma separated)</label>
                <input
                  className="form-input"
                  value={editingDoctor.qualifications.join(', ')}
                  onChange={(e) => setEditingDoctor({
                    ...editingDoctor,
                    qualifications: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Languages Spoken (Comma separated)</label>
                <input
                  className="form-input"
                  value={editingDoctor.languages.join(', ')}
                  onChange={(e) => setEditingDoctor({
                    ...editingDoctor,
                    languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biography & Clinical Focus</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={editingDoctor.bio}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingDoctor(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
