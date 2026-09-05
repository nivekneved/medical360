import { useState, useEffect, useMemo } from 'react';
import { Star, Building2, Stethoscope, UserCheck, BookOpen, Check, RefreshCw } from 'lucide-react';
import { crudService, type EntityCollection } from '../../../core/services/crud.service';
import type { Specialty, Hospital, Doctor, CaseStudy } from '../../../core/types';

interface FeaturedShowcaseManagerProps {
  initialType?: 'specialties' | 'hospitals' | 'doctors' | 'case-studies';
}

type ShowcaseTab = 'specialties' | 'hospitals' | 'doctors' | 'case-studies';

export function FeaturedShowcaseManager({ initialType = 'specialties' }: FeaturedShowcaseManagerProps) {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>(initialType);
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
        crudService.getAll('specialties'),
        crudService.getAll('hospitals'),
        crudService.getAll('doctors'),
        crudService.getAll('caseStudies'),
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

  // Map active tab to collection & state setters
  const tabConfig = useMemo(() => {
    switch (activeTab) {
      case 'specialties':
        return {
          collection: 'specialties' as EntityCollection,
          items: specialties,
          setter: setSpecialties,
          accentColor: 'var(--color-primary)',
          getPrimary: (item: Specialty) => item.name,
          getSecondary: (item: Specialty) => `${(item.procedures || []).length} procedures`,
          matches: (item: Specialty, q: string) =>
            item.name.toLowerCase().includes(q) || (item.name_fr ? item.name_fr.toLowerCase().includes(q) : false),
        };
      case 'hospitals':
        return {
          collection: 'hospitals' as EntityCollection,
          items: hospitals,
          setter: setHospitals,
          accentColor: '#0284c7',
          getPrimary: (item: Hospital) => item.name,
          getSecondary: (item: Hospital) => `${item.city}, ${item.country}`,
          matches: (item: Hospital, q: string) =>
            item.name.toLowerCase().includes(q) || item.country.toLowerCase().includes(q) || item.city.toLowerCase().includes(q),
        };
      case 'doctors':
        return {
          collection: 'doctors' as EntityCollection,
          items: doctors,
          setter: setDoctors,
          accentColor: '#4f46e5',
          getPrimary: (item: Doctor) => item.name,
          getSecondary: (item: Doctor) => item.title,
          matches: (item: Doctor, q: string) =>
            item.name.toLowerCase().includes(q) || item.title.toLowerCase().includes(q),
        };
      case 'case-studies':
        return {
          collection: 'caseStudies' as EntityCollection,
          items: caseStudies,
          setter: setCaseStudies,
          accentColor: '#10b981',
          getPrimary: (item: CaseStudy) => `${item.patientFirstName} (${item.patientCountry})`,
          getSecondary: (item: CaseStudy) => item.condition,
          matches: (item: CaseStudy, q: string) =>
            item.patientFirstName.toLowerCase().includes(q) || item.condition.toLowerCase().includes(q),
        };
    }
  }, [activeTab, specialties, hospitals, doctors, caseStudies]);

  // Unified single toggle function
  const toggleItemFeatured = async (item: { id: string; featured?: boolean }) => {
    const nextFeatured = !item.featured;
    setUpdatingId(item.id);
    try {
      await crudService.update(tabConfig.collection, item.id, { featured: nextFeatured });
      tabConfig.setter((prev: any[]) =>
        prev.map((i) => (i.id === item.id ? { ...i, featured: nextFeatured } : i))
      );
    } catch (err) {
      console.error('Failed to update featured state:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const q = filterQuery.trim().toLowerCase();
  const filteredItems = useMemo(() => {
    if (!q) return tabConfig.items;
    return (tabConfig.items as any[]).filter((item: any) => tabConfig.matches(item, q));
  }, [tabConfig, q]);

  const tabs = [
    { key: 'specialties' as const, label: 'Medical Specialties', icon: Stethoscope, count: specialties.filter((s) => s.featured).length, total: specialties.length },
    { key: 'hospitals' as const, label: 'Partner Hospitals', icon: Building2, count: hospitals.filter((h) => h.featured).length, total: hospitals.length },
    { key: 'doctors' as const, label: 'Elite Specialists', icon: UserCheck, count: doctors.filter((d) => d.featured).length, total: doctors.length },
    { key: 'case-studies' as const, label: 'Patient Stories', icon: BookOpen, count: caseStudies.filter((c) => c.featured).length, total: caseStudies.length },
  ];

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-2xl)',
        padding: '1.5rem',
        marginBottom: '1.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
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
          onChange={(e) => setFilterQuery(e.target.value)}
          className="form-input form-input--sm"
          style={{ width: 220, maxWidth: '100%' }}
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', background: 'var(--color-surface-2)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
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
              <span
                style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--color-border)',
                  color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: 999,
                }}
              >
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
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {filteredItems.map((item: any) => {
            const isUpdating = updatingId === item.id;
            const isFeatured = !!item.featured;
            const accent = tabConfig.accentColor;

            return (
              <div
                key={item.id}
                onClick={() => toggleItemFeatured(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-lg)',
                  border: `1.5px solid ${isFeatured ? accent : 'var(--color-border)'}`,
                  background: isFeatured ? `color-mix(in srgb, ${accent} 8%, transparent)` : 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: `1.5px solid ${isFeatured ? accent : 'var(--color-border)'}`,
                      background: isFeatured ? accent : 'transparent',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isFeatured && <Check size={14} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isFeatured ? accent : 'var(--color-text)' }}>
                      {tabConfig.getPrimary(item)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      {tabConfig.getSecondary(item)}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: isFeatured ? `color-mix(in srgb, ${accent} 15%, transparent)` : 'var(--color-surface-2)',
                    color: isFeatured ? accent : 'var(--color-text-muted)',
                  }}
                >
                  {isUpdating ? 'Saving...' : isFeatured ? '⭐ Featured' : 'Hidden'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
