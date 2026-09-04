import React, { useState } from 'react';
import { Search, UserCheck, X, Stethoscope, Building2 } from 'lucide-react';
import type { Doctor, Hospital, Specialty } from '../../../core/types';

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedIds: string[];
  onChange: (newIds: string[]) => void;
  hospitals?: Hospital[];
  specialties?: Specialty[];
  label?: string;
  disabled?: boolean;
}

export const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctors,
  selectedIds = [],
  onChange,
  hospitals = [],
  specialties = [],
  label = 'Associated Medical Specialists / Doctors',
  disabled = false,
}) => {
  const [search, setSearch] = useState('');

  const toggleDoctor = (id: string) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((d) => d !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (disabled) return;
    onChange(doctors.map((d) => d.id));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();
    const hosp = hospitals.find((h) => h.id === d.hospitalId);
    return (
      d.name.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      (hosp && hosp.name.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', margin: 0 }}>
          {label} ({selectedIds.length}/{doctors.length} linked)
        </label>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={selectAll}
            disabled={disabled}
            className="btn btn-outline btn-xs"
            style={{ fontSize: '0.72rem', padding: '2px 8px' }}
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="btn btn-outline btn-xs"
            style={{ fontSize: '0.72rem', padding: '2px 8px' }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
          }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Search doctors by name, specialty, or hospital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
          style={{ width: '100%', paddingLeft: 30, fontSize: '0.82rem', height: 34 }}
        />
      </div>

      {/* Selected Pills */}
      {selectedIds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
          {selectedIds.map((id) => {
            const doc = doctors.find((d) => d.id === id);
            return (
              <span
                key={id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: 'rgba(139, 92, 246, 0.12)',
                  color: '#7c3aed',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                {doc ? doc.name : id}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => toggleDoctor(id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'inherit',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Doctor Cards Checkbox Grid */}
      <div
        style={{
          maxHeight: 220,
          overflowY: 'auto',
          border: '1.5px solid var(--color-border)',
          borderRadius: 8,
          background: 'var(--color-surface-2)',
          padding: '0.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '0.4rem',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            No matching doctors found
          </div>
        ) : (
          filtered.map((doc) => {
            const isChecked = selectedIds.includes(doc.id);
            const hosp = hospitals.find((h) => h.id === doc.hospitalId);

            return (
              <label
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '6px 8px',
                  borderRadius: 6,
                  background: isChecked ? 'rgba(139, 92, 246, 0.08)' : 'var(--color-surface)',
                  border: isChecked ? '1px solid #8b5cf6' : '1px solid var(--color-border)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDoctor(doc.id)}
                  disabled={disabled}
                  style={{ width: 16, height: 16, accentColor: '#8b5cf6', cursor: 'pointer' }}
                />
                <img
                  src={doc.imageUrl}
                  alt={doc.name}
                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = '/assets/banners/dr_wong_chiung_ing.jpg'; }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {hosp ? hosp.name : doc.title}
                  </div>
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
};
