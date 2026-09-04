import React, { useState } from 'react';
import { Search, Check, Plus, X } from 'lucide-react';
import type { Specialty } from '../../../core/types';

interface SpecialtySelectorProps {
  specialties: Specialty[];
  selectedIds: string[];
  onChange: (newIds: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({
  specialties,
  selectedIds = [],
  onChange,
  label = 'Associated Medical Specialties',
  disabled = false,
}) => {
  const [search, setSearch] = useState('');

  const toggleSpecialty = (id: string) => {
    if (disabled) return;
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (disabled) return;
    onChange(specialties.map((s) => s.id));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const filtered = specialties.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.name_fr && s.name_fr.toLowerCase().includes(search.toLowerCase())) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', margin: 0 }}>
          {label} ({selectedIds.length}/{specialties.length} linked)
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

      {/* Quick Search */}
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
          placeholder="Filter specialties by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
          style={{ width: '100%', paddingLeft: 30, fontSize: '0.82rem', height: 34 }}
        />
      </div>

      {/* Selected Badges Summary */}
      {selectedIds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
          {selectedIds.map((id) => {
            const spec = specialties.find((s) => s.id === id);
            return (
              <span
                key={id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--color-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                {spec ? spec.name : id}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => toggleSpecialty(id)}
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

      {/* Grid of Checkbox Items */}
      <div
        style={{
          maxHeight: 200,
          overflowY: 'auto',
          border: '1.5px solid var(--color-border)',
          borderRadius: 8,
          background: 'var(--color-surface-2)',
          padding: '0.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.4rem',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            No matching specialties
          </div>
        ) : (
          filtered.map((s) => {
            const isChecked = selectedIds.includes(s.id);
            return (
              <label
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '6px 8px',
                  borderRadius: 6,
                  background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-surface)',
                  border: isChecked ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSpecialty(s.id)}
                  disabled={disabled}
                  style={{ width: 16, height: 16, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.name}
                  </div>
                  {s.procedures && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                      {s.procedures.length} procedures
                    </div>
                  )}
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
};
