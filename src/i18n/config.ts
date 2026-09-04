import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        about: 'About Us',
        hospitals: 'Hospitals',
        specialties: 'Specialties',
        doctors: 'Specialists',
        services: 'Our Services',
        caseStudies: 'Patient Stories',
        contact: 'Contact',
        admin: 'Admin Only',
        whatsapp: 'WhatsApp',
        freeOpinion: 'Get Free Opinion',
      },
      home: {
        heroBadge: '✦ Owned by NGO Enn Rev Enn Sourir · 10+ Years of Care',
        heroTitleLine1: 'Specialised Medical Care,',
        heroTitleLine2: 'In Private Clinics & Abroad',
        heroSubtitle: 'Med360 is a company owned by the NGO Enn Rev Enn Sourir. After 10 years of helping needy patients access specialised treatment in private clinics and abroad, we now extend our expert concierge to those who can afford it — with 100% of profits going back to the NGO to continue helping others in need.',
        trustText: 'Backed by 10+ years of humanitarian care & 1,200+ patients assisted',
        stats: {
          patients: 'Patients Assisted',
          hospitals: 'Partner Hospitals & Clinics',
          savings: 'Years NGO Medical Experience',
          countries: 'Countries',
          satisfaction: 'Social Impact (Profits to NGO)',
        },
        specialties: {
          label: 'Medical Expertise',
          title: 'Specialised Treatment for Every Medical Need',
          desc: 'World-class treatment across major medical disciplines in accredited private clinics locally and top hospitals abroad.',
          exploreBtn: 'Explore Specialty',
          viewAllBtn: 'View All Specialties'
        },
        process: {
          label: 'How It Works',
          title: 'Your Medical Journey in 4 Simple Steps',
          desc: 'From initial review to complete recovery — backed by a decade of humanitarian medical coordination.',
          step1: { title: 'Describe Your Need', desc: 'Share your condition, medical reports, and treatment preferences with our team.' },
          step2: { title: 'Free Medical Review', desc: 'Our medical specialists review your case and recommend the best clinics, hospitals, and surgeons.' },
          step3: { title: 'End-to-End Coordination', desc: 'Appointments, visa support, travel, hospital admission, and transfers — all arranged by Med360.' },
          step4: { title: 'Treatment & Recovery', desc: 'Receive dedicated on-ground care, while your journey helps fund medical treatment for a patient in need.' },
          startBtn: 'Start My Journey'
        },
        network: {
          label: 'Our Network',
          title: 'Accredited Hospitals & Private Clinics',
          desc: 'Our curated network includes internationally accredited JCI and NABH hospitals and top private clinics.',
          viewAllBtn: 'View All Hospitals'
        },
        whyBadge: '✦ 10-Year NGO Heritage',
        whyTitle: 'World-Class Healthcare. 100% Social Purpose.',
        whyDesc: 'Med360 is owned by the NGO Enn Rev Enn Sourir. For over 10 years, our team has coordinated life-saving care in private clinics and premier hospitals abroad for needy patients. By choosing Med360 for your private medical needs, you get gold-standard concierge care while your payment directly finances medical treatments for underprivileged families.',
        whyImageBadge: '✦ 100% Profits Returned to NGO',
        aboutBtn: 'Discover Our Story',
        features: {
          jci: { title: '10+ Years Medical Relief Experience', desc: 'Over a decade of hands-on expertise navigating complex medical treatments, international surgeries, and clinical care.' },
          concierge: { title: '360° Personal Concierge', desc: 'From second medical opinions to travel logistics, hospital bedside assistance, and post-treatment recovery.' },
          turnaround: { title: 'Vetted Private Clinics & Hospitals', desc: 'Direct access to top specialists and internationally accredited hospitals in India, Thailand, Mauritius and beyond.' },
          caseManager: { title: '100% Social Impact Reinvestment', desc: 'Every rupee of company profit goes directly back into NGO Enn Rev Enn Sourir to provide healthcare for the needy.' },
        },
        cases: {
          label: 'Patient Stories',
          title: 'Real Lives Changed, Real Healing',
          desc: 'Discover how 10 years of medical coordination has brought healing and hope to patients and families across the region.',
          viewAllBtn: 'Read All Stories',
          saved: 'Saved'
        },
        cta: {
          title: 'Ready to Plan Your Treatment?',
          desc: 'Receive world-class medical care while supporting life-saving healthcare for those in need. Request your free medical opinion today.'
        }
      },
      footer: {
        tagline: 'Med360 is a company owned by the NGO Enn Rev Enn Sourir. 10+ years coordinating specialised treatment in private clinics and abroad. 100% of profits return to the NGO to help the needy.',
        quickLinks: 'Quick Links',
        services: 'Services',
        legal: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        rights: 'All rights reserved.',
        topSpecialties: 'Top Specialties',
        specialtiesList: {
          cardiology: 'Cardiology',
          oncology: 'Oncology',
          orthopedics: 'Orthopedics',
          neurology: 'Neurology',
          transplant: 'Organ Transplants',
          ivf: 'IVF & Fertility'
        },
        freeOpinionDesc: 'Free medical opinion and personalized coordination. Every treatment helps NGO Enn Rev Enn Sourir fund healthcare for the needy.',
        adminPortal: 'Admin Portal'
      },
      common: {
        viewAll: 'View All',
        getStarted: 'Get Started',
        explore: 'Explore',
        requestService: 'Request This Service',
      }
    }
  },
  fr: {
    translation: {
      nav: {
        about: 'À Propos',
        hospitals: 'Hôpitaux',
        specialties: 'Spécialités',
        doctors: 'Médecins',
        services: 'Nos Services',
        caseStudies: 'Témoignages',
        contact: 'Contact',
        admin: 'Admin Only',
        whatsapp: 'WhatsApp',
        freeOpinion: 'Avis Médical Gratuit',
      },
      home: {
        heroBadge: '✦ Détenu par l\'ONG Enn Rev Enn Sourir · 10+ Ans de Soins',
        heroTitleLine1: 'Des Soins Spécialisés,',
        heroTitleLine2: 'En Clinique Privée & à l\'Étranger',
        heroSubtitle: 'Med360 est une entreprise détenue par l\'ONG Enn Rev Enn Sourir. Après 10 ans à aider les personnes dans le besoin à accéder à des traitements spécialisés en clinique privée ou à l\'étranger, nous étendons désormais nos services à ceux qui peuvent se le permettre — 100 % des bénéfices sont reversés à l\'ONG pour continuer d\'aider les plus démunis.',
        trustText: 'Soutenu par 10+ ans d\'action humanitaire et plus de 1 200 patients accompagnés',
        stats: {
          patients: 'Patients Accompagnés',
          hospitals: 'Hôpitaux & Cliniques Partenaires',
          savings: 'Ans d\'Expérience Médicale ONG',
          countries: 'Pays',
          satisfaction: 'Impact Social (Bénéfices à l\'ONG)',
        },
        specialties: {
          label: 'Expertise Médicale',
          title: 'Soins Spécialisés pour Chaque Besoin Médical',
          desc: 'Traitements de pointe dispensés dans les meilleures cliniques privées locales et les hôpitaux de référence à l\'étranger.',
          exploreBtn: 'Explorer la Spécialité',
          viewAllBtn: 'Voir Toutes les Spécialités'
        },
        process: {
          label: 'Comment Ça Marche',
          title: 'Votre Parcours Médical en 4 Étapes Simples',
          desc: 'De l\'étude de votre dossier jusqu\'au rétablissement complet — avec l\'appui de 10 ans d\'expérience médicale humanitaire.',
          step1: { title: 'Décrivez Votre Besoin', desc: 'Partagez vos rapports médicaux et vos attentes avec notre équipe.' },
          step2: { title: 'Avis Médical Gratuit', desc: 'Nos spécialistes examinent votre cas et vous orientent vers les meilleurs cliniques et chirurgiens.' },
          step3: { title: 'Organisation Clé en Main', desc: 'Rendez-vous, démarches de visa, hébergement, transports et admission hospitalière — Med360 gère tout.' },
          step4: { title: 'Traitement & Guérison', desc: 'Bénéficiez d\'un accompagnement dédié, tandis que votre parcours contribue à financer les soins d\'une personne dans le besoin.' },
          startBtn: 'Commencer Mon Parcours'
        },
        network: {
          label: 'Notre Réseau',
          title: 'Cliniques Privées & Hôpitaux Accrédités',
          desc: 'Chaque établissement partenaire est certifié pour ses standards élevés de qualité et de sécurité des soins.',
          viewAllBtn: 'Voir Tous les Hôpitaux'
        },
        whyBadge: '✦ 10 Ans d\'Héritage ONG',
        whyTitle: 'Excellence Médicale. 100 % Vocation Sociale.',
        whyDesc: 'Med360 est une entreprise détenue par l\'ONG Enn Rev Enn Sourir. Depuis plus de 10 ans, notre équipe coordonne des soins spécialisés vitaux en clinique privée et à l\'étranger pour les personnes dans le besoin. En choisissant Med360 pour vos soins privés, vous bénéficiez d\'un service conciergerie haut de gamme tout en finançant directement les soins de familles défavorisées.',
        whyImageBadge: '✦ 100 % des Bénéfices Reversés à l\'ONG',
        aboutBtn: 'Découvrir Notre Histoire',
        features: {
          jci: { title: '10+ Ans d\'Expérience Médicale', desc: 'Une décennie de savoir-faire dans la prise en charge de chirurgies complexes et de protocoles spécialisés.' },
          concierge: { title: 'Conciergerie Médicale 360°', desc: 'Second avis médical, logistique voyage, accompagnement sur place et suivi après traitement.' },
          turnaround: { title: 'Cliniques & Hôpitaux Réputés', desc: 'Accès direct aux plus grands spécialistes en Inde, en Thaïlande, à Maurice et à l\'international.' },
          caseManager: { title: '100 % Impact Social Reversé', desc: 'Chaque roupie de bénéfice est réinjectée dans l\'ONG Enn Rev Enn Sourir pour financer les soins des démunis.' },
        },
        cases: {
          label: 'Témoignages de Patients',
          title: 'Des Vies Transformées, Des Vies Sauvées',
          desc: 'Découvrez comment 10 ans d\'engagement ont permis à des centaines de familles de retrouver la santé et l\'espoir.',
          viewAllBtn: 'Lire Tous les Témoignages',
          saved: 'Économisé'
        },
        cta: {
          title: 'Prêt à Planifier Vos Soins ?',
          desc: 'Accédez à des soins d\'excellence tout en soutenant l\'accès aux soins pour ceux qui en ont le plus besoin. Demandez votre avis médical gratuit dès aujourd\'hui.'
        }
      },
      footer: {
        tagline: 'Med360 est une entreprise détenue par l\'ONG Enn Rev Enn Sourir. 10+ ans à organiser des soins spécialisés en clinique privée et à l\'étranger. 100 % des bénéfices reversés à l\'ONG pour aider les personnes dans le besoin.',
        quickLinks: 'Liens Rapides',
        services: 'Services',
        legal: 'Légal',
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions d\'Utilisation',
        rights: 'Tous droits réservés.',
        topSpecialties: 'Spécialités Principales',
        specialtiesList: {
          cardiology: 'Cardiologie',
          oncology: 'Oncologie',
          orthopedics: 'Orthopédie',
          neurology: 'Neurologie',
          transplant: 'Greffes d\'Organes',
          ivf: 'FIV & Fertilité'
        },
        freeOpinionDesc: 'Avis médical gratuit et accompagnement personnalisé. Chaque prise en charge aide l\'ONG Enn Rev Enn Sourir à soigner les plus démunis.',
        adminPortal: 'Portail Admin'
      },
      common: {
        viewAll: 'Voir Tout',
        getStarted: 'Commencer',
        explore: 'Explorer',
        requestService: 'Demander ce Service',
      }
    }
  },
  kr: {
    translation: {
      nav: {
        about: 'A Propo',
        hospitals: 'Lopital',
        specialties: 'Spesialite',
        doctors: 'Bann Dokter',
        services: 'Nou Bann Servis',
        caseStudies: 'Temwagnaz',
        contact: 'Kontak Nou',
        admin: 'Admin Only',
        whatsapp: 'WhatsApp',
        freeOpinion: 'Gagn Enn Lavi',
      },
      home: {
        heroBadge: '✦ Apartenir a l\'ONG Enn Rev Enn Sourir · 10+ Banlane dan Swen',
        heroTitleLine1: 'Bann Swen Medikal Spesialize,',
        heroTitleLine2: 'Dan Klinik Prive & a Letranze',
        heroSubtitle: 'Med360 li enn lakonpanyi ki apartenir a l\'ONG Enn Rev Enn Sourir. Apre 10 banlane pe ed bann dimounn dan bezwin gagn akse a bann tretman spesialize dan klinik prive ouswa a letranze, nou finn deside elarzi nou servis pou bann ki kapav peye. Tou profi retourn dan l\'ONG pou kontinie ed bann ki pli dan bezwin.',
        trustText: 'Pote par 10+ banlane led imaniter ek plis ki 1 200 pasian asiste',
        stats: {
          patients: 'Pasian Asiste',
          hospitals: 'Lopital & Klinik Partner',
          savings: 'Banlane Eksperyans ONG',
          countries: 'Pei',
          satisfaction: 'Lirzans Sosyal (Profi pou ONG)',
        },
        specialties: {
          label: 'Ekspertiz Medikal',
          title: 'Tretman Spesialize pou Sak Bezwin Medikal',
          desc: 'Tretman klas mondial dan bann meyer klinik prive lokal ek gran lopital a letranze.',
          exploreBtn: 'Get Spesialite-La',
          viewAllBtn: 'Get Tou Spesialite'
        },
        process: {
          label: 'Kouma Li Mase',
          title: 'Ou Vwayaz Medikal an 4 Letap Sinp',
          desc: 'Depi premie lapel ziska ou geri net — avek lexperyans 10 banlane kordonasion medikal.',
          step1: { title: 'Dekrir Ou Bizin', desc: 'Partaz ou bann rapor medikal ek preferans avek nou lekip.' },
          step2: { title: 'Gagn Enn Lavi Medikal Gratis', desc: 'Nou bann dokter get ou ka ek gid ou ver bann meyer klinik ek sirizien.' },
          step3: { title: 'Nou Planifie Tou', desc: 'Randevou, viza, biye avion, lotel ek transpor — Med360 okip tou net.' },
          step4: { title: 'Tretman & Geri', desc: 'Ou gagn enn bon akonpanyeman, e ou tretman ed finansie swen pou enn pasian ki dan bezwin.' },
          startBtn: 'Koumans Mo Vwayaz'
        },
        network: {
          label: 'Nou Rezo',
          title: 'Klinik Prive & Lopital Akredite',
          desc: 'Tou nou bann partener ena sertifikasion o-nivo pou sekirite ek kalite swen.',
          viewAllBtn: 'Get Tou Lopital'
        },
        whyBadge: '✦ 10 Banlane Leritaz ONG',
        whyTitle: 'Gran Kalite Swen. 100% Misyon Sosyal.',
        whyDesc: 'Med360 li apartenir a l\'ONG Enn Rev Enn Sourir. Pandan plis ki 10 banlane, nou lekip finn kordonn bann swen spesialize dan klinik prive ek a letranze pou bann pasian dan bezwin. Kan ou swazir Med360 pou ou bann swen prive, ou gagn enn servis 5 zetwal, e tou profi al direk dan l\'ONG pou pey lopital pou bann fami ki pa kapav peye.',
        whyImageBadge: '✦ 100% Bann Profi Retourn dan ONG',
        aboutBtn: 'Dekouver Nou Zistwar',
        features: {
          jci: { title: '10+ Banlane dan Swen Medikal', desc: 'Plis ki enn deseni lexperyans dan loperasion difisil ek tretman spesialize.' },
          concierge: { title: 'Servis Konzierz 360°', desc: 'Lavi medikal gratis, biye, viza, kordonater lor plas ek swivi apre tretman.' },
          turnaround: { title: 'Klinik & Lopital Renome', desc: 'Akse direk ar bann sef sirizien dan L\'inde, Taylann, Moris ek lezot pei.' },
          caseManager: { title: '100% Profi Al dan l\'ONG', desc: 'Sak roupi profi retourn dan Enn Rev Enn Sourir pou ed bann pasian dan bezwin.' },
        },
        cases: {
          label: 'Temwagnaz Pasian',
          title: 'Vre Lavi Sanze, Vre Lavi Sove',
          desc: 'Dekouver kouma 10 banlane langazman finn ed boukou fami gagn tretman ek lespwar.',
          viewAllBtn: 'Lir Tou Zistwar',
          saved: 'Sov'
        },
        cta: {
          title: 'Pare pou Planifie Ou Tretman?',
          desc: 'Gagn bann meyer swen medikal tousala an edan bann dimounn ki dan bezwin. Gagn ou premie lavi medikal gratis zordi.'
        }
      },
      footer: {
        tagline: 'Med360 li enn lakonpanyi ki apartenir a l\'ONG Enn Rev Enn Sourir. 10+ banlane pe kordonn bann swen spesialize dan klinik prive ek a letranze. 100% profi retourn dan l\'ONG pou ed bann ki dan bezwin.',
        quickLinks: 'Lien Rapid',
        services: 'Bann Servis',
        legal: 'Lalwa',
        privacy: 'Politik Konfidansialite',
        terms: 'Kondision Itilizasion',
        rights: 'Tou drwa rezerve.',
        topSpecialties: 'Bann Spesialite',
        specialtiesList: {
          cardiology: 'Kardiolizi',
          oncology: 'Onkolizi',
          orthopedics: 'Ortopedi',
          neurology: 'Neurolozi',
          transplant: 'Transplantasion',
          ivf: 'FIV & Fertilite'
        },
        freeOpinionDesc: 'Lavi medikal gratis ek gidans personel. Sak tretman ed l\'ONG Enn Rev Enn Sourir swany bann dimounn dan bezwin.',
        adminPortal: 'Portal Admin'
      },
      common: {
        viewAll: 'Get Tou',
        getStarted: 'Koumanse',
        explore: 'Explor',
        requestService: 'Deman Sa Servis-La',
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
