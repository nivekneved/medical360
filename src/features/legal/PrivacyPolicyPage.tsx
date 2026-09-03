import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { SEO } from '../../components/SEO/SEO';

export function PrivacyPolicyPage() {
  return (
    <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <SEO
        title="Privacy Policy & Medical Data Protection"
        description="Learn how Medical 360 protects your personal and medical information under the Mauritius Data Protection Act 2017 and GDPR standards."
        canonical="/privacy"
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
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            <Shield size={16} /> Strict Confidentiality Standards
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Last Updated: September 2026 • Compliant with Mauritius Data Protection Act 2017 & GDPR
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
              <Lock size={20} color="#10b981" /> 1. Commitment to Medical Confidentiality
            </h2>
            <p>
              At <strong>Med360 Ltd ("Medical 360")</strong>, we understand the deeply sensitive nature of medical data. We are committed to protecting your personal identity, medical inquiries, diagnostic reports, and communication records in strict compliance with the <strong>Mauritius Data Protection Act 2017</strong> and international data protection standards (GDPR).
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="#10b981" /> 2. Information We Collect
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
              <Eye size={20} color="#10b981" /> 3. How We Use & Share Your Data
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
              <CheckCircle2 size={20} color="#10b981" /> 4. Your Rights & Data Retention
            </h2>
            <p>
              You maintain full ownership of your records. You have the right to request access to your records, request rectification, or request immediate permanent deletion of all records held by Med360 Ltd by emailing our Data Protection Officer at <a href="mailto:privacy@med360.mu" style={{ color: '#10b981', fontWeight: 600 }}>privacy@med360.mu</a>.
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
              Medical 360 (Med360 Ltd) is a medical travel facilitator and concierge, not a licensed healthcare clinic or diagnostic hospital. Any preliminary information provided does not substitute professional in-person medical evaluation by licensed healthcare practitioners.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
