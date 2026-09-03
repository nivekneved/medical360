import { ArrowRight, MessageCircle, Shield, Users, Globe2, Heart, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { useCaseStudies } from '../../hooks/useCaseStudies';

const HIGHLIGHTS = [
  { 
    icon: Shield, 
    label: 'Only Accredited Partners', label_fr: 'Partenaires Accrédités Uniquement', label_kr: 'Zis Partner Akredite',
    sub: 'JCI · NABH · ISO certified hospitals', sub_fr: 'Hôpitaux certifiés JCI · NABH · ISO', sub_kr: 'Lopital sertifie JCI · NABH · ISO'
  },
  { 
    icon: Users,  
    label: '1,200+ Patients Assisted', label_fr: 'Plus de 1 200 Patients Assistés', label_kr: 'Plis ki 1 200 Pasian Asiste',
    sub: 'From Mauritius, Reunion, Comoros and beyond', sub_fr: 'De l\'Île Maurice, de la Réunion, des Comores et d\'ailleurs', sub_kr: 'Depi Moris, Larenion, Komor ek lezot pei'
  },
  { 
    icon: Globe2, 
    label: '7+ Countries', label_fr: 'Plus de 7 Pays', label_kr: 'Plis ki 7 Pei',
    sub: 'India, Thailand, Singapore, Malaysia, UAE', sub_fr: 'Inde, Thaïlande, Singapour, Malaisie, Émirats Arabes Unis', sub_kr: 'L\'inde, Taylann, Singapour, Malaisie, Dubai'
  },
  { 
    icon: Heart,  
    label: 'Free for Patients', label_fr: 'Gratuit pour les Patients', label_kr: 'Gratis pou Pasian',
    sub: 'We are compensated by hospitals, not patients', sub_fr: 'Nous sommes rémunérés par les hôpitaux, pas par les patients', sub_kr: 'Lopital ki pey nou, pa bann pasian'
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
        title={l10n('À Propos de Med360 & Témoignages', 'Lor Nou & Zistwar Pasian', 'About Med360 & Patient Stories')}
        description={l10n('Med360 connecte les patients mauriciens aux hôpitaux du monde. Découvrez notre mission et nos témoignages vérifiés.', 'Med360 konekte bann pasian Morisien ar bann pli bon lopital dan lemond. Dekouver nou mision ek temwagnaz.', 'Med360 connects Mauritian patients to the best hospitals globally. Explore our mission and verified recovery stories.')}
        canonical="/about"
      />

      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/about_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Notre Histoire & Valeurs', 'Nou Zistwar & Valer', 'Our Story & Purpose'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('À Propos de Medical 360', 'A Propo Medical 360', 'About Medical 360'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Pionnier de la conciergerie médicale à l\'Île Maurice et dans l\'océan Indien, nous guidons chaque patient vers des soins de classe mondiale.',
              'Pionie dan konsierzri medikal dan Moris ek losean Indien, nou gid sak pasian ver bann swen de klas mondial.',
              'Pioneering medical concierge care across Mauritius and the Indian Ocean, guiding every patient to world-class treatment.'
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
                {tCms('missionLabel', l10n('Notre Mission', 'Nou Mision', 'Our Mission'))}
              </span>
              <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>
                {tCms('missionTitle', l10n('Rendre les Meilleurs Soins Mondiaux Accessibles', 'Rann Bann Pli Bon Swen Aksesib', 'Making World-Class Care Accessible'))}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {tCms('missionP1', l10n(
                  'Fondé à Port Louis, Medical 360 est né d\'un constat simple : les patients de l\'océan Indien méritent un accès direct, transparent et sans stress aux technologies médicales les plus avancées.',
                  'Bati dan Porlwi, Medical 360 inn ne depi enn konsta kler: bann pasian losean Indien merit enn akse direk, transparan ek san stres ar bann teknologi medikal pli avanse.',
                  'Founded in Port Louis, Medical 360 was born from a clear realization: patients in the Indian Ocean region deserve direct, transparent, stress-free access to the world\'s most advanced medical treatments.'
                ))}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {tCms('missionP2', l10n(
                  'Nous sélectionnons rigoureusement des hôpitaux accrédités JCI et NABH en Inde, en Thaïlande, à Singapour et en Malaisie. Nous coordonnons chaque étape : du second avis médical gratuit jusqu\'au suivi post-opératoire.',
                  'Nou swazir ar gran rigerr bann lopital akredite JCI ek NABH dan L\'inde, Taylann, Singapour ek Malaisie. Nou kordonn tou: depi deziem lavi medikal gratis ziska swivi apre loperasion.',
                  'We rigorously vet JCI and NABH accredited hospitals in India, Thailand, Singapore, and Malaysia. We coordinate everything from your free second opinion to post-operative follow-up.'
                ))}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {tCms('missionP3', l10n(
                  'Notre service est toujours 100% gratuit pour les patients. Nous sommes rémunérés directement par nos hôpitaux partenaires, jamais par les patients que nous aidons.',
                  'Nou servis li touzour 100% gratis pou bann pasian. Se bann lopital partner ki pey nou direk, zame bann pasian ki nou ed.',
                  'Our service is always 100% free for patients. We are compensated directly by our hospital partners, never by the patients we serve.'
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
                  'Read real testimonials from Mauritian and regional patients who trusted Medical 360 for their medical journeys.'
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
