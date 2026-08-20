import { useState } from 'react';
import { Building2, Edit3, Eye, Plus, Star, MapPin, Shield, CheckCircle2, X, Users, Bed } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useHospitals } from '../../../hooks/useHospitals';
import { formatNumber } from '../../../core/services/format.service';
import { ImageField } from '../components/ImageField';
import type { Hospital } from '../../../core/types';

export function AdminHospitalsPage() {
  const { hospitals, loading, refetch } = useHospitals({});
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [viewingHospital, setViewingHospital] = useState<Hospital | null>(null);
  const [saving, setSaving]             = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Partner Hospitals Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage hospital profiles, bed counts, JCI/NABH accreditations, and medical facility descriptions.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {hospitals.map((hospital) => {
            const desc = hospital.description || hospital.description_fr || '';
            const accreditations = hospital.accreditations || [];

            return (
              <div
                key={hospital.id}
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
                <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', borderBottom: '1px solid var(--color-border)' }}>
                  <img
                    src={hospital.imageUrl}
                    alt={hospital.name}
                    style={{ width: 90, height: 90, borderRadius: 'var(--radius-lg)', objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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

                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {desc.length > 100 ? `${desc.slice(0, 100)}...` : desc}
                  </p>

                  {/* Dual Action Buttons: View Hospital & Edit */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleViewClick(hospital)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEditClick(hospital)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
