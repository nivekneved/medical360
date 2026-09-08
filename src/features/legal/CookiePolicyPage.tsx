import { Cookie, ShieldCheck, Database, Settings, Eye } from 'lucide-react';
import { useL10n } from '../../hooks/useL10n';
import { SEO } from '../../components/SEO/SEO';
import { LEGAL_CONSTANTS, SITE_NAME } from '../../core/config/site';

export function CookiePolicyPage() {
  const { isFr, isKr, l10n } = useL10n();


  return (
    <main style={{ paddingTop: 'var(--navbar-height)', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <SEO
        title={isFr ? `Politique de Cookies & Confidentialité | ${SITE_NAME}` : isKr ? `Politik Cookies | ${SITE_NAME}` : `Cookie Policy | ${SITE_NAME}`}
        description={isFr ? `Découvrez comment ${SITE_NAME} utilise les cookies et le stockage local pour sécuriser votre session sans traceurs publicitaires.` : `How ${SITE_NAME} uses cookies and local browser storage to remember your preferences, secure your session and keep the site fast — no advertising trackers.`}
        canonical="/cookies"
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
            background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem',
          }}>
            <Cookie size={16} /> {isFr ? "Transparence & Respect de la Vie Privée" : isKr ? "Transparans avan Tou" : "Transparency First"}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            {isFr ? "Politique Relative aux Cookies" : isKr ? "Politik Cookies" : "Cookie Policy"}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {isFr ? `Dernière mise à jour : ${LEGAL_CONSTANTS.lastUpdatedFr} • Zéro cookie publicitaire ou traceur commercial` : `Last Updated: ${LEGAL_CONSTANTS.lastUpdatedEn} • No advertising or third-party tracking cookies`}
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
              <Cookie size={20} color="var(--color-primary)" /> 1. What We Use (and Don't Use)
            </h2>
            <p>
              Med360 uses a small number of <strong>essential cookies and browser local-storage entries</strong> to keep the website secure, remember your preferences and serve content quickly. We do <strong>not</strong> use advertising cookies, cross-site trackers, or data-broker scripts of any kind. Your consent choice is recorded before any optional storage is written.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--color-primary)" /> 2. Essential Storage (Always Active)
            </h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><code>med360_cookie_consent_v1</code> — records your cookie/privacy consent decision and its date.</li>
              <li><code>med360_theme</code> — remembers your light/dark display preference.</li>
              <li><code>i18nextLng</code> — remembers your language (English, Français, Kreol).</li>
              <li><code>med360_active_currency</code> — remembers your preferred display currency (USD / MUR).</li>
              <li>Security anti-abuse entries — rate-limit and request-sanitisation signals that protect patient inquiry forms.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={20} color="var(--color-primary)" /> 3. Functional Storage (Performance)
            </h2>
            <p style={{ marginBottom: '0.5rem' }}>
              To keep browsing fast, the site caches non-personal hospital and specialty content in your browser:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><code>med360_cache_v8_*</code> — short-lived performance cache of public hospital/specialty listings (auto-expires in minutes).</li>
              <li><code>med360_mock_store_v8</code> / <code>med360_mock_config_v8</code> — offline fallback copy of the public catalog so the site renders instantly.</li>
              <li><code>med360_platform_settings_v1</code> — public display settings (e.g. whether cost comparison is enabled).</li>
            </ul>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted, #64748b)' }}>
              These entries contain <strong>no personal or medical data</strong> — only public catalog content and UI preferences.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={20} color="var(--color-primary)" /> 4. Staff & Administration Only
            </h2>
            <p>
              The separate staff portal (<code>/deven</code>, <code>/admin</code>) uses additional strictly functional storage for authorised coordinators only: session security, an internal audit trail (<code>med360_security_audit_trail_v1</code>), coordinator task lists and email-template configuration. These are never set for ordinary visitors.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={20} color="var(--color-primary)" /> 5. Third Parties
            </h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Google Fonts</strong> — typography is loaded from Google's CDN; Google may log the request. No profile linking is performed by us.</li>
              <li><strong>Supabase</strong> — our secure database provider (encrypted in transit; see Privacy Policy).</li>
              <li><strong>Resend</strong> — delivers notification emails server-side; no tracking cookies are set on your device.</li>
              <li><strong>WhatsApp</strong> — opens only when you click a WhatsApp button (you control when).</li>
            </ul>
          </div>

          <div style={{ marginBottom: '0' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>6. Managing & Clearing Storage</h2>
            <p>
              You can clear all of this at any time via your browser settings ("Clear site data" for <strong>www.med360.mu</strong>). Choosing "Essential Only" in our consent banner still keeps the core site fully functional. Questions? Contact <a href="mailto:info@med360.mu" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>info@med360.mu</a>.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
