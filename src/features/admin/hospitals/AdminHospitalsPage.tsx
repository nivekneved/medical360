import { useState, useEffect } from 'react';
import { Star, MapPin, Shield, Edit3, Eye, Network, Check } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatNumber } from '../../../core/services/format.service';
import { AdminEntityManager, type FieldDefinition, type FilterDefinition, type SortOption } from '../components/AdminEntityManager';
import { SpecialtySelector } from '../components/SpecialtySelector';
import { HospitalSpecialtyMatrixModal } from '../components/HospitalSpecialtyMatrixModal';
import type { Hospital, Specialty } from '../../../core/types';

const HOSPITAL_FIELDS: FieldDefinition<Hospital>[] = [
  { key: 'name', label: 'Hospital Name (EN)', type: 'text', required: true },
  { key: 'name_fr', label: 'Nom de l\'Hôpital (FR)', type: 'text' },
  { key: 'country', label: 'Country', type: 'text', required: true },
  { key: 'city', label: 'City', type: 'text', required: true },
  { key: 'imageUrl', label: 'Cover Image URL', type: 'image', required: true },
  { key: 'description', label: 'Description (EN)', type: 'textarea', required: true },
  { key: 'description_fr', label: 'Description (FR)', type: 'textarea' },
  { key: 'rating', label: 'Rating (e.g. 4.9)', type: 'number', required: true },
  { key: 'reviewCount', label: 'Review Count', type: 'number' },
  { key: 'bedsCount', label: 'Total Inpatient Beds', type: 'number', required: true },
  { key: 'icuBeds', label: 'ICU Beds', type: 'number' },
  { key: 'internationalPatientsPerYear', label: 'International Patients / Year', type: 'number' },
  { key: 'foundedYear', label: 'Founded Year', type: 'number' },
  { key: 'accreditations', label: 'Accreditations (JCI, NABH, ISO, etc.)', type: 'array' },
  { key: 'specialties', label: 'Associated Specialties', type: 'array' },
  { key: 'featured', label: 'Featured Hospital on Homepage', type: 'boolean' },
  { key: 'active', label: 'Active in Directory', type: 'boolean' },
];

const EXPORT_COLUMNS = [
  { header: 'Hospital Name', key: 'name' },
  { header: 'Country', key: 'country' },
  { header: 'City', key: 'city' },
  { header: 'Rating', key: 'rating', format: (v: number) => `${v} / 5` },
  { header: 'Beds', key: 'bedsCount', format: (v: number) => formatNumber(v) },
  { header: 'Intl Patients/Yr', key: 'internationalPatientsPerYear', format: (v: number) => formatNumber(v) },
  { header: 'Specialties Count', key: 'specialties', format: (v: string[]) => `${(v || []).length} linked` },
  { header: 'Accreditations', key: 'accreditations', format: (v: string[]) => v.join(', ') },
];

const SORT_OPTIONS: SortOption<Hospital>[] = [
  { value: 'rating-desc', label: 'Highest Rated', comparator: (a, b) => b.rating - a.rating },
  { value: 'beds-desc', label: 'Most Beds', comparator: (a, b) => b.bedsCount - a.bedsCount },
  { value: 'intl-desc', label: 'Most Intl Patients', comparator: (a, b) => b.internationalPatientsPerYear - a.internationalPatientsPerYear },
  { value: 'name-asc', label: 'Name (A to Z)', comparator: (a, b) => a.name.localeCompare(b.name) },
  { value: 'name-desc', label: 'Name (Z to A)', comparator: (a, b) => b.name.localeCompare(a.name) },
];

export function AdminHospitalsPage() {
  const [hospitals, setHospitals]     = useState<Hospital[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading]         = useState(true);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      mockEngine.getHospitals(),
      mockEngine.getSpecialties(),
    ]).then(([hospList, specList]) => {
      setHospitals(hospList);
      setSpecialties(specList);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  // Filter definitions dynamically computed from dataset
  const filterDefinitions: FilterDefinition<Hospital>[] = [
    {
      key: 'country',
      label: 'Country',
      options: [
        { value: 'all', label: 'All Countries' },
        ...Array.from(new Set(hospitals.map(h => h.country))).map(c => ({ value: c, label: c })),
      ],
      predicate: (h, val) => h.country === val,
    },
    {
      key: 'specialty',
      label: 'Specialty',
      options: [
        { value: 'all', label: 'All Specialties' },
        ...specialties.map(s => ({ value: s.id, label: s.name })),
      ],
      predicate: (h, val) => (h.specialties || []).includes(val),
    },
    {
      key: 'accreditation',
      label: 'Accreditation',
      options: [
        { value: 'all', label: 'All Accreditations' },
        { value: 'JCI', label: 'JCI Accredited' },
        { value: 'NABH', label: 'NABH' },
        { value: 'ISO', label: 'ISO Certified' },
      ],
      predicate: (h, val) => h.accreditations.includes(val),
    },
  ];

  const handleSave = async (item: Hospital, isNew: boolean) => {
    if (isNew) {
      await mockEngine.createHospital(item);
    } else {
      await mockEngine.updateHospital(item.id, item);
    }
    loadData();
  };

  const handleDelete = async (ids: string[]) => {
    await mockEngine.deleteHospitals(ids);
    loadData();
  };

  const getInitialHospital = (): Hospital => ({
    id: `hosp-${Date.now()}`,
    name: '',
    name_fr: '',
    name_kr: '',
    city: 'Port Louis',
    country: 'Mauritius',
    description: '',
    description_fr: '',
    description_kr: '',
    imageUrl: '/assets/bumrungrad-hospital.jpg',
    gallery: ['/assets/bumrungrad-hospital.jpg'],
    accreditations: ['JCI', 'ISO 9001'],
    specialties: specialties.slice(0, 3).map(s => s.id),
    bedsCount: 500,
    icuBeds: 50,
    foundedYear: 2000,
    rating: 4.8,
    reviewCount: 120,
    internationalPatientsPerYear: 5000,
    languages: ['English', 'French'],
    website: 'https://med360.mu',
    contactEmail: 'contact@hospital.com',
    contactPhone: '+230 123 4567',
    featured: true,
    active: true,
  });

  return (
    <>
      <AdminEntityManager<Hospital>
        title="Partner Hospitals"
        subtitle="Manage accredited healthcare facilities, bed counts, and clinical specialty associations"
        entityName="Hospital"
        items={hospitals}
        loading={loading}
        fields={HOSPITAL_FIELDS}
        exportColumns={EXPORT_COLUMNS}
        sortOptions={SORT_OPTIONS}
        filterDefinitions={filterDefinitions}
        headerActions={
          <button
            type="button"
            onClick={() => setIsMatrixOpen(true)}
            className="btn btn-outline btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              fontWeight: 700,
            }}
          >
            <Network size={14} /> Associations Matrix
          </button>
        }
        renderCustomField={(key, value, onChange) => {
          if (key === 'specialties') {
            return (
              <SpecialtySelector
                specialties={specialties}
                selectedIds={value || []}
                onChange={onChange}
                label="Associated Medical Specialties"
              />
            );
          }
          return null;
        }}
        searchPredicate={(h, q) =>
          h.name.toLowerCase().includes(q.toLowerCase()) ||
          (h.name_fr || '').toLowerCase().includes(q.toLowerCase()) ||
          h.city.toLowerCase().includes(q.toLowerCase()) ||
          h.country.toLowerCase().includes(q.toLowerCase()) ||
          h.accreditations.some(a => a.toLowerCase().includes(q.toLowerCase())) ||
          (h.specialties || []).some(s => s.toLowerCase().includes(q.toLowerCase()))
        }
        onSave={handleSave}
        onDelete={handleDelete}
        getInitialItem={getInitialHospital}
        renderCard={(h, onEdit, onView, isSelected, onToggleSelect) => (
          <div
            key={h.id}
            style={{
              background: 'var(--color-surface)',
              border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Card Header & Image */}
            <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
              <img
                src={h.imageUrl}
                alt={h.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = '/assets/banners/hospitals_banner.jpg'; }}
              />
              <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onToggleSelect}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                />
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: '#fbbf24', padding: '3px 8px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={12} fill="#fbbf24" color="#fbbf24" /> {h.rating}
              </div>
              {h.featured && (
                <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'var(--color-primary)', color: 'white', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                  Featured
                </div>
              )}
            </div>

            {/* Card Content */}
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  {h.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                  <MapPin size={13} color="var(--color-primary)" /> {h.city}, {h.country}
                </div>
              </div>

              {/* Accreditations */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {h.accreditations.slice(0, 3).map(acc => (
                  <span key={acc} style={{ fontSize: '0.7rem', fontWeight: 700, background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Shield size={10} /> {acc}
                  </span>
                ))}
              </div>

              {/* Associated Specialties Badges */}
              <div style={{ marginTop: '0.2rem' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: 4 }}>
                  Specialties ({h.specialties?.length || 0}):
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {(h.specialties || []).slice(0, 4).map(sId => {
                    const spec = specialties.find(s => s.id === sId);
                    return (
                      <span key={sId} style={{ fontSize: '0.68rem', fontWeight: 600, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)', padding: '1px 6px', borderRadius: 4 }}>
                        {spec ? spec.name : sId}
                      </span>
                    );
                  })}
                  {(h.specialties?.length || 0) > 4 && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)', padding: '1px 4px' }}>
                      +{(h.specialties?.length || 0) - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: 'auto', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span>Beds: <strong style={{ color: 'var(--color-text)' }}>{formatNumber(h.bedsCount)}</strong></span>
                <span>Intl/Yr: <strong style={{ color: 'var(--color-text)' }}>{formatNumber(h.internationalPatientsPerYear)}</strong></span>
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
                <button onClick={onView} className="btn btn-outline btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <Eye size={13} /> View
                </button>
                <button onClick={onEdit} className="btn btn-primary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <Edit3 size={13} /> Edit
                </button>
              </div>
            </div>
          </div>
        )}
        renderTableColumns={['Hospital', 'Location', 'Rating', 'Beds & Capacity', 'Linked Specialties', 'Accreditations', 'Actions']}
        renderTableRow={(h, onEdit, onView, isSelected, onToggleSelect) => (
          <tr
            key={h.id}
            style={{
              borderTop: '1px solid var(--color-border)',
              background: isSelected ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'transparent',
              transition: 'background 0.15s ease',
            }}
          >
            <td style={{ padding: '0.875rem 0.75rem', textAlign: 'center' }}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
            </td>
            <td style={{ padding: '0.875rem 0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={h.imageUrl}
                  alt={h.name}
                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = '/assets/banners/hospitals_banner.jpg'; }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>{h.name}</div>
                  {h.featured && <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>★ Featured</span>}
                </div>
              </div>
            </td>
            <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.85rem' }}>{h.city}, {h.country}</td>
            <td style={{ padding: '0.875rem 0.85rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(251, 191, 36, 0.12)', color: '#d97706', padding: '2px 8px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
                <Star size={12} fill="#d97706" /> {h.rating} ({h.reviewCount})
              </div>
            </td>
            <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', maxWidth: 220 }}>
                {(h.specialties || []).slice(0, 3).map(sId => {
                  const spec = specialties.find(s => s.id === sId);
                  return (
                    <span key={sId} style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-primary)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>
                      {spec ? spec.name : sId}
                    </span>
                  );
                })}
                {(h.specialties?.length || 0) > 3 && (
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                    +{(h.specialties?.length || 0) - 3}
                  </span>
                )}
              </div>
            </td>
            <td style={{ padding: '0.875rem 0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {h.accreditations.map(a => (
                  <span key={a} style={{ fontSize: '0.68rem', fontWeight: 700, background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: 4 }}>
                    {a}
                  </span>
                ))}
              </div>
            </td>
            <td style={{ padding: '0.875rem 0.85rem', textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                <button onClick={onView} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="View Hospital">
                  <Eye size={14} />
                </button>
                <button onClick={onEdit} className="btn btn-primary btn-sm" style={{ padding: '4px 8px' }} title="Edit Hospital">
                  <Edit3 size={14} />
                </button>
              </div>
            </td>
          </tr>
        )}
        renderViewModalContent={(h) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img
              src={h.imageUrl}
              alt={h.name}
              style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
              onError={(e) => { e.currentTarget.src = '/assets/banners/hospitals_banner.jpg'; }}
            />
            <div>
              <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.15rem', fontWeight: 800 }}>{h.name}</h4>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{h.city}, {h.country}</p>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: 0 }}>
              {h.description}
            </p>

            <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Associated Medical Specialties ({h.specialties?.length || 0})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(h.specialties || []).map(sId => {
                  const spec = specialties.find(s => s.id === sId);
                  return (
                    <span key={sId} style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-primary)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>
                      {spec ? spec.name : sId}
                    </span>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <div>Beds: <strong>{formatNumber(h.bedsCount)}</strong></div>
              <div>ICU Beds: <strong>{formatNumber(h.icuBeds)}</strong></div>
              <div>Rating: <strong>{h.rating} / 5 ({h.reviewCount} reviews)</strong></div>
              <div>Founded: <strong>{h.foundedYear}</strong></div>
            </div>
          </div>
        )}
      />

      {/* Hospital-Specialty Associations Matrix Modal */}
      <HospitalSpecialtyMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        onSaved={loadData}
      />
    </>
  );
}
