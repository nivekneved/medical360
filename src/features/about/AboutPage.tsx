import { ArrowRight, MessageCircle, Shield, Users, Globe2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';

const HIGHLIGHTS = [
  { 
    icon: Shield, 
    label: 'Only Accredited Partners', label_fr: 'Partenaires Accrédités Uniquement', label_kr: 'Zis Partner Akredite',
    sub: 'JCI · NABH · ISO certified hospitals', sub_fr: 'Hôpitaux certifiés JCI · NABH · ISO', sub_kr: 'Lopital sertifie JCI · NABH · ISO'
  },
  { 
    icon: Users,  
    label: '12,000+ Patients Assisted', label_fr: 'Plus de 12 000 Patients Assistés', label_kr: 'Plis ki 12 000 Pasian Asiste',
    sub: 'From Mauritius, Reunion, Comoros and beyond', sub_fr: 'De l\'Île Maurice, de la Réunion, des Comores et d\'ailleurs', sub_kr: 'Depi Moris, Larenion, Komor ek lezot pei'
  },
  { 
    icon: Globe2, 
    label: '15+ Countries', label_fr: 'Plus de 15 Pays', label_kr: 'Plis ki 15 Pei',
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
  const { t, i18n } = useTranslation();
  const { data: cms } = useCMS('about');

  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];
  
  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title={l10n('À Propos de Med360', 'Lor Nou', 'About Med360')}
        description={l10n('Med360 connecte les patients mauriciens aux hôpitaux du monde.', 'Med360 konekte bann pasian Morisien ar bann pli bon lopital dan lemond.', 'Med360 connects Mauritian patients to the best hospitals globally.')}
        canonical="/about"
      />
      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/about_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('Notre Histoire', 'Nou Zistwar', 'Our Story'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('À Propos de Medical 360', 'A Propo Medical 360', 'About Medical 360'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Med360 Ltd a été fondée avec une mission claire : garantir à chaque patient de l\'Île Maurice et de l\'océan Indien l\'accès aux meilleurs soins de santé mondiaux.',
              'Med360 Ltd ti kree avek enn sel lobzektif: fer sir ki sak pasian dan Moris ek l\'osean Indien gagn akse ar bann meyer swen lasante klas mondial.',
              'Med360 Ltd was founded with a clear mission: to ensure every patient in Mauritius and the Indian Ocean region has access to the world\'s finest healthcare.'
            ))}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 980 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <span className="section-label">{tCms('missionLabel', l10n('Notre Mission', 'Nou Mision', 'Our Mission'))}</span>
              <h2 className="text-h2" style={{ margin: '0.75rem 0 1rem' }}>
                {tCms('missionTitle', l10n('Relier l\'Île Maurice aux Soins Mondiaux', 'Konekt Moris ar Swen Klas Mondial', 'Bridging Mauritius to World-Class Healthcare'))}
              </h2>
              <p className="text-lead">
                {tCms('missionP1', l10n(
                  'Medical 360 a été fondée avec une mission claire : veiller à ce que chaque patient de l\'Île Maurice et de l\'océan Indien ait accès aux meilleurs soins mondiaux — indépendamment de ce qui est disponible localement.',
                  'Medical 360 ti fonde avek enn mision bien kler: fer sir ki sak pasian dan Moris ek l\'osean Indien gagn akse ar bann meyer swen mondial — mem si pa gagn sa lokalman.',
                  'Medical 360 was founded with a clear mission: to ensure that every patient in Mauritius and the Indian Ocean region has access to the world\'s best healthcare — regardless of what is available locally.'
                ))}
              </p>
              <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {tCms('missionP2', l10n(
                  'Nous comprenons l\'anxiété liée à un voyage à l\'étranger pour des soins médicaux. C\'est pourquoi nous nous occupons de tout — de la recherche du bon spécialiste à votre chambre d\'hôtel, en passant par votre visa et votre vol retour. Notre travail est de vous permettre de vous concentrer sur une seule chose : votre guérison.',
                  'Nou konpran ki li bien stresan pou vwayaze pou al swagn maladi letranze. Se pou sa ki nou okip tou — depi trouv bon dokter la ziska rezerv lotel, viza, ek biye retour. Nou travay se permet ou konsantre zis lor ou gerizon.',
                  'We understand the anxiety of travelling abroad for medical treatment. That is why we handle everything — from finding the right specialist, to your hotel room, your visa, and your return flight. Our job is to let you focus on one thing: your recovery.'
                ))}
              </p>
              <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
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

          <div style={{ textAlign: 'center', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '3rem' }}>
            <h2 className="text-h2" style={{ marginBottom: '1rem' }}>
              {tCms('ctaTitle', l10n('Prêt à Commencer Votre Parcours ?', 'Pare Pou Koumans Ou Vwayaz ?', 'Ready to Start Your Journey?'))}
            </h2>
            <p className="text-lead" style={{ marginBottom: '2rem', maxWidth: 460, margin: '0 auto 2rem' }}>
              {tCms('ctaDesc', l10n('Obtenez un avis médical gratuit de nos spécialistes partenaires dans les 48 heures.', 'Gagn enn lavi medikal gratis avek nou bann dokter partner dan 48h.', 'Get a free medical opinion from our partner specialists within 48 hours.'))}
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
