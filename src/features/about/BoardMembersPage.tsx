import { ArrowRight, MessageCircle, Sparkles, ShieldCheck, Users, Globe2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useL10n } from '../../hooks/useL10n';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { CompanyPresentationVideo } from './CompanyPresentationVideo';
import { LeadershipBriefSection } from './LeadershipBriefSection';
import './About.css';

export function BoardMembersPage() {
  const navigate = useNavigate();
  const { l10n } = useL10n();

  const governancePillars = [
    {
      icon: ShieldCheck,
      title: l10n('Gouvernance Éthique', 'Gouvernans Etik', 'Ethical Governance'),
      sub: l10n('Zéro dividende · Intérêt du patient d\'abord', 'Zero dividann · Pasian avan tou', 'No dividends · Patient-first mandate'),
    },
    {
      icon: Users,
      title: l10n('Leadership Inclusif', 'Direksion Inklizif', 'Inclusive Leadership'),
      sub: l10n('Porté par l\'ONG Enn Rev Enn Sourir', 'Pote par l\'ONG Enn Rev Enn Sourir', 'Stewarded by NGO Enn Rev Enn Sourir'),
    },
    {
      icon: Globe2,
      title: l10n('Standards Internationaux', 'Standar Internasional', 'Global Standards'),
      sub: l10n('Affiliations UICC, SIOP & CCI', 'Afiliasion UICC, SIOP & CCI', 'UICC, SIOP & CCI affiliations'),
    },
  ];

  return (
    <main className="about-page">
      <SEO
        pageKey="whoWeAre"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about' },
          { name: 'Who We Are', path: '/who-we-are' },
        ]}
      />

      {/* Editorial Opening Header */}
      <section className="about-editorial-hero">
        <div className="container">
          <div style={{ maxWidth: 820 }}>
            <span className="about-eyebrow">
              <Sparkles size={13} />
              {l10n('Conseil d\'Administration & Direction', 'Konsey Administrasion & Direksion', 'Board Members & Executive Leadership')}
            </span>

            <h1 className="about-hero-title">
              {l10n('Qui Nous Sommes.', 'Kisannla Nou Ete.', 'Who We Are.')}{' '}
              <span>
                {l10n('Les Visages Derrière Med360.', 'Bann Vizaz Derier Med360.', 'The Leadership Behind Med360.')}
              </span>
            </h1>

            <p className="about-hero-lead" style={{ maxWidth: '68ch' }}>
              {l10n(
                'Med360 est dirigé par une équipe engagée issue d\'Enn Rev Enn Sourir, unie par une conviction claire : garantir une coordination médicale internationale transparente, humaine et solidaire pour chaque famille mauricienne.',
                'Med360 dirize par enn lekip angaze sorti dan Enn Rev Enn Sourir, ini par enn konviksion kler : garanti enn kordonasion medikal internasional transparant, imin ek solider pou sak fami morisien.',
                'Med360 is guided by a dedicated leadership team rooted in Enn Rev Enn Sourir, united by one mission: delivering transparent, compassionate, and ethical international healthcare coordination for every family.'
              )}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.9rem',
              marginTop: '1.75rem',
            }}
          >
            {governancePillars.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="about-pillar-chip">
                  <div className="about-pillar-chip__icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="about-pillar-chip__title">{item.title}</div>
                    <div className="about-pillar-chip__sub">{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          {/* Official Company Presentation & Board Members Video */}
          <CompanyPresentationVideo />

          {/* Leadership & Vision Brief (Karan Juglall, Luciano Azor, Delphine Dhollah) */}
          <LeadershipBriefSection />

          {/* Conversion Finale */}
          <div className="about-cta-finale">
            <h2>
              {l10n(
                'Parlez Directement à Notre Équipe à Maurice.',
                'Koz Direkteman ar Nou Lekip dan Moris.',
                'Speak Directly With Our Team in Mauritius.'
              )}
            </h2>
            <p>
              {l10n(
                'Découvrez notre histoire ou échangez dès aujourd\'hui avec un Patient Navigator pour un accompagnement confidentiel et sans engagement.',
                'Dekouver nou zistwar ouswa koz zordi mem ar enn Patient Navigator pou enn akonpagnman konfidansiel san okenn langazman.',
                'Explore our story or speak with a Patient Navigator today for confidential, obligation-free medical guidance.'
              )}
            </p>
            <div className="about-cta-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/describe-need?from=Who+We+Are+Page&serviceName=Medical+Consultation')}
              >
                <span>{l10n('Demander un Rendez-vous', 'Demann enn Randevou', 'Request an Appointment')}</span>
                <ArrowRight size={18} />
              </button>
              <a
                href={buildMed360WhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} />
                <span>{l10n('Discuter sur WhatsApp', 'Koz lor WhatsApp', 'Chat on WhatsApp')}</span>
              </a>
              <Link
                to="/about"
                className="btn btn-outline btn-lg"
                style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.35)' }}
              >
                <span>{l10n('Lire Notre Histoire', 'Lir Nou Zistwar', 'Read Our Story')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default BoardMembersPage;
