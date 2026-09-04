import React, { useState, useEffect } from 'react';
import { X, Check, Search, Save, RotateCcw, Building2, Stethoscope, CheckCircle2, Filter, UserCheck, Layers } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import type { Doctor, Hospital, Specialty } from '../../../core/types';

interface SpecialistAssociationMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const SpecialistAssociationMatrixModal: React.FC<SpecialistAssociationMatrixModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'specialties' | 'hospitals'>('specialties');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  // Local state for doctor-specialty links: doctorId -> Set<specialtyId>
  const [doctorSpecialties, setDoctorSpecialties] = useState<Record<string, Set<string>>>({});
  // Local state for doctor-hospitals link: doctorId -> Set<hospitalId> (MULTIPLE HOSPITALS)
  const [doctorHospitals, setDoctorHospitals] = useState<Record<string, Set<string>>>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filters
  const [searchDoc, setSearchDoc] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('all');
  const [searchSpec, setSearchSpec] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const [docList, hospList, specList] = await Promise.all([
        mockEngine.getDoctors(),
        mockEngine.getHospitals(),
        mockEngine.getSpecialties(),
      ]);
      setDoctors(docList);
      setHospitals(hospList);
      setSpecialties(specList);

      const specMap: Record<string, Set<string>> = {};
      const hospMap: Record<string, Set<string>> = {};

      docList.forEach((d) => {
        specMap[d.id] = new Set(d.specialties || []);
        const hIds = d.hospitalIds?.length ? d.hospitalIds : (d.hospitalId ? [d.hospitalId] : []);
        hospMap[d.id] = new Set(hIds);
      });

      setDoctorSpecialties(specMap);
      setDoctorHospitals(hospMap);
    } catch (e) {
      console.error('Failed to load doctor matrix data:', e);
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

  // Toggle Doctor <-> Specialty
  const toggleSpecialtyCell = (doctorId: string, specialtyId: string) => {
    setDoctorSpecialties((prev) => {
      const next = { ...prev };
      const currentSet = new Set(next[doctorId] || []);
      if (currentSet.has(specialtyId)) {
        currentSet.delete(specialtyId);
      } else {
        currentSet.add(specialtyId);
      }
      next[doctorId] = currentSet;
      return next;
    });
  };

  const toggleDoctorAllSpecialties = (doctorId: string, value: boolean) => {
    setDoctorSpecialties((prev) => {
      const next = { ...prev };
      if (value) {
        next[doctorId] = new Set(specialties.map((s) => s.id));
      } else {
        next[doctorId] = new Set();
      }
      return next;
    });
  };

  const toggleSpecialtyAllDoctors = (specialtyId: string, value: boolean) => {
    setDoctorSpecialties((prev) => {
      const next = { ...prev };
      doctors.forEach((d) => {
        const currentSet = new Set(next[d.id] || []);
        if (value) {
          currentSet.add(specialtyId);
        } else {
          currentSet.delete(specialtyId);
        }
        next[d.id] = currentSet;
      });
      return next;
    });
  };

  // Toggle Doctor <-> Hospital (Multi-hospital)
  const toggleHospitalCell = (doctorId: string, hospitalId: string) => {
    setDoctorHospitals((prev) => {
      const next = { ...prev };
      const currentSet = new Set(next[doctorId] || []);
      if (currentSet.has(hospitalId)) {
        currentSet.delete(hospitalId);
      } else {
        currentSet.add(hospitalId);
      }
      next[doctorId] = currentSet;
      return next;
    });
  };

  const toggleDoctorAllHospitals = (doctorId: string, value: boolean) => {
    setDoctorHospitals((prev) => {
      const next = { ...prev };
      if (value) {
        next[doctorId] = new Set(hospitals.map((h) => h.id));
      } else {
        next[doctorId] = new Set();
      }
      return next;
    });
  };

  const toggleHospitalAllDoctors = (hospitalId: string, value: boolean) => {
    setDoctorHospitals((prev) => {
      const next = { ...prev };
      doctors.forEach((d) => {
        const currentSet = new Set(next[d.id] || []);
        if (value) {
          currentSet.add(hospitalId);
        } else {
          currentSet.delete(hospitalId);
        }
        next[d.id] = currentSet;
      });
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const batchPayload = doctors.map((d) => {
        const hList = Array.from(doctorHospitals[d.id] || []);
        return {
          doctorId: d.id,
          hospitalId: hList[0] || '',
          hospitalIds: hList,
          specialtyIds: Array.from(doctorSpecialties[d.id] || []),
        };
      });

      await mockEngine.saveAllDoctorAssociations(batchPayload);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        if (onSaved) onSaved();
        onClose();
      }, 700);
    } catch (e) {
      console.error('Failed to save specialist associations:', e);
      alert('Failed to save associations. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    if (hospitalFilter !== 'all' && !doctorHospitals[d.id]?.has(hospitalFilter)) return false;
    if (searchDoc.trim()) {
      const q = searchDoc.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.title.toLowerCase().includes(q)
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

  const filteredHospitals = hospitals.filter((h) => {
    if (countryFilter !== 'all' && h.country !== countryFilter) return false;
    return true;
  });

  const countries = ['all', ...Array.from(new Set(hospitals.map((h) => h.country))).sort()];

  let totalSpecialtyLinks = 0;
  Object.values(doctorSpecialties).forEach((set) => {
    totalSpecialtyLinks += set.size;
  });

  let totalHospitalLinks = 0;
  Object.values(doctorHospitals).forEach((set) => {
    totalHospitalLinks += set.size;
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
              <UserCheck size={22} color="var(--color-primary)" />
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                Specialist Clinical Associations Hub
              </h2>
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Link surgeons and specialists to medical departments and multiple partner hospitals simultaneously.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                background: 'rgba(139, 92, 246, 0.12)',
                color: '#7c3aed',
                padding: '4px 12px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '0.8rem',
                border: '1px solid rgba(139, 92, 246, 0.25)',
              }}
            >
              {totalSpecialtyLinks} Specialty Links · {totalHospitalLinks} Hospital Links
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

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            padding: '0 1.75rem',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('specialties')}
            style={{
              padding: '0.85rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'specialties' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
              color: activeTab === 'specialties' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Stethoscope size={16} /> Specialists ⟷ Specialties Matrix
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hospitals')}
            style={{
              padding: '0.85rem 0.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'hospitals' ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
              color: activeTab === 'hospitals' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Building2 size={16} /> Specialists ⟷ Multi-Hospital Matrix
          </button>
        </div>

        {/* Filters Toolbar */}
        <div
          style={{
            padding: '0.85rem 1.75rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            background: 'var(--color-surface-2)',
          }}
        >
          {/* Doctor Search */}
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search specialists by name, role..."
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              style={{ width: '100%', paddingLeft: 30, fontSize: '0.82rem', height: 34 }}
            />
          </div>

          {activeTab === 'specialties' ? (
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
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={14} color="var(--color-text-muted)" />
              <select
                className="form-input"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                style={{ width: 150, fontSize: '0.82rem', height: 34 }}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Countries' : c}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button onClick={loadData} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1rem 1.75rem', position: 'relative' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              Loading Specialists Matrix...
            </div>
          ) : activeTab === 'specialties' ? (
            /* Tab 1: Specialists ⟷ Specialties Matrix */
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
                    Specialist ({filteredDoctors.length}) \ Specialty ({filteredSpecialties.length})
                  </th>

                  {filteredSpecialties.map((s) => {
                    let count = 0;
                    doctors.forEach((d) => {
                      if (doctorSpecialties[d.id]?.has(s.id)) count++;
                    });
                    const allSelected = doctors.length > 0 && count === doctors.length;

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
                            onClick={() => toggleSpecialtyAllDoctors(s.id, !allSelected)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '0.65rem',
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              padding: '1px 4px',
                              fontWeight: 700,
                            }}
                            title={allSelected ? 'Unlink from all specialists' : 'Link to all specialists'}
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
                {filteredDoctors.map((doc, rowIdx) => {
                  const linkedCount = doctorSpecialties[doc.id]?.size || 0;
                  const allSelected = specialties.length > 0 && linkedCount === specialties.length;
                  const hospCount = doctorHospitals[doc.id]?.size || 0;

                  return (
                    <tr
                      key={doc.id}
                      style={{
                        background: rowIdx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)',
                      }}
                    >
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <img
                              src={doc.imageUrl}
                              alt={doc.name}
                              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                              onError={(e) => { e.currentTarget.src = '/assets/banners/dr_wong_chiung_ing.jpg'; }}
                            />
                            <div>
                              <div style={{ color: 'var(--color-text)', fontSize: '0.85rem' }}>{doc.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                {hospCount} hospital(s) · {linkedCount} specs
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleDoctorAllSpecialties(doc.id, !allSelected)}
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
                      </td>

                      {filteredSpecialties.map((s) => {
                        const isChecked = !!doctorSpecialties[doc.id]?.has(s.id);
                        return (
                          <td
                            key={s.id}
                            onClick={() => toggleSpecialtyCell(doc.id, s.id)}
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
                              onChange={() => {}}
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
          ) : (
            /* Tab 2: Specialists ⟷ Multi-Hospital Matrix */
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
                    Specialist ({filteredDoctors.length}) \ Partner Hospital ({filteredHospitals.length})
                  </th>

                  {filteredHospitals.map((h) => {
                    let count = 0;
                    doctors.forEach((d) => {
                      if (doctorHospitals[d.id]?.has(h.id)) count++;
                    });
                    const allSelected = doctors.length > 0 && count === doctors.length;

                    return (
                      <th
                        key={h.id}
                        style={{
                          position: 'sticky',
                          top: 0,
                          zIndex: 20,
                          background: 'var(--color-surface-2)',
                          padding: '0.6rem 0.5rem',
                          textAlign: 'center',
                          borderBottom: '2px solid var(--color-border)',
                          borderRight: '1px solid var(--color-border)',
                          minWidth: 140,
                          maxWidth: 180,
                          fontWeight: 700,
                          color: 'var(--color-text)',
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={h.name}>
                          {h.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                          {h.city}, {h.country}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                          <span style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 600 }}>
                            {count} doctors
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleHospitalAllDoctors(h.id, !allSelected)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '0.65rem',
                              color: '#2563eb',
                              cursor: 'pointer',
                              padding: '1px 4px',
                              fontWeight: 700,
                            }}
                            title={allSelected ? 'Unlink all doctors' : 'Link all doctors'}
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
                {filteredDoctors.map((doc, rowIdx) => {
                  const linkedCount = doctorHospitals[doc.id]?.size || 0;
                  const allSelected = hospitals.length > 0 && linkedCount === hospitals.length;

                  return (
                    <tr
                      key={doc.id}
                      style={{
                        background: rowIdx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-2)',
                      }}
                    >
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <img
                              src={doc.imageUrl}
                              alt={doc.name}
                              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                              onError={(e) => { e.currentTarget.src = '/assets/banners/dr_wong_chiung_ing.jpg'; }}
                            />
                            <div>
                              <div style={{ color: 'var(--color-text)', fontSize: '0.85rem' }}>{doc.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                {linkedCount} hospital(s) practicing
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleDoctorAllHospitals(doc.id, !allSelected)}
                            style={{
                              background: 'none',
                              border: '1px solid var(--color-border)',
                              borderRadius: 4,
                              fontSize: '0.65rem',
                              color: '#2563eb',
                              cursor: 'pointer',
                              padding: '2px 5px',
                              fontWeight: 700,
                            }}
                            title={allSelected ? 'Unlink all hospitals' : 'Link all hospitals'}
                          >
                            {allSelected ? 'Clear' : 'All'}
                          </button>
                        </div>
                      </td>

                      {filteredHospitals.map((h) => {
                        const isChecked = !!doctorHospitals[doc.id]?.has(h.id);
                        return (
                          <td
                            key={h.id}
                            onClick={() => toggleHospitalCell(doc.id, h.id)}
                            style={{
                              padding: '0.5rem',
                              textAlign: 'center',
                              borderBottom: '1px solid var(--color-border)',
                              borderRight: '1px solid var(--color-border)',
                              cursor: 'pointer',
                              background: isChecked ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                              transition: 'background 0.15s ease',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              style={{
                                width: 18,
                                height: 18,
                                accentColor: '#2563eb',
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

        {/* Footer */}
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
            Showing <strong>{filteredDoctors.length}</strong> specialists across <strong>{specialties.length}</strong> specialties and <strong>{hospitals.length}</strong> partner hospitals
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn btn-outline btn-sm">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm" style={{ minWidth: 140 }}>
              {saving ? 'Saving...' : savedSuccess ? 'Saved!' : 'Save Specialist Associations'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
