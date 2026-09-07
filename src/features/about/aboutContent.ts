import { Heart, Users, Globe2, Shield, Trophy, Award, Sparkles } from 'lucide-react';

/**
 * About Page static content (multilingual EN / FR / KR).
 * Kept separate from the page component for readability and maintenance.
 */

export const HIGHLIGHTS = [
  {
    icon: Heart,
    label: 'Social Enterprise of Enn Rev Enn Sourir',
    label_fr: 'Entreprise Sociale d\'Enn Rev Enn Sourir',
    label_kr: 'Lakonpanyi Sosyal l\'ONG Enn Rev Enn Sourir',
    sub: 'Sustainable revenue supporting vulnerable patients',
    sub_fr: 'Revenus durables contribuant aux soins des démunis',
    sub_kr: 'Reveni dirab pou finans bann pasian vilnerab'
  },
  {
    icon: Users,
    label: 'Born From a Decade of Compassion',
    label_fr: 'Né d\'une Décennie de Compassion',
    label_kr: 'Ne depi 10 Banlane Konpasion',
    sub: '+3,000 patients assisted in Mauritius and abroad',
    sub_fr: '+3 000 patients accompagnés à Maurice et à l\'étranger',
    sub_kr: '+3 000 pasian finn gagn swen'
  },
  {
    icon: Globe2,
    label: '15 Premier Indian Hospital Hubs',
    label_fr: '15 Grands Pôles Hospitaliers en Inde',
    label_kr: '15 Gran Lopital dan L\'inde',
    sub: 'Chennai, Bengaluru, Hyderabad, Mumbai, Delhi NCR',
    sub_fr: 'Chennai, Bengaluru, Hyderabad, Mumbai, Delhi NCR',
    sub_kr: 'Chennai, Bengaluru, Hyderabad, Mumbai, Delhi NCR'
  },
  {
    icon: Shield,
    label: 'No Dividends. Patient First. Always.',
    label_fr: 'Zéro Dividende. Le Patient Avant Tout.',
    label_kr: 'Zero Dividann. Pasian Avan Tou.',
    sub: 'No compromise on dignity · Equitable healthcare access',
    sub_fr: 'Aucun compromis sur la dignité · Accès équitable aux soins',
    sub_kr: 'Respe drwa pasian ek dignite avan tou'
  },
];

export const TIMELINE = [
  {
    year: '2016',
    title: 'Establishment of NGO Enn Rev Enn Sourir',
    title_fr: 'Création de l\'ONG Enn Rev Enn Sourir',
    title_kr: 'Kréasion l\'ONG Enn Rev Enn Sourir',
    desc: 'Since 2016, Enn Rev Enn Sourir has worked to ensure that access to specialised healthcare is not determined by a family\'s financial circumstances, supporting children and adults in Mauritius and abroad.',
    desc_fr: 'Depuis 2016, Enn Rev Enn Sourir œuvre pour que l\'accès aux soins spécialisés ne dépende pas des ressources financières, soutenant enfants et adultes à Maurice et à l\'étranger.',
    desc_kr: 'Depi 2016, Enn Rev Enn Sourir lite pou ki sak dimounn gagn akse a bann swen spesialize san get so mwayen finansie.',
    badge: 'Humanitarian Roots',
    badge_fr: 'Racines Humanitaires',
    badge_kr: 'Rasinn Imaniter',
  },
  {
    year: '2016 – 2024',
    title: 'UICC Full Member & +3,000 Patients Assisted',
    title_fr: 'Membre Titulaire UICC & +3 000 Patients Accompagnés',
    title_kr: 'Manb Titiler UICC & +3 000 Pasian Asiste',
    desc: 'Listed as a Full Member of the Union for International Cancer Control (UICC), collaborating with SIOP and CCI, with over 3,000 patients supported across premier hospital networks.',
    desc_fr: 'Membre Titulaire de l\'UICC, en collaboration avec SIOP et CCI, avec plus de 3 000 patients assistés auprès de réseaux hospitaliers internationaux de premier plan.',
    desc_kr: 'Manb ofisiel UICC, kolaborater SIOP ek CCI, avek plis ki 3 000 pasian asiste dan bann gran sant medikal.',
    badge: 'Global Recognition',
    badge_fr: 'Reconnaissance Mondiale',
    badge_kr: 'Rekonet Internasional',
  },
  {
    year: '2025',
    title: 'The Launch of Med360',
    title_fr: 'Création de Med360',
    title_kr: 'Lansman Med360',
    desc: 'Created as an ethical medical-services company assisting self-paying and insured patients while generating sustainable revenue to fund treatment for those who cannot afford it.',
    desc_fr: 'Créée comme entreprise de services médicaux éthique pour accompagner les patients solvables et assurés, tout en générant des revenus durables pour les patients défavorisés.',
    desc_kr: 'Kree kouma enn lakonpanyi medikal etik pou kordonn swen pasian ek finans bann tretman pou bann ki dan bezwin.',
    badge: 'Social Enterprise',
    badge_fr: 'Entreprise Sociale',
    badge_kr: 'Lakonpanyi Sosyal',
  },
];

export const FOOTNOTES = [
  {
    ref: '[1]',
    org: 'UICC (Union for International Cancer Control)',
    status: 'Full Member Organization',
    location: 'Geneva, Switzerland',
    desc: 'The largest and oldest global organisation dedicated to reducing the global cancer burden, promoting greater equity, and integrating cancer control into the world health and development agenda.',
    link: 'https://www.uicc.org',
  },
  {
    ref: '[2]',
    org: 'SIOP (International Society of Paediatric Oncology)',
    status: 'Documented Collaboration',
    location: 'Geneva, Switzerland',
    desc: 'The only global multidisciplinary society entirely devoted to pediatric and adolescent oncology, improving clinical care standards worldwide.',
    link: 'https://siop-online.org',
  },
  {
    ref: '[3]',
    org: 'CCI (Childhood Cancer International)',
    status: 'Profiled Organisation',
    location: 'Amsterdam, Netherlands',
    desc: 'The largest patient-support organisation for childhood cancer in the world. CCI has publicly profiled Enn Rev Enn Sourir and its patient work in Mauritius.',
    link: 'https://www.childhoodcancerinternational.org',
  },
];

export const AWARDS = [
  {
    id: 'award-1',
    year: '2025',
    title: 'Excellence in Medical Travel Facilitation — Indian Ocean',
    title_fr: 'Excellence en Facilitation Médicale — Océan Indien',
    title_kr: 'Lekselans dan Kordonasion Vwayaz Medikal — Losean Indien',
    organization: 'Global Health & Travel Asia-Pacific Awards',
    organization_fr: 'Prix Asie-Pacifique Santé & Tourisme Mondial',
    organization_kr: 'Global Health & Travel Asia-Pacific',
    description: 'Recognized for high standards of clinical navigation, rapid specialist review coordination, and strict partner hospital accreditation compliance.',
    description_fr: 'Décerné pour la qualité remarquable de l\'accompagnement patient, la coordination rapide d\'avis médicaux et le respect rigoureux des accréditations hospitalières.',
    description_kr: 'Rekonpans pou kalite kordonasion pasian, rapidite lavi dokter ek respe bann gran sertifikasion JCI.',
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
    description: 'Recognized for compassionate, end-to-end patient logistics, dedicated multilingual bedside coordinators, and patient-first ethics.',
    description_fr: 'Reconnu pour son accompagnement humain de bout en bout, ses coordinateurs multilingues dédiés sur place et son éthique centrée sur le patient.',
    description_kr: 'Rekonet pou enn servis bien imin, kordonater lor plas ek proteksion drwa pasian.',
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
    description: 'Honored for connecting patients in Mauritius directly with leading overseas chief surgeons via secure video teleconsultations.',
    description_fr: 'Récompensé pour la mise en relation directe des patients avec les plus grands spécialistes internationaux via téléconsultations vidéo sécurisées.',
    description_kr: 'Pri inovasion pou koneksyon digital rapid ant pasian Morisien ek bann sef sirizien renome.',
    icon: Sparkles,
    color: '#3b82f6',
    badge: 'Innovation Award',
    badge_fr: 'Prix Innovation',
    badge_kr: 'Pri Inovasion',
  },
];

