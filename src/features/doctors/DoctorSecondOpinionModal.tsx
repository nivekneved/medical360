import { useState } from 'react';
import { X, CheckCircle2, Send, ShieldCheck, Stethoscope, AlertCircle } from 'lucide-react';
import type { Doctor, Hospital } from '../../core/types';
import { mockEngine } from '../../core/mock/engine';
import { useTranslation } from 'react-i18next';
import { Honeypot } from '../../components/Honeypot/Honeypot';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateDescription,
  isHoneypotClean,
} from '../../core/services/validation.service';
import { sanitizeInput, checkRateLimit } from '../../core/services/security.service';

interface DoctorSecondOpinionModalProps {
  doctor: Doctor;
  hospital?: Hospital;
  onClose: () => void;
}

export function DoctorSecondOpinionModal({ doctor, hospital, onClose }: DoctorSecondOpinionModalProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';
  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [condition, setCondition] = useState('');
  const [urgency, setUrgency] = useState<'urgent' | 'routine' | 'emergency'>('urgent');
  const [honeypot, setHoneypot] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ firstName?: string; email?: string; phone?: string; condition?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validateInputs = () => {
    const errors: typeof fieldErrors = {};
    const fnVal = validateName(firstName, l10n('Prénom', 'Prenon', 'First Name'), 2);
    if (!fnVal.isValid) errors.firstName = fnVal.error;

    if (email.trim()) {
      const emVal = validateEmail(email, false);
      if (!emVal.isValid) errors.email = emVal.error;
    }

    const phVal = validatePhone(phone, true);
    if (!phVal.isValid) errors.phone = phVal.error;

    const descVal = validateDescription(condition, l10n('Description médicale', 'Deskripsion medikal', 'Medical Description'), 10);
    if (!descVal.isValid) errors.condition = descVal.error;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot check
    if (!isHoneypotClean(honeypot)) {
      console.warn('🛡️ Security: Honeypot triggered in Doctor Second Opinion Modal. Bot discarded.');
      setSubmitted(true);
      setTimeout(onClose, 2500);
      return;
    }

    // 2. Validate all inputs
    if (!validateInputs()) {
      return;
    }

    // 3. Rate limiting check
    const rateCheck = checkRateLimit('doctor_second_opinion_submit', 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      setFormError(`Too many requests. Please wait ${rateCheck.remainingCooldownSeconds}s before trying again.`);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const cleanFirst = sanitizeInput(firstName);
      const cleanLast = sanitizeInput(lastName);
      const cleanEmail = sanitizeInput(email);
      const cleanPhone = sanitizeInput(phone);
      const cleanCondition = sanitizeInput(condition);

      await mockEngine.createInquiry({
        firstName: cleanFirst,
        lastName: cleanLast || '-',
        email: cleanEmail || `${cleanFirst.toLowerCase()}@patient.mu`,
        phone: cleanPhone,
        countryOfResidence: 'Mauritius',
        specialtyId: doctor.specialties[0] || 'sp-cardiology',
        description: `[Direct Second Opinion with ${doctor.name} - ${doctor.title}]: ${cleanCondition}`,
        urgency,
        preferredCountry: hospital?.country || 'India',
        budgetRangeUSD: { min: 3000, max: 15000 },
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: 780,
      margin: '0 auto 2.5rem',
      animation: 'fadeIn 0.25s ease-out',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Stethoscope size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              {isFr ? 'Deuxième Avis Chirurgical Gratuit' : isKr ? 'Deziem Lavi Medikal Gratis' : 'Request Free Surgical Second Opinion'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Doctor Summary Header Pill */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'var(--color-surface-2)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
            onError={(e) => { e.currentTarget.src = '/assets/banners/doctors_banner.jpg'; }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text)' }}>{doctor.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{doctor.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, marginTop: 2 }}>
              🏆 {doctor.surgeries?.toLocaleString()} {isFr ? 'interventions réussies' : 'successful surgeries'} · {doctor.experience} {isFr ? 'ans d\'expérience' : 'years exp.'}
            </div>
          </div>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <CheckCircle2 size={54} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
              {isFr ? 'Demande Transmise avec Succès !' : 'Second Opinion Request Submitted!'}
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>
              {isFr
                ? `Votre dossier médical a été transmis à l'équipe du ${doctor.name}. Notre coordinateur vous appellera sous 24h.`
                : `Your case is being forwarded to ${doctor.name}'s clinical team. A dedicated Med360 coordinator will contact you within 24 hours.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Anti-Bot Honeypot */}
            <Honeypot value={honeypot} onChange={setHoneypot} id="doc_opinion_hp" name="doc_opinion_hp" />

            {formError && (
              <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={16} /> {formError}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                  {isFr ? 'Prénom *' : 'First Name *'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Jean / Priya"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (fieldErrors.firstName) setFieldErrors(prev => ({ ...prev, firstName: undefined }));
                  }}
                  style={{ height: 40, fontSize: '0.875rem', borderColor: fieldErrors.firstName ? '#ef4444' : undefined }}
                />
                {fieldErrors.firstName && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 3, display: 'block', fontWeight: 600 }}>
                    {fieldErrors.firstName}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                  {isFr ? 'Nom' : 'Last Name'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dupont"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ height: 40, fontSize: '0.875rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                  {isFr ? 'Numéro Téléphone / WhatsApp *' : 'Phone / WhatsApp Number *'}
                </label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+230 5..."
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: undefined }));
                  }}
                  style={{ height: 40, fontSize: '0.875rem', borderColor: fieldErrors.phone ? '#ef4444' : undefined }}
                />
                {fieldErrors.phone && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 3, display: 'block', fontWeight: 600 }}>
                    {fieldErrors.phone}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                  {isFr ? 'Email' : 'Email Address'}
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  style={{ height: 40, fontSize: '0.875rem', borderColor: fieldErrors.email ? '#ef4444' : undefined }}
                />
                {fieldErrors.email && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 3, display: 'block', fontWeight: 600 }}>
                    {fieldErrors.email}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                {isFr ? 'Urgence Médicale' : 'Medical Urgency'}
              </label>
              <select
                className="form-input"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                style={{ height: 40, fontSize: '0.875rem', cursor: 'pointer' }}
              >
                <option value="urgent">{isFr ? 'Urgent (Soins requis sous 2 à 3 semaines)' : 'Urgent (Care needed in 2-3 weeks)'}</option>
                <option value="routine">{isFr ? 'Routine (Recherche d\'options & devis)' : 'Routine (Exploring treatment options)'}</option>
                <option value="emergency">{isFr ? 'Critique / Immédiat' : 'Emergency / Critical'}</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 4 }}>
                {isFr ? 'Description de Votre Diagnostic / Symptômes *' : 'Describe Medical Diagnosis & Current Reports *'}
              </label>
              <textarea
                className="form-input"
                rows={3}
                placeholder={isFr ? 'Résumez vos derniers examens, scanners ou l\'avis de votre médecin local...' : 'Briefly describe your diagnosis, current symptoms, or local doctor recommendations...'}
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value);
                  if (fieldErrors.condition) setFieldErrors(prev => ({ ...prev, condition: undefined }));
                }}
                style={{ fontSize: '0.875rem', resize: 'vertical', borderColor: fieldErrors.condition ? '#ef4444' : undefined }}
              />
              {fieldErrors.condition && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 3, display: 'block', fontWeight: 600 }}>
                  {fieldErrors.condition}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} color="var(--color-primary)" />
              <span>{isFr ? 'Vos données de santé sont strictement confidentielles et traitées par nos médecins.' : 'Your medical records are encrypted and reviewed only by licensed medical coordinators.'}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onClose}
                style={{ flex: 1, fontWeight: 700 }}
              >
                {isFr ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-sm"
                style={{ flex: 2, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                {submitting ? (
                  <span>{isFr ? 'Envoi en cours...' : 'Submitting...'}</span>
                ) : (
                  <>
                    <Send size={15} />
                    <span>{isFr ? 'Soumettre Gratuitement' : 'Submit Free Request'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
