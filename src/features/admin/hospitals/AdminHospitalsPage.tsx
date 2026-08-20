import { useState, useEffect } from 'react';
import { Star, MapPin, Shield } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatNumber } from '../../../core/services/format.service';
import type { Hospital } from '../../../core/types';

export function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading]     = useState(true);

  function load() {
    mockEngine.getHospitals().then(setHospitals).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Partner Hospitals</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Manage accredited hospitals in the Medical 360 network.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
              }}
            >
              <img
                src={hospital.imageUrl}
                alt={hospital.name}
                style={{ width: 100, height: 100, borderRadius: 'var(--radius-lg)', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  {hospital.accreditations.map((acc) => (
                    <span key={acc} className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                      <Shield size={10} /> {acc}
                    </span>
                  ))}
                  {hospital.featured && (
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Featured</span>
                  )}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{hospital.name}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={12} /> {hospital.city}, {hospital.country}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', marginTop: 'auto' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <Star size={12} fill="#ffb400" color="#ffb400" /> {hospital.rating}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{formatNumber(hospital.bedsCount)} beds</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
