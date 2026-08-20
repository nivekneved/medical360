import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useInquiry } from '../../hooks/useInquiry';
import { useSpecialties } from '../../hooks/useSpecialties';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './DescribeNeed.css';

const URGENCY_OPTIONS = [
  { value: 'routine',   label: 'Routine',   desc: 'No immediate urgency' },
  { value: 'urgent',    label: 'Urgent',    desc: 'Need appointment within 2 weeks' },
  { value: 'emergency', label: 'Emergency', desc: 'Require immediate assistance' },
] as const;

const COUNTRIES = ['Mauritius', 'Réunion Island', 'Comoros', 'Madagascar', 'Seychelles', 'Maldives', 'South Africa', 'Kenya', 'France', 'United Kingdom', 'Other'];

const STEPS = ['Personal Details', 'Medical Need', 'Preferences', 'Review & Submit'];

export function DescribeNeedPage() {
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const { specialties } = useSpecialties();
  const {
    step, totalSteps, formData, submitting, submitted,
    updateField, nextStep, prevStep, submit, reset, error
  } = useInquiry();

  // Pre-select specialty from URL param
  const preSpecialty = params.get('specialty');
  if (preSpecialty && !formData.specialtyId) updateField('specialtyId', preSpecialty);

  const selectedSpecialty = specialties.find(s => s.id === formData.specialtyId);

  if (submitted) {
    return (
      <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div className="success-icon">
            <Check size={40} />
          </div>
          <h1 className="text-h2" style={{ marginBottom: '1rem' }}>Inquiry Submitted!</h1>
          <p className="text-lead" style={{ marginBottom: '2rem' }}>
            Thank you! Your case has been received. A dedicated case manager from Medical 360 will contact you within <strong>24 hours</strong>. We've also opened WhatsApp for you to chat with us right now.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
              <MessageCircle size={18} /> WhatsApp Us Now
            </a>
            <button className="btn btn-outline" onClick={() => { reset(); navigate('/'); }}>
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <section className="page-hero page-hero--sm">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <h1 className="text-h1" style={{ color: 'white' }}>Describe Your Need</h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500 }}>
            Fill in the form below and our medical team will get back to you with personalised hospital recommendations — free of charge.
          </p>
        </div>
      </section>

      <div className="container wizard-container">
        {/* Step Indicator */}
        <div className="wizard-steps">
          {STEPS.map((label, i) => (
            <div key={label} className={`wizard-step ${i + 1 === step ? 'wizard-step--active' : ''} ${i + 1 < step ? 'wizard-step--done' : ''}`}>
              <div className="wizard-step__num">
                {i + 1 < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="wizard-step__label">{label}</span>
              {i < STEPS.length - 1 && <div className="wizard-step__line" />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="wizard-card">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="wizard-body animate-fade-in">
              <h2 className="wizard-title">Your Personal Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-firstName">First Name *</label>
                  <input id="wiz-firstName" className="form-input" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="e.g. Rajesh" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-lastName">Last Name *</label>
                  <input id="wiz-lastName" className="form-input" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="e.g. Ramkhelawon" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-email">Email Address *</label>
                  <input id="wiz-email" className="form-input" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="your@email.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="wiz-phone">Phone / WhatsApp *</label>
                  <input id="wiz-phone" className="form-input" type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+230 5x xxx xxx" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wiz-country">Country of Residence *</label>
                <select id="wiz-country" className="form-select" value={formData.countryOfResidence} onChange={e => updateField('countryOfResidence', e.target.value)}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Medical Need */}
          {step === 2 && (
            <div className="wizard-body animate-fade-in">
              <h2 className="wizard-title">Describe Your Medical Need</h2>
              <div className="form-group">
                <label className="form-label" htmlFor="wiz-specialty">Medical Specialty *</label>
                <select id="wiz-specialty" className="form-select" value={formData.specialtyId} onChange={e => updateField('specialtyId', e.target.value)}>
                  <option value="">-- Select Specialty --</option>
                  {specialties.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="wiz-description">Describe Your Condition *</label>
                <textarea
                  id="wiz-description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={e => updateField('description', e.target.value)}
                  placeholder="Please describe your medical condition, any diagnosis you have received, and what type of treatment or opinion you are looking for…"
                  style={{ minHeight: 160 }}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Urgency *</label>
                <div className="urgency-options">
                  {URGENCY_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`urgency-option ${formData.urgency === opt.value ? 'urgency-option--selected' : ''}`}
                      onClick={() => updateField('urgency', opt.value)}
                      id={`urgency-${opt.value}-btn`}
                    >
                      <strong>{opt.label}</strong>
                      <span>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="wizard-body animate-fade-in">
              <h2 className="wizard-title">Your Preferences</h2>
              <div className="form-group">
                <label className="form-label" htmlFor="wiz-preferredCountry">Preferred Destination (optional)</label>
                <select id="wiz-preferredCountry" className="form-select" value={formData.preferredCountry} onChange={e => updateField('preferredCountry', e.target.value)}>
                  <option value="">No preference — recommend best option</option>
                  <option value="India">India</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="UAE">UAE</option>
                  <option value="Turkey">Turkey</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Approximate Budget (USD) (optional)</label>
                <div className="form-row">
                  <div className="form-group">
                    <input id="wiz-budgetMin" className="form-input" type="number" placeholder="Min (e.g. 5000)" value={formData.budgetMin} onChange={e => updateField('budgetMin', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <input id="wiz-budgetMax" className="form-input" type="number" placeholder="Max (e.g. 20000)" value={formData.budgetMax} onChange={e => updateField('budgetMax', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="wizard-info">
                <p>💡 <strong>No budget?</strong> Don't worry — we'll provide you with the best options across all price points. Med360's service is always <strong>free for patients</strong>.</p>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="wizard-body animate-fade-in">
              <h2 className="wizard-title">Review & Submit</h2>
              <div className="review-summary">
                <div className="review-row"><span>Name</span><strong>{formData.firstName} {formData.lastName}</strong></div>
                <div className="review-row"><span>Email</span><strong>{formData.email}</strong></div>
                <div className="review-row"><span>Phone</span><strong>{formData.phone}</strong></div>
                <div className="review-row"><span>Country</span><strong>{formData.countryOfResidence}</strong></div>
                <div className="review-row"><span>Specialty</span><strong>{selectedSpecialty?.name ?? formData.specialtyId}</strong></div>
                <div className="review-row"><span>Urgency</span><strong style={{ textTransform: 'capitalize' }}>{formData.urgency}</strong></div>
                {formData.preferredCountry && <div className="review-row"><span>Destination</span><strong>{formData.preferredCountry}</strong></div>}
              </div>
              <div className="review-note">
                <p>By submitting, you agree that Medical 360 will contact you regarding your inquiry. Your information is kept strictly confidential.</p>
                <p>After submission, WhatsApp will open so you can connect with us instantly.</p>
              </div>
              {error && <div className="wizard-error">{error}</div>}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="wizard-footer">
            {step > 1 && (
              <button className="btn btn-outline" onClick={prevStep} id="wiz-prev-btn">
                <ArrowLeft size={16} /> Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < totalSteps ? (
              <button
                className="btn btn-primary"
                onClick={nextStep}
                id="wiz-next-btn"
                disabled={
                  (step === 1 && (!formData.firstName || !formData.email || !formData.phone)) ||
                  (step === 2 && (!formData.specialtyId || !formData.description))
                }
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => submit(selectedSpecialty?.name ?? formData.specialtyId)}
                id="wiz-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting…' : 'Submit & Open WhatsApp'}
                <MessageCircle size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
