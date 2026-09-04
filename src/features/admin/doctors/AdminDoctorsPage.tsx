import { useState, useEffect } from 'react';
import { Building2, Edit3, Eye } from 'lucide-react';
import { mockEngine } from '../../../core/mock/engine';
import { useHospitals } from '../../../hooks/useHospitals';
import { useSpecialties } from '../../../hooks/useSpecialties';
import { formatNumber } from '../../../core/services/format.service';
import { AdminEntityManager, type FieldDefinition, type FilterDefinition, type SortOption } from '../components/AdminEntityManager';
import type { Doctor } from '../../../core/types';

export function AdminDoctorsPage() {
  const [doctors, setDoctors]         = useState<Doctor[]>([]);
  const [loading, setLoading]         = useState(true);
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

  const doctorFields: FieldDefinition<Doctor>[] = [
    { key: 'name', label: 'Doctor Name & Title', type: 'text', required: true },
    { key: 'title', label: 'Professional Role / Department Head', type: 'text', required: true },
    {
      key: 'hospitalId',
      label: 'Primary Affiliated Hospital',
      type: 'select',
      required: true,
      options: hospitals.map(h => ({ value: h.id, label: `${h.name} (${h.country})` })),
    },
    { key: 'imageUrl', label: 'Doctor Portrait Image URL', type: 'image', required: true },
    { key: 'experience', label: 'Years of Experience', type: 'number', required: true },
    { key: 'surgeries', label: 'Lifetime Surgeries Performed', type: 'number', required: true },
    { key: 'consultationFeeUSD', label: 'Consultation Fee (USD)', type: 'number', required: true },
    { key: 'specialties', label: 'Specialty IDs (e.g. sp-cardiology, sp-oncology)', type: 'array', required: true },
    { key: 'qualifications', label: 'Qualifications & Fellowships (FRCS, MD, FACC)', type: 'array', required: true },
    { key: 'languages', label: 'Spoken Languages (English, French, Hindi)', type: 'array', required: true },
    { key: 'bio', label: 'Full Professional Biography', type: 'textarea', required: true },
    { key: 'featured', label: 'Featured on Homepage Specialists Carousel', type: 'boolean' },
  ];

  const exportColumns = [
    { header: 'Doctor Name', key: 'name' },
    { header: 'Title / Role', key: 'title' },
    { header: 'Hospital', key: 'hospitalId', format: (v: string) => getHospitalName(v) },
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
      predicate: (d, val) => d.specialties.includes(val),
    },
    {
      key: 'hospital',
      label: 'Hospital',
      options: [
        { value: 'all', label: 'All Hospitals' },
        ...hospitals.map(h => ({ value: h.id, label: h.name })),
      ],
      predicate: (d, val) => d.hospitalId === val,
    },
  ];

  const handleSave = async (item: Doctor, isNew: boolean) => {
    if (isNew) {
      await mockEngine.createDoctor(item);
    } else {
      await mockEngine.updateDoctor(item.id, item);
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
    hospitalId: hospitals[0]?.id || 'hosp-apollo',
    specialties: ['sp-cardiology'],
    qualifications: ['MBBS', 'MS', 'MCh'],
    experience: 15,
    surgeries: 3000,
    languages: ['English', 'French'],
    imageUrl: '/assets/banners/dr_wong_chiung_ing.jpg',
    bio: 'Dedicated international surgeon with extensive clinical expertise.',
    consultationFeeUSD: 60,
    featured: true,
  });

  return (
    <AdminEntityManager<Doctor>
      title="7 Elite Specialists"
      subtitle="Manage internationally recognized chief surgeons, clinical credentials, and fees"
      entityName="Specialist"
      items={doctors}
      loading={loading}
      fields={doctorFields}
      exportColumns={exportColumns}
      sortOptions={sortOptions}
      filterDefinitions={filterDefinitions}
      searchPredicate={(d, q) =>
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        d.title.toLowerCase().includes(q.toLowerCase()) ||
        d.bio.toLowerCase().includes(q.toLowerCase()) ||
        d.languages.some(l => l.toLowerCase().includes(q.toLowerCase()))
      }
      onSave={handleSave}
      onDelete={handleDelete}
      getInitialItem={getInitialDoctor}
      renderCard={(d, onEdit, onView, isSelected, onToggleSelect) => (
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
              <Building2 size={13} color="var(--color-text-muted)" /> {getHospitalName(d.hospitalId)}
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {d.specialties.map(s => (
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
      )}
      renderTableColumns={['Specialist', 'Hospital', 'Specialties', 'Surgeries & Exp', 'Fee', 'Actions']}
      renderTableRow={(d, onEdit, onView, isSelected, onToggleSelect) => (
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
            {getHospitalName(d.hospitalId)}
          </td>
          <td style={{ padding: '0.875rem 0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {d.specialties.map(s => (
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
      )}
      renderViewModalContent={(d) => (
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
              <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{getHospitalName(d.hospitalId)}</p>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: 0 }}>
            {d.bio}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', background: 'var(--color-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <div>Surgeries: <strong>{formatNumber(d.surgeries)}+</strong></div>
            <div>Experience: <strong>{d.experience} Years</strong></div>
            <div>Fee: <strong>${d.consultationFeeUSD} USD</strong></div>
            <div>Languages: <strong>{d.languages.join(', ')}</strong></div>
          </div>
        </div>
      )}
    />
  );
}
