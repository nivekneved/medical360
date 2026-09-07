import { ArrowRight, MessageCircle, Shield, Users, Globe2, Heart, Star, Sparkles, Trophy, Award, BookmarkCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildMed360WhatsAppUrl } from '../../core/services/whatsapp.service';
import { SEO } from '../../components/SEO/SEO';
import { useCMS } from '../../hooks/useCMS';
import { useCaseStudies } from '../../hooks/useCaseStudies';
import { HIGHLIGHTS, TIMELINE, FOOTNOTES, AWARDS } from './aboutContent';

export function AboutPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { data: cms } = useCMS('about');
  const { caseStudies } = useCaseStudies();

  const l10n = (fr: string, kr: string, en: string) => i18n.language === 'fr' ? fr : i18n.language === 'kr' ? kr : en;
  const l = (obj: any, field: string) => obj[`${field}_${i18n.language}`] || obj[field];

  const tCms = (key: string, fallback: string) => {
    if (!cms?.content?.[key]) return fallback;
    return cms.content[key][i18n.language] || cms.content[key]['en'] || fallback;
  };

  return (
    <main style={{ paddingTop: 'var(--navbar-height)' }}>
      <SEO 
        title="Our Story & Philosophy · Med360"
        description="Born From a Decade of Compassion. Built Around the Patient. Med360 is a social enterprise initiative of NGO Enn Rev Enn Sourir."
        canonical="/about"
      />

      {/* Header Banner */}
      <section className="page-hero--banner" style={{ backgroundImage: 'url(/assets/banners/about_banner.jpg)' }}>
        <div className="container page-hero__inner">
          <span className="section-label">
            {tCms('heroLabel', l10n('✦ Entreprise Sociale d\'Enn Rev Enn Sourir · +3 000 Patients', '✦ Lakonpanyi Sosyal l\'ONG Enn Rev Enn Sourir · +3 000 Pasian', '✦ Social Enterprise Initiative of Enn Rev Enn Sourir · +3,000 Patients'))}
          </span>
          <h1 className="text-h1">
            {tCms('heroTitle', l10n('Notre Histoire', 'Nou Zistwar', 'Our Story'))}
          </h1>
          <p className="text-lead">
            {tCms('heroDesc', l10n(
              'Né d\'une décennie de compassion. Centré sur le patient. Med360 est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir, créée à partir d\'années d\'expérience dans l\'accompagnement des patients.',
              'Ne depi enn deseni konpasion. Santre lor pasian. Med360 li enn linisiativ antrepriz sosyal l\'ONG Enn Rev Enn Sourir pou kordonn swen pasian avek dignite.',
              'Born From a Decade of Compassion. Built Around the Patient. Med360 is a social enterprise initiative of Enn Rev Enn Sourir, created from years of experience supporting patients and families.'
            ))}
          </p>
        </div>
      </section>

      {/* Main Narrative Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
            <div>
              <span className="section-label">
                {l10n('✦ Genèse & Vocation', '✦ Nou Rasinn', '✦ Born From Compassion')}
              </span>
              <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>
                {l10n('Né d\'une Décennie de Compassion. Centré sur le Patient.', 'Ne depi 10 Banlane Konpasion. Santre lor Pasian.', 'Born From a Decade of Compassion. Built Around the Patient.')}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {l10n(
                  'Med360 est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir, créée à partir d\'années d\'expérience dans l\'accompagnement des patients et de leurs familles durant certains des moments les plus difficiles de leur vie.',
                  'Med360 li enn linisiativ sosyal l\'ONG Enn Rev Enn Sourir, ne depi plizir lane leksperyans pou sipor bann pasian ek fami dan moman pli difisil.',
                  'Med360 is a social enterprise initiative of Enn Rev Enn Sourir, created from years of experience supporting patients and families through some of the most difficult moments of their lives.'
                )}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                {l10n(
                  'Depuis sa création en 2016, Enn Rev Enn Sourir s\'est employée à garantir que l\'accès aux soins de santé spécialisés ne dépende pas de la situation financière des familles. L\'organisation a soutenu enfants et adultes nécessitant des soins spécialisés à Maurice et à l\'étranger, incluant la coordination médicale, l\'accès aux traitements, l\'aide financière, la logistique de voyage et le soutien psychosocial. Cette mission centrée sur le patient est également reconnue au niveau international (UICC).',
                  'Depi so kreasion an 2016, Enn Rev Enn Sourir lite pou ki akse a swen spesialize pa depann lor mwayen finansie enn fami. Lorganizasion finn ed bann ti zanfan ek gran dimounn dan Moris ek a letranze avek kordonasion medikal, lasistans vwayaz ek sipor psikososial.',
                  'Since its establishment in 2016, Enn Rev Enn Sourir has worked to ensure that access to specialised healthcare is not determined by a family\'s financial circumstances. The organisation has supported children and adults requiring specialised medical care in Mauritius and abroad, including medical coordination, treatment access, financial assistance, travel arrangements and psychosocial support. This patient-centred mission is also reflected in the NGO\'s public and international profiles. (UICC)'
                )}
              </p>

              {/* Social Impact Box */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                borderLeft: '4px solid var(--color-primary)',
                padding: '1.35rem',
                borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
                marginTop: '1.5rem',
              }}>
                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--color-text)', fontSize: '1.05rem', fontWeight: 800 }}>
                  {l10n('De la Bienfaisance à l\'Entrepreneuriat Social', 'Depi Aksion Imaniter Ziska Antrepriz Sosyal', 'From Charity to Social Entrepreneurship')}
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: '0 0 0.75rem', fontSize: '0.925rem' }}>
                  {l10n(
                    'Après des années passées à soutenir principalement des familles modestes et des patients vulnérables, nous avons compris que cette même expérience, ces relations avec les hôpitaux internationaux et cette expertise en navigation de patients pouvaient servir un public mauricien plus large.',
                    'Apre plizir lane pou ed bann fami vilnerab, nou finn realize ki sa mem leksperyans ek rezo lopital internasional la kapav servi plis Morisien ankor.',
                    'After years of primarily supporting low- and middle-income families and vulnerable patients, we recognised that the same experience, international hospital relationships and patient-navigation expertise could serve a wider group of Mauritians.'
                  )}
                </p>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: '0 0 0.75rem', fontSize: '0.925rem' }}>
                  {l10n(
                    'En 2025 est née l\'idée de Med360 : créer une société de services médicaux éthique, capable d\'accompagner les patients privés et assurés souhaitant se faire soigner à l\'étranger, tout en générant une source de revenus durable pour financer les soins de ceux qui n\'en ont pas les moyens.',
                    'An 2025, lide Med360 finn ne : kree enn lakonpanyi medikal etik pou ed bann pasian ki kapav peye ouswa asire, pandan ki li kree reveni dirab pou finans bann swen pou bann ki pena mwayen.',
                    'In 2025, the idea of Med360 was born: to create an ethical medical-services company capable of assisting self-paying patients, insured patients and families seeking specialised treatment abroad, while creating a sustainable source of revenue to support patients who cannot afford the treatment they need.'
                  )}
                </p>
                <div style={{ padding: '0.85rem 1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
                  {l10n(
                    'Patients qui peuvent financer leurs soins → Med360 génère des revenus durables → ces revenus contribuent à la mission sociale d\'Enn Rev Enn Sourir et soutiennent les patients vulnérables.',
                    'Pasian ki kapav peye zot swen → Med360 kree reveni dirab → sa reveni la ed l\'ONG Enn Rev Enn Sourir pou sov pasian vilnerab.',
                    'Patients who can afford their healthcare receive professional medical coordination → Med360 generates sustainable revenue → that revenue contributes to the social mission of Enn Rev Enn Sourir and helps support vulnerable patients.'
                  )}
                </div>
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

          {/* Why Med360 Was Needed & No Dividends */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '5rem' }}>
            <div style={{
              background: 'var(--color-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
            }}>
              <span className="section-label">{l10n('✦ Éthique & Transparence', '✦ Etik & Transparans', '✦ Why Med360 Was Needed')}</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 1rem', color: 'var(--color-text)' }}>
                {l10n('Pourquoi Med360 Était Nécessaire', 'Kifer Med360 Ti Bizin Kree', 'Why Med360 Was Needed')}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.925rem', marginBottom: '1rem' }}>
                {l10n(
                  'Au fil des ans, nous avons été témoins du développement rapide du secteur de la facilitation médicale. Pour un patient confronté à un diagnostic grave, le choix d\'un hôpital ou d\'un traitement ne doit jamais être dicté par des intérêts cachés, des coûts superflus ou une pression commerciale.',
                  'Pandan plizir lane, nou finn truv devlopman rapid sekter fasilitasion medikal. Pou enn pasian ki fek gagn enn diagnostik grav, swazir lopital pa bizin par lintere kasiet ouswa presion komersial.',
                  'Over the years, we have also witnessed the rapid development of the medical facilitation and treatment-abroad sector. For a patient facing a serious diagnosis, choosing a hospital or treatment should never be driven by hidden interests, unnecessary costs or commercial pressure.'
                )}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.925rem', marginBottom: '1rem' }}>
                {l10n(
                  'Cela a renforcé notre conviction que Maurice avait besoin d\'un modèle où l\'éthique, la transparence, le choix éclairé, les droits du patient et la dignité passent avant les intérêts commerciaux.',
                  'Sa finn ranfors nou konviksion ki Moris bizin enn model kot etik, transparans, swa kler, drwa pasian ek dignite pas avan lintere komersial.',
                  'This reinforced our belief that Mauritius needed a model where ethics, transparency, informed choice, patient rights and dignity come before commercial interests.'
                )}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.925rem', margin: 0 }}>
                {l10n(
                  'Nous croyons que les patients ont le droit de comprendre où ils sont orientés, pourquoi un hôpital ou un spécialiste précis leur est proposé, ce qu\'implique leur traitement et quels sont les coûts prévus avant de prendre une décision éclairée.',
                  'Nou krwar pasian ena drwa konpran kifer pe propoz li enn sertin lopital ouswa dokter, ki tretman li pou gagne ek ki pri li bizin atann avan pran so desizion.',
                  'We believe patients deserve to understand where they are being referred, why a particular hospital or specialist is being proposed, what their treatment may involve and what the expected costs are before making an informed decision.'
                )}
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(59,130,246,0.06) 100%)',
              border: '1.5px solid rgba(16,185,129,0.25)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
            }}>
              <span className="section-label">{l10n('✦ Notre Philosophie', '✦ Nou Filozofi', '✦ Our Philosophy')}</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 1rem', color: 'var(--color-text)' }}>
                {l10n('Zéro Dividende. Votre Santé Compte.', 'Zero Dividann. Ou Lasante Kont.', 'No Dividends. Your Healthcare Matters.')}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.925rem', marginBottom: '1rem' }}>
                {l10n(
                  'Med360 suit une philosophie différente. Notre but n\'est pas de créer des dividendes pour des actionnaires individuels. Notre but est de créer un impact réel.',
                  'Med360 swiv enn lot filozofi. Nou lobzektif pa kre dividann pou bann aksioner. Nou bi se kre enn vre impak.',
                  'Med360 follows a different philosophy. Our purpose is not to create dividends for individual shareholders. Our purpose is to create impact.'
                )}
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.925rem', marginBottom: '1rem' }}>
                {l10n(
                  'En développant une entreprise de santé durable, nous visons à servir les patients capables de financer leurs soins ou couverts par une assurance, tout en renforçant la capacité d\'Enn Rev Enn Sourir à continuer d\'aider ceux pour qui le coût des soins reste un obstacle.',
                  'Par devlop enn lakonpanyi dirab, nou servi bann pasian ki kapav peye, pandan ki nou ranfors l\'ONG Enn Rev Enn Sourir pou ed dimounn ki pena mwayen pey lopital.',
                  'By developing a sustainable healthcare enterprise, we aim to serve patients who can finance their treatment or are supported by insurance, while helping strengthen the ability of Enn Rev Enn Sourir to continue assisting people for whom the cost of healthcare remains a barrier.'
                )}
              </p>
              <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                {l10n(
                  '« Votre parcours de soins crée une opportunité de soutenir le parcours de soins d\'un autre patient. »',
                  '« Ou vwayaz lasante kre enn loportinite pou soutenir vwayaz lasante enn lot pasian. »',
                  '“Your healthcare journey creates an opportunity to support another healthcare journey.”'
                )}
              </div>
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
                  'Une trajectoire d\'excellence bâtie sur la confiance, le dévouement humain et les plus hautes reconnaissances mondiales.',
                  'Enn zoli parkour bati lor konfians, lanmour ek bann gran rekonpans internasional.',
                  'A trajectory of excellence built on compassion, clinical trust, and respected global recognition.'
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
                  {l10n('Bâti sur une Reconnaissance Internationale (UICC, SIOP, CCI)', 'Bati lor Rekonesans Internasional (UICC, SIOP, CCI)', 'Built on International Recognition (UICC, SIOP, CCI)')}
                </h3>
                <p style={{ margin: '0.2rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  {l10n('Affiliations officielles renforçant nos principes éthiques et la dignité du patient', 'Bann afiliasion ofisiel ki gid nou bann valer etik', 'Official affiliations reinforcing our ethical principles and patient dignity')}
                </p>
              </div>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '0.925rem', marginBottom: '1.75rem' }}>
              {l10n(
                'Les fondations de Med360 sont renforcées par l\'engagement d\'Enn Rev Enn Sourir auprès d\'organisations internationales respectées dans la lutte contre le cancer et l\'oncologie pédiatrique. Enn Rev Enn Sourir est actuellement reconnue comme Membre Titulaire de l\'Union for International Cancer Control (UICC), tandis que ses informations institutionnelles attestent de collaborations avec la Société Internationale d\'Oncologie Pédiatrique (SIOP) et Childhood Cancer International (CCI). CCI a également présenté publiquement Enn Rev Enn Sourir et son action à Maurice. Ces relations renforcent les principes qui nous guident : pratique éthique, soins centrés sur le patient, collaboration, dignité et accès équitable à la santé.',
                'Lafondasion Med360 ranforse par langazman Enn Rev Enn Sourir ar bann lorganizasion mondial renome dan kanser ek onkolizi pediatrik. Enn Rev Enn Sourir li enn Manb Titiler UICC, pe kolabore ar SIOP ek CCI. Sa bann lalians la ranfors nou bann valer : etik, respe drwa pasian, dignite ek akse egal a bann swen.',
                'The foundation behind Med360 is strengthened by Enn Rev Enn Sourir\'s involvement with respected international organisations in cancer and paediatric oncology. Enn Rev Enn Sourir is currently listed as a Full Member of the Union for International Cancer Control (UICC), while its own organisational information documents collaboration with the International Society of Paediatric Oncology (SIOP) and Childhood Cancer International (CCI). CCI has also publicly profiled Enn Rev Enn Sourir and its work in Mauritius. These relationships reinforce the principles that guide us: ethical practice, patient-centred care, collaboration, dignity and equitable access to healthcare.'
              )}
            </p>

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

          {/* Healthcare With Purpose Section */}
          <div style={{
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 12%, var(--color-surface)) 0%, var(--color-surface) 100%)',
            border: '2px solid color-mix(in srgb, var(--color-primary) 30%, transparent)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-md)',
          }}>
            <span className="section-label">{l10n('✦ Des Soins de Santé Porteurs de Sens', '✦ Swen Lasante avek Misyon', '✦ Healthcare With Purpose')}</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: 0, color: 'var(--color-text)' }}>
              {l10n('Des Soins de Santé Porteurs de Sens', 'Swen Lasante avek Gran Misyon', 'Healthcare With Purpose')}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, fontSize: '1rem', margin: 0 }}>
              {l10n(
                'Med360 représente le nouveau chapitre d\'un voyage né d\'une conviction profonde : des soins de santé de qualité ne doivent jamais être un privilège réservé aux seuls patients qui en ont les moyens.',
                'Med360 reprezant nouvo sapit enn vwayaz ki finn koumanse ar enn konviksion sinp : bon swen lasante zame pa bizin enn privilez reserve zis pou bann ki kapav peye.',
                'Med360 represents the next chapter of a journey that began with a simple belief: Quality healthcare should never be a privilege reserved only for those who can afford it.'
              )}
            </p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.75, fontSize: '1rem', margin: 0 }}>
              {l10n(
                'Aujourd\'hui, nous bâtissons un modèle où les soins médicaux et l\'impact social s\'articulent harmonieusement — connectant les patients à des soins de haute spécialisation tout en générant des ressources qui soutiennent d\'autres patients qui risqueraient autrement d\'être délaissés.',
                'Zordi, nou pe konstrir enn model kot lasante ek limaniter mars ansam — konekte pasian ar gran dokter dan L\'inde pandan ki nou kree mwayen pou sov lezot pasian ki ti pou res deryer.',
                'Today, we are building a model where healthcare and social impact work together — connecting patients to specialised care while creating resources that can help another patient who may otherwise be left behind.'
              )}
            </p>
            <div style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1.5px solid var(--color-primary)',
              textAlign: 'center',
            }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-primary)', margin: '0 0 0.5rem' }}>
                Med360 — Your Health. Our Mission. A Greater Purpose.
              </h4>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                {l10n('Zéro dividende. Aucun compromis sur la dignité. Le patient d\'abord. Toujours.', 'Zero dividann. Oken konpromi lor dignite. Pasian avan tou. Touzour.', 'No dividends. No compromise on dignity. Patient first. Always.')}
              </p>
            </div>
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
                {l10n('Reconnu pour la Bienveillance & la Sécurité des Soins', 'Rekonpanse pou Nou Bon Leker & Sekirite', 'Recognized for Compassionate Care & Safety')}
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
                  >
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
                        }}
                        loading="lazy"
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 60%, transparent 100%)',
                      }} />
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
              {tCms('ctaTitle', l10n('Votre Santé Mérite l\'Action, Pas l\'Incertitude.', 'Ou Lasante Merite Laksion, Pa Linzistis.', 'Your Health Deserves Action, Not Uncertainty.'))}
            </h2>
            <p className="text-lead" style={{ marginBottom: '2rem', maxWidth: 540, margin: '0 auto 2rem' }}>
              {tCms('ctaDesc', l10n('Prenez rendez-vous dès aujourd\'hui. Laissez-nous vous aider à comprendre vos options et vous mettre en relation avec les soins médicaux appropriés.', 'Pran ou randevou zordi mem. Les nou ed ou konpran ou bann opsion ek konekte ou ar bann meyer swen medikal.', 'Book your appointment today. Let us help you understand your options and connect you with the right medical care.'))}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/describe-need?from=About+Us+Page+CTA&serviceName=Medical+Consultation')} id="about-cta-btn">
                <span>{l10n('RÉSERVER VOTRE CONSULTATION MÉDICALE', 'REZERV OU KONSILTASION MEDIKAL', 'BOOK YOUR MEDICAL CONSULTATION')}</span>
                <ArrowRight size={18} />
              </button>
              <a href={buildMed360WhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <MessageCircle size={18} /> <span>{l10n('DISCUTER SUR WHATSAPP', 'KOZ AR NOU LOR WHATSAPP', 'CHAT WITH US ON WHATSAPP')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
