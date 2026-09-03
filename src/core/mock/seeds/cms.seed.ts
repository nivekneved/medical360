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
      emergencyText: { en: '24/7 Patient Assistance', fr: 'Assistance Patient 24/7', kr: 'Asistans Pasian 24/7' },
      phoneNumber: { en: '+230 59188275', fr: '+230 59188275', kr: '+230 59188275' },
      whatsAppText: { en: 'WhatsApp Us', fr: 'WhatsApp', kr: 'WhatsApp Nou' },
      navAbout: { en: 'About Us', fr: 'À Propos', kr: 'Lor Nou' },
      navHospitals: { en: 'Hospitals', fr: 'Hôpitaux', kr: 'Lopital' },
      navSpecialties: { en: 'Specialties', fr: 'Spécialités', kr: 'Spesialite' },
      navDoctors: { en: 'Specialists', fr: 'Médecins', kr: 'Bann Dokter' },
      navServices: { en: 'Services', fr: 'Services', kr: 'Servis' },
      navCaseStudies: { en: 'Patient Stories', fr: 'Témoignages', kr: 'Zistwar Pasian' },
      navCalculator: { en: 'Cost Calculator', fr: 'Calculateur', kr: 'Kalkilatris' },
      navVisa: { en: 'Visa Guide', fr: 'Guide Visa', kr: 'Gid Viza' },
      navContact: { en: 'Contact', fr: 'Contact', kr: 'Kontak' },
      navFreeOpinionBtn: { en: 'Get Free Opinion', fr: 'Avis Gratuit', kr: 'Lavi Medikal Gratis' }
    }
  },
  home: {
    id: 'home',
    title: 'Home Page',
    category: 'Main Pages',
    content: {
      heroBadge: {
        en: '✦ Mauritius\'s Trusted Medical Concierge',
        fr: '✦ Votre Conciergerie Médicale de Confiance à l\'Île Maurice',
        kr: '✦ Ou Konzierz Medikal de Konfians dan Moris'
      },
      heroTitleLine1: {
        en: 'World-Class Healthcare,',
        fr: 'Des Soins de Classe Mondiale,',
        kr: 'Swen Lasante Kalite,'
      },
      heroTitleLine2: {
        en: 'Without the Wait',
        fr: 'Sans Attente',
        kr: 'San Bizin Atann'
      },
      heroSubtitle: {
        en: 'Connecting patients from Mauritius to leading accredited hospitals globally. Get expert medical opinions, transparent pricing, and comprehensive travel coordination—all for free.',
        fr: 'Connecter les patients de l\'île Maurice aux principaux hôpitaux accrédités dans le monde entier. Obtenez des avis médicaux d\'experts, des prix transparents et une coordination de voyage complète, tout cela gratuitement.',
        kr: 'Konekte bann pasian Moris ar bann pli bon lopital dan lemond. Gagn bann lavi expert medikal, pri kler, ek kordinasion voyaz — tou sa pou nanye.'
      },
      heroPrimaryCta: {
        en: 'Get a Free Medical Opinion',
        fr: 'Obtenir un Avis Médical Gratuit',
        kr: 'Gagn Enn Lavi Medikal Gratis'
      },
      heroSecondaryCta: {
        en: 'WhatsApp Support',
        fr: 'WhatsApp Assistance',
        kr: 'WhatsApp Asistans'
      },
      heroBannerImage: {
        en: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80',
        fr: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80',
        kr: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80'
      },
      trustText: {
        en: 'Trusted by 1,200+ Mauritian Patients',
        fr: 'Approuvé par plus de 1 200 patients mauriciens',
        kr: 'Plis ki 1,200 pasian Morisien fer nou konfians'
      },
      statPatients: { en: '1,200+ Patients Assisted', fr: '1 200+ Patients Accompagnés', kr: '1,200+ Pasian Asiste' },
      statHospitals: { en: '15+ Accredited Hospitals', fr: '15+ Hôpitaux Accrédités', kr: '15+ Lopital Akredite' },
      statCountries: { en: '7+ Global Destinations', fr: '7+ Destinations Mondiales', kr: '7+ Destinasion Mondial' },
      statSatisfaction: { en: '100% Satisfaction Rate', fr: '100% Taux de Satisfaction', kr: '100% Pousantaz Satisfe' },
      specialtiesLabel: { en: 'Top Specialties', fr: 'Spécialités Clés', kr: 'Bann Spesialite' },
      specialtiesTitle: { en: 'Expert Care Across 10 Medical Specialties', fr: 'Soins d\'Experts à Travers 10 Spécialités Médicales', kr: 'Swen Expert dan 10 Spesialite Medikal' },
      specialtiesDesc: { en: 'Access world-leading surgeons and state-of-the-art procedures tailored to your medical condition.', fr: 'Accédez aux chirurgiens renommés et aux interventions de pointe adaptées à votre santé.', kr: 'Gagn akse ar bann pli gran dokter ek sirizi adapte a ou bezwen.' },
      specialtiesViewAllBtn: { en: 'View All 10 Specialties', fr: 'Voir Toutes les 10 Spécialités', kr: 'Get Tou Bann 10 Spesialite' },
      exploreBtnText: { en: 'Explore Procedures & Costs', fr: 'Découvrir Actes & Tarifs', kr: 'Dekouver Pri & Tretman' },
      processLabel: { en: 'Simple 4-Step Process', fr: 'Processus en 4 Étapes', kr: 'Prosesis an 4 Letap' },
      processTitle: { en: 'Your Healthcare Journey in 4 Simple Steps', fr: 'Votre Parcours de Soins en 4 Étapes Simples', kr: 'Ou Vwayaz Lasante an 4 Letap' },
      processDesc: { en: 'We coordinate appointments, invitations, travel logistics, and hospital care so you can focus 100% on healing.', fr: 'Nous coordonnons rendez-vous, visas, logistique de voyage et séjour hospitalier pour votre guérison.', kr: 'Nou okip randevou, viza, voyaz ek lopital pou ou kapav zis konsantre lor ou lasante.' },
      processStartBtn: { en: 'Start Your Free Medical Inquiry', fr: 'Commencer Votre Demande Gratuite', kr: 'Koumans Ou Demann Gratis' },
      processStep1Title: { en: '1. Describe Your Need', fr: '1. Décrivez Votre Besoin', kr: '1. Dekrir Ou Bizin' },
      processStep1Desc: { 
        en: 'Fill our simple medical inquiry form with your condition, specialty, and preferences.',
        fr: 'Remplissez notre formulaire de demande médicale simple avec votre condition, votre spécialité et vos préférences.',
        kr: 'Ranpli nou form sinp ek dekrir ou maladi, spesialite, ek ou preferans.'
      },
      processStep2Title: { en: '2. Get a Free Opinion', fr: '2. Obtenez un Avis Gratuit', kr: '2. Gagn Lavi Gratis' },
      processStep2Desc: {
        en: 'Our medical team reviews your case and recommends the best hospitals and specialists within 48 hours.',
        fr: 'Notre équipe médicale examine votre cas et vous recommande les meilleurs hôpitaux et spécialistes sous 48h.',
        kr: 'Nou lekip medikal get ou dosie e rekomann bann pli bon lopital ek dokter dan 48h.'
      },
      processStep3Title: { en: '3. We Plan Everything', fr: '3. Nous Planifions Tout', kr: '3. Nou Planifie Tou' },
      processStep3Desc: {
        en: 'Appointment, visa support, flights, hotel, and airport transfers — all coordinated by Med360.',
        fr: 'Rendez-vous, demande de visa, vols, hôtels et transferts aéroport — tout est coordonné par Med360.',
        kr: 'Randevou, viza, biye avion, lotel, ek transpor — Med360 okip tou.'
      },
      processStep4Title: { en: '4. Travel & Recover', fr: '4. Voyagez et Récupérez', kr: '4. Voyaz ek Repoze' },
      processStep4Desc: {
        en: 'Arrive with confidence. Our dedicated coordinator stays with you throughout your treatment.',
        fr: 'Arrivez en toute confiance. Notre coordinateur dédié reste avec vous tout au long de votre traitement.',
        kr: 'Voyaz san traka. Nou kordinater dedie res avek ou pandan tou ou tretman.'
      },
      networkLabel: { en: 'Accredited Network', fr: 'Réseau Agréé', kr: 'Rezo Akredite' },
      networkTitle: { en: '15+ Internationally Accredited Hospitals', fr: '15+ Hôpitaux Accrédités au Niveau International', kr: '15+ Lopital Akredite Internasional' },
      networkDesc: { en: 'Partnered with premier institutions in India, Thailand, Singapore, Malaysia, and Dubai.', fr: 'Partenaire des meilleures institutions en Inde, Thaïlande, Singapour, Malaisie et Dubaï.', kr: 'Partner ar bann pli gran sant medikal dan L\'inde, Taylann, Singapour, ek Dubai.' },
      networkViewAllBtn: { en: 'Browse All Partner Hospitals', fr: 'Découvrir Tous les Hôpitaux', kr: 'Get Tou Bann Lopital' },
      whyBadge: { en: 'Why Choose Medical 360', fr: 'Pourquoi Choisir Medical 360', kr: 'Kifer Swazir Medical 360' },
      whyTitle: { en: 'Your Health. Our Lifelong Mission.', fr: 'Votre Santé. Notre Mission de Vie.', kr: 'Ou Lasante. Nou Mision.' },
      whyDesc: {
        en: 'We are your trusted health partner. From finding the right surgeon to coordinating every flight and hotel, we handle the stress so you can focus on healing.',
        fr: 'Nous sommes votre partenaire santé de confiance. De la recherche du bon chirurgien à la réservation des vols et hôtels, nous gérons tout le stress pour vous.',
        kr: 'Nou ou partner lasante de konfians. Depi trouv bon dokter ziska rezerv vol ek lotel, nou okip tou pou ou kapav zis konsantre lor ou gerizon.'
      },
      whyImageBadge: { en: '100% Free For Patients', fr: '100% Gratuit Pour le Patient', kr: '100% Gratis Pou Pasian' },
      whyAboutBtn: { en: 'Learn More About Us', fr: 'En Savoir Plus Sur Nous', kr: 'Konpran Plis Lor Nou' },
      whyFeature1Title: { en: 'JCI / NABH Accredited Only', fr: 'Uniquement des Hôpitaux Accrédités JCI / NABH', kr: 'Zis Lopital Akredite JCI / NABH' },
      whyFeature1Desc: { en: 'Strict quality control. We only work with facilities that exceed rigorous global healthcare safety criteria.', fr: 'Contrôle qualité strict. Nous ne travaillons qu\'avec des centres certifiés de très haute renommée.', kr: 'Sekirite strik. Nou travay zis ar bann sant medikal sertifie o nivo mondial.' },
      whyFeature2Title: { en: 'Complete End-to-End Concierge', fr: 'Conciergerie Complète de Bout en Bout', kr: 'Konsierzri Konple depi A a Z' },
      whyFeature2Desc: { en: 'Medical visa invitation letters, priority flights, hotel stay, airport pickup, and bedside translation.', fr: 'Lettres d\'invitation visa, vols prioritaires, hôtel, chauffeur privé et traduction sur place.', kr: 'Viza medikal, biye avion, lotel, transpor prive ek tradiksion pandan tretman.' },
      whyFeature3Title: { en: '48-Hour Second Opinion', fr: 'Deuxième Avis Médical sous 48h', kr: 'Deziem Lavi Medikal dan 48h' },
      whyFeature3Desc: { en: 'Direct reviews by departmental chief surgeons before you travel, with detailed transparent quotes.', fr: 'Examen direct par les chefs de service avant votre départ avec devis transparents.', kr: 'Sef sirizien get ou dosie avan ou voyaze ek donn pri kler.' },
      whyFeature4Title: { en: 'Personal Case Coordinator', fr: 'Coordinateur de Cas Dédié', kr: 'Kordinater Dedie Pou Ou' },
      whyFeature4Desc: { en: 'A dedicated Mauritian coordinator is with you before, during, and after your treatment abroad.', fr: 'Un coordinateur mauricien dédié vous accompagne avant, pendant et après vos soins.', kr: 'Enn kordinater Morisien res ar ou avan, pandan ek apre ou loperasion.' },
      casesLabel: { en: 'Real Results', fr: 'Résultats Réels', kr: 'Rezilta Vre' },
      casesTitle: { en: 'Verified Patient Recoveries & Stories', fr: 'Témoignages & Récits de Rétablissement', kr: 'Temwagnaz & Zistwar Pasian' },
      casesDesc: { en: 'Discover how Mauritian patients saved 50-80% on complex surgeries with extraordinary outcomes.', fr: 'Découvrez comment des patients mauriciens ont économisé 50 à 80% sur des chirurgies de pointe.', kr: 'Dekouver kouma bann pasian Moris finn fer 50-80% lekonomi lor bann gran loperasion.' },
      casesViewAllBtn: { en: 'Read All Patient Stories', fr: 'Lire Tous les Témoignages', kr: 'Lir Tou Bann Temwagnaz' },
      ctaTitle: {
        en: 'Ready to Experience World-Class Medical Care?',
        fr: 'Prêt à Bénéficier de Soins Médicaux d\'Excellence ?',
        kr: 'Pare Pou Gagn Swen Lasante Klas Mondial ?'
      },
      ctaDesc: {
        en: 'Submit your medical inquiry today. Our team will review your case and provide transparent hospital recommendations within 48 hours — 100% free of charge.',
        fr: 'Soumettez votre demande dès aujourd\'hui. Notre équipe examinera votre dossier et vous proposera des recommandations sous 48h — 100% gratuit.',
        kr: 'Avoy ou dosie zordi mem. Nou lekip pou get ou ka ek donn rekomandasion lopital dan 48h — 100% gratis.'
      },
      ctaPrimaryBtn: { en: 'Get Free Medical Opinion', fr: 'Obtenir un Avis Médical Gratuit', kr: 'Gagn Lavi Medikal Gratis' },
      ctaWhatsAppBtn: { en: 'WhatsApp: 59188275', fr: 'WhatsApp : 59188275', kr: 'WhatsApp : 59188275' }
    }
  },
  about: {
    id: 'about',
    title: 'About Page',
    category: 'Main Pages',
    content: {
      heroLabel: {
        en: 'Our Story & Purpose',
        fr: 'Notre Histoire & Notre Mission',
        kr: 'Nou Zistwar & Nou Lobzektif'
      },
      heroTitle: {
        en: 'About Medical 360',
        fr: 'À Propos de Medical 360',
        kr: 'A Propo Medical 360'
      },
      heroDesc: {
        en: 'Med360 Ltd was founded with a clear mission: to ensure every patient in Mauritius and the Indian Ocean region has access to the world\'s finest healthcare.',
        fr: 'Med360 Ltd a été fondée avec une mission claire : garantir à chaque patient de l\'Île Maurice et de l\'océan Indien l\'accès aux meilleurs soins de santé mondiaux.',
        kr: 'Med360 Ltd ti kree avek enn sel lobzektif: fer sir ki sak pasian dan Moris ek l\'osean Indien gagn akse ar bann meyer swen lasante klas mondial.'
      },
      missionLabel: {
        en: 'Our Core Mission',
        fr: 'Notre Mission Principale',
        kr: 'Nou Mision Prinsipal'
      },
      missionTitle: {
        en: 'Bridging Mauritius to World-Class Healthcare',
        fr: 'Relier l\'Île Maurice aux Soins Mondiaux',
        kr: 'Konekt Moris ar Swen Klas Mondial'
      },
      missionP1: {
        en: 'Medical 360 was founded with a clear mission: to ensure that every patient in Mauritius and the Indian Ocean region has access to the world\'s best healthcare — regardless of what is available locally.',
        fr: 'Medical 360 a été fondée avec une mission claire : veiller à ce que chaque patient de l\'Île Maurice et de l\'océan Indien ait accès aux meilleurs soins mondiaux — indépendamment de ce qui est disponible localement.',
        kr: 'Medical 360 ti fonde avek enn mision bien kler: fer sir ki sak pasian dan Moris ek l\'osean Indien gagn akse ar bann meyer swen mondial — mem si pa gagn sa lokalman.'
      },
      missionP2: {
        en: 'We understand the anxiety of travelling abroad for medical treatment. That is why we handle everything — from finding the right specialist, to your hotel room, your visa, and your return flight. Our job is to let you focus on one thing: your recovery.',
        fr: 'Nous comprenons l\'anxiété liée à un voyage à l\'étranger pour des soins médicaux. C\'est pourquoi nous nous occupons de tout — de la recherche du bon spécialiste à votre chambre d\'hôtel, en passant par votre visa et votre vol retour. Notre travail est de vous permettre de vous concentrer sur une seule chose : votre guérison.',
        kr: 'Nou konpran ki li bien stresan pou vwayaze pou al swagn maladi letranze. Se pou sa ki nou okip tou — depi trouv bon dokter la ziska rezerv lotel, viza, ek biye retour. Nou travay se permet ou konsantre zis lor ou gerizon.'
      },
      missionP3: {
        en: 'Our service is always 100% free for patients. We are compensated directly by our hospital partners, never by the patients we serve.',
        fr: 'Notre service est toujours 100% gratuit pour les patients. Nous sommes rémunérés directement par nos hôpitaux partenaires, jamais par les patients que nous aidons.',
        kr: 'Nou servis li touzour 100% gratis pou bann pasian. Se bann lopital partner ki pey nou direk, zame bann pasian ki nou ed.'
      },
      pillar1Title: { en: 'JCI / NABH Accredited Hospitals Only', fr: 'Uniquement des Hôpitaux Accrédités JCI / NABH', kr: 'Zis Lopital Akredite JCI / NABH' },
      pillar1Desc: { en: 'We only partner with hospitals that meet the most rigorous global quality and safety standards.', fr: 'Nous ne travaillons qu\'avec des hôpitaux respectant les normes de sécurité les plus strictes.', kr: 'Nou travay zis ar bann lopital ki ena bann pli o standard sekirite.' },
      pillar2Title: { en: 'Direct Department Head Opinions', fr: 'Avis Directs des Chefs de Service', kr: 'Lavi Direk Sef Dokter' },
      pillar2Desc: { en: 'Your medical reports are reviewed directly by chief surgeons, not automated software.', fr: 'Vos rapports médicaux sont examinés directement par les chirurgiens en chef.', kr: 'Ou dosie medikal li examine direk par bann sef sirizien.' },
      pillar3Title: { en: 'Complete Travel Coordination', fr: 'Coordination Complète du Voyage', kr: 'Kordinasion Vwayaz Konple' },
      pillar3Desc: { en: 'Medical visas, flights, companion travel, airport pickup, and dedicated hotel booking.', fr: 'Visas médicaux, vols, billets accompagnants, accueil aéroport et réservation hôtel.', kr: 'Viza medikal, vol, biye akonpagnan, transpor ek rezervasion lotel.' },
      pillar4Title: { en: 'Zero Patient Fees', fr: 'Zéro Frais pour le Patient', kr: 'Zero Fré Pou Pasian' },
      pillar4Desc: { en: 'Our guidance and concierge coordination are 100% free of charge for Mauritian patients.', fr: 'Notre accompagnement et notre conciergerie sont 100% gratuits pour les patients mauriciens.', kr: 'Nou asistans ek kordinasion zot 100% gratis pou bann pasian Morisien.' },
      awardsLabel: {
        en: 'Awards & Recognition',
        fr: 'Reconnaissances & Distinctions',
        kr: 'Rekonpans & Onerr'
      },
      awardsTitle: {
        en: 'Honored for Facilitation Excellence',
        fr: 'Récompensé pour l\'Excellence Médicale',
        kr: 'Rekonpanse pou Nou Servis Medikal'
      },
      awardsDesc: {
        en: 'Our patient-first standards, zero-cost policy, and rigorous hospital vetting are internationally recognized across the healthcare travel industry.',
        fr: 'Nos standards rigoureux de qualité, de gratuité pour le patient et de sécurité hospitalière sont régulièrement primés à l\'international.',
        kr: 'Nou gran langazman pou donn servis de kalite, gratis ek an sekirite finn gagn bann gran pri internasional.'
      },
      storiesTitle: {
        en: 'Verified Patient Stories & Recoveries',
        fr: 'Témoignages & Récits de Rétablissement',
        kr: 'Temwagnaz & Zistwar Pasian'
      },
      storiesDesc: {
        en: 'Real Mauritian patients who trusted Medical 360 for complex surgeries abroad.',
        fr: 'De vrais patients mauriciens qui ont confié leur santé à Medical 360 pour des chirurgies complexes à l\'étranger.',
        kr: 'Bann vre pasian Morisien ki finn fer Medical 360 konfians pou zot loperasion letranze.'
      },
      ctaTitle: {
        en: 'Ready to Start Your Journey?',
        fr: 'Prêt à Commencer Votre Parcours ?',
        kr: 'Pare Pou Koumans Ou Vwayaz ?'
      },
      ctaDesc: {
        en: 'Get a free medical opinion from our partner specialists within 48 hours.',
        fr: 'Obtenez un avis médical gratuit de nos spécialistes partenaires dans les 48 heures.',
        kr: 'Gagn enn lavi medikal gratis avek nou bann dokter partner dan 48h.'
      },
      ctaPrimaryBtn: { en: 'Get Free Opinion', fr: 'Obtenir un Avis Gratuit', kr: 'Gagn Lavi Medikal Gratis' },
      ctaWhatsAppBtn: { en: 'WhatsApp Support', fr: 'Assistance WhatsApp', kr: 'Asistans WhatsApp' }
    }
  },
  services: {
    id: 'services',
    title: 'Services Page',
    category: 'Main Pages',
    content: {
      heroLabel: {
        en: 'Full Concierge Care',
        fr: 'Conciergerie Médicale Complète',
        kr: 'Full Concierge Medikal'
      },
      heroTitle: {
        en: 'Our Services Cover Every Need',
        fr: 'Nos Services Couvrent Tous Vos Besoins',
        kr: 'Nou Bann Servis Kouver Tou Ou Bizin'
      },
      heroDesc: {
        en: 'From your first inquiry to post-treatment follow-up, Medical 360 handles every detail of your healthcare journey abroad.',
        fr: 'De votre première demande au suivi post-traitement, Medical 360 s\'occupe de chaque détail de votre parcours de santé à l\'étranger.',
        kr: 'Depi premie demann ziska swivi apre tretman, Medical 360 okip tou bann detay dan ou vwayaz medikal.'
      },
      service1Title: { en: '1. Free Expert Medical Opinion', fr: '1. Avis Médical d\'Expert Gratuit', kr: '1. Lavi Medikal Expert Gratis' },
      service1Desc: { en: 'Receive treatment plans and transparent cost estimates from top hospital department heads within 48 hours.', fr: 'Recevez des plans de traitement et des devis transparents des chefs de service hospitaliers sous 48h.', kr: 'Gagn plan tretman ek estimasion pri kler depi bann sef dokter dan 48h.' },
      service2Title: { en: '2. Medical Visa & Travel Planning', fr: '2. Visa Médical & Organisation du Voyage', kr: '2. Viza Medikal & Plan Voyaz' },
      service2Desc: { en: 'Fast-track visa invitation letters, priority flight bookings with medical luggage allowances, and airline wheelchair assistance.', fr: 'Lettres d\'invitation visa accélérées, réservations vols prioritaires avec bagages médicaux et assistance.', kr: 'Let linvitasion viza vit-vit, rezervasion vol prioritair ek lasistans fotey roulan.' },
      service3Title: { en: '3. Priority Hospital Admission', fr: '3. Admission Hospitalière Prioritaire', kr: '3. Ladmision Lopital Prioriter' },
      service3Desc: { en: 'Skip waiting lists. Direct appointments booked with leading chief surgeons, private rooms, and zero queueing.', fr: 'Évitez les listes d\'attente. Rendez-vous directs avec les chirurgiens en chef et chambres privées.', kr: 'Pa bizin atann. Randevou direk ar bann sef sirizien ek lasam prive.' },
      service4Title: { en: '4. Multilingual & Translator Support', fr: '4. Assistance Traducteur & Multilingue', kr: '4. Lasistans Tradiksion & Langaz' },
      service4Desc: { en: 'Dedicated on-ground language coordinators fluent in English, French, and local languages to assist you in every doctor consultation.', fr: 'Coordinateurs locaux bilingues pour vous assister lors de chaque consultation avec les médecins.', kr: 'Kordinater lokal pou ed ou dan sak randevou dokter pou tradir tou kler.' },
      service5Title: { en: '5. Airport VIP Meet & Greet', fr: '5. Accueil VIP & Transferts Aéroport', kr: '5. Lariwe VIP & Transpor Lotel' },
      service5Desc: { en: 'Private ambulance or comfortable chauffeur vehicle waiting upon landing to escort you directly to your hospital or hotel.', fr: 'Ambulance privée ou véhicule tout confort à l\'atterrissage pour vous conduire directement à l\'hôpital ou à l\'hôtel.', kr: 'Ambilans prive ouswa transpor konfor ki pe atann ou pou amenn ou lopital ouswa lotel.' },
      service6Title: { en: '6. Post-Treatment Remote Follow-Up', fr: '6. Suivi Médical à Distance Post-Traitement', kr: '6. Swivi Medikal A Distans Apre Tretman' },
      service6Desc: { en: 'Post-op telemedicine consultations with your operating surgeon once you return home to Mauritius.', fr: 'Téléconsultations post-opératoires avec votre chirurgien une fois de retour à l\'Île Maurice.', kr: 'Konsiltasion video ar ou sirizien kan ou retourn Moris pou fer sir tou pe bien pase.' },
      ctaTitle: { en: 'Need Special Arrangements?', fr: 'Besoin d\'un Accompagnement Spécifique ?', kr: 'Bizin Enn Akonpagnman Spesifik ?' },
      ctaDesc: { en: 'We cater for wheelchair assistance, companion hotel stays, dietary requirements, and stretcher flights.', fr: 'Nous organisons assistance fauteuil roulant, hébergement pour accompagnants et vols sanitaires.', kr: 'Nou organiz fotey roulan, lasam pou akonpagnan, manze espesial ek vol saniter.' },
      ctaBtn: { en: 'Contact Our Medical Team', fr: 'Contacter Notre Équipe', kr: 'Kontak Nou Lekip' }
    }
  },
  hospitals: {
    id: 'hospitals',
    title: 'Hospitals Page',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: 'Our Network',
        fr: 'Notre Réseau',
        kr: 'Nou Rezo'
      },
      heroTitle: {
        en: 'Associated Hospitals',
        fr: 'Hôpitaux Associés',
        kr: 'Lopital Partner'
      },
      heroDesc: {
        en: 'Every hospital in our network is internationally accredited. Browse our partner hospitals and explore their specialties, facilities, and patient services.',
        fr: 'Chaque hôpital de notre réseau est accrédité au niveau international. Parcourez nos hôpitaux partenaires et explorez leurs spécialités, leurs installations et leurs services aux patients.',
        kr: 'Sak lopital dan nou rezo ena akreditasion internasional. Get nou bann lopital partner ek explor zot spesialite, fasilite, ek servis pou bann pasian.'
      },
      searchPlaceholder: {
        en: 'Search hospitals by name, city, or country...',
        fr: 'Rechercher des hôpitaux par nom, ville ou pays...',
        kr: 'Rod lopital par nom, lavil ouswa pei...'
      },
      filterAll: { en: 'All Hospitals', fr: 'Tous les Hôpitaux', kr: 'Tou Lopital' },
      filterAccredited: { en: 'JCI / NABH Accredited', fr: 'Accrédités JCI / NABH', kr: 'Akredite JCI / NABH' },
      statsBannerTitle: { en: 'Over 15,000 Hospital Beds in Our Global Network', fr: 'Plus de 15 000 Lits d\'Hôpitaux dans Notre Réseau Mondial', kr: 'Plis ki 15 000 Leli Lopital dan Nou Rezo' },
      statsBannerDesc: { en: 'State-of-the-art robotic surgical suites, hybrid catheterization laboratories, and dedicated international patient lounges.', fr: 'Salles de chirurgie robotique de pointe, laboratoires de cathétérisme hybrides et salons VIP internationaux.', kr: 'Lasal loperasion robotik, laboratwar avanse ek salon VIP pou bann pasian internasional.' }
    }
  },
  specialties: {
    id: 'specialties',
    title: 'Specialties Page',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: 'Medical Expertise',
        fr: 'Expertise Médicale',
        kr: 'Exspertiz Medikal'
      },
      heroTitle: {
        en: 'Select Your Specialty',
        fr: 'Sélectionnez Votre Spécialité',
        kr: 'Swazir Ou Spesialite'
      },
      heroDesc: {
        en: 'Browse our full range of medical specialties. Click any specialty to view procedures, estimated costs, and get a tailored opinion.',
        fr: 'Parcourez notre gamme complète de spécialités médicales. Cliquez sur une spécialité pour voir les procédures, les coûts estimés et obtenir un avis sur mesure.',
        kr: 'Get tou bann spesialite medikal ki nou ofer. Klik lor enn spesialite pou trouv bann tretman, pri estime, ek gagn enn lavi medikal personnaliser.'
      },
      guidanceText: {
        en: 'All procedures include comprehensive pre-operative assessment and international standard surgical care.',
        fr: 'Toutes les interventions incluent un bilan préopératoire complet et des soins chirurgicaux aux standards internationaux.',
        kr: 'Tou bann loperasion inklir bilan konple avan loperasion ek swen o standard internasional.'
      },
      searchPlaceholder: {
        en: 'Search by condition, surgery, or specialty name...',
        fr: 'Rechercher par maladie, chirurgie ou nom de spécialité...',
        kr: 'Rod par maladi, loperasion ouswa nom spesialite...'
      }
    }
  },
  doctors: {
    id: 'doctors',
    title: 'Doctors & Specialists Page',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: 'World-Renowned Specialists',
        fr: 'Spécialistes de Renom Mondial',
        kr: 'Dokter Klas Mondial'
      },
      heroTitle: {
        en: 'Our 7 Elite Medical Specialists',
        fr: 'Nos 7 Chirurgiens et Médecins d\'Élite',
        kr: 'Nou 7 Dokter ek Sirizien Spesialist'
      },
      heroDesc: {
        en: 'Meet our handpicked network of 7 world-leading medical surgeons and consultants who have performed over 100,000 successful surgeries combined.',
        fr: 'Découvrez notre réseau exclusif de 7 chirurgiens et consultants de premier plan ayant réalisé plus de 100 000 interventions réussies.',
        kr: 'Dekouver nou rezo seleksione de 7 dokter ek sirizien klas mondial ki finn fer plis ki 100 000 loperasion a-sikse.'
      },
      trustBadgeText: {
        en: 'Direct Consultation & Second Opinion Available',
        fr: 'Consultation Directe & Deuxième Avis Disponible',
        kr: 'Konsiltasion Direk ek Deziem Lavi Disponib'
      },
      searchPlaceholder: {
        en: 'Search specialists by name, specialty, or hospital...',
        fr: 'Rechercher un médecin par nom, spécialité ou hôpital...',
        kr: 'Rod dokter par nom, spesialite ouswa lopital...'
      }
    }
  },
  'case-studies': {
    id: 'case-studies',
    title: 'Case Studies Page',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: 'Patient Stories',
        fr: 'Témoignages de Patients',
        kr: 'Zistwar Bann Pasian'
      },
      heroTitle: {
        en: 'Case Studies',
        fr: 'Études de Cas',
        kr: 'Temwagnaz'
      },
      heroDesc: {
        en: 'Real stories from real patients. Read how Medical 360 facilitated life-changing treatments for patients from Mauritius and across the Indian Ocean region.',
        fr: 'Des histoires vraies de vrais patients. Lisez comment Medical 360 a facilité des traitements vitaux pour des patients de l\'Île Maurice et de l\'océan Indien.',
        kr: 'Vre zistwar depi vre pasian. Lir kouma Medical 360 finn ed bann pasian depi Moris ek l\'osean Indien gagn tretman ki finn sov zot lavi.'
      },
      ctaTitle: {
        en: 'Could You Be Our Next Success Story?',
        fr: 'Pourriez-vous être notre prochaine success story ?',
        kr: 'Ou kapav vinn nou prosenn zistwar a-sikse?'
      },
      ctaDesc: {
        en: 'Join thousands of patients who trusted Medical 360 to find them the best care at the right price.',
        fr: 'Rejoignez des milliers de patients qui ont fait confiance à Medical 360 pour trouver les meilleurs soins au bon prix.',
        kr: 'Rezwenn milye pasian ki finn fer Medical 360 konfians pou gagn pli bon swen ek pli bon pri.'
      }
    }
  },
  'cost-calculator': {
    id: 'cost-calculator',
    title: 'Cost Calculator',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: 'Instant Pricing Estimation',
        fr: 'Estimation Tarifaire Immédiate',
        kr: 'Estimasion Pri Deswit'
      },
      heroTitle: {
        en: 'Medical Treatment Cost Calculator',
        fr: 'Calculateur de Coût de Traitement Médical',
        kr: 'Kalkilatris Pri Tretman Medikal'
      },
      heroDesc: {
        en: 'Select your specialty, procedure, and destination to get a transparent estimate including hospital package, companion stay, and flights with estimated savings of 50–80%.',
        fr: 'Sélectionnez votre spécialité, procédure et destination pour obtenir une estimation transparente incluant l\'hôpital, l\'hébergement et les vols avec 50 à 80% d\'économies.',
        kr: 'Swazir ou spesialite, tretman ek destinasion pou gagn estimasion kler ar lopital, lotel ek vol avek 50–80% lekonomi.'
      },
      disclaimerText: {
        en: 'All costs are indicative estimates based on accredited hospital tariffs and standard hospital stays.',
        fr: 'Tous les tarifs sont des estimations indicatives basées sur les forfaits des hôpitaux partenaires agréés.',
        kr: 'Tou bann pri se bann estimasion baze lor forfay bann lopital akredite.'
      }
    }
  },
  'visa-guide': {
    id: 'visa-guide',
    title: 'Visa & Travel Guide',
    category: 'Inside Pages',
    content: {
      heroLabel: {
        en: 'Medical Travel Guide',
        fr: 'Guide Voyage Médical',
        kr: 'Gid Voyaz Medikal'
      },
      heroTitle: {
        en: 'Mauritius Medical Visa & Travel Guide',
        fr: 'Guide Visa Médical & Voyage pour Mauriciens',
        kr: 'Gid Viza Medikal & Voyaz pou Morisien'
      },
      heroDesc: {
        en: 'Everything you need to know about medical visas, passport requirements, companion travel, and flights from SSR International Airport to world-leading hospital destinations.',
        fr: 'Tout ce que vous devez savoir sur les visas médicaux, le passeport, les accompagnateurs et les vols depuis l\'Aéroport SSR vers les meilleurs hôpitaux internationaux.',
        kr: 'Tou seki ou bizin kone lor viza medikal, paspor, akonpagnan, ek vol depi Plaisance (SSR) ziska bann pli gran lopital internasional.'
      },
      ctaTitle: {
        en: 'Need Assistance With Your Medical Visa?',
        fr: 'Besoin d\'aide pour votre visa médical ?',
        kr: 'Bizin led pou ou viza medikal ?'
      },
      ctaDesc: {
        en: 'Our dedicated travel concierge issues hospital invitation letters and coordinates your visa application free of charge.',
        fr: 'Notre équipe émet vos lettres d\'invitation hospitalières et coordonne vos démarches de visa gratuitement.',
        kr: 'Nou lekip prepar ou let linvitasion lopital ek ed ou dan tou demars viza gratis.'
      }
    }
  },
  'describe-need': {
    id: 'describe-need',
    title: 'Describe Need (Wizard)',
    category: 'Inside Pages',
    content: {
      heroTitle: {
        en: 'Describe Your Need',
        fr: 'Décrivez Votre Besoin',
        kr: 'Dekrir Ou Bizin'
      },
      heroDesc: {
        en: 'Fill in the form below and our medical team will get back to you with personalised hospital recommendations — free of charge.',
        fr: 'Remplissez le formulaire ci-dessous et notre équipe médicale vous répondra avec des recommandations personnalisées — gratuitement.',
        kr: 'Ranpli form ki anba la e nou lekip medikal pou reponn ou avek bann rekomandasion lopital personalize — pou nanye ditou.'
      },
      step1Heading: { en: 'Personal Information', fr: 'Informations Personnelles', kr: 'Linformasion Personel' },
      step2Heading: { en: 'Medical Condition & Specialty', fr: 'Condition Médicale & Spécialité', kr: 'Kondision Medikal & Spesialite' },
      step3Heading: { en: 'Travel & Budget Preferences', fr: 'Préférences de Voyage & Budget', kr: 'Preferans Voyaz & Bidze' },
      step4Heading: { en: 'Review & Submit', fr: 'Vérifier & Soumettre', kr: 'Revize & Soumet' },
      privacyNotice: {
        en: 'Your medical data is encrypted and strictly protected under the Mauritius Data Protection Act 2017.',
        fr: 'Vos données médicales sont cryptées et protégées conformément au Data Protection Act 2017 de Maurice.',
        kr: 'Ou bann done medikal prive zot sekirize dapre Data Protection Act 2017 Moris.'
      },
      successTitle: {
        en: 'Inquiry Submitted Successfully!',
        fr: 'Demande Soumise avec Succès !',
        kr: 'Demann Finn Soumet avek Sikse !'
      },
      successDesc: {
        en: 'Your case has been received. A dedicated Medical 360 case coordinator will contact you within 24 hours.',
        fr: 'Votre dossier a été reçu. Un coordinateur de cas dédié de Medical 360 vous contactera sous 24h.',
        kr: 'Nou finn gagn ou dosie. Enn kordinater Medical 360 pou kontakte ou dan 24h.'
      }
    }
  },
  contact: {
    id: 'contact',
    title: 'Contact Page',
    category: 'Main Pages',
    content: {
      heroLabel: {
        en: 'Get in Touch',
        fr: 'Contactez-Nous',
        kr: 'Kontak Nou'
      },
      heroTitle: {
        en: 'Contact Us',
        fr: 'Contact',
        kr: 'Kontak'
      },
      heroDesc: {
        en: 'Have questions? Our team is available 7 days a week. Reach us by WhatsApp, phone, or email.',
        fr: 'Des questions ? Notre équipe est disponible 7 jours sur 7. Joignez-nous par WhatsApp, téléphone ou email.',
        kr: 'Ena kestion? Nou lekip la 7 zour lor 7. Kontak nou lor WhatsApp, telefonn ouswa email.'
      },
      reachUsTitle: {
        en: 'Reach Us Directly',
        fr: 'Joignez-nous Directement',
        kr: 'Koz Ar Nou Direk'
      },
      officeAddress: {
        en: 'Med360 Ltd, Level 4, Medical Hub, Port Louis, Mauritius',
        fr: 'Med360 Ltd, Niveau 4, Pôle Médical, Port-Louis, Île Maurice',
        kr: 'Med360 Ltd, Nivo 4, Pôle Médical, Port-Louis, Moris'
      },
      hoursText: {
        en: 'Mon – Sat: 8:00 AM – 7:00 PM (MUT)\nWhatsApp available 24/7',
        fr: 'Lun – Sam : 8h00 – 19h00 (MUT)\nWhatsApp disponible 24h/24 et 7j/7',
        kr: 'Lindi - Samdi: 08:00 - 19:00 (MUT)\nWhatsApp disponib 24/7'
      },
      emailAddress: {
        en: 'contact@med360.mu',
        fr: 'contact@med360.mu',
        kr: 'contact@med360.mu'
      },
      phoneNumber: {
        en: '+230 59188275',
        fr: '+230 59188275',
        kr: '+230 59188275'
      },
      responseTimeNotice: {
        en: 'Typical response time: Under 2 hours during working hours.',
        fr: 'Délai de réponse moyen : Moins de 2 heures durant les heures ouvrables.',
        kr: 'Délai repons : Mwens ki 2 er de tan pandan ler travay.'
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
        en: 'Last Updated: January 2026',
        fr: 'Dernière mise à jour : Janvier 2026',
        kr: 'Dernie miz-a-zour : Zanvie 2026'
      },
      section1Title: {
        en: '1. Information We Collect',
        fr: '1. Informations que Nous Collectons',
        kr: '1. Linformasion ki Nou Ramase'
      },
      section1Content: {
        en: 'We collect personal identification data, contact details, medical history reports, diagnostic images, and travel preferences strictly for medical concierge and hospital coordination purposes.',
        fr: 'Nous collectons les données d\'identification, coordonnées, rapports médicaux, imageries diagnostiques et préférences de voyage uniquement pour la conciergerie médicale et la coordination hospitalière.',
        kr: 'Nou ramass done lidantite, kontak, dosie medikal, radio, skan ek preferans voyaz zis pou ed ou organiz ou swen lopital.'
      },
      section2Title: {
        en: '2. How We Use Your Data',
        fr: '2. Utilisation de Vos Données',
        kr: '2. Kouma Nou Servi Ou Done'
      },
      section2Content: {
        en: 'Your medical files are shared exclusively with accredited partner hospital chief specialists to obtain preliminary opinions, treatment plans, and quotes with your explicit consent.',
        fr: 'Vos dossiers médicaux sont transmis exclusivement aux médecins chefs des hôpitaux partenaires accrédités pour l\'obtention d\'avis et devis avec votre accord explicite.',
        kr: 'Ou bann dosie medikal partaze zis ar bann sef sirizien dan bann lopital partner pou gagn zot lavi ek devis ar ou lakor.'
      },
      section3Title: {
        en: '3. Data Security & Storage',
        fr: '3. Sécurité & Stockage des Données',
        kr: '3. Sekirite & Stokaz Done'
      },
      section3Content: {
        en: 'All data is stored using AES-256 encrypted protocols and handled strictly according to the Mauritius Data Protection Act (DPA 2017) and GDPR-aligned principles.',
        fr: 'Toutes les données sont chiffrées selon les normes AES-256 et traitées conformément au Data Protection Act 2017 de Maurice et aux principes du RGPD.',
        kr: 'Tou done kripte ar standard AES-256 e nou swiv strikteman Data Protection Act 2017 Moris ek bann norm RGPD.'
      }
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
        en: 'Important legal terms and conditions governing medical facilitation services provided by Med360 Ltd in Mauritius.',
        fr: 'Conditions juridiques importantes régissant les services de facilitation médicale fournis par Med360 Ltd à l\'Île Maurice.',
        kr: 'Bann kondision legal inportan konsernan bann servis fasilitasion medikal par Med360 Ltd dan Moris.'
      },
      lastUpdated: {
        en: 'Last Updated: January 2026',
        fr: 'Dernière mise à jour : Janvier 2026',
        kr: 'Dernie miz-a-zour : Zanvie 2026'
      },
      section1Title: {
        en: '1. Role of Medical 360',
        fr: '1. Rôle de Medical 360',
        kr: '1. Rol Medical 360'
      },
      section1Content: {
        en: 'Medical 360 acts solely as an independent medical travel concierge and facilitator connecting patients to accredited international hospitals. Medical 360 does not provide direct medical treatment or diagnosis.',
        fr: 'Medical 360 agit exclusivement en tant que conciergerie et facilitateur médical indépendant mettant en relation les patients avec des hôpitaux agréés. Medical 360 ne fournit pas directement de diagnostics.',
        kr: 'Medical 360 azir zis kouma enn fasilitater medikal independan ki met an kontak bann pasian ar bann gran lopital letranze. Medical 360 pa donn swen medikal direkteman.'
      },
      section2Title: {
        en: '2. Free Patient Concierge Policy',
        fr: '2. Politique de Gratuité pour le Patient',
        kr: '2. Servis 100% Gratis Pou Pasian'
      },
      section2Content: {
        en: 'Our guidance, initial opinion coordination, and concierge support are provided free of charge to Mauritian patients. Hospital treatment tariffs are paid directly to the admitting hospital.',
        fr: 'Nos services d\'accompagnement et d\'obtention de devis sont entièrement gratuits pour les patients mauriciens. Les frais hospitaliers sont réglés directement à l\'hôpital d\'accueil.',
        kr: 'Nou bann servis lavi medikal ek kordinasion zot 100% gratis pou bann pasian Morisien. Fre tretman peye direkteman a lopital.'
      }
    }
  },
  footer: {
    id: 'footer',
    title: 'Footer & Legal',
    category: 'Global',
    content: {
      tagline: {
        en: 'Medical 360 connects Mauritian patients to accredited hospitals worldwide for cardiac surgery, cancer care, orthopedics, organ transplants, IVF, and more.',
        fr: 'Medical 360 connecte les patients mauriciens aux hôpitaux accrédités du monde entier pour la chirurgie cardiaque, l\'oncologie, l\'orthopédie, les greffes, la FIV, etc.',
        kr: 'Medical 360 konekte bann pasian Moris ar bann pli bon lopital dan lemond pou kardiolozi, onkolozi, lortopedi, transplantasion, FIV, ek lezot.'
      },
      copyrightText: {
        en: 'Med360 Ltd. All rights reserved. Registered Medical Facilitator in Mauritius.',
        fr: 'Med360 Ltd. Tous droits réservés. Facilitateur médical enregistré à l\'Île Maurice.',
        kr: 'Med360 Ltd. Tou drwa rezerve. Fasilitater medikal anrezistre dan Moris.'
      },
      disclaimer: {
        en: 'Medical 360 is a healthcare concierge service and does not provide medical diagnoses directly.',
        fr: 'Medical 360 est un service de conciergerie médicale et ne fournit pas directement de diagnostics médicaux.',
        kr: 'Medical 360 se enn servis konsierzri medikal e li pa donn diagnostik medikal direkteman.'
      },
      servicesTitle: { en: 'Our Services', fr: 'Nos Services', kr: 'Nou Bann Servis' },
      quickLinksTitle: { en: 'Quick Links', fr: 'Liens Rapides', kr: 'Bann Lien Rapid' },
      legalTitle: { en: 'Legal & Trust', fr: 'Légal & Sécurité', kr: 'Legal & Sekirite' },
      contactTitle: { en: 'Contact Concierge', fr: 'Contacter la Conciergerie', kr: 'Kontak Konzierz' }
    }
  }
};
