import { Newspaper, Video, ExternalLink } from 'lucide-react';
import { useL10n } from '../../hooks/useL10n';

interface PressItem {
  id: string;
  outlet: string;
  type: 'article' | 'video';
  title: string;
  title_fr: string;
  title_kr: string;
  summary: string;
  summary_fr: string;
  summary_kr: string;
  url: string;
  accent: string;
}

const PRESS_ITEMS: PressItem[] = [
  {
    id: 'lexpress-article',
    outlet: "L'Express.mu",
    type: 'article',
    title: 'Quand les patients du privé financent les soins des plus démunis',
    title_fr: 'Quand les patients du privé financent les soins des plus démunis',
    title_kr: 'Kan bann pasian prive finans swen bann pli pov',
    summary: "Feature report on Med360's social-enterprise model supporting NGO Enn Rêv Enn Sourir.",
    summary_fr: "Article de fond sur le modèle d'entreprise sociale de Med360 au profit de l'ONG Enn Rêv Enn Sourir.",
    summary_kr: "Lartik lor model antrepriz sosyal Med360 ki sipor l'ONG Enn Rêv Enn Sourir.",
    url: 'https://lexpress.mu/s/quand-les-patients-du-prive-financent-les-soins-des-plus-demunis-565112',
    accent: '#0b5a8a',
  },
  {
    id: 'lexpress-reel',
    outlet: "L'Express.mu",
    type: 'video',
    title: 'Med360 Launch & Patient Mission Spotlight',
    title_fr: 'Lancement de Med360 & Mission Patient',
    title_kr: 'Lansman Med360 & Mision Pasian',
    summary: "Video highlight from L'Express covering Med360's international medical coordination.",
    summary_fr: "Reportage vidéo de L'Express sur la coordination médicale internationale de Med360.",
    summary_kr: "Video L'Express lor kordonasion medikal internasional Med360.",
    url: 'https://www.facebook.com/reel/4716625248569125',
    accent: '#0d9488',
  },
  {
    id: 'defi-media',
    outlet: 'Défi Media',
    type: 'video',
    title: 'Défi Media Coverage — Ethical Healthcare Abroad',
    title_fr: 'Reportage Défi Media — Soins Éthiques à l\'Étranger',
    title_kr: 'Reportaz Défi Media — Swen Etik a Letranze',
    summary: 'Défi Media reel exploring how Med360 guides Mauritian families through overseas care.',
    summary_fr: 'Vidéo Défi Media présentant l\'accompagnement des familles mauriciennes vers les soins à l\'étranger.',
    summary_kr: 'Video Défi Media lor kouma Med360 gid bann fami morisien pou swen a letranze.',
    url: 'https://www.facebook.com/reel/1165821629478557',
    accent: '#dc2626',
  },
  {
    id: 'ion-news',
    outlet: 'ION News',
    type: 'video',
    title: 'ION News Report — Med360 Social Enterprise',
    title_fr: 'Reportage ION News — L\'Entreprise Sociale Med360',
    title_kr: 'Reportaz ION News — Antrepriz Sosyal Med360',
    summary: 'Full broadcast segment from ION News on Med360 and NGO Enn Rêv Enn Sourir.',
    summary_fr: 'Séquence complète ION News consacrée à Med360 et à l\'ONG Enn Rêv Enn Sourir.',
    summary_kr: 'Reportaz konple ION News lor Med360 ek l\'ONG Enn Rêv Enn Sourir.',
    url: 'https://www.facebook.com/ionnews/videos/1132869199514393/',
    accent: '#2563eb',
  },
  {
    id: 'top-fm',
    outlet: 'Top FM',
    type: 'video',
    title: 'Top FM Feature — Med360 Healthcare Initiative',
    title_fr: 'Sujet Top FM — L\'Initiative Santé Med360',
    title_kr: 'Sujet Top FM — Linisiativ Lasante Med360',
    summary: 'Top FM coverage highlighting patient-first medical navigation and social impact.',
    summary_fr: 'Couverture Top FM mettant en lumière l\'accompagnement patient et l\'impact social.',
    summary_kr: 'Reportaz Top FM lor akonpanyeman pasian ek impak sosyal Med360.',
    url: 'https://www.facebook.com/reel/4716625248569125',
    accent: '#d97706',
  },
];

export function MediaCoverageSection() {
  const { l10n, l } = useL10n();

  return (
    <section aria-labelledby="media-coverage-heading" style={{ marginBottom: '5rem' }}>
      <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 2.5rem' }}>
        <span className="section-label">
          {l10n('✦ Presse & Médias', '✦ Lapres & Media', '✦ In The Media')}
        </span>
        <h2 id="media-coverage-heading" className="text-h2" style={{ marginBottom: '0.65rem' }}>
          {l10n('Couverture Médiatique', 'Kouvertir Mediatik', 'Media Coverage')}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
          {l10n(
            'Découvrez ce que les principaux médias mauriciens rapportent sur Med360 et notre modèle d\'entreprise sociale.',
            'Dekouver seki bann gran media morisien pe raporte lor Med360 ek nou model antrepriz sosyal.',
            'Explore how Mauritius’s leading news outlets have covered Med360 and our patient-first social enterprise mission.'
          )}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.35rem',
        }}
      >
        {PRESS_ITEMS.map((item) => {
          const isVideo = item.type === 'video';
          const Icon = isVideo ? Video : Newspaper;
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                borderTop: `3.5px solid ${item.accent}`,
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.9rem',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      color: item.accent,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.outlet}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      background: `${item.accent}15`,
                      color: item.accent,
                    }}
                  >
                    <Icon size={12} />
                    <span>{isVideo ? l10n('Vidéo', 'Video', 'Video') : l10n('Article', 'Lartik', 'Article')}</span>
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.02rem',
                    fontWeight: 800,
                    lineHeight: 1.38,
                    margin: '0 0 0.6rem',
                    color: 'var(--color-text)',
                  }}
                >
                  {l(item, 'title')}
                </h3>

                <p
                  style={{
                    fontSize: '0.86rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}
                >
                  {l(item, 'summary')}
                </p>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '1.15rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}
              >
                <span>
                  {isVideo
                    ? l10n('Regarder la vidéo', 'Get video la', 'Watch Video')
                    : l10n("Lire l'article", 'Lir lartik la', 'Read Article')}
                </span>
                <ExternalLink size={13} />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
