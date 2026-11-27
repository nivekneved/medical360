import { useEffect } from 'react';
import {
  ArrowRight,
  MessageCircle,
  BookmarkCheck,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useL10n } from '../../hooks/useL10n';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { HIGHLIGHTS, TIMELINE, FOOTNOTES } from './aboutContent';
import { MediaCoverageSection } from './MediaCoverageSection';
import './About.css';

export function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, l10n, l } = useL10n();
  const { data: cms } = useCMS('about');

  useEffect(() => {
    if (location.hash === '#board-members') {
      navigate('/who-we-are', { replace: true });
    }
  }, [location.hash, navigate]);

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][lang] || cms.content[key]['en'] || fallback;
  };

  const kpis = [
    {
      value: '+3,000',
      label: l10n('Patients accompagnés', 'Pasian asiste', 'Patients Assisted'),
    },
    {
      value: '2016',
      label: l10n('Fondation ONG', 'Fondasion ONG', 'NGO Foundation'),
    },
    {
      value: '14',
      label: l10n('Hôpitaux partenaires', 'Lopital partener', 'Partner Hospitals'),
    },
    {
      value: '100%',
      label: l10n('Impact réinvesti', 'Impak reinvesti', 'Impact Reinvested'),
    },
  ];

  const impactCycle = [
    {
      num: '01',
      title: l10n('Patients Privés & Assurés', 'Pasian Prive & Asire', 'Self-Paying & Insured Patients'),
      desc: l10n(
        'Accédez à une coordination médicale internationale éthique, transparente et sans surcoût caché.',
        'Gagn enn kordonasion medikal internasional etik, kler ek san fre kasiet.',
        'Patients who can finance their care receive ethical, transparent international medical coordination.'
      ),
      highlight: false,
    },
    {
      num: '02',
      title: l10n('Revenus Durables', 'Reveni Dirab', 'Sustainable Revenue'),
      desc: l10n(
        'Med360 génère des revenus d\'entreprise sociale — zéro dividende versé à des actionnaires.',
        'Med360 kree reveni antrepriz sosyal — zero dividann pou bann aksioner.',
        'Med360 generates sustainable social-enterprise revenue with zero dividends to shareholders.'
      ),
      highlight: false,
    },
    {
      num: '03',
      title: l10n('Soutien aux Patients Vulnérables', 'Sipor Pasian Vilnerab', 'Funding Care for the Vulnerable'),
      desc: l10n(
        'Les bénéfices renforcent la mission d\'Enn Rev Enn Sourir pour financer les soins de ceux qui n\'en ont pas les moyens.',
        'Bann benefis ranfors mision Enn Rev Enn Sourir pou finans swen bann ki pena mwayen.',
        'Revenue strengthens Enn Rev Enn Sourir’s mission to fund life-saving care for vulnerable families.'
      ),
      highlight: true,
    },
  ];

  const ethicsPoints = [
    l10n(
      'Aucune commission cachée ni pression commerciale dans le choix de l\'hôpital',
      'Okenn komision kasiet ouswa presion komersial dan swa lopital',
      'Zero hidden markups or commercial pressure when choosing a hospital'
    ),
    l10n(
      'Compréhension claire du spécialiste, du protocole et des coûts estimés avant départ',
      'Konpreansion kler lor dokter, tretman ek estimasion pri avan vwayaze',
      'Clear understanding of the specialist, treatment plan, and expected costs upfront'
    ),
    l10n(
      'Éthique, choix éclairé et dignité du patient placés avant tout intérêt commercial',
      'Etik, swa kler ek dignite pasian plase avan tou lintere komersial',
      'Ethics, informed choice, and patient dignity placed ahead of commercial interests'
    ),
  ];

  return (
    <main className="about-page">
      <SEO pageKey="about" />

      {/* ── 1. Editorial Opening Spread (No Stock Banner) ─────────────────── */}
      <section className="about-editorial-hero">
        <div className="container">
          <div className="about-hero-grid">
            <div>
              <span className="about-eyebrow">
                <Sparkles size={13} />
                {tCms(
                  'heroLabel',
                  l10n(
                    'Entreprise Sociale d\'Enn Rev Enn Sourir',
                    'Antrepriz Sosyal l\'ONG Enn Rev Enn Sourir',
                    'Social Enterprise of Enn Rev Enn Sourir'
                  )
                )}
              </span>

              <h1 className="about-hero-title">
                {l10n('Né d\'une Décennie de Compassion.', 'Ne depi 10 Banlane Konpasion.', 'Born From a Decade of Compassion.')}{' '}
                <span>
                  {l10n('Centré sur le Patient.', 'Santre lor Pasian.', 'Built Around the Patient.')}
                </span>
              </h1>

              <p className="about-hero-lead">
                {l10n(
                  'Med360 est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir, née d\'années d\'accompagnement des patients et de leurs familles dans les moments les plus décisifs de leur vie.',
                  'Med360 li enn linisiativ sosyal l\'ONG Enn Rev Enn Sourir, ne depi plizir lane leksperyans pou sipor bann pasian ek fami dan moman pli difisil.',
                  'Med360 is a social enterprise initiative of Enn Rev Enn Sourir, created from years of supporting patients and families through some of the most difficult moments of their lives.'
                )}
              </p>

              <p className="about-hero-sub">
                {l10n(
                  'Depuis 2016, Enn Rev Enn Sourir veille à ce que l\'accès aux soins spécialisés ne dépende jamais de la situation financière d\'une famille — avec une mission reconnue internationalement (UICC).',
                  'Depi 2016, Enn Rev Enn Sourir lite pou ki akse a swen spesialize pa depann lor mwayen finansie enn fami — enn mision rekonet internasionalman (UICC).',
                  'Since 2016, Enn Rev Enn Sourir has worked to ensure access to specialised healthcare is never determined by a family’s financial circumstances — backed by international recognition (UICC).'
                )}
              </p>

              <div className="about-kpi-strip">
                {kpis.map((kpi) => (
                  <div key={kpi.value} className="about-kpi-item">
                    <span className="about-kpi-value">{kpi.value}</span>
                    <span className="about-kpi-label">{kpi.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-visual-collage">
              <div className="about-photo-frame">
                <img
                  src="/assets/consultation-support.jpg"
                  alt={l10n('Accompagnement personnalisé Med360', 'Akonpagnman personalize Med360', 'Med360 dedicated patient navigation')}
                  fetchPriority="high"
                  decoding="async"
                />
                <div className="about-photo-caption">
                  <strong>
                    {l10n('Port-Louis, Maurice → Hôpitaux Accrédités Mondiaux', 'Porlwi, Moris → Lopital Akredite Mondial', 'Port-Louis, Mauritius → Accredited Hospitals Worldwide')}
                  </strong>
                  <span>
                    {l10n(
                      'Coordination médicale, logistique complète et suivi humain de bout en bout',
                      'Kordonasion medikal, lozistik konple ek swivi imin depi koumansman ziska lafin',
                      'Medical coordination, full travel logistics, and human follow-up end to end'
                    )}
                  </span>
                </div>
              </div>

              <div className="about-pillars-mini">
                {HIGHLIGHTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="about-pillar-chip">
                      <div className="about-pillar-chip__icon">
                        <Icon size={17} />
                      </div>
                      <div>
                        <div className="about-pillar-chip__title">{l(item, 'label')}</div>
                        <div className="about-pillar-chip__sub">{l(item, 'sub')}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          {/* ── 2. From Charity to Social Entrepreneurship (3-Step Flow) ─── */}
          <div className="about-impact-band">
            <div className="about-impact-header">
              <span className="about-eyebrow">
                {l10n('Modèle d\'Entreprise Sociale · 2025', 'Model Antrepriz Sosyal · 2025', 'Social Enterprise Model · 2025')}
              </span>
              <h2>
                {l10n('De la Bienfaisance à l\'Entrepreneuriat Social', 'Depi Aksion Imaniter Ziska Antrepriz Sosyal', 'From Charity to Social Entrepreneurship')}
              </h2>
              <p>
                {l10n(
                  'En 2025, nous avons transformé une décennie d\'expertise en navigation patient et de relations hospitalières internationales en un modèle autonome capable de servir tous les Mauriciens tout en finançant les soins des plus vulnérables.',
                  'An 2025, nou finn transform enn deseni leksperyans ek rezo lopital internasional an enn model dirab ki servi tou Morisien pandan ki li finans swen bann pli vilnerab.',
                  'In 2025, we turned a decade of patient-navigation expertise and international hospital relationships into a self-sustaining model serving wider Mauritius while funding care for families who cannot afford treatment.'
                )}
              </p>
            </div>

            <div className="about-cycle-grid">
              {impactCycle.map((step) => (
                <div
                  key={step.num}
                  className={`about-cycle-step ${step.highlight ? 'about-cycle-step--highlight' : ''}`}
                >
                  <span className="about-cycle-num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. Contrast Split: Why Med360 vs No Dividends ─────────────── */}
          <div className="about-contrast-grid">
            <div className="about-card-light">
              <div>
                <span className="about-eyebrow">
                  {l10n('Éthique & Transparence', 'Etik & Transparans', 'Ethics & Transparency')}
                </span>
                <h2>
                  {l10n('Pourquoi Med360 Était Nécessaire', 'Kifer Med360 Ti Bizin Kree', 'Why Med360 Was Needed')}
                </h2>
                <p>
                  {l10n(
                    'Pour un patient confronté à un diagnostic grave, le choix d\'un hôpital ou d\'un spécialiste ne doit jamais être dicté par des intérêts cachés, des coûts superflus ou une pression commerciale.',
                    'Pou enn pasian ki fek gagn enn diagnostik grav, swazir lopital pa bizin zame dikte par lintere kasiet ouswa presion komersial.',
                    'For a patient facing a serious diagnosis, choosing a hospital or specialist should never be driven by hidden interests, unnecessary costs, or commercial pressure.'
                  )}
                </p>
                <ul className="about-checklist">
                  {ethicsPoints.map((pt, i) => (
                    <li key={i}>
                      <CheckCircle2 size={17} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="about-card-dark">
              <div>
                <span className="about-eyebrow">
                  {l10n('Notre Philosophie', 'Nou Filozofi', 'Our Philosophy')}
                </span>
                <h2>
                  {l10n('Zéro Dividende. Votre Santé Compte.', 'Zero Dividann. Ou Lasante Kont.', 'No Dividends. Your Healthcare Matters.')}
                </h2>
                <p>
                  {l10n(
                    'Notre but n\'est pas de distribuer des dividendes à des actionnaires individuels. Notre but est de créer un impact humain durable.',
                    'Nou lobzektif pa kre dividann pou bann aksioner. Nou bi se kre enn vre impak imin dirab.',
                    'Our purpose is not to create dividends for individual shareholders. Our purpose is to create lasting human impact.'
                  )}
                </p>
                <p>
                  {l10n(
                    'En servant les patients privés et assurés avec excellence, nous renforçons directement la capacité d\'Enn Rev Enn Sourir à soutenir ceux pour qui le coût des soins reste un obstacle.',
                    'Par servi bann pasian prive ek asire avek ekselans, nou ranfors direkteman Enn Rev Enn Sourir pou ed bann ki pena mwayen.',
                    'By serving self-paying and insured patients with excellence, we directly strengthen Enn Rev Enn Sourir’s capacity to assist people for whom cost remains a barrier.'
                  )}
                </p>
              </div>
              <blockquote className="about-pullquote">
                {l10n(
                  '« Votre parcours de soins crée une opportunité de soutenir le parcours de soins d\'un autre patient. »',
                  '« Ou vwayaz lasante kre enn loportinite pou soutenir vwayaz lasante enn lot pasian. »',
                  '“Your healthcare journey creates an opportunity to support another healthcare journey.”'
                )}
              </blockquote>
            </div>
          </div>

          {/* ── 4. Media Coverage ──────────────────────────────────────── */}
          <MediaCoverageSection />

          {/* ── 5. Editorial Milestones Timeline ────────────────────────── */}
          <div className="about-timeline-wrap">
            <div className="about-section-head">
              <span className="about-eyebrow">
                {l10n('Étapes Clés & Parcours', 'Bann Gran Letap', 'Milestones & History')}
              </span>
              <h2>
                {l10n('Notre Évolution : 2016 à 2025+', 'Nou Levolision : 2016 ziska 2025+', 'Our Evolution: 2016 to 2025+')}
              </h2>
              <p>
                {l10n(
                  'Une trajectoire d\'excellence bâtie sur la confiance, le dévouement humain et les plus hautes reconnaissances mondiales.',
                  'Enn zoli parkour bati lor konfians, lanmour ek bann gran rekonpans internasional.',
                  'A trajectory of excellence built on compassion, clinical trust, and respected global recognition.'
                )}
              </p>
            </div>

            <div className="about-timeline-grid">
              {TIMELINE.map((item) => (
                <article key={item.year} className="about-timeline-card">
                  <div className="about-timeline-top">
                    <span className="about-timeline-year">{item.year}</span>
                    <span className="about-timeline-badge">{l(item, 'badge')}</span>
                  </div>
                  <h3>{l(item, 'title')}</h3>
                  <p>{l(item, 'desc')}</p>
                </article>
              ))}
            </div>
          </div>

          {/* ── 6. International Recognition (UICC, SIOP, CCI) ──────────── */}
          <div className="about-affiliations">
            <div className="about-affiliations__head">
              <div className="about-affiliations__icon">
                <BookmarkCheck size={23} />
              </div>
              <div>
                <h2>
                  {l10n('Bâti sur une Reconnaissance Internationale (UICC, SIOP, CCI)', 'Bati lor Rekonesans Internasional (UICC, SIOP, CCI)', 'Built on International Recognition (UICC, SIOP, CCI)')}
                </h2>
                <p>
                  {l10n('Affiliations officielles renforçant nos principes éthiques et la dignité du patient', 'Bann afiliasion ofisiel ki gid nou bann valer etik', 'Official affiliations reinforcing our ethical principles and patient dignity')}
                </p>
              </div>
            </div>

            <p className="about-affiliations__intro">
              {l10n(
                'Les fondations de Med360 sont renforcées par l\'engagement d\'Enn Rev Enn Sourir auprès d\'organisations internationales respectées dans la lutte contre le cancer et l\'oncologie pédiatrique : Membre Titulaire de l\'UICC, et collaborations documentées avec SIOP et Childhood Cancer International (CCI).',
                'Lafondasion Med360 ranforse par langazman Enn Rev Enn Sourir ar bann lorganizasion mondial renome : Manb Titiler UICC ek kolaborasion ar SIOP ek Childhood Cancer International (CCI).',
                'The foundation behind Med360 is strengthened by Enn Rev Enn Sourir’s involvement with respected global cancer organisations: Full Member of the Union for International Cancer Control (UICC), alongside collaborations with SIOP and Childhood Cancer International (CCI).'
              )}
            </p>

            <div className="about-affiliations__grid">
              {FOOTNOTES.map((fn) => (
                <article key={fn.ref} className="about-affil-card">
                  <div>
                    <div className="about-affil-card__meta">
                      <span className="about-affil-ref">{fn.ref}</span>
                      <span className="about-affil-status">{fn.status}</span>
                    </div>
                    <h3>{fn.org}</h3>
                    <div className="about-affil-loc">📍 {fn.location}</div>
                    <p>{fn.desc}</p>
                  </div>

                  <a
                    href={fn.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-affil-link"
                  >
                    <span>{l10n('Consulter le site officiel', 'Get sit ofisiel', 'Visit official website')}</span>
                    <ExternalLink size={13} />
                  </a>
                </article>
              ))}
            </div>
          </div>

          {/* ── 7. Dark Conversion Finale ───────────────────────────────── */}
          <div className="about-cta-finale">
            <h2>
              {tCms(
                'ctaTitle',
                l10n(
                  'Votre Santé Mérite l\'Action, Pas l\'Incertitude.',
                  'Ou Lasante Merite Laksion, Pa Linzistis.',
                  'Your Health Deserves Action, Not Uncertainty.'
                )
              )}
            </h2>
            <p>
              {tCms(
                'ctaDesc',
                l10n(
                  'Prenez rendez-vous dès aujourd\'hui. Laissez-nous vous aider à comprendre vos options et vous mettre en relation avec les soins médicaux appropriés.',
                  'Pran ou randevou zordi mem. Les nou ed ou konpran ou bann opsion ek konekte ou ar bann meyer swen medikal.',
                  'Request an appointment today. Let us help you understand your options and connect you with the right medical care.'
                )
              )}
            </p>
            <div className="about-cta-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/describe-need?from=About+Us+Page+CTA&serviceName=Medical+Consultation')}
                id="about-cta-btn"
              >
                <span>{l10n('Demander un Rendez-vous', 'Demann enn Randevou', 'Request an Appointment')}</span>
                <ArrowRight size={18} />
              </button>
              <a
                href={buildMed360WhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} />
                <span>{l10n('Discuter sur WhatsApp', 'Koz lor WhatsApp', 'Chat on WhatsApp')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
export default AboutPage;
