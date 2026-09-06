import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        about: 'About Us',
        hospitals: 'Partner Hospitals',
        specialties: 'Medical Specialties',
        doctors: 'Specialists & Doctors',
        services: 'Our Services',
        caseStudies: 'Patient Stories',
        contact: 'Contact Us',
        admin: 'Admin Portal',
        whatsapp: 'WhatsApp',
        freeOpinion: 'Free Medical Review',
      },
      home: {
        missionMarquee: "Med360 is a social enterprise owned by the NGO Enn Rev Enn Sourir. For 10+ years, we have helped patients in need access specialised care in private clinics and abroad. Now, we offer this same caring guidance to those who can afford it — with 100% of company profits returning to the NGO to fund life-saving treatments for families in need.",
        heroBadge: '✦ Owned by NGO Enn Rev Enn Sourir · 10+ Years Caring for Patients',
        heroTitleLine1: 'You Are in Safe,',
        heroTitleLine2: 'Caring Hands',
        heroSubtitle: 'Med360 is owned by the NGO Enn Rev Enn Sourir. After 10 years of helping patients access trusted doctors in private clinics and accredited hospitals abroad, we provide personal, gentle guidance for you and your family — with 100% of profits helping fund healthcare for those in need.',
        trustText: 'Backed by 10+ years of compassionate care & over 1,200 patients guided safely',
        stats: {
          patients: 'Patients Guided Safely',
          hospitals: 'Trusted Hospitals & Clinics',
          savings: 'Years of Caring Experience',
          countries: 'Partner Countries',
          satisfaction: '100% Profits Support NGO',
        },
        specialties: {
          label: 'Specialised Care',
          title: 'Trusted Medical Care for You & Your Loved Ones',
          desc: 'Clear guidance and proven treatments across all major fields of medicine, in welcoming private clinics locally and top hospitals abroad.',
          exploreBtn: 'View Specialty',
          viewAllBtn: 'View All Specialties'
        },
        process: {
          label: 'How We Care For You',
          title: 'Your Healing Journey in 4 Simple Steps',
          desc: 'From your first question to your safe recovery back home — we walk beside you at every step so you never feel alone.',
          step1: { title: 'Tell Us Your Situation', desc: 'Share your condition, reports, and questions with our caring coordinators in complete confidentiality.' },
          step2: { title: 'Free Doctor Review', desc: 'Experienced doctors review your medical files and recommend the most suitable clinic, hospital, and surgeon.' },
          step3: { title: 'We Handle Everything', desc: 'From appointments and medical visas to flights, hospital admission, and transfers — we take care of all the details.' },
          step4: { title: 'Treatment & Peaceful Recovery', desc: 'You receive gentle bedside support, while your journey helps fund medical treatment for a patient in need.' },
          startBtn: 'Begin Your Care Journey'
        },
        network: {
          label: 'Safe & Welcoming Hospitals',
          title: 'Accredited Hospitals & Private Clinics',
          desc: 'Every hospital in our network is strictly accredited for patient safety, hygiene, modern medical technology, and warm nursing care.',
          viewAllBtn: 'View All Partner Hospitals'
        },
        whyBadge: '✦ 10-Year NGO Heritage of Love & Care',
        whyTitle: 'Trusted Medical Care. 100% For a Good Cause.',
        whyDesc: 'Med360 is owned by the NGO Enn Rev Enn Sourir. For over 10 years, our team has organized life-saving operations for needy patients. When you trust Med360 with your private medical journey, you receive warm, dedicated guidance from doctors you can trust, while every single rupee of profit goes directly to help care for an underprivileged child or family.',
        whyImageBadge: '✦ 100% Profits Returned to NGO',
        aboutBtn: 'Read Our Story',
        features: {
          jci: { title: '10+ Years Caring for Patients', desc: 'Over a decade of genuine clinical experience guiding patients through complex surgeries and recovery.' },
          concierge: { title: 'Personal Companion at Every Step', desc: 'From a free second opinion to travel, bedside assistance, and recovery check-ins back home.' },
          turnaround: { title: 'Vetted, Reputable Hospitals', desc: 'Direct access to experienced doctors in accredited hospitals in Mauritius, India, Thailand, and beyond.' },
          caseManager: { title: 'Every Rupee Helps Someone in Need', desc: '100% of our profits go straight back to NGO Enn Rev Enn Sourir to pay medical bills for needy patients.' },
        },
        cases: {
          label: 'Real Stories',
          title: 'Stories of Healing, Hope & Recovery',
          desc: 'Read how 10 years of dedicated medical guidance has brought relief, healing, and smiles back to families.',
          viewAllBtn: 'Read All Stories',
          saved: 'Protected'
        },
        cta: {
          title: 'Need Medical Advice or Guidance?',
          desc: 'Talk with our caring team today. We will review your case for free, answer all your questions honestly, and help you find peace of mind.'
        }
      },
      footer: {
        tagline: 'Med360 is a company owned by the NGO Enn Rev Enn Sourir. 10+ years helping patients access specialised care in private clinics and abroad. 100% of company profits return to the NGO to care for those in need.',
        quickLinks: 'Quick Links',
        services: 'Services',
        legal: 'Legal & Privacy',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        rights: 'All rights reserved.',
        topSpecialties: 'Medical Specialties',
        specialtiesList: {
          cardiology: 'Cardiology (Heart Care)',
          oncology: 'Oncology (Cancer Care)',
          orthopedics: 'Orthopedics (Bones & Joints)',
          neurology: 'Neurology (Brain & Spine)',
          transplant: 'Organ Transplants',
          ivf: 'IVF & Fertility Care'
        },
        freeOpinionDesc: 'Free, confidential medical review and personal guidance. Every journey helps NGO Enn Rev Enn Sourir care for patients in need.',
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
        hospitals: 'Hôpitaux Partenaires',
        specialties: 'Spécialités Médicales',
        doctors: 'Médecins & Spécialistes',
        services: 'Nos Services',
        caseStudies: 'Témoignages',
        contact: 'Nous Contacter',
        admin: 'Portail Admin',
        whatsapp: 'WhatsApp',
        freeOpinion: 'Avis Médical Gratuit',
      },
      home: {
        missionMarquee: "Med360 est une entreprise sociale détenue par l'ONG Enn Rev Enn Sourir. Depuis plus de 10 ans, nous aidons les personnes dans le besoin à avoir accès à des soins spécialisés en clinique privée ou à l'étranger. Nous étendons aujourd'hui cet accompagnement bienveillant à tous — 100 % de nos bénéfices sont reversés à l'ONG pour continuer de soigner les plus démunis.",
        heroBadge: '✦ Détenu par l\'ONG Enn Rev Enn Sourir · 10+ Ans de Soins et d\'Écoute',
        heroTitleLine1: 'Vous Êtes Entre des Mains',
        heroTitleLine2: 'Sûres et Bienveillantes',
        heroSubtitle: 'Med360 est détenu par l\'ONG Enn Rev Enn Sourir. Forts de 10 ans passés à accompagner des patients vers des médecins de confiance en clinique privée et à l\'étranger, nous vous guidons avec douceur et transparence — 100 % de nos bénéfices financent les soins de personnes dans le besoin.',
        trustText: 'Plus de 10 ans d\'engagement humain et plus de 1 200 patients accompagnés vers la guérison',
        stats: {
          patients: 'Patients Accompagnés',
          hospitals: 'Hôpitaux & Cliniques Partenaires',
          savings: 'Ans d\'Expérience Humaine',
          countries: 'Pays Partenaires',
          satisfaction: '100% Bénéfices à l\'ONG',
        },
        specialties: {
          label: 'Soins Spécialisés',
          title: 'Des Soins Médicaux de Confiance pour Vous & Vos Proches',
          desc: 'Une écoute attentive et des traitements éprouvés dans toutes les grandes spécialités, au sein de cliniques privées locales et d\'hôpitaux réputés à l\'étranger.',
          exploreBtn: 'Découvrir la Spécialité',
          viewAllBtn: 'Voir Toutes les Spécialités'
        },
        process: {
          label: 'Notre Accompagnement',
          title: 'Votre Parcours Vers la Guérison en 4 Étapes Sereines',
          desc: 'De vos premières questions jusqu\'à votre retour chez vous en toute sécurité — nous sommes à vos côtés à chaque instant.',
          step1: { title: 'Partagez Votre Situation', desc: 'Expliquez-nous ce que vous ressentez et confiez-nous vos rapports en toute confidentialité.' },
          step2: { title: 'Avis Médical Gratuit', desc: 'Des médecins expérimentés étudient votre dossier et vous conseillent l\'établissement et le praticien les plus adaptés.' },
          step3: { title: 'Nous Nous Occupons de Tout', desc: 'Rendez-vous, démarches de visa médical, billets, admission et transferts — vous n\'avez aucun souci logistique.' },
          step4: { title: 'Soins & Rétablissement Paisible', desc: 'Bénéficiez d\'une présence rassurante sur place, tandis que votre parcours aide à financer les soins d\'une famille démunie.' },
          startBtn: 'Commencer Mon Parcours'
        },
        network: {
          label: 'Établissements de Confiance',
          title: 'Cliniques Privées & Hôpitaux Accrédités',
          desc: 'Chaque établissement de notre réseau est rigoureusement certifié pour la sécurité des soins, son hygiène irréprochable et la bienveillance de ses soignants.',
          viewAllBtn: 'Voir Tous les Hôpitaux'
        },
        whyBadge: '✦ 10 Ans d\'Engagement de Cœur',
        whyTitle: 'Des Soins de Grande Qualité. 100 % Pour la Bonne Cause.',
        whyDesc: 'Med360 appartient à l\'ONG Enn Rev Enn Sourir. Depuis plus de 10 ans, notre équipe organise des interventions vitales pour les plus démunis. En nous confiant l\'organisation de vos soins, vous recevez un accompagnement humain et attentionné, tandis que chaque roupie de bénéfice aide directement à soigner un enfant ou un parent vulnérable.',
        whyImageBadge: '✦ 100 % des Bénéfices Reversés à l\'ONG',
        aboutBtn: 'Découvrir Notre Histoire',
        features: {
          jci: { title: '10+ Ans aux Côtés des Patients', desc: 'Une longue expérience humaine dans l\'orientation médicale, les chirurgies spécialisées et la convalescence.' },
          concierge: { title: 'Un Proche à Vos Côtés', desc: 'Deuxième avis médical gratuit, organisation du voyage, soutien au chevet du patient et suivi rassurant au retour.' },
          turnaround: { title: 'Médecins & Hôpitaux Éprouvés', desc: 'Un accès direct à des chirurgiens réputés et bienveillants à Maurice, en Inde, en Thaïlande et à l\'international.' },
          caseManager: { title: 'Chaque Roupie Aide un Malade', desc: '100 % de nos bénéfices retournent à l\'ONG Enn Rev Enn Sourir pour financer les traitements des plus démunis.' },
        },
        cases: {
          label: 'Témoignages de Patients',
          title: 'Des Histoires Vraies de Guérison & d\'Espoir',
          desc: 'Découvrez comment 10 ans d\'écoute et de dévouement ont permis à des centaines de familles de retrouver la santé et le sourire.',
          viewAllBtn: 'Lire Tous les Témoignages',
          saved: 'Protégé'
        },
        cta: {
          title: 'Besoin d\'un Conseil ou d\'un Avis Médical ?',
          desc: 'Contactez notre équipe attentionnée dès aujourd\'hui. Nous étudierons votre dossier gratuitement pour vous apporter des réponses claires et rassurantes.'
        }
      },
      footer: {
        tagline: 'Med360 est une entreprise détenue par l\'ONG Enn Rev Enn Sourir. 10+ ans d\'expérience à organiser des soins spécialisés en clinique privée et à l\'étranger. 100 % des bénéfices reversés à l\'ONG pour soigner les personnes dans le besoin.',
        quickLinks: 'Liens Rapides',
        services: 'Services',
        legal: 'Légal & Confidentialité',
        privacy: 'Politique de Confidentialité',
        terms: 'Conditions d\'Utilisation',
        rights: 'Tous droits réservés.',
        topSpecialties: 'Spécialités Médicales',
        specialtiesList: {
          cardiology: 'Cardiologie (Cœur)',
          oncology: 'Oncologie (Cancérologie)',
          orthopedics: 'Orthopédie (Os & Articulations)',
          neurology: 'Neurologie (Cerveau & Colonne)',
          transplant: 'Greffes d\'Organes',
          ivf: 'FIV & Fertilité'
        },
        freeOpinionDesc: 'Avis médical gratuit, confidentiel et accompagnement personnalisé. Chaque prise en charge aide l\'ONG Enn Rev Enn Sourir à soigner les plus démunis.',
        adminPortal: 'Portail Admin'
      },
      common: {
        viewAll: 'Voir Tout',
        getStarted: 'Commencer',
        explore: 'Découvrir',
        requestService: 'Demander ce Service',
      }
    }
  },
  kr: {
    translation: {
      nav: {
        about: 'Lor Nou',
        hospitals: 'Lopital Partener',
        specialties: 'Spesialite Medikal',
        doctors: 'Nou Bann Dokter',
        services: 'Nou Bann Servis',
        caseStudies: 'Temwagnaz',
        contact: 'Kontak Nou',
        admin: 'Portal Admin',
        whatsapp: 'WhatsApp',
        freeOpinion: 'Lavi Medikal Gratis',
      },
      home: {
        missionMarquee: "Med360 li enn lakonpanyi ki apartenir a l'ONG Enn Rev Enn Sourir. Depi plis ki 10 banlane nou pe ed bann pasian dan bezwin gagn akse a bann swen spesialize dan klinik prive ek a letranze. Nou elarzi nou servis pou tou dimounn — 100% profi retourn dan l'ONG pou kontinie swany bann ki pli vilnerab.",
        heroBadge: '✦ Apartenir a l\'ONG Enn Rev Enn Sourir · 10+ Banlane avek Leker',
        heroTitleLine1: 'Ou dan Bann Lamen',
        heroTitleLine2: 'Sikire & Konpreansif',
        heroSubtitle: 'Med360 apartenir a l\'ONG Enn Rev Enn Sourir. Apre 10 banlane kot nou finn gid bann pasian ver bann bon dokter dan klinik prive ek gran lopital a letranze, nou la pou akonpagn ou avek bon leker — 100% profi retourn dan l\'ONG pou pey swen bann pasian dan bezwin.',
        trustText: 'Plis ki 10 banlane led imaniter ek plis ki 1 200 pasian finn gagn tretman',
        stats: {
          patients: 'Pasian Akonpagne',
          hospitals: 'Lopital & Klinik Partener',
          savings: 'Banlane Eksperyans',
          countries: 'Pei Partener',
          satisfaction: '100% Profi pou l\'ONG',
        },
        specialties: {
          label: 'Swen Spesialize',
          title: 'Swen Medikal de Konfians pou Ou ek Ou Fami',
          desc: 'Gidans kler ek bon tretman dan tou gran domenn medikal, dan bann meyer klinik prive lokal ek gran lopital a letranze.',
          exploreBtn: 'Get Spesialite-La',
          viewAllBtn: 'Get Tou Spesialite'
        },
        process: {
          label: 'Kouma Nou Okip Ou',
          title: 'Ou Vwayaz Ver Gerizon an 4 Letap Sinp',
          desc: 'Depi premie kestion ziska ou retourn lakaz an bonn sante — nou res ar ou toulezour pou ou pa santi ou tousel.',
          step1: { title: 'Dir Nou Ou Sitiasion', desc: 'Eksplik nou ki pe arive ek partaz ou bann rapor medikal dan konfidansialite net.' },
          step2: { title: 'Lavi Dokter Gratis', desc: 'Bann bon dokter get ou dosie ek gid ou ver klinik ek sirizien ki pli adapte pou ou.' },
          step3: { title: 'Nou Okip Tou Net', desc: 'Randevou, viza medikal, biye avion, transpor ek lopital — ou pa gagn okenn traka.' },
          step4: { title: 'Tretman & Bon Rekiperasion', desc: 'Ou gagn enn bon akonpanyeman lor plas, e ou tretman ed pey swen pou enn fami dan bezwin.' },
          startBtn: 'Koumans Mo Vwayaz'
        },
        network: {
          label: 'Lopital Sikire',
          title: 'Klinik Prive & Lopital Akredite',
          desc: 'Tou bann lopital dan nou rezo ena sertifikasion o-nivo pou sekirite pasian, lizyenn ek bon laker bann infirmie.',
          viewAllBtn: 'Get Tou Lopital'
        },
        whyBadge: '✦ 10 Banlane Leritaz ONG avek Leker',
        whyTitle: 'Gran Kalite Swen. 100% pou Enn Bon Koz.',
        whyDesc: 'Med360 li apartenir a l\'ONG Enn Rev Enn Sourir. Pandan plis ki 10 banlane, nou lekip finn organiz bann loperasion pou bann pasian dan bezwin. Kan ou swazir Med360 pou ou swen, ou gagn enn bon soutien avek bann dokter de konfians, e tou profi al direk dan l\'ONG pou ed enn zanfan ouswa enn fami dan bezwin.',
        whyImageBadge: '✦ 100% Bann Profi Retourn dan ONG',
        aboutBtn: 'Dekouver Nou Zistwar',
        features: {
          jci: { title: '10+ Banlane Pre ar Bann Pasian', desc: 'Enn vre lexperyans imin dan gidans medikal, loperasion ek swivi gerizon.' },
          concierge: { title: 'Enn Zanmi Pre ar Ou', desc: 'Deziem lavi medikal gratis, viza, biye, kordonater lor plas ek swivi kan ou retourn lakaz.' },
          turnaround: { title: 'Dokter & Lopital Renome', desc: 'Akse direk ar bann sef sirizien dan Moris, L\'inde, Taylann ek lezot pei.' },
          caseManager: { title: 'Sak Roupi Ed Enn Malad', desc: '100% nou bann profi retourn dan l\'ONG Enn Rev Enn Sourir pou pey tretman bann ki dan bezwin.' },
        },
        cases: {
          label: 'Temwagnaz Pasian',
          title: 'Vre Zistwar Gerizon & Lespwar',
          desc: 'Dekouver kouma 10 banlane soutien ek devosion finn ed boukou fami retrouv lasante ek sourir.',
          viewAllBtn: 'Lir Tou Zistwar',
          saved: 'Proteze'
        },
        cta: {
          title: 'Bizin Enn Konsey ouswa Enn Lavi Dokter?',
          desc: 'Koz ar nou lekip zordi mem. Nou pou get ou dosie gratis pou donn ou bann repons kler ek trankilite despri.'
        }
      },
      footer: {
        tagline: 'Med360 li enn lakonpanyi ki apartenir a l\'ONG Enn Rev Enn Sourir. 10+ banlane pe kordonn bann swen spesialize dan klinik prive ek a letranze. 100% profi retourn dan l\'ONG pou swany bann ki dan bezwin.',
        quickLinks: 'Lien Rapid',
        services: 'Bann Servis',
        legal: 'Lalwa & Konfidansialite',
        privacy: 'Politik Konfidansialite',
        terms: 'Kondision Itilizasion',
        rights: 'Tou drwa rezerve.',
        topSpecialties: 'Bann Spesialite',
        specialtiesList: {
          cardiology: 'Kardiolizi (Leker)',
          oncology: 'Onkolizi (Kanser)',
          orthopedics: 'Ortopedi (Lezo & Zointir)',
          neurology: 'Neurolozi (Laservel & Kolonn)',
          transplant: 'Transplantasion',
          ivf: 'FIV & Fertilite'
        },
        freeOpinionDesc: 'Lavi medikal gratis, konfidansyel ek gidans personel. Sak vwayaz ed l\'ONG Enn Rev Enn Sourir swany bann pasian dan bezwin.',
        adminPortal: 'Portal Admin'
      },
      common: {
        viewAll: 'Get Tou',
        getStarted: 'Koumanse',
        explore: 'Dekouver',
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
