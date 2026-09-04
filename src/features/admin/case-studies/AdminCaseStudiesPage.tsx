import { Edit3, Eye } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useCaseStudies } from '../../../hooks/useCaseStudies';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { useHospitals } from '../../../hooks/useHospitals';
import { AdminEntityManager, type FieldDefinition, type FilterDefinition, type SortOption } from '../components/AdminEntityManager';
import type { CaseStudy } from '../../../core/types';

export function AdminCaseStudiesPage() {
  const { caseStudies, loading, refetch } = useCaseStudies();
  const { specialties }                   = useSpecialties();
  const { hospitals }                     = useHospitals({});

  const getSpecialtyName = (sId: string) => {
    const s = specialties.find(item => item.id === sId);
    return s ? s.name : sId;
  };

  const getHospitalName = (hId: string) => {
    const h = hospitals.find(item => item.id === hId);
    return h ? h.name : hId;
  };

  const caseFields: FieldDefinition<CaseStudy>[] = [
    { key: 'patientFirstName', label: 'Patient Name (or Anonymized Name)', type: 'text', required: true },
    { key: 'patientCountry', label: 'Patient Origin Country', type: 'text', required: true },
    { key: 'patientAge', label: 'Patient Age', type: 'number', required: true },
    { key: 'condition', label: 'Medical Condition / Diagnosis (EN)', type: 'text', required: true },
    { key: 'condition_fr', label: 'Condition Médicale (FR)', type: 'text' },
    {
      key: 'specialtyId',
      label: 'Medical Specialty',
      type: 'select',
      required: true,
      options: specialties.map(s => ({ value: s.id, label: s.name })),
    },
    {
      key: 'hospitalId',
      label: 'Treated Hospital',
      type: 'select',
      required: true,
      options: hospitals.map(h => ({ value: h.id, label: `${h.name} (${h.country})` })),
    },
    { key: 'treatment', label: 'Treatment / Surgery Performed (EN)', type: 'text', required: true },
    { key: 'treatment_fr', label: 'Traitement Réalisé (FR)', type: 'text' },
    { key: 'outcome', label: 'Clinical Outcome (EN)', type: 'text', required: true },
    { key: 'outcome_fr', label: 'Résultat Clinique (FR)', type: 'text' },
    { key: 'costSavedPercent', label: 'Estimated Cost Saved (%)', type: 'number', required: true },
    { key: 'durationDays', label: 'Total Duration of Stay (Days)', type: 'number', required: true },
    { key: 'year', label: 'Treatment Year', type: 'number' },
    { key: 'imageUrl', label: 'Patient Photo / Cover Image URL', type: 'image', required: true },
    { key: 'testimonial', label: 'Patient Testimonial Quote (EN)', type: 'textarea', required: true },
    { key: 'testimonial_fr', label: 'Témoignage Patient (FR)', type: 'textarea' },
    { key: 'featured', label: 'Featured on Homepage Testimonials', type: 'boolean' },
  ];

  const exportColumns = [
    { header: 'Patient Name', key: 'patientFirstName' },
    { header: 'Country', key: 'patientCountry' },
    { header: 'Condition', key: 'condition' },
    { header: 'Treatment', key: 'treatment' },
    { header: 'Specialty', key: 'specialtyId', format: (v: string) => getSpecialtyName(v) },
    { header: 'Savings (%)', key: 'costSavedPercent', format: (v: number) => `${v}%` },
    { header: 'Stay (Days)', key: 'durationDays', format: (v: number) => `${v} Days` },
  ];

  const sortOptions: SortOption<CaseStudy>[] = [
    { value: 'saved-desc', label: 'Highest Cost Saved (%)', comparator: (a, b) => b.costSavedPercent - a.costSavedPercent },
    { value: 'year-desc', label: 'Most Recent Year', comparator: (a, b) => (b.year || 2026) - (a.year || 2026) },
    { value: 'stay-asc', label: 'Shortest Hospital Stay', comparator: (a, b) => (a.durationDays || 0) - (b.durationDays || 0) },
    { value: 'name-asc', label: 'Patient Name (A to Z)', comparator: (a, b) => a.patientFirstName.localeCompare(b.patientFirstName) },
  ];

  const filterDefinitions: FilterDefinition<CaseStudy>[] = [
    {
      key: 'specialty',
      label: 'Specialty',
      options: [
        { value: 'all', label: 'All Specialties' },
        ...specialties.map(s => ({ value: s.id, label: s.name })),
      ],
      predicate: (cs, val) => cs.specialtyId === val,
    },
    {
      key: 'country',
      label: 'Origin',
      options: [
        { value: 'all', label: 'All Countries' },
        ...Array.from(new Set(caseStudies.map(cs => cs.patientCountry))).map(c => ({ value: c, label: c })),
      ],
      predicate: (cs, val) => cs.patientCountry === val,
    },
  ];

  const handleSave = async (item: CaseStudy, isNew: boolean) => {
    if (isNew) {
      await mockEngine.createCaseStudy(item);
    } else {
      await mockEngine.updateCaseStudy(item.id, item);
    }
    refetch();
  };

  const handleDelete = async (ids: string[]) => {
    await mockEngine.deleteCaseStudies(ids);
    refetch();
  };

  const getInitialCaseStudy = (): CaseStudy => ({
    id: `cs-${Date.now()}`,
    patientFirstName: 'Jean-Pierre',
    patientCountry: 'Mauritius',
    patientAge: 52,
    condition: 'Cardiac Condition',
    condition_fr: 'Problème Cardiaque',
    condition_kr: 'Problem Leker',
    specialtyId: specialties[0]?.id || 'sp-cardiology',
    hospitalId: hospitals[0]?.id || 'hosp-apollo',
    treatment: 'Advanced Minimally Invasive Surgery',
    treatment_fr: 'Chirurgie Mini-Invasive Avancée',
    treatment_kr: 'Loperasion Avase',
    outcome: 'Full functional recovery within 10 days.',
    outcome_fr: 'Rétablissement complet sous 10 jours.',
    outcome_kr: 'Bann gerizon konplet dan 10 zour.',
    testimonial: 'Medical 360 coordinated every step flawlessly from visa to hospital admission.',
    testimonial_fr: 'Medical 360 a coordonné chaque étape de manière impeccable.',
    testimonial_kr: 'Med360 finn okip tou depi koumansman ziska lafin.',
    costSavedPercent: 55,
    durationDays: 8,
    year: 2026,
    imageUrl: '/assets/banners/corneal_case_study.jpg',
    featured: true,
  });

  return (
    <AdminEntityManager<CaseStudy>
      title="Patient Stories"
      subtitle="Manage verified patient recovery journeys, clinical outcomes, and cost savings"
      entityName="Patient Story"
      items={caseStudies}
      loading={loading}
      fields={caseFields}
      exportColumns={exportColumns}
      sortOptions={sortOptions}
      filterDefinitions={filterDefinitions}
      searchPredicate={(cs, q) =>
        cs.patientFirstName.toLowerCase().includes(q.toLowerCase()) ||
        cs.condition.toLowerCase().includes(q.toLowerCase()) ||
        (cs.condition_fr || '').toLowerCase().includes(q.toLowerCase()) ||
        cs.treatment.toLowerCase().includes(q.toLowerCase()) ||
        cs.patientCountry.toLowerCase().includes(q.toLowerCase())
      }
      onSave={handleSave}
      onDelete={handleDelete}
      getInitialItem={getInitialCaseStudy}
      renderCard={(cs, onEdit, onView, isSelected, onToggleSelect) => (
        <div
          key={cs.id}
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
              src={cs.imageUrl}
              alt={cs.patientFirstName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = '/assets/banners/casestudies_banner.jpg'; }}
            />
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
            </div>
            <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'linear-gradient(135deg, #065f46, #059669)', color: 'white', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800 }}>
              Saved {cs.costSavedPercent}%
            </div>
          </div>

          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  {cs.patientFirstName}, {cs.patientAge}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{cs.patientCountry}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                {cs.condition}
              </p>
            </div>

            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{cs.testimonial.length > 90 ? `${cs.testimonial.slice(0, 90)}...` : cs.testimonial}"
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: 'auto', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              <span>Specialty: <strong style={{ color: 'var(--color-text)' }}>{getSpecialtyName(cs.specialtyId)}</strong></span>
              <span>Stay: <strong style={{ color: 'var(--color-text)' }}>{cs.durationDays} Days</strong></span>
            </div>

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
      renderTableColumns={['Patient', 'Condition & Treatment', 'Hospital', 'Savings', 'Stay', 'Actions']}
      renderTableRow={(cs, onEdit, onView, isSelected, onToggleSelect) => (
        <tr
          key={cs.id}
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
                src={cs.imageUrl}
                alt={cs.patientFirstName}
                style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = '/assets/banners/casestudies_banner.jpg'; }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>{cs.patientFirstName}, {cs.patientAge}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{cs.patientCountry} ({cs.year})</div>
              </div>
            </div>
          </td>
          <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 600 }}>{cs.condition}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{cs.treatment}</div>
          </td>
          <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.8125rem' }}>
            {getHospitalName(cs.hospitalId)}
          </td>
          <td style={{ padding: '0.875rem 0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: '3px 8px', borderRadius: 999 }}>
              {cs.costSavedPercent}% Saved
            </span>
          </td>
          <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.8125rem' }}>
            {cs.durationDays} Days
          </td>
          <td style={{ padding: '0.875rem 0.85rem', textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
              <button onClick={onView} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="View Story">
                <Eye size={14} />
              </button>
              <button onClick={onEdit} className="btn btn-primary btn-sm" style={{ padding: '4px 8px' }} title="Edit Story">
                <Edit3 size={14} />
              </button>
            </div>
          </td>
        </tr>
      )}
      renderViewModalContent={(cs) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img
            src={cs.imageUrl}
            alt={cs.patientFirstName}
            style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
            onError={(e) => { e.currentTarget.src = '/assets/banners/casestudies_banner.jpg'; }}
          />
          <div>
            <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.15rem', fontWeight: 800 }}>{cs.patientFirstName} ({cs.patientAge} yrs, {cs.patientCountry})</h4>
            <p style={{ margin: 0, color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem' }}>{cs.condition} · {cs.treatment}</p>
          </div>
          <blockquote style={{ margin: 0, padding: '0.85rem 1rem', background: 'var(--color-surface-2)', borderLeft: '3px solid var(--color-primary)', borderRadius: '0 8px 8px 0', fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--color-text)' }}>
            "{cs.testimonial}"
          </blockquote>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <div>Outcome: <strong>{cs.outcome}</strong></div>
            <div>Hospital: <strong>{getHospitalName(cs.hospitalId)}</strong></div>
            <div>Cost Saved: <strong style={{ color: '#059669' }}>{cs.costSavedPercent}%</strong></div>
            <div>Duration of Stay: <strong>{cs.durationDays} Days</strong></div>
          </div>
        </div>
      )}
    />
  );
}
