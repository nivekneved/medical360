export const SITE_URL: string = ((import.meta.env.VITE_SITE_URL as string | undefined) || 'https://www.med360.mu').replace(/\/+$/, '');

export const SITE_NAME = 'Med360';
export const LEGAL_NAME = 'Med360 Ltd';
export const PARENT_NGO_NAME = 'Enn Rev Enn Sourir';

export const CONTACT_EMAIL = 'info@med360.mu';
export const PRIVACY_EMAIL = 'privacy@med360.mu';

export const PHONE_RAW = '23059188275';
export const PHONE_DISPLAY = '+230 5918 8275';
export const PHONE_PREFIX_DEFAULT = '+230 ';
export const WHATSAPP_NUMBER = '23059188275';
export const WHATSAPP_DISPLAY = '+230 5918 8275';

export const SITE_ADDRESS = {
  name: 'Med360',
  building: 'Sedeco Ltée, 4ème étage, IKS Building',
  street: 'Cnr R. Seeneevassen & Farquhar Streets',
  locality: 'Port-Louis',
  postalCode: '11613',
  country: 'Mauritius',
  countryCode: 'MU',
  full: 'Sedeco Ltée, 4ème étage, IKS Building, Cnr R. Seeneevassen & Farquhar Streets, Port-Louis 11613, Mauritius',
  short: 'Sedeco Ltée, 4ème étage, IKS Building, Port-Louis 11613, Mauritius',
  geo: {
    latitude: -20.1609,
    longitude: 57.5012,
  },
  mapEmbedUrl: 'https://maps.google.com/maps?q=IKS+Building,+Cnr+R.+Seeneevassen+%26+Farquhar+Streets,+Port+Louis,+Mauritius&t=&z=16&ie=UTF8&iwloc=&output=embed',
  mapDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=IKS+Building+Farquhar+Street+Port+Louis+Mauritius',
};

export const OPERATING_HOURS = {
  en: 'Monday – Saturday: 8:00 AM – 7:00 PM (MUT)\nWhatsApp helpline active 7 days a week',
  fr: 'Lundi – Samedi : 08h00 – 19h00 (MUT)\nService d\'astreinte WhatsApp actif 7j/7',
  kr: 'Lindi - Samdi: 08:00 - 19:00 (MUT)\nWhatsApp ouver 7 zour lor 7',
};

export const SITE_METRICS = {
  patientsAssistedEn: '+3,000',
  patientsAssistedFr: '+3 000',
  partnerHospitals: '15',
  yearsExperience: '10+',
  impactPercent: '100%',
  foundationYear: '2016',
};

export const DEFAULT_MUR_RATE = 46.5;

export interface MedicalHub {
  id: string;
  label: string;
  label_fr: string;
  label_kr: string;
}

export const INDIAN_HUBS: MedicalHub[] = [
  { id: 'all', label: 'All Cities & Hubs', label_fr: 'Toutes les Villes', label_kr: 'Tou Lavil' },
  { id: 'Chennai', label: 'Chennai', label_fr: 'Chennai', label_kr: 'Chennai' },
  { id: 'Bengaluru', label: 'Bengaluru', label_fr: 'Bengaluru', label_kr: 'Bengaluru' },
  { id: 'Hyderabad', label: 'Hyderabad & Secunderabad', label_fr: 'Hyderabad & Secunderabad', label_kr: 'Hyderabad' },
  { id: 'Mumbai', label: 'Mumbai', label_fr: 'Mumbai', label_kr: 'Mumbai' },
  { id: 'Delhi', label: 'New Delhi & Gurugram (NCR)', label_fr: 'New Delhi & Gurugram (NCR)', label_kr: 'New Delhi & Gurugram' },
];

export const LEGAL_CONSTANTS = {
  lastUpdatedEn: 'September 2026',
  lastUpdatedFr: 'Septembre 2026',
  complianceEn: 'Mauritius Data Protection Act 2017 & GDPR',
  complianceFr: 'Data Protection Act 2017 (Maurice) & RGPD',
};


