import type { Hospital } from '../types';

// ─── Hospital Service ─────────────────────────────────────────────────────────
// Single responsibility: business logic for hospital filtering and ranking

export interface HospitalFilters {
  country?: string;
  specialtyId?: string;
  accreditation?: string;
  minRating?: number;
  searchQuery?: string;
}

/**
 * Filters a list of hospitals by the given criteria.
 */
export function filterHospitals(hospitals: Hospital[], filters: HospitalFilters): Hospital[] {
  return hospitals.filter((hospital) => {
    if (filters.country && hospital.country !== filters.country) return false;
    if (filters.specialtyId && !hospital.specialties.includes(filters.specialtyId)) return false;
    if (filters.accreditation && !hospital.accreditations.includes(filters.accreditation)) return false;
    if (filters.minRating && hospital.rating < filters.minRating) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchable = `${hospital.name} ${hospital.city} ${hospital.country} ${hospital.description}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    return true;
  });
}

/**
 * Ranks hospitals by rating (descending).
 */
export function rankHospitalsByRating(hospitals: Hospital[]): Hospital[] {
  return [...hospitals].sort((a, b) => b.rating - a.rating);
}

/**
 * Gets unique countries from a list of hospitals.
 */
export function getUniqueCountries(hospitals: Hospital[]): string[] {
  return [...new Set(hospitals.map((h) => h.country))].sort();
}

/**
 * Gets unique accreditations from a list of hospitals.
 */
export function getUniqueAccreditations(hospitals: Hospital[]): string[] {
  const all = hospitals.flatMap((h) => h.accreditations);
  return [...new Set(all)].sort();
}
