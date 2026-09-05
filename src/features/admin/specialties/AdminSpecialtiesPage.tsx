import { useState, useEffect } from 'react';
import { Edit3, Eye, Network, Building2, MapPin, Stethoscope } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatCostRange, formatCostMur } from '../../../core/services/format.service';
import { AdminEntityManager, type FieldDefinition, type SortOption } from '../components/AdminEntityManager';
import { HospitalSelector } from '../components/HospitalSelector';
import { HospitalSpecialtyMatrixModal } from '../components/HospitalSpecialtyMatrixModal';
import { ProcedureManagerModal } from '../../specialties/components/ProcedureManagerModal';
import type { Specialty, Hospital } from '../../../core/types';

// Extended specialty form item to include affiliated hospitals
interface SpecialtyFormItem extends Specialty {
  associatedHospitalIds?: string[];
}

const SPECIALTY_FIELDS: FieldDefinition<SpecialtyFormItem>[] = [
  { key: 'name', label: 'Specialty Name (EN)', type: 'text', required: true },
  { key: 'name_fr', label: 'Nom de la Spécialité (FR)', type: 'text' },
  { key: 'slug', label: 'URL Slug (e.g. cardiology)', type: 'text', required: true },
  { key: 'icon', label: 'Lucide Icon Name (e.g. HeartPulse, Brain, Eye)', type: 'text', required: true },
  { key: 'imageUrl', label: 'Department Cover Image URL', type: 'image', required: true },
  { key: 'associatedHospitalIds', label: 'Affiliated Hospitals', type: 'array' },
  { key: 'shortDescription', label: 'Short Summary (EN)', type: 'textarea', required: true },
  { key: 'shortDescription_fr', label: 'Short Summary (FR)', type: 'textarea' },
  { key: 'description', label: 'Full Clinical Overview (EN)', type: 'textarea', required: true },
  { key: 'description_fr', label: 'Full Clinical Overview (FR)', type: 'textarea' },
  { key: 'featured', label: 'Featured on Homepage Services Carousel', type: 'boolean' },
];

const EXPORT_COLUMNS = [
  { header: 'Specialty Name', key: 'name' },
  { header: 'Slug', key: 'slug' },
  { header: 'Procedures Count', key: 'procedures', format: (v: any[]) => `${(v || []).length} procedures` },
  { header: 'Summary', key: 'shortDescription' },
];

const SORT_OPTIONS: SortOption<SpecialtyFormItem>[] = [
  { value: 'name-asc', label: 'Name (A to Z)', comparator: (a, b) => a.name.localeCompare(b.name) },
  { value: 'name-desc', label: 'Name (Z to A)', comparator: (a, b) => b.name.localeCompare(a.name) },
  { value: 'procs-desc', label: 'Most Procedures', comparator: (a, b) => (b.procedures?.length || 0) - (a.procedures?.length || 0) },
];

export function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyFormItem[]>([]);
  const [hospitals, setHospitals]     = useState<Hospital[]>([]);
  const [loading, setLoading]         = useState(true);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [managingProceduresSpecialty, setManagingProceduresSpecialty] = useState<Specialty | null>(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      mockEngine.getSpecialties(),
      mockEngine.getHospitals(),
    ]).then(([specList, hospList]) => {
      setHospitals(hospList);
      // Map associated hospitals for each specialty
      const itemsWithHospitals: SpecialtyFormItem[] = specList.map((s) => ({
        ...s,
        associatedHospitalIds: hospList.filter((h) => (h.specialties || []).includes(s.id)).map((h) => h.id),
      }));
      setSpecialties(itemsWithHospitals);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (item: SpecialtyFormItem, isNew: boolean) => {
    const { associatedHospitalIds, ...specialtyData } = item;
    let savedSpec: Specialty;

    if (isNew) {
      savedSpec = await mockEngine.createSpecialty(specialtyData as Specialty);
    } else {
      savedSpec = await mockEngine.updateSpecialty(specialtyData.id, specialtyData as Specialty);
    }

    // Synchronize hospital associations
    if (associatedHospitalIds !== undefined) {
      await mockEngine.associateSpecialtyHospitals(savedSpec.id, associatedHospitalIds);
    }

    loadData();
  };

  const handleDelete = async (ids: string[]) => {
    await mockEngine.deleteSpecialties(ids);
    loadData();
  };

  const getInitialSpecialty = (): SpecialtyFormItem => ({
    id: `sp-${Date.now()}`,
    name: 'New Specialty',
    name_fr: 'Nouvelle Spécialité',
    name_kr: 'Nouvo Spesialite',
    slug: 'new-specialty',
    icon: 'Stethoscope',
    description: 'Comprehensive international clinical treatment overview.',
    description_fr: '',
    description_kr: '',
    shortDescription: 'World-class advanced medical care.',
    shortDescription_fr: '',
    shortDescription_kr: '',
    imageUrl: '/assets/banners/specialties_banner.jpg',
    associatedHospitalIds: hospitals.slice(0, 2).map((h) => h.id),
    procedures: [
      {
        id: `proc-${Date.now()}`,
        specialtyId: `sp-${Date.now()}`,
        name: 'Standard Procedure',
        name_fr: 'Procédure Standard',
        name_kr: 'Procedir Standar',
        description: 'Standard surgical or clinical procedure.',
        description_fr: '',
        description_kr: '',
        estimatedCostUSD: { min: 2500, max: 5500 },
        estimatedDurationDays: 5,
      },
    ],
    featured: true,
  });

  if (isMatrixOpen) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto', animation: 'fadeIn 0.2s ease-out' }}>
        <HospitalSpecialtyMatrixModal
          isOpen={isMatrixOpen}
          onClose={() => setIsMatrixOpen(false)}
          onSaved={loadData}
        />
      </div>
    );
  }

  if (managingProceduresSpecialty !== null) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto', animation: 'fadeIn 0.2s ease-out' }}>
        <ProcedureManagerModal
          isOpen={true}
          specialty={managingProceduresSpecialty}
          onClose={() => setManagingProceduresSpecialty(null)}
          onSaved={() => {
            loadData();
          }}
        />
      </div>
    );
  }

  return (
    <>
      <AdminEntityManager<SpecialtyFormItem>
        title="Medical Specialties"
        subtitle="Manage medical disciplines, procedures catalog, and affiliated partner hospitals"
        entityName="Specialty"
        publicListUrl="/specialties"
        items={specialties}
        loading={loading}
        fields={SPECIALTY_FIELDS}
        exportColumns={EXPORT_COLUMNS}
        sortOptions={SORT_OPTIONS}
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
          if (key === 'associatedHospitalIds') {
            return (
              <HospitalSelector
                hospitals={hospitals}
                selectedIds={value || []}
                onChange={onChange}
                label="Partner Hospitals Offering This Specialty"
              />
            );
          }
          return null;
        }}
        searchPredicate={(s, q) =>
          s.name.toLowerCase().includes(q.toLowerCase()) ||
          (s.name_fr || '').toLowerCase().includes(q.toLowerCase()) ||
          s.shortDescription.toLowerCase().includes(q.toLowerCase()) ||
          (s.procedures || []).some(p => p.name.toLowerCase().includes(q.toLowerCase()))
        }
        onSave={handleSave}
        onDelete={handleDelete}
        getInitialItem={getInitialSpecialty}
        renderCard={(s, onEdit, onView, isSelected, onToggleSelect) => {
          const affiliatedHospitals = hospitals.filter((h) => (h.specialties || []).includes(s.id));

          return (
            <div
              key={s.id}
              style={{
                background: 'var(--color-surface)',
                border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = '/assets/banners/specialties_banner.jpg'; }}
                />
                <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggleSelect}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                  />
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800 }}>
                  {(s.procedures || []).length} Procedures
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                    {s.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {s.shortDescription.length > 85 ? `${s.shortDescription.slice(0, 85)}...` : s.shortDescription}
                  </p>
                </div>

                {/* Affiliated Hospitals Count & Badges */}
                <div style={{ marginTop: '0.2rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Building2 size={12} color="var(--color-primary)" />
                    Affiliated Hospitals ({affiliatedHospitals.length}):
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {affiliatedHospitals.slice(0, 3).map((h) => (
                      <span key={h.id} style={{ fontSize: '0.68rem', fontWeight: 600, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)', padding: '1px 6px', borderRadius: 4 }}>
                        {h.name.split(' ')[0]}
                      </span>
                    ))}
                    {affiliatedHospitals.length > 3 && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)', padding: '1px 4px' }}>
                        +{affiliatedHospitals.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  {(s.procedures || []).slice(0, 2).map(proc => (
                    <span key={proc.id} style={{ fontSize: '0.7rem', fontWeight: 600, background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: 4 }}>
                      {proc.name}
                    </span>
                  ))}
                  {(s.procedures || []).length > 2 && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>+{(s.procedures || []).length - 2} more</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    onClick={() => setManagingProceduresSpecialty(s)}
                    className="btn btn-outline btn-sm"
                    style={{
                      flex: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderColor: 'var(--color-primary)',
                      color: 'var(--color-primary)',
                    }}
                    title="Manage Procedures & Estimated Costs"
                  >
                    <Stethoscope size={13} /> Procedures ({(s.procedures || []).length})
                  </button>
                  <button onClick={onView} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="View Specialty">
                    <Eye size={13} />
                  </button>
                  <button onClick={onEdit} className="btn btn-primary btn-sm" style={{ padding: '4px 8px' }} title="Edit Specialty">
                    <Edit3 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        }}
        renderTableColumns={['Specialty', 'Affiliated Hospitals', 'Procedures', 'Sample Pricing', 'Featured', 'Actions']}
        renderTableRow={(s, onEdit, onView, isSelected, onToggleSelect) => {
          const affiliatedHospitals = hospitals.filter((h) => (h.specialties || []).includes(s.id));

          return (
            <tr
              key={s.id}
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
                    src={s.imageUrl}
                    alt={s.name}
                    style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/assets/banners/specialties_banner.jpg'; }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.slug}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{affiliatedHospitals.length}</span> hospitals
              </td>
              <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.85rem' }}>
                <button
                  type="button"
                  onClick={() => setManagingProceduresSpecialty(s)}
                  className="btn btn-outline btn-sm"
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  title="Click to view and edit procedures"
                >
                  <Stethoscope size={12} color="var(--color-primary)" />
                  <strong>{(s.procedures || []).length}</strong> cataloged
                </button>
              </td>
              <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.8125rem' }}>
                {s.procedures?.[0]?.estimatedCostUSD ? (
                  <div>
                    <strong style={{ color: 'var(--color-primary)' }}>
                      {formatCostRange(s.procedures[0].estimatedCostUSD.min, s.procedures[0].estimatedCostUSD.max)}
                    </strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      ~{formatCostMur(s.procedures[0].estimatedCostUSD.min, s.procedures[0].estimatedCostUSD.max)}
                    </div>
                  </div>
                ) : '—'}
              </td>
              <td style={{ padding: '0.875rem 0.85rem' }}>
                {s.featured ? (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-primary)', background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', padding: '2px 6px', borderRadius: 4 }}>
                    Active
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Standard</span>
                )}
              </td>
              <td style={{ padding: '0.875rem 0.85rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => setManagingProceduresSpecialty(s)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 8px', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                    title="Manage Procedures"
                  >
                    <Stethoscope size={14} />
                  </button>
                  <button onClick={onView} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="View Specialty">
                    <Eye size={14} />
                  </button>
                  <button onClick={onEdit} className="btn btn-primary btn-sm" style={{ padding: '4px 8px' }} title="Edit Specialty">
                    <Edit3 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          );
        }}
        renderViewModalContent={(s) => {
          const affiliatedHospitals = hospitals.filter((h) => (h.specialties || []).includes(s.id));

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <img
                src={s.imageUrl}
                alt={s.name}
                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                onError={(e) => { e.currentTarget.src = '/assets/banners/specialties_banner.jpg'; }}
              />
              <div>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.15rem', fontWeight: 800 }}>{s.name}</h4>
                <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{s.shortDescription}</p>
              </div>

              {/* Affiliated Hospitals */}
              <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building2 size={16} color="var(--color-primary)" />
                  Partner Hospitals Offering {s.name} ({affiliatedHospitals.length})
                </div>
                {affiliatedHospitals.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>No hospitals associated with this specialty yet.</div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {affiliatedHospitals.map((h) => (
                      <span key={h.id} style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>
                        {h.name} ({h.city}, {h.country})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>Procedures Catalog:</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(s.procedures || []).map(proc => (
                    <div key={proc.id} style={{ background: 'var(--color-surface-2)', padding: '0.75rem', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>{proc.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{proc.description}</div>
                      </div>
                      {proc.estimatedCostUSD && (
                        <strong style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                          {formatCostRange(proc.estimatedCostUSD.min, proc.estimatedCostUSD.max)}
                        </strong>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
