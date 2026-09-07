import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Users, Award, Globe2, HeartPulse, ShieldCheck, MessageCircle, FileText, Stethoscope, Plane, Building2, UserCheck } from 'lucide-react';
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

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  // Determine localized field
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];
  
  // Safe helper for CMS content
  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  const STATS = [
    { icon: Users,      value: '+3,000',    label: isFr ? '+3 000 Patients Accompagnés' : isKr ? '+3,000 Pasian Asiste' : '+3,000 Patients Assisted' },
    { icon: Building2,  value: '15',        label: isFr ? 'Hôpitaux Partenaires en Inde' : isKr ? 'Lopital Partener dan L\'inde' : 'Premier Indian Hospitals' },
    { icon: Award,      value: '10+ Years', label: isFr ? 'Années d\'Expérience Humaine' : isKr ? 'Banlane D\'experyans Imin' : 'Years Caring for Patients' },
    { icon: HeartPulse, value: '100%',      label: isFr ? 'Bénéfices Reversés à l\'ONG' : isKr ? '100% Profi pour l\'ONG' : 'No Dividends · 100% Impact' },
  ];

  const PROCESS_STEPS = [
    {
      num: '01',
      icon: FileText,
      title: isFr ? '01 — Vos Besoins Médicaux' : isKr ? '01 — Dekrir Ou Bezwin' : '01 — Tell Us About Your Medical Needs',
      desc: isFr ? 'Partagez vos rapports et résultats. Un Patient Navigator dédié organise un échange approfondi avec vous et votre famille.' : isKr ? 'Partaz ou bann rapor medikal. Enn kordinater pou koz ar ou ek ou fami pou konpran tou.' : 'Share your medical reports and test results. A dedicated Patient Navigator discusses your case and arranges video family consultations.'
    },
    {
      num: '02',
      icon: Stethoscope,
      title: isFr ? '02 — Sélection de l\'Hôpital' : isKr ? '02 — Swazir Lopital' : '02 — Medical Review & Hospital Selection',
      desc: isFr ? 'Identification des hôpitaux et spécialistes adaptés parmi notre réseau d\'excellence en Inde et soumission sécurisée de votre dossier.' : isKr ? 'Nou rod bann meyer lopital ek dokter dan L\'inde ki adapte a ou maladi ek avoy ou dosie an sekirite.' : 'We identify appropriate hospitals and leading specialists within our Indian healthcare network and securely submit your records.'
    },
    {
      num: '03',
      icon: HeartPulse,
      title: isFr ? '03 — Plan, Devis & Téléconsultation' : isKr ? '03 — Plan, Pri & Telekonsiltasion' : '03 — Treatment Plan, Estimate & Teleconsultation',
      desc: isFr ? 'Réception de l\'avis médical spécialiste, devis estimatif et téléconsultation vidéo directe avec le chirurgien traitant en Inde avant votre départ.' : isKr ? 'Gagn lavi dokter, estimasion pri kler ek enn video-konsiltasion direk ar sef sirizien avan voyaze.' : 'Receive specialist opinions, clear cost estimates, and video teleconsultations directly with your overseas treating specialist.'
    },
    {
      num: '04',
      icon: Plane,
      title: isFr ? '04 — Coordination du Voyage' : isKr ? '04 — Kordinasion Voyaz' : '04 — We Coordinate Your Journey',
      desc: isFr ? 'Prise en charge complète : visa médical, vols, transferts aéroport, hébergement, ambulance ou évacuation médicale aérienne si requise.' : isKr ? 'Nou okip viza medikal, biye avion, lotel, transpor ek lasistans medikal/ambilans si bizin.' : 'Hospital admissions, medical visas, flights, accommodation, airport transfers, and private air-ambulance arrangements when needed.'
    },
    {
      num: '05',
      icon: Building2,
      title: isFr ? '05 — Prise en Charge en Inde' : isKr ? '05 — Tretman dan Lopital' : '05 — Treatment Abroad',
      desc: isFr ? 'Accueil à l\'aéroport, accompagnement au chevet du patient, facilitation des échanges avec l\'équipe soignante jusqu\'à la sortie.' : isKr ? 'Lariwe aeriopor, ladmision lopital, akonpanyeman o sive ek kominikasion fasil ar bann dokter.' : 'On-ground welcome, hospital admission, continuous bedside advocacy for you and your accompanying family member.'
    },
    {
      num: '06',
      icon: UserCheck,
      title: isFr ? '06 — Retour & Continuité des Soins' : isKr ? '06 — Retour Lakaz & Swivi' : '06 — Return Home & Follow-Up',
      desc: isFr ? 'Coordination des comptes rendus, téléconsultations de suivi post-opératoire et continuité des soins avec vos spécialistes à l\'étranger.' : isKr ? 'Rakor rapor medikal, telekonsiltasion swivi ek kontinwite bann swen kan ou retourn Moris.' : 'Post-discharge medical reports, follow-up teleconsultations, and seamless continuity of care once you return home.'
    },
  ];

  const WHY_CHOOSE = [
    { icon: Award,       title: isFr ? 'Heritage Humanitaire de 10+ Ans' : isKr ? '10+ Banlane Lexperyans' : 'Decade of Compassionate Heritage',         desc: isFr ? 'Né de l\'expérience de terrain de l\'ONG Enn Rev Enn Sourir aux côtés des patients confrontés à la maladie.' : isKr ? 'Fonnde depi lexperyans ONG Enn Rev Enn Sourir pou ed bann pasian.' : 'Born from years of humanitarian patient navigation by NGO Enn Rev Enn Sourir.' },
    { icon: Globe2,      title: isFr ? '15 Hôpitaux Accrédités JCI & NABH' : isKr ? '15 Gran Lopital Akredite' : '15 JCI & NABH Accredited Centres',   desc: isFr ? 'Accès direct aux centres d\'excellence hospitaliers à Chennai, Mumbai, Bengaluru, Hyderabad et Delhi.' : isKr ? 'Akse direk ar bann gran sant medikal dan Chennai, Mumbai, Bengaluru ek Delhi.' : 'Direct access to premier quaternary hospital hubs across Chennai, Mumbai, Bengaluru, Hyderabad, and Delhi NCR.' },
    { icon: ShieldCheck, title: isFr ? 'Éthique & Zéro Commission Cachée' : isKr ? 'Etik & Pri Transparan' : 'Ethical, Transparent & Patient-First',  desc: isFr ? 'Un modèle social où le respect du patient, le consentement éclairé et la transparence priment sur tout intérêt commercial.' : isKr ? 'Tou pri kler, respe drwa pasian avan tou lobzektif komersial.' : 'Informed choices and dignity come first. No hidden markups or commercial referral pressures.' },
    { icon: HeartPulse,  title: isFr ? 'Modèle Social « Zéro Dividende »' : isKr ? 'Zistwar Social San Dividand' : 'Healthcare With Greater Purpose', desc: isFr ? 'Vos soins contribuent à financer les interventions médicales de patients et enfants mauriciens dans le besoin.' : isKr ? '100% profi retourn dan l\'ONG pou pey loperasion bann pasian mizer.' : 'No dividends to shareholders. Revenue generated helps Enn Rev Enn Sourir fund treatments for vulnerable families.' },
  ];

  // Rich Schema.org JSON-LD for Homepage
  const schema = getMedicalOrganizationSchema();

  return (
    <main className="home">
      <SEO 
        title="World-Class Healthcare. Without the Wait. With the Dignity You Deserve." 
        description="Medical 360 coordinates world-class healthcare, second opinions, and patient travel from Mauritius to 15 accredited hospitals across India." 
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
              <span className="badge badge-accent">
                {isFr ? '✦ Initiative d\'Entreprise Sociale · Enn Rev Enn Sourir' : isKr ? '✦ Antrepriz Sosyal · Enn Rev Enn Sourir' : '✦ Social Enterprise Initiative of Enn Rev Enn Sourir'}
              </span>
            </div>
            <h1 className="hero__title">
              World-Class Healthcare.<br />
              <span className="gradient-text">Without the Wait. With the Dignity You Deserve.</span>
            </h1>
            <p className="hero__subtitle">
              {isFr 
                ? 'Medical 360 accompagne les patients mauriciens vers 15 hôpitaux de renommée internationale en Inde. Obtenez un avis médical spécialiste, des devis transparents et une coordination complète de votre parcours de soins.'
                : isKr
                ? 'Medical 360 kordonn ou vwayaz lasante ver 15 gran lopital akredite dan L\'inde. Gagn deziem lavi dokter, estimasion pri kler ek lasistans konple depi A a Z.'
                : 'Medical 360 Ltd connects patients in Mauritius with premier accredited hospitals across India. We coordinate expert second opinions, video teleconsultations, and complete medical travel navigation.'
              }
            </p>
            
            <p className="hero__callout-quote">
              <em>{isFr ? '« Une conversation peut changer la trajectoire de vos soins. Commencez la vôtre dès aujourd\'hui. »' : isKr ? '« Enn konversasion kapav sanz ou vwayaz lasante. Koumans ou par zordi. »' : '“One conversation could change the direction of your healthcare journey. Start yours today.”'}</em>
            </p>

            <div className="hero__actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/describe-need')}
                id="hero-cta-btn"
              >
                <span>{isFr ? 'RÉSERVER VOTRE CONSULTATION MÉDICALE' : isKr ? 'REZERV OU KONSILTASION MEDIKAL' : 'BOOK YOUR MEDICAL CONSULTATION'}</span>
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
                <span>{isFr ? 'DISCUTER SUR WHATSAPP' : isKr ? 'KOZE LOR WHATSAPP' : 'CHAT WITH US ON WHATSAPP'}</span>
              </a>
            </div>
            
            <div className="hero__trust">
              <div className="hero__stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#ffb400" color="#ffb400" />)}
              </div>
              <span className="hero__trust-text">
                {isFr ? 'Plus de 3 000 patients accompagnés · Membre UICC · 100% Sans Dividende' : isKr ? 'Plis ki 3,000 pasian asiste · Manb UICC · Zero Dividand' : 'Over 3,000 Patients Assisted · UICC Member Network · No Dividends Model'}
              </span>
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

      {/* ── Specialties (15 Medical Specialties) ─────────────────────────────── */}
      <section className="section home-specialties">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{isFr ? 'Excellence Médicale' : isKr ? 'Spesialite Medikal' : 'Medical Specialties'}</span>
            <h2 className="text-h2">
              {isFr ? 'Soins de Pointe à Travers 15 Spécialités Médicales' : isKr ? 'Swen Avanse dan 15 Spesialite Medikal' : 'Specialised Care Across 15 Medical Disciplines'}
            </h2>
            <p className="text-lead">
              {isFr 
                ? 'Accédez à des spécialistes renommés et aux technologies diagnostiques et chirurgicales de pointe adaptées à votre situation.'
                : isKr
                ? 'Akse ar bann meyer spesialis ek teknolosi modern pou tou kalite tretman.'
                : 'Direct access to established clinical departments, multidisciplinary tumor boards, and advanced surgical innovations across India.'}
            </p>
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
                    <div className="specialty-card-full__icon-badge">{sp.icon}</div>
                    <h3 className="specialty-card-full__title">{l(sp, 'name')}</h3>
                    <p className="specialty-card-full__desc">{l(sp, 'shortDescription')}</p>
                    <div className="specialty-card-full__action">
                      <span className="specialty-card-full__btn">
                        {isFr ? 'Découvrir les Actes & Soins' : isKr ? 'Get Tretman & Pri' : 'Explore Care & Procedures'} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/specialties')}>
              {isFr ? 'Voir Toutes les 15 Spécialités' : isKr ? 'Get Tou Bann 15 Spesialite' : 'View All 15 Specialties'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works (6-Step Patient Journey) ────────────────────────────── */}
      <section className="section home-process">
        <div className="home-process__bg" />
        <div className="container">
          <div className="section-header">
            <span className="section-label">{isFr ? 'Parcours Patient en 6 Étapes' : isKr ? 'Parcours Pasian an 6 Letap' : 'How It Works · 6-Step Journey'}</span>
            <h2 className="text-h2" style={{ color: '#fff' }}>
              {isFr ? 'Votre Parcours de Soins, Simple & Coordonné' : isKr ? 'Ou Vwayaz Lasante, Sinp & Kordone' : 'Your Healthcare Journey, Made Simple'}
            </h2>
            <p className="text-lead" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {isFr 
                ? 'De votre première demande médicale et téléconsultation avec le spécialiste jusqu\'à vos soins à l\'étranger et votre retour à Maurice.'
                : isKr
                ? 'Depi premie demann ziska tretman dan L\'inde ek swivi kan ou retourn Moris.'
                : 'Medical 360 coordinates every step — from your first medical enquiry and specialist consultation to your treatment abroad and return home.'}
            </p>
          </div>
          <div className="process-steps-grid">
            {PROCESS_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={step.num} className={`process-card-step animate-fade-in-up delay-${(i % 3) + 1}`}>
                  <div className="process-card-step__header">
                    <span className="process-card-step__num">{step.num}</span>
                    <div className="process-card-step__icon"><StepIcon size={20} /></div>
                  </div>
                  <h3 className="process-card-step__title">{step.title}</h3>
                  <p className="process-card-step__desc">{step.desc}</p>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/describe-need')} id="process-cta-btn">
              <span>{isFr ? 'RÉSERVER VOTRE CONSULTATION MÉDICALE' : isKr ? 'REZERV OU KONSILTASION' : 'BOOK YOUR MEDICAL CONSULTATION'}</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/how-it-works')} style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              <span>{isFr ? 'Découvrir le Parcours en Détail' : isKr ? 'Get Detay Parcours' : 'Explore Detailed 6-Step Guide'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured Hospitals (India Network) ───────────────────────────────── */}
      <section className="section home-hospitals">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{isFr ? 'Réseau Hospitalier en Inde' : isKr ? 'Rezo Lopital dan L\'inde' : 'India Hospital Network'}</span>
            <h2 className="text-h2">
              {isFr ? '15 Hôpitaux Partenaires de Premier Plan' : isKr ? '15 Gran Lopital Partener dan L\'inde' : 'Our Hospital Network at a Glance'}
            </h2>
            <p className="text-lead">
              {isFr
                ? 'Medical 360 facilite l\'accès aux équipes médicales hautement qualifiées à Chennai, Mumbai, Bengaluru, Hyderabad et Delhi NCR.'
                : isKr
                ? 'Akse fasil ar bann meyer dokter dan Chennai, Mumbai, Bengaluru, Hyderabad ek Delhi.'
                : 'Medical 360 facilitates access to established hospitals and specialist medical teams across India. Selection is based on individual medical requirements and international accreditation.'}
            </p>
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
                    <p className="hospital-card__location">📍 {hospital.city}, {hospital.country}</p>
                    <div className="hospital-card__stats">
                      <div className="hospital-card__rating">
                        <Star size={14} fill="#ffb400" color="#ffb400" />
                        <span>{hospital.rating}</span>
                        <span className="text-muted">({formatNumber(hospital.reviewCount)})</span>
                      </div>
                      {hospital.bedsCount > 0 && (
                        <span className="hospital-card__beds">{formatNumber(hospital.bedsCount)} beds</span>
                      )}
                    </div>
                    <p className="hospital-card__desc">{truncateText(l(hospital, 'description'), 115)}</p>
                  </div>
                </button>
              ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/hospitals')}>
              {isFr ? 'Découvrir les 15 Hôpitaux Partenaires' : isKr ? 'Get Tou Bann 15 Lopital' : 'Browse All 15 Partner Hospitals'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Why Choose Med360 (Social Enterprise Mission) ─────────────────────── */}
      <section className="section home-why">
        <div className="container">
          <div className="why-grid">
            <div className="why-content">
              <span className="section-label">
                {isFr ? '✦ Entreprise Sociale' : isKr ? '✦ Antrepriz Sosyal' : '✦ Social Impact Model'}
              </span>
              <h2 className="text-h2">
                {isFr ? 'Né d\'une Décennie de Compassion. Centré sur le Patient.' : isKr ? 'Ne depi 10 Banlane Konpasion. Santre lor Pasian.' : 'Born From a Decade of Compassion. Built Around the Patient.'}
              </h2>
              <p className="text-lead">
                {isFr
                  ? 'Medical 360 Ltd est une entreprise sociale créée par l\'ONG Enn Rev Enn Sourir (fondée en 2016). Notre mission : offrir une conciergerie médicale éthique et professionnelle aux patients solvables, dont les revenus contribuent directement à soigner ceux qui ne peuvent pas financer leurs soins.'
                  : isKr
                  ? 'Medical 360 apartenir a l\'ONG Enn Rev Enn Sourir. Nou ofer enn servis konsierzri medikal de kalite, e bann profi retourn dan l\'ONG pou ed bann pasian mizer gagn zot loperasion.'
                  : 'Medical 360 Ltd is a social enterprise initiative of NGO Enn Rev Enn Sourir (est. 2016). Patients receiving professional medical coordination generate sustainable revenue that directly supports vulnerable patients requiring life-saving treatment.'}
              </p>
              <div className="why-callout-box">
                <div className="why-callout-tagline">
                  <strong>{isFr ? 'Zéro Dividende. Priorité Absolue au Patient.' : isKr ? 'Zero Dividand. Pasian avan tou.' : 'No Dividends. Your Healthcare Matters.'}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  {isFr 
                    ? 'Votre parcours de soins crée une opportunité de soutenir le parcours de soins d\'un autre patient mauricien.'
                    : isKr
                    ? 'Ou vwayaz lasante kre enn loportinite pou sov lavi enn lot pasian.'
                    : 'Your healthcare journey creates an opportunity to support another healthcare journey.'}
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/about')} style={{ marginTop: '2rem' }}>
                <span>{isFr ? 'Lire Notre Histoire & Nos Affiliations (UICC)' : isKr ? 'Lir Nou Zistwar & Afiliasion (UICC)' : 'Read Our Story & Affiliations (UICC)'}</span>
                <ArrowRight size={16} />
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
            <span className="section-label">{isFr ? 'Témoignages & Récits Réels' : isKr ? 'Zistwar Vre Pasian' : 'Real Patient Stories'}</span>
            <h2 className="text-h2">{isFr ? 'Histoires de Guérison & d\'Espoir' : isKr ? 'Zistwar Gerizon & Lespwar' : 'Stories of Healing, Hope & Recovery'}</h2>
            <p className="text-lead">
              {isFr
                ? 'Découvrez comment plus d\'une décennie d\'accompagnement médical a redonné le sourire et la santé à des centaines de familles.'
                : isKr
                ? 'Dekouver kouma nou lasistans inn amenn soulasman ek sourir ar bann fami.'
                : 'Read how a decade of dedicated medical guidance has brought relief, healing, and peace of mind to families.'}
            </p>
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
                      {isFr ? 'Accompagné avec succès' : isKr ? 'Swene avek sikse' : 'Carefully Coordinated'}
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
              {isFr ? 'Lire Tous les Témoignages' : isKr ? 'Lir Tou Zistwar' : 'Read All Patient Stories'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Final CTA (Slide 18) ─────────────────────────────────────────────── */}
      <section className="home-cta">
        <div className="home-cta__bg" />
        <div className="container home-cta__inner">
          <div className="home-cta__content">
            <span className="badge badge-accent" style={{ marginBottom: '1rem' }}>
              {isFr ? 'Votre Santé Mérite de l\'Action' : isKr ? 'Ou Lasante Bizin Laksion' : 'Your Health Deserves Action, Not Uncertainty'}
            </span>
            <h2 className="home-cta__title">
              {isFr ? 'Quand Votre Santé Ne Peut Pas Attendre, Vous Non Plus.' : isKr ? 'Kan Ou Lasante Pa Kapav Atann, Ou Osi Ou Pa Bizin Atann.' : 'When Your Health Can’t Wait, Neither Should You.'}
            </h2>
            <p className="home-cta__subtitle">
              {isFr
                ? 'Une conversation peut changer la direction de vos soins de santé. Réservez votre consultation ou échangez directement avec un Patient Navigator sur WhatsApp.'
                : isKr
                ? 'Enn konversasion kapav sanz ou lasante net. Rezerv ou konsiltasion ouswa koze direk ar nou lekip lor WhatsApp.'
                : 'One conversation could change the direction of your healthcare journey. Start yours today with a dedicated Patient Navigator.'}
            </p>
            <div className="home-cta__actions">
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/describe-need')} id="home-final-cta-btn">
                <span>{isFr ? 'RÉSERVER VOTRE CONSULTATION MÉDICALE' : isKr ? 'REZERV OU KONSILTASION' : 'BOOK YOUR MEDICAL CONSULTATION'}</span>
                <ArrowRight size={18} />
              </button>
              <a
                href={buildMed360WhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} />
                <span>{isFr ? 'DISCUTER SUR WHATSAPP' : isKr ? 'KOZE LOR WHATSAPP' : 'CHAT WITH US ON WHATSAPP'}</span>
              </a>
            </div>
            <div style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              📱 WhatsApp / Tél : +230 5918 8275 &nbsp;|&nbsp; ✉️ Email : info@med360.mu
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default HomePage;
