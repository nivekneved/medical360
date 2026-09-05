import React, { useState, useEffect } from 'react';
import { Check, Search, Save, RotateCcw, Building2, Stethoscope, CheckCircle2, UserCheck, Layers } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { DoctorHospitalMatrixTable } from './DoctorHospitalMatrixTable';
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
  // Local state for doctor-hospitals link: doctorId -> Set<hospitalId>
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
        if (value) currentSet.add(specialtyId);
        else currentSet.delete(specialtyId);
        next[d.id] = currentSet;
      });
      return next;
    });
  };

  // Toggle Doctor <-> Hospital
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
        if (value) currentSet.add(hospitalId);
        else currentSet.delete(hospitalId);
        next[d.id] = currentSet;
      });
      return next;
    });
  };

  // Save All Changes
  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        doctors.map((d) => {
          const updatedSpecs = Array.from(doctorSpecialties[d.id] || []);
          const updatedHosps = Array.from(doctorHospitals[d.id] || []);
          return mockEngine.updateDoctor(d.id, {
            specialties: updatedSpecs,
            hospitalIds: updatedHosps,
            hospitalId: updatedHosps[0] || undefined,
          });
        })
      );
      setSavedSuccess(true);
      if (onSaved) onSaved();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save associations:', e);
      alert('Failed to save associations. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered lists
  const filteredDoctors = doctors.filter((d) => {
    const matchSearch =
      !searchDoc.trim() ||
      d.name.toLowerCase().includes(searchDoc.toLowerCase()) ||
      d.title.toLowerCase().includes(searchDoc.toLowerCase());

    const docHospIds = doctorHospitals[d.id] || new Set();
    const matchHospital =
      hospitalFilter === 'all' || docHospIds.has(hospitalFilter);

    return matchSearch && matchHospital;
  });

  const filteredSpecialties = specialties.filter((s) =>
    !searchSpec.trim() || s.name.toLowerCase().includes(searchSpec.toLowerCase())
  );

  const filteredHospitals = hospitals.filter((h) =>
    countryFilter === 'all' || h.country.toLowerCase() === countryFilter.toLowerCase()
  );

  const countries = Array.from(new Set(hospitals.map((h) => h.country))).filter(Boolean);

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 1440, margin: '0 auto', animation: 'fadeIn 0.2s ease-out' }}>
      {/* Sticky Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-surface)',
        padding: '1.25rem 1.75rem',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--color-border)',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <RotateCcw size={15} /> Back to Specialists
          </button>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              Doctor Affiliations & Capability Matrix
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Assign specialist privileges to partner hospitals and specialty clinical departments.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {savedSuccess && (
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={16} /> Saved!
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Save size={15} /> {saving ? 'Saving...' : 'Save Matrix'}
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'var(--color-surface)', padding: '0.5rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-border)', width: 'fit-content' }}>
        <button
          type="button"
          onClick={() => setActiveTab('specialties')}
          className={`btn btn-sm ${activeTab === 'specialties' ? 'btn-primary' : 'btn-outline'}`}
          style={{ border: 'none', fontWeight: 700 }}
        >
          <Stethoscope size={15} /> Doctor ⇄ Specialties Privileges
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hospitals')}
          className={`btn btn-sm ${activeTab === 'hospitals' ? 'btn-primary' : 'btn-outline'}`}
          style={{ border: 'none', fontWeight: 700 }}
        >
          <Building2 size={15} /> Doctor ⇄ Hospital Affiliations (Multiple)
        </button>
      </div>

      {/* Tab 1: Specialties Matrix */}
      {activeTab === 'specialties' && (
        <div style={{ overflowX: 'auto', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1.5px solid var(--color-border)' }}>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', minWidth: 220, position: 'sticky', left: 0, background: 'var(--color-surface-2)', zIndex: 2 }}>
                  Doctor / Specialist
                </th>
                {filteredSpecialties.map((spec) => {
                  const allChecked = filteredDoctors.length > 0 && filteredDoctors.every(d => doctorSpecialties[d.id]?.has(spec.id));
                  return (
                    <th key={spec.id} style={{ padding: '0.85rem 0.5rem', textAlign: 'center', minWidth: 130 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-text)', display: 'block', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={spec.name}>
                          {spec.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSpecialtyAllDoctors(spec.id, !allChecked)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '1px 6px', fontSize: '0.65rem' }}
                        >
                          {allChecked ? 'Uncheck All' : 'Check All'}
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc) => {
                const allChecked = filteredSpecialties.length > 0 && filteredSpecialties.every(s => doctorSpecialties[doc.id]?.has(s.id));
                const linkedCount = filteredSpecialties.filter(s => doctorSpecialties[doc.id]?.has(s.id)).length;

                return (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.85rem 1rem', position: 'sticky', left: 0, background: 'var(--color-surface)', zIndex: 1, borderRight: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{doc.name}</div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>{doc.title}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)', background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', padding: '1px 6px', borderRadius: 8 }}>
                            {linkedCount} spec.
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleDoctorAllSpecialties(doc.id, !allChecked)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.65rem', color: 'var(--color-text-muted)', textDecoration: 'underline' }}
                          >
                            {allChecked ? 'None' : 'All'}
                          </button>
                        </div>
                      </div>
                    </td>
                    {filteredSpecialties.map((spec) => {
                      const isLinked = doctorSpecialties[doc.id]?.has(spec.id);
                      return (
                        <td key={spec.id} style={{ padding: '0.5rem', textAlign: 'center', background: isLinked ? 'rgba(6, 95, 70, 0.04)' : 'transparent' }}>
                          <button
                            type="button"
                            onClick={() => toggleSpecialtyCell(doc.id, spec.id)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              border: isLinked ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                              background: isLinked ? 'var(--color-primary)' : 'transparent',
                              color: '#fff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.1s',
                            }}
                          >
                            {isLinked && <Check size={16} />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Hospitals Matrix */}
      {activeTab === 'hospitals' && (
        <DoctorHospitalMatrixTable
          filteredDoctors={filteredDoctors}
          filteredHospitals={filteredHospitals}
          doctorHospitals={doctorHospitals}
          onToggleCell={toggleHospitalCell}
          onToggleAllForDoctor={toggleDoctorAllHospitals}
          onToggleAllForHospital={toggleHospitalAllDoctors}
        />
      )}
    </div>
  );
};
