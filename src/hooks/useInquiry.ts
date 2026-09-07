import { useState, useCallback, useEffect } from 'react';
import type { Inquiry, InquiryUrgency } from '../core/types';
import { mockEngine } from '../core/mock/engine';
import { buildInquiryWhatsAppUrl } from '../core/services/whatsapp.service';
import { sendInquiryEmail } from '../core/services/email.service';
import {
  validateHoneypot,
  validateSubmissionTiming,
  checkRateLimit,
  sanitizeInput,
  detectSqlInjection,
} from '../core/services/security.service';

// ─── Step form data shape ─────────────────────────────────────────────────────
export interface InquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  specialtyId: string;
  serviceId?: string;
  serviceName?: string;
  hospitalId?: string;
  hospitalName?: string;
  sourcePage?: string;
  sourceUrl?: string;
  description: string;
  urgency: InquiryUrgency;
  preferredCountry: string;
  budgetMin: string;
  budgetMax: string;
}

const getSavedProfile = (): Partial<InquiryFormData> | null => {
  try {
    const raw = localStorage.getItem('med360_user_profile');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const getInitialForm = (): InquiryFormData => {
  const saved = getSavedProfile();
  return {
    firstName: saved?.firstName || '',
    lastName: saved?.lastName || '',
    email: saved?.email || '',
    phone: saved?.phone || '+230 ',
    countryOfResidence: saved?.countryOfResidence || 'Mauritius',
    specialtyId: 'sp-cardiology',
    serviceId: '',
    serviceName: '',
    hospitalId: '',
    hospitalName: '',
    sourcePage: '',
    sourceUrl: '',
    description: '',
    urgency: 'routine',
    preferredCountry: 'India',
    budgetMin: '',
    budgetMax: '',
  };
};

export function useInquiry() {
  const [step, setStep]             = useState(1);
  const [formData, setFormData]     = useState<InquiryFormData>(getInitialForm);
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
    // 4. SQL Injection Check
    const rawInputs = [formData.firstName, formData.lastName, formData.email, formData.phone, formData.description];
    if (rawInputs.some(detectSqlInjection)) {
      console.warn('🛡️ Security: SQL Injection payload detected in inquiry submission.');
      setError('Invalid characters or prohibited database syntax detected. Please review your input.');
      setSubmitting(false);
      return;
    }

    try {
      // 5. Input Sanitization (XSS & Injection Protection)
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
        serviceId: formData.serviceId || undefined,
        serviceName: formData.serviceName || undefined,
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

      // Save user profile for seamless zero-friction return visits
      try {
        localStorage.setItem('med360_user_profile', JSON.stringify({
          firstName: cleanFirstName,
          lastName: cleanLastName,
          email: cleanEmail,
          phone: cleanPhone,
          countryOfResidence: formData.countryOfResidence,
        }));
      } catch {}

      // Trigger Resend email notification
      sendInquiryEmail({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone,
        countryOfResidence: formData.countryOfResidence,
        specialtyId: formData.specialtyId,
        serviceId: formData.serviceId,
        serviceName: formData.serviceName,
        hospitalId: formData.hospitalId,
        hospitalName: formData.hospitalName,
        sourcePage: formData.sourcePage,
        sourceUrl: formData.sourceUrl,
        description: cleanDesc,
        urgency: formData.urgency,
        preferredCountry: formData.preferredCountry,
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
      }, specialtyName).catch(err => console.warn('Email dispatch failed:', err));

      // Open WhatsApp after submission
      const waUrl = buildInquiryWhatsAppUrl({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        country: formData.countryOfResidence,
        specialty: specialtyName,
        serviceName: formData.serviceName,
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
    setFormData(getInitialForm());
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
