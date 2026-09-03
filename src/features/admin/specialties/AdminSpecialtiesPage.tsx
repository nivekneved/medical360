import { useState, useEffect } from 'react';
import { Edit3, Eye } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { formatCostRange, formatCostMur } from '../../../core/services/format.service';
import { AdminEntityManager, type FieldDefinition, type SortOption } from '../components/AdminEntityManager';
import type { Specialty } from '../../../core/types';

const SPECIALTY_FIELDS: FieldDefinition<Specialty>[] = [
  { key: 'name', label: 'Specialty Name (EN)', type: 'text', required: true },
  { key: 'name_fr', label: 'Nom de la Spécialité (FR)', type: 'text' },
  { key: 'slug', label: 'URL Slug (e.g. cardiology)', type: 'text', required: true },
  { key: 'icon', label: 'Lucide Icon Name (e.g. HeartPulse, Brain, Eye)', type: 'text', required: true },
  { key: 'imageUrl', label: 'Department Cover Image URL', type: 'image', required: true },
  { key: 'shortDescription', label: 'Short Summary (EN)', type: 'textarea', required: true },
  { key: 'shortDescription_fr', label: 'Short Summary (FR)', type: 'textarea' },
  { key: 'description', label: 'Full Clinical Overview (EN)', type: 'textarea', required: true },
  { key: 'description_fr', label: 'Full Clinical Overview (FR)', type: 'textarea' },
  { key: 'featured', label: 'Featured on Homepage Services Carousel', type: 'boolean' },
];

const EXPORT_COLUMNS = [
  { header: 'Specialty Name', key: 'name' },
  { header: 'Slug', key: 'slug' },
  { header: 'Procedures Count', key: 'procedures', format: (v: any[]) => `${v.length} procedures` },
  { header: 'Summary', key: 'shortDescription' },
];

const SORT_OPTIONS: SortOption<Specialty>[] = [
  { value: 'name-asc', label: 'Name (A to Z)', comparator: (a, b) => a.name.localeCompare(b.name) },
  { value: 'name-desc', label: 'Name (Z to A)', comparator: (a, b) => b.name.localeCompare(a.name) },
  { value: 'procs-desc', label: 'Most Procedures', comparator: (a, b) => b.procedures.length - a.procedures.length },
];

export function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading]         = useState(true);

  const loadData = () => {
    setLoading(true);
    mockEngine.getSpecialties().then(setSpecialties).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (item: Specialty, isNew: boolean) => {
    if (isNew) {
      await mockEngine.createSpecialty(item);
    } else {
      await mockEngine.updateSpecialty(item.id, item);
    }
    loadData();
  };

  const handleDelete = async (ids: string[]) => {
    await mockEngine.deleteSpecialties(ids);
    loadData();
  };

  const getInitialSpecialty = (): Specialty => ({
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

  return (
    <AdminEntityManager<Specialty>
      title="Medical Specialties"
      subtitle="Manage medical disciplines, procedures catalog, and estimated treatment budgets"
      entityName="Specialty"
      items={specialties}
      loading={loading}
      fields={SPECIALTY_FIELDS}
      exportColumns={EXPORT_COLUMNS}
      sortOptions={SORT_OPTIONS}
      searchPredicate={(s, q) =>
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        (s.name_fr || '').toLowerCase().includes(q.toLowerCase()) ||
        s.shortDescription.toLowerCase().includes(q.toLowerCase()) ||
        s.procedures.some(p => p.name.toLowerCase().includes(q.toLowerCase()))
      }
      onSave={handleSave}
      onDelete={handleDelete}
      getInitialItem={getInitialSpecialty}
      renderCard={(s, onEdit, onView, isSelected, onToggleSelect) => (
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
              {s.procedures.length} Procedures
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

            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.5rem' }}>
              {s.procedures.slice(0, 2).map(proc => (
                <span key={proc.id} style={{ fontSize: '0.7rem', fontWeight: 600, background: 'rgba(6, 95, 70, 0.08)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: 4 }}>
                  {proc.name}
                </span>
              ))}
              {s.procedures.length > 2 && (
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>+{s.procedures.length - 2} more</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
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
      renderTableColumns={['Specialty', 'Procedures', 'Sample Pricing', 'Featured', 'Actions']}
      renderTableRow={(s, onEdit, onView, isSelected, onToggleSelect) => (
        <tr
          key={s.id}
          style={{
            borderTop: '1px solid var(--color-border)',
            background: isSelected ? 'rgba(6, 95, 70, 0.05)' : 'transparent',
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
            <strong>{s.procedures.length}</strong> cataloged
          </td>
          <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.8125rem' }}>
            {s.procedures[0] && s.procedures[0].estimatedCostUSD ? (
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
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                Active
              </span>
            ) : (
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Standard</span>
            )}
          </td>
          <td style={{ padding: '0.875rem 0.85rem', textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
              <button onClick={onView} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="View Specialty">
                <Eye size={14} />
              </button>
              <button onClick={onEdit} className="btn btn-primary btn-sm" style={{ padding: '4px 8px' }} title="Edit Specialty">
                <Edit3 size={14} />
              </button>
            </div>
          </td>
        </tr>
      )}
      renderViewModalContent={(s) => (
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
          <div>
            <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>Procedures Catalog:</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {s.procedures.map(proc => (
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
      )}
    />
  );
}
