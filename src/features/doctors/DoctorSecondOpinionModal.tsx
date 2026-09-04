import { useState } from 'react';
import { X, CheckCircle2, Send, ShieldCheck, Stethoscope } from 'lucide-react';
import type { Doctor, Hospital } from '../../core/types';
import { mockEngine } from '../../core/mock/engine';
import { useTranslation } from 'react-i18next';

interface DoctorSecondOpinionModalProps {
  doctor: Doctor;
  hospital?: Hospital;
  onClose: () => void;
}

export function DoctorSecondOpinionModal({ doctor, hospital, onClose }: DoctorSecondOpinionModalProps) {
  const { i18n } = useTranslation();
  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [condition, setCondition] = useState('');
  const [urgency, setUrgency] = useState<'urgent' | 'routine' | 'emergency'>('urgent');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone || !condition) {
      setError(isFr ? 'Veuillez remplir votre prénom, téléphone et décrire votre cas.' : 'Please fill in your name, phone number, and brief description.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await mockEngine.createInquiry({
        firstName,
        lastName: lastName || '-',
        email: email || `${firstName.toLowerCase()}@patient.mu`,
        phone,
        countryOfResidence: 'Mauritius',
        specialtyId: doctor.specialties[0] || 'sp-cardiology',
        description: `[Direct Second Opinion with ${doctor.name} - ${doctor.title}]: ${condition}`,
        urgency,
        preferredCountry: hospital?.country || 'India',
        budgetRangeUSD: { min: 3000, max: 15000 },
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: 580,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
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
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: '0.85rem' }}>
                {error}
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
                  required
                  placeholder="e.g. Jean / Priya"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ height: 40, fontSize: '0.875rem' }}
                />
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
                  required
                  placeholder="+230 5..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ height: 40, fontSize: '0.875rem' }}
                />
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
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ height: 40, fontSize: '0.875rem' }}
                />
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
                required
                placeholder={isFr ? 'Résumez vos derniers examens, scanners ou l\'avis de votre médecin local...' : 'Briefly describe your diagnosis, current symptoms, or local doctor recommendations...'}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                style={{ fontSize: '0.875rem', resize: 'vertical' }}
              />
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
