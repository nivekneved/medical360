import { AlertTriangle, Stethoscope, Siren, TrendingDown, Building2, Link2, MessageCircleQuestion, LifeBuoy } from 'lucide-react';
import { SEO } from '../../components/SEO/SEO';

export function MedicalDisclaimerPage() {
  return (
    <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <SEO
        title="Medical Disclaimer"
        description="Important medical disclaimer for Med360 — a healthcare facilitator, not a medical provider. Content is informational only and never a substitute for professional medical advice."
        canonical="/medical-disclaimer"
      />

      {/* Hero Header */}
      <section style={{
        background: 'radial-gradient(ellipse at top, #0f172a 0%, #090d10 100%)',
        color: '#ffffff',
        padding: '4rem 1.5rem 3rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem', borderRadius: '9999px',
            background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem',
          }}>
            <AlertTriangle size={16} /> Please Read Carefully
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Medical Disclaimer
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Med360 is a healthcare facilitator — not a hospital, clinic or medical laboratory.
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

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} color="#dc2626" /> 1. Informational Purposes Only
            </h2>
            <p>
              All content on this website — including hospital profiles, treatment descriptions, recovery timelines, cost ranges and patient stories — is provided for <strong>general information only</strong>. It does not constitute medical advice, diagnosis or treatment, and it must never be used as a substitute for a consultation with a qualified, licensed healthcare professional who knows your personal medical history.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Stethoscope size={20} color="var(--color-primary)" /> 2. No Doctor–Patient Relationship
            </h2>
            <p>
              Browsing this website, submitting an inquiry, receiving a preliminary opinion or cost estimate, or speaking with a Med360 Patient Navigator does <strong>not</strong> create a doctor–patient relationship. All clinical decisions, diagnoses and treatments are made exclusively between you and the licensed medical practitioners at the hospital you choose.
            </p>
          </div>

          <div style={{
            marginBottom: '2.5rem',
            background: 'rgba(239, 68, 68, 0.06)',
            border: '1.5px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '0.9rem',
            padding: '1.25rem 1.5rem',
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
              <Siren size={20} color="#dc2626" /> 3. Not for Medical Emergencies
            </h2>
            <p style={{ marginBottom: 0 }}>
              This website and our coordination service are <strong>not emergency services</strong>. If you or someone near you is experiencing a medical emergency — chest pain, severe bleeding, breathing difficulty, stroke symptoms or any life-threatening condition — <strong>call 114 (SAMU, Mauritius) or 999 immediately</strong>, or go to the nearest emergency department without delay. Do not wait for any online response.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingDown size={20} color="var(--color-primary)" /> 4. Treatment Outcomes & Costs
            </h2>
            <p>
              Patient stories reflect individual experiences and published hospital information; they are <strong>not a guarantee of similar outcomes</strong>. Treatment results vary with each patient's condition, comorbidities and response to care. Cost figures are benchmark estimates based on hospital tariff guides — the final hospital bill may differ with clinical complexity, length of stay or complications. Success statistics referenced on this site belong to the specific hospital programmes that published them.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={20} color="var(--color-primary)" /> 5. Our Role as Facilitator
            </h2>
            <p>
              Med360 Ltd coordinates access to independent, accredited hospitals in India and assists with opinions, treatment planning, visas, travel and follow-up. Med360 does not employ treating doctors, does not operate hospital facilities, and does not influence clinical judgement. Accreditation details (JCI, NABH, NABL, CAP) are reported by the hospitals themselves; we encourage you to verify them directly with each hospital before committing to treatment.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link2 size={20} color="var(--color-primary)" /> 6. Accuracy & External Links
            </h2>
            <p>
              We take care to keep content current, but medical information changes and errors can occur; content is provided "as is" without warranty. Links to hospital and authority websites are provided for convenience — we do not endorse and are not responsible for their content.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageCircleQuestion size={20} color="var(--color-primary)" /> 7. Questions About Your Care
            </h2>
            <p>
              If anything about a proposed treatment plan, quote or hospital option is unclear, ask us — and ask the treating specialists directly. You are always entitled to a second opinion, and our coordination is free and without obligation.
            </p>
          </div>

          <div style={{
            background: 'var(--color-surface, #f8fafc)',
            border: '1.5px solid var(--color-border, #e2e8f0)',
            borderRadius: '0.9rem',
            padding: '1.25rem 1.5rem',
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
          }}>
            <LifeBuoy size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Questions about this disclaimer? Contact <strong>Med360 Ltd</strong> — <a href="mailto:info@med360.mu" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>info@med360.mu</a> • WhatsApp +230 5918 8275 • Sedeco Ltée, 4ème étage, IKS Building, Port-Louis 11613, Mauritius. See also our <a href="/terms" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Terms of Service</a> and <a href="/privacy" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Privacy Policy</a>.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
