import { useState, useEffect } from 'react';
import { Building2, Edit3, Eye, Network } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useHospitals } from '../../../hooks/useHospitals';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { formatNumber } from '../../../core/services/format.service';
import { AdminEntityManager, type FieldDefinition, type FilterDefinition, type SortOption } from '../components/AdminEntityManager';
import { SpecialtySelector } from '../components/SpecialtySelector';
import { HospitalSelector } from '../components/HospitalSelector';
import { SpecialistAssociationMatrixModal } from '../components/SpecialistAssociationMatrixModal';
import type { Doctor } from '../../../core/types';

export function AdminDoctorsPage() {
  const [doctors, setDoctors]         = useState<Doctor[]>([]);
  const [loading, setLoading]         = useState(true);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const { hospitals }                 = useHospitals({});
  const { specialties }               = useSpecialties();

  const loadData = () => {
    setLoading(true);
    mockEngine.getDoctors().then(setDoctors).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const getHospitalName = (hId: string) => {
    const h = hospitals.find(item => item.id === hId);
    return h ? h.name : hId;
  };

  const getSpecialtyName = (sId: string) => {
    const s = specialties.find(item => item.id === sId);
    return s ? s.name : sId;
  };

  const getDocHospitalIds = (d: Doctor): string[] => {
    if (d.hospitalIds && d.hospitalIds.length > 0) return d.hospitalIds;
    if (d.hospitalId) return [d.hospitalId];
    return [];
  };

  const doctorFields: FieldDefinition<Doctor>[] = [
    { key: 'name', label: 'Doctor Name & Title', type: 'text', required: true },
    { key: 'title', label: 'Professional Role / Department Head', type: 'text', required: true },
    { key: 'hospitalIds', label: 'Affiliated Partner Hospitals', type: 'array', required: true },
    { key: 'imageUrl', label: 'Doctor Portrait Image URL', type: 'image', required: true },
    { key: 'experience', label: 'Years of Experience', type: 'number', required: true },
    { key: 'surgeries', label: 'Lifetime Surgeries Performed', type: 'number', required: true },
    { key: 'consultationFeeUSD', label: 'Consultation Fee (USD)', type: 'number', required: true },
    { key: 'specialties', label: 'Associated Specialties', type: 'array', required: true },
    { key: 'qualifications', label: 'Qualifications & Fellowships (FRCS, MD, FACC)', type: 'array', required: true },
    { key: 'languages', label: 'Spoken Languages (English, French, Hindi)', type: 'array', required: true },
    { key: 'bio', label: 'Full Professional Biography', type: 'textarea', required: true },
    { key: 'featured', label: 'Featured on Homepage Specialists Carousel', type: 'boolean' },
  ];

  const exportColumns = [
    { header: 'Doctor Name', key: 'name' },
    { header: 'Title / Role', key: 'title' },
    {
      header: 'Hospitals',
      key: 'hospitalIds',
      format: (_v: any, row: Doctor) => getDocHospitalIds(row).map(hId => getHospitalName(hId)).join(', '),
    },
    { header: 'Experience (Yrs)', key: 'experience', format: (v: number) => `${v} yrs` },
    { header: 'Surgeries', key: 'surgeries', format: (v: number) => `${formatNumber(v)}+` },
    { header: 'Fee (USD)', key: 'consultationFeeUSD', format: (v: number) => `$${v}` },
    { header: 'Languages', key: 'languages', format: (v: string[]) => v.join(', ') },
  ];

  const sortOptions: SortOption<Doctor>[] = [
    { value: 'surgeries-desc', label: 'Most Surgeries Performed', comparator: (a, b) => b.surgeries - a.surgeries },
    { value: 'exp-desc', label: 'Years of Experience', comparator: (a, b) => b.experience - a.experience },
    { value: 'fee-asc', label: 'Consultation Fee (Low to High)', comparator: (a, b) => a.consultationFeeUSD - b.consultationFeeUSD },
    { value: 'fee-desc', label: 'Consultation Fee (High to Low)', comparator: (a, b) => b.consultationFeeUSD - a.consultationFeeUSD },
    { value: 'name-asc', label: 'Name (A to Z)', comparator: (a, b) => a.name.localeCompare(b.name) },
  ];

  const filterDefinitions: FilterDefinition<Doctor>[] = [
    {
      key: 'specialty',
      label: 'Specialty',
      options: [
        { value: 'all', label: 'All Specialties' },
        ...specialties.map(s => ({ value: s.id, label: s.name })),
      ],
      predicate: (d, val) => (d.specialties || []).includes(val),
    },
    {
      key: 'hospital',
      label: 'Hospital',
      options: [
        { value: 'all', label: 'All Hospitals' },
        ...hospitals.map(h => ({ value: h.id, label: h.name })),
      ],
      predicate: (d, val) => getDocHospitalIds(d).includes(val),
    },
  ];

  const handleSave = async (item: Doctor, isNew: boolean) => {
    const hospIds = item.hospitalIds && item.hospitalIds.length > 0
      ? item.hospitalIds
      : (item.hospitalId ? [item.hospitalId] : [hospitals[0]?.id || 'hosp-1']);

    const itemToSave: Doctor = {
      ...item,
      hospitalIds: hospIds,
      hospitalId: hospIds[0] || 'hosp-1',
    };

    if (isNew) {
      await mockEngine.createDoctor(itemToSave);
    } else {
      await mockEngine.updateDoctor(itemToSave.id, itemToSave);
    }
    loadData();
  };

  const handleDelete = async (ids: string[]) => {
    await mockEngine.deleteDoctors(ids);
    loadData();
  };

  const getInitialDoctor = (): Doctor => ({
    id: `doc-${Date.now()}`,
    name: 'Dr. New Specialist',
    title: 'Senior Consultant & Surgeon',
    hospitalId: hospitals[0]?.id || 'hosp-1',
    hospitalIds: hospitals.slice(0, 2).map(h => h.id),
    specialties: specialties.slice(0, 1).map(s => s.id),
    qualifications: ['MBBS', 'MS', 'MCh'],
    experience: 15,
    surgeries: 3000,
    languages: ['English', 'French'],
    imageUrl: '/assets/banners/dr_wong_chiung_ing.jpg',
    bio: 'Dedicated international surgeon with extensive clinical expertise across accredited partner hospitals.',
    consultationFeeUSD: 60,
    featured: true,
  });

  if (isMatrixOpen) {
    return (
      <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto', animation: 'fadeIn 0.2s ease-out' }}>
        <SpecialistAssociationMatrixModal
          isOpen={isMatrixOpen}
          onClose={() => setIsMatrixOpen(false)}
          onSaved={loadData}
        />
      </div>
    );
  }

  return (
    <>
      <AdminEntityManager<Doctor>
        title="7 Elite Specialists"
        subtitle="Manage internationally recognized chief surgeons, clinical specialty associations, and multi-hospital affiliations"
        entityName="Specialist"
        items={doctors}
        loading={loading}
        fields={doctorFields}
        exportColumns={exportColumns}
        sortOptions={sortOptions}
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
            <Network size={14} /> Specialist Associations Hub
          </button>
        }
        renderCustomField={(key, value, onChange) => {
          if (key === 'hospitalIds') {
            return (
              <HospitalSelector
                hospitals={hospitals}
                selectedIds={value || []}
                onChange={onChange}
                label="Affiliated Partner Hospitals"
              />
            );
          }
          if (key === 'specialties') {
            return (
              <SpecialtySelector
                specialties={specialties}
                selectedIds={value || []}
                onChange={onChange}
                label="Associated Specialties / Clinical Departments"
              />
            );
          }
          return null;
        }}
        searchPredicate={(d, q) =>
          d.name.toLowerCase().includes(q.toLowerCase()) ||
          d.title.toLowerCase().includes(q.toLowerCase()) ||
          d.bio.toLowerCase().includes(q.toLowerCase()) ||
          d.languages.some(l => l.toLowerCase().includes(q.toLowerCase())) ||
          (d.specialties || []).some(s => s.toLowerCase().includes(q.toLowerCase())) ||
          getDocHospitalIds(d).some(hId => getHospitalName(hId).toLowerCase().includes(q.toLowerCase()))
        }
        onSave={handleSave}
        onDelete={handleDelete}
        getInitialItem={getInitialDoctor}
        renderCard={(d, onEdit, onView, isSelected, onToggleSelect) => {
          const docHospIds = getDocHospitalIds(d);
          return (
            <div
              key={d.id}
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
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = '/assets/banners/doctors_banner.jpg'; }}
                />
                <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggleSelect}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
                  />
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', color: '#34d399', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 800 }}>
                  ${d.consultationFeeUSD} USD
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)' }}>
                    {d.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    {d.title}
                  </p>
                </div>

                {/* Affiliated Hospitals */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {docHospIds.map(hId => (
                    <span
                      key={hId}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.72rem',
                        color: 'var(--color-text-secondary)',
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      <Building2 size={11} color="var(--color-text-muted)" /> {getHospitalName(hId)}
                    </span>
                  ))}
                </div>

                {/* Specialties */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {(d.specialties || []).map(s => (
                    <span key={s} style={{ fontSize: '0.7rem', fontWeight: 700, background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: 4 }}>
                      {getSpecialtyName(s)}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: 'auto', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <span>Surgeries: <strong style={{ color: 'var(--color-text)' }}>{formatNumber(d.surgeries)}+</strong></span>
                  <span>Exp: <strong style={{ color: 'var(--color-text)' }}>{d.experience} Years</strong></span>
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
          );
        }}
        renderTableColumns={['Specialist', 'Affiliated Hospitals', 'Specialties', 'Surgeries & Exp', 'Fee', 'Actions']}
        renderTableRow={(d, onEdit, onView, isSelected, onToggleSelect) => {
          const docHospIds = getDocHospitalIds(d);
          return (
            <tr
              key={d.id}
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
                    src={d.imageUrl}
                    alt={d.name}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = '/assets/banners/doctors_banner.jpg'; }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>{d.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{d.title}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {docHospIds.map(hId => (
                    <span key={hId} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      <Building2 size={12} color="var(--color-text-muted)" /> {getHospitalName(hId)}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ padding: '0.875rem 0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {(d.specialties || []).map(s => (
                    <span key={s} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {getSpecialtyName(s)}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ padding: '0.875rem 0.85rem', fontSize: '0.8125rem' }}>
                <div><strong>{formatNumber(d.surgeries)}+</strong> Surgeries</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{d.experience} yrs exp</div>
              </td>
              <td style={{ padding: '0.875rem 0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                ${d.consultationFeeUSD}
              </td>
              <td style={{ padding: '0.875rem 0.85rem', textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                  <button onClick={onView} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }} title="View Specialist">
                    <Eye size={14} />
                  </button>
                  <button onClick={onEdit} className="btn btn-primary btn-sm" style={{ padding: '4px 8px' }} title="Edit Specialist">
                    <Edit3 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          );
        }}
        renderViewModalContent={(d) => {
          const docHospIds = getDocHospitalIds(d);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { e.currentTarget.src = '/assets/banners/doctors_banner.jpg'; }}
                />
                <div>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.15rem', fontWeight: 800 }}>{d.name}</h4>
                  <p style={{ margin: 0, color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.85rem' }}>{d.title}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: 0 }}>
                {d.bio}
              </p>

              {/* Affiliated Hospitals */}
              <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  Affiliated Partner Hospitals
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {docHospIds.map(hId => (
                    <span key={hId} style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '4px 10px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Building2 size={13} /> {getHospitalName(hId)}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  Specialties & Clinical Expertise
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(d.specialties || []).map(s => (
                    <span key={s} style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-primary)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 700 }}>
                      {getSpecialtyName(s)}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <div>Surgeries: <strong>{formatNumber(d.surgeries)}+</strong></div>
                <div>Experience: <strong>{d.experience} Years</strong></div>
                <div>Fee: <strong>${d.consultationFeeUSD} USD</strong></div>
                <div>Languages: <strong>{d.languages.join(', ')}</strong></div>
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
