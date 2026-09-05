import React, { useState } from 'react';
import type { Hospital } from '../../../core/types';
import { EntityMultiSelector } from './EntityMultiSelector';

interface HospitalSelectorProps {
  hospitals: Hospital[];
  selectedIds: string[];
  onChange: (newIds: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export const HospitalSelector: React.FC<HospitalSelectorProps> = ({
  hospitals,
  selectedIds = [],
  onChange,
  label = 'Partner Hospitals Offering This Specialty',
  disabled = false,
}) => {
  const [countryFilter, setCountryFilter] = useState('all');
  const countries = ['all', ...Array.from(new Set(hospitals.map((h) => h.country))).sort()];

  const countryFilterSlot = (
    <select
      className="form-input"
      value={countryFilter}
      onChange={(e) => setCountryFilter(e.target.value)}
      disabled={disabled}
      style={{ width: 140, fontSize: '0.82rem', height: 34 }}
    >
      {countries.map((c) => (
        <option key={c} value={c}>
          {c === 'all' ? 'All Countries' : c}
        </option>
      ))}
    </select>
  );

  return (
    <EntityMultiSelector<Hospital>
      items={hospitals}
      selectedIds={selectedIds}
      onChange={onChange}
      label={label}
      disabled={disabled}
      searchPlaceholder="Search hospitals by name, city..."
      getPrimaryText={(h) => h.name}
      getSecondaryText={(h) => `📍 ${h.city}, ${h.country}`}
      themeColor="#3b82f6"
      themeBackground="rgba(59, 130, 246, 0.08)"
      badgeBackground="rgba(59, 130, 246, 0.12)"
      badgeTextColor="#2563eb"
      extraFilterSlot={countryFilterSlot}
      filterPredicate={(h, q) => {
        if (countryFilter !== 'all' && h.country !== countryFilter) return false;
        return (
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.country.toLowerCase().includes(q)
        );
      }}
    />
  );
};
