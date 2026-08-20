import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Users, Award, Globe2, HeartPulse, ShieldCheck, Clock, MessageCircle, ChevronRight } from 'lucide-react';
import { useFeaturedSpecialties } from '../../hooks/useSpecialties';
import { useFeaturedHospitals } from '../../hooks/useHospitals';
import { useFeaturedCaseStudies } from '../../hooks/useCaseStudies';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { formatNumber, truncateText, formatRatingLabel } from '../../core/services/format.service';
import './Home.css';

const STATS = [
  { icon: Users,      value: '12,000+', label: 'Patients Assisted' },
  { icon: Award,      value: '50+',     label: 'Accredited Hospitals' },
  { icon: Globe2,     value: '15+',     label: 'Countries' },
  { icon: HeartPulse, value: '98%',     label: 'Patient Satisfaction' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Describe Your Need',    desc: 'Fill our simple medical inquiry form with your condition, specialty, and preferences.' },
  { num: '02', title: 'Get a Free Opinion',    desc: 'Our medical team reviews your case and recommends the best hospitals and specialists.' },
  { num: '03', title: 'We Plan Everything',    desc: 'Appointment, visa support, flights, hotel, and airport transfers — all coordinated by Med360.' },
  { num: '04', title: 'Travel & Recover',      desc: 'Arrive with confidence. Our local coordinator stays with you throughout your treatment.' },
];

const WHY_CHOOSE = [
  { icon: ShieldCheck, title: 'Only JCI / NABH Hospitals',  desc: 'Every hospital in our network holds international accreditations ensuring global standards of care.' },
  { icon: Globe2,      title: '360° Concierge Service',     desc: 'From medical visa to airport pickup, in-hospital support, and post-treatment follow-up — we handle it all.' },
  { icon: Clock,       title: 'Fast Turnaround',            desc: 'Most patients have appointments arranged within 72 hours of their first inquiry.' },
  { icon: MessageCircle, title: 'Dedicated Case Manager',   desc: 'A personal case manager is assigned to you who speaks your language and guides you at every step.' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { specialties, loading: specLoading } = useFeaturedSpecialties();
  const { hospitals, loading: hospLoading }   = useFeaturedHospitals();
  const { caseStudies, loading: csLoading }   = useFeaturedCaseStudies();

  return (
    <main className="home">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero section">
        <div className="hero__bg">
          <div className="hero__image-bg" />
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__grid" />
        </div>
        <div className="container hero__inner">
          <div className="hero__content animate-fade-in-up">
            <div className="hero__eyebrow">
              <span className="badge badge-accent">✦ Mauritius&apos;s Trusted Medical Concierge</span>
            </div>
            <h1 className="hero__title">
              World-Class Healthcare,<br />
              <span className="gradient-text">Close to Home</span>
            </h1>
            <p className="hero__subtitle">
              Medical 360 connects patients from Mauritius and the Indian Ocean region with the
              world's finest accredited hospitals and specialists — at a fraction of the local cost.
            </p>
            <div className="hero__actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/describe-need')}
                id="hero-cta-btn"
              >
                Describe Your Need
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
                WhatsApp Us Now
              </a>
            </div>
            <div className="hero__trust">
              <div className="hero__stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#ffb400" color="#ffb400" />)}
              </div>
              <span className="hero__trust-text">Trusted by 12,000+ patients from Mauritius, Réunion &amp; beyond</span>
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

      {/* ── Specialties ────────────────────────────────────────────────────────── */}
      <section className="section home-specialties">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Medical Expertise</span>
            <h2 className="text-h2">Select the Specialty of Your Need</h2>
            <p className="text-lead">World-class treatment across every major medical discipline, delivered by internationally trained specialists.</p>
          </div>
          <div className="specialties-grid">
            {specLoading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="specialty-card-full skeleton" style={{ height: 320 }} />)
              : specialties.slice(0, 6).map((sp, i) => (
                <div
                  key={sp.id}
                  className={`specialty-card-full animate-fade-in-up delay-${(i % 4) + 1}`}
                  onClick={() => navigate(`/describe-need?specialty=${sp.id}`)}
                  id={`specialty-card-${sp.id}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/describe-need?specialty=${sp.id}`)}
                >
                  <img src={sp.imageUrl} alt={sp.name} className="specialty-card-full__img" loading="lazy" />
                  <div className="specialty-card-full__overlay" />
                  <div className="specialty-card-full__content">
                    <h3 className="specialty-card-full__title">{sp.name}</h3>
                    <p className="specialty-card-full__desc">{sp.shortDescription}</p>
                    <div className="specialty-card-full__action">
                      <span className="specialty-card-full__btn">
                        Explore Specialty <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/specialties')}>
              View All Specialties <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────────── */}
      <section className="section home-process">
        <div className="home-process__bg" />
        <div className="container">
          <div className="section-header">
            <span className="section-label">Simple Process</span>
            <h2 className="text-h2" style={{ color: '#fff' }}>Your Journey in 4 Simple Steps</h2>
            <p className="text-lead" style={{ color: 'rgba(255,255,255,0.7)' }}>
              From first inquiry to full recovery — Medical 360 guides you every step of the way.
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
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/describe-need')} id="process-cta-btn">
              Start My Journey <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Hospitals ─────────────────────────────────────────────────── */}
      <section className="section home-hospitals">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Network</span>
            <h2 className="text-h2">Network of Top Hospitals</h2>
            <p className="text-lead">Every hospital in our network is JCI or NABH accredited, with dedicated international patient services.</p>
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
                    <img src={hospital.imageUrl} alt={hospital.name} loading="lazy" />
                    <div className="hospital-card__overlay" />
                    <div className="hospital-card__badges">
                      {hospital.accreditations.slice(0, 2).map(acc => (
                        <span key={acc} className="badge badge-accent">{acc}</span>
                      ))}
                    </div>
                  </div>
                  <div className="hospital-card__body">
                    <h3 className="hospital-card__name">{hospital.name}</h3>
                    <p className="hospital-card__location">{hospital.city}, {hospital.country}</p>
                    <div className="hospital-card__stats">
                      <div className="hospital-card__rating">
                        <Star size={14} fill="#ffb400" color="#ffb400" />
                        <span>{hospital.rating}</span>
                        <span className="text-muted">({formatNumber(hospital.reviewCount)})</span>
                      </div>
                      <span className="hospital-card__beds">{formatNumber(hospital.bedsCount)} beds</span>
                    </div>
                    <p className="hospital-card__desc">{truncateText(hospital.description, 100)}</p>
                  </div>
                </button>
              ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/hospitals')}>
              View All Hospitals <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Why Choose Med360 ──────────────────────────────────────────────────── */}
      <section className="section home-why">
        <div className="container">
          <div className="why-grid">
            <div className="why-content">
              <span className="section-label">Why Medical 360</span>
              <h2 className="text-h2">Your Health. Our Mission.</h2>
              <p className="text-lead">
                We are not just a referral service. Medical 360 is your dedicated health partner — from the moment you reach out to the day you return home recovered.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/about')} style={{ marginTop: '1.5rem' }}>
                About Med360 <ArrowRight size={16} />
              </button>
            </div>
            <div className="why-features">
              {WHY_CHOOSE.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className={`why-feature animate-fade-in-up delay-${i + 1}`}>
                  <div className="why-feature__icon">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="why-feature__title">{title}</h4>
                    <p className="why-feature__desc">{desc}</p>
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
            <span className="section-label">Patient Stories</span>
            <h2 className="text-h2">Real Outcomes, Real Lives Changed</h2>
            <p className="text-lead">Read how Medical 360 helped patients from Mauritius and across the Indian Ocean region access life-changing treatment.</p>
          </div>
          <div className="cases-grid">
            {csLoading
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="case-card skeleton" style={{ height: 320 }} />)
              : caseStudies.slice(0, 3).map(cs => (
                <div key={cs.id} className="case-card" id={`case-card-${cs.id}`}>
                  <div className="case-card__image">
                    <img src={cs.imageUrl} alt={`${cs.patientFirstName}'s story`} loading="lazy" />
                    <div className="case-card__savings">
                      Saved {cs.costSavedPercent}%
                    </div>
                  </div>
                  <div className="case-card__body">
                    <div className="case-card__meta">
                      <span className="badge badge-primary">{cs.condition}</span>
                    </div>
                    <p className="case-card__testimonial">&ldquo;{truncateText(cs.testimonial, 140)}&rdquo;</p>
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
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/case-studies')}>
              Read All Stories <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────────── */}
      <section className="home-cta">
        <div className="home-cta__bg" />
        <div className="container home-cta__inner">
          <div className="home-cta__content">
            <h2 className="home-cta__title">Ready to Take the First Step?</h2>
            <p className="home-cta__subtitle">
              Join thousands of patients who trusted Medical 360 for their healthcare journey. Get a free medical opinion today.
            </p>
            <div className="home-cta__actions">
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/describe-need')} id="home-final-cta-btn">
                Describe Your Need <ArrowRight size={18} />
              </button>
              <a
                href={buildMed360WhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
              >
                <MessageCircle size={18} />
                WhatsApp: 59188275
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
