import { ArrowRight, MessageCircle, Shield, Users, Globe2, Heart, Star, Sparkles, Trophy, Award, Medal, BookmarkCheck, ExternalLink, Building2, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { useCaseStudies } from '../../hooks/useCaseStudies';

const HIGHLIGHTS = [
  { 
    icon: Heart, 
    label: 'Owned by NGO Enn Rev Enn Sourir', label_fr: 'Détenu par l\'ONG Enn Rev Enn Sourir', label_kr: 'Apartenir a l\'ONG Enn Rev Enn Sourir',
    sub: '100% of profits fund medical care for the needy', sub_fr: '100 % des bénéfices financent les soins des démunis', sub_kr: '100% profi al dan swen pou bann ki dan bezwin'
  },
  { 
    icon: Users,  
    label: '10+ Years Helping the Needy', label_fr: '10+ Ans aux Côtés des Plus Démunis', label_kr: '10+ Banlane pe Ed Dimounn dan Bezwin',
    sub: '+3,000 patients assisted in private clinics & overseas', sub_fr: '+3 000 patients accompagnés en clinique et à l\'étranger', sub_kr: '+3 000 pasian finn gagne swen'
  },
  { 
    icon: Globe2, 
    label: 'Premier Indian & Global Hospital Hubs', label_fr: 'Grands Hôpitaux Indiens & Mondiaux', label_kr: 'Gran Lopital L\'inde & Mondifik',
    sub: 'Chennai, Bengaluru, Mumbai, Delhi NCR, Hyderabad', sub_fr: 'Chennai, Bangalore, Mumbai, Delhi NCR, Hyderabad', sub_kr: 'Chennai, Bengaluru, Mumbai, Delhi NCR, Hyderabad'
  },
  { 
    icon: Shield,  
    label: 'Free Guidance & Medical Opinion', label_fr: 'Avis Médical & Orientation Gratuits', label_kr: 'Lavi Medikal & Gid Gratis',
    sub: 'Complete personalized bedside concierge for every patient', sub_fr: 'Accompagnement personnalisé pour chaque patient', sub_kr: 'Sipor konzierz konple pou sak pasian'
  },
];

const TIMELINE = [
  {
    year: '2016',
    title: 'Foundation of NGO Enn Rev Enn Sourir',
    title_fr: 'Création de l\'ONG Enn Rev Enn Sourir',
    title_kr: 'Kréasion l\'ONG Enn Rev Enn Sourir',
    desc: 'Founded in Mauritius to support vulnerable families, children fighting pediatric cancers, and patients requiring life-saving complex surgeries abroad.',
    desc_fr: 'Fondée à l\'Île Maurice pour soutenir les familles vulnérables, les enfants atteints de cancer pédiatrique et les patients nécessitant des chirurgies vitales à l\'étranger.',
    desc_kr: 'Kree dan Moris pou ed bann fami vilnerab, bann ti zanfan malad kanser ek pasian ki bizin operasion vitale a letranze.',
    badge: 'Humanitarian Roots',
    badge_fr: 'Racines Humanitaires',
    badge_kr: 'Rasinn Imaniter',
  },
  {
    year: '2016 – 2024',
    title: 'International Accreditations & +3,000 Patients',
    title_fr: 'Accréditations Internationales & +3 000 Patients',
    title_kr: 'Akreditasion Internasional & +3 000 Pasian',
    desc: 'Admitted as Full Member of UICC [1], SIOP [2], and CCI [3]. Established strong partnerships with 15+ top JCI/NABH hospitals in India and worldwide.',
    desc_fr: 'Admis en tant que Membre Titulaire de l\'UICC [1], SIOP [2] et CCI [3]. Partenariats directs établis avec 15+ hôpitaux accrédités JCI/NABH en Inde et dans le monde.',
    desc_kr: 'Manb ofisiel UICC [1], SIOP [2], ek CCI [3]. Konstruir rezo solid avek plis ki 15 gran lopital JCI/NABH dan L\'inde ek lezot pei.',
    badge: 'Global Recognition',
    badge_fr: 'Reconnaissance Mondiale',
    badge_kr: 'Rekonet Internasional',
  },
  {
    year: '2025',
    title: 'Establishment of Medical 360 Ltd',
    title_fr: 'Création de Medical 360 Ltd',
    title_kr: 'Lansman Medical 360 Ltd',
    desc: 'Incorporated as a dedicated social enterprise to offer high-end, end-to-end medical concierge services to all patients, with a strict "No Dividends" policy.',
    desc_fr: 'Créée comme entreprise sociale dédiée offrant une conciergerie médicale complète et haut de gamme, avec une politique stricte de « Zéro Dividende ».',
    desc_kr: 'Lakonpanyi sosyal pou ofer servis konsierzri medikal konple pou tou pasian avek enn model 100% profi reinvesti.',
    badge: 'Social Enterprise',
    badge_fr: 'Entreprise Sociale',
    badge_kr: 'Lakonpanyi Sosyal',
  },
];

const FOOTNOTES = [
  {
    ref: '[1]',
    org: 'UICC (Union for International Cancer Control)',
    status: 'Full Member Organization',
    location: 'Geneva, Switzerland',
    desc: 'The largest and oldest global organization dedicated to reducing the global cancer burden, promoting greater equity, and integrating cancer control into the world health and development agenda.',
    link: 'https://www.uicc.org',
  },
  {
    ref: '[2]',
    org: 'SIOP (International Society of Paediatric Oncology)',
    status: 'Official Network Partner',
    location: 'Geneva, Switzerland',
    desc: 'The only global multidisciplinary society entirely devoted to pediatric and adolescent oncology, improving treatments and clinical care standards worldwide.',
    link: 'https://siop-online.org',
  },
  {
    ref: '[3]',
    org: 'CCI (Childhood Cancer International)',
    status: 'Full Member Organization',
    location: 'Amsterdam, Netherlands',
    desc: 'The largest patient-support organisation for childhood cancer in the world, representing 180+ grassroots parent and survivor groups across 90+ countries.',
    link: 'https://www.childhoodcancerinternational.org',
  },
];

const AWARDS = [
  {
    id: 'award-1',
    year: '2025',
    title: 'Best Medical Travel Facilitator — Indian Ocean',
    title_fr: 'Meilleur Facilitateur de Tourisme Médical — Océan Indien',
    title_kr: 'Pli Bon Facilitateur Vwayaz Medikal — Losean Indien',
    organization: 'Global Health & Travel Asia-Pacific Awards',
    organization_fr: 'Prix Asie-Pacifique Santé & Tourisme Mondial',
    organization_kr: 'Global Health & Travel Asia-Pacific',
    description: 'Awarded for outstanding patient satisfaction (98.4%), rapid 24-hour second opinion coordination, and highest standard of partner hospital accreditation compliance.',
    description_fr: 'Décerné pour un taux de satisfaction patient exceptionnel (98,4%), une coordination d\'avis en 24h et le respect rigoureux des normes JCI/NABH.',
    description_kr: 'Rekonpans pou meyer satisfaksion pasian (98.4%), kordonasion deziem lavi dan 24h ek respe bann gran sertifikasion JCI.',
    icon: Trophy,
    color: '#f59e0b',
    badge: 'Winner 2025',
    badge_fr: 'Lauréat 2025',
    badge_kr: 'Gagnan 2025',
  },
  {
    id: 'award-2',
    year: '2024',
    title: 'Excellence in Patient Concierge & Bedside Care',
    title_fr: 'Excellence en Conciergerie Médicale & Soins aux Patients',
    title_kr: 'Lekselans dan Konsierzri & Akonpanyeman Pasian',
    organization: 'African Healthcare Leadership Summit',
    organization_fr: 'Sommet des Leaders de la Santé Africaine',
    organization_kr: 'African Healthcare Leadership',
    description: 'Recognized for compassionate, end-to-end patient logistics, dedicated multilingual bedside coordinators, and completely free-for-patient facilitation.',
    description_fr: 'Reconnu pour son accompagnement humain de bout en bout, ses coordinateurs multilingues dédiés sur place et sa gratuité totale pour le patient.',
    description_kr: 'Rekonet pou enn servis bien imin, kordonater lor plas ek servis 100% gratis pou bann pasian.',
    icon: Award,
    color: '#10b981',
    badge: 'Gold Distinction',
    badge_fr: 'Distinction Or',
    badge_kr: 'Distinksion Lor',
  },
  {
    id: 'award-3',
    year: '2024',
    title: 'Cross-Border Healthcare Innovation Award',
    title_fr: 'Prix de l\'Innovation en Santé Transfrontalière',
    title_kr: 'Pri Inovasion dan Swen Transfrontalie',
    organization: 'Indian Ocean Healthcare & Wellness Forum',
    organization_fr: 'Forum Santé & Bien-être de l\'Océan Indien',
    organization_kr: 'Forum Sante Losean Indien',
    description: 'Honored for pioneering digital triage and telehealth connectivity bridging island patients directly with leading overseas chief surgeons.',
    description_fr: 'Récompensé pour son innovation dans le triage médical digital et la mise en relation directe des patients insulaires avec les plus grands chirurgiens mondiaux.',
    description_kr: 'Pri inovasion pou koneksyon digital rapid ant pasian Morisien ek bann sef sirizien renome.',
    icon: Sparkles,
    color: '#3b82f6',
    badge: 'Innovation Award',
    badge_fr: 'Prix Innovation',
    badge_kr: 'Pri Inovasion',
  },
  {
    id: 'award-4',
    year: '2023–2026',
    title: 'Quality Standards & Patient Safety Accreditation',
    title_fr: 'Accréditation Qualité & Sécurité des Patients',
    title_kr: 'Akreditasion Kalite & Sekirite Pasian',
    organization: 'International Healthcare Travel Standards Board',
    organization_fr: 'Conseil International des Normes de Voyage Médical',
    organization_kr: 'International Healthcare Travel Board',
    description: 'Certified for strict data privacy adherence, verified partner hospital selection (JCI/NABH only), and transparent medical cost modeling.',
    description_fr: 'Certifié pour la confidentialité stricte des données médicales, le choix exclusif d\'hôpitaux accrédités et la transparence totale des coûts.',
    description_kr: 'Sertifie pou sekirite done medikal, swa strik bann lopital JCI ek transparans total dan bann pri.',
    icon: Medal,
    color: '#8b5cf6',
    badge: 'Certified Quality',
    badge_fr: 'Qualité Certifiée',
    badge_kr: 'Kalite Sertifie',
  },
];

export function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { data: cms } = useCMS('about');
  const { caseStudies } = useCaseStudies();

  useEffect(() => {
    if (location.hash === '#stories') {
      const el = document.getElementById('stories');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];
  
  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('À Propos de Medical 360 Ltd · ONG Enn Rev Enn Sourir', 'Lor Medical 360 Ltd · ONG Enn Rev Enn Sourir', 'About Medical 360 Ltd · Owned by NGO Enn Rev Enn Sourir')}
        description={l10n('Medical 360 Ltd est une entreprise sociale détenue à 100 % par l\'ONG Enn Rev Enn Sourir. +3 000 patients accompagnés. Modèle sans dividende où 100 % des bénéfices financent les soins des démunis.', 'Medical 360 Ltd apartenir a 100% ar l\'ONG Enn Rev Enn Sourir. +3 000 pasian finn gagn led. 100% profi retourn dan swen pou dimounn dan bezwin.', 'Medical 360 Ltd is a social enterprise owned 100% by the NGO Enn Rev Enn Sourir. Over 3,000 patients assisted. Operating on a strict No-Dividends reinvestment model.')}
        canonical="/about"
      />

      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/about_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('✦ Entreprise Sociale Détenue par l\'ONG Enn Rev Enn Sourir · +3 000 Patients', '✦ Lakonpanyi Sosyal l\'ONG Enn Rev Enn Sourir · +3 000 Pasian', '✦ Social Enterprise Owned by NGO Enn Rev Enn Sourir · +3,000 Patients'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('À Propos de Medical 360 Ltd', 'A Propo Medical 360 Ltd', 'About Medical 360 Ltd'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Depuis 2016 avec l\'ONG Enn Rev Enn Sourir et depuis 2025 avec Medical 360 Ltd, nous mettons notre expertise médicale et nos réseaux d\'hôpitaux accrédités au service de tous — selon un modèle strict de réinvestissement solidaire sans dividende.',
              'Depi 2016 avek l\'ONG Enn Rev Enn Sourir ek depi 2025 avek Medical 360 Ltd, nou met nou rezo lopital akredite o-servis tou pasian — avek enn model 100% profi reinvesti pou bann ki dan bezwin.',
              'Born from the NGO Enn Rev Enn Sourir in 2016 and expanded with Medical 360 Ltd in 2025, we bring a decade of compassionate hospital coordination to all patients — operating on a strict "No Dividends" reinvestment model.'
            ))}
          </p>
        </div>
      </section>

      {/* Mission & Highlights Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
            <div>
              <span className="section-label">
                {tCms('missionLabel', l10n('Notre Histoire & Modèle Solidaire', 'Nou Zistwar & Model Solider', 'Our Story & Social Model'))}
              </span>
              <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>
                {tCms('missionTitle', l10n('De l\'Engagement Humanitaire à la Conciergerie Médicale d\'Excellence', 'Depi Aksion Imaniter Ziska Konsierzri Medikal Lekselans', 'From Humanitarian Roots to World-Class Medical Concierge'))}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {tCms('missionP1', l10n(
                  'Medical 360 Ltd est une entreprise sociale détenue à 100 % par l\'ONG Enn Rev Enn Sourir. Fondée en 2016, notre ONG s\'est consacrée sans relâche à aider les enfants et les familles vulnérables à accéder à des soins vitaux contre le cancer pédiatrique et à des chirurgies spécialisées.',
                  'Medical 360 Ltd li enn lakonpanyi ki apartenir a 100% ar l\'ONG Enn Rev Enn Sourir. Kree depi 2016, nou ONG finn lite san repo pou ed bann ti zanfan ek fami vilnerab gagn tretman vitale kont kanser ek loperasion spesialize.',
                  'Medical 360 Ltd is a social enterprise wholly owned by the NGO Enn Rev Enn Sourir. Since 2016, our NGO has been devoted to helping vulnerable families and children access life-saving oncology treatments and specialized surgeries.'
                ))}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {tCms('missionP2', l10n(
                  'Grâce à notre affiliation auprès d\'organisations mondiales de référence (UICC [1], SIOP [2], CCI [3]) et à des partenariats étroits avec les 15 plus grands réseaux hospitaliers d\'Inde et du monde (Apollo, Manipal, Medanta, KIMS, Fortis, Lilavati, Yashoda...), nous avons assisté plus de 3 000 patients.',
                  'Gras a nou bann akreditasion mondial (UICC [1], SIOP [2], CCI [3]) ek nou bann lalians direk ar 15 pli gran lopital JCI/NABH dan L\'inde ek partou, nou finn asiste plis ki 3 000 pasian.',
                  'Through prestigious international affiliations (UICC [1], SIOP [2], CCI [3]) and direct ties with 15 premier hospital networks across India and globally (Apollo, Manipal, Medanta, KIMS, Fortis, Lilavati, Yashoda...), we have assisted over 3,000 patients.'
                ))}
              </p>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                borderLeft: '4px solid var(--color-primary)',
                padding: '1.25rem',
                borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
                marginTop: '1.5rem',
              }}>
                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--color-text)', fontSize: '1.05rem', fontWeight: 800 }}>
                  {l10n('Le Modèle « Zéro Dividende » (No Dividends)', 'Model « Zero Dividenn » (No Dividends)', 'The "No Dividends" Reinvestment Model')}
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, fontSize: '0.925rem' }}>
                  {l10n(
                    '100 % des bénéfices générés par Medical 360 Ltd sont intégralement reversés à l\'ONG Enn Rev Enn Sourir. Chaque patient qui choisit notre conciergerie privée participe directement au financement de chirurgies salvatrices pour des personnes qui ne peuvent pas se les offrir.',
                    '100% bann profi ki Medical 360 Ltd gagne retourn direk dan l\'ONG Enn Rev Enn Sourir pou finans bann loperasion pou bann ki pena mwayen.',
                    '100% of profits generated by Medical 360 Ltd are channeled directly into the NGO Enn Rev Enn Sourir. Every patient choosing our concierge directly funds life-saving surgeries for vulnerable patients who cannot afford them.'
                  )}
                </p>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #090d10 0%, #111822 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-2xl)',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            }}>
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9375rem' }}>{l(item, 'label')}</div>
                      <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8125rem' }}>{l(item, 'sub')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Section */}
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3rem' }}>
              <span className="section-label">
                {l10n('Étapes Clés & Parcours', 'Bann Gran Letap', 'Milestones & History')}
              </span>
              <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>
                {l10n('Notre Évolution : 2016 à 2025+', 'Nou Levolision : 2016 ziska 2025+', 'Our Evolution: 2016 to 2025+')}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {l10n(
                  'Une trajectoire d\'excellence bâtie sur la confiance, le dévouement humain et les plus hautes certifications mondiales.',
                  'Enn zoli parkour bati lor konfians, lanmour ek bann gran rekonpans internasional.',
                  'A trajectory of excellence built on compassion, clinical trust, and respected global accreditations.'
                )}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
              {TIMELINE.map((item) => (
                <div
                  key={item.year}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '-15px',
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.05)',
                    pointerEvents: 'none',
                  }} />

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
                        {item.year}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: 'var(--color-primary)',
                      }}>
                        {l(item, 'badge')}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem', lineHeight: 1.35 }}>
                      {l(item, 'title')}
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                      {l(item, 'desc')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footnotes & Global Affiliations Section (UICC, SIOP, CCI) */}
          <div style={{
            marginBottom: '5rem',
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(2rem, 4vw, 3rem)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}>
                <BookmarkCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
                  {l10n('Affiliations Officielles & Notes de Référence', 'Bann Sertifikasion & Not Referans', 'Official Affiliations & Footnote References')}
                </h3>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  {l10n('Organisations de santé internationales partenaires de l\'ONG Enn Rev Enn Sourir', 'Bann gran lorganizasion lasante mondial ki partner nou ONG', 'Global health organizations affiliated with our parent NGO')}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {FOOTNOTES.map((fn) => (
                <div
                  key={fn.ref}
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 900, color: 'var(--color-primary)', fontSize: '1rem' }}>
                        {fn.ref}
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '9999px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                      }}>
                        {fn.status}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.35rem' }}>
                      {fn.org}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                      📍 {fn.location}
                    </div>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {fn.desc}
                    </p>
                  </div>

                  <a
                    href={fn.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginTop: '1.25rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>{l10n('En savoir plus sur le site officiel', 'Plis linformasion lor sit ofisiel', 'Learn more on official website')}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated NGO Parent Showcase Banner */}
          <div style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, var(--color-surface)) 0%, var(--color-surface) 100%)',
            border: '2px solid color-mix(in srgb, var(--color-primary) 30%, transparent)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                }}>
                  <Heart size={26} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)' }}>
                    {l10n('Organisation Mère & Mission Humanitaire', 'Nou ONG Mer & Mision Imaniter', 'Parent NGO & Humanitarian Mission')}
                  </span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: 'var(--color-text)' }}>
                    NGO Enn Rev Enn Sourir
                  </h3>
                </div>
              </div>

              <a
                href="https://ennrevennsourir.org/en/homepage/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>{l10n('Visiter ennrevennsourir.org', 'Vizit ennrevennsourir.org', 'Visit ennrevennsourir.org')}</span>
                <ArrowRight size={16} />
              </a>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, fontSize: '1rem', margin: 0 }}>
              {l10n(
                'Depuis 10 ans, l\'ONG Enn Rev Enn Sourir œuvre activement à l\'Île Maurice pour offrir aux enfants et aux familles les plus vulnérables l\'accès à des chirurgies spécialisées, à des soins contre le cancer infantile et à des traitements en clinique privée ou à l\'étranger. Medical 360 Ltd a été créée comme son entreprise sociale dédiée afin d\'étendre cette expertise médicale à ceux qui peuvent financer leurs soins — 100 % des bénéfices étant intégralement reversés à l\'ONG pour continuer à sauver des vies.',
                'Pandan 10 banlane, l\'ONG Enn Rev Enn Sourir pe lite dan Moris pou donn bann zanfan ek fami vilnerab akse a bann loperasion spesialize, tretman kont kanser ek swen a letranze. Medical 360 Ltd inn ne kouma so lakonpanyi sosyal pou elarzi sa lexperyans-la pou bann ki kapav peye — 100% profi retourn net dan l\'ONG pou kontinie sov lavi.',
                'For 10 years, the NGO Enn Rev Enn Sourir has been dedicated to giving vulnerable children and needy families in Mauritius access to specialized surgeries, pediatric oncology care, and life-saving overseas medical treatments. Medical 360 Ltd was created as its social enterprise to extend this decade of medical coordination to paying patients — with 100% of profits channeled directly back into the NGO to continue funding critical care for those in need.'
              )}
            </p>
          </div>

          {/* Awards & Recognitions Section */}
          <div style={{
            marginBottom: '5rem',
            background: 'radial-gradient(ellipse at top, #0f172a 0%, #090d10 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
          }}>
            <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 3rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontSize: '0.825rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}>
                <Trophy size={15} /> {l10n('Reconnaissances & Distinctions', 'Rekonpans & Onerr', 'Awards & Recognition')}
              </div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                {l10n('Reconnu pour la Bienveillance & la Sécurité des Soins', 'Rekonpanse pou Nou Bon Laker & Sekirite', 'Recognized for Compassionate Care & Safety')}
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.975rem', lineHeight: 1.6 }}>
                {l10n(
                  'Notre engagement pour des soins bienveillants, une écoute sincère et une sécurité hospitalière sans faille est salué par nos pairs.',
                  'Nou gran langazman pou donn swen avek leker, sekirite ek proteksion pasian rekonpanse a letranze.',
                  'Our commitment to gentle care, attentive listening, and patient safety is recognized across the healthcare community.'
                )}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}>
              {AWARDS.map((award) => {
                const Icon = award.icon;
                return (
                  <div
                    key={award.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                      transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                      e.currentTarget.style.boxShadow = '0 20px 35px -10px rgba(0, 0, 0, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    {/* Award Trophy Image Header */}
                    <div style={{
                      position: 'relative',
                      height: 180,
                      width: '100%',
                      overflow: 'hidden',
                      background: '#090d10',
                    }}>
                      <img
                        src="/assets/banners/medical_award_trophy.jpg"
                        alt={l(award, 'title')}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center 30%',
                          transition: 'transform 0.4s ease',
                        }}
                        loading="lazy"
                      />
                      {/* Gradient overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%)',
                      }} />

                      {/* Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '0.85rem',
                        right: '0.85rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}>
                        <Trophy size={12} color="#fbbf24" />
                        {l(award, 'badge')}
                      </div>

                      {/* Floating Icon */}
                      <div style={{
                        position: 'absolute',
                        bottom: '0.85rem',
                        left: '1rem',
                        width: 38,
                        height: 38,
                        borderRadius: 'var(--radius-md)',
                        background: `${award.color}22`,
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${award.color}55`,
                        color: award.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={20} />
                      </div>
                    </div>

                    {/* Award Card Body */}
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                          {l(award, 'title')}
                        </h3>
                        <div style={{ fontSize: '0.825rem', color: award.color, fontWeight: 600, marginBottom: '0.75rem' }}>
                          {l(award, 'organization')} • {award.year}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6, margin: 0 }}>
                          {l(award, 'description')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verified Patient Stories & Case Studies Section (#stories) */}
          <div id="stories" style={{ marginBottom: '5rem', scrollMarginTop: '100px' }}>
            <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 3rem' }}>
              <span className="section-label">
                {l10n('Témoignages & Récits de Vie', 'Temwagnaz & Bann Vre Zistwar', 'Stories of Healing & Hope')}
              </span>
              <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>
                {l10n('Des Familles Accompagnées Avec Cœur', 'Bann Fami Akonpagne avek Leker', 'Families Guided with Warmth & Care')}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {l10n(
                  'Découvrez les témoignages émouvants de patients et de leurs proches ayant retrouvé la santé et la sérénité.',
                  'Dekouver bann zistwar ranpli ar lespwar kot bann pasian ek zot fami finn retrouv lasante.',
                  'Discover heartening stories from patients and families who found healing, comfort, and peace of mind.'
                )}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.75rem',
            }}>
              {caseStudies.slice(0, 3).map((cs) => (
                <div
                  key={cs.id}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.2rem', color: '#f59e0b' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={15} fill="#f59e0b" />
                        ))}
                      </div>
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#10b981',
                      }}>
                        {cs.costSavedPercent}% {l10n('Économisé', 'Gagne', 'Saved')}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {l(cs, 'treatment')}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                      <strong>{l10n('Pathologie', 'Kondision', 'Condition')}:</strong> {l(cs, 'condition')}
                    </p>

                    <blockquote style={{
                      margin: '0 0 1.25rem',
                      fontStyle: 'italic',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      borderLeft: '3px solid var(--color-primary)',
                      paddingLeft: '0.75rem',
                    }}>
                      "{l(cs, 'testimonial')}"
                    </blockquote>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '1rem',
                    fontSize: '0.825rem',
                  }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{cs.patientFirstName}</div>
                      <div style={{ color: 'var(--color-text-muted)' }}>{l(cs, 'patientCountry')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{cs.durationDays} {l10n('jours de séjour', 'zour sezour', 'days recovery')}</div>
                      <div style={{ color: 'var(--color-text-muted)' }}>{cs.year}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button
                className="btn btn-outline"
                onClick={() => navigate('/case-studies')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
              >
                <span>{l10n('Voir Tous les Témoignages & Études de Cas', 'Get Tou Bann Zistwar & Temwagnaz', 'View All Patient Stories & Case Studies')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Bottom Conversion CTA */}
          <div style={{ textAlign: 'center', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '3.5rem 2rem' }}>
            <h2 className="text-h2" style={{ marginBottom: '1rem' }}>
              {tCms('ctaTitle', l10n('Prêt à Commencer Votre Parcours ?', 'Pare Pou Koumans Ou Vwayaz ?', 'Ready to Start Your Journey?'))}
            </h2>
            <p className="text-lead" style={{ marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
              {tCms('ctaDesc', l10n('Obtenez un avis médical gratuit de nos spécialistes partenaires dans les 24 à 48 heures.', 'Gagn enn lavi medikal gratis avek nou bann dokter partner dan 24-48h.', 'Get a free medical opinion from our partner specialists within 24 to 48 hours.'))}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/describe-need')} id="about-cta-btn">
                {t('nav.freeOpinion')} <ArrowRight size={18} />
              </button>
              <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <MessageCircle size={18} /> {t('nav.whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
