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
              <ShieldAlert size={20} color="#3b82f6" /> 4. Patient Responsibilities
            </h2>
            <p>
              You agree to provide accurate, complete and truthful medical information and records, as treatment plans and quotes depend entirely on them. You are responsible for holding valid travel documents and complying with medical visa requirements, and for respecting each hospital's admission policies. Inquiries concerning a minor must be made by a parent or legal guardian. All treatment decisions remain yours, and we encourage you to seek second opinions before proceeding.
            </p>
          </div>

          {/* Section 5 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={20} color="#3b82f6" /> 5. Bookings, Payments & Hospital Billing
            </h2>
            <p>
              Medical fees are payable <strong>directly to the treating hospital</strong> according to its own billing policy. Med360's coordination, opinions and planning assistance are provided free of charge unless a specific service is covered by a written agreement signed by both parties. Any advance collected through Med360 on behalf of a hospital is itemised, documented and attributable to your hospital account.
            </p>
          </div>

          {/* Section 6 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} color="#3b82f6" /> 6. Cancellations, Changes & Refunds
            </h2>
            <p>
              Hospitals may amend or reschedule procedures for clinical reasons beyond anyone's control. Cancellations and refunds follow the policy of the hospital (and of airlines, hotels or visa authorities where those services were booked). Med360 will assist you in obtaining refunds and re-booking wherever possible, but amounts already committed to third parties remain governed by those third parties' policies.
            </p>
          </div>

          {/* Section 7 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="#3b82f6" /> 7. Limitation of Liability
            </h2>
            <p>
              Med360's role is limited to facilitation and coordination. To the maximum extent permitted by Mauritian law, Med360 Ltd shall not be liable for clinical outcomes, acts or omissions of hospitals, doctors, laboratories, airlines, hotels or public authorities, nor for any indirect or consequential loss. Nothing in these Terms excludes liability that cannot lawfully be excluded under the laws of the Republic of Mauritius.
            </p>
          </div>

          {/* Section 8 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={20} color="#3b82f6" /> 8. Third-Party Services & Links
            </h2>
            <p>
              Hospitals, laboratories, airlines and hotels operate under their own terms and conditions. External links are provided for convenience only and do not constitute endorsement. Your dealings with any third party found through this website are solely between you and that third party.
            </p>
          </div>

          {/* Section 9 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={20} color="#3b82f6" /> 9. Website Content & Acceptable Use
            </h2>
            <p>
              All website content, branding and imagery are the property of Med360 Ltd and may not be copied, scraped or reused without written permission. Patient stories are published with consent and identifying details minimised. You agree not to misuse the website, attempt to breach its security, or submit unlawful, false or abusive content through any form.
            </p>
          </div>

          {/* Section 10 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={20} color="#3b82f6" /> 10. Governing Law & Jurisdiction
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
