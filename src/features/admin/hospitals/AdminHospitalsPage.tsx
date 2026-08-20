import { useState, useEffect } from 'react';
import { Star, MapPin, Shield, Edit3, X, Save, CheckCircle2 } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatNumber } from '../../../core/services/format.service';
import { ImageField } from '../components/ImageField';
import type { Hospital } from '../../../core/types';

export function AdminHospitalsPage() {
  const [hospitals, setHospitals]             = useState<Hospital[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [saving, setSaving]                   = useState(false);
  const [savedSuccess, setSavedSuccess]       = useState(false);

  function load() {
    mockEngine.getHospitals().then(setHospitals).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const handleEditClick = (h: Hospital) => {
    setEditingHospital(JSON.parse(JSON.stringify(h)));
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHospital) return;
    setSaving(true);
    try {
      await mockEngine.updateHospital(editingHospital.id, editingHospital);
      load();
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Partner Hospitals Management</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage accredited hospitals in the Medical 360 international network, accreditation badges, and specs.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
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
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{hospital.name}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
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

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEditClick(hospital)}
                    style={{ width: '100%', marginTop: 'auto' }}
                  >
                    <Edit3 size={14} /> Edit Hospital Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingHospital && (
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
                  Edit Hospital: {editingHospital.name}
                </h2>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>ID: {editingHospital.id}</span>
              </div>
              <button
                className="btn btn-icon btn-outline btn-sm"
                onClick={() => setEditingHospital(null)}
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
                <CheckCircle2 size={16} /> Hospital saved successfully!
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input
                  className="form-input"
                  value={editingHospital.name || ''}
                  onChange={(e) => setEditingHospital({ ...editingHospital, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    className="form-input"
                    value={editingHospital.city || ''}
                    onChange={(e) => setEditingHospital({ ...editingHospital, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    className="form-input"
                    value={editingHospital.country || ''}
                    onChange={(e) => setEditingHospital({ ...editingHospital, country: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Bed Count</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingHospital.bedsCount || 0}
                    onChange={(e) => setEditingHospital({ ...editingHospital, bedsCount: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rating (e.g. 4.9)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={editingHospital.rating || 0}
                    onChange={(e) => setEditingHospital({ ...editingHospital, rating: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Founded Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingHospital.foundedYear || 2000}
                    onChange={(e) => setEditingHospital({ ...editingHospital, foundedYear: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <ImageField
                label="Hospital Main Image"
                value={editingHospital.imageUrl || ''}
                onChange={(url) => setEditingHospital({ ...editingHospital, imageUrl: url })}
                required
              />

              <div className="form-group">
                <label className="form-label">Accreditations (Comma separated: JCI, NABH, ISO, etc.)</label>
                <input
                  className="form-input"
                  value={(editingHospital.accreditations || []).join(', ')}
                  onChange={(e) => setEditingHospital({
                    ...editingHospital,
                    accreditations: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (English)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editingHospital.description || ''}
                  onChange={(e) => setEditingHospital({ ...editingHospital, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (French)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editingHospital.description_fr || ''}
                  onChange={(e) => setEditingHospital({ ...editingHospital, description_fr: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Kreol)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editingHospital.description_kr || ''}
                  onChange={(e) => setEditingHospital({ ...editingHospital, description_kr: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingHospital(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Hospital'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
