import { Scale, AlertCircle, FileCheck, ShieldAlert } from 'lucide-react';
import { SEO } from '../../components/SEO/SEO';

export function TermsPage() {
  return (
    <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <SEO
        title="Terms of Service & Healthcare Disclaimer"
        description="Review the terms, conditions, and facilitator obligations of Med360 (owned by NGO Enn Rev Enn Sourir)."
        canonical="/terms"
      />
      
      {/* Hero Header */}
      <section style={{
        background: 'radial-gradient(ellipse at top, #0f172a 0%, #090d10 100%)',
        color: '#ffffff',
        padding: '4rem 1.5rem 3rem',
        textAlign: 'center',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60a5fa',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            <Scale size={16} /> Legal & Patient Rights
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Terms of Service
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Med360 • A company owned by NGO Enn Rev Enn Sourir • Port Louis, Mauritius
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '3.5rem 1.5rem', maxWidth: 880, margin: '0 auto' }}>
        <div style={{
          background: 'var(--bg-card, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '1.25rem',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
          lineHeight: 1.75,
          color: 'var(--text-main, #1e293b)',
        }}>

          {/* Section 1 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={20} color="#3b82f6" /> 1. Nature of Concierge Services
            </h2>
            <p>
              Med360 is a social enterprise company wholly owned by the NGO Enn Rev Enn Sourir. Building on 10+ years of humanitarian medical assistance, Med360 coordinates specialized care in private clinics and abroad for self-funding patients, with 100% of profits reinvested into the NGO to fund medical treatment for the needy.
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="#3b82f6" /> 2. No Doctor-Patient Relationship
            </h2>
            <p>
              Using our website, completing an inquiry form, or conversing with a Med360 case coordinator does not create a doctor-patient relationship. All clinical decisions, diagnostic interpretations, surgical interventions, and medical care plans are made exclusively between the patient and the licensed medical practitioners at the selected hospital or clinic.
            </p>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} color="#3b82f6" /> 3. Cost Estimates & Hospital Billing
            </h2>
            <p>
              Package prices, cost comparisons, and financial calculators displayed on Med360 are benchmark estimates based on hospital tariff guides. Actual medical expenses may vary depending on patient clinical complexity, pre-existing comorbidities, length of ICU stay, or unforeseen complications determined during treatment by the hospital.
            </p>
          </div>

          {/* Section 4 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={20} color="#3b82f6" /> 4. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of Mauritius. Any disputes relating to facilitation services shall be subject to the exclusive jurisdiction of the Courts of Mauritius.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
