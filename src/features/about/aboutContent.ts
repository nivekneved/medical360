import { Heart, Users, Globe2, Shield } from 'lucide-react';
import { SITE_METRICS, PARENT_NGO_NAME } from '../../core/config/site';

/**
 * About Page static content (multilingual EN / FR / KR).
 * Kept separate from the page component for readability and maintenance.
 */

export const HIGHLIGHTS = [
  {
    icon: Heart,
    label: `Social Enterprise of ${PARENT_NGO_NAME}`,
    label_fr: `Entreprise Sociale d'${PARENT_NGO_NAME}`,
    label_kr: `Lakonpanyi Sosyal l'ONG ${PARENT_NGO_NAME}`,
    sub: 'Sustainable revenue supporting vulnerable patients',
    sub_fr: 'Revenus durables contribuant aux soins des démunis',
    sub_kr: 'Reveni dirab pou finans bann pasian vilnerab'
  },
  {
    icon: Users,
    label: 'Born From a Decade of Compassion',
    label_fr: 'Né d\'une Décennie de Compassion',
    label_kr: 'Ne depi 10 Banlane Konpasion',
    sub: `${SITE_METRICS.patientsAssistedEn} patients assisted in Mauritius and abroad`,
    sub_fr: `${SITE_METRICS.patientsAssistedFr} patients accompagnés à Maurice et à l'étranger`,
    sub_kr: `${SITE_METRICS.patientsAssistedFr} pasian finn gagn swen`
  },
  {
    icon: Globe2,
    label: `${SITE_METRICS.partnerHospitals} Premier Worldwide Hospital Hubs`,
    label_fr: `${SITE_METRICS.partnerHospitals} Grands Pôles Hospitaliers Mondiaux`,
    label_kr: `${SITE_METRICS.partnerHospitals} Gran Lopital Mondial`,
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
    year: SITE_METRICS.foundationYear,
    title: `Establishment of NGO ${PARENT_NGO_NAME}`,
    title_fr: `Création de l'ONG ${PARENT_NGO_NAME}`,
    title_kr: `Kréasion l'ONG ${PARENT_NGO_NAME}`,
    desc: `Since ${SITE_METRICS.foundationYear}, ${PARENT_NGO_NAME} has worked to ensure that access to specialised healthcare is not determined by a family's financial circumstances, supporting children and adults in Mauritius and abroad.`,
    desc_fr: `Depuis ${SITE_METRICS.foundationYear}, ${PARENT_NGO_NAME} œuvre pour que l'accès aux soins spécialisés ne dépende pas des ressources financières, soutenant enfants et adultes à Maurice et à l'étranger.`,
    desc_kr: `Depi ${SITE_METRICS.foundationYear}, ${PARENT_NGO_NAME} lite pou ki sak dimounn gagn akse a bann swen spesialize san get so mwayen finansie.`,
    badge: 'Humanitarian Roots',
    badge_fr: 'Racines Humanitaires',
    badge_kr: 'Rasinn Imaniter',
  },
  {
    year: `${SITE_METRICS.foundationYear} – Present`,
    title: `UICC Full Member & ${SITE_METRICS.patientsAssistedEn} Patients Assisted`,
    title_fr: `Membre Titulaire UICC & ${SITE_METRICS.patientsAssistedFr} Patients Accompagnés`,
    title_kr: `Manb Titiler UICC & ${SITE_METRICS.patientsAssistedFr} Pasian Asiste`,
    desc: `Listed as a Full Member of the Union for International Cancer Control (UICC), collaborating with SIOP and CCI, with over ${SITE_METRICS.patientsAssistedEn} patients supported across premier hospital networks.`,
    desc_fr: `Membre Titulaire de l'UICC, en collaboration avec SIOP et CCI, avec plus de ${SITE_METRICS.patientsAssistedFr} patients assistés auprès de réseaux hospitaliers internationaux de premier plan.`,
    desc_kr: `Manb ofisiel UICC, kolaborater SIOP ek CCI, avek plis ki ${SITE_METRICS.patientsAssistedFr} pasian asiste dan bann gran sant medikal.`,
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

export interface OfficialCertificate {
  id: string;
  acronym: string;
  org: string;
  certificateTitle: string;
  certificateTitle_fr: string;
  certificateTitle_kr: string;
  recipient: string;
  status: string;
  status_fr: string;
  status_kr: string;
  yearBadge: string;
  location: string;
  signatory: string;
  desc: string;
  desc_fr: string;
  desc_kr: string;
  pdfUrl: string;
  officialUrl: string;
  accentStyle: 'uicc' | 'siop' | 'cci';
}

export const OFFICIAL_CERTIFICATES: OfficialCertificate[] = [
  {
    id: 'cert-uicc',
    acronym: 'UICC',
    org: 'Union for International Cancer Control',
    certificateTitle: 'Official Member Certificate',
    certificateTitle_fr: 'Certificat Officiel de Membre',
    certificateTitle_kr: 'Sertifika Ofisiel Manb',
    recipient: 'Enn Rev Enn Sourir',
    status: 'Full Member Organisation',
    status_fr: 'Organisation Membre Titulaire',
    status_kr: 'Lorganizasion Manb Titiler',
    yearBadge: 'GLOBAL',
    location: 'Geneva, Switzerland',
    signatory: 'Ulrika Årehed Kågström (President) & Cary Adams (CEO)',
    desc: 'Acknowledges Enn Rev Enn Sourir’s contribution to advancing cancer control globally within the world’s largest and oldest international cancer organisation.',
    desc_fr: 'Reconnaît la contribution d\'Enn Rev Enn Sourir à l\'avancement de la lutte mondiale contre le cancer au sein de la plus grande organisation internationale dédiée.',
    desc_kr: 'Rekonet kontribision Enn Rev Enn Sourir dan lalit mondial kont kanser dan pli gran lorganizasion internasional.',
    pdfUrl: '/assets/certificates/uicc-member-certificate.pdf',
    officialUrl: 'https://www.uicc.org',
    accentStyle: 'uicc',
  },
  {
    id: 'cert-siop',
    acronym: 'SIOP',
    org: 'International Society of Paediatric Oncology',
    certificateTitle: '2025 Membership Certificate',
    certificateTitle_fr: 'Certificat d\'Adhésion 2025',
    certificateTitle_kr: 'Sertifika Manb 2025',
    recipient: 'Mr. Juglall Kumar Budheswar (Karan)',
    status: 'Verified 2025 Member',
    status_fr: 'Membre Vérifié 2025',
    status_kr: 'Manb Verifie 2025',
    yearBadge: '2025',
    location: 'Geneva, Switzerland',
    signatory: 'Dr. Guillermo Luis Chantada (SIOP President)',
    desc: 'Certifies active 2025 membership in the only global multidisciplinary society devoted exclusively to paediatric and adolescent oncology care standards.',
    desc_fr: 'Certifie l\'adhésion active 2025 à l\'unique société multidisciplinaire mondiale exclusivement dédiée à l\'oncologie pédiatrique et de l\'adolescent.',
    desc_kr: 'Sertifie ki li enn manb aktif 2025 dan sel sosiete mondial dedie a onkolozi pediatrik ek adolesan.',
    pdfUrl: '/assets/certificates/siop-membership-certificate-2025.pdf',
    officialUrl: 'https://siop-online.org',
    accentStyle: 'siop',
  },
  {
    id: 'cert-cci',
    acronym: 'CCI',
    org: 'Childhood Cancer International',
    certificateTitle: 'Official Associate Member Approval',
    certificateTitle_fr: 'Agrément Officiel de Membre Associé',
    certificateTitle_kr: 'Lagreman Ofisiel Manb Asosie',
    recipient: 'Enn Rev Enn Sourir · Mauritius',
    status: 'Associate Member · 182 Orgs / 94 Countries',
    status_fr: 'Membre Associé · 182 Orgs / 94 Pays',
    status_kr: 'Manb Asosie · 182 Lorg / 94 Pei',
    yearBadge: '2023+',
    location: 'Amsterdam, Netherlands',
    signatory: 'Rodney Wong Kai Heng (President, Board of Trustees)',
    desc: 'Approved at the CCI Annual General Assembly (Oct 2023), uniting Enn Rev Enn Sourir with 182 organisations across 94 countries championing childhood cancer care.',
    desc_fr: 'Approuvé lors de l\'Assemblée Générale Annuelle de CCI (oct. 2023), intégrant Enn Rev Enn Sourir à un réseau mondial de 182 organisations dans 94 pays.',
    desc_kr: 'Aprouve dan Lasanble Zeneral CCI (Okt 2023), ki reini Enn Rev Enn Sourir avek 182 lorganizasion dan 94 pei.',
    pdfUrl: '/assets/certificates/cci-associate-member-letter.pdf',
    officialUrl: 'https://www.childhoodcancerinternational.org',
    accentStyle: 'cci',
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
    status: 'Verified 2025 Member',
    location: 'Geneva, Switzerland',
    desc: 'The only global multidisciplinary society entirely devoted to pediatric and adolescent oncology, improving clinical care standards worldwide.',
    link: 'https://siop-online.org',
  },
  {
    ref: '[3]',
    org: 'CCI (Childhood Cancer International)',
    status: 'Associate Member Organisation',
    location: 'Amsterdam, Netherlands',
    desc: 'The largest patient-support organisation for childhood cancer in the world, uniting 182 organisations across 94 countries.',
    link: 'https://www.childhoodcancerinternational.org',
  },
];

