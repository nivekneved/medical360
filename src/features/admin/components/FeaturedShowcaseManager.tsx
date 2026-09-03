import { useState, useEffect } from 'react';
import { Star, Building2, Stethoscope, UserCheck, BookOpen, Check, RefreshCw } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import type { Specialty, Hospital, Doctor, CaseStudy } from '../../../core/types';

interface FeaturedShowcaseManagerProps {
  initialType?: 'specialties' | 'hospitals' | 'doctors' | 'case-studies';
}

export function FeaturedShowcaseManager({ initialType = 'specialties' }: FeaturedShowcaseManagerProps) {
  const [activeTab, setActiveTab] = useState<'specialties' | 'hospitals' | 'doctors' | 'case-studies'>(initialType);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [hospitals, setHospitals]     = useState<Hospital[]>([]);
  const [doctors, setDoctors]         = useState<Doctor[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading]         = useState(true);
  const [updatingId, setUpdatingId]   = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [sp, ho, doc, cs] = await Promise.all([
        mockEngine.getSpecialties(),
        mockEngine.getHospitals(),
        mockEngine.getDoctors(),
        mockEngine.getCaseStudies(),
      ]);
      setSpecialties(sp);
      setHospitals(ho);
      setDoctors(doc);
      setCaseStudies(cs);
    } catch (e) {
      console.error('Failed to load showcase items:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const toggleSpecialtyFeatured = async (sp: Specialty) => {
    setUpdatingId(sp.id);
    try {
      const updated = { ...sp, featured: !sp.featured };
      await mockEngine.updateSpecialty(sp.id, updated);
      setSpecialties(prev => prev.map(item => item.id === sp.id ? updated : item));
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleHospitalFeatured = async (h: Hospital) => {
    setUpdatingId(h.id);
    try {
      const updated = { ...h, featured: !h.featured };
      await mockEngine.updateHospital(h.id, updated);
      setHospitals(prev => prev.map(item => item.id === h.id ? updated : item));
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleDoctorFeatured = async (d: Doctor) => {
    setUpdatingId(d.id);
    try {
      const updated = { ...d, featured: !d.featured };
      await mockEngine.updateDoctor(d.id, updated);
      setDoctors(prev => prev.map(item => item.id === d.id ? updated : item));
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleCaseStudyFeatured = async (cs: CaseStudy) => {
    setUpdatingId(cs.id);
    try {
      const updated = { ...cs, featured: !cs.featured };
      await mockEngine.updateCaseStudy(cs.id, updated);
      setCaseStudies(prev => prev.map(item => item.id === cs.id ? updated : item));
    } finally {
      setUpdatingId(null);
    }
  };

  const q = filterQuery.toLowerCase();

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: 'var(--radius-2xl)',
      padding: '1.5rem',
      marginBottom: '1.75rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.15rem' }}>
            <Star size={20} color="#f59e0b" fill="#f59e0b" />
            <span>Featured Showcase Manager — Select Items to Appear on Front</span>
          </div>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            Select which specialties, hospitals, doctors, and patient stories appear in the featured carousels and showcases on the front page.
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Filter by name..."
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
          className="form-input"
          style={{ width: 220, fontSize: '0.8125rem', height: 36 }}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', background: 'var(--color-surface-2)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
        {[
          { key: 'specialties', label: 'Medical Specialties', icon: Stethoscope, count: specialties.filter(s => s.featured).length, total: specialties.length },
          { key: 'hospitals', label: 'Partner Hospitals', icon: Building2, count: hospitals.filter(h => h.featured).length, total: hospitals.length },
          { key: 'doctors', label: 'Elite Specialists', icon: UserCheck, count: doctors.filter(d => d.featured).length, total: doctors.length },
          { key: 'case-studies', label: 'Patient Stories', icon: BookOpen, count: caseStudies.filter(c => c.featured).length, total: caseStudies.length },
        ].map(tab => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                flex: 1,
                minWidth: 160,
                padding: '8px 12px',
                borderRadius: 6,
                border: 'none',
                background: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
                color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: 999,
              }}>
                {tab.count} / {tab.total} on Front
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)' }}>
          <RefreshCw size={20} className="spin" style={{ margin: '0 auto 0.5rem' }} />
          <div>Loading items...</div>
        </div>
      ) : activeTab === 'specialties' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {specialties
            .filter(s => !q || s.name.toLowerCase().includes(q) || (s.name_fr && s.name_fr.toLowerCase().includes(q)))
            .map(sp => {
              const isUpdating = updatingId === sp.id;
              return (
                <div
                  key={sp.id}
                  onClick={() => toggleSpecialtyFeatured(sp)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1.5px solid ${sp.featured ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: sp.featured ? 'rgba(6, 95, 70, 0.05)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: `1.5px solid ${sp.featured ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: sp.featured ? 'var(--color-primary)' : 'transparent',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {sp.featured && <Check size={14} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: sp.featured ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {sp.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {sp.procedures.length} procedures
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: sp.featured ? 'rgba(6, 95, 70, 0.15)' : 'var(--color-surface-2)',
                    color: sp.featured ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}>
                    {isUpdating ? 'Saving...' : sp.featured ? '⭐ Featured' : 'Hidden'}
                  </span>
                </div>
              );
            })}
        </div>
      ) : activeTab === 'hospitals' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {hospitals
            .filter(h => !q || h.name.toLowerCase().includes(q) || h.country.toLowerCase().includes(q))
            .map(h => {
              const isUpdating = updatingId === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => toggleHospitalFeatured(h)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1.5px solid ${h.featured ? '#0284c7' : 'var(--color-border)'}`,
                    background: h.featured ? 'rgba(2, 132, 199, 0.05)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: `1.5px solid ${h.featured ? '#0284c7' : 'var(--color-border)'}`,
                      background: h.featured ? '#0284c7' : 'transparent',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {h.featured && <Check size={14} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: h.featured ? '#0284c7' : 'var(--color-text)' }}>
                        {h.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {h.city}, {h.country}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: h.featured ? 'rgba(2, 132, 199, 0.15)' : 'var(--color-surface-2)',
                    color: h.featured ? '#0284c7' : 'var(--color-text-muted)',
                  }}>
                    {isUpdating ? 'Saving...' : h.featured ? '⭐ Featured' : 'Hidden'}
                  </span>
                </div>
              );
            })}
        </div>
      ) : activeTab === 'doctors' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {doctors
            .filter(d => !q || d.name.toLowerCase().includes(q) || d.title.toLowerCase().includes(q))
            .map(d => {
              const isUpdating = updatingId === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => toggleDoctorFeatured(d)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1.5px solid ${d.featured ? '#4f46e5' : 'var(--color-border)'}`,
                    background: d.featured ? 'rgba(79, 70, 229, 0.05)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: `1.5px solid ${d.featured ? '#4f46e5' : 'var(--color-border)'}`,
                      background: d.featured ? '#4f46e5' : 'transparent',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {d.featured && <Check size={14} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: d.featured ? '#4f46e5' : 'var(--color-text)' }}>
                        {d.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {d.title}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: d.featured ? 'rgba(79, 70, 229, 0.15)' : 'var(--color-surface-2)',
                    color: d.featured ? '#4f46e5' : 'var(--color-text-muted)',
                  }}>
                    {isUpdating ? 'Saving...' : d.featured ? '⭐ Featured' : 'Hidden'}
                  </span>
                </div>
              );
            })}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {caseStudies
            .filter(c => !q || c.patientFirstName.toLowerCase().includes(q) || c.condition.toLowerCase().includes(q))
            .map(c => {
              const isUpdating = updatingId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => toggleCaseStudyFeatured(c)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-lg)',
                    border: `1.5px solid ${c.featured ? '#10b981' : 'var(--color-border)'}`,
                    background: c.featured ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: `1.5px solid ${c.featured ? '#10b981' : 'var(--color-border)'}`,
                      background: c.featured ? '#10b981' : 'transparent',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {c.featured && <Check size={14} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: c.featured ? '#10b981' : 'var(--color-text)' }}>
                        {c.patientFirstName} ({c.patientCountry})
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {c.condition}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: c.featured ? 'rgba(16, 185, 129, 0.15)' : 'var(--color-surface-2)',
                    color: c.featured ? '#10b981' : 'var(--color-text-muted)',
                  }}>
                    {isUpdating ? 'Saving...' : c.featured ? '⭐ Featured' : 'Hidden'}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
