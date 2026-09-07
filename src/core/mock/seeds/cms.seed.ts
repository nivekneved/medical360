export interface CmsPage {
  id: string;
  title: string;
  category?: string;
  content: Record<string, any>;
}

export const cmsSeed: Record<string, CmsPage> = {
  header: {
    id: 'header',
    title: 'Header & Navigation',
    category: 'Global',
    content: {
      brandName: { en: 'Med360', fr: 'Med360', kr: 'Med360' },
      emergencyText: { en: 'Dedicated Patient Navigation', fr: 'Navigation Patient Dédiée', kr: 'Kordonasion Pasian Dedie' },
      phoneNumber: { en: '+230 5918 8275', fr: '+230 5918 8275', kr: '+230 5918 8275' },
      whatsAppText: { en: 'WhatsApp', fr: 'WhatsApp', kr: 'WhatsApp' },
      navAbout: { en: 'Our Story', fr: 'Notre Histoire', kr: 'Nou Zistwar' },
      navHospitals: { en: 'Hospitals', fr: 'Hôpitaux', kr: 'Lopital' },
      navSpecialties: { en: 'Specialties', fr: 'Spécialités', kr: 'Spesialite' },
      navHowItWorks: { en: 'How It Works', fr: 'Comment Ça Marche', kr: 'Kouma Li Mase' },
      navCalculator: { en: 'Cost Calculator', fr: 'Calculateur de Coûts', kr: 'Kalkilatris Pri' },
      navCaseStudies: { en: 'Patient Stories', fr: 'Témoignages', kr: 'Zistwar Pasian' },
      navContact: { en: 'Contact Us', fr: 'Contact', kr: 'Kontak' },
      navFreeOpinionBtn: { en: 'BOOK YOUR MEDICAL CONSULTATION', fr: 'RÉSERVER UNE CONSULTATION', kr: 'REZERV OU KONSILTASION' }
    }
  },
  home: {
    id: 'home',
    title: 'Home Page',
    category: 'Main Pages',
    content: {
      heroBadge: {
        en: '✦ Social Enterprise Initiative of Enn Rev Enn Sourir · +3,000 Patients',
        fr: '✦ Entreprise Sociale d\'Enn Rev Enn Sourir · +3 000 Patients',
        kr: '✦ Lakonpanyi Sosyal l\'ONG Enn Rev Enn Sourir · +3 000 Pasian'
      },
      heroTitleLine1: {
        en: 'World-Class Healthcare. Without the Wait.',
        fr: 'Des Soins de Classe Mondiale. Sans Attente.',
        kr: 'Swen Lasante Kalite. San Bizin Atann.'
      },
      heroTitleLine2: {
        en: 'With the Dignity You Deserve.',
        fr: 'Avec la Dignité que Vous Méritez.',
        kr: 'Avek Dignite ki Ou Merite.'
      },
      heroSubtitle: {
        en: 'Med360 facilitates access to established hospitals and specialist medical teams across India. From your first medical enquiry and specialist consultation to your treatment abroad and your return home.',
        fr: 'Med360 facilite l\'accès aux hôpitaux établis et aux équipes médicales spécialisées en Inde. De votre première demande médicale jusqu\'à vos soins à l\'étranger et votre retour à domicile.',
        kr: 'Med360 kordonn ou vwayaz lasante ver 15 gran lopital akredite dan L\'inde. Gagn lavi spesialis, estimasion pri kler ek akonpanyeman konple depi A a Z.'
      },
      heroPrimaryCta: {
        en: 'BOOK YOUR MEDICAL CONSULTATION',
        fr: 'RÉSERVER UNE CONSULTATION MÉDICALE',
        kr: 'REZERV OU KONSILTASION MEDIKAL'
      },
      heroSecondaryCta: {
        en: 'CHAT WITH US ON WHATSAPP',
        fr: 'DISCUTER SUR WHATSAPP',
        kr: 'KOZ AR NOU LOR WHATSAPP'
      },
      trustText: {
        en: '+3,000 Patients Assisted · UICC Member Network · No Dividends Model',
        fr: '+3 000 Patients Accompagnés · Membre Titulaire UICC · Modèle Sans Dividende',
        kr: '+3,000 Pasian Asiste · Manb UICC · Zero Dividann'
      },
      statPatients: { en: '+3,000 Patients Assisted', fr: '+3 000 Patients Accompagnés', kr: '+3,000 Pasian Asiste' },
      statHospitals: { en: '15 Premier Indian Hospitals', fr: '15 Hôpitaux Partenaires en Inde', kr: '15 Lopital Partener dan L\'inde' },
      statCountries: { en: '10+ Years of Compassion', fr: '10+ Années de Dévouement', kr: '10+ Banlane D\'experyans Imin' },
      statSatisfaction: { en: 'No Dividends · 100% Impact', fr: 'Zéro Dividende · Modèle Solidaire', kr: 'Zero Dividann · 100% Sosyal' },
      specialtiesLabel: { en: 'Medical Specialties', fr: 'Spécialités Médicales', kr: 'Spesialite Medikal' },
      specialtiesTitle: { en: 'Specialised Care Across Medical Disciplines', fr: 'Soins de Pointe à Travers Nos Spécialités Médicales', kr: 'Swen Avanse dan Bann Gran Spesialite Medikal' },
      specialtiesDesc: { en: 'Access experienced specialists, advanced diagnostics, and complex surgical procedures tailored to your medical condition.', fr: 'Accédez à des spécialistes renommés et aux technologies diagnostiques et chirurgicales de pointe adaptées à votre situation.', kr: 'Akse ar bann meyer spesialis ek teknolosi modern pou tou kalite tretman.' },
      specialtiesViewAllBtn: { en: 'View All Specialties', fr: 'Voir Toutes les Spécialités', kr: 'Get Tou Bann Spesialite' },
      exploreBtnText: { en: 'Explore Care & Procedures', fr: 'Découvrir les Actes & Soins', kr: 'Get Bann Tretman' },
      processLabel: { en: 'How It Works · 6-Step Journey', fr: 'Parcours Patient en 6 Étapes', kr: 'Parcours Pasian an 6 Letap' },
      processTitle: { en: 'Your Healthcare Journey, Made Simple', fr: 'Votre Parcours de Soins, Simple & Coordonné', kr: 'Ou Vwayaz Lasante, Sinp & Kordone' },
      processDesc: { en: 'Seeking medical treatment abroad can feel complicated. Med360 makes the journey easier by coordinating every step — from your first medical enquiry and specialist consultation to your treatment abroad and your return home.', fr: 'Se faire soigner à l\'étranger peut sembler complexe. Med360 facilite votre parcours en coordonnant chaque étape — de votre première demande médicale jusqu\'à vos soins à l\'étranger et votre retour à domicile.', kr: 'Al fer swen a letranze kapav paret konplike. Med360 rann ou vwayaz pli fasil par kordonn sak letap — depi premie lavi dokter ziska tretman ek retour lakaz.' },
      processStartBtn: { en: 'BOOK YOUR MEDICAL CONSULTATION', fr: 'RÉSERVER UNE CONSULTATION MÉDICALE', kr: 'REZERV OU KONSILTASION MEDIKAL' },
      networkLabel: { en: 'India Hospital Network', fr: 'Réseau Hospitalier en Inde', kr: 'Rezo Lopital dan L\'inde' },
      networkTitle: { en: 'Our Hospital Network at a Glance', fr: 'Notre Réseau Hospitalier en un Coup d\'Œil', kr: 'Nou Rezo Lopital dan L\'inde' },
      networkDesc: { en: 'Med360 facilitates access to established hospitals and specialist medical teams across India. Selection is based on individual medical requirements, accreditation, clinical expertise, and advanced technology.', fr: 'Med360 facilite l\'accès aux hôpitaux établis et aux équipes médicales spécialisées en Inde. La sélection hospitalière est basée sur les besoins médicaux individuels, l\'accréditation et l\'expertise clinique.', kr: 'Med360 fasilit akse ar bann gran lopital ek dokter dan L\'inde. Swazir lopital baze lor bezwin pasian ek akreditasion JCI/NABH.' },
      networkViewAllBtn: { en: 'Browse All 15 Partner Hospitals', fr: 'Découvrir les 15 Hôpitaux Partenaires', kr: 'Get Tou Bann 15 Lopital' },
      whyBadge: { en: '✦ Social Impact Model', fr: '✦ Modèle Social & Philosophie', kr: '✦ Antrepriz Sosyal' },
      whyTitle: { en: 'Born From a Decade of Compassion. Built Around the Patient.', fr: 'Né d\'une Décennie de Compassion. Centré sur le Patient.', kr: 'Ne depi 10 Banlane Konpasion. Santre lor Pasian.' },
      whyDesc: {
        en: 'Med360 is a social enterprise initiative of Enn Rev Enn Sourir. Patients who can afford their healthcare receive professional medical coordination → Med360 generates sustainable revenue → that revenue contributes to the social mission of Enn Rev Enn Sourir and helps support vulnerable patients.',
        fr: 'Med360 est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir. Les patients qui ont les moyens de financer leurs soins bénéficient d\'une coordination professionnelle → Med360 génère des revenus durables → ces revenus soutiennent les patients vulnérables d\'Enn Rev Enn Sourir.',
        kr: 'Med360 li enn linisiativ sosial l\'ONG Enn Rev Enn Sourir. Pasian ki kapav peye gagn kordonasion medikal profesyonel → Med360 kre reveni dirab pou ed bann pasian vilnerab.'
      },
      whyImageBadge: { en: 'No Dividends · 100% Impact', fr: 'Zéro Dividende · 100% Solidaire', kr: 'Zero Dividann · 100% Sosyal' },
      whyAboutBtn: { en: 'Read Our Story & Affiliations (UICC)', fr: 'Lire Notre Histoire & Nos Affiliations (UICC)', kr: 'Lir Nou Zistwar & Afiliasion (UICC)' },
      ctaTitle: {
        en: 'When Your Health Can’t Wait, Neither Should You.',
        fr: 'Quand Votre Santé Ne Peut Pas Attendre, Vous Non Plus.',
        kr: 'Kan Ou Lasante Pa Kapav Atann, Ou Osi Pa Bizin Atann.'
      },
      ctaDesc: {
        en: 'Speak to a Patient Navigator today and take the first step towards the care you need.',
        fr: 'Parlez à un Patient Navigator dès aujourd\'hui et faites le premier pas vers les soins dont vous avez besoin.',
        kr: 'Koz ar enn Patient Navigator zordi mem ek fer premie pa ver bann meyer swen.'
      },
      ctaPrimaryBtn: { en: 'BOOK YOUR MEDICAL CONSULTATION', fr: 'RÉSERVER UNE CONSULTATION MÉDICALE', kr: 'REZERV OU KONSILTASION MEDIKAL' },
      ctaWhatsAppBtn: { en: 'CHAT WITH US ON WHATSAPP', fr: 'DISCUTER SUR WHATSAPP', kr: 'KOZ AR NOU LOR WHATSAPP' }
    }
  },
  about: {
    id: 'about',
    title: 'About Page',
    category: 'Main Pages',
    content: {
      heroLabel: {
        en: '✦ Social Enterprise Initiative of Enn Rev Enn Sourir · +3,000 Patients',
        fr: '✦ Entreprise Sociale d\'Enn Rev Enn Sourir · +3 000 Patients',
        kr: '✦ Lakonpanyi Sosyal l\'ONG Enn Rev Enn Sourir · +3 000 Pasian'
      },
      heroTitle: {
        en: 'Our Story',
        fr: 'Notre Histoire',
        kr: 'Nou Zistwar'
      },
      heroDesc: {
        en: 'Born From a Decade of Compassion. Built Around the Patient. Med360 is a social enterprise initiative of Enn Rev Enn Sourir, created from years of experience supporting patients and families.',
        fr: 'Né d\'une décennie de compassion. Centré sur le patient. Med360 est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir, créée à partir d\'années d\'expérience dans l\'accompagnement des patients.',
        kr: 'Ne depi enn deseni konpasion. Santre lor pasian. Med360 li enn linisiativ antrepriz sosial l\'ONG Enn Rev Enn Sourir pou kordonn swen pasian avek dignite.'
      },
      missionLabel: {
        en: '✦ Genèse & Vocation',
        fr: '✦ Genèse & Vocation',
        kr: '✦ Nou Rasinn'
      },
      missionTitle: {
        en: 'Born From a Decade of Compassion. Built Around the Patient.',
        fr: 'Né d\'une Décennie de Compassion. Centré sur le Patient.',
        kr: 'Ne depi 10 Banlane Konpasion. Santre lor Pasian.'
      },
      missionP1: {
        en: 'Med360 is a social enterprise initiative of Enn Rev Enn Sourir, created from years of experience supporting patients and families through some of the most difficult moments of their lives.',
        fr: 'Med360 est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir, créée à partir d\'années d\'expérience dans l\'accompagnement des patients et de leurs familles.',
        kr: 'Med360 li enn linisiativ sosial l\'ONG Enn Rev Enn Sourir, ne depi plizir lane leksperyans pou sipor bann pasian ek fami.'
      },
      missionP2: {
        en: 'Since its establishment in 2016, Enn Rev Enn Sourir has worked to ensure that access to specialised healthcare is not determined by a family\'s financial circumstances.',
        fr: 'Depuis sa création en 2016, Enn Rev Enn Sourir s\'est employée à garantir que l\'accès aux soins de santé spécialisés ne dépende pas de la situation financière des familles.',
        kr: 'Depi so kreasion an 2016, Enn Rev Enn Sourir lite pou ki akse a swen spesialize pa depann lor mwayen finansie enn fami.'
      },
      ctaTitle: {
        en: 'Your Health Deserves Action, Not Uncertainty.',
        fr: 'Votre Santé Mérite l\'Action, Pas l\'Incertitude.',
        kr: 'Ou Lasante Merite Laksion, Pa Linzistis.'
      },
      ctaDesc: {
        en: 'Speak to a Patient Navigator today and take the first step towards the care you need.',
        fr: 'Parlez à un Patient Navigator dès aujourd\'hui et faites le premier pas vers les soins dont vous avez besoin.',
        kr: 'Koz ar enn Patient Navigator zordi mem ek fer premie pa ver bann meyer swen.'
      },
      ctaPrimaryBtn: { en: 'BOOK YOUR MEDICAL CONSULTATION', fr: 'RÉSERVER UNE CONSULTATION MÉDICALE', kr: 'REZERV OU KONSILTASION MEDIKAL' },
      ctaWhatsAppBtn: { en: 'CHAT WITH US ON WHATSAPP', fr: 'DISCUTER SUR WHATSAPP', kr: 'KOZ AR NOU LOR WHATSAPP' }
    }
  },
  'how-it-works': {
    id: 'how-it-works',
    title: 'How It Works Page',
    category: 'Main Pages',
    content: {
      heroLabel: {
        en: 'One Point of Contact · One Coordinated Journey',
        fr: 'Un Seul Point de Contact · Un Parcours Coordonné',
        kr: 'Enn Sel Kordonater · Enn Vwayaz Kordone'
      },
      heroTitle: {
        en: 'Your Healthcare Journey, Made Simple',
        fr: 'Votre Parcours de Soins, Simple & Coordonné',
        kr: 'Ou Vwayaz Lasante, Sinp & Kordone'
      },
      heroDesc: {
        en: 'Seeking medical treatment abroad can feel complicated. Med360 makes the journey easier by coordinating every step — from your first medical enquiry and specialist consultation to your treatment abroad and your return home.',
        fr: 'Se faire soigner à l\'étranger peut sembler complexe. Med360 facilite votre parcours en coordonnant chaque étape — de votre première demande médicale jusqu\'à vos soins à l\'étranger et votre retour à domicile.',
        kr: 'Al fer swen a letranze kapav paret konplike. Med360 rann ou vwayaz pli fasil par kordonn sak letap — depi premie lavi dokter ziska tretman ek retour lakaz.'
      },
      ctaTitle: {
        en: 'When Your Health Can’t Wait, Neither Should You.',
        fr: 'Quand Votre Santé Ne Peut Pas Attendre, Vous Non Plus.',
        kr: 'Kan Ou Lasante Pa Kapav Atann, Ou Osi Pa Bizin Atann.'
      },
      ctaDesc: {
        en: 'Speak to a Patient Navigator today and take the first step towards the care you need.',
        fr: 'Parlez à un Patient Navigator dès aujourd\'hui et faites le premier pas vers les soins dont vous avez besoin.',
        kr: 'Koz ar enn Patient Navigator zordi mem ek fer premie pa ver bann meyer swen.'
      },
      ctaPrimaryBtn: { en: 'BOOK YOUR MEDICAL CONSULTATION', fr: 'RÉSERVER UNE CONSULTATION MÉDICALE', kr: 'REZERV OU KONSILTASION MEDIKAL' },
      ctaWhatsAppBtn: { en: 'CHAT WITH US ON WHATSAPP', fr: 'DISCUTER SUR WHATSAPP', kr: 'KOZ AR NOU LOR WHATSAPP' }
    }
  },
  services: {
    id: 'services',
    title: 'How It Works / Services',
    category: 'Main Pages',
    content: {
      heroLabel: {
        en: 'One Point of Contact · One Coordinated Journey',
        fr: 'Un Seul Point de Contact · Un Parcours Coordonné',
        kr: 'Enn Sel Kordonater · Enn Vwayaz Kordone'
      },
      heroTitle: {
        en: 'Your Healthcare Journey, Made Simple',
        fr: 'Votre Parcours de Soins, Simple & Coordonné',
        kr: 'Ou Vwayaz Lasante, Sinp & Kordone'
      },
      heroDesc: {
        en: 'Seeking medical treatment abroad can feel complicated. Med360 makes the journey easier by coordinating every step — from your first medical enquiry and specialist consultation to your treatment abroad and your return home.',
        fr: 'Se faire soigner à l\'étranger peut sembler complexe. Med360 facilite votre parcours en coordonnant chaque étape — de votre première demande médicale jusqu\'à vos soins à l\'étranger et votre retour à domicile.',
        kr: 'Al fer swen a letranze kapav paret konplike. Med360 rann ou vwayaz pli fasil par kordonn sak letap — depi premie lavi dokter ziska tretman ek retour lakaz.'
      },
    }
  },
  hospitals: {
    id: 'hospitals',
    title: 'Hospitals Page',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: 'India Hospital Network',
        fr: 'Réseau Hospitalier en Inde',
        kr: 'Rezo Lopital dan L\'inde'
      },
      heroTitle: {
        en: 'Our Hospital Network at a Glance',
        fr: 'Notre Réseau Hospitalier en un Coup d\'Œil',
        kr: 'Nou Rezo Lopital dan L\'inde'
      },
      heroDesc: {
        en: 'Med360 facilitates access to established hospitals and specialist medical teams across India. Selection is based on individual medical requirements, accreditation, clinical expertise, and advanced technology.',
        fr: 'Med360 facilite l\'accès aux hôpitaux établis et aux équipes médicales spécialisées en Inde. La sélection hospitalière est basée sur les besoins médicaux individuels, l\'accréditation et l\'expertise clinique.',
        kr: 'Med360 fasilit akse ar bann gran lopital ek dokter dan L\'inde. Swazir lopital baze lor bezwin pasian ek akreditasion JCI/NABH.'
      },
      searchPlaceholder: {
        en: 'Search hospitals by name, city, or specialty...',
        fr: 'Rechercher des hôpitaux par nom, ville ou spécialité...',
        kr: 'Rod lopital par nom, lavil ouswa spesialite...'
      },
      filterAll: { en: 'All Hospitals', fr: 'Tous les Hôpitaux', kr: 'Tou Lopital' },
      filterAccredited: { en: 'JCI / NABH Accredited', fr: 'Accrédités JCI / NABH', kr: 'Akredite JCI / NABH' },
    }
  },
  specialties: {
    id: 'specialties',
    title: 'Specialties Page',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: 'Medical Specialties',
        fr: 'Spécialités Médicales',
        kr: 'Spesialite Medikal'
      },
      heroTitle: {
        en: 'Specialised Care Across Medical Disciplines',
        fr: 'Soins de Pointe à Travers Nos Spécialités Médicales',
        kr: 'Swen Avanse dan Bann Gran Spesialite Medikal'
      },
      heroDesc: {
        en: 'Access experienced specialists, advanced diagnostics, and complex surgical procedures tailored to your medical condition.',
        fr: 'Accédez à des spécialistes renommés et aux technologies diagnostiques et chirurgicales de pointe adaptées à votre situation.',
        kr: 'Akse ar bann meyer spesialis ek teknolosi modern pou tou kalite tretman.'
      },
      searchPlaceholder: {
        en: 'Search by specialty name or medical condition...',
        fr: 'Rechercher par nom de spécialité ou pathologie...',
        kr: 'Rod par nom spesialite ouswa maladi...'
      }
    }
  },
  'cost-calculator': {
    id: 'cost-calculator',
    title: 'Cost Calculator Page',
    category: 'Main Pages',
    content: {
      heroLabel: {
        en: 'Clear & Transparent Treatment Costs',
        fr: 'Transparence & Estimation des Coûts',
        kr: 'Pri Kler & San Sipriz'
      },
      heroTitle: {
        en: 'Understand & Estimate Your Treatment Costs',
        fr: 'Estimer le Coût de Vos Soins en Toute Clarté',
        kr: 'Konn Pri Ou Tretman an Tout Trankilite'
      },
      heroDesc: {
        en: 'We believe in honest, clear pricing with no hidden costs. Explore realistic treatment estimates across accredited partner hospitals so you and your family can plan with complete peace of mind.',
        fr: 'Nous croyons en une totale transparence, sans mauvaise surprise. Obtenez une estimation claire et réaliste des coûts dans nos hôpitaux partenaires pour préparer vos soins l\'esprit tranquille.',
        kr: 'Nou krwar dan enn transparans total san okenn fre kasiet. Get bann pri estimatif pou planifie ou tretman ek rekiperasion an tout trankilite.'
      }
    }
  },
  'case-studies': {
    id: 'case-studies',
    title: 'Patient Stories / Case Studies',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: 'Real Patient Stories · Verified Recovery Outcomes',
        fr: 'Témoignages Réels · Résultats Cliniques Vérifiés',
        kr: 'Temwagnaz Pasian · Vre Rezilta Geri'
      },
      heroTitle: {
        en: 'Lives Changed, Hope Restored',
        fr: 'Des Vies Transformées, l\'Espoir Retrouvé',
        kr: 'Lavi Sanze, Lespwar Rekonstrui'
      },
      heroDesc: {
        en: 'Read real stories from patients across Mauritius and the Indian Ocean who received specialized care through our hospital network.',
        fr: 'Découvrez les témoignages réels de patients mauriciens et de l\'océan Indien ayant bénéficié de soins spécialisés dans nos hôpitaux partenaires.',
        kr: 'Dekouver zistwar bann pasian Morisien ek Losean Indien ki finn gagn swen spesialize dan nou bann lopital partener.'
      }
    }
  },
  contact: {
    id: 'contact',
    title: 'Contact Page',
    category: 'Main Pages',
    content: {
      heroLabel: {
        en: '✦ Contact Us · Dedicated Patient Navigation',
        fr: '✦ Contactez Notre Équipe de Navigation Patient',
        kr: '✦ Pran Kontak ar Nou Lekip Patient Navigator'
      },
      heroTitle: {
        en: 'When Your Health Can’t Wait, Neither Should You.',
        fr: 'Quand Votre Santé Ne Peut Pas Attendre, Vous Non Plus.',
        kr: 'Kan Ou Lasante Pa Kapav Atann, Ou Osi Pa Bizin Atann.'
      },
      heroDesc: {
        en: 'Facing a diagnosis or considering treatment abroad can bring many questions. You don\'t have to navigate the journey alone. Whether you are looking for a second medical opinion, specialist consultation, treatment abroad, hospital recommendation or complete medical travel assistance, the Med360 team is ready to listen, understand your needs and guide you towards the next step.',
        fr: 'Faire face à un diagnostic ou envisager un traitement à l\'étranger soulève de nombreuses questions. Vous n\'avez pas à parcourir ce chemin seul. L\'équipe de Med360 est prête à vous écouter et vous guider vers la prochaine étape.',
        kr: 'Gagn enn diagnostik ouswa pans al swanye a letranze amenn boukou kestion. Ou pa tousel dan sa vwayaz la. Lekip Med360 pre pou ekout ou ek gid ou.'
      },
      reachUsTitle: {
        en: 'Get in Touch',
        fr: 'Prendre Contact (Get in Touch)',
        kr: 'Pran Kontak'
      },
      officeAddress: {
        en: 'Med360, Sedeco Ltée, 4ème étage, IKS Building, Cnr R. Seeneevassen & Farquhar Streets, Port-Louis 11613, Mauritius',
        fr: 'Med360, Sedeco Ltée, 4ème étage, IKS Building, Cnr R. Seeneevassen & Farquhar Streets, Port-Louis 11613, Maurice',
        kr: 'Med360, Sedeco Ltée, 4ème étage, IKS Building, Cnr R. Seeneevassen & Farquhar Streets, Port-Louis 11613, Moris'
      },
      hoursText: {
        en: 'Monday – Saturday: 8:00 AM – 7:00 PM (MUT)\nWhatsApp helpline active 7 days a week',
        fr: 'Lundi – Samedi : 08h00 – 19h00 (MUT)\nService d\'astreinte WhatsApp actif 7j/7',
        kr: 'Lindi - Samdi: 08:00 - 19:00 (MUT)\nWhatsApp ouver 7 zour lor 7'
      },
      emailAddress: {
        en: 'info@med360.mu',
        fr: 'info@med360.mu',
        kr: 'info@med360.mu'
      },
      phoneNumber: {
        en: '+230 5918 8275',
        fr: '+230 5918 8275',
        kr: '+230 5918 8275'
      },
    }
  },
  'describe-need': {
    id: 'describe-need',
    title: 'Intake Wizard Page',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: '✦ Free Medical Assessment & Second Opinion',
        fr: '✦ Évaluation Médicale Gratuite & Deuxième Avis',
        kr: '✦ Estimasion Medikal Gratis & Deziem Lavi'
      },
      heroTitle: {
        en: 'Tell Us About Your Medical Needs',
        fr: 'Faites-nous Part de Vos Besoins Médicaux',
        kr: 'Dekrir Ou Bann Bezwin Medikal'
      },
      heroDesc: {
        en: 'Share your medical situation with our team. We will review your case with appropriate medical specialists across our accredited hospital network and guide you on the next steps.',
        fr: 'Partagez votre situation médicale avec notre équipe. Nous étudierons votre dossier avec les spécialistes appropriés de nos hôpitaux partenaires et vous guiderons sur les prochaines étapes.',
        kr: 'Partaz ou sitiasion medikal avek nou lekip. Nou pou etidie ou dosie ar bann dokter spesialis dan nou rezo lopital.'
      }
    }
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy Page',
    category: 'Legal',
    content: {
      heroTitle: {
        en: 'Privacy & Data Protection Policy',
        fr: 'Politique de Confidentialité & Protection des Données',
        kr: 'Politis Konfidansialite & Proteksion Done'
      },
      heroDesc: {
        en: 'Our commitment to safeguarding your sensitive medical data under the Mauritius Data Protection Act 2017 and international healthcare privacy standards.',
        fr: 'Notre engagement pour la protection de vos données médicales confidentielles conformément au Data Protection Act 2017 de Maurice et aux normes internationales.',
        kr: 'Nou langazman pou protez ou bann done medikal prive dapre Data Protection Act 2017 Moris ek bann lalwa internasional.'
      },
      lastUpdated: {
        en: 'Last Updated: 2026',
        fr: 'Dernière mise à jour : 2026',
        kr: 'Dernie miz-a-zour : 2026'
      },
    }
  },
  terms: {
    id: 'terms',
    title: 'Terms of Service Page',
    category: 'Legal',
    content: {
      heroTitle: {
        en: 'Terms & Conditions of Service',
        fr: 'Conditions Générales d\'Utilisation & de Facilitation',
        kr: 'Kondision Zeneral Servis & Fasilitasion'
      },
      heroDesc: {
        en: 'Important terms and conditions governing medical facilitation services provided by Med360 in Mauritius (social enterprise of NGO Enn Rev Enn Sourir).',
        fr: 'Conditions régissant les services de facilitation médicale fournis par Med360 à l\'Île Maurice (entreprise sociale de l\'ONG Enn Rev Enn Sourir).',
        kr: 'Bann kondision konsernan bann servis fasilitasion medikal par Med360 dan Moris (antrepriz sosial l\'ONG Enn Rev Enn Sourir).'
      },
      lastUpdated: {
        en: 'Last Updated: 2026',
        fr: 'Dernière mise à jour : 2026',
        kr: 'Dernie miz-a-zour : 2026'
      },
    }
  },
  cookies: {
    id: 'cookies',
    title: 'Cookie Policy Page',
    category: 'Legal',
    content: {
      heroTitle: {
        en: 'Cookie Policy',
        fr: 'Politique Relative aux Cookies',
        kr: 'Politis Bann Cookies'
      },
      heroDesc: {
        en: 'Information on how Med360 uses cookies and local storage to provide a seamless and secure healthcare navigation experience.',
        fr: 'Informations sur l\'utilisation des cookies et du stockage local par Med360 pour garantir une expérience sécurisée et fluide.',
        kr: 'Linformasion lor kouma Med360 servi cookies ek memwar lokal pou enn leksperyans sekirize ek efikas.'
      }
    }
  },
  'medical-disclaimer': {
    id: 'medical-disclaimer',
    title: 'Medical Disclaimer Page',
    category: 'Legal',
    content: {
      heroTitle: {
        en: 'Medical & Legal Disclaimer',
        fr: 'Avertissement Médical & Juridique',
        kr: 'Avertisman Medikal & Legal'
      },
      heroDesc: {
        en: 'Important information regarding the scope of Med360 concierge coordination and non-diagnostic medical facilitation services.',
        fr: 'Informations importantes concernant le rôle de coordination et de facilitation médicale non-diagnostique de Med360.',
        kr: 'Linformasion inportan konsernan rol kordonasion ek fasilitasion medikal non-medsen par Med360.'
      }
    }
  },
  footer: {
    id: 'footer',
    title: 'Footer & Legal',
    category: 'Global',
    content: {
      tagline: {
        en: 'Med360 is a social enterprise initiative of Enn Rev Enn Sourir. From Mauritius to your treatment — we\'re with you every step of the way.',
        fr: 'Med360 est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir. De Maurice à votre traitement — à vos côtés à chaque étape.',
        kr: 'Med360 li enn linisiativ sosial l\'ONG Enn Rev Enn Sourir. Depi Moris ziska ou tretman — nou ar ou sak letap.'
      },
      copyrightText: {
        en: 'Med360. All rights reserved. Social Enterprise Initiative of Enn Rev Enn Sourir.',
        fr: 'Med360. Tous droits réservés. Initiative d\'Entreprise Sociale d\'Enn Rev Enn Sourir.',
        kr: 'Med360. Tou drwa rezerve. Linisiativ Antrepriz Sosyal l\'ONG Enn Rev Enn Sourir.'
      },
      disclaimer: {
        en: 'Med360 follows a No Dividends philosophy. Patients who can afford their healthcare receive professional medical coordination → Med360 generates sustainable revenue → that revenue contributes to the social mission of Enn Rev Enn Sourir and helps support vulnerable patients.',
        fr: 'Med360 applique une politique stricte sans dividende. Les revenus générés par la conciergerie soutiennent directement la mission d\'Enn Rev Enn Sourir pour soigner les patients vulnérables.',
        kr: 'Med360 swiv model Zero Dividann. Reveni ki gagne al direkteman dan l\'ONG Enn Rev Enn Sourir pou pey swen bann pasian vilnerab.'
      },
      servicesTitle: { en: 'Our Services', fr: 'Nos Services', kr: 'Nou Bann Servis' },
      quickLinksTitle: { en: 'Quick Links', fr: 'Liens Rapides', kr: 'Bann Lien Rapid' },
      legalTitle: { en: 'Legal & Trust', fr: 'Légal & Sécurité', kr: 'Legal & Sekirite' },
      contactTitle: { en: 'Contact Concierge', fr: 'Contacter la Conciergerie', kr: 'Kontak Konzierz' }
    }
  },
  marquee: {
    id: 'marquee',
    title: 'Scrolling Text & Mission Banner',
    category: 'Global',
    content: {
      enabled: 'true',
      position: 'above',
      speedSeconds: '45',
      badgeText: {
        en: 'Med360',
        fr: 'Med360',
        kr: 'Med360',
      },
      messageText: {
        en: "Med360 is a social enterprise initiative of Enn Rev Enn Sourir. Patients who can afford their healthcare receive professional, personalised medical coordination → Med360 generates sustainable revenue → that revenue contributes to the social mission of Enn Rev Enn Sourir and helps support vulnerable patients. No dividends. No compromise on dignity. Patient first. Always.",
        fr: "Med360 est une initiative d'entreprise sociale d'Enn Rev Enn Sourir. Les patients qui ont les moyens de financer leurs soins bénéficient d'une coordination médicale professionnelle et personnalisée → Med360 génère des revenus durables → ces revenus contribuent à la mission sociale d'Enn Rev Enn Sourir et soutiennent les patients vulnérables. Zéro dividende. Aucun compromis sur la dignité. Le patient d'abord. Toujours.",
        kr: "Med360 li enn linisiativ sosial l'ONG Enn Rev Enn Sourir. Pasian ki kapav peye gagn kordonasion medikal profesyonel → Med360 kre reveni dirab pou ed bann pasian vilnerab. Zero dividann. Oken konpromi lor dignite. Pasian avan tou. Touzour.",
      },
      linkUrl: {
        en: '/about',
        fr: '/about',
        kr: '/about',
      },
      linkLabel: {
        en: 'Learn More',
        fr: 'En savoir plus',
        kr: 'Dekouver Plis',
      },
    }
  }
};
