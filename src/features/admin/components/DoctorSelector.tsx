import React from 'react';
import type { Doctor, Hospital, Specialty } from '../../../core/types';
import { EntityMultiSelector } from './EntityMultiSelector';

interface DoctorSelectorProps {
  doctors: Doctor[];
  selectedIds: string[];
  onChange: (newIds: string[]) => void;
  hospitals?: Hospital[];
  specialties?: Specialty[];
  label?: string;
  disabled?: boolean;
}

export const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctors,
  selectedIds = [],
  onChange,
  hospitals = [],
  label = 'Associated Medical Specialists / Doctors',
  disabled = false,
}) => {
  return (
    <EntityMultiSelector<Doctor>
      items={doctors}
      selectedIds={selectedIds}
      onChange={onChange}
      label={label}
      disabled={disabled}
      searchPlaceholder="Search doctors by name, specialty, or hospital..."
      getPrimaryText={(doc) => doc.name}
      getSecondaryText={(doc) => {
        const hosp = hospitals.find((h) => h.id === doc.hospitalId);
        return hosp ? hosp.name : doc.title;
      }}
      getImageUrl={(doc) => doc.imageUrl || '/assets/banners/dr_wong_chiung_ing.jpg'}
      themeColor="#8b5cf6"
      themeBackground="rgba(139, 92, 246, 0.08)"
      badgeBackground="rgba(139, 92, 246, 0.12)"
      badgeTextColor="#7c3aed"
      filterPredicate={(doc, q) => {
        const hosp = hospitals.find((h) => h.id === doc.hospitalId);
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.title.toLowerCase().includes(q) ||
          (hosp ? hosp.name.toLowerCase().includes(q) : false)
        );
      }}
    />
  );
};
