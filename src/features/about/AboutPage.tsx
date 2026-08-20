import { ArrowRight, MessageCircle, Shield, Users, Globe2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';

const HIGHLIGHTS = [
  { icon: Shield, label: 'Only Accredited Partners', sub: 'JCI · NABH · ISO certified hospitals' },
  { icon: Users,  label: '12,000+ Patients Assisted', sub: 'From Mauritius, Reunion, Comoros and beyond' },
  { icon: Globe2, label: '15+ Countries', sub: 'India, Thailand, Singapore, Malaysia, UAE' },
  { icon: Heart,  label: 'Free for Patients', sub: 'We are compensated by hospitals, not patients' },
];

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Our Story</span>
          <h1 className="text-h1" style={{ color: 'white' }}>About Medical 360</h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 560 }}>
            Med360 Ltd was founded with a clear mission: to ensure every patient in Mauritius and the Indian Ocean region has access to the world's finest healthcare.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 980 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <span className="section-label">Our Mission</span>
              <h2 className="text-h2" style={{ margin: '0.75rem 0 1rem' }}>Bridging Mauritius to World-Class Healthcare</h2>
              <p className="text-lead">
                Medical 360 was founded with a clear mission: to ensure that every patient in Mauritius and the Indian Ocean region has access to the world's best healthcare — regardless of what is available locally.
              </p>
              <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                We understand the anxiety of travelling abroad for medical treatment. That is why we handle everything — from finding the right specialist, to your hotel room, your visa, and your return flight. Our job is to let you focus on one thing: your recovery.
              </p>
              <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                Our service is always <strong>100% free for patients</strong>. We are compensated directly by our hospital partners, never by the patients we serve.
              </p>
            </div>

            <div style={{ background: 'linear-gradient(135deg, var(--color-dark), var(--color-dark-3))', borderRadius: 'var(--radius-2xl)', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {HIGHLIGHTS.map(({ icon: Icon, label, sub }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9375rem' }}>{label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8125rem' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem' }}>
            <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Ready to Start Your Journey?</h2>
            <p className="text-lead" style={{ marginBottom: '2rem', maxWidth: 460, margin: '0 auto 2rem' }}>
              Get a free medical opinion from our partner specialists within 48 hours.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/describe-need')} id="about-cta-btn">
                Describe Your Need <ArrowRight size={18} />
              </button>
              <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <MessageCircle size={18} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
