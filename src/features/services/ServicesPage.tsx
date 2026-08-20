import { Plane, Hotel, FileText, Languages, Car, HeartPulse, Phone, ArrowRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';

const SERVICES = [
  {
    icon: FileText,
    title: 'Free Medical Opinion',
    desc: 'Share your medical reports and our partner doctors will provide a professional second opinion and treatment recommendation at no cost.',
  },
  {
    icon: Phone,
    title: 'Dedicated Case Manager',
    desc: 'A personal case manager is assigned to your case and remains your single point of contact throughout the entire journey.',
  },
  {
    icon: Plane,
    title: 'Travel & Visa Assistance',
    desc: 'We guide you through the medical visa application process for India, Thailand, Malaysia, Singapore, and more, with supporting documents from the hospital.',
  },
  {
    icon: Hotel,
    title: 'Accommodation Booking',
    desc: 'We arrange comfortable, affordable hotel or guest house options near the hospital, with options for family companions.',
  },
  {
    icon: Car,
    title: 'Airport Transfers',
    desc: 'Seamless airport pickup and drop-off coordinated with your flight details and hospital appointment schedule.',
  },
  {
    icon: Languages,
    title: 'Interpreter Services',
    desc: 'French, Creole, Hindi, and other language interpreters available to support you during consultations and hospital stays.',
  },
  {
    icon: HeartPulse,
    title: 'In-Hospital Support',
    desc: 'Our local coordinator visits you during your hospital stay, liaising with medical staff and keeping your family updated.',
  },
  {
    icon: MessageCircle,
    title: 'Post-Treatment Follow-Up',
    desc: 'After you return home, we coordinate virtual follow-up consultations, lab result reviews, and prescription refills with your treating doctor.',
  },
];

export function ServicesPage() {
  const navigate = useNavigate();

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="page-hero">
        <div className="page-hero__bg" />
        <div className="container page-hero__inner">
          <span className="section-label" style={{ color: 'var(--color-accent)' }}>Full Concierge</span>
          <h1 className="text-h1" style={{ color: 'white' }}>Our Services Cover Every Need</h1>
          <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 560 }}>
            From your first inquiry to post-treatment follow-up, Medical 360 handles every detail of your healthcare journey abroad.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-4" style={{ gap: '1.5rem' }}>
            {SERVICES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className={`card animate-fade-in-up delay-${(i % 4) + 1}`} style={{ padding: '2rem' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(6, 95, 70, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                    marginBottom: '1rem',
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/describe-need')} id="services-cta-btn">
              Get Started <ArrowRight size={18} />
            </button>
            <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
              <MessageCircle size={18} /> WhatsApp: 59188275
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
