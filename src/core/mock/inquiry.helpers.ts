import type { Inquiry, InquiryStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { mapInquiryRow } from '../supabase/repositories';
import { deepSanitize, sanitizeInput } from '../services/security.service';
import type { MockStore } from './store';

export async function liveOrMockGetInquiries(
  isLive: boolean,
  store: MockStore,
  delay: () => Promise<void>
): Promise<Inquiry[]> {
  if (isLive) {
    try {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapInquiryRow);
      }
    } catch (e) {
      console.warn('Supabase getInquiries failed, falling back to local store:', e);
    }
  }
  await delay();
  return [...store.inquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function liveOrMockGetInquiryById(
  isLive: boolean,
  store: MockStore,
  delay: () => Promise<void>,
  id: string
): Promise<Inquiry | null> {
  if (isLive) {
    try {
      const { data, error } = await supabase.from('inquiries').select('*').eq('id', id).single();
      if (!error && data) return mapInquiryRow(data);
    } catch (e) {
      console.warn('Supabase getInquiryById failed:', e);
    }
  }
  await delay();
  return store.inquiries.find(i => i.id === id) ?? null;
}

export async function liveOrMockCreateInquiry(
  store: MockStore,
  save: () => void,
  delay: () => Promise<void>,
  data: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'notes' | 'documents'>
): Promise<Inquiry> {
  const cleanData = deepSanitize(data);
  const id = `inq-${Date.now()}`;
  const now = new Date().toISOString();
  const newInquiry: Inquiry = {
    ...cleanData,
    id,
    createdAt: now,
    updatedAt: now,
    status: 'new',
    documents: [],
    notes: [],
  };

  if (isSupabaseConfigured) {
    try {
      const row = {
        id,
        first_name: cleanData.firstName,
        last_name: cleanData.lastName,
        email: cleanData.email,
        phone: cleanData.phone,
        country_of_residence: cleanData.countryOfResidence,
        specialty_id: cleanData.specialtyId,
        description: cleanData.description,
        urgency: cleanData.urgency || 'routine',
        preferred_country: cleanData.preferredCountry || null,
        budget_min: cleanData.budgetRangeUSD?.min || null,
        budget_max: cleanData.budgetRangeUSD?.max || null,
        documents: [],
        status: 'new',
        assigned_case_manager_id: null,
        notes: [],
        created_at: now,
        updated_at: now,
      };
      const { data: resData, error } = await supabase.from('inquiries').insert([row]).select().single();
      if (!error && resData) {
        const mapped = mapInquiryRow(resData);
        store.inquiries.unshift(mapped);
        save();
        return mapped;
      }
    } catch (e) {
      console.warn('Supabase createInquiry error (falling back to local store):', e);
    }
  }

  await delay();
  store.inquiries.unshift(newInquiry);
  save();
  return newInquiry;
}

export async function liveOrMockUpdateInquiry(
  isLive: boolean,
  store: MockStore,
  save: () => void,
  delay: () => Promise<void>,
  id: string,
  updates: Partial<Inquiry>
): Promise<Inquiry> {
  const now = new Date().toISOString();
  if (isLive) {
    try {
      const rowUpdates: any = { ...updates, updated_at: now };
      const { data, error } = await supabase.from('inquiries').update(rowUpdates).eq('id', id).select().single();
      if (!error && data) return mapInquiryRow(data);
    } catch (e) {
      console.warn('Supabase updateInquiry failed:', e);
    }
  }
  await delay();
  const idx = store.inquiries.findIndex(i => i.id === id);
  if (idx === -1) throw new Error('Inquiry not found');
  const updated = { ...store.inquiries[idx], ...updates, updatedAt: now };
  store.inquiries[idx] = updated;
  save();
  return updated;
}

export async function liveOrMockAddInquiryNote(
  isLive: boolean,
  store: MockStore,
  save: () => void,
  delay: () => Promise<void>,
  id: string,
  content: string,
  authorId: string = 'admin'
): Promise<Inquiry> {
  const inq = store.inquiries.find(i => i.id === id);
  const cleanContent = sanitizeInput(content);
  const newNote = {
    id: `note-${Date.now()}`,
    inquiryId: id,
    authorId: sanitizeInput(authorId),
    content: cleanContent,
    createdAt: new Date().toISOString(),
  };
  const updatedNotes = [...(inq?.notes || []), newNote];

  if (isLive) {
    try {
      const { data, error } = await supabase.from('inquiries').update({ notes: updatedNotes, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (!error && data) return mapInquiryRow(data);
    } catch (e) {
      console.warn('Supabase addInquiryNote failed:', e);
    }
  }

  await delay();
  const idx = store.inquiries.findIndex(i => i.id === id);
  if (idx === -1) throw new Error('Not found');
  const updated = { ...store.inquiries[idx], updatedAt: new Date().toISOString(), notes: updatedNotes };
  store.inquiries[idx] = updated;
  save();
  return updated;
}

export async function liveOrMockDeleteInquiries(
  isLive: boolean,
  store: MockStore,
  save: () => void,
  delay: () => Promise<void>,
  ids: string[]
): Promise<boolean> {
  if (isLive) {
    try {
      await supabase.from('inquiries').delete().in('id', ids);
    } catch (e) {
      console.warn('Supabase deleteInquiries failed:', e);
    }
  }
  await delay();
  const idSet = new Set(ids);
  store.inquiries = store.inquiries.filter(i => !idSet.has(i.id));
  save();
  return true;
}
