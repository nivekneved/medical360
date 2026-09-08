import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartHandshake, 
  FileText, 
  Plane, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  Building2, 
  Sparkles,
  Calculator,
  ChevronDown,
  Ambulance,
  Stethoscope
} from 'lucide-react';
import { useL10n } from '../../hooks/useL10n';
import { SEO } from '../../components/SEO/SEO';
import { getFaqPageSchema } from '../../core/services/schema.service';
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
    badge: 'Step 01',
    badge_fr: 'Étape 01',
    badge_kr: 'Letap 01',
    title: '01 — Tell Us About Your Medical Needs',
    title_fr: '01 — Faites-nous Part de Vos Besoins Médicaux',
    title_kr: '01 — Partaz Ou Bann Bezwin Medikal',
    tagline: 'Dedicated Patient Navigator · Medical Record Review',
    tagline_fr: 'Patient Navigator Dédié · Examen des Dossiers Médicaux',
    tagline_kr: 'Kordonater Pasian Dedie · Lekzamin Rapor Medikal',
    desc: 'Contact our team and share your medical reports, diagnosis, test results and current treatment information. A dedicated Patient Navigator will discuss your needs and, when required, arrange a video conference with you and your family to better understand your situation, answer your questions and guide you through the next steps.',
    desc_fr: 'Contactez notre équipe et partagez vos rapports médicaux, diagnostics, résultats d\'examens et traitements actuels. Un Patient Navigator dédié étudiera vos besoins et organisera si nécessaire une visioconférence avec vous et votre famille pour répondre à vos questions et vous guider.',
    desc_kr: 'Kontak nou lekip ek partaz ou bann rapor medikal,診iagnostik ek rezilta tes. Enn Patient Navigator dedie pou diskit ou bezwin ek aranz enn videokonferans ar ou ek ou fami pou reponn ou kestion.',
    highlights: [
      { en: 'Dedicated Patient Navigator listening to your medical situation', fr: 'Un Patient Navigator dédié à l\'écoute de votre situation médicale', kr: 'Enn Patient Navigator dedie pou ekout ou sitiasion' },
      { en: 'Thorough review of reports, diagnostics & current treatment', fr: 'Examen approfondi des bilans, diagnostics et traitements en cours', kr: 'Revir konple ou bann dosie ek lanaliz' },
      { en: 'Video family conferences arranged whenever required', fr: 'Organisation de visioconférences avec vous et votre famille', kr: 'Aranz videokonferans avek ou fami kan bizin' },
    ],
    icon: FileText,
  },
  {
    num: '02',
    badge: 'Step 02',
    badge_fr: 'Étape 02',
    badge_kr: 'Letap 02',
    title: '02 — Medical Review & Hospital Selection',
    title_fr: '02 — Examen Médical & Sélection de l\'Hôpital',
    title_kr: '02 — Revir Medikal & Swazir Lopital',
    tagline: 'Specialist Identification · Secure Medical Review',
    tagline_fr: 'Identification des Spécialistes · Transmission Sécurisée',
    tagline_kr: 'Swazir Spesialis · Transmisyon Dosie an Sekirite',
    desc: 'Based on your medical condition, treatment requirements and preferences, we help identify appropriate hospitals and specialists within our international healthcare network and securely submit your medical records for specialist review.',
    desc_fr: 'En fonction de votre état de santé, de vos besoins thérapeutiques et de vos préférences, nous vous aidons à identifier les hôpitaux et spécialistes appropriés au sein de notre réseau international et transmettons votre dossier médical en toute sécurité.',
    desc_kr: 'Dapre ou eta lasante ek ou preferans, nou idantifie bann meyer lopital ek spesialis dan nou rezo internasional ek nou avoy ou dosie an sekirite pou lavi lekip medikal.',
    highlights: [
      { en: 'Custom selection tailored to clinical condition & preferences', fr: 'Sélection personnalisée selon la pathologie et vos préférences', kr: 'Swazir lopital adapte a ou kondision ek preferans' },
      { en: 'Direct access to 15 premier accredited hospital networks', fr: 'Accès direct aux 15 plus grands réseaux hospitaliers accrédités', kr: 'Akse direk ar 15 gran lopital akredite' },
      { en: 'Confidential and secure transmission of all medical records', fr: 'Transmission strictement confidentielle et sécurisée des données', kr: 'Partaz dosie dan konfidansialite ek sekirite total' },
    ],
    icon: Stethoscope,
  },
  {
    num: '03',
    badge: 'Step 03',
    badge_fr: 'Étape 03',
    badge_kr: 'Letap 03',
    title: '03 — Treatment Plan, Estimate & Medical Teleconsultation',
    title_fr: '03 — Plan de Traitement, Devis & Téléconsultation Médicale',
    title_kr: '03 — Plan Tretman, Estimasion & Telekonsiltasion Medikal',
    tagline: 'Specialist Medical Opinion · Video Teleconsultation',
    tagline_fr: 'Avis Spécialiste · Téléconsultation Vidéo Directe',
    tagline_kr: 'Lavi Dokter Spesialis · Telekonsiltasion Video Direk',
    desc: 'Once your case has been reviewed, you receive the available specialist medical opinion, proposed treatment plan and estimated hospital costs, helping you and your family make an informed decision. When appropriate, Med360 can also coordinate a video teleconsultation directly with the treating specialist abroad, giving you the opportunity to discuss your diagnosis, proposed treatment, expected duration of care and other medical questions before travelling.',
    desc_fr: 'Une fois votre dossier examiné, vous recevez l\'avis médical spécialiste, le plan de soins proposé et l\'estimation des coûts hospitaliers. Si nécessaire, Med360 organise une téléconsultation vidéo directe avec le spécialiste à l\'étranger pour poser vos questions avant de voyager.',
    desc_kr: 'Apre revir ou dosie, ou gagn lavi medikal spesialis, plan tretman ek estimasion pri pou fer enn bon swa. Med360 kapav osi aranz enn telekonsiltasion video direk ar dokter avan ou voyaze.',
    highlights: [
      { en: 'Specialist medical opinion and clear proposed treatment protocol', fr: 'Avis médical spécialisé et protocole thérapeutique clair', kr: 'Lavi dokter spesialis ek plan tretman bien detaye' },
      { en: 'Transparent, estimated hospital cost breakdowns', fr: 'Estimations transparentes des coûts hospitaliers', kr: 'Estimasion pri lopital kler san fre kasiet' },
      { en: 'Direct video teleconsultation with overseas treating specialists', fr: 'Téléconsultation vidéo directe avec le chirurgien à l\'étranger', kr: 'Telekonsiltasion video direk ar sef sirizien a letranze' },
    ],
    icon: Calculator,
  },
  {
    num: '04',
    badge: 'Step 04',
    badge_fr: 'Étape 04',
    badge_kr: 'Letap 04',
    title: '04 — We Coordinate Your Journey',
    title_fr: '04 — Nous Coordonnons Votre Voyage',
    title_kr: '04 — Nou Kordonn Ou Vwayaz',
    tagline: 'Travel & Visas · Ground & Air Ambulance Options',
    tagline_fr: 'Voyage & Visas · Ambulances Terrestres & Avions Médicalisés',
    tagline_kr: 'Vwayaz & Viza · Lanbilans & Avion Medikalize',
    desc: 'Once you decide to proceed, Med360 helps coordinate the practical arrangements surrounding your treatment, including hospital appointments and admission, medical visa assistance, flights, accommodation, airport transfers and local transportation. For patients requiring specialised medical transportation, we can also facilitate ground ambulance services, airport medical transfers and private air-ambulance/medical-jet arrangements, according to the patient\'s medical condition and subject to medical clearance and availability.',
    desc_fr: 'Dès que vous décidez de procéder, Med360 coordonne tous les détails pratiques : rendez-vous et admission, visa médical, vols, hébergement, transferts aéroport et transports locaux. Pour les cas exigeant un transport médicalisé, nous facilitons ambulances terrestres et évacuations par avion sanitaire.',
    desc_kr: 'Kan ou deside avanse, Med360 okip tou bann laranzman : randevou lopital, viza medikal, biye avion, lotel, transpor aeriopor. Pou bann pasian malad grav, nou kapav aranz lanbilans ek avion medikalize.',
    highlights: [
      { en: 'Hospital admission, appointment scheduling & medical visa support', fr: 'Prise de rendez-vous, admission et assistance visa médical', kr: 'Randevou lopital, ladmision ek lasistans viza medikal' },
      { en: 'Flight bookings, partner accommodations & local transportation', fr: 'Réservation des vols, hébergements vérifiés et transports locaux', kr: 'Biye avion, rezervasion lotel ek transpor lokal' },
      { en: 'Ground ambulance & private air-ambulance/medical jet facilities', fr: 'Ambulances terrestres et évacuations par avion médicalisé', kr: 'Servis lanbilans ek lavion saniter ICU pou ka irzan' },
    ],
    icon: Plane,
  },
  {
    num: '05',
    badge: 'Step 05',
    badge_fr: 'Étape 05',
    badge_kr: 'Letap 05',
    title: '05 — Treatment Abroad',
    title_fr: '05 — Prise en Charge & Soins à l\'Étranger',
    title_kr: '05 — Tretman a Letranze',
    tagline: 'Airport Arrival · Hospital Admission · Bedside Support',
    tagline_fr: 'Accueil Aéroport · Admission · Accompagnement au Chevet',
    tagline_kr: 'Lariwe Lareopor · Ladmision · Kordonater o Sive',
    desc: 'Upon arrival, our team and local partners help facilitate your journey from airport arrival and hospital admission through treatment and discharge. We remain available throughout your stay to support you and your accompanying family member and to facilitate communication with the hospital when required.',
    desc_fr: 'Dès votre arrivée, notre équipe et nos partenaires locaux facilitent votre parcours, de l\'aéroport à l\'admission hospitalière, pendant les soins et jusqu\'à votre sortie. Nous restons disponibles pour vous et votre proche accompagnateur, facilitant chaque échange avec l\'hôpital.',
    desc_kr: 'Depi ou aterir, nou lekip ek partner lokal akey ou, okip ladmision ziska lafin tretman ek sorti. Nou res pre ar ou ek ou fami pou fasilit kominikasion ar lopital.',
    highlights: [
      { en: 'Personal airport meet & greet and dedicated hospital transfers', fr: 'Accueil personnalisé à l\'aéroport et transferts dédiés', kr: 'Akoy personalize dan lareopor ek transpor ver lopital' },
      { en: 'Continuous bedside assistance for you and your companion', fr: 'Accompagnement continu au chevet pour vous et votre proche', kr: 'Lasistans o sive pou ou ek ou manb fami ki akonpagn ou' },
      { en: 'Seamless multilingual communication with the clinical team', fr: 'Facilitation constante des échanges avec l\'équipe médicale', kr: 'Kominikasion fasil ar bann dokter ek infirmier' },
    ],
    icon: Building2,
  },
  {
    num: '06',
    badge: 'Step 06',
    badge_fr: 'Étape 06',
    badge_kr: 'Letap 06',
    title: '06 — Return Home & Follow-Up',
    title_fr: '06 — Retour à Domicile & Suivi Médical',
    title_kr: '06 — Retour Lakaz & Swivi Medikal',
    tagline: 'Medical Reports · Teleconsultation Follow-Ups · Continuity of Care',
    tagline_fr: 'Comptes Rendus · Téléconsultations · Continuité des Soins',
    tagline_kr: 'Rapor Medikal · Telekonsiltasion · Kontinwite Swen',
    desc: 'Our support doesn\'t end when treatment is completed. We help coordinate medical reports, follow-up consultations, video teleconsultations and communication with your treating specialists abroad, supporting continuity of care after you return home.',
    desc_fr: 'Notre soutien se poursuit après la fin du traitement. Nous vous aidons à coordonner vos comptes rendus médicaux, consultations de contrôle, téléconsultations vidéo et échanges avec vos spécialistes à l\'étranger pour assurer la continuité des soins à votre retour.',
    desc_kr: 'Nou sipor pa arete apre tretman. Nou ed ou avek rapor medikal, vizit kontrol, telekonsiltasion video ek kominikasion ar ou dokter a letranze pou garanti bon swivi lakaz.',
    highlights: [
      { en: 'Compilation of full discharge summaries and medical records', fr: 'Centralisation de tous les comptes rendus de sortie et bilans', kr: 'Rasanble tou bann rapor medikal ek bilan de sorti' },
      { en: 'Post-discharge video teleconsultations with overseas specialists', fr: 'Téléconsultations vidéo de contrôle avec les spécialistes traitants', kr: 'Telekonsiltasion swivi avek ou bann spesialis a letranze' },
      { en: 'Long-term patient advocacy and continuity of healthcare', fr: 'Accompagnement dans la durée et continuité du parcours de soins', kr: 'Swivi lasante dan la diré pou ou trankilite d\'espri' },
    ],
    icon: ShieldCheck,
  },
];

const FAQS = [
  {
    q: 'How does Med360 support patients seeking care abroad?',
    q_fr: 'Comment Med360 accompagne-t-il les patients vers l\'étranger ?',
    q_kr: 'Kouma Med360 akonpagn bann pasian pou al swanye a letranze ?',
    a: 'Med360 coordinates every step — from initial medical enquiry and specialist consultation to treatment abroad and post-treatment follow-up. Selection is tailored to each patient\'s diagnosis, clinical needs, and international hospital accreditations.',
    a_fr: 'Med360 coordonne chaque étape : de la première demande médicale et consultation spécialisée jusqu\'aux soins à l\'étranger et au suivi post-traitement, selon le diagnostic et les accréditations hospitalières.',
    a_kr: 'Med360 kordonn sak letap : depi premie demann ek lavi spesialis ziska tretman a letranze ek swivi kan ou retourn Moris.',
  },
  {
    q: 'Can Med360 arrange video teleconsultations before travel?',
    q_fr: 'Med360 peut-il organiser une téléconsultation vidéo avant le départ ?',
    q_kr: 'Eski Med360 kapav aranz enn telekonsiltasion video avan vwayaze ?',
    a: 'Yes. When appropriate, Med360 coordinates a video teleconsultation directly with the treating specialist abroad, giving you the opportunity to discuss your diagnosis, proposed treatment, expected duration of care, and medical questions before travelling.',
    a_fr: 'Oui. Med360 organise des téléconsultations vidéo directement avec les spécialistes traitants à l\'étranger afin d\'échanger sur le diagnostic, le traitement et la durée de séjour avant votre voyage.',
    a_kr: 'Wi. Med360 kapav aranz enn telekonsiltasion video direk ar sef sirizien a letranze pou koz lor ou diagnostik ek tretman avan ou vwayaze.',
  },
  {
    q: 'Can a family member accompany me during treatment?',
    q_fr: 'Un membre de ma famille peut-il m\'accompagner ?',
    q_kr: 'Eski enn manb mo fami kapav vwayaze ar mwa ?',
    a: 'Yes, absolutely. We assist with medical attendant visas, flight reservations, twin-room accommodations, and on-ground bedside support for accompanying family members throughout the stay.',
    a_fr: 'Oui, absolument. Nous facilitons le séjour de votre accompagnant avec un visa accompagnateur médical, des vols groupés et un hébergement adapté proche de l\'hôpital.',
    a_kr: 'Wi, sirman. Nou aranz viza akonpanyater, biye avion, lozman pre ar lopital ek nou akonpagn ou pros pandan tou sezour.',
  },
  {
    q: 'What is the "No Dividends" social philosophy of Med360?',
    q_fr: 'Quelle est la philosophie sociale « Zéro Dividende » de Med360 ?',
    q_kr: 'Ki ete sa filozofi « Zero Dividann » Med360 la ?',
    a: 'Med360 is a social enterprise initiative of NGO Enn Rev Enn Sourir (est. 2016). Our purpose is not to create dividends for individual shareholders, but to create sustainable impact. Revenue generated contributes to Enn Rev Enn Sourir\'s mission to fund healthcare for vulnerable patients who cannot afford treatment.',
    a_fr: 'Med360 est une entreprise sociale créée par l\'ONG Enn Rev Enn Sourir. Notre vocation n\'est pas de distribuer des dividendes à des actionnaires, mais de créer un impact durable : les revenus générés soutiennent directement les soins de patients vulnérables.',
    a_kr: 'Med360 li enn linisiativ sosial l\'ONG Enn Rev Enn Sourir. Oken dividann pa distribie : bann reveni reinvesti pou ed bann pasian vilnerab gagn tretman vitale.',
  },
];

export function HowItWorksPage() {
  const navigate = useNavigate();
  const { isFr, isKr, l10n, l } = useL10n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tLang = (obj: any, key: string) => l(obj, key);


  const faqSchema = getFaqPageSchema(
    FAQS.map(faq => ({
      question: isFr ? faq.q_fr : isKr ? faq.q_kr : faq.q,
      answer: isFr ? faq.a_fr : isKr ? faq.a_kr : faq.a,
    }))
  );

  return (
    <div className="how-it-works-page">
      <SEO pageKey="howItWorks" schema={faqSchema} />

      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="hiw-hero">
        <div className="container hiw-hero__inner">
          <div className="hiw-hero__badge">
            <Sparkles size={15} />
            <span>{isFr ? "Une Coordination Médicale Bienveillante & Structurée" : isKr ? "Kordonasion Medikal avek Leker" : "One Point of Contact · One Coordinated Journey"}</span>
          </div>

          <h1 className="hiw-hero__title">
            {isFr ? "Votre Parcours de Soins, Simple & Coordonné" : isKr ? "Ou Vwayaz Lasante, Sinp & Kordone" : "Your Healthcare Journey, Made Simple"}
          </h1>

          <p className="hiw-hero__subtitle">
            {isFr
              ? "Se faire soigner à l'étranger peut sembler complexe. Med360 facilite votre parcours en coordonnant chaque étape — de votre première demande médicale et consultation spécialisée jusqu'à vos soins à l'étranger et votre retour à domicile."
              : isKr
              ? "Al fer swen a letranze kapav paret konplike. Med360 rann ou vwayaz pli fasil par kordonn sak letap — depi premie lavi dokter ziska tretman a letranze ek retour lakaz."
              : "Seeking medical treatment abroad can feel complicated. Med360 makes the journey easier by coordinating every step — from your first medical enquiry and specialist consultation to your treatment abroad and your return home."}
          </p>

          <div className="hiw-hero__actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/describe-need?from=How+It+Works+Top+Banner&serviceName=Treatment+Coordination+Consultation')}
              id="hiw-hero-cta"
            >
              <span>{isFr ? "RÉSERVER VOTRE CONSULTATION MÉDICALE" : isKr ? "REZERV OU KONSILTASION MEDIKAL" : "BOOK YOUR MEDICAL CONSULTATION"}</span>
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
              <span>{isFr ? "DISCUTER SUR WHATSAPP" : isKr ? "KOZ AR NOU LOR WHATSAPP" : "CHAT WITH US ON WHATSAPP"}</span>
            </a>
          </div>

          {/* Quick Trust Bar */}
          <div className="hiw-trust-bar">
            <div className="hiw-trust-item">
              <CheckCircle2 size={18} className="hiw-trust-icon" />
              <span>{isFr ? "Patient Navigator dédié" : isKr ? "Patient Navigator dedie" : "Dedicated Patient Navigator"}</span>
            </div>
            <div className="hiw-trust-item">
              <Building2 size={18} className="hiw-trust-icon" />
              <span>{isFr ? "15 Hôpitaux accrédités en Inde" : isKr ? "15 Lopital akredite dan L'inde" : "15 Premier Indian Hospitals"}</span>
            </div>
            <div className="hiw-trust-item">
              <UserCheck size={18} className="hiw-trust-icon" />
              <span>{isFr ? "Téléconsultation vidéo directe" : isKr ? "Telekonsiltasion video direk" : "Direct Video Teleconsultation"}</span>
            </div>
            <div className="hiw-trust-item">
              <HeartHandshake size={18} className="hiw-trust-icon" />
              <span>{isFr ? "+3 000 Patients accompagnés" : isKr ? "+3 000 Pasian asiste" : "+3,000 Patients Assisted"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 Phases of Care ─────────────────────────────────────────────────── */}
      <section className="hiw-phases-section">
        <div className="container">
          <div className="hiw-section-header">
            <span className="section-label">{isFr ? "Le Parcours Complet en 6 Étapes" : isKr ? "Bann 6 Letap Konple" : "6-Step Coordinated Journey"}</span>
            <h2 className="text-h2">
              {isFr ? "De Maurice à Votre Traitement — À Vos Côtés à Chaque Étape" : isKr ? "Depi Moris Ziska Ou Tretman — Nou ar Ou Sak Letap" : "From Mauritius to Your Treatment — We're With You Every Step of the Way"}
            </h2>
            <p className="text-lead">
              {isFr 
                ? "Un point de contact unique. Un parcours coordonné. L'accès à des soins de santé de classe mondiale." 
                : "One point of contact. One coordinated journey. Access to world-class healthcare."}
            </p>
          </div>

          <div className="hiw-phases-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {CARE_PHASES.map((phase) => {
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
              <span className="badge badge-accent">✦ {isFr ? "Notre Modèle Social" : isKr ? "Nou Model Sosyal" : "Social Enterprise Mission"}</span>
              <h2 className="hiw-ngo-title">
                {isFr 
                  ? "Zéro Dividende. Votre Santé Compte." 
                  : isKr 
                  ? "Zero Dividann. Ou Lasante Kont." 
                  : "No Dividends. Your Healthcare Matters."}
              </h2>
              <p className="hiw-ngo-text">
                {isFr
                  ? "Med360 est une initiative d'entreprise sociale d'Enn Rev Enn Sourir. Les patients qui ont les moyens de financer leurs soins bénéficient d'une coordination médicale professionnelle et personnalisée → Med360 génère des revenus durables → ces revenus contribuent à la mission sociale d'Enn Rev Enn Sourir pour soigner les patients vulnérables."
                  : isKr
                  ? "Med360 li enn linisiativ lakonpanyi sosyal l'ONG Enn Rev Enn Sourir. Pasian ki kapav peye gagn enn kordonasion medikal profesyonel → Med360 kre reveni dirab → sa reveni la al dan l'ONG pou ed bann pasian vilnerab."
                  : "Med360 follows a different philosophy: our purpose is not to create dividends for individual shareholders, but to create impact. Patients who can afford their healthcare receive professional medical coordination → Med360 generates sustainable revenue → that revenue contributes to the social mission of Enn Rev Enn Sourir and helps support vulnerable patients."}
              </p>
              <div className="hiw-ngo-actions">
                <button className="btn btn-primary" onClick={() => navigate('/about')}>
                  <span>{isFr ? "Découvrir Notre Histoire & Affiliations" : isKr ? "Dekouver Nou Zistwar & Bann Afiliasion" : "Read Our Story & Philosophy"}</span>
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
              {isFr ? "Réponses Claires à Vos Questions" : isKr ? "Repons Kler pou Ou" : "Clear Answers to Put Your Mind at Ease"}
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
          <p className="hiw-cta-quote" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffb400' }}>
            <em>{isFr ? '« Une conversation peut changer la trajectoire de vos soins. Commencez la vôtre dès aujourd\'hui. »' : isKr ? '« Enn konversasion kapav sanz ou vwayaz lasante. Koumans ou par zordi. »' : '“One conversation could change the direction of your healthcare journey. Start yours today.”'}</em>
          </p>
          <h2 className="hiw-cta-title">
            {isFr 
              ? "Votre Santé Mérite l'Action, Pas l'Incertitude." 
              : isKr 
              ? "Ou Lasante Merite Laksion, Pa Linzistis." 
              : "Your Health Deserves Action, Not Uncertainty."}
          </h2>
          <p className="hiw-cta-subtitle">
            {isFr
              ? "Prenez rendez-vous dès aujourd'hui. Laissez-nous vous aider à comprendre vos options et vous mettre en relation avec les soins médicaux appropriés."
              : isKr
              ? "Pran ou randevou zordi mem. Les nou ed ou konpran ou bann opsion ek konekte ou ar bann meyer swen medikal."
              : "Book your appointment today. Let us help you understand your options and connect you with the right medical care."}
          </p>
          <div className="hiw-cta-buttons">
            <button 
              className="btn btn-accent btn-lg"
              onClick={() => navigate('/describe-need?from=How+It+Works+Bottom+CTA&serviceName=Treatment+Coordination+Consultation')}
              id="hiw-bottom-cta"
            >
              <span>{isFr ? "RÉSERVER VOTRE CONSULTATION MÉDICALE" : isKr ? "REZERV OU KONSILTASION MEDIKAL" : "BOOK YOUR MEDICAL CONSULTATION"}</span>
              <ArrowRight size={18} />
            </button>
            <a
              href={buildMed360WhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
            >
              <MessageCircle size={18} />
              <span>{isFr ? "DISCUTER SUR WHATSAPP" : isKr ? "KOZ AR NOU LOR WHATSAPP" : "CHAT WITH US ON WHATSAPP"}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
export default HowItWorksPage;
