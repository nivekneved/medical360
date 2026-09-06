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
  'sp-cardiology': {
    en: {
      badge: '❤️ Heart & Circulation',
      plainName: 'Heart & Chest Care',
      symptoms: ['Chest pain or pressure', 'Shortness of breath', 'High blood pressure', 'Heart palpitations', 'Bypass & valve issues'],
      keywords: ['heart', 'chest', 'breath', 'breathing', 'pressure', 'cardiac', 'cardiology', 'bypass', 'artery', 'stent', 'valve', 'tavi', 'cabg', 'attack', 'palpitation', 'pulse', 'angioplasty']
    },
    fr: {
      badge: '❤️ Cœur & Vaisseaux',
      plainName: 'Soins du Cœur & Poitrine',
      symptoms: ['Douleur ou oppression dans la poitrine', 'Essoufflement rapide', 'Tension artérielle élevée', 'Palpitations cardiaques', 'Pontage & valves'],
      keywords: ['coeur', 'cœur', 'poitrine', 'souffle', 'essoufflement', 'tension', 'cardiaque', 'cardiologie', 'pontage', 'artere', 'artère', 'stent', 'valve', 'infarctus', 'angioplastie', 'palpitations']
    },
    kr: {
      badge: '❤️ Leker & Disan',
      plainName: 'Swen Leker & Poitrine',
      symptoms: ['Douler / pwa lor poitrine', 'Mank souf vit', 'Presion disan o', 'Leker bate for', 'Bypass & valv leker'],
      keywords: ['leker', 'poitrine', 'souf', 'presion', 'disan', 'bypass', 'stent', 'valv', 'atak leker', 'douler leker']
    }
  },
  'sp-oncology': {
    en: {
      badge: '🎗️ Cancer Care & Tumors',
      plainName: 'Cancer & Tumor Treatments',
      symptoms: ['Abnormal lump or mass', 'Sudden unexplained weight loss', 'Tumor diagnosis', 'Need for chemotherapy / radiotherapy', 'Biopsy review'],
      keywords: ['cancer', 'tumor', 'tumour', 'lump', 'mass', 'chemo', 'chemotherapy', 'radiation', 'radiotherapy', 'oncology', 'leukemia', 'lymphoma', 'bone marrow', 'cyberknife', 'biopsy']
    },
    fr: {
      badge: '🎗️ Soins du Cancer & Tumeurs',
      plainName: 'Traitements du Cancer & Tumeurs',
      symptoms: ['Grosseur ou masse anormale', 'Perte de poids soudaine', 'Diagnostic de tumeur', 'Besoin de chimiothérapie / radiothérapie', 'Revue de biopsie'],
      keywords: ['cancer', 'tumeur', 'grosseur', 'boule', 'masse', 'chimiotherapie', 'chimiothérapie', 'chimio', 'radiotherapie', 'radiothérapie', 'oncologie', 'leucemie', 'leucémie', 'moelle', 'biopsie']
    },
    kr: {
      badge: '🎗️ Swen Kanser & Timer',
      plainName: 'Tretman Kanser & Timer',
      symptoms: ['Enn boule / grosseur anormale', 'Perdi pwa vit san eseye', 'Timer / Kanser', 'Bizin simioterapi ouswa reyon', 'Test biopsi'],
      keywords: ['kanser', 'timer', 'boule', 'masse', 'simio', 'simioterapi', 'radioterapi', 'mwal ose', 'lesemi', 'biopsi']
    }
  },
  'sp-orthopedics': {
    en: {
      badge: '🦴 Bones, Joints & Spine',
      plainName: 'Joints, Knee & Back Pain',
      symptoms: ['Knee pain & walking difficulty', 'Severe hip stiffness', 'Chronic backache & spine issues', 'Shoulder / joint pain', 'Knee or hip replacement'],
      keywords: ['knee', 'hip', 'bone', 'joint', 'back', 'spine', 'walking', 'leg', 'shoulder', 'orthopedic', 'orthopedics', 'replacement', 'prosthetic', 'disc', 'tlif', 'cartilage', 'fracture', 'arthritis']
    },
    fr: {
      badge: '🦴 Os, Articulations & Dos',
      plainName: 'Genou, Hanche & Mal de Dos',
      symptoms: ['Douleur au genou & difficulté à marcher', 'Douleur et blocage de hanche', 'Mal de dos chronique & colonne', 'Articulations douloureuses', 'Prothèse genou / hanche'],
      keywords: ['genou', 'hanche', 'os', 'articulation', 'dos', 'colonne', 'marche', 'jambe', 'epaule', 'épaule', 'orthopedie', 'orthopédie', 'prothese', 'prothèse', 'disque', 'arthrose', 'fracture', 'rachis']
    },
    kr: {
      badge: '🦴 Lezo, Zointir & Ledo',
      plainName: 'Zounou, Lans & Mal Ledo',
      symptoms: ['Douler zounou & difikilte pou marse', 'Douler lans ki bloke', 'Mal ledo for & kolonn', 'Zointir ferm / gonfle', 'Sanz zounou / protez'],
      keywords: ['zounou', 'lans', 'lezo', 'zointir', 'ledo', 'kolonn', 'marse', 'loperasion zounou', 'protez', 'artroz', 'kase']
    }
  },
  'sp-neurology': {
    en: {
      badge: '🧠 Brain, Spine & Nerves',
      plainName: 'Brain, Nerves & Stroke Care',
      symptoms: ['Severe persistent headaches', 'Numbness or tingling in limbs', 'Stroke recovery & paralysis', 'Seizures & epilepsy', 'Involuntary tremors / Parkinson'],
      keywords: ['brain', 'head', 'headache', 'nerve', 'neurology', 'neurosurgery', 'stroke', 'paralysis', 'seizure', 'epilepsy', 'parkinson', 'memory', 'spine', 'tremor', 'dizziness']
    },
    fr: {
      badge: '🧠 Cerveau, Nerfs & Colonne',
      plainName: 'Cerveau, Nerfs & Suites d\'AVC',
      symptoms: ['Maux de tête violents ou persistants', 'Engourdissements ou perte de force', 'Récupération après un AVC', 'Crises d\'épilepsie', 'Tremblements / maladie de Parkinson'],
      keywords: ['cerveau', 'tete', 'tête', 'nerf', 'neurologie', 'neurochirurgie', 'avc', 'paralysie', 'epilepsie', 'épilepsie', 'parkinson', 'vertige', 'colonne', 'tremblement']
    },
    kr: {
      badge: '🧠 Laservel, Ner & Kolonn',
      plainName: 'Laservel, Ner & Apre Stroke',
      symptoms: ['Mal latet for ki pa pase', 'Lamen ouswa lipie angourdi', 'Swivi apre enn kout disan (stroke)', 'Kriz epilepsi', 'Lamen tranble / Parkinson'],
      keywords: ['laservel', 'latet', 'ner', 'neurolozi', 'stroke', 'paralize', 'epilepsi', 'parkinson', 'lavertiz', 'tranbleman']
    }
  },
  'sp-transplant': {
    en: {
      badge: '🔄 Organ Transplants & Kidneys',
      plainName: 'Kidney, Liver & Dialysis Care',
      symptoms: ['Kidney failure / currently on dialysis', 'High creatinine levels', 'Liver disease / cirrhosis', 'Need for an organ donor', 'Bone marrow transplant'],
      keywords: ['kidney', 'liver', 'transplant', 'transplantation', 'dialysis', 'renal', 'donor', 'failure', 'creatinine', 'cirrhosis', 'organ', 'bone marrow', 'nephrology']
    },
    fr: {
      badge: '🔄 Greffes d\'Organes & Reins',
      plainName: 'Reins, Foie & Dialyse',
      symptoms: ['Insuffisance rénale / séances de dialyse', 'Taux de créatinine trop élevé', 'Maladie hépatique / cirrhose', 'Recherche d\'une greffe', 'Greffe de moelle osseuse'],
      keywords: ['rein', 'foie', 'greffe', 'transplantation', 'dialyse', 'renale', 'rénale', 'donneur', 'creatinine', 'créatinine', 'cirrhose', 'organe', 'moelle', 'nephrologie']
    },
    kr: {
      badge: '🔄 Transplantasion Lerin & Fwa',
      plainName: 'Lerin, Fwa & Dializ',
      symptoms: ['Lerin pa marse / bizin fer dializ', 'Kreatinin tro o', 'Problem fwa / sirhoz', 'Bizin enn gref lerin ouswa fwa', 'Transplantasion mwal ose'],
      keywords: ['lerin', 'fwa', 'gref', 'transplantasion', 'dializ', 'rein', 'kreatinin', 'mwal ose', 'doner']
    }
  },
  'sp-ivf': {
    en: {
      badge: '👶 Fertility, IVF & Baby Care',
      plainName: 'Fertility & Having a Baby',
      symptoms: ['Difficulty conceiving / getting pregnant', 'Multiple failed pregnancies', 'Male or female fertility concerns', 'IVF (In Vitro) consultation', 'Egg freezing'],
      keywords: ['baby', 'pregnant', 'fertility', 'infertility', 'ivf', 'icsi', 'egg', 'sperm', 'pregnancy', 'maternity', 'conceive', 'twins', 'gynecology', 'child']
    },
    fr: {
      badge: '👶 Fertilité, FIV & Maternité',
      plainName: 'Aide à la Grossesse & Fertilité',
      symptoms: ['Difficulté à concevoir ou tomber enceinte', 'Fausses couches à répétition', 'Problème de fertilité femme ou homme', 'Demande de FIV (fécondation)', 'Préservation d\'ovocytes'],
      keywords: ['bebe', 'bébé', 'enceinte', 'fertilite', 'fertilité', 'infertilite', 'infertilité', 'fiv', 'icsi', 'ovule', 'sperme', 'grossesse', 'maternite', 'maternité', 'concevoir', 'gynecologie']
    },
    kr: {
      badge: '👶 Gagn Zanfan & FIV',
      plainName: 'Gagn Zanfan & Swen Fertilite',
      symptoms: ['Difikilte pou tom ansent / gagn zanfan', 'Bann fos kous repete', 'Problem fertilite madam ouswa misie', 'Anvi fer FIV (In-Vitro)', 'Prezerv fertilite'],
      keywords: ['zanfan', 'baba', 'ansent', 'fertilite', 'fiv', 'in-vitro', 'icsi', 'grosesse', 'matenite']
    }
  },
  'sp-cosmetic': {
    en: {
      badge: '✨ Weight Loss & Reconstruction',
      plainName: 'Weight Loss Surgery & Body Care',
      symptoms: ['Severe obesity / gastric sleeve needed', 'Nose breathing difficulty & reshaping', 'Reconstruction after injury / burn', 'Body contouring'],
      keywords: ['weight', 'bariatric', 'sleeve', 'gastric', 'obesity', 'nose', 'rhinoplasty', 'plastic', 'cosmetic', 'skin', 'reconstruction', 'contouring']
    },
    fr: {
      badge: '✨ Perte de Poids & Réparation',
      plainName: 'Chirurgie Bariatrique & Réparation',
      symptoms: ['Surpoids important / chirurgie sleeve', 'Gêne respiratoire ou forme du nez', 'Reconstruction après accident ou brûlure', 'Remodelage corporel'],
      keywords: ['poids', 'bariatrique', 'sleeve', 'gastrique', 'obesite', 'obésité', 'nez', 'rhinoplastie', 'plastique', 'esthetique', 'esthétique', 'peau', 'reconstruction']
    },
    kr: {
      badge: '✨ Bais Pwa & Sirirzi Reparatris',
      plainName: 'Bais Pwa & Reparasion Lekor',
      symptoms: ['Trop gros / bizin loperasion lestoma (sleeve)', 'Difikilte respire ar nene / sanz form', 'Repar lekor apre blesir ouswa brile', 'Estetik'],
      keywords: ['pwa', 'bariatrik', 'sleeve', 'lestoma', 'gros', 'nene', 'rinoplasti', 'plastik', 'estetik', 'brile']
    }
  },
  'sp-ophthalmology': {
    en: {
      badge: '👁️ Eyes & Vision Care',
      plainName: 'Eye Care, Cataracts & LASIK',
      symptoms: ['Blurry or cloudy vision', 'Cataract obstruction', 'Desire to remove glasses (LASIK)', 'Retina or glaucoma diagnosis', 'Eye pain or pressure'],
      keywords: ['eye', 'eyes', 'vision', 'sight', 'see', 'blur', 'blurry', 'cataract', 'lasik', 'glasses', 'glaucoma', 'retina', 'cornea', 'ophthalmology']
    },
    fr: {
      badge: '👁️ Yeux & Soins de la Vue',
      plainName: 'Yeux, Cataracte & Laser LASIK',
      symptoms: ['Vision floue ou voile devant les yeux', 'Gêne liée à une cataracte', 'Souhait de ne plus porter de lunettes (LASIK)', 'Glaucome ou problème de rétine', 'Douleur ou tension oculaire'],
      keywords: ['oeil', 'yeux', 'vue', 'vision', 'flou', 'cataracte', 'lasik', 'lunettes', 'glaucome', 'retine', 'rétine', 'cornee', 'cornée', 'ophtalmologie', 'myopie']
    },
    kr: {
      badge: '👁️ Lizie & Swen Vizion',
      plainName: 'Swen Lizie, Katarak & LASIK',
      symptoms: ['Trouv flou / enn vwal devan lizie', 'Problem katarak', 'Anvi tir linet ar laser LASIK', 'Glokom ouswa problem retinn', 'Douler dan lizie'],
      keywords: ['lizie', 'vizion', 'flou', 'katarak', 'lasik', 'linet', 'retinn', 'oftalmolozi', 'glokom']
    }
  }
};

export const QUICK_SYMPTOM_FILTERS = [
  { id: 'all', label_en: 'All Specialties', label_fr: 'Toutes les Spécialités', label_kr: 'Tou Spesialite', icon: '🩺' },
  { id: 'sp-cardiology', label_en: 'Heart & Chest', label_fr: 'Cœur & Poitrine', label_kr: 'Leker & Poitrine', icon: '❤️' },
  { id: 'sp-orthopedics', label_en: 'Bones & Knee Pain', label_fr: 'Genou, Dos & Os', label_kr: 'Zounou, Ledo & Lezo', icon: '🦴' },
  { id: 'sp-oncology', label_en: 'Cancer Care & Tumors', label_fr: 'Cancer & Tumeurs', label_kr: 'Kanser & Timer', icon: '🎗️' },
  { id: 'sp-neurology', label_en: 'Brain & Spine', label_fr: 'Cerveau & Nerfs', label_kr: 'Laservel & Ner', icon: '🧠' },
  { id: 'sp-ivf', label_en: 'Having a Baby / IVF', label_fr: 'Bébé & Fertilité', label_kr: 'Gagn Zanfan / FIV', icon: '👶' },
  { id: 'sp-transplant', label_en: 'Kidneys & Transplants', label_fr: 'Reins & Greffes', label_kr: 'Lerin & Gref', icon: '🔄' },
  { id: 'sp-ophthalmology', label_en: 'Eyes & Vision', label_fr: 'Yeux & Cataracte', label_kr: 'Lizie & Katarak', icon: '👁️' },
  { id: 'sp-cosmetic', label_en: 'Weight Loss & Nose', label_fr: 'Perte de Poids (Sleeve)', label_kr: 'Bais Pwa & Nene', icon: '✨' },
];
