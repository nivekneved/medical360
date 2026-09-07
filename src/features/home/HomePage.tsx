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
  const { i18n } = useTranslation();
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
    { icon: Building2,  value: '15',        label: isFr ? 'Pôles Hospitaliers en Inde' : isKr ? 'Lopital Partener dan L\'inde' : 'Premier Indian Hospital Hubs' },
    { icon: Award,      value: '10+ Years', label: isFr ? 'Années de Dévouement' : isKr ? 'Banlane D\'experyans Imin' : 'Years of Compassion' },
    { icon: HeartPulse, value: '100%',      label: isFr ? 'Zéro Dividende · Modèle Solidaire' : isKr ? 'Zero Dividann · 100% Sosyal' : 'No Dividends · 100% Impact' },
  ];

  const PROCESS_STEPS = [
    {
      num: '01',
      icon: FileText,
      title: isFr ? '01 — Vos Besoins Médicaux' : isKr ? '01 — Partaz Ou Bezwin Medikal' : '01 — Tell Us About Your Medical Needs',
      desc: isFr ? 'Partagez vos rapports, diagnostics et résultats. Un Patient Navigator dédié étudie votre situation et organise une visioconférence avec votre famille si nécessaire.' : isKr ? 'Partaz ou bann rapor medikal. Enn Patient Navigator pou ekout ou ek aranz videokonferans ar ou fami.' : 'Contact our team and share your medical reports. A dedicated Patient Navigator discusses your needs and arranges video family conferences when required.'
    },
    {
      num: '02',
      icon: Stethoscope,
      title: isFr ? '02 — Examen & Sélection' : isKr ? '02 — Revir & Swazir Lopital' : '02 — Medical Review & Hospital Selection',
      desc: isFr ? 'Identification des hôpitaux et spécialistes adaptés parmi notre réseau international et soumission sécurisée de votre dossier médical.' : isKr ? 'Nou rod bann meyer lopital ek dokter dan nou rezo internasional ek avoy ou dosie an sekirite.' : 'We identify appropriate hospitals and specialists within our international healthcare network and securely submit your medical records.'
    },
    {
      num: '03',
      icon: HeartPulse,
      title: isFr ? '03 — Plan, Devis & Téléconsultation' : isKr ? '03 — Plan, Devis & Telekonsiltasion' : '03 — Treatment Plan, Estimate & Teleconsultation',
      desc: isFr ? 'Réception de l\'avis spécialiste, devis estimatif et coordination d\'une téléconsultation vidéo directe avec le médecin traitant à l\'étranger avant votre départ.' : isKr ? 'Gagn lavi dokter, estimasion pri kler ek enn telekonsiltasion video direk ar sef sirizien avan ou voyaze.' : 'Receive specialist opinions, estimated hospital costs, and direct video teleconsultations with overseas treating specialists before travelling.'
    },
    {
      num: '04',
      icon: Plane,
      title: isFr ? '04 — Coordination du Voyage' : isKr ? '04 — Kordonasion Vwayaz' : '04 — We Coordinate Your Journey',
      desc: isFr ? 'Prise en charge complète : admissions, visa médical, vols, transferts aéroport, hébergement, ambulance terrestre ou avion médicalisé si nécessaire.' : isKr ? 'Nou okip ladmision, viza medikal, biye avion, lotel, transpor ek avion saniter si bizin.' : 'Hospital admissions, medical visas, flights, accommodation, airport transfers, ground ambulance, and private air-ambulance when required.'
    },
    {
      num: '05',
      icon: Building2,
      title: isFr ? '05 — Soins à l\'Étranger' : isKr ? '05 — Tretman a Letranze' : '05 — Treatment Abroad',
      desc: isFr ? 'Accueil à l\'arrivée, accompagnement durant l\'hospitalisation, au chevet du patient et soutien continu à vos proches accompagnateurs.' : isKr ? 'Akey dan lareopor, ladmision lopital, akonpanyeman o sive ek sipor pou ou fami.' : 'On-ground welcome, hospital admission, continuous bedside advocacy for you and your accompanying family member.'
    },
    {
      num: '06',
      icon: UserCheck,
      title: isFr ? '06 — Retour & Continuité des Soins' : isKr ? '06 — Retour Lakaz & Swivi' : '06 — Return Home & Follow-Up',
      desc: isFr ? 'Coordination des comptes rendus médicaux, téléconsultations de suivi post-opératoire et continuité des soins avec vos spécialistes à l\'étranger.' : isKr ? 'Rakor rapor medikal, telekonsiltasion swivi ek kontinwite bann swen kan ou retourn Moris.' : 'Post-treatment medical reports, follow-up teleconsultations, and seamless continuity of care once you return home.'
    },
  ];

  const WHY_CHOOSE = [
    { icon: Award,       title: isFr ? 'Né d\'une Décennie de Compassion' : isKr ? 'Ne depi 10 Banlane Konpasion' : 'Born From a Decade of Compassion',         desc: isFr ? 'Med360 est une initiative d\'entreprise sociale née de l\'ONG Enn Rev Enn Sourir (créée en 2016).' : isKr ? 'Med360 li enn linisiativ sosial l\'ONG Enn Rev Enn Sourir (kree an 2016).' : 'Med360 is a social enterprise initiative of NGO Enn Rev Enn Sourir (established 2016).' },
    { icon: Globe2,      title: isFr ? '15 Grands Hôpitaux en Inde' : isKr ? '15 Gran Lopital dan L\'inde' : '15 Premier Indian Hospital Hubs',   desc: isFr ? 'Accès direct aux centres d\'excellence à Chennai, Bengaluru, Hyderabad, Mumbai et Delhi NCR.' : isKr ? 'Akse direk ar bann gran sant medikal dan Chennai, Bengaluru, Hyderabad, Mumbai ek Delhi.' : 'Direct access to established clinical departments and accredited hospital hubs across India.' },
    { icon: ShieldCheck, title: isFr ? 'Éthique & Dignité du Patient' : isKr ? 'Etik & Dignite Pasian' : 'Ethics, Transparency & Dignity',  desc: isFr ? 'Un modèle où l\'éthique, le choix éclairé, les droits du patient et la dignité passent avant les intérêts commerciaux.' : isKr ? 'Tou kler, respe drwa pasian ek dignite avan tou lintere komersial.' : 'Informed choices and patient rights come before commercial interests. No hidden markups.' },
    { icon: HeartPulse,  title: isFr ? 'Zéro Dividende. Votre Santé Compte.' : isKr ? 'Zero Dividann. Ou Lasante Kont.' : 'No Dividends. Your Healthcare Matters.', desc: isFr ? 'Votre parcours de soins crée une opportunité de soutenir le parcours de soins d\'un autre patient vulnérable.' : isKr ? 'Ou vwayaz lasante kre enn loportinite pou soutenir vwayaz lasante enn lot pasian.' : 'Your healthcare journey creates an opportunity to support another healthcare journey.' },
  ];

  // Rich Schema.org JSON-LD for Homepage
  const schema = getMedicalOrganizationSchema();

  return (
    <main className="home">
      <SEO 
        title={isFr ? "Des Soins de Classe Mondiale · Sans Attente | Med360" : isKr ? "Swen Lasante Kalite · San Bizin Atann | Med360" : "World-Class Healthcare. Without the Wait. With the Dignity You Deserve."} 
        description={isFr ? "Med360 facilite l'accès aux hôpitaux établis et aux équipes médicales spécialisées en Inde. De votre première demande médicale jusqu'à vos soins à l'étranger et votre retour à domicile." : "Med360 coordinates world-class healthcare, specialist opinions, and patient travel from Mauritius to 15 accredited hospitals across India."} 
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
              {tCms('heroTitleLine1', isFr ? 'Des Soins de Classe Mondiale.' : isKr ? 'Swen Lasante Kalite.' : 'World-Class Healthcare.')}<br />
              <span className="gradient-text">
                {tCms('heroTitleLine2', isFr ? 'Sans Attente. Avec la Dignité que Vous Méritez.' : isKr ? 'San Bizin Atann. Avek Dignite ki Ou Merite.' : 'Without the Wait. With the Dignity You Deserve.')}
              </span>
            </h1>
            <p className="hero__subtitle">
              {isFr 
                ? 'Med360 facilite l\'accès aux hôpitaux établis et aux équipes médicales spécialisées en Inde. De votre première demande médicale et téléconsultation jusqu\'à votre traitement à l\'étranger et votre retour à domicile.'
                : isKr
                ? 'Med360 kordonn ou vwayaz lasante ver 15 gran lopital akredite dan L\'inde. Gagn lavi spesialis, estimasion pri kler ek akonpanyeman konple depi A a Z.'
                : 'Med360 facilitates access to established hospitals and specialist medical teams across India. From your first medical enquiry and specialist consultation to your treatment abroad and your return home.'
              }
            </p>
            
            <p className="hero__callout-quote">
              <em>{isFr ? '« Une conversation peut changer la trajectoire de vos soins. Commencez la vôtre dès aujourd\'hui. »' : isKr ? '« Enn konversasion kapav sanz ou vwayaz lasante. Koumans ou par zordi. »' : '“One conversation could change the direction of your healthcare journey. Start yours today.”'}</em>
            </p>

            <div className="hero__actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/describe-need?from=Home+Hero+Banner&serviceName=Free+Medical+Review')}
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
                <span>{isFr ? 'DISCUTER SUR WHATSAPP' : isKr ? 'KOZ AR NOU LOR WHATSAPP' : 'CHAT WITH US ON WHATSAPP'}</span>
              </a>
            </div>
            
            <div className="hero__trust">
              <div className="hero__stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#ffb400" color="#ffb400" />)}
              </div>
              <span className="hero__trust-text">
                {isFr ? '+3 000 Patients Accompagnés · Membre Titulaire UICC · Modèle Sans Dividende' : isKr ? '+3,000 Pasian Asiste · Manb UICC · Zero Dividann' : '+3,000 Patients Assisted · UICC Member Network · No Dividends Model'}
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

      {/* ── Specialties (14 Specialties) ─────────────────────────────────────── */}
      <section className="section home-specialties">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{isFr ? 'Spécialités Médicales' : isKr ? 'Spesialite Medikal' : 'Medical Specialties'}</span>
            <h2 className="text-h2">
              {isFr ? 'Soins de Pointe à Travers Nos Spécialités Médicales' : isKr ? 'Swen Avanse dan Bann Gran Spesialite Medikal' : 'Specialised Care Across Medical Disciplines'}
            </h2>
            <p className="text-lead">
              {isFr 
                ? 'Accédez à des spécialistes renommés et aux technologies diagnostiques et chirurgicales de pointe adaptées à votre situation.'
                : isKr
                ? 'Akse ar bann meyer spesialis ek teknolosi modern pou tou kalite tretman.'
                : 'Access experienced specialists, advanced diagnostics, and complex surgical procedures tailored to your medical condition.'}
            </p>
          </div>
          <div className="specialties-grid">
            {specLoading
              ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="specialty-card-full skeleton" style={{ height: 320 }} />)
              : specialties.slice(0, 8).map((sp, i) => (
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
                        {isFr ? 'Découvrir les Actes & Soins' : isKr ? 'Get Bann Tretman' : 'Explore Care & Procedures'} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/specialties')}>
              {isFr ? 'Voir Toutes les Spécialités' : isKr ? 'Get Tou Bann Spesialite' : 'View All Specialties'} <ArrowRight size={16} />
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
                ? 'Se faire soigner à l\'étranger peut sembler complexe. Med360 facilite votre parcours en coordonnant chaque étape — de votre première demande médicale jusqu\'à votre traitement à l\'étranger et votre retour à domicile.'
                : isKr
                ? 'Al fer swen a letranze kapav paret konplike. Med360 rann ou vwayaz pli fasil par kordonn sak letap — depi premie lavi dokter ziska tretman ek retour lakaz.'
                : 'Seeking medical treatment abroad can feel complicated. Med360 makes the journey easier by coordinating every step — from your first medical enquiry and specialist consultation to your treatment abroad and your return home.'}
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
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/describe-need?from=Home+Process+Section&serviceName=Treatment+Facilitation')} id="process-cta-btn">
              <span>{isFr ? 'RÉSERVER VOTRE CONSULTATION MÉDICALE' : isKr ? 'REZERV OU KONSILTASION MEDIKAL' : 'BOOK YOUR MEDICAL CONSULTATION'}</span>
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
              {isFr ? 'Notre Réseau Hospitalier en un Coup d\'Œil' : isKr ? 'Nou Rezo Lopital dan L\'inde' : 'Our Hospital Network at a Glance'}
            </h2>
            <p className="text-lead">
              {isFr
                ? 'Med360 facilite l\'accès aux hôpitaux établis et aux équipes médicales spécialisées en Inde. La sélection hospitalière est basée sur les besoins médicaux individuels, l\'accréditation, l\'expertise clinique et les technologies de pointe.'
                : isKr
                ? 'Med360 fasilit akse ar bann gran lopital ek dokter dan L\'inde. Swazir lopital baze lor bezwin pasian ek akreditasion JCI/NABH.'
                : 'Med360 facilitates access to established hospitals and specialist medical teams across India. Selection is based on individual medical requirements, accreditation, clinical expertise, and advanced technology.'}
            </p>
          </div>
          <div className="hospitals-grid">
            {hospLoading
              ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="hospital-card skeleton" style={{ height: 280 }} />)
              : hospitals.slice(0, 6).map(hospital => (
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
                {isFr ? '✦ Modèle Social & Philosophie' : isKr ? '✦ Antrepriz Sosyal' : '✦ Social Impact Model'}
              </span>
              <h2 className="text-h2">
                {isFr ? 'Né d\'une Décennie de Compassion. Centré sur le Patient.' : isKr ? 'Ne depi 10 Banlane Konpasion. Santre lor Pasian.' : 'Born From a Decade of Compassion. Built Around the Patient.'}
              </h2>
              <p className="text-lead">
                {isFr
                  ? 'Med360 est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir. Les patients qui ont les moyens de financer leurs soins reçoivent une coordination médicale professionnelle et personnalisée → Med360 génère des revenus durables → ces revenus contribuent à la mission sociale d\'Enn Rev Enn Sourir et soutiennent les patients vulnérables.'
                  : isKr
                  ? 'Med360 li enn linisiativ sosial l\'ONG Enn Rev Enn Sourir. Pasian ki kapav peye gagn enn kordonasion medikal profesyonel → Med360 kre reveni dirab → sa reveni la ed l\'ONG pou sov bann pasian vilnerab.'
                  : 'Med360 is a social enterprise initiative of Enn Rev Enn Sourir. Patients who can afford their healthcare receive professional medical coordination → Med360 generates sustainable revenue → that revenue contributes to the social mission of Enn Rev Enn Sourir and helps support vulnerable patients.'}
              </p>
              <div className="why-callout-box">
                <div className="why-callout-tagline">
                  <strong>{isFr ? 'Zéro Dividende. Votre Santé Compte.' : isKr ? 'Zero Dividann. Ou Lasante Kont.' : 'No Dividends. Your Healthcare Matters.'}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  {isFr 
                    ? 'Votre parcours de soins crée une opportunité de soutenir le parcours de soins d\'un autre patient.'
                    : isKr
                    ? 'Ou vwayaz lasante kre enn loportinite pou soutenir vwayaz lasante enn lot pasian.'
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
                ? 'Découvrez comment plus d\'une décennie d\'accompagnement médical a redonné le sourire et la santé à des familles.'
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
                      {cs.costSavedPercent}% {isFr ? 'Économisé' : isKr ? 'Gagne' : 'Saved'}
                    </div>
                  </div>
                  <div className="case-card__body">
                    <div className="case-card__stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#ffb400" color="#ffb400" />
                      ))}
                    </div>
                    <h3 className="case-card__treatment">{l(cs, 'treatment')}</h3>
                    <p className="case-card__condition">
                      <strong>{isFr ? 'Pathologie' : isKr ? 'Kondision' : 'Condition'}:</strong> {l(cs, 'condition')}
                    </p>
                    <blockquote className="case-card__quote">"{l(cs, 'testimonial')}"</blockquote>
                    <div className="case-card__footer">
                      <div>
                        <span className="case-card__patient">{cs.patientFirstName}</span>
                        <span className="case-card__country">📍 {l(cs, 'patientCountry')}</span>
                      </div>
                      <span className="case-card__year">{cs.year}</span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate('/case-studies')}>
              {isFr ? 'Voir Tous les Témoignages & Études de Cas' : isKr ? 'Get Tou Bann Zistwar' : 'View All Patient Stories & Case Studies'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Closing Call to Action ────────────────────────────────────────────── */}
      <section className="section home-cta">
        <div className="container">
          <div className="cta-box">
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffb400', marginBottom: '0.75rem' }}>
              <em>{isFr ? '« Une conversation peut changer la trajectoire de vos soins. Commencez la vôtre dès aujourd\'hui. »' : isKr ? '« Enn konversasion kapav sanz ou vwayaz lasante. Koumans ou par zordi. »' : '“One conversation could change the direction of your healthcare journey. Start yours today.”'}</em>
            </p>
            <h2 className="text-h2" style={{ color: '#fff', marginBottom: '1rem' }}>
              {isFr ? 'Votre Santé Mérite l\'Action, Pas l\'Incertitude.' : isKr ? 'Ou Lasante Merite Laksion, Pa Linzistis.' : 'Your Health Deserves Action, Not Uncertainty.'}
            </h2>
            <p className="text-lead" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 580, margin: '0 auto 2.5rem' }}>
              {isFr
                ? 'Prenez rendez-vous dès aujourd\'hui. Laissez-nous vous aider à comprendre vos options et vous mettre en relation avec les soins médicaux appropriés.'
                : isKr
                ? 'Pran ou randevou zordi mem. Les nou ed ou konpran ou bann opsion ek konekte ou ar bann meyer swen medikal.'
                : 'Book your appointment today. Let us help you understand your options and connect you with the right medical care.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/describe-need?from=Home+Bottom+CTA&serviceName=Free+Doctor+Review')} id="footer-cta-btn">
                <span>{isFr ? 'RÉSERVER VOTRE CONSULTATION MÉDICALE' : isKr ? 'REZERV OU KONSILTASION MEDIKAL' : 'BOOK YOUR MEDICAL CONSULTATION'}</span>
                <ArrowRight size={18} />
              </button>
              <a
                href={buildMed360WhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} />
                <span>{isFr ? 'DISCUTER SUR WHATSAPP' : isKr ? 'KOZ AR NOU LOR WHATSAPP' : 'CHAT WITH US ON WHATSAPP'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default HomePage;
