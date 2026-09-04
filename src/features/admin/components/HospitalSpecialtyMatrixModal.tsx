import React, { useState, useEffect } from 'react';
import { X, Check, Search, Save, RotateCcw, Building2, Stethoscope, CheckCircle2, Filter } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import type { Hospital, Specialty } from '../../../core/types';

interface HospitalSpecialtyMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const HospitalSpecialtyMatrixModal: React.FC<HospitalSpecialtyMatrixModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [matrix, setMatrix] = useState<Record<string, Set<string>>>({});
  const [originalMatrix, setOriginalMatrix] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filters
  const [searchHosp, setSearchHosp] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [searchSpec, setSearchSpec] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [hospList, specList] = await Promise.all([
        mockEngine.getHospitals(),
        mockEngine.getSpecialties(),
      ]);
      setHospitals(hospList);
      setSpecialties(specList);

      const mapping: Record<string, Set<string>> = {};
      hospList.forEach((h) => {
        mapping[h.id] = new Set(h.specialties || []);
      });
      setMatrix(mapping);
      setOriginalMatrix(JSON.parse(JSON.stringify(
        Object.fromEntries(Object.entries(mapping).map(([k, v]) => [k, Array.from(v)]))
      )));
    } catch (e) {
      console.error('Failed to load matrix data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleCell = (hospitalId: string, specialtyId: string) => {
    setMatrix((prev) => {
      const next = { ...prev };
      const currentSet = new Set(next[hospitalId] || []);
      if (currentSet.has(specialtyId)) {
        currentSet.delete(specialtyId);
      } else {
        currentSet.add(specialtyId);
      }
      next[hospitalId] = currentSet;
      return next;
    });
  };

  const toggleRowAll = (hospitalId: string, value: boolean) => {
    setMatrix((prev) => {
      const next = { ...prev };
      if (value) {
        next[hospitalId] = new Set(specialties.map((s) => s.id));
      } else {
        next[hospitalId] = new Set();
      }
      return next;
    });
  };

  const toggleColumnAll = (specialtyId: string, value: boolean) => {
    setMatrix((prev) => {
      const next = { ...prev };
      hospitals.forEach((h) => {
        const currentSet = new Set(next[h.id] || []);
        if (value) {
          currentSet.add(specialtyId);
        } else {
          currentSet.delete(specialtyId);
        }
        next[h.id] = currentSet;
      });
      return next;
    });
  };

  const resetChanges = () => {
    const mapping: Record<string, Set<string>> = {};
    Object.entries(originalMatrix).forEach(([k, v]) => {
      mapping[k] = new Set(v as string[]);
    });
    setMatrix(mapping);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Record<string, string[]> = {};
      Object.entries(matrix).forEach(([hospId, specSet]) => {
        updates[hospId] = Array.from(specSet);
      });
      await mockEngine.saveAllHospitalSpecialtyAssociations(updates);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        if (onSaved) onSaved();
        onClose();
      }, 700);
    } catch (e) {
      console.error('Failed to save associations:', e);
      alert('Failed to save associations. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const countries = ['all', ...Array.from(new Set(hospitals.map((h) => h.country))).sort()];

  const filteredHospitals = hospitals.filter((h) => {
    if (countryFilter !== 'all' && h.country !== countryFilter) return false;
    if (searchHosp.trim()) {
      const q = searchHosp.toLowerCase();
      return (
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredSpecialties = specialties.filter((s) => {
    if (searchSpec.trim()) {
      const q = searchSpec.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.name_fr && s.name_fr.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate total links
  let totalLinks = 0;
  Object.values(matrix).forEach((set) => {
    totalLinks += set.size;
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          width: '98vw',
          maxWidth: 1300,
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
          border: '1.5px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface-2)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Building2 size={22} color="var(--color-primary)" />
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Hospital & Specialty Associations Matrix
              </h2>
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Manage multi-specialty clinical affiliations. Check or uncheck to link hospitals directly to medical disciplines.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--color-primary)',
                padding: '4px 12px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.8rem',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              {totalLinks} Active Links
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                padding: '4px',
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div
          style={{
            padding: '0.85rem 1.75rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            background: 'var(--color-surface)',
          }}
        >
          {/* Hospital Search */}
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search hospitals..."
              value={searchHosp}
              onChange={(e) => setSearchHosp(e.target.value)}
              style={{ width: '100%', paddingLeft: 30, fontSize: '0.82rem', height: 34 }}
            />
          </div>

          {/* Country Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={14} color="var(--color-text-muted)" />
            <select
              className="form-input"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              style={{ width: 140, fontSize: '0.82rem', height: 34 }}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Countries' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search specialties..."
              value={searchSpec}
              onChange={(e) => setSearchSpec(e.target.value)}
              style={{ width: '100%', paddingLeft: 30, fontSize: '0.82rem', height: 34 }}
            />
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button onClick={resetChanges} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <RotateCcw size={14} /> Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 120 }}
            >
              {saving ? 'Saving...' : savedSuccess ? (
                <>
                  <CheckCircle2 size={15} /> Saved!
                </>
              ) : (
                <>
                  <Save size={15} /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Matrix Grid Container */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem 1.75rem', position: 'relative' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              Loading Hospital-Specialty Associations...
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                fontSize: '0.8125rem',
              }}
            >
              <thead>
                <tr>
                  {/* Sticky Top-Left Corner */}
                  <th
                    style={{
                      position: 'sticky',
                      top: 0,
                      left: 0,
                      zIndex: 30,
                      background: 'var(--color-surface-2)',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      fontWeight: 800,
                      borderBottom: '2px solid var(--color-border)',
                      borderRight: '2px solid var(--color-border)',
                      minWidth: 260,
                      color: 'var(--color-text)',
                    }}
                  >
                    Hospital ({filteredHospitals.length}) \ Specialty ({filteredSpecialties.length})
                  </th>

                  {/* Specialty Column Headers */}
                  {filteredSpecialties.map((s) => {
                    // Count hospitals offering this specialty
                    let count = 0;
                    hospitals.forEach((h) => {
                      if (matrix[h.id]?.has(s.id)) count++;
                    });
                    const allSelected = hospitals.length > 0 && count === hospitals.length;

                    return (
                      <th
                        key={s.id}
                        style={{
                          position: 'sticky',
                          top: 0,
                          zIndex: 20,
                          background: 'var(--color-surface-2)',
                          padding: '0.6rem 0.5rem',
                          textAlign: 'center',
                          borderBottom: '2px solid var(--color-border)',
                          borderRight: '1px solid var(--color-border)',
                          minWidth: 120,
                          maxWidth: 150,
                          fontWeight: 700,
                          color: 'var(--color-text)',
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.name}>
                          {s.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                            {count} linked
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleColumnAll(s.id, !allSelected)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '0.65rem',
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              padding: '1px 4px',
                              fontWeight: 700,
                            }}
                            title={allSelected ? 'Unlink from all hospitals' : 'Link to all hospitals'}
                          >
                            {allSelected ? 'Clear' : 'All'}
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.map((h, rowIdx) => {
                  const linkedCount = matrix[h.id]?.size || 0;
                  const allSelected = specialties.length > 0 && linkedCount === specialties.length;

                  return (
                    <tr
                      key={h.id}
                      style={{
                        background: rowIdx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)',
                      }}
                    >
                      {/* Sticky Left Hospital Name Cell */}
                      <td
                        style={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 10,
                          background: rowIdx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)',
                          padding: '0.65rem 1rem',
                          borderBottom: '1px solid var(--color-border)',
                          borderRight: '2px solid var(--color-border)',
                          fontWeight: 700,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div>
                            <div style={{ color: 'var(--color-text)', fontSize: '0.85rem' }}>{h.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                              {h.city}, {h.country} · {linkedCount} specialties
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 2 }}>
                            <button
                              type="button"
                              onClick={() => toggleRowAll(h.id, !allSelected)}
                              style={{
                                background: 'none',
                                border: '1px solid var(--color-border)',
                                borderRadius: 4,
                                fontSize: '0.65rem',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                padding: '2px 5px',
                                fontWeight: 700,
                              }}
                              title={allSelected ? 'Unlink all specialties' : 'Link all specialties'}
                            >
                              {allSelected ? 'Clear' : 'All'}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Checkbox Cells for each Specialty */}
                      {filteredSpecialties.map((s) => {
                        const isChecked = !!matrix[h.id]?.has(s.id);
                        return (
                          <td
                            key={s.id}
                            onClick={() => toggleCell(h.id, s.id)}
                            style={{
                              padding: '0.5rem',
                              textAlign: 'center',
                              borderBottom: '1px solid var(--color-border)',
                              borderRight: '1px solid var(--color-border)',
                              cursor: 'pointer',
                              background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                              transition: 'background 0.15s ease',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // Handled by td onClick
                              style={{
                                width: 18,
                                height: 18,
                                accentColor: 'var(--color-primary)',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Summary */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface-2)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Showing <strong>{filteredHospitals.length}</strong> hospitals × <strong>{filteredSpecialties.length}</strong> specialties
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm" style={{ minWidth: 140 }}>
              {saving ? 'Saving...' : savedSuccess ? 'Saved!' : 'Save Associations Matrix'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
