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
        heroBadge: '✦ Mauritius\'s Trusted Medical Concierge',
        heroTitleLine1: 'World-Class Healthcare,',
        heroTitleLine2: 'Close to Home',
        heroSubtitle: 'Medical 360 connects patients from Mauritius and the Indian Ocean region with the world\'s finest accredited hospitals and specialists — at a fraction of the local cost.',
        trustText: 'Trusted by 1,200+ patients from Mauritius, Réunion & beyond',
        stats: {
          patients: 'Patients Assisted',
          hospitals: 'Accredited Hospitals',
          savings: 'Avg. Cost Savings',
          countries: 'Countries',
          satisfaction: 'Patient Satisfaction',
        },
        specialties: {
          label: 'Medical Expertise',
          title: 'Select the Specialty of Your Need',
          desc: 'World-class treatment across every major medical discipline, delivered by internationally trained specialists.',
          exploreBtn: 'Explore Specialty',
          viewAllBtn: 'View All Specialties'
        },
        process: {
          label: 'Simple Process',
          title: 'Your Journey in 4 Simple Steps',
          desc: 'From first inquiry to full recovery — Medical 360 guides you every step of the way.',
          step1: { title: 'Describe Your Need', desc: 'Fill our simple medical inquiry form with your condition, specialty, and preferences.' },
          step2: { title: 'Get a Free Opinion', desc: 'Our medical team reviews your case and recommends the best hospitals and specialists.' },
          step3: { title: 'We Plan Everything', desc: 'Appointment, visa support, flights, hotel, and airport transfers — all coordinated by Med360.' },
          step4: { title: 'Travel & Recover', desc: 'Arrive with confidence. Our local coordinator stays with you throughout your treatment.' },
          startBtn: 'Start My Journey'
        },
        network: {
          label: 'Our Network',
          title: 'Network of Top Hospitals',
          desc: 'Every hospital in our network is JCI or NABH accredited, with dedicated international patient services.',
          viewAllBtn: 'View All Hospitals'
        },
        whyBadge: 'Why Medical 360',
        whyTitle: 'Your Health. Our Mission.',
        whyDesc: 'We are not just a referral service. Medical 360 is your dedicated health partner — from the moment you reach out to the day you return home recovered.',
        whyImageBadge: '✦ Dedicated Case Managers',
        aboutBtn: 'About Med360',
        features: {
          jci: { title: 'Only JCI / NABH Hospitals', desc: 'Every hospital in our network holds international accreditations ensuring global standards of care.' },
          concierge: { title: '360° Concierge Service', desc: 'From medical visa to airport pickup, in-hospital support, and post-treatment follow-up — we handle it all.' },
          turnaround: { title: 'Fast Turnaround', desc: 'Most patients have appointments arranged within 72 hours of their first inquiry.' },
          caseManager: { title: 'Dedicated Case Manager', desc: 'A personal case manager is assigned to you who speaks your language and guides you at every step.' },
        },
        cases: {
          label: 'Patient Stories',
          title: 'Real Outcomes, Real Lives Changed',
          desc: 'Read how Medical 360 helped patients from Mauritius and across the Indian Ocean region access life-changing treatment.',
          viewAllBtn: 'Read All Stories',
          saved: 'Saved'
        },
        cta: {
          title: 'Ready to Take the First Step?',
          desc: 'Join thousands of patients who trusted Medical 360 for their healthcare journey. Get a free medical opinion today.'
        }
      },
      footer: {
        tagline: 'Your trusted partner for world-class medical treatment abroad.',
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
        freeOpinionDesc: 'Our service is free for patients. Get a free medical opinion today.',
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
        hospitals: 'Hospitals',
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
        heroBadge: '✦ Votre Conciergerie Médicale de Confiance à l\'Île Maurice',
        heroTitleLine1: 'Des Soins de Classe Mondiale,',
        heroTitleLine2: 'Proche de Vous',
        heroSubtitle: 'Medical 360 connecte les patients de l\'île Maurice et de l\'océan Indien avec les meilleurs hôpitaux et spécialistes mondiaux accrédités — à une fraction du coût local.',
        trustText: 'Approuvé par plus de 12 000 patients de l\'île Maurice, de la Réunion et d\'ailleurs',
        stats: {
          patients: 'Patients Accompagnés',
          hospitals: 'Hôpitaux Accrédités',
          savings: 'Économie Moyenne',
          countries: 'Pays',
          satisfaction: 'Satisfaction Patient',
        },
        specialties: {
          label: 'Expertise Médicale',
          title: 'Sélectionnez la Spécialité dont vous avez besoin',
          desc: 'Des traitements de classe mondiale dans toutes les grandes disciplines médicales, dispensés par des spécialistes formés à l\'international.',
          exploreBtn: 'Explorer la Spécialité',
          viewAllBtn: 'Voir Toutes les Spécialités'
        },
        process: {
          label: 'Processus Simple',
          title: 'Votre Parcours en 4 Étapes Simples',
          desc: 'De la première demande à la guérison complète — Medical 360 vous guide à chaque étape du processus.',
          step1: { title: 'Décrivez Votre Besoin', desc: 'Remplissez notre formulaire médical simple avec votre pathologie, spécialité et préférences.' },
          step2: { title: 'Obtenez un Avis Gratuit', desc: 'Notre équipe médicale examine votre cas et recommande les meilleurs hôpitaux et spécialistes.' },
          step3: { title: 'Nous Planifions Tout', desc: 'Rendez-vous, visa, vols, hôtels et transferts aéroport — tout est coordonné par Med360.' },
          step4: { title: 'Voyagez et Récupérez', desc: 'Arrivez en toute confiance. Notre coordinateur local reste avec vous tout au long de votre traitement.' },
          startBtn: 'Commencer Mon Parcours'
        },
        network: {
          label: 'Notre Réseau',
          title: 'Réseau des Meilleurs Hôpitaux',
          desc: 'Chaque hôpital de notre réseau est accrédité JCI ou NABH, avec des services dédiés aux patients internationaux.',
          viewAllBtn: 'Voir Tous les Hôpitaux'
        },
        whyBadge: 'Pourquoi Medical 360',
        whyTitle: 'Votre Santé. Notre Mission.',
        whyDesc: 'Nous ne sommes pas un simple service de mise en relation. Medical 360 est votre partenaire santé dédié — dès votre première prise de contact jusqu\'à votre retour chez vous, guéri.',
        whyImageBadge: '✦ Coordinateurs Dédiés',
        aboutBtn: 'À Propos de Med360',
        features: {
          jci: { title: 'Uniquement des Hôpitaux JCI / NABH', desc: 'Chaque hôpital de notre réseau possède des accréditations internationales garantissant des standards de soins mondiaux.' },
          concierge: { title: 'Service Conciergerie 360°', desc: 'Du visa médical à l\'accueil à l\'aéroport, l\'assistance à l\'hôpital et le suivi post-traitement — nous gérons tout.' },
          turnaround: { title: 'Prise en Charge Rapide', desc: 'La plupart de nos patients obtiennent un rendez-vous dans les 72 heures suivant leur demande.' },
          caseManager: { title: 'Coordinateur de Cas Dédié', desc: 'Un coordinateur personnel vous est assigné, parle votre langue et vous guide à chaque étape.' },
        },
        cases: {
          label: 'Témoignages de Patients',
          title: 'Des Résultats Réels, des Vies Transformées',
          desc: 'Lisez comment Medical 360 a aidé des patients de l\'île Maurice et de l\'océan Indien à accéder à des traitements qui changent la vie.',
          viewAllBtn: 'Lire Tous les Témoignages',
          saved: 'Économisé'
        },
        cta: {
          title: 'Prêt à Franchir le Premier Pas ?',
          desc: 'Rejoignez des milliers de patients qui ont fait confiance à Medical 360 pour leur parcours de santé. Obtenez un avis médical gratuit aujourd\'hui.'
        }
      },
      footer: {
        tagline: 'Votre partenaire de confiance pour des soins médicaux mondiaux à l\'étranger.',
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
        freeOpinionDesc: 'Notre service est gratuit pour les patients. Obtenez un avis médical gratuit dès aujourd\'hui.',
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
        heroBadge: '✦ Ou Konzierz Medikal de Konfians dan Moris',
        heroTitleLine1: 'Bann Swen Medikal Klas Mondial,',
        heroTitleLine2: 'Pre kot Ou',
        heroSubtitle: 'Medical 360 konekt bann pasian dan Moris ek l\'osean Indien avek bann meyer lopital ek spesialist mondial — a enn fraksion pri lokal.',
        trustText: 'Plis ki 12 000 pasian depi Moris, Larenion ek lezot pei finn fer nou konfians',
        stats: {
          patients: 'Pasian Asiste',
          hospitals: 'Lopital Akredite',
          savings: 'Lekonomi Mwayen',
          countries: 'Pei',
          satisfaction: 'Satisifaksion Pasian',
        },
        specialties: {
          label: 'Exspertiz Medikal',
          title: 'Swazir Spesialite Ki Ou Bizin',
          desc: 'Tretman klas mondial dan tou bann gran domenn medikal, done par bann spesialist forme a linternasional.',
          exploreBtn: 'Get Spesialite-La',
          viewAllBtn: 'Get Tou Spesialite'
        },
        process: {
          label: 'Prosesis Sinp',
          title: 'Ou Vwayaz an 4 Letap Sinp',
          desc: 'Depi premie lapel ziska ou geri net — Medical 360 gid ou dan sak letap.',
          step1: { title: 'Dekrir Ou Bizin', desc: 'Ranpli nou ti form medikal avek ou maladi, spesialite ek ou bann preferans.' },
          step2: { title: 'Gagn Enn Lavi', desc: 'Nou lekip medikal get ou ka e rekomann bann meyer lopital ek dokter.' },
          step3: { title: 'Nou Planifie Tou', desc: 'Randevou, viza, biye avion, lotel, ek transpor — Med360 okip tou.' },
          step4: { title: 'Vwayaze & Geri', desc: 'Al laba san traka. Nou koordinater res ar ou pandan tou ou tretman.' },
          startBtn: 'Koumans Mo Vwayaz'
        },
        network: {
          label: 'Nou Rezo',
          title: 'Rezo Bann Meyer Lopital',
          desc: 'Tou lopital dan nou rezo ena akreditasion JCI ouswa NABH, avek servis spesial pou pasian etranze.',
          viewAllBtn: 'Get Tou Lopital'
        },
        whyBadge: 'Kifer Swazir Medical 360',
        whyTitle: 'Ou Lasante. Nou Mision.',
        whyDesc: 'Nou pa zis enn servis ki refer ou. Medical 360 vinn ou partner lasante dedie — depi premie zour ziska zour ou retourn lakaz an bonn sante.',
        whyImageBadge: '✦ Koordinater Dedie',
        aboutBtn: 'A Propo Med360',
        features: {
          jci: { title: 'Zis Lopital JCI / NABH', desc: 'Sak lopital dan nou rezo ena akreditasion internasional ki garanti bann standar mondyal.' },
          concierge: { title: 'Servis Konzierz 360°', desc: 'Depi viza ziska akey lareopor, sipor lopital ek swivi apre tretman — nou okip tou net.' },
          turnaround: { title: 'Servis Rapid', desc: 'Pli boukou pasian gagn zot randevou dan 72 er-tan zis apre zot premie lapel.' },
          caseManager: { title: 'Koordinater Personnel', desc: 'Ou pou gagn enn koordinater ki koz ou langaz e gid ou dan sak letap.' },
        },
        cases: {
          label: 'Temwagnaz Pasian',
          title: 'Vre Rezilta, Vre Lavi Sanze',
          desc: 'Lir kouma Medical 360 finn ed bann pasian Moris ek l\'osean Indien gagn bann tretman ki sanz lavi.',
          viewAllBtn: 'Lir Tou Zistwar',
          saved: 'Sov'
        },
        cta: {
          title: 'Pare Pou Pran Premie Pa?',
          desc: 'Rezwenn bann milye pasian ki finn fer Medical 360 konfians. Gagn enn lavi medikal san peye zordi.'
        }
      },
      footer: {
        tagline: 'Ou partner de konfians pou bann swen medikal klas mondial a letranze.',
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
        freeOpinionDesc: 'Nou servis gratis pou pasian. Gagn ou premie lavi medikal zordi.',
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
