import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './Services.css';

const SERVICES = [
  {
    id: 'srv-opinion',
    title: 'Free Medical Opinion',
    desc: 'Share your reports and our partner specialists will provide a professional second opinion and treatment plan at zero cost.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    tag: 'Free Service',
  },
  {
    id: 'srv-manager',
    title: 'Dedicated Case Manager',
    desc: 'A personal case manager is assigned to your case and remains your single, continuous point of contact throughout the entire journey.',
    imageUrl: '/assets/consultation-support.jpg',
    tag: '1-on-1 Care',
  },
  {
    id: 'srv-travel',
    title: 'Travel & Visa Assistance',
    desc: 'We guide you through the medical visa process with hospital invitation letters, flight itineraries, and companion paperwork.',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    tag: 'Full Logistics',
  },
  {
    id: 'srv-hotel',
    title: 'Accommodation Booking',
    desc: 'We arrange comfortable, verified hotels or serviced apartments near the hospital for you and accompanying family members.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    tag: 'Partner Rates',
  },
  {
    id: 'srv-transfer',
    title: 'Airport Transfers',
    desc: 'Dedicated airport pickup and drop-off coordinated seamlessly with your flight schedule and initial hospital appointments.',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
    tag: 'Seamless Transit',
  },
  {
    id: 'srv-interpreter',
    title: 'Interpreter Services',
    desc: 'French, Creole, Hindi, and multilingual interpreters available to accompany you during medical consultations and hospital rounds.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    tag: 'Language Support',
  },
  {
    id: 'srv-support',
    title: 'In-Hospital Support',
    desc: 'Our local on-ground coordinator visits you regularly during your stay, liaising with nursing staff and updating your family.',
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
    tag: 'On-Ground Care',
  },
  {
    id: 'srv-followup',
    title: 'Post-Treatment Follow-Up',
    desc: 'After returning home, we coordinate virtual doctor check-ups, review post-op lab reports, and arrange prescription deliveries.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    tag: 'Recovery Care',
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
          <div className="services-cards-grid">
            {SERVICES.map((srv, i) => (
              <div
                key={srv.id}
                className={`service-full-card animate-fade-in-up delay-${(i % 4) + 1}`}
                id={`service-card-${srv.id}`}
                onClick={() => navigate('/describe-need')}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate('/describe-need')}
              >
                <img src={srv.imageUrl} alt={srv.title} className="service-full-card__img" loading="lazy" />
                <div className="service-full-card__overlay" />
                <span className="service-full-card__tag">{srv.tag}</span>
                <div className="service-full-card__content">
                  <h3 className="service-full-card__title">{srv.title}</h3>
                  <p className="service-full-card__desc">{srv.desc}</p>
                  <div className="service-full-card__action">
                    <span className="service-full-card__btn">
                      Request This Service <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
