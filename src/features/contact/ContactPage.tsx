import { MapPin, Phone, Mail, MessageCircle, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';

export function ContactPage() {
  const navigate = useNavigate();

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Get in Touch</span>
          <h1 className="text-h1" style={{ color: 'white' }}>Contact Us</h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500 }}>
            Have questions? Our team is available 7 days a week. Reach us by WhatsApp, phone, or email.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            {/* Contact Info */}
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Reach Us Directly</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(37,211,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', flexShrink: 0 }}>
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>WhatsApp (Fastest Response)</h3>
                    <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm" id="contact-whatsapp-btn" style={{ marginTop: 8 }}>
                      <MessageCircle size={16} /> +230 59188275
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(26,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Phone</h3>
                    <a href="tel:+23059188275" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>+230 59188275</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(26,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Email</h3>
                    <a href="mailto:info@med360.mu" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>info@med360.mu</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(26,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Hours</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      Mon – Sat: 8:00 AM – 7:00 PM (MUT)<br />
                      WhatsApp available 7 days a week
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(26,107,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>Location</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      Med360 Ltd<br />Port Louis, Mauritius
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Send a Quick Inquiry</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input id="contact-name" className="form-input" placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-contact">Email or WhatsApp</label>
                  <input id="contact-contact" className="form-input" placeholder="your@email.com or +230..." />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" className="form-textarea" placeholder="How can we help you?" style={{ minHeight: 120 }} />
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} id="contact-send-btn" onClick={() => navigate('/describe-need')}>
                  Submit Inquiry <ArrowRight size={16} />
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Or use our detailed medical inquiry form for faster service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
