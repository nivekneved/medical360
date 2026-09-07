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
      brandName: { en: 'Medical', fr: 'Medical', kr: 'Medical' },
      brandSuffix: { en: '360', fr: '360', kr: '360' },
      emergencyText: { en: 'Dedicated Patient Navigation', fr: 'Navigation Patient Dédiée', kr: 'Kordonasion Pasian Dedie' },
      phoneNumber: { en: '+230 5918 8275', fr: '+230 5918 8275', kr: '+230 5918 8275' },
      whatsAppText: { en: 'WhatsApp Us', fr: 'WhatsApp', kr: 'WhatsApp Nou' },
      navAbout: { en: 'Our Story', fr: 'Notre Histoire', kr: 'Nou Zistwar' },
      navHospitals: { en: 'Hospitals', fr: 'Hôpitaux', kr: 'Lopital' },
      navSpecialties: { en: 'Specialties', fr: 'Spécialités', kr: 'Spesialite' },
      navDoctors: { en: 'Specialists', fr: 'Médecins', kr: 'Bann Dokter' },
      navServices: { en: 'How It Works', fr: 'Comment Ça Marche', kr: 'Kouma Li Mase' },
      navCaseStudies: { en: 'Patient Stories', fr: 'Témoignages', kr: 'Zistwar Pasian' },
      navCalculator: { en: 'Cost Calculator', fr: 'Calculateur', kr: 'Kalkilatris' },
      navVisa: { en: 'Visa Guide', fr: 'Guide Visa', kr: 'Gid Viza' },
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
        en: '✦ Social Enterprise Initiative of Enn Rev Enn Sourir',
        fr: '✦ Initiative d\'Entreprise Sociale · Enn Rev Enn Sourir',
        kr: '✦ Antrepriz Sosyal · Enn Rev Enn Sourir'
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
        en: 'Medical 360 facilitates access to established hospitals and specialist medical teams across India. From your first medical enquiry and specialist consultation to your treatment abroad and your return home.',
        fr: 'Medical 360 facilite l\'accès aux hôpitaux établis et aux équipes médicales spécialisées en Inde. De votre première demande médicale jusqu\'à vos soins à l\'étranger et votre retour à domicile.',
        kr: 'Medical 360 kordonn ou vwayaz lasante ver 15 gran lopital akredite dan L\'inde. Gagn lavi spesialis, estimasion pri kler ek akonpanyeman konple depi A a Z.'
      },
      heroPrimaryCta: {
        en: 'BOOK YOUR MEDICAL CONSULTATION',
        fr: 'RÉSERVER VOTRE CONSULTATION MÉDICALE',
        kr: 'REZERV OU KONSILTASION MEDIKAL'
      },
      heroSecondaryCta: {
        en: 'CHAT WITH US ON WHATSAPP',
        fr: 'DISCUTER SUR WHATSAPP',
        kr: 'KOZ AR NOU LOR WHATSAPP'
      },
      heroBannerImage: {
        en: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80',
        fr: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80',
        kr: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80'
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
      specialtiesTitle: { en: 'Specialised Care Across Medical Disciplines', fr: 'Soins de Pointe à Travers Nos Spécialités', kr: 'Swen Avanse dan Bann Gran Spesialite Medikal' },
      specialtiesDesc: { en: 'Access experienced specialists, advanced diagnostics, and complex surgical procedures tailored to your medical condition.', fr: 'Accédez à des spécialistes renommés et aux technologies diagnostiques et chirurgicales de pointe adaptées à votre situation.', kr: 'Akse ar bann meyer spesialis ek teknolosi modern pou tou kalite tretman.' },
      specialtiesViewAllBtn: { en: 'View All Specialties', fr: 'Voir Toutes les Spécialités', kr: 'Get Tou Bann Spesialite' },
      exploreBtnText: { en: 'Explore Care & Procedures', fr: 'Découvrir les Actes & Soins', kr: 'Get Bann Tretman' },
      processLabel: { en: 'How It Works · 6-Step Journey', fr: 'Parcours Patient en 6 Étapes', kr: 'Parcours Pasian an 6 Letap' },
      processTitle: { en: 'Your Healthcare Journey, Made Simple', fr: 'Votre Parcours de Soins, Simple & Coordonné', kr: 'Ou Vwayaz Lasante, Sinp & Kordone' },
      processDesc: { en: 'Seeking medical treatment abroad can feel complicated. Medical 360 makes the journey easier by coordinating every step — from your first medical enquiry and specialist consultation to your treatment abroad and your return home.', fr: 'Se faire soigner à l\'étranger peut sembler complexe. Medical 360 facilite votre parcours en coordonnant chaque étape — de votre première demande médicale jusqu\'à vos soins à l\'étranger et votre retour à domicile.', kr: 'Al fer swen a letranze kapav paret konplike. Medical 360 rann ou vwayaz pli fasil par kordonn sak letap — depi premie lavi dokter ziska tretman ek retour lakaz.' },
      processStartBtn: { en: 'BOOK YOUR MEDICAL CONSULTATION', fr: 'RÉSERVER VOTRE CONSULTATION MÉDICALE', kr: 'REZERV OU KONSILTASION MEDIKAL' },
      networkLabel: { en: 'India Hospital Network', fr: 'Réseau Hospitalier en Inde', kr: 'Rezo Lopital dan L\'inde' },
      networkTitle: { en: 'Our Hospital Network at a Glance', fr: 'Notre Réseau Hospitalier en un Coup d\'Œil', kr: 'Nou Rezo Lopital dan L\'inde' },
      networkDesc: { en: 'Medical 360 facilitates access to established hospitals and specialist medical teams across India. Selection is based on individual medical requirements, accreditation, clinical expertise, and advanced technology.', fr: 'Medical 360 facilite l\'accès aux hôpitaux établis et aux équipes médicales spécialisées en Inde. La sélection hospitalière est basée sur les besoins médicaux individuels, l\'accréditation et l\'expertise clinique.', kr: 'Medical 360 fasilit akse ar bann gran lopital ek dokter dan L\'inde. Swazir lopital baze lor bezwin pasian ek akreditasion JCI/NABH.' },
      networkViewAllBtn: { en: 'Browse All 15 Partner Hospitals', fr: 'Découvrir les 15 Hôpitaux Partenaires', kr: 'Get Tou Bann 15 Lopital' },
      whyBadge: { en: '✦ Social Impact Model', fr: '✦ Modèle Social & Philosophie', kr: '✦ Antrepriz Sosyal' },
      whyTitle: { en: 'Born From a Decade of Compassion. Built Around the Patient.', fr: 'Né d\'une Décennie de Compassion. Centré sur le Patient.', kr: 'Ne depi 10 Banlane Konpasion. Santre lor Pasian.' },
      whyDesc: {
        en: 'Medical 360 Ltd is a social enterprise initiative of Enn Rev Enn Sourir. Patients who can afford their healthcare receive professional medical coordination → Medical 360 generates sustainable revenue → that revenue contributes to the social mission of Enn Rev Enn Sourir and helps support vulnerable patients.',
        fr: 'Medical 360 Ltd est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir. Les patients qui ont les moyens de financer leurs soins bénéficient d\'une coordination professionnelle → Medical 360 génère des revenus durables → ces revenus soutiennent les patients vulnérables d\'Enn Rev Enn Sourir.',
        kr: 'Medical 360 li enn linisiativ sosial l\'ONG Enn Rev Enn Sourir. Pasian ki kapav peye gagn kordonasion medikal profesyonel → Medical 360 kre reveni dirab pou ed bann pasian vilnerab.'
      },
      whyImageBadge: { en: 'No Dividends · 100% Impact', fr: 'Zéro Dividende · 100% Solidaire', kr: 'Zero Dividann · 100% Sosyal' },
      whyAboutBtn: { en: 'Read Our Story & Affiliations (UICC)', fr: 'Lire Notre Histoire & Nos Affiliations (UICC)', kr: 'Lir Nou Zistwar & Afiliasion (UICC)' },
      ctaTitle: {
        en: 'Your Health Deserves Action, Not Uncertainty.',
        fr: 'Votre Santé Mérite l\'Action, Pas l\'Incertitude.',
        kr: 'Ou Lasante Merite Laksion, Pa Linzistis.'
      },
      ctaDesc: {
        en: 'Book your appointment today. Let us help you understand your options and connect you with the right medical care.',
        fr: 'Prenez rendez-vous dès aujourd\'hui. Laissez-nous vous aider à comprendre vos options et vous mettre en relation avec les soins médicaux appropriés.',
        kr: 'Pran ou randevou zordi mem. Les nou ed ou konpran ou bann opsion ek konekte ou ar bann meyer swen medikal.'
      },
      ctaPrimaryBtn: { en: 'BOOK YOUR MEDICAL CONSULTATION', fr: 'RÉSERVER VOTRE CONSULTATION MÉDICALE', kr: 'REZERV OU KONSILTASION MEDIKAL' },
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
        en: 'Born From a Decade of Compassion. Built Around the Patient. Medical 360 Ltd is a social enterprise initiative of Enn Rev Enn Sourir, created from years of experience supporting patients and families through some of the most difficult moments of their lives.',
        fr: 'Né d\'une décennie de compassion. Centré sur le patient. Medical 360 Ltd est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir, créée à partir d\'années d\'expérience dans l\'accompagnement des patients.',
        kr: 'Ne depi enn deseni konpasion. Santre lor pasian. Medical 360 Ltd li enn linisiativ antrepriz sosial l\'ONG Enn Rev Enn Sourir pou kordonn swen pasian avek dignite.'
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
        en: 'Medical 360 Ltd is a social enterprise initiative of Enn Rev Enn Sourir, created from years of experience supporting patients and families through some of the most difficult moments of their lives.',
        fr: 'Medical 360 Ltd est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir, créée à partir d\'années d\'expérience dans l\'accompagnement des patients et de leurs familles.',
        kr: 'Medical 360 Ltd li enn linisiativ sosial l\'ONG Enn Rev Enn Sourir, ne depi plizir lane leksperyans pou sipor bann pasian ek fami.'
      },
      missionP2: {
        en: 'Since its establishment in 2016, Enn Rev Enn Sourir has worked to ensure that access to specialised healthcare is not determined by a family\'s financial circumstances. The organisation has supported children and adults requiring specialised medical care in Mauritius and abroad, including medical coordination, treatment access, financial assistance, travel arrangements and psychosocial support. This patient-centred mission is also reflected in the NGO\'s public and international profiles. (UICC)',
        fr: 'Depuis sa création en 2016, Enn Rev Enn Sourir s\'est employée à garantir que l\'accès aux soins de santé spécialisés ne dépende pas de la situation financière des familles.',
        kr: 'Depi so kreasion an 2016, Enn Rev Enn Sourir lite pou ki akse a swen spesialize pa depann lor mwayen finansie enn fami.'
      },
      ctaTitle: {
        en: 'Your Health Deserves Action, Not Uncertainty.',
        fr: 'Votre Santé Mérite l\'Action, Pas l\'Incertitude.',
        kr: 'Ou Lasante Merite Laksion, Pa Linzistis.'
      },
      ctaDesc: {
        en: 'Book your appointment today. Let us help you understand your options and connect you with the right medical care.',
        fr: 'Prenez rendez-vous dès aujourd\'hui. Laissez-nous vous aider à comprendre vos options et vous mettre en relation avec les soins médicaux appropriés.',
        kr: 'Pran ou randevou zordi mem. Les nou ed ou konpran ou bann opsion ek konekte ou ar bann meyer swen medikal.'
      },
      ctaPrimaryBtn: { en: 'BOOK YOUR MEDICAL CONSULTATION', fr: 'RÉSERVER VOTRE CONSULTATION MÉDICALE', kr: 'REZERV OU KONSILTASION MEDIKAL' },
      ctaWhatsAppBtn: { en: 'CHAT WITH US ON WHATSAPP', fr: 'DISCUTER SUR WHATSAPP', kr: 'KOZ AR NOU LOR WHATSAPP' }
    }
  },
  services: {
    id: 'services',
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
        en: 'Seeking medical treatment abroad can feel complicated. Medical 360 makes the journey easier by coordinating every step — from your first medical enquiry and specialist consultation to your treatment abroad and your return home.',
        fr: 'Se faire soigner à l\'étranger peut sembler complexe. Medical 360 facilite votre parcours en coordonnant chaque étape — de votre première demande médicale jusqu\'à votre traitement à l\'étranger et votre retour à domicile.',
        kr: 'Al fer swen a letranze kapav paret konplike. Medical 360 rann ou vwayaz pli fasil par kordonn sak letap — depi premie lavi dokter ziska tretman ek retour lakaz.'
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
        en: 'Medical 360 facilitates access to established hospitals and specialist medical teams across India. Selection is based on individual medical requirements, accreditation, clinical expertise, and advanced technology.',
        fr: 'Medical 360 facilite l\'accès aux hôpitaux établis et aux équipes médicales spécialisées en Inde. La sélection hospitalière est basée sur les besoins médicaux individuels et l\'accréditation internationale.',
        kr: 'Medical 360 fasilit akse ar bann gran lopital ek dokter dan L\'inde. Swazir lopital baze lor bezwin pasian ek akreditasion JCI/NABH.'
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
        en: 'Access comprehensive care from advanced diagnostics and second opinions to chemotherapy, complex surgery, and rehabilitation.',
        fr: 'Accédez à des soins complets, des diagnostics avancés aux deuxièmes avis, chirurgies complexes et rééducation.',
        kr: 'Gagn akse ar bann swen konple, depi test avanse ziska deziem lavi, sirirzi konplex ek re-abilitasion.'
      },
      searchPlaceholder: {
        en: 'Search by specialty name or medical condition...',
        fr: 'Rechercher par nom de spécialité ou pathologie...',
        kr: 'Rod par nom spesialite ouswa maladi...'
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
        en: 'Facing a diagnosis or considering treatment abroad can bring many questions. You don\'t have to navigate the journey alone. Whether you are looking for a second medical opinion, specialist consultation, treatment abroad, hospital recommendation or complete medical travel assistance, the Medical 360 team is ready to listen, understand your needs and guide you towards the next step.',
        fr: 'Faire face à un diagnostic ou envisager un traitement à l\'étranger soulève de nombreuses questions. Vous n\'avez pas à parcourir ce chemin seul. L\'équipe de Medical 360 est prête à vous écouter et vous guider vers la prochaine étape.',
        kr: 'Gagn enn diagnostik ouswa pans al swanye a letranze amenn boukou kestion. Ou pa tousel dan sa vwayaz la. Lekip Medical 360 pre pou ekout ou ek gid ou.'
      },
      reachUsTitle: {
        en: 'Get in Touch',
        fr: 'Prendre Contact',
        kr: 'Pran Kontak'
      },
      officeAddress: {
        en: 'Medical 360 Ltd, Sedeco Ltée, 4ème étage, IKS Building, Cnr R. Seeneevassen & Farquhar Streets, Port-Louis 11613, Mauritius',
        fr: 'Medical 360 Ltd, Sedeco Ltée, 4ème étage, IKS Building, Cnr R. Seeneevassen & Farquhar Streets, Port-Louis 11613, Maurice',
        kr: 'Medical 360 Ltd, Sedeco Ltée, 4ème étage, IKS Building, Cnr R. Seeneevassen & Farquhar Streets, Port-Louis 11613, Moris'
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
        en: 'Important terms and conditions governing medical facilitation services provided by Medical 360 Ltd in Mauritius (social enterprise of NGO Enn Rev Enn Sourir).',
        fr: 'Conditions régissant les services de facilitation médicale fournis par Medical 360 Ltd à l\'Île Maurice (entreprise sociale de l\'ONG Enn Rev Enn Sourir).',
        kr: 'Bann kondision konsernan bann servis fasilitasion medikal par Medical 360 Ltd dan Moris (antrepriz sosial l\'ONG Enn Rev Enn Sourir).'
      },
      lastUpdated: {
        en: 'Last Updated: 2026',
        fr: 'Dernière mise à jour : 2026',
        kr: 'Dernie miz-a-zour : 2026'
      },
    }
  },
  footer: {
    id: 'footer',
    title: 'Footer & Legal',
    category: 'Global',
    content: {
      tagline: {
        en: 'Medical 360 Ltd is a social enterprise initiative of Enn Rev Enn Sourir. From Mauritius to your treatment — we\'re with you every step of the way.',
        fr: 'Medical 360 Ltd est une initiative d\'entreprise sociale d\'Enn Rev Enn Sourir. De Maurice à votre traitement — à vos côtés à chaque étape.',
        kr: 'Medical 360 Ltd li enn linisiativ sosial l\'ONG Enn Rev Enn Sourir. Depi Moris ziska ou tretman — nou ar ou sak letap.'
      },
      copyrightText: {
        en: 'Medical 360 Ltd. All rights reserved. Social Enterprise Initiative of Enn Rev Enn Sourir.',
        fr: 'Medical 360 Ltd. Tous droits réservés. Initiative d\'Entreprise Sociale d\'Enn Rev Enn Sourir.',
        kr: 'Medical 360 Ltd. Tou drwa rezerve. Linisiativ Antrepriz Sosyal l\'ONG Enn Rev Enn Sourir.'
      },
      disclaimer: {
        en: 'Medical 360 follows a No Dividends philosophy. Patients who can afford their healthcare receive professional medical coordination → Medical 360 generates sustainable revenue → that revenue contributes to the social mission of Enn Rev Enn Sourir and helps support vulnerable patients.',
        fr: 'Medical 360 applique une politique stricte sans dividende. Les revenus générés par la conciergerie soutiennent directement la mission d\'Enn Rev Enn Sourir pour soigner les patients vulnérables.',
        kr: 'Medical 360 swiv model Zero Dividann. Reveni ki gagne al direkteman dan l\'ONG Enn Rev Enn Sourir pou pey swen bann pasian vilnerab.'
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
        en: 'Medical 360 Ltd',
        fr: 'Medical 360 Ltd',
        kr: 'Medical 360 Ltd',
      },
      messageText: {
        en: "Medical 360 Ltd is a social enterprise initiative of Enn Rev Enn Sourir. Patients who can afford their healthcare receive professional, personalised medical coordination → Medical 360 generates sustainable revenue → that revenue contributes to the social mission of Enn Rev Enn Sourir and helps support vulnerable patients. No dividends. No compromise on dignity. Patient first. Always.",
        fr: "Medical 360 Ltd est une initiative d'entreprise sociale d'Enn Rev Enn Sourir. Les patients qui ont les moyens de financer leurs soins bénéficient d'une coordination médicale professionnelle et personnalisée → Medical 360 génère des revenus durables → ces revenus contribuent à la mission sociale d'Enn Rev Enn Sourir et soutiennent les patients vulnérables. Zéro dividende. Aucun compromis sur la dignité. Le patient d'abord. Toujours.",
        kr: "Medical 360 Ltd li enn linisiativ sosial l'ONG Enn Rev Enn Sourir. Pasian ki kapav peye gagn kordonasion medikal profesyonel → Medical 360 kre reveni dirab pou ed bann pasian vilnerab. Zero dividann. Oken konpromi lor dignite. Pasian avan tou. Touzour.",
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
