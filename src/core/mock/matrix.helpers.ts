import type { Doctor, Hospital } from '../types';

export interface DoctorAssociationMapping {
  doctorId: string;
  hospitalId?: string;
  hospitalIds?: string[];
  specialtyIds?: string[];
}

export async function associateSpecialtyHospitals(
  specialtyId: string,
  hospitalIds: string[],
  getHospitals: () => Promise<Hospital[]>,
  updateHospital: (id: string, updates: Partial<Hospital>) => Promise<Hospital>
): Promise<void> {
  const targetHospSet = new Set(hospitalIds);
  const allHospitals = await getHospitals();
  for (const hosp of allHospitals) {
    const hasSpec = hosp.specialties.includes(specialtyId);
    const shouldHave = targetHospSet.has(hosp.id);
    if (shouldHave && !hasSpec) {
      await updateHospital(hosp.id, { specialties: [...hosp.specialties, specialtyId] });
    } else if (!shouldHave && hasSpec) {
      await updateHospital(hosp.id, { specialties: hosp.specialties.filter(s => s !== specialtyId) });
    }
  }
}

export async function associateSpecialtyDoctors(
  specialtyId: string,
  doctorIds: string[],
  getDoctors: () => Promise<Doctor[]>,
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<Doctor>
): Promise<void> {
  const targetDocSet = new Set(doctorIds);
  const allDoctors = await getDoctors();
  for (const doc of allDoctors) {
    const hasSpec = (doc.specialties || []).includes(specialtyId);
    const shouldHave = targetDocSet.has(doc.id);
    if (shouldHave && !hasSpec) {
      await updateDoctor(doc.id, { specialties: [...(doc.specialties || []), specialtyId] });
    } else if (!shouldHave && hasSpec) {
      await updateDoctor(doc.id, { specialties: (doc.specialties || []).filter(s => s !== specialtyId) });
    }
  }
}

export async function associateHospitalDoctors(
  hospitalId: string,
  doctorIds: string[],
  getDoctors: () => Promise<Doctor[]>,
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<Doctor>
): Promise<void> {
  const targetDocSet = new Set(doctorIds);
  const allDoctors = await getDoctors();
  for (const doc of allDoctors) {
    const currentHospIds = doc.hospitalIds?.length ? [...doc.hospitalIds] : (doc.hospitalId ? [doc.hospitalId] : []);
    const hasHosp = currentHospIds.includes(hospitalId);
    const shouldHave = targetDocSet.has(doc.id);
    if (shouldHave && !hasHosp) {
      const updated = [...currentHospIds, hospitalId];
      await updateDoctor(doc.id, { hospitalIds: updated, hospitalId: updated[0] });
    } else if (!shouldHave && hasHosp) {
      const updated = currentHospIds.filter(id => id !== hospitalId);
      await updateDoctor(doc.id, { hospitalIds: updated, hospitalId: updated[0] || '' });
    }
  }
}

export async function saveAllDoctorAssociations(
  mapping: DoctorAssociationMapping[],
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<Doctor>
): Promise<void> {
  for (const item of mapping) {
    const updates: Partial<Doctor> = {};
    if (item.hospitalIds !== undefined) {
      updates.hospitalIds = Array.from(new Set(item.hospitalIds));
      updates.hospitalId = updates.hospitalIds[0] || '';
    } else if (item.hospitalId !== undefined) {
      updates.hospitalId = item.hospitalId;
      updates.hospitalIds = item.hospitalId ? [item.hospitalId] : [];
    }
    if (item.specialtyIds !== undefined) {
      updates.specialties = Array.from(new Set(item.specialtyIds));
    }
    if (Object.keys(updates).length > 0) {
      await updateDoctor(item.doctorId, updates);
    }
  }
}
