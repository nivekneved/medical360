import React from 'react';
import type { Specialty } from '../../../core/types';
import { EntityMultiSelector } from './EntityMultiSelector';

interface SpecialtySelectorProps {
  specialties: Specialty[];
  selectedIds: string[];
  onChange: (newIds: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({
  specialties,
  selectedIds = [],
  onChange,
  label = 'Associated Medical Specialties',
  disabled = false,
}) => {
  return (
    <EntityMultiSelector<Specialty>
      items={specialties}
      selectedIds={selectedIds}
      onChange={onChange}
      label={label}
      disabled={disabled}
      searchPlaceholder="Filter specialties by name..."
      getPrimaryText={(s) => s.name}
      getSecondaryText={(s) => s.procedures ? `${s.procedures.length} procedures` : undefined}
      themeColor="var(--color-primary)"
      themeBackground="rgba(16, 185, 129, 0.08)"
      badgeBackground="rgba(16, 185, 129, 0.12)"
      badgeTextColor="var(--color-primary)"
      filterPredicate={(s, q) => {
        return (
          s.name.toLowerCase().includes(q) ||
          (s.name_fr ? s.name_fr.toLowerCase().includes(q) : false) ||
          s.id.toLowerCase().includes(q)
        );
      }}
    />
  );
};
