import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { useL10n } from '../../hooks/useL10n';
import { SEO } from '../../components/SEO/SEO';
import { LEGAL_CONSTANTS, PRIVACY_EMAIL, SITE_NAME, PARENT_NGO_NAME } from '../../core/config/site';

export function PrivacyPolicyPage() {
  const { isFr, isKr, l10n } = useL10n();


  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO pageKey="privacy" />
      
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
            background: 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)',
            color: 'var(--color-accent-light)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            <Shield size={16} /> {isFr ? "Normes Strictes de Confidentialité" : isKr ? "Standard Konfidansialite Strik" : "Strict Confidentiality Standards"}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            {isFr ? "Politique de Confidentialité" : isKr ? "Politik Konfidansialite" : "Privacy Policy"}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {isFr ? `Dernière mise à jour : ${LEGAL_CONSTANTS.lastUpdatedFr} • Conforme au ${LEGAL_CONSTANTS.complianceFr}` : `Last Updated: ${LEGAL_CONSTANTS.lastUpdatedEn} • Compliant with ${LEGAL_CONSTANTS.complianceEn}`}
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
              <Lock size={20} color="var(--color-primary)" /> 1. Commitment to Medical Confidentiality
            </h2>
            <p>
              At <strong>Med360 Ltd ("Med360")</strong>, a social enterprise owned by the NGO Enn Rev Enn Sourir, we understand the deeply sensitive nature of medical data. We are committed to protecting your personal identity, medical inquiries, diagnostic reports, and communication records in strict compliance with the <strong>Mauritius Data Protection Act 2017</strong> and international data protection standards (GDPR).
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--color-primary)" /> 2. Information We Collect
            </h2>
            <p style={{ marginBottom: '0.75rem' }}>We collect information necessary to facilitate medical second opinions, hospital bookings, and medical travel coordination:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Contact Information:</strong> Full name, email address, telephone / WhatsApp number, country of residence.</li>
              <li><strong>Medical Context:</strong> Medical specialty requested, symptoms described, urgency level, past diagnosis, and medical imaging or records you voluntarily choose to share.</li>
              <li><strong>Travel & Logistics Preferences:</strong> Preferred travel destinations, estimated budget ranges, companion travel details.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={20} color="var(--color-primary)" /> 3. How We Use & Share Your Data
            </h2>
            <p style={{ marginBottom: '0.75rem' }}>Your data is strictly utilized for the purpose of coordinating your healthcare inquiry:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>To evaluate your inquiry and connect you with accredited international hospital departments (e.g., in India, Thailand, Singapore, Malaysia).</li>
              <li>To obtain free, non-binding doctor preliminary opinions and cost estimates on your behalf.</li>
              <li>To organize logistics including medical visa invitation letters, airport transfers, and interpreter assistance.</li>
              <li><strong>We NEVER sell, rent, or monetize your personal or medical data to any third-party advertisers or brokers.</strong></li>
            </ul>
          </div>

          {/* Section 4 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} color="var(--color-primary)" /> 4. Your Rights & Data Retention
            </h2>
            <p>
              You maintain full ownership of your records. You have the right to request access to your records, request rectification, or request immediate permanent deletion of all records held by Med360 Ltd by emailing our Data Protection Officer at <a href="mailto:privacy@med360.mu" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>privacy@med360.mu</a>.
            </p>
          </div>

          {/* Section 5: International Data Transfers */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={20} color="var(--color-primary)" /> 5. Data Sharing & International Transfers
            </h2>
            <p style={{ marginBottom: '0.75rem' }}>
              Your information is shared <strong>only with what is necessary</strong> for your coordination, and never with advertisers or data brokers:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <li><strong>Partner Hospitals & Specialists</strong> — only the hospitals and departments you have approved receive the medical records needed for your opinion or admission (primarily in India).</li>
              <li><strong>Secure Infrastructure Providers</strong> — encrypted database and email-delivery providers acting under data-processing agreements.</li>
              <li><strong>Logistics Partners</strong> — strictly the details required for visa letters, airport transfers and accommodation, when you request them.</li>
            </ul>
            <p>
              Because your chosen hospitals are located abroad, your data may be <strong>transferred internationally</strong>. Such transfers are made under the safeguards of the Mauritius Data Protection Act 2017 and, where applicable, GDPR Chapter V (e.g., standard contractual clauses), and are always limited to the minimum necessary for your treatment coordination.
            </p>
          </div>

          {/* Section 6: Cookies */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--color-primary)" /> 6. Cookies & Local Storage
            </h2>
            <p>
              We use only essential and performance storage — no advertising or cross-site trackers. A complete, itemised list is available in our <a href="/cookies" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Cookie Policy</a>. Your consent choice is always recorded first.
            </p>
          </div>

          {/* Section 7: Security */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} color="var(--color-primary)" /> 7. How We Protect Your Data
            </h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>All traffic is encrypted in transit (HTTPS/TLS) with strict transport security.</li>
              <li>Every submission is sanitised and validated before storage; medical files are accessible only to authorised coordinators handling your case.</li>
              <li>Staff access is password-protected, logged in an internal audit trail, and reviewed.</li>
              <li>Hardened HTTP security headers (CSP, HSTS, frame protection) are enforced across the site.</li>
            </ul>
          </div>

          {/* Section 8: Retention & Rights */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} color="var(--color-primary)" /> 8. Retention & Your Full Rights
            </h2>
            <p style={{ marginBottom: '0.75rem' }}>
              Inquiry records are retained for up to <strong>24 months</strong> after your last contact unless your treatment is ongoing or a longer period is required by law. You may request earlier deletion at any time.
            </p>
            <p style={{ marginBottom: '0.75rem' }}>Under the Mauritius Data Protection Act 2017 and (where applicable) the GDPR you have the right to:</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Access the personal data we hold about you and receive a copy;</li>
              <li>Rectify inaccurate or incomplete data;</li>
              <li>Erase your data ("right to be forgotten");</li>
              <li>Restrict or object to processing, and withdraw consent at any time;</li>
              <li>Data portability — receive your data in a structured, commonly used format.</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              To exercise any right, email our Data Protection Officer at <a href={`mailto:${PRIVACY_EMAIL}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{PRIVACY_EMAIL}</a>. You may also lodge a complaint with the <strong>Data Protection Commissioner of Mauritius</strong> (Office of the Data Protection Commissioner, Port-Louis) if you believe your rights have been infringed.
            </p>
          </div>

          {/* Section 5: Medical Facilitator Disclaimer */}

          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            marginTop: '2rem',
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.5rem' }}>
              ⚠️ Medical Facilitator Disclaimer
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
              {SITE_NAME} is a medical travel facilitator and concierge owned by NGO {PARENT_NGO_NAME}, not a licensed healthcare clinic or diagnostic hospital. Any preliminary information provided does not substitute professional in-person medical evaluation by licensed healthcare practitioners.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
