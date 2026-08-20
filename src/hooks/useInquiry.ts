import { useState, useCallback, useEffect } from 'react';
import type { Inquiry, InquiryUrgency } from '../core/types';
import { mockEngine } from '../core/mock/engine';
import { buildInquiryWhatsAppUrl } from '../core/services/whatsapp.service';
import {
  validateHoneypot,
  validateSubmissionTiming,
  checkRateLimit,
  sanitizeInput,
} from '../core/services/security.service';

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
  const [honeypot, setHoneypot]     = useState('');
  const [formStartTime, setFormStartTime] = useState<number>(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [createdInquiry, setCreatedInquiry] = useState<Inquiry | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const totalSteps = 4;

  useEffect(() => {
    setFormStartTime(Date.now());
  }, []);

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

    // 1. Honeypot check (Automated spam defense)
    if (!validateHoneypot(honeypot)) {
      console.warn('🛡️ Security: Honeypot field filled. Bot submission silently discarded.');
      setSubmitted(true);
      setSubmitting(false);
      return;
    }

    // 2. Timing check (< 1.5s is flagged)
    if (!validateSubmissionTiming(formStartTime, 1500)) {
      console.warn('🛡️ Security: Inhuman submission speed detected.');
      setError('Suspicious fast activity detected. Please review your details and submit again.');
      setSubmitting(false);
      return;
    }

    // 3. Client Rate Limit
    const rateCheck = checkRateLimit('web_inquiry_submit', 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      setError(`Too many submissions. Please wait ${rateCheck.remainingCooldownSeconds}s before trying again.`);
      setSubmitting(false);
      return;
    }

    try {
      // 4. Input Sanitization
      const cleanFirstName = sanitizeInput(formData.firstName);
      const cleanLastName  = sanitizeInput(formData.lastName);
      const cleanPhone     = sanitizeInput(formData.phone);
      const cleanEmail     = sanitizeInput(formData.email);
      const cleanDesc      = sanitizeInput(formData.description);

      const inquiry = await mockEngine.createInquiry({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone,
        countryOfResidence: formData.countryOfResidence,
        specialtyId: formData.specialtyId,
        description: cleanDesc,
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
        firstName: cleanFirstName,
        lastName: cleanLastName,
        country: formData.countryOfResidence,
        specialty: specialtyName,
        description: cleanDesc,
      });
      window.open(waUrl, '_blank');
    } catch {
      setError('Something went wrong. Please try again or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  }, [formData, honeypot, formStartTime]);

  const reset = useCallback(() => {
    setStep(1);
    setFormData(INITIAL_FORM);
    setHoneypot('');
    setFormStartTime(Date.now());
    setSubmitted(false);
    setCreatedInquiry(null);
    setError(null);
  }, []);

  return {
    step,
    totalSteps,
    formData,
    honeypot,
    setHoneypot,
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
