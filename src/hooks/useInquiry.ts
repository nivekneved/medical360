import { useState, useCallback } from 'react';
import type { Inquiry, InquiryUrgency } from '../core/types';
import { mockEngine } from '../core/mock/engine';
import { buildInquiryWhatsAppUrl } from '../core/services/whatsapp.service';

// ─── Step form data shape ─────────────────────────────────────────────────────
export interface InquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  specialtyId: string;
  description: string;
  urgency: InquiryUrgency;
  preferredCountry: string;
  budgetMin: string;
  budgetMax: string;
}

const INITIAL_FORM: InquiryFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  countryOfResidence: 'Mauritius',
  specialtyId: '',
  description: '',
  urgency: 'routine',
  preferredCountry: '',
  budgetMin: '',
  budgetMax: '',
};

export function useInquiry() {
  const [step, setStep]             = useState(1);
  const [formData, setFormData]     = useState<InquiryFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [createdInquiry, setCreatedInquiry] = useState<Inquiry | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const totalSteps = 4;

  const updateField = useCallback(<K extends keyof InquiryFormData>(
    key: K,
    value: InquiryFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const nextStep = useCallback(() => setStep(s => Math.min(s + 1, totalSteps)), []);
  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const submit = useCallback(async (specialtyName: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const inquiry = await mockEngine.createInquiry({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        countryOfResidence: formData.countryOfResidence,
        specialtyId: formData.specialtyId,
        description: formData.description,
        urgency: formData.urgency,
        preferredCountry: formData.preferredCountry || undefined,
        budgetRangeUSD:
          formData.budgetMin && formData.budgetMax
            ? { min: parseInt(formData.budgetMin), max: parseInt(formData.budgetMax) }
            : undefined,
      });
      setCreatedInquiry(inquiry);
      setSubmitted(true);

      // Open WhatsApp after submission
      const waUrl = buildInquiryWhatsAppUrl({
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.countryOfResidence,
        specialty: specialtyName,
        description: formData.description,
      });
      window.open(waUrl, '_blank');
    } catch {
      setError('Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  }, [formData]);

  const reset = useCallback(() => {
    setStep(1);
    setFormData(INITIAL_FORM);
    setSubmitted(false);
    setCreatedInquiry(null);
    setError(null);
  }, []);

  return {
    step,
    totalSteps,
    formData,
    submitting,
    submitted,
    createdInquiry,
    error,
    updateField,
    nextStep,
    prevStep,
    submit,
    reset,
  };
}
