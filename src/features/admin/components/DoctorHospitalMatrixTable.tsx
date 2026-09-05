import React from 'react';
import { Building2, Check, UserCheck } from 'lucide-react';
import type { Doctor, Hospital } from '../../../core/types';

interface DoctorHospitalMatrixTableProps {
  filteredDoctors: Doctor[];
  filteredHospitals: Hospital[];
  doctorHospitals: Record<string, Set<string>>;
  onToggleCell: (doctorId: string, hospitalId: string) => void;
  onToggleAllForDoctor: (doctorId: string, value: boolean) => void;
  onToggleAllForHospital: (hospitalId: string, value: boolean) => void;
}

export const DoctorHospitalMatrixTable: React.FC<DoctorHospitalMatrixTableProps> = ({
  filteredDoctors,
  filteredHospitals,
  doctorHospitals,
  onToggleCell,
  onToggleAllForDoctor,
  onToggleAllForHospital,
}) => {
  return (
    <div style={{ overflowX: 'auto', background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--color-border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
        <thead>
          <tr style={{ background: 'var(--color-surface-2)', borderBottom: '1.5px solid var(--color-border)' }}>
            <th style={{ padding: '0.85rem 1rem', textAlign: 'left', minWidth: 220, position: 'sticky', left: 0, background: 'var(--color-surface-2)', zIndex: 2 }}>
              Doctor / Specialist
            </th>
            {filteredHospitals.map((hosp) => {
              const allChecked = filteredDoctors.length > 0 && filteredDoctors.every(d => doctorHospitals[d.id]?.has(hosp.id));
              return (
                <th key={hosp.id} style={{ padding: '0.85rem 0.5rem', textAlign: 'center', minWidth: 140 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-text)', display: 'block', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={hosp.name}>
                      {hosp.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{hosp.city}, {hosp.country}</span>
                    <button
                      type="button"
                      onClick={() => onToggleAllForHospital(hosp.id, !allChecked)}
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
            const allChecked = filteredHospitals.length > 0 && filteredHospitals.every(h => doctorHospitals[doc.id]?.has(h.id));
            const linkedCount = filteredHospitals.filter(h => doctorHospitals[doc.id]?.has(h.id)).length;

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
                        {linkedCount} hosp.
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleAllForDoctor(doc.id, !allChecked)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.65rem', color: 'var(--color-text-muted)', textDecoration: 'underline' }}
                      >
                        {allChecked ? 'None' : 'All'}
                      </button>
                    </div>
                  </div>
                </td>
                {filteredHospitals.map((hosp) => {
                  const isLinked = doctorHospitals[doc.id]?.has(hosp.id);
                  return (
                    <td key={hosp.id} style={{ padding: '0.5rem', textAlign: 'center', background: isLinked ? 'rgba(6, 95, 70, 0.04)' : 'transparent' }}>
                      <button
                        type="button"
                        onClick={() => onToggleCell(doc.id, hosp.id)}
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
  );
};
