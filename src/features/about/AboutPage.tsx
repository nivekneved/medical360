import { ArrowRight, MessageCircle, Shield, Users, Globe2, Heart, Star, Sparkles, Trophy, Award, Medal } from 'lucide-react';
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
    sub: 'Specialised care in private clinics & abroad', sub_fr: 'Soins spécialisés en clinique privée et à l\'étranger', sub_kr: 'Swen spesialize dan klinik prive ek a letranze'
  },
  { 
    icon: Globe2, 
    label: 'Accredited Hospitals & Clinics', label_fr: 'Hôpitaux & Cliniques Accrédités', label_kr: 'Lopital & Klinik Akredite',
    sub: 'Mauritius, India, Thailand & premier global centres', sub_fr: 'Maurice, Inde, Thaïlande et grands centres mondiaux', sub_kr: 'Moris, L\'inde, Taylann ek lezot gran pei'
  },
  { 
    icon: Shield,  
    label: 'Free Guidance & Medical Opinion', label_fr: 'Avis Médical & Orientation Gratuits', label_kr: 'Lavi Medikal & Gid Gratis',
    sub: 'Complete personalized concierge for every patient', sub_fr: 'Accompagnement personnalisé pour chaque patient', sub_kr: 'Sipor konzierz konple pou sak pasian'
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
        title={l10n('À Propos de Med360 · ONG Enn Rev Enn Sourir', 'Lor Med360 · ONG Enn Rev Enn Sourir', 'About Med360 · Owned by NGO Enn Rev Enn Sourir')}
        description={l10n('Med360 est une entreprise détenue par l\'ONG Enn Rev Enn Sourir. 10 ans d\'aide médicale spécialisée pour les démunis. 100 % des bénéfices reversés à l\'ONG.', 'Med360 apartenir a l\'ONG Enn Rev Enn Sourir. 10 banlane led medikal spesialize. 100% profi retourn dan l\'ONG.', 'Med360 is a company owned by NGO Enn Rev Enn Sourir. 10+ years helping needy patients access specialised care in private clinics and abroad. 100% profits return to the NGO.')}
        canonical="/about"
      />

      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/about_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('✦ Détenu par l\'ONG Enn Rev Enn Sourir · 10+ Ans d\'Aide Médicale', '✦ Apartenir a l\'ONG Enn Rev Enn Sourir · 10+ Banlane dan Swen', '✦ Owned by NGO Enn Rev Enn Sourir · 10+ Years of Care'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('À Propos de Med360', 'A Propo Med360', 'About Med360'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Entreprise sociale détenue par l\'ONG Enn Rev Enn Sourir, Med360 met 10 ans d\'expertise médicale au service de tous — 100 % de nos bénéfices sont reversés à l\'ONG pour continuer de soigner les plus démunis.',
              'Lakonpanyi sosyal apartenir a l\'ONG Enn Rev Enn Sourir, Med360 met 10 banlane lexperyans medikal o-servis tou dimounn — 100% nou bann profi retourn dan l\'ONG pou swany bann ki dan bezwin.',
              'A social enterprise owned by the NGO Enn Rev Enn Sourir, Med360 brings 10 years of medical coordination expertise to everyone — with 100% of profits returned to the NGO to continue funding care for the needy.'
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
                {tCms('missionLabel', l10n('Notre Histoire & Mission', 'Nou Zistwar & Mision', 'Our Story & Purpose'))}
              </span>
              <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>
                {tCms('missionTitle', l10n('10 Ans d\'Engagement Humanitaire, Désormais Étendu à Tous', '10 Banlane Led Imaniter, Aster Ouver pou Tou Dimounn', '10 Years of Compassionate Care, Now Extended to All'))}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {tCms('missionP1', l10n(
                  'Med360 est une entreprise détenue à 100 % par l\'ONG Enn Rev Enn Sourir. Depuis plus de 10 ans, notre ONG s\'est consacrée sans relâche à aider les personnes dans le besoin et les familles vulnérables à accéder à des traitements spécialisés vitaux dans des cliniques privées de référence ou dans de grands hôpitaux à l\'étranger.',
                  'Med360 li enn lakonpanyi ki apartenir a 100% ar l\'ONG Enn Rev Enn Sourir. Pandan plis ki 10 banlane, nou ONG finn lite pou ed bann dimounn dan bezwin ek bann fami vilnerab gagn akse a bann tretman spesialize dan bann klinik prive ouswa gran lopital a letranze.',
                  'Med360 is a company owned by the NGO Enn Rev Enn Sourir. For over 10 years, our NGO has been devoted to helping needy and vulnerable patients access critical, specialised medical treatments in private clinics or renowned hospitals abroad.'
                ))}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {tCms('missionP2', l10n(
                  'Après une décennie passée à tisser des liens étroits avec les meilleurs spécialistes et des hôpitaux accrédités JCI en Inde, en Thaïlande et à l\'international, nous avons décidé d\'ouvrir nos compétences et notre conciergerie médicale à toutes les personnes qui ont les moyens de financer leurs soins.',
                  'Apre enn deseni kot nou finn aranze bann rezo solid avek bann meyer sef sirizien ek lopital akredite JCI dan L\'inde, Taylann ek lezot pei, nou finn deside ouver nou konsierzri medikal pou bann ki kapav pey zot prop swen.',
                  'After a decade of building relationships with top surgeons and JCI-accredited hospitals in India, Thailand, and globally, we decided to extend our medical concierge service to individuals and families who can afford private specialised care.'
                ))}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {tCms('missionP3', l10n(
                  'Le cœur de notre modèle est vertueux : 100 % des bénéfices réalisés par Med360 sont réinjectés directement dans l\'ONG Enn Rev Enn Sourir. Ainsi, chaque patient qui fait appel à nos services pour ses soins privés contribue directement à sauver des vies et à soigner les plus démunis.',
                  'Nou model li kler ek transparan: 100% bann profi ki Med360 fer retourn direk dan l\'ONG Enn Rev Enn Sourir. Sak pasian ki swazir Med360 pou so bann swen prive pe ed finansie tretman ek loperasion pou enn lot dimounn ki pena mwayen.',
                  'Our model is driven by pure social impact: 100% of profits generated by Med360 go straight back into the NGO Enn Rev Enn Sourir. Every patient who chooses Med360 for private medical care directly finances life-saving surgeries and treatments for those who cannot afford them.'
                ))}
              </p>
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
                      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8125rem' }}>{l(item, 'sub')}</div>
                    </div>
                  </div>
                );
              })}
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
                'Depuis 10 ans, l\'ONG Enn Rev Enn Sourir œuvre activement à l\'Île Maurice pour offrir aux enfants et aux familles les plus vulnérables l\'accès à des chirurgies spécialisées, à des soins contre le cancer infantile et à des traitements en clinique privée ou à l\'étranger. Med360 a été créée comme son entreprise sociale dédiée afin d\'étendre cette expertise médicale à ceux qui peuvent financer leurs soins — 100 % des bénéfices étant intégralement reversés à l\'ONG pour continuer à sauver des vies.',
                'Pandan 10 banlane, l\'ONG Enn Rev Enn Sourir pe lite dan Moris pou donn bann zanfan ek fami vilnerab akse a bann loperasion spesialize, tretman kont kanser ek swen a letranze. Med360 inn ne kouma so lakonpanyi sosyal pou elarzi sa lexperyans-la pou bann ki kapav peye — 100% profi retourn net dan l\'ONG pou kontinie sov lavi.',
                'For 10 years, the NGO Enn Rev Enn Sourir has been dedicated to giving vulnerable children and needy families in Mauritius access to specialized surgeries, pediatric oncology care, and life-saving overseas medical treatments. Med360 was created as its social enterprise to extend this decade of medical coordination to paying patients — with 100% of profits channeled directly back into the NGO to continue funding critical care for those in need.'
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
                {l10n('Récompensé pour l\'Excellence Médicale', 'Rekonpanse pou Nou Servis Medikal', 'Honored for Facilitation Excellence')}
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.975rem', lineHeight: 1.6 }}>
                {l10n(
                  'Nos standards rigoureux de qualité, de gratuité pour le patient et de sécurité hospitalière sont régulièrement primés à l\'international.',
                  'Nou gran langazman pou donn servis de kalite, gratis ek an sekirite finn gagn bann gran pri internasional.',
                  'Our patient-first standards, zero-cost policy, and rigorous hospital vetting are internationally recognized across the healthcare travel industry.'
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
                {l10n('Témoignages Vérifiés', 'Temwagnaz Verifie', 'Verified Patient Stories')}
              </span>
              <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>
                {l10n('Histoires de Rétablissement & Économies', 'Zistwar Gerizon & Lekonomi', 'Real Recoveries & Documented Savings')}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {l10n(
                  'Découvrez les témoignages réels de patients mauriciens et régionaux ayant bénéficié de notre accompagnement médical.',
                  'Dekouver bann vre temwagnaz bann pasian Morisien ki finn swazir nou pou zot tretman.',
                  'Read real testimonials from Mauritian and regional patients who trusted Med360 for their medical journeys.'
                )}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.75rem',
            }}>
              {caseStudies.map((cs) => (
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
