/**
 * Med360 — Centralized SEO Configuration Catalog
 * 
 * Provides localized metadata (EN / FR / KR), canonical routes, OpenGraph assets,
 * keywords, and robots indexing directives for all application pages.
 */

import { SITE_URL } from './site';

export interface LocalizedMeta {
  title: {
    en: string;
    fr: string;
    kr: string;
  };
  description: {
    en: string;
    fr: string;
    kr: string;
  };
  canonical: string;
  ogType?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
  keywords?: {
    en: string[];
    fr: string[];
    kr: string[];
  };
}

export type SEOPageKey =
  | 'home'
  | 'about'
  | 'hospitals'
  | 'specialties'
  | 'howItWorks'
  | 'services'
  | 'costCalculator'
  | 'visaGuide'
  | 'caseStudies'
  | 'contact'
  | 'describeNeed'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'medicalDisclaimer'
  | 'notFound'
  | 'maintenance';

export const SEO_PAGES: Record<SEOPageKey, LocalizedMeta> = {
  home: {
    title: {
      en: 'Med360 | Patient-Centric Overseas Healthcare & Hospital Coordination',
      fr: 'Med360 | Coordination Hospitalière & Soins Médicaux à l\'Étranger',
      kr: 'Med360 | Kordonasion Lopital & Swen Medikal a L\'etranze',
    },
    description: {
      en: 'Med360 coordinates specialised medical treatments, second opinions, and surgical evacuations in premier partner hospitals across India and internationally for Mauritian patients.',
      fr: 'Med360 coordonne vos soins spécialisés, seconds avis médicaux et évacuations sanitaires dans les meilleurs hôpitaux partenaires en Inde et à l\'international pour les patients mauriciens.',
      kr: 'Med360 kordonn tretman medikal espesyalize, deziem lavi dokter ek evakuasion saniter dan meyer lopital partener dan L\'inde ek internasional pou bann pasian morisien.',
    },
    canonical: '/',
    ogType: 'website',
    image: '/assets/hero-banner.jpg',
    keywords: {
      en: ['medical tourism Mauritius', 'India hospital coordination', 'Apollo Hospitals Mauritius', 'medical evacuation India', 'treatment abroad Mauritius', 'cardiac surgery India', 'oncology Chennai'],
      fr: ['tourisme médical Maurice', 'coordination hôpitaux Inde', 'évacuation sanitaire Maurice Inde', 'chirurgie cardiaque Inde', 'traitement cancer Inde', 'greffe organe Inde'],
      kr: ['swen medikal L\'inde', 'lopital partener Moris', 'evakuasion saniter L\'inde', 'sirizi leker L\'inde', 'tretman kanser'],
    },
  },

  about: {
    title: {
      en: 'Our Story & Philosophy | Med360',
      fr: 'Notre Histoire & Philosophie | Med360',
      kr: 'Nou Zistwar & Filosofi | Med360',
    },
    description: {
      en: 'Born from a decade of compassion. Built around the patient. Med360 is a social enterprise initiative of NGO Enn Rev Enn Sourir dedicated to ethical healthcare navigation.',
      fr: 'Né d\'une décennie de compassion. Centré sur le patient. Med360 est une entreprise sociale de l\'ONG Enn Rev Enn Sourir dédiée à l\'accompagnement médical éthique.',
      kr: 'Ne depi enn deseni konpasion. Santre lor pasian. Med360 li enn antrepriz sosyal l\'ONG Enn Rev Enn Sourir pou kordonn swen avek dignite.',
    },
    canonical: '/about',
    image: '/assets/banners/about_banner.jpg',
  },

  hospitals: {
    title: {
      en: 'Partner Hospitals & Centers of Excellence | Med360',
      fr: 'Hôpitaux Partenaires & Centres d\'Excellence | Med360',
      kr: 'Lopital Partener & Sant D\'ekselans | Med360',
    },
    description: {
      en: 'Explore NABH and JCI accredited international hospitals across Chennai, Bengaluru, Mumbai, Delhi, and Hyderabad with dedicated patient navigation.',
      fr: 'Découvrez nos hôpitaux accrédités JCI et NABH à Chennai, Bengaluru, Mumbai, Delhi et Hyderabad avec accompagnement patient dédié.',
      kr: 'Dekouver nou bann lopital akredite JCI ek NABH dan Chennai, Bengaluru, Mumbai, Delhi ek Hyderabad avek lakonpagnman pasian dedie.',
    },
    canonical: '/hospitals',
    image: '/assets/banners/hospital_banner.jpg',
  },

  specialties: {
    title: {
      en: 'Medical Specialties & Advanced Clinical Care | Med360',
      fr: 'Spécialités Médicales & Soins Cliniques Avancés | Med360',
      kr: 'Bann Spesialite Medikal & Swen Klinikal Avanse | Med360',
    },
    description: {
      en: 'Cardiology, oncology, neurology, orthopaedics, organ transplants, and specialised paediatric surgery in world-class partner centers.',
      fr: 'Cardiologie, oncologie, neurologie, orthopédie, greffes d\'organes et chirurgie pédiatrique spécialisée dans des centres d\'excellence.',
      kr: 'Kardyolozi, onkolozi, neurolozi, ortopedi, gref lorgan ek sirizi pedyatrik dan bann meyer sant lopital.',
    },
    canonical: '/specialties',
    image: '/assets/banners/specialties_banner.jpg',
  },

  howItWorks: {
    title: {
      en: 'How It Works · Patient Navigation Journey | Med360',
      fr: 'Comment Ça Marche · Parcours d\'Accompagnement Patient | Med360',
      kr: 'Kouma Li Fonksyone · Parkour Lakonpagnman Pasian | Med360',
    },
    description: {
      en: 'From initial medical report review to hospital selection, medical visa facilitation, flights, and post-treatment return: discover our 360° support.',
      fr: 'De l\'analyse du dossier médical au choix de l\'hôpital, visas médicaux, vols et suivi post-opératoire : découvrez notre accompagnement 360°.',
      kr: 'Depi lezamen dosie medikal ziska swazir lopital, viza medikal, biyé avion ek swivi apre tretman: dekouver nou lakonpagnman 360°.',
    },
    canonical: '/how-it-works',
    image: '/assets/banners/howitworks_banner.jpg',
  },

  services: {
    title: {
      en: 'Comprehensive Patient Coordination Services | Med360',
      fr: 'Services Complets de Coordination Médicale | Med360',
      kr: 'Servis Konple Kordonasion Medikal | Med360',
    },
    description: {
      en: 'Second medical opinions, hospital admissions, medical visa assistance, concierge travel support, and post-discharge continuity of care.',
      fr: 'Second avis médical, admission hospitalière, facilitation des visas médicaux, conciergerie de voyage et continuité des soins.',
      kr: 'Deziem lavi dokter, ladmision lopital, viza medikal, konsierzri vwayaz ek kontinwite swen apre tretman.',
    },
    canonical: '/how-it-works',
  },

  costCalculator: {
    title: {
      en: 'Medical Treatment Cost Calculator & Comparison | Med360',
      fr: 'Calculateur & Comparateur de Coûts Médicaux | Med360',
      kr: 'Kalkilatris Pri Tretman Medikal | Med360',
    },
    description: {
      en: 'Calculate and compare international medical treatment costs for Mauritian patients across India, Thailand, Singapore, and Europe. Save up to 70% with transparent pricing.',
      fr: 'Calculez et comparez les coûts des soins médicaux internationaux en Inde avec une tarification claire et transparente.',
      kr: 'Kalkil ek konpar pri tretman medikal dan L\'inde ek lezot pei avek transparans total.',
    },
    canonical: '/cost-calculator',
    image: '/assets/banners/costcalculator_banner.jpg',
  },

  visaGuide: {
    title: {
      en: 'Medical Visa & Travel Guide for Mauritian Patients | Med360',
      fr: 'Guide Visa Médical & Voyage pour Patients Mauriciens | Med360',
      kr: 'Gid Viza Medikal & Vwayaz pou Pasian Morisien | Med360',
    },
    description: {
      en: 'Complete step-by-step medical visa and travel coordination guide for patients travelling from Mauritius to India and international medical hubs.',
      fr: 'Guide complet des démarches de visa médical et d\'organisation de voyage pour les patients voyageant de Maurice vers l\'Inde.',
      kr: 'Gid konple pou demars viza medikal ek vwayaz pou bann pasian ki vwayaz depi Moris ver L\'inde.',
    },
    canonical: '/visa-guide',
    image: '/assets/banners/visaguide_banner.jpg',
  },

  caseStudies: {
    title: {
      en: 'Patient Stories & Clinical Case Studies | Med360',
      fr: 'Témoignages & Études de Cas Cliniques | Med360',
      kr: 'Temwagnaz & Zistwar Pasian | Med360',
    },
    description: {
      en: 'Real stories of Mauritian patients who received life-changing medical treatments abroad with full coordination from Med360.',
      fr: 'Découvrez les parcours de patients mauriciens ayant bénéficié de soins médicaux d\'excellence à l\'étranger avec l\'accompagnement Med360.',
      kr: 'Zistwar bann pasian morisien ki finn gagn tretman medikal d\'ekselans a l\'etranze avek sipor Med360.',
    },
    canonical: '/case-studies',
    image: '/assets/banners/casestudy_banner.jpg',
  },

  contact: {
    title: {
      en: 'Contact Us & Emergency Patient Helpline | Med360',
      fr: 'Contactez-Nous & Assistance Médicale 24/7 | Med360',
      kr: 'Kontak Nou & Lalign Dirzans Pasian | Med360',
    },
    description: {
      en: 'Reach our patient navigation and clinical coordination team in Port-Louis, Mauritius. Active WhatsApp helpline 7 days a week.',
      fr: 'Contactez notre équipe de coordination clinique à Port-Louis, Maurice. Permanence WhatsApp disponible 7j/7.',
      kr: 'Kontak nou lekip kordonasion medikal dan Port-Louis, Moris. Lalign WhatsApp ouver 7 zour lor 7.',
    },
    canonical: '/contact',
  },

  describeNeed: {
    title: {
      en: 'Share Your Medical Reports & Request Assessment | Med360',
      fr: 'Partager Votre Dossier & Demander une Évaluation | Med360',
      kr: 'Partaz Ou Dosie Medikal & Demann Enn Evaluasion | Med360',
    },
    description: {
      en: 'Submit your medical reports securely to receive confidential specialist review, hospital estimates, and video teleconsultation options.',
      fr: 'Transmettez votre dossier médical en toute sécurité pour obtenir un avis spécialiste confidentiel, des devis et des options de téléconsultation.',
      kr: 'Avoy ou bann rapor medikal an sekirite pou gagn lavi sef sirizien ek estimasion pri kler.',
    },
    canonical: '/describe-need',
  },

  privacy: {
    title: {
      en: 'Privacy Policy & Health Data Protection | Med360',
      fr: 'Politique de Confidentialité & Protection des Données | Med360',
      kr: 'Politik Konfidansialite & Proteksion Done | Med360',
    },
    description: {
      en: 'Med360 privacy policy and compliance under the Mauritius Data Protection Act 2017 and European GDPR standards.',
      fr: 'Politique de confidentialité Med360 et protection des données de santé conformément au Data Protection Act 2017 et RGPD.',
      kr: 'Politik konfidansialite Med360 ek proteksion done pasian dapre lalwa Moris DPA 2017 ek RGPD.',
    },
    canonical: '/privacy',
  },

  terms: {
    title: {
      en: 'Terms of Service & Coordination Engagement | Med360',
      fr: 'Conditions Générales & Engagement de Coordination | Med360',
      kr: 'Kondision Zeneral & Servis Kordonasion | Med360',
    },
    description: {
      en: 'Med360 terms and conditions governing medical coordination, non-clinical navigation, and patient advisory services.',
      fr: 'Conditions générales régissant les services de coordination et d\'accompagnement médical de Med360.',
      kr: 'Kondision zeneral lor bann servis kordonasion ek lakonpagnman pasian Med360.',
    },
    canonical: '/terms',
  },

  cookies: {
    title: {
      en: 'Cookie Policy | Med360',
      fr: 'Politique des Cookies | Med360',
      kr: 'Politik Cookies | Med360',
    },
    description: {
      en: 'How Med360 uses cookies and local storage to optimize user preferences, currency selection, and analytics.',
      fr: 'Utilisation des cookies et traceurs par Med360 pour optimiser votre expérience, la sélection des devises et l\'analyse.',
      kr: 'Kouma Med360 servi cookies pou aziste preferans, deviz ek navigasion lor sit.',
    },
    canonical: '/cookies',
  },

  medicalDisclaimer: {
    title: {
      en: 'Medical Disclaimer & Clinical Boundaries | Med360',
      fr: 'Avis Médical Légal & Limites Cliniques | Med360',
      kr: 'Lavi Medikal Legal & Limit Servis | Med360',
    },
    description: {
      en: 'Important medical disclaimer regarding Med360 patient navigation, third-party hospital liability, and emergency protocols.',
      fr: 'Avis médical important concernant la nature des services d\'accompagnement de Med360 et la responsabilité des hôpitaux partenaires.',
      kr: 'Lavi medikal inportan lor rol kordonasion Med360 ek responsabilite lopital partener.',
    },
    canonical: '/medical-disclaimer',
  },

  notFound: {
    title: {
      en: 'Page Not Found | Med360',
      fr: 'Page Non Trouvée | Med360',
      kr: 'Paz Pa Trouve | Med360',
    },
    description: {
      en: 'The requested medical coordination page could not be found. Return to Med360 homepage.',
      fr: 'La page demandée est introuvable. Retournez à l\'accueil de Med360.',
      kr: 'Paz ki ou pe rode pa trouv lor sit. Retourn lor paz lakey Med360.',
    },
    canonical: '/404',
    noIndex: true,
  },

  maintenance: {
    title: {
      en: 'Under Maintenance | Med360',
      fr: 'Maintenance en Cours | Med360',
      kr: 'Mintenans an Kour | Med360',
    },
    description: {
      en: 'Med360 is currently undergoing scheduled platform upgrades. 24/7 emergency patient hotlines remain active.',
      fr: 'Med360 procède à une maintenance planifiée. Notre permanence d\'urgence patient reste active 24/7.',
      kr: 'Med360 pe fer amelyorasion teknik. Nou lalign WhatsApp res 100% ouver 24/7.',
    },
    canonical: '/',
    noIndex: true,
  },
};

/**
 * Resolves localized SEO properties for a given page key and language.
 */
export function getPageSEO(pageKey: SEOPageKey, lang: string = 'en') {
  const meta = SEO_PAGES[pageKey] || SEO_PAGES.home;
  const currentLang = (lang === 'fr' || lang === 'kr') ? lang : 'en';

  const title = meta.title[currentLang] || meta.title.en;
  const description = meta.description[currentLang] || meta.description.en;
  const canonical = meta.canonical;
  const image = meta.image || `${SITE_URL}/assets/hero-banner.jpg`;
  const noIndex = !!meta.noIndex;
  const ogType = meta.ogType || 'website';
  const keywords = meta.keywords?.[currentLang]?.join(', ');

  return {
    title,
    description,
    canonical,
    image,
    noIndex,
    ogType,
    keywords,
  };
}
