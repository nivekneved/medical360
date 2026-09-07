export interface SpecialtySymptomData {
  badge: string;
  plainName: string;
  symptoms: string[];
  keywords: string[];
}

export const SPECIALTY_SYMPTOMS_MAP: Record<string, {
  en: SpecialtySymptomData;
  fr: SpecialtySymptomData;
  kr: SpecialtySymptomData;
}> = {
  'sp-oncology': {
    en: {
      badge: '🎗️ Cancer Care & Tumours',
      plainName: 'Cancer & Tumour Treatments',
      symptoms: ['Abnormal lump or mass', 'Sudden unexplained weight loss', 'Tumour diagnosis', 'Need for chemotherapy / radiotherapy', 'Biopsy review'],
      keywords: ['cancer', 'tumor', 'tumour', 'lump', 'mass', 'chemo', 'chemotherapy', 'radiation', 'radiotherapy', 'oncology', 'cyberknife', 'biopsy', 'carcinoma', 'sarcoma']
    },
    fr: {
      badge: '🎗️ Soins du Cancer & Tumeurs',
      plainName: 'Traitements du Cancer & Tumeurs',
      symptoms: ['Grosseur ou masse anormale', 'Perte de poids inexpliquée', 'Diagnostic de tumeur', 'Besoin de chimiothérapie / radiothérapie', 'Revue de biopsie'],
      keywords: ['cancer', 'tumeur', 'grosseur', 'boule', 'masse', 'chimiotherapie', 'chimiothérapie', 'chimio', 'radiotherapie', 'radiothérapie', 'oncologie', 'biopsie']
    },
    kr: {
      badge: '🎗️ Swen Kanser & Timer',
      plainName: 'Tretman Kanser & Timer',
      symptoms: ['Enn boule / grosseur anormale', 'Perdi pwa vit san eseye', 'Timer / Kanser', 'Bizin simioterapi ouswa reyon', 'Test biopsi'],
      keywords: ['kanser', 'timer', 'boule', 'masse', 'simio', 'simioterapi', 'radioterapi', 'biopsi']
    }
  },
  'sp-cardiology': {
    en: {
      badge: '❤️ Heart & Cardiac Care',
      plainName: 'Heart, Bypass & Valve Care',
      symptoms: ['Chest pain or tightness', 'Shortness of breath on exertion', 'High blood pressure', 'Heart palpitations', 'Bypass / valve replacement needed'],
      keywords: ['heart', 'chest', 'breath', 'breathing', 'pressure', 'cardiac', 'cardiology', 'bypass', 'artery', 'stent', 'valve', 'tavi', 'tavr', 'cabg', 'attack', 'palpitation', 'angioplasty']
    },
    fr: {
      badge: '❤️ Cœur & Cardiologie',
      plainName: 'Soins du Cœur & Vaisseaux',
      symptoms: ['Douleur ou oppression thoracique', 'Essoufflement à l\'effort', 'Tension artérielle élevée', 'Palpitations cardiaques', 'Pontage / remplacement valvulaire'],
      keywords: ['coeur', 'cœur', 'poitrine', 'souffle', 'essoufflement', 'tension', 'cardiaque', 'cardiologie', 'pontage', 'artere', 'artère', 'stent', 'valve', 'infarctus', 'angioplastie', 'palpitations']
    },
    kr: {
      badge: '❤️ Leker & Disan',
      plainName: 'Swen Leker & Poitrine',
      symptoms: ['Douler / pwa lor poitrine', 'Mank souf vit', 'Presion disan o', 'Leker bate for', 'Bypass & valv leker'],
      keywords: ['leker', 'poitrine', 'souf', 'presion', 'disan', 'bypass', 'stent', 'valv', 'atak leker', 'douler leker']
    }
  },
  'sp-neurology': {
    en: {
      badge: '🧠 Brain, Spine & Nerves',
      plainName: 'Brain, Nerves & Neurosurgery',
      symptoms: ['Severe persistent headaches', 'Numbness or tingling in limbs', 'Stroke recovery & neuro deficits', 'Seizures & epilepsy', 'Tremors / Parkinson’s disease'],
      keywords: ['brain', 'head', 'headache', 'nerve', 'neurology', 'neurosurgery', 'stroke', 'paralysis', 'seizure', 'epilepsy', 'parkinson', 'memory', 'spine', 'tremor', 'dizziness', 'dbs']
    },
    fr: {
      badge: '🧠 Cerveau & Neurochirurgie',
      plainName: 'Cerveau, Nerfs & Suites d\'AVC',
      symptoms: ['Maux de tête violents ou persistants', 'Engourdissements ou perte de force', 'Récupération post-AVC', 'Crises d\'épilepsie', 'Tremblements / maladie de Parkinson'],
      keywords: ['cerveau', 'tete', 'tête', 'nerf', 'neurologie', 'neurochirurgie', 'avc', 'paralysie', 'epilepsie', 'épilepsie', 'parkinson', 'vertige', 'colonne', 'tremblement']
    },
    kr: {
      badge: '🧠 Laservel, Ner & Kolonn',
      plainName: 'Laservel, Ner & Apre Stroke',
      symptoms: ['Mal latet for ki pa pase', 'Lamen ouswa lipie angourdi', 'Swivi apre enn kout disan (stroke)', 'Kriz epilepsi', 'Lamen tranble / Parkinson'],
      keywords: ['laservel', 'latet', 'ner', 'neurolozi', 'stroke', 'paralize', 'epilepsi', 'parkinson', 'lavertiz', 'tranbleman']
    }
  },
  'sp-orthopedics': {
    en: {
      badge: '🦴 Bones, Joints & Spine',
      plainName: 'Joints, Knee & Back Care',
      symptoms: ['Severe knee arthritis & pain', 'Hip joint stiffness', 'Chronic spine / back disc pain', 'Shoulder / ligament tears', 'Joint replacement needed'],
      keywords: ['knee', 'hip', 'bone', 'joint', 'back', 'spine', 'walking', 'leg', 'shoulder', 'orthopedic', 'orthopedics', 'replacement', 'prosthetic', 'disc', 'tlif', 'cartilage', 'fracture', 'arthritis', 'robotic']
    },
    fr: {
      badge: '🦴 Os, Articulations & Rachis',
      plainName: 'Genou, Hanche & Mal de Dos',
      symptoms: ['Douleur au genou & arthrose', 'Douleur et blocage de hanche', 'Mal de dos chronique & hernie discale', 'Articulations douloureuses', 'Prothèse genou / hanche'],
      keywords: ['genou', 'hanche', 'os', 'articulation', 'dos', 'colonne', 'marche', 'jambe', 'epaule', 'épaule', 'orthopedie', 'orthopédie', 'prothese', 'prothèse', 'disque', 'arthrose', 'fracture', 'rachis']
    },
    kr: {
      badge: '🦴 Lezo, Zointir & Ledo',
      plainName: 'Zounou, Lans & Mal Ledo',
      symptoms: ['Douler zounou & difikilte pou marse', 'Douler lans ki bloke', 'Mal ledo for & kolonn', 'Zointir ferm / gonfle', 'Sanz zounou / protez'],
      keywords: ['zounou', 'lans', 'lezo', 'zointir', 'ledo', 'kolonn', 'marse', 'loperasion zounou', 'protez', 'artroz', 'kase']
    }
  },
  'sp-transplant': {
    en: {
      badge: '🫀 Organ Transplants',
      plainName: 'Kidney, Liver & LVAD',
      symptoms: ['End-stage kidney failure / dialysis', 'Elevated creatinine levels', 'Liver cirrhosis / end-stage disease', 'Advanced heart failure / LVAD', 'Donor matching required'],
      keywords: ['kidney', 'liver', 'transplant', 'transplantation', 'dialysis', 'renal', 'donor', 'failure', 'creatinine', 'cirrhosis', 'organ', 'lvad', 'heart transplant']
    },
    fr: {
      badge: '🫀 Greffes d\'Organes',
      plainName: 'Greffe Rein, Foie & LVAD',
      symptoms: ['Insuffisance rénale terminale / dialyse', 'Créatinine très élevée', 'Cirrhose hépatique avancée', 'Insuffisance cardiaque / assistance LVAD', 'Recherche de compatibilité donneur'],
      keywords: ['rein', 'foie', 'greffe', 'transplantation', 'dialyse', 'renal', 'donneur', 'creatinine', 'cirrhose', 'lvad']
    },
    kr: {
      badge: '🫀 Transplantasion Lorgann',
      plainName: 'Transplantasion Lerin & Fwa',
      symptoms: ['Lerin nepli marse / pe fer dializ', 'Kreatinn tro o', 'Problem fwa grav (sirroz)', 'Bizin enn doner lerin/fwa'],
      keywords: ['lerin', 'fwa', 'transplantasion', 'dializ', 'doner', 'kreatinn', 'lorgann']
    }
  },
  'sp-paediatrics': {
    en: {
      badge: '👶 Child & Paediatric Surgery',
      plainName: 'Children’s Medical & Surgery',
      symptoms: ['Congenital heart defects in children', 'Paediatric tumours / blood disorders', 'Congenital anatomical anomalies', 'Specialised child surgery'],
      keywords: ['child', 'children', 'baby', 'paediatric', 'pediatric', 'congenital', 'infant', 'asd', 'vsd', 'tetralogy', 'kids']
    },
    fr: {
      badge: '👶 Pédiatrie & Chirurgie Enfant',
      plainName: 'Soins Spécialisés Enfants',
      symptoms: ['Malformation cardiaque congénitale chez l\'enfant', 'Tumeurs pédiatriques', 'Anomalies anatomiques de naissance', 'Chirurgie infantile'],
      keywords: ['enfant', 'pediatrie', 'pédiatrie', 'bebe', 'bébé', 'congenital', 'congénital', 'nourrisson', 'cardiopathie']
    },
    kr: {
      badge: '👶 Swen & Sirirzi Zanfan',
      plainName: 'Swen Spesialize pou Zanfan',
      symptoms: ['Problem leker depi nesans', 'Kanser / maladi grav kot zanfan', 'Anomali depi nesans', 'Sirirzi spesial zanfan'],
      keywords: ['zanfan', 'bebe', 'pediatri', 'nesans', 'leker zanfan']
    }
  },
  'sp-haematology': {
    en: {
      badge: '🩸 Haematology & BMT',
      plainName: 'Blood Disorders & Bone Marrow',
      symptoms: ['Leukaemia / lymphoma diagnosis', 'Severe anaemia / thalassemia', 'Sickle cell disease', 'Need for bone marrow transplant'],
      keywords: ['blood', 'haematology', 'hematology', 'bone marrow', 'bmt', 'stem cell', 'leukaemia', 'leukemia', 'lymphoma', 'myeloma', 'thalassemia', 'sickle cell']
    },
    fr: {
      badge: '🩸 Hématologie & Moelle Osseuse',
      plainName: 'Troubles du Sang & Greffe Moelle',
      symptoms: ['Diagnostic de leucémie ou lymphome', 'Anémie sévère / thalassémie', 'Drépanocytose', 'Indication de greffe de moelle'],
      keywords: ['sang', 'hematologie', 'hématologie', 'moelle', 'cellules souches', 'leucemie', 'leucémie', 'lymphome', 'thalassemie', 'myelome']
    },
    kr: {
      badge: '🩸 Disan & Mwal Ose',
      plainName: 'Kanser Disan & Transplantasion Mwal',
      symptoms: ['Lesemi / Linfom (kanser disan)', 'Mank disan grav / Talasemi', 'Drepanozitose', 'Bizin transplantasion mwal ose'],
      keywords: ['disan', 'mwal ose', 'ematolozi', 'lesemi', 'linfom', 'talasemi']
    }
  },
  'sp-cosmetic': {
    en: {
      badge: '✨ Plastic & Reconstructive',
      plainName: 'Aesthetic & Reconstruction',
      symptoms: ['Post-mastectomy breast reconstruction', 'Burn scar or trauma reconstruction', 'Cleft lip & palate repair', 'Body contouring & rhinoplasty'],
      keywords: ['plastic', 'cosmetic', 'reconstructive', 'reconstruction', 'breast', 'mastectomy', 'rhinoplasty', 'aesthetic', 'burns', 'cleft']
    },
    fr: {
      badge: '✨ Chirurgie Plastique & Réparation',
      plainName: 'Reconstruction & Esthétique',
      symptoms: ['Reconstruction mammaire post-cancer', 'Séquelles de brûlures ou traumatismes', 'Fente labio-palatine', 'Remodelage et rhinoplastie'],
      keywords: ['plastique', 'esthetique', 'esthétique', 'reconstruction', 'mammaire', 'sein', 'rhinoplastie', 'brulure', 'cicatrice']
    },
    kr: {
      badge: '✨ Sirirzi Plastik & Estetik',
      plainName: 'Rekonstriksion & Estetik',
      symptoms: ['Rekonstriksion pwatrin apre kanser', 'Kikatri / Blesir grav', 'Labous fandi (bec de lievre)', 'Rhinoplastie ek estetik'],
      keywords: ['plastik', 'estetik', 'rekonstriksion', 'pwatrin', 'rhinoplastie']
    }
  },
  'sp-fertility': {
    en: {
      badge: '🧬 Fertility & IVF',
      plainName: 'IVF & Reproductive Care',
      symptoms: ['Inability to conceive after 1+ years', 'Recurrent IVF cycle failures', 'Low sperm count / male factor', 'Egg freezing / fertility preservation'],
      keywords: ['fertility', 'ivf', 'icsi', 'infertility', 'pregnancy', 'embryo', 'egg', 'sperm', 'blastocyst', 'reproductive', 'pgt']
    },
    fr: {
      badge: '🧬 Fertilité & FIV',
      plainName: 'PMA & Soins de la Fertilité',
      symptoms: ['Difficulté à concevoir depuis plus d\'1 an', 'Échecs répétés de FIV', 'Infertilité masculine ou féminine', 'Préservation d\'ovocytes'],
      keywords: ['fertilite', 'fertilité', 'fiv', 'icsi', 'pma', 'grossesse', 'embryon', 'ovocyte', 'sperme', 'infertilite', 'infertilité']
    },
    kr: {
      badge: '🧬 Fertilite & FIV',
      plainName: 'Swen pou Fer Zanfan (FIV)',
      symptoms: ['Pe gagne difikilte pou fer zanfan', 'FIV pa pe marse', 'Problem fertilite madam ouswa misie', 'Test fertilite konple'],
      keywords: ['fertilite', 'fiv', 'ivf', 'zanfan', 'reprodiksion']
    }
  },
  'sp-ophthalmology': {
    en: {
      badge: '👁️ Ophthalmology & Eyes',
      plainName: 'Eye Surgery & Vision Care',
      symptoms: ['Retinal detachment / floaters & flashes', 'Severe corneal disease / scarring', 'Advanced glaucoma / vision loss', 'Complex cataract & paediatric eye care'],
      keywords: ['eye', 'vision', 'ophthalmology', 'retina', 'cornea', 'cataract', 'glaucoma', 'vitrectomy', 'lasik', 'sankara']
    },
    fr: {
      badge: '👁️ Ophtalmologie & Yeux',
      plainName: 'Chirurgie Oculaire & Vision',
      symptoms: ['Décollement de rétine / éclairs visuels', 'Pathologies cornéennes sévères', 'Glaucome avancé', 'Cataracte complexe'],
      keywords: ['oeil', 'yeux', 'ophtalmologie', 'retine', 'rétine', 'cornee', 'cornée', 'cataracte', 'glaucome', 'vitrectomie', 'vision']
    },
    kr: {
      badge: '👁️ Lizie & Lazit',
      plainName: 'Swen & Sirirzi Lizie',
      symptoms: ['Problem retin / dekolman retin', 'Problem korne / bezwin gref', 'Glokom / katarak avanse', 'Bizin tretman lizie spesial'],
      keywords: ['lizie', 'retin', 'korne', 'katarak', 'glokom', 'oftalmolozi']
    }
  },
  'sp-urology': {
    en: {
      badge: '🫘 Urology & Nephrology',
      plainName: 'Kidneys, Bladder & Prostate',
      symptoms: ['Large or recurrent kidney stones', 'Prostate enlargement or PSA elevation', 'Blood in urine (haematuria)', 'Chronic kidney disease / dialysis access'],
      keywords: ['kidney', 'urology', 'nephrology', 'stone', 'stones', 'prostate', 'bladder', 'urine', 'rirs', 'lithotripsy', 'psa']
    },
    fr: {
      badge: '🫘 Urologie & Néphrologie',
      plainName: 'Reins, Vessie & Prostate',
      symptoms: ['Calculs rénaux récidivants', 'Adénome ou cancer de la prostate', 'Sang dans les urines', 'Maladie rénale chronique / fistule'],
      keywords: ['rein', 'urologie', 'nephrologie', 'néphrologie', 'calcul', 'calculs', 'prostate', 'vessie', 'urine', 'lithotripsie']
    },
    kr: {
      badge: '🫘 Urolozi & Lerin',
      plainName: 'Lerin, Vesi & Prostat',
      symptoms: ['Ros dan lerin / douler o rens', 'Problem prostat / difikilte pise', 'Disan dan pipi', 'Problem lerin'],
      keywords: ['lerin', 'urolozi', 'ros lerin', 'prostat', 'vesi', 'pipi']
    }
  },
  'sp-dental': {
    en: {
      badge: '🦷 Dental & Maxillofacial',
      plainName: 'Dental Implants & Jaw Care',
      symptoms: ['Missing multiple teeth / full arch loss', 'Severe jaw misalignment or trauma', 'Complex wisdom teeth impactions', 'Need for bone grafting and implants'],
      keywords: ['dental', 'teeth', 'tooth', 'implant', 'implants', 'jaw', 'maxillofacial', 'all-on-4', 'all-on-6', 'dentist']
    },
    fr: {
      badge: '🦷 Dentaire & Maxillo-Facial',
      plainName: 'Implants Dentaires & Mâchoire',
      symptoms: ['Perte de plusieurs dents / édentement', 'Décalage ou traumatisme de la mâchoire', 'Chirurgie maxillo-faciale', 'Pose d\'implants All-on-4 / All-on-6'],
      keywords: ['dentaire', 'dents', 'dent', 'implant', 'implants', 'machoire', 'mâchoire', 'maxillofacial', 'all-on-4']
    },
    kr: {
      badge: '🦷 Swen Lezan & Maswar',
      plainName: 'Inplan Lezan & Sirirzi Maswar',
      symptoms: ['Bann lezan finn manke / mank tou lezan', 'Problem maswar', 'Bizin inplan dantan fix', 'Swen dantan konple'],
      keywords: ['lezan', 'dan', 'inplan', 'maswar', 'dantis']
    }
  },
  'sp-pulmonology': {
    en: {
      badge: '🫁 Pulmonology & Lungs',
      plainName: 'Lungs, Chest & Thoracic Care',
      symptoms: ['Chronic severe cough or breathlessness', 'Lung nodule or mass on CT scan', 'Pleural effusion / chest pathology', 'Need for VATS keyhole lung surgery'],
      keywords: ['lung', 'lungs', 'pulmonology', 'pulmonary', 'chest', 'thoracic', 'vats', 'cough', 'breathing', 'ebus', 'copd', 'asthma']
    },
    fr: {
      badge: '🫁 Pneumologie & Thorax',
      plainName: 'Poumons, Respiration & Thorax',
      symptoms: ['Toux persistante ou essoufflement sévère', 'Nodule ou masse pulmonaire au scanner', 'Épanchement pleural', 'Chirurgie thoracique VATS'],
      keywords: ['poumon', 'poumons', 'pneumologie', 'thorax', 'thoracique', 'vats', 'toux', 'respiration', 'ebus', 'asthme']
    },
    kr: {
      badge: '🫁 Poumon & Pwatrin',
      plainName: 'Swen Poumon & Respirasion',
      symptoms: ['Tous pa pe pase / difikilte respire', 'Boule / niodil dan poumon lor scanner', 'Delo dan poumon', 'Sirirzi poumon mini-invazif'],
      keywords: ['poumon', 'pwatrin', 'tous', 'respire', 'pnomolozi']
    }
  },
  'sp-gynecology': {
    en: {
      badge: '👩 Women’s Health',
      plainName: 'Gynaecology & Fibroids',
      symptoms: ['Uterine fibroids causing heavy bleeding', 'Severe endometriosis & pelvic pain', 'Ovarian cysts or tumours', 'Minimally invasive hysterectomy needed'],
      keywords: ['women', 'gynecology', 'gynaecology', 'fibroid', 'fibroids', 'endometriosis', 'ovary', 'uterus', 'hysterectomy', 'laparoscopy']
    },
    fr: {
      badge: '👩 Santé Féminine & Gynécologie',
      plainName: 'Gynécologie, Fibromes & Pelvis',
      symptoms: ['Fibromes utérins avec saignements', 'Endométriose sévère & douleurs pelviennes', 'Kystes ovariens', 'Chirurgie gynécologique mini-invasive'],
      keywords: ['femme', 'gynecologie', 'gynécologie', 'fibrome', 'fibromes', 'endometriose', 'endométriose', 'ovaire', 'uterus', 'utérus', 'hysterectomie']
    },
    kr: {
      badge: '👩 Lasante Fam & Zinecolozi',
      plainName: 'Zinecolozi & Fibrom',
      symptoms: ['Fibrom ki pe koz boku saignement', 'Endometrioz ek douler bas-vant', "Kist lor l'ovair", 'Laparoskopi zinekolozik'],
      keywords: ['fam', 'zinecolozi', 'fibrom', 'endometrioz', 'uterus']
    }
  },
  'sp-gastroenterology': {
    en: {
      badge: '🩺 Gastroenterology & GI',
      plainName: 'Digestive, Liver & GI Surgery',
      symptoms: ['Chronic stomach pain or acid reflux', 'Jaundice / bile duct obstruction', 'Liver lesions or pancreatic disease', 'Colon polyps / colorectal surgery'],
      keywords: ['gastro', 'gastroenterology', 'digestive', 'liver', 'stomach', 'bowel', 'colon', 'pancreas', 'biliary', 'ercp', 'endoscopy', 'bariatric']
    },
    fr: {
      badge: '🩺 Gastroentérologie & Digestif',
      plainName: 'Appareil Digestif, Foie & Estomac',
      symptoms: ['Douleurs abdominales chroniques / reflux', 'Jaunisse / calculs de la voie biliaire', 'Pathologies du foie ou pancréas', 'Chirurgie colorectale / endoscopie'],
      keywords: ['gastro', 'gastroenterologie', 'gastroentérologie', 'digestif', 'foie', 'estomac', 'intestin', 'colon', 'pancreas', 'pancréas', 'cpre', 'endoscopie']
    },
    kr: {
      badge: '🩺 Gastroenterolozi & Lestoma',
      plainName: 'Lestoma, Fwa & Kanal Biler',
      symptoms: ['Douler lestoma / reflux ki pa pase', 'Lizone / blokaz kanal biler', 'Problem fwa ouswa pankreas', 'Endoskopi ek sirirzi lestoma'],
      keywords: ['lestoma', 'fwa', 'trip', 'gastro', 'endoskopi', 'ercp', 'pankreas']
    }
  },
};

export const QUICK_SYMPTOM_FILTERS = [
  { id: 'all', icon: '✨', label_en: 'All Specialties', label_fr: 'Toutes les Spécialités', label_kr: 'Tou Spesialite' },
  { id: 'sp-oncology', icon: '🎗️', label_en: 'Cancer Care', label_fr: 'Cancer & Tumeurs', label_kr: 'Kanser' },
  { id: 'sp-cardiology', icon: '❤️', label_en: 'Heart Care', label_fr: 'Cœur & Vaisseaux', label_kr: 'Leker' },
  { id: 'sp-orthopedics', icon: '🦴', label_en: 'Bones & Spine', label_fr: 'Os & Dos', label_kr: 'Lezo & Ledo' },
  { id: 'sp-neurology', icon: '🧠', label_en: 'Brain & Nerves', label_fr: 'Cerveau & AVC', label_kr: 'Laservel' },
  { id: 'sp-transplant', icon: '🫀', label_en: 'Transplants', label_fr: 'Greffes Rein/Foie', label_kr: 'Transplantasion' },
  { id: 'sp-haematology', icon: '🩸', label_en: 'Blood & BMT', label_fr: 'Moelle & Sang', label_kr: 'Disan & Mwal' },
  { id: 'sp-ophthalmology', icon: '👁️', label_en: 'Eye Surgery', label_fr: 'Ophtalmologie', label_kr: 'Lizie' },
  { id: 'sp-urology', icon: '🫘', label_en: 'Urology & Stones', label_fr: 'Urologie & Calculs', label_kr: 'Urolozi' },
  { id: 'sp-fertility', icon: '🧬', label_en: 'IVF & Fertility', label_fr: 'FIV & Fertilité', label_kr: 'FIV / Fertilite' },
];
