import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartHandshake, 
  FileText, 
  Plane, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  Building2, 
  Sparkles,
  Calculator,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../../components/SEO/SEO';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import './HowItWorks.css';

interface Step {
  num: string;
  badge: string;
  badge_fr: string;
  badge_kr: string;
  title: string;
  title_fr: string;
  title_kr: string;
  tagline: string;
  tagline_fr: string;
  tagline_kr: string;
  desc: string;
  desc_fr: string;
  desc_kr: string;
  highlights: { en: string; fr: string; kr: string }[];
  icon: any;
}

const CARE_PHASES: Step[] = [
  {
    num: '01',
    badge: 'Initial Consultation',
    badge_fr: 'Première Consultation',
    badge_kr: 'Premie Konsiltasion',
    title: 'Free Specialist Review & Treatment Plan',
    title_fr: 'Avis Spécialiste Gratuit & Devis Transparent',
    title_kr: 'Lavi Dokter Gratis & Pri Kler',
    tagline: '100% Free · No Obligation · Within 24-48 Hours',
    tagline_fr: '100% Gratuit · Sans Engagement · Sous 24-48h',
    tagline_kr: '100% Gratis · Oken Langazman · Dan 24-48h',
    desc: 'You share your current diagnosis, medical scans, or symptoms. Senior surgeons from our accredited partner hospitals review your reports and provide a personalized medical recommendation with clear costs.',
    desc_fr: 'Vous nous transmettez vos bilans ou comptes-rendus médicaux. Les chirurgiens chefs de nos hôpitaux partenaires examinent votre dossier et établissent un plan de soins personnalisé avec une estimation claire des coûts.',
    desc_kr: 'Ou avoy nou ou bann rapor medikal ek analiz. Bann gran dokter dan nou bann lopital partner egzaminen ou dosie ek donn ou enn plan tretman konple avek pri detaye.',
    highlights: [
      { en: 'Direct review by chief surgeons & department heads', fr: 'Examen direct par des chefs de service et chirurgiens experts', kr: 'Revizyon direk par bann sef sirizien renome' },
      { en: 'Transparent, all-inclusive hospital price quote', fr: 'Devis hospitalier tout compris, clair et sans frais cachés', kr: 'Devi kler san oken fre kasiet' },
      { en: 'Zero commitment — take all the time you need to decide', fr: 'Aucune pression — prenez le temps de réfléchir en famille', kr: 'Oken presyon — pran tou ou letan pou deside avek ou fami' },
    ],
    icon: FileText,
  },
  {
    num: '02',
    badge: 'Travel & Formalities',
    badge_fr: 'Voyage & Formalités',
    badge_kr: 'Vwayaz & Papye',
    title: 'Fast-Track Medical Visa & Travel Planning',
    title_fr: 'Visa Médical Accéléré & Organisation du Voyage',
    title_kr: 'Viza Medikal Rapid & Planifikasion Vwayaz',
    tagline: 'Official Hospital Visa Letters · Patient & Companion Support',
    tagline_fr: 'Lettres d\'Invitation Officielles · Prise en charge Patient & Accompagnant',
    tagline_kr: 'Let Invitasyon Ofisiel · Soutien Pasian ek Fanmi',
    desc: 'We issue official hospital medical visa invitation letters within 24 hours. Our team assists you with flight itineraries, travel documentation, and comfortable nearby accommodations for you and your companion.',
    desc_fr: 'Nous émettons les lettres officielles d\'invitation de visa médical sous 24 heures. Notre équipe vous accompagne pour les billets d\'avion, les formalités consulaires et la réservation d\'hébergements adaptés.',
    desc_kr: 'Nou donn ou let invitasyon lopital pou viza medikal dan 24 erdtan. Nou gid ou pou biye avion, papye viza ek lotel konfortab pre ar lopital.',
    highlights: [
      { en: 'Express medical visa invitation letter generated within 24 hours', fr: 'Lettre d\'invitation officielle pour visa médical émise sous 24h', kr: 'Let ofisiel lopital pou viza medikal emet dan 24h' },
      { en: 'Guidance for accompanying family members & attendants', fr: 'Prise en charge complète pour vos proches accompagnateurs', kr: 'Akonpanyeman pou bann manb fami ki vwayaze avek ou' },
      { en: 'Curated partner accommodations within 5-10 mins of hospital', fr: 'Hébergements partenaires vérifiés à 5-10 min de l\'hôpital', kr: 'Lotel ek lapartman verifie a 5-10 minit ar lopital' },
    ],
    icon: Plane,
  },
  {
    num: '03',
    badge: 'Bedside Care',
    badge_fr: 'Accompagnement Dédié',
    badge_kr: 'Swen lor Plas',
    title: 'Dedicated Personal Care Coordinator On-Ground',
    title_fr: 'Coordinateur Dédié à Vos Côtés à l\'Hôpital',
    title_kr: 'Kordonater Personnel lor Plas ar Ou',
    tagline: 'Airport Meet & Greet · Bedside Visits · French/Creole Interpreters',
    tagline_fr: 'Accueil Aéroport · Visites au Chevet · Interprètes Français/Créole',
    tagline_kr: 'Akoy Lareopor · Vizit Lopital · Interpret Franse/Kreol',
    desc: 'From the minute your flight lands, you are met by our team with private transport. Your dedicated patient coordinator stays by your side throughout admissions, consultations, and your hospital stay.',
    desc_fr: 'Dès votre atterrissage, notre équipe vous accueille et assure vos transferts privés. Votre coordinateur dédié vous accompagne lors de chaque rendez-vous, consultation et tout au long de votre hospitalisation.',
    desc_kr: 'Depi ou aterir, nou lekip akey ou avek transpor prive. Ou kordonater personel res ar ou dan tou randevou ek pandan ou sezour lopital.',
    highlights: [
      { en: 'Private airport pickup directly to your hotel or hospital', fr: 'Transfert aéroport privé et sécurisé directement vers l\'établissement', kr: 'Transpor prive depi lareopor ziska ou lotel ouswa lopital' },
      { en: 'Multilingual assistance (English, French, Creole, Hindi)', fr: 'Assistance linguistique complète en français, créole, anglais et hindi', kr: 'Lidans dan langaz ki ou konpran fasilman' },
      { en: 'Daily bedside check-ins and continuous family updates', fr: 'Visites quotidiennes au chevet et nouvelles régulières à vos proches', kr: 'Vizit sak zour ek nouvel regilie pou rasir ou fami Moris' },
    ],
    icon: HeartHandshake,
  },
  {
    num: '04',
    badge: 'Continuity & Recovery',
    badge_fr: 'Suivi & Rétablissement',
    badge_kr: 'Swivi & Geri',
    title: 'Safe Return Home & Post-Treatment Care',
    title_fr: 'Retour en Douceur & Suivi Médical à Distance',
    title_kr: 'Retour an Sekirite & Swivi Medikal',
    tagline: 'Fit-to-Fly Certification · Tele-Consultations · Lifelong Connection',
    tagline_fr: 'Certificat d\'Aptitude au Vol · Téléconsultations · Relation Durable',
    tagline_kr: 'Sertifika pou Vwayaze · Telekonsiltasion · Swivi Kontini',
    desc: 'Before returning home, your surgeon performs a comprehensive discharge review and issues a Fit-to-Fly certificate. Once home, Med360 coordinates your follow-up check-ups and medication refills.',
    desc_fr: 'Avant votre retour, votre chirurgien effectue un bilan complet de sortie et délivre votre certificat de vol. De retour chez vous, Med360 organise vos téléconsultations de suivi avec votre médecin.',
    desc_kr: 'Avan ou retourne, ou sirizien fer enn dernie kontrol konple ek donn ou sertifika vol. Kan ou lakaz, nou kontinie aranz bann swivi medikal.',
    highlights: [
      { en: 'Full medical dossier & discharge summary in English/French', fr: 'Dossier médical complet et compte-rendu de sortie détaillé', kr: 'Dosie medikal konple ek rapor sorti kler' },
      { en: 'Virtual video follow-ups with your treating surgeon', fr: 'Téléconsultations vidéo programmées avec votre chirurgien traitant', kr: 'Konsiltasion video ar ou sirizien kan ou fini retourn lakaz' },
      { en: '100% of Med360 profits reinvested in NGO Enn Rev Enn Sourir', fr: '100% des bénéfices Med360 reversés à l\'ONG Enn Rev Enn Sourir', kr: '100% bann profi retourn dan l\'ONG pou ed bann ki dan bezwin' },
    ],
    icon: ShieldCheck,
  },
];

const FAQS = [
  {
    q: 'How much does your concierge service cost me?',
    q_fr: 'Combien coûte votre service de conciergerie ?',
    q_kr: 'Kombien sa servis kordonasion-la koute ?',
    a: 'Our medical coordination is completely free to you as a patient. We are directly partnered with the hospitals, which means you pay the standard hospital rate with zero markups or hidden coordination fees.',
    a_fr: 'Notre service de coordination médicale est 100% gratuit pour le patient. Grâce à nos conventions directes avec les hôpitaux partenaires, vous réglez les tarifs officiels sans aucune majoration ni frais cachés.',
    a_kr: 'Nou servis kordonasion li konpletman gratis pou pasian. Ou pey direkteman pri ofisiel lopital san oken fre anplis.',
  },
  {
    q: 'How fast can I get a medical opinion and travel?',
    q_fr: 'En combien de temps puis-je obtenir un avis et partir ?',
    q_kr: 'Dan ki delay mo kapav gagn enn lavi ek vwayaze ?',
    a: 'We provide specialist opinions and quotations within 24 to 48 hours of receiving your medical scans. For urgent cases, medical visas and travel can be arranged within 3 to 5 days.',
    a_fr: 'Nous vous fournissons l\'avis médical et le devis sous 24 à 48 heures. Pour les cas urgents, les démarches de visa et de départ peuvent être organisées en 3 à 5 jours.',
    a_kr: 'Nou donn ou lavi dokter ek devi dan 24 a 48 erdtan. Pou bann ka irzan, viza ek vwayaz kapav aranze dan 3 a 5 zour.',
  },
  {
    q: 'Can a family member accompany me during treatment?',
    q_fr: 'Un membre de ma famille peut-il m\'accompagner ?',
    q_kr: 'Eski enn manb mo fami kapav vwayaze ar mwa ?',
    a: 'Yes, absolutely. We strongly encourage having a loved one with you. We arrange medical attendant visas, flight seats together, and twin-occupancy accommodations near the hospital.',
    a_fr: 'Oui, absolument. Nous facilitons le séjour de votre accompagnant avec un visa accompagnateur médical, des vols groupés et un hébergement adapté proche de l\'hôpital.',
    a_kr: 'Wi, sirman. Nou ankouraz ou vwayaz avek enn pros. Nou aranz viza akonpanyater, vol ansam ek lasam lotel pre ar lopital.',
  },
  {
    q: 'How does Med360 help the NGO Enn Rev Enn Sourir?',
    q_fr: 'Comment Med360 soutient-il l\'ONG Enn Rev Enn Sourir ?',
    q_kr: 'Kouma Med360 ed l\'ONG Enn Rev Enn Sourir ?',
    a: 'Med360 was founded by the NGO Enn Rev Enn Sourir after 10+ years of funding medical relief. 100% of Med360 company profits are directly transferred back to the NGO to finance surgeries for underprivileged Mauritian patients.',
    a_fr: 'Med360 a été créée par l\'ONG Enn Rev Enn Sourir après 10 ans d\'action humanitaire. 100% des bénéfices générés sont reversés à l\'ONG pour financer les interventions chirurgicales de familles démunies.',
    a_kr: 'Med360 finn kre par l\'ONG Enn Rev Enn Sourir. 100% bann profi al direk dan l\'ONG pou pey loperasion pou bann fami morisien ki pa kapav peye.',
  },
];

export function HowItWorksPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isFr = i18n.language === 'fr';
  const isKr = i18n.language === 'kr';

  const tLang = (obj: any, key: string) => {
    if (isFr && obj[`${key}_fr`]) return obj[`${key}_fr`];
    if (isKr && obj[`${key}_kr`]) return obj[`${key}_kr`];
    return obj[key];
  };

  return (
    <div className="how-it-works-page">
      <SEO
        title={isFr ? "Comment Ça Marche — Votre Parcours Médical Dédié" : isKr ? "Kouma Li Mase — Ou Vwayaz Medikal" : "How It Works — Your Compassionate Medical Journey"}
        description={isFr ? "Découvrez comment Med360 organise vos soins médicaux de A à Z avec bienveillance, transparence et 100% de vocation sociale." : "Discover how Med360 coordinates your medical care end-to-end with compassion, transparency, and 100% social mission."}
        canonical="/how-it-works"
      />

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="hiw-hero">
        <div className="container hiw-hero__inner">
          <div className="hiw-hero__badge">
            <Sparkles size={15} />
            <span>{isFr ? "Une Prise en Charge Bienveillante à 360°" : isKr ? "Akonpanyeman 360° avek Leker" : "Gentle, Reassuring Care from Day One"}</span>
          </div>

          <h1 className="hiw-hero__title">
            {isFr ? "Votre Parcours Médical en Toute Sérénité" : isKr ? "Ou Vwayaz Medikal an Tout Trankilite" : "Your Health Journey, Guided with Care"}
          </h1>

          <p className="hiw-hero__subtitle">
            {isFr
              ? "De votre premier avis médical sans engagement jusqu'à votre retour chez vous, nous veillons sur chaque détail médical, logistique et humain."
              : isKr
              ? "Depi premie lavi dokter gratis ziska ou retourn lakaz an bonn sante, nou okip tou bann detay avek pasion ek profesyonalizm."
              : "From your initial free surgeon review to your safe recovery back home, our team coordinates every clinical, visa, and travel detail so you can focus entirely on healing."}
          </p>

          <div className="hiw-hero__actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/describe-need')}
              id="hiw-hero-cta"
            >
              <span>{isFr ? "Demander Mon Avis Médical Gratuit" : isKr ? "Gagn Mo Lavi Dokter Gratis" : "Get Free Doctor Review"}</span>
              <ArrowRight size={18} />
            </button>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
              id="hiw-hero-whatsapp"
            >
              <MessageCircle size={18} />
              <span>{isFr ? "Échanger sur WhatsApp" : isKr ? "Koz ar Nou lor WhatsApp" : "Talk with a Coordinator"}</span>
            </a>
          </div>

          {/* Quick Trust Bar */}
          <div className="hiw-trust-bar">
            <div className="hiw-trust-item">
              <CheckCircle2 size={18} className="hiw-trust-icon" />
              <span>{isFr ? "100% Gratuit pour le patient" : isKr ? "100% Gratis pou pasian" : "100% Free coordination"}</span>
            </div>
            <div className="hiw-trust-item">
              <Building2 size={18} className="hiw-trust-icon" />
              <span>{isFr ? "Hôpitaux accrédités JCI / NABH" : isKr ? "Lopital akredite JCI / NABH" : "JCI & NABH accredited hospitals"}</span>
            </div>
            <div className="hiw-trust-item">
              <UserCheck size={18} className="hiw-trust-icon" />
              <span>{isFr ? "Coordinateur dédié sur place" : isKr ? "Kordonater personel lor plas" : "Dedicated bedside coordinator"}</span>
            </div>
            <div className="hiw-trust-item">
              <HeartHandshake size={18} className="hiw-trust-icon" />
              <span>{isFr ? "100% Bénéfices à l'ONG" : isKr ? "100% Profi pou l'ONG" : "100% Profits support NGO"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 Phases of Care ─────────────────────────────────────────────────── */}
      <section className="hiw-phases-section">
        <div className="container">
          <div className="hiw-section-header">
            <span className="section-label">{isFr ? "Les 4 Étapes Simples" : isKr ? "Bann 4 Letap Sinp" : "The 4-Step Pathway"}</span>
            <h2 className="text-h2">
              {isFr ? "Comment Nous Prenons Soin de Vous" : isKr ? "Kouma Nou Okip Ou" : "How We Walk Beside You"}
            </h2>
            <p className="text-lead">
              {isFr 
                ? "Un accompagnement humain, rigoureux et transparent à chaque étape de votre démarche médicale." 
                : "A gentle, transparent, and structured experience designed to remove every bit of anxiety."}
            </p>
          </div>

          <div className="hiw-phases-list">
            {CARE_PHASES.map((phase) => {
              const IconComp = phase.icon;
              return (
                <div key={phase.num} className="hiw-phase-card">
                  <div className="hiw-phase-card__header">
                    <div className="hiw-phase-card__num-wrap">
                      <span className="hiw-phase-card__num">{phase.num}</span>
                    </div>
                    <div className="hiw-phase-card__title-wrap">
                      <span className="hiw-phase-card__badge">{tLang(phase, 'badge')}</span>
                      <h3 className="hiw-phase-card__title">{tLang(phase, 'title')}</h3>
                      <span className="hiw-phase-card__tagline">{tLang(phase, 'tagline')}</span>
                    </div>
                  </div>

                  <p className="hiw-phase-card__desc">{tLang(phase, 'desc')}</p>

                  <div className="hiw-phase-card__highlights">
                    {phase.highlights.map((h, i) => (
                      <div key={i} className="hiw-phase-card__highlight-item">
                        <CheckCircle2 size={16} className="hiw-check-icon" />
                        <span>{isFr ? h.fr : isKr ? h.kr : h.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NGO Heritage Reassurance Box ─────────────────────────────────────── */}
      <section className="hiw-ngo-banner">
        <div className="container">
          <div className="hiw-ngo-card">
            <div className="hiw-ngo-content">
              <span className="badge badge-accent">✦ {isFr ? "Notre Promesse Sociale" : isKr ? "Nou Langazman Sosyal" : "Our Humanitarian Promise"}</span>
              <h2 className="hiw-ngo-title">
                {isFr 
                  ? "Une entreprise sociale au service de la vie" 
                  : isKr 
                  ? "Enn lakonpanyi kre pou sov lavi" 
                  : "A Social Enterprise Rooted in Compassion"}
              </h2>
              <p className="hiw-ngo-text">
                {isFr
                  ? "Créée par l'ONG Enn Rev Enn Sourir après plus de 10 ans de dévouement humanitaire, Med360 réinjecte 100% de ses bénéfices dans le financement d'interventions chirurgicales pour les familles mauriciennes les plus défavorisées. En choisissant Med360, votre santé contribue à sauver une autre vie."
                  : isKr
                  ? "Med360 finn kre par l'ONG Enn Rev Enn Sourir apre 10 banlane led imaniter. 100% nou bann profi retourn dan l'ONG pou finansie loperasion pou bann fami ki pa kapav peye. Kan ou swazir Med360, ou pe ed enn lot dimounn gagn lavi."
                  : "Founded by the NGO Enn Rev Enn Sourir with over 10 years of humanitarian medical coordination, 100% of Med360 company profits are directly returned to the NGO to sponsor life-saving surgeries for underprivileged patients. Choosing Med360 means your healing helps someone else heal."}
              </p>
              <div className="hiw-ngo-actions">
                <button className="btn btn-primary" onClick={() => navigate('/about')}>
                  <span>{isFr ? "Découvrir Notre Histoire" : isKr ? "Dekouver Nou Zistwar" : "Read Our Full Story"}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <div className="hiw-ngo-image-wrap">
              <img 
                src="/assets/consultation-support.jpg" 
                alt="Compassionate patient consultation"
                className="hiw-ngo-img" 
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ──────────────────────────────────────────────────────── */}
      <section className="hiw-faq-section">
        <div className="container">
          <div className="hiw-section-header">
            <span className="section-label">{isFr ? "Questions Fréquentes" : isKr ? "Kestyon Souvan Poze" : "Frequently Asked Questions"}</span>
            <h2 className="text-h2">
              {isFr ? "Nous Répondons à Vos Interrogations" : isKr ? "Repons Kler pou Ou" : "Clear Answers to Put Your Mind at Ease"}
            </h2>
          </div>

          <div className="hiw-faq-list">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className={`hiw-faq-item ${isOpen ? 'hiw-faq-item--open' : ''}`}
                >
                  <button 
                    className="hiw-faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{tLang(faq, 'q')}</span>
                    <ChevronDown size={18} className={`hiw-faq-chevron ${isOpen ? 'hiw-faq-chevron--rotated' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="hiw-faq-answer">
                      <p>{tLang(faq, 'a')}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Direct Warm Call To Action ───────────────────────────────────────── */}
      <section className="hiw-cta-section">
        <div className="container hiw-cta-box">
          <h2 className="hiw-cta-title">
            {isFr 
              ? "Prêt à parler avec l'un de nos coordinateurs ?" 
              : isKr 
              ? "Pare pou koz avek enn nou kordonater ?" 
              : "Ready to Speak with a Compassionate Coordinator?"}
          </h2>
          <p className="hiw-cta-subtitle">
            {isFr
              ? "Sans aucun engagement et en toute confidentialité. Nous examinons vos rapports et répondons à toutes vos questions."
              : isKr
              ? "Konpletman gratis ek konfidansyel. Nou get ou bann dosie ek repon tou ou bann kestyon avek plezir."
              : "Zero pressure, completely free, and strictly confidential. Let our clinical team review your documents and provide immediate clarity."}
          </p>
          <div className="hiw-cta-buttons">
            <button 
              className="btn btn-accent btn-lg"
              onClick={() => navigate('/describe-need')}
              id="hiw-bottom-cta"
            >
              <span>{isFr ? "Obtenir Mon Plan de Traitement Gratuit" : isKr ? "Gagn Mo Plan Tretman Gratis" : "Get Free Treatment Plan"}</span>
              <ArrowRight size={18} />
            </button>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <MessageCircle size={18} />
              <span>{isFr ? "Message WhatsApp Immédiat" : isKr ? "Mesaz WhatsApp Direk" : "WhatsApp Us Directly"}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
export default HowItWorksPage;
