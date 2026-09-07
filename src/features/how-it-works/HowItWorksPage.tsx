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
  ChevronDown,
  Ambulance,
  PhoneCall,
  Video
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
    badge: 'Initial Consultation & Medical Review',
    badge_fr: 'Consultation Initiale & Examen Médical',
    badge_kr: 'Premie Konsiltasion & Rapor Medikal',
    title: 'Free Specialist Review & Treatment Assessment',
    title_fr: 'Avis Spécialiste Gratuit & Évaluation Clinique',
    title_kr: 'Lavi Dokter Gratis & Evalwasion Medikal',
    tagline: '100% Free · No Obligation · Response in 24-48 Hours',
    tagline_fr: '100% Gratuit · Sans Engagement · Réponse sous 24-48h',
    tagline_kr: '100% Gratis · Oken Langazman · Repons dan 24-48h',
    desc: 'You share your medical history, scan reports (MRI, CT, PET-CT, Biopsy), or symptoms. Senior specialists from our 15 partner hospital hubs review your dossier and recommend the best clinical pathway.',
    desc_fr: 'Vous nous transmettez vos bilans, imageries (IRM, Scanner, PET-Scan) ou comptes-rendus. Les chirurgiens chefs de nos 15 centres hospitaliers partenaires examinent votre dossier et préconisent le protocole optimal.',
    desc_kr: 'Ou partaz ou bann rapor medikal, skann (IRM, Scanner, PET-Scan) ouswa sintom. Bann sef sirizien dan nou 15 lopital partner get ou dosie pou gid ou lor meyer swen.',
    highlights: [
      { en: 'Direct second opinion from senior department heads', fr: 'Second avis direct par des chefs de service réputés', kr: 'Deziem lavi direk par bann gran sef sirizien' },
      { en: 'Thorough evaluation of surgical & non-surgical alternatives', fr: 'Évaluation des alternatives chirurgicales et protocoles innovants', kr: 'Evalwasion tou bann opsion tretman posib' },
      { en: 'Zero cost and no commitment required', fr: '100% gratuit et sans aucune obligation de votre part', kr: 'Zéro fre ek oken lobligasion' },
    ],
    icon: FileText,
  },
  {
    num: '02',
    badge: 'Treatment Plan & Transparent Pricing',
    badge_fr: 'Plan de Soins & Tarifs Transparents',
    badge_kr: 'Plan Tretman & Pri Kler',
    title: 'Itemized Hospital Quotes & Multiple Options',
    title_fr: 'Devis Hospitaliers Détaillés & Choix Multi-Centres',
    title_kr: 'Devi Detaye Lopital & Plizier Swa',
    tagline: 'Official Hospital Rates · Zero Hidden Surcharges',
    tagline_fr: 'Tarifs Officiels des Hôpitaux · Zéro Frais Cachés',
    tagline_kr: 'Pri Ofisiel Lopital · Zéro Fre Kasiet',
    desc: 'We present clear, itemized treatment plans from top hospital hubs (Apollo, Manipal, Medanta, KIMS, Fortis, etc.) detailing procedure costs, bed stay length, and surgeon qualifications so you can choose with full confidence.',
    desc_fr: 'Nous vous présentons des devis transparents et détaillés émanant des meilleurs centres (Apollo, Manipal, Medanta, KIMS, Fortis...), avec durée estimée de séjour et qualifications des praticiens.',
    desc_kr: 'Nou propoz ou bann devi kler depi bann meyer lopital (Apollo, Manipal, Medanta, KIMS, Fortis...), avek dire sezour ek leksperyans sirizien pou ou kapav swazir trankil.',
    highlights: [
      { en: 'Comparison between leading specialized hospitals in India', fr: 'Comparatif objectif entre les meilleurs hôpitaux d\'Inde', kr: 'Konparezon ant bann pli gran lopital spesialize' },
      { en: 'Transparent, all-inclusive packages (surgery, ICU, ward, meds)', fr: 'Forfaits tout compris (chirurgie, réanimation, chambre, médicaments)', kr: 'Pri konple (operasion, swen intensif, lasam, medikaman)' },
      { en: 'Guidance on financial options & insurance pre-authorizations', fr: 'Conseils pour prises en charge d\'assurance et aides médicales', kr: 'Gid pou lasirans ek led finansier' },
    ],
    icon: Calculator,
  },
  {
    num: '03',
    badge: 'Travel, Visa & Logistics',
    badge_fr: 'Voyage, Visa & Logistique',
    badge_kr: 'Vwayaz, Viza & Loxistik',
    title: 'Fast-Track Medical Visa & Travel Assistance',
    title_fr: 'Visa Médical Accéléré & Organisation Logistique',
    title_kr: 'Viza Medikal Rapid & Akonpanyeman Vwayaz',
    tagline: '24-Hour Invitation Letters · Patient & Companion Support',
    tagline_fr: 'Lettres d\'Invitation sous 24h · Patient & Accompagnateur',
    tagline_kr: 'Let Invitasion dan 24h · Pasian & Akonpanyater',
    desc: 'We arrange official hospital medical visa invitation letters within 24 hours. Our team assists you with flight bookings, visa paperwork, and comfortable accommodations near the hospital.',
    desc_fr: 'Nous émettons les lettres officielles d\'invitation de visa médical sous 24 heures. Notre équipe vous accompagne pour les formalités consulaires, les billets d\'avion et les hébergements partenaires.',
    desc_kr: 'Nou fer gagn let invitasion viza medikal dan 24 erdtan. Nou ed ou avek viza, biye avion ek rezervasion lotel pre ar lopital.',
    highlights: [
      { en: 'Express medical visa invitation letter generated within 24 hours', fr: 'Lettre d\'invitation officielle pour visa médical émise sous 24h', kr: 'Let ofisiel lopital pou viza medikal emet dan 24h' },
      { en: 'Visa support for accompanying family members & attendants', fr: 'Prise en charge complète pour vos proches accompagnateurs', kr: 'Sipor viza pou bann manb fami ki vwayaz avek ou' },
      { en: 'Curated partner accommodations within 5-10 mins of hospital', fr: 'Hébergements partenaires vérifiés à 5-10 min de l\'hôpital', kr: 'Lotel ek lapartman verifie a 5-10 minit ar lopital' },
    ],
    icon: Plane,
  },
  {
    num: '04',
    badge: 'Ground & Air Ambulance Transport',
    badge_fr: 'Ambulance & Rapatriement Sanitaire',
    badge_kr: 'Transpor Saniter & Lamerzans',
    title: 'Emergency Medical Evacuation & Ground Transfers',
    title_fr: 'Évacuation Sanitaire & Transferts Médicalisés',
    title_kr: 'Evakuasion Saniter & Lanbilans',
    tagline: 'Dedicated Air Ambulance · Airport Tarmac Clearance',
    tagline_fr: 'Avions Médicalisés Dédiés · Accès Tarmac Prioritaire',
    tagline_kr: 'Avion Medikalize · Lakse Tarmac Direkteman',
    desc: 'For critical, intensive care, or immobility cases, we coordinate certified air ambulance jets with full ICU capabilities and on-board medical teams, as well as tarmac-side ground ambulances.',
    desc_fr: 'Pour les cas critiques, soins intensifs ou patients à mobilité réduite, nous coordonnons des vols sanitaires par avion médicalisé (ICU à bord) et des ambulances terrestres prioritaires sur le tarmac.',
    desc_kr: 'Pou bann ka irzan ouswa swen intensif, nou aranz avion saniter avek dokter a-bor ek lanbilans direkteman kot avion poze.',
    highlights: [
      { en: 'Fully equipped airborne ICU with intensivist physician on board', fr: 'Unité de soins intensifs volante avec médecin réanimateur à bord', kr: 'Swen intensif konple dan lavion avek dokter spesialis' },
      { en: 'Direct airport tarmac clearance and private ambulance transfer', fr: 'Accès tarmac direct et transfert immédiat en ambulance vers l\'hôpital', kr: 'Transpor direk depi pist ziska lasam lopital' },
      { en: '24/7 emergency dispatch response team', fr: 'Cellule de veille d\'urgence disponible 24h/24 et 7j/7', kr: 'Lekip dispatc lamerzans zonn 24/7' },
    ],
    icon: Ambulance,
  },
  {
    num: '05',
    badge: 'Bedside Care & On-Ground Coordination',
    badge_fr: 'Accompagnement Dédié au Chevet',
    badge_kr: 'Swen lor Plas & Kordonater',
    title: 'Dedicated Personal Care Coordinator On-Ground',
    title_fr: 'Coordinateur Dédié à Vos Côtés à l\'Hôpital',
    title_kr: 'Kordonater Personnel lor Plas ar Ou',
    tagline: 'Airport Meet & Greet · Bedside Visits · French/Creole Interpreters',
    tagline_fr: 'Accueil Aéroport · Visites au Chevet · Interprètes Français/Créole',
    tagline_kr: 'Akoy Lareopor · Vizit Lopital · Interpret Franse/Kreol',
    desc: 'From the minute your flight lands, you are met by our on-ground team. Your dedicated patient coordinator stays by your side throughout admissions, consultations, tests, and your hospital stay.',
    desc_fr: 'Dès votre atterrissage, notre équipe vous accueille et assure vos transferts privés. Votre coordinateur dédié vous accompagne lors de chaque rendez-vous, consultation et tout au long de votre hospitalisation.',
    desc_kr: 'Depi ou aterir, nou lekip akey ou avek transpor prive. Ou kordonater personel res ar ou dan tou randevou ek pandan ou sezour lopital.',
    highlights: [
      { en: 'Personal coordinator assisting with all hospital formalities', fr: 'Coordinateur personnel facilitant toutes les démarches hospitalières', kr: 'Kordonater personel pou ed avek tou bann papye lopital' },
      { en: 'Multilingual assistance (English, French, Creole, Hindi)', fr: 'Assistance linguistique complète en français, créole, anglais et hindi', kr: 'Lidans dan langaz ki ou konpran fasilman' },
      { en: 'Daily bedside visits and continuous family updates', fr: 'Visites quotidiennes au chevet et nouvelles régulières à vos proches', kr: 'Vizit sak zour ek nouvel regilie pou rasir ou fami Moris' },
    ],
    icon: HeartHandshake,
  },
  {
    num: '06',
    badge: 'Post-Treatment Care & Teleconsultation',
    badge_fr: 'Suivi Post-Opératoire & Téléconsultation',
    badge_kr: 'Swivi Post-Operatwar & Telekonsiltasion',
    title: 'Safe Return Home & Continuous Clinical Follow-Up',
    title_fr: 'Retour en Douceur & Suivi Médical à Distance',
    title_kr: 'Retour an Sekirite & Swivi Medikal Kontini',
    tagline: 'Fit-to-Fly Certification · Doctor Teleconsultations · Lifelong Care',
    tagline_fr: 'Certificat d\'Aptitude au Vol · Téléconsultations · Relation Durable',
    tagline_kr: 'Sertifika pou Vwayaze · Telekonsiltasion · Swivi Kontini',
    desc: 'Before departure, your surgeon conducts a comprehensive discharge review and issues a Fit-to-Fly certificate. Once home in Mauritius, Med360 coordinates scheduled video teleconsultations with your treating doctor.',
    desc_fr: 'Avant votre retour, votre chirurgien effectue un bilan complet de sortie et délivre votre certificat d\'aptitude au vol. De retour chez vous, Med360 organise vos téléconsultations vidéo régulières.',
    desc_kr: 'Avan ou retourne, ou sirizien fer enn dernie kontrol konple ek donn ou sertifika vol. Kan ou lakaz Moris, nou kontinie aranz bann swivi video ar ou dokter.',
    highlights: [
      { en: 'Full medical dossier & discharge summary in English/French', fr: 'Dossier médical complet et compte-rendu de sortie détaillé', kr: 'Dosie medikal konple ek rapor sorti kler' },
      { en: 'Virtual video follow-ups with your treating overseas surgeon', fr: 'Téléconsultations vidéo programmées avec votre chirurgien traitant', kr: 'Konsiltasion video ar ou sirizien kan ou fini retourn lakaz' },
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
    a: 'Medical 360 Ltd was founded by the NGO Enn Rev Enn Sourir with a strict "No Dividends" policy. 100% of company profits are directly transferred back to the NGO to finance surgeries for underprivileged Mauritian patients.',
    a_fr: 'Medical 360 Ltd a été créée par l\'ONG Enn Rev Enn Sourir avec une politique de « Zéro Dividende ». 100% des bénéfices générés sont reversés à l\'ONG pour financer les interventions chirurgicales de familles démunies.',
    a_kr: 'Medical 360 Ltd finn kre par l\'ONG Enn Rev Enn Sourir avek model Zéro Dividenn. 100% bann profi al direk dan l\'ONG pou pey loperasion pou bann fami morisien ki pa kapav peye.',
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
        title={isFr ? "Comment Ça Marche — Votre Parcours Médical en 6 Étapes" : isKr ? "Kouma Li Mase — Ou Vwayaz Medikal dan 6 Letap" : "How It Works — Your 6-Step Compassionate Care Journey"}
        description={isFr ? "Découvrez comment Med360 organise vos soins médicaux de A à Z : avis sous 24-48h, visas rapides, coordinateurs au chevet, évacuation sanitaire et suivi post-opératoire." : "Discover how Med360 coordinates your medical care end-to-end: 24-48h specialist opinion, fast visas, bedside coordination, emergency air ambulance, and teleconsultations."}
        canonical="/how-it-works"
      />

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="hiw-hero">
        <div className="container hiw-hero__inner">
          <div className="hiw-hero__badge">
            <Sparkles size={15} />
            <span>{isFr ? "Une Prise en Charge Bienveillante & Complète à 360°" : isKr ? "Akonpanyeman 360° avek Leker" : "Gentle, Reassuring 360° Care from Day One"}</span>
          </div>

          <h1 className="hiw-hero__title">
            {isFr ? "Votre Parcours Médical en 6 Étapes Claires" : isKr ? "Ou Vwayaz Medikal an 6 Letap Sinp" : "Your Health Journey in 6 Simple Steps"}
          </h1>

          <p className="hiw-hero__subtitle">
            {isFr
              ? "De votre premier avis médical sans engagement jusqu'à vos téléconsultations de contrôle chez vous, nous veillons sur chaque détail clinique, logistique et humain."
              : isKr
              ? "Depi premie lavi dokter gratis ziska ou retourn lakaz an bonn sante, nou okip tou bann detay avek pasion ek profesyonalizm."
              : "From your initial free surgeon review to post-treatment teleconsultations back home, our team coordinates every clinical, visa, ambulance, and bedside detail."}
          </p>

          <div className="hiw-hero__actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/describe-need')}
              id="hiw-hero-cta"
            >
              <span>{isFr ? "Demander Mon Avis Médical Gratuit" : isKr ? "Gagn Mo Lavi Dokter Gratis" : "BOOK YOUR MEDICAL CONSULTATION"}</span>
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
              <span>{isFr ? "Échanger sur WhatsApp" : isKr ? "Koz ar Nou lor WhatsApp" : "CHAT WITH US ON WHATSAPP"}</span>
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
              <span>{isFr ? "15 Hôpitaux accrédités JCI / NABH" : isKr ? "15 Lopital akredite JCI / NABH" : "15 JCI/NABH accredited hospitals"}</span>
            </div>
            <div className="hiw-trust-item">
              <UserCheck size={18} className="hiw-trust-icon" />
              <span>{isFr ? "Coordinateur dédié au chevet" : isKr ? "Kordonater personel lor plas" : "Dedicated bedside coordinator"}</span>
            </div>
            <div className="hiw-trust-item">
              <HeartHandshake size={18} className="hiw-trust-icon" />
              <span>{isFr ? "+3 000 Patients accompagnés" : isKr ? "+3 000 Pasian asiste" : "+3,000 Patients assisted"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 Phases of Care ─────────────────────────────────────────────────── */}
      <section className="hiw-phases-section">
        <div className="container">
          <div className="hiw-section-header">
            <span className="section-label">{isFr ? "Le Parcours Complet en 6 Étapes" : isKr ? "Bann 6 Letap Konple" : "The Complete 6-Step Journey"}</span>
            <h2 className="text-h2">
              {isFr ? "Comment Nous Vous Accompagnons de Bout en Bout" : isKr ? "Kouma Nou Okip Ou Depi Koumansman Ziska Lafin" : "How We Guide You Every Step of the Way"}
            </h2>
            <p className="text-lead">
              {isFr 
                ? "Un accompagnement humain, médical et logistique rigoureux conçu pour dissiper toute anxiété." 
                : "A gentle, transparent, and structured experience designed to remove every bit of anxiety."}
            </p>
          </div>

          <div className="hiw-phases-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {CARE_PHASES.map((phase) => {
              const IconComp = phase.icon;
              return (
                <div key={phase.num} className="hiw-phase-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
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
                  </div>

                  <div className="hiw-phase-card__highlights" style={{ marginTop: '1.25rem' }}>
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
                  ? "Créée par l'ONG Enn Rev Enn Sourir après plus de 10 ans de dévouement humanitaire, Medical 360 Ltd réinjecte 100% de ses bénéfices dans le financement d'interventions chirurgicales pour les familles mauriciennes les plus défavorisées. En choisissant Medical 360 Ltd, votre santé contribue à sauver une autre vie."
                  : isKr
                  ? "Medical 360 Ltd finn kre par l'ONG Enn Rev Enn Sourir apre 10 banlane led imaniter. 100% nou bann profi retourn dan l'ONG pou finansie loperasion pou bann fami ki pa kapav peye. Kan ou swazir Medical 360 Ltd, ou pe ed enn lot dimounn gagn lavi."
                  : "Founded by the NGO Enn Rev Enn Sourir with over 10 years of humanitarian medical coordination, 100% of Medical 360 Ltd profits are directly returned to the NGO to sponsor life-saving surgeries for underprivileged patients. Choosing Medical 360 Ltd means your healing helps someone else heal."}
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
              <span>{isFr ? "Obtenir Mon Plan de Traitement Gratuit" : isKr ? "Gagn Mo Plan Tretman Gratis" : "BOOK YOUR MEDICAL CONSULTATION"}</span>
              <ArrowRight size={18} />
            </button>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <MessageCircle size={18} />
              <span>{isFr ? "Message WhatsApp Immédiat" : isKr ? "Mesaz WhatsApp Direk" : "CHAT WITH US ON WHATSAPP"}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
export default HowItWorksPage;
