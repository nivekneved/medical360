import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Users, Award, Globe2, HeartPulse, ShieldCheck, Clock, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCMS } from '../../hooks/useCMS';
import { useFeaturedSpecialties } from '../../hooks/useSpecialties';
import { useFeaturedHospitals } from '../../hooks/useHospitals';
import { useFeaturedCaseStudies } from '../../hooks/useCaseStudies';
import { SEO } from '../../components/SEO/SEO';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { formatNumber, truncateText } from '../../core/services/format.service';
import { getMedicalOrganizationSchema } from '../../core/services/schema.service';
import { MissionMarquee } from './components/MissionMarquee';
import './Home.css';

export function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { specialties, loading: specLoading } = useFeaturedSpecialties();
  const { hospitals, loading: hospLoading }   = useFeaturedHospitals();
  const { caseStudies, loading: csLoading }   = useFeaturedCaseStudies();
  const { data: cms } = useCMS('home');
  const { data: marqueeCms } = useCMS('marquee');

  const marqueeEnabled = marqueeCms?.content?.enabled !== 'false' && marqueeCms?.content?.enabled !== false;
  const marqueePosition = marqueeCms?.content?.position || 'above';

  // Determine localized field
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];
  
  // Safe helper for CMS content
  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  const STATS = [
    { icon: Award,      value: '10+ Years', label: tCms('statSavings', t('home.stats.savings')) },
    { icon: Users,      value: '1,200+',   label: tCms('statPatients', t('home.stats.patients')) },
    { icon: Globe2,     value: '15+',      label: tCms('statHospitals', t('home.stats.hospitals')) },
    { icon: HeartPulse, value: '100%',     label: tCms('statSatisfaction', t('home.stats.satisfaction')) },
  ];

  const PROCESS_STEPS = [
    { num: '01', title: tCms('processStep1Title', t('home.process.step1.title')), desc: tCms('processStep1Desc', t('home.process.step1.desc')) },
    { num: '02', title: tCms('processStep2Title', t('home.process.step2.title')), desc: tCms('processStep2Desc', t('home.process.step2.desc')) },
    { num: '03', title: tCms('processStep3Title', t('home.process.step3.title')), desc: tCms('processStep3Desc', t('home.process.step3.desc')) },
    { num: '04', title: tCms('processStep4Title', t('home.process.step4.title')), desc: tCms('processStep4Desc', t('home.process.step4.desc')) },
  ];

  const WHY_CHOOSE = [
    { icon: Award,       title: t('home.features.jci.title'),         desc: t('home.features.jci.desc') },
    { icon: Globe2,      title: t('home.features.concierge.title'),   desc: t('home.features.concierge.desc') },
    { icon: ShieldCheck, title: t('home.features.turnaround.title'),  desc: t('home.features.turnaround.desc') },
    { icon: HeartPulse,  title: t('home.features.caseManager.title'), desc: t('home.features.caseManager.desc') },
  ];

  // Rich Schema.org JSON-LD for Homepage
  const schema = getMedicalOrganizationSchema();

  return (
    <main className="home">
      <SEO 
        title={tCms('heroTitleLine1', t('home.heroTitleLine1'))} 
        description={tCms('heroSubtitle', t('home.heroSubtitle'))} 
        canonical="/"
        schema={schema}
      />
      {/* ── Top Mission Marquee Ribbon (When position === 'above') ─────────── */}
      {marqueeEnabled && marqueePosition === 'above' && (
        <div className="mission-marquee-top">
          <MissionMarquee />
        </div>
      )}

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section 
        className={`hero ${marqueeEnabled && marqueePosition === 'above' ? 'hero--marquee-above' : 'hero--marquee-below'}`} 
        aria-label="Hero section"
      >
        <div className="hero__bg">
          <div className="hero__image-bg" />
        </div>
        <div className="container hero__inner">
          <div className="hero__content animate-fade-in-up">
            <div className="hero__eyebrow">
              <span className="badge badge-accent">{tCms('heroBadge', t('home.heroBadge'))}</span>
            </div>
            <h1 className="hero__title">
              {tCms('heroTitleLine1', t('home.heroTitleLine1'))}<br />
              <span className="gradient-text">{tCms('heroTitleLine2', t('home.heroTitleLine2'))}</span>
            </h1>
            <p className="hero__subtitle">
              {tCms('heroSubtitle', t('home.heroSubtitle'))}
            </p>
            <div className="hero__actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/describe-need')}
                id="hero-cta-btn"
              >
                {tCms('heroPrimaryCta', t('nav.freeOpinion'))}
                <ArrowRight size={18} />
              </button>
              <a
                href={buildMed360WhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
                id="hero-whatsapp-btn"
              >
                <MessageCircle size={18} />
                {tCms('heroSecondaryCta', t('nav.whatsapp'))}
              </a>
            </div>
            <div className="hero__trust">
              <div className="hero__stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#ffb400" color="#ffb400" />)}
              </div>
              <span className="hero__trust-text">{tCms('trustText', t('home.trustText'))}</span>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="hero__stats animate-fade-in-up delay-2">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="hero__stat">
                <div className="hero__stat-icon">
                  <Icon size={22} />
                </div>
                <div>
                  <div className="hero__stat-value">{value}</div>
                  <div className="hero__stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Marquee Ribbon (When position === 'below') ─────────────────── */}
      {marqueeEnabled && marqueePosition === 'below' && (
        <MissionMarquee />
      )}

      {/* ── Specialties ────────────────────────────────────────────────────────── */}
      <section className="section home-specialties">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{tCms('specialtiesLabel', t('home.specialties.label'))}</span>
            <h2 className="text-h2">{tCms('specialtiesTitle', t('home.specialties.title'))}</h2>
            <p className="text-lead">{tCms('specialtiesDesc', t('home.specialties.desc'))}</p>
          </div>
          <div className="specialties-grid">
            {specLoading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="specialty-card-full skeleton" style={{ height: 320 }} />)
              : specialties.slice(0, 6).map((sp, i) => (
                <div
                  key={sp.id}
                  className={`specialty-card-full animate-fade-in-up delay-${(i % 4) + 1}`}
                  onClick={() => navigate(`/specialties/${sp.id}`)}
                  id={`specialty-card-${sp.id}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/specialties/${sp.id}`)}
                >
                  <img
                    src={sp.imageUrl}
                    alt={sp.name}
                    className="specialty-card-full__img"
                    loading="lazy"
                    decoding="async"
                    width="400"
                    height="340"
                  />
                  <div className="specialty-card-full__overlay" />
                  <div className="specialty-card-full__content">
                    <h3 className="specialty-card-full__title">{l(sp, 'name')}</h3>
                    <p className="specialty-card-full__desc">{l(sp, 'shortDescription')}</p>
                    <div className="specialty-card-full__action">
                      <span className="specialty-card-full__btn">
                        {tCms('exploreBtnText', t('home.specialties.exploreBtn'))} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/specialties')}>
              {tCms('specialtiesViewAllBtn', t('home.specialties.viewAllBtn'))} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────────── */}
      <section className="section home-process">
        <div className="home-process__bg" />
        <div className="container">
          <div className="section-header">
            <span className="section-label">{tCms('processLabel', t('home.process.label'))}</span>
            <h2 className="text-h2" style={{ color: '#fff' }}>{tCms('processTitle', t('home.process.title'))}</h2>
            <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {tCms('processDesc', t('home.process.desc'))}
            </p>
          </div>
          <div className="process-steps">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} className={`process-step animate-fade-in-up delay-${i + 1}`}>
                <div className="process-step__num">{step.num}</div>
                <h3 className="process-step__title">{step.title}</h3>
                <p className="process-step__desc">{step.desc}</p>
                {i < PROCESS_STEPS.length - 1 && <div className="process-step__connector" />}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/describe-need')} id="process-cta-btn">
              {tCms('processStartBtn', t('home.process.startBtn'))} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Hospitals ─────────────────────────────────────────────────── */}
      <section className="section home-hospitals">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{tCms('networkLabel', t('home.network.label'))}</span>
            <h2 className="text-h2">{tCms('networkTitle', t('home.network.title'))}</h2>
            <p className="text-lead">{tCms('networkDesc', t('home.network.desc'))}</p>
          </div>
          <div className="hospitals-grid">
            {hospLoading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="hospital-card skeleton" style={{ height: 280 }} />)
              : hospitals.slice(0, 4).map(hospital => (
                <button
                  key={hospital.id}
                  className="hospital-card"
                  onClick={() => navigate(`/hospitals/${hospital.id}`)}
                  id={`hospital-card-${hospital.id}`}
                >
                  <div className="hospital-card__image">
                    <img
                      src={hospital.imageUrl}
                      alt={hospital.name}
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="220"
                    />
                    <div className="hospital-card__overlay" />
                    <div className="hospital-card__badges">
                      {hospital.accreditations.slice(0, 2).map(acc => (
                        <span key={acc} className="badge badge-accent">{acc}</span>
                      ))}
                    </div>
                  </div>
                  <div className="hospital-card__body">
                    <h3 className="hospital-card__name">{l(hospital, 'name')}</h3>
                    <p className="hospital-card__location">{hospital.city}, {hospital.country}</p>
                    <div className="hospital-card__stats">
                      <div className="hospital-card__rating">
                        <Star size={14} fill="#ffb400" color="#ffb400" />
                        <span>{hospital.rating}</span>
                        <span className="text-muted">({formatNumber(hospital.reviewCount)})</span>
                      </div>
                      <span className="hospital-card__beds">{formatNumber(hospital.bedsCount)} beds</span>
                    </div>
                    <p className="hospital-card__desc">{truncateText(l(hospital, 'description'), 100)}</p>
                  </div>
                </button>
              ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/hospitals')}>
              {tCms('networkViewAllBtn', t('home.network.viewAllBtn'))} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Why Choose Med360 ──────────────────────────────────────────────────── */}
      <section className="section home-why">
        <div className="container">
          <div className="why-grid">
            <div className="why-content">
              <span className="section-label">{tCms('whyBadge', t('home.whyBadge'))}</span>
              <h2 className="text-h2">{tCms('whyTitle', t('home.whyTitle'))}</h2>
              <p className="text-lead">
                {tCms('whyDesc', t('home.whyDesc'))}
              </p>
              <div className="why-image-card">
                <img
                  src="/assets/consultation-support.jpg"
                  alt="Compassionate healthcare consultation"
                  loading="lazy"
                  decoding="async"
                  width="500"
                  height="320"
                />
                <div className="why-image-badge">
                  <span className="badge badge-accent">{tCms('whyImageBadge', t('home.whyImageBadge'))}</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/about')} style={{ marginTop: '2rem' }}>
                {tCms('whyAboutBtn', t('home.aboutBtn'))} <ArrowRight size={16} />
              </button>
            </div>
            <div className="why-features">
              {WHY_CHOOSE.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className={`why-feature animate-fade-in-up delay-${i + 1}`}>
                  <div className="why-feature__icon">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="why-feature__title">{tCms(`whyFeature${i + 1}Title`, title)}</h4>
                    <p className="why-feature__desc">{tCms(`whyFeature${i + 1}Desc`, desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Case Studies ───────────────────────────────────────────────────────── */}
      <section className="section home-cases">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{tCms('casesLabel', t('home.cases.label'))}</span>
            <h2 className="text-h2">{tCms('casesTitle', t('home.cases.title'))}</h2>
            <p className="text-lead">{tCms('casesDesc', t('home.cases.desc'))}</p>
          </div>
          <div className="cases-grid">
            {csLoading
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="case-card skeleton" style={{ height: 320 }} />)
              : caseStudies.slice(0, 3).map(cs => (
                <div key={cs.id} className="case-card" id={`case-card-${cs.id}`}>
                  <div className="case-card__image">
                    <img
                      src={cs.imageUrl}
                      alt={`${cs.patientFirstName}'s story`}
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="240"
                    />
                    <div className="case-card__savings">
                      {t('home.cases.saved')} {cs.costSavedPercent}%
                    </div>
                  </div>
                  <div className="case-card__body">
                    <div className="case-card__meta">
                      <span className="badge badge-primary">{l(cs, 'condition')}</span>
                    </div>
                    <p className="case-card__testimonial">&ldquo;{truncateText(l(cs, 'testimonial'), 140)}&rdquo;</p>
                    <div className="case-card__footer">
                      <div className="case-card__patient">
                        <strong>{cs.patientFirstName}</strong>, {cs.patientAge} — {cs.patientCountry}
                      </div>
                      <div className="case-card__duration">{cs.durationDays} days</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/case-studies')}>
              {tCms('casesViewAllBtn', t('home.cases.viewAllBtn'))} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────── */}
      <section className="home-cta">
        <div className="home-cta__bg" />
        <div className="container home-cta__inner">
          <div className="home-cta__content">
            <h2 className="home-cta__title">{tCms('ctaTitle', t('home.cta.title'))}</h2>
            <p className="home-cta__subtitle">
              {tCms('ctaDesc', t('home.cta.desc'))}
            </p>
            <div className="home-cta__actions">
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/describe-need')} id="home-final-cta-btn">
                {tCms('ctaPrimaryBtn', t('nav.freeOpinion'))} <ArrowRight size={18} />
              </button>
              <a
                href={buildMed360WhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
              >
                <MessageCircle size={18} />
                {tCms('ctaWhatsAppBtn', 'WhatsApp: 59188275')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
