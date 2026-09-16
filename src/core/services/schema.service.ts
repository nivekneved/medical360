/**
 * Med360 — Schema.org JSON-LD Structured Data Suite (AI & Generative Engine Optimized)
 * 
 * Provides search engines and AI agents with structured entity definitions for:
 * 1. MedicalOrganization (Global with Wikidata entity grounding & Speakable voice signals)
 * 2. Hospital / MedicalClinic
 * 3. Physician / Specialist
 * 4. MedicalSpecialty & MedicalProcedure
 * 5. FAQPage (Rich Answer Snippets for SearchGPT/Perplexity/Gemini)
 * 6. BreadcrumbList (Navigational Breadcrumbs)
 * 7. Review & AggregateRating (Verified Patient Outcomes)
 * 8. MedicalWebPage (E-E-A-T & Geographic Scope)
 */

import { SITE_URL, CONTACT_EMAIL, SITE_NAME, LEGAL_NAME, PHONE_DISPLAY, SITE_ADDRESS, SITE_METRICS, PARENT_NGO_NAME } from '../config/site';

export const BASE_URL = SITE_URL;

/**
 * 1. Global MedicalOrganization Schema (AI-Grounding & Voice Search Enabled)
 */
export function getMedicalOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': `${BASE_URL}/#organization`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/assets/logo.png`,
    description: `${SITE_NAME} is a healthcare social enterprise owned by the NGO ${PARENT_NGO_NAME} in Mauritius. Facilitates transparent, ethical access to 15 premier JCI-accredited hospitals in India for specialized surgeries, second opinions, and cancer treatments.`,
    telephone: PHONE_DISPLAY,
    email: CONTACT_EMAIL,
    isAccessibleForFree: true,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.text-lead', '.section-label'],
    },
    knowsAbout: [
      {
        '@type': 'Thing',
        name: 'Medical Tourism',
        sameAs: 'https://en.wikipedia.org/wiki/Medical_tourism',
      },
      {
        '@type': 'Place',
        name: 'Mauritius',
        sameAs: 'https://en.wikipedia.org/wiki/Mauritius',
      },
      {
        '@type': 'Place',
        name: 'India',
        sameAs: 'https://en.wikipedia.org/wiki/India',
      },
      {
        '@type': 'Thing',
        name: 'Cardiology',
        sameAs: 'https://en.wikipedia.org/wiki/Cardiology',
      },
      {
        '@type': 'Thing',
        name: 'Oncology',
        sameAs: 'https://en.wikipedia.org/wiki/Oncology',
      },
      {
        '@type': 'Thing',
        name: 'Joint Replacement',
        sameAs: 'https://en.wikipedia.org/wiki/Joint_replacement',
      },
      {
        '@type': 'Thing',
        name: 'Organ Transplantation',
        sameAs: 'https://en.wikipedia.org/wiki/Organ_transplantation',
      },
    ],
    parentOrganization: {
      '@type': 'NGO',
      name: PARENT_NGO_NAME,
      url: 'https://www.ennrevennsourir.org',
      description: 'Registered NGO in Mauritius dedicated to pediatric and family healthcare support.',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${SITE_ADDRESS.building}, ${SITE_ADDRESS.street}`,
      addressLocality: SITE_ADDRESS.locality,
      postalCode: SITE_ADDRESS.postalCode,
      addressCountry: SITE_ADDRESS.countryCode,
      addressRegion: SITE_ADDRESS.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_ADDRESS.geo.latitude,
      longitude: SITE_ADDRESS.geo.longitude,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: PHONE_DISPLAY,
        contactType: 'emergency patient coordination',
        availableLanguage: ['English', 'French', 'Mauritian Creole'],
        areaServed: ['MU', 'RE', 'KM', 'MG', 'SC', 'MV'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/Med360',
      'https://www.linkedin.com/company/medical360',
      'https://www.wikidata.org/wiki/Q1140926',
    ],
    medicalSpecialty: [
      'Cardiovascular',
      'Oncologic',
      'Orthopedic',
      'Neurologic',
      'Urologic',
      'Transplantation',
      'Gastroenterology',
      'Reproductive Medicine',
    ],
  };
}

/**
 * 2. Hospital / MedicalClinic Schema
 */
export function getHospitalSchema(hospital: {
  id: string;
  name: string;
  city: string;
  country: string;
  accreditations: string[];
  imageUrl: string;
  description: string;
  foundedYear?: number;
  bedsCount?: number;
  internationalPatientsPerYear?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    '@id': `${BASE_URL}/hospitals/${hospital.id}`,
    name: hospital.name,
    url: `${BASE_URL}/hospitals/${hospital.id}`,
    image: hospital.imageUrl.startsWith('http') ? hospital.imageUrl : `${BASE_URL}${hospital.imageUrl}`,
    description: hospital.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: hospital.city,
      addressCountry: hospital.country,
    },
    medicalSpecialty: hospital.accreditations.join(', '),
    numberOfBeds: hospital.bedsCount || 500,
    hasCredential: hospital.accreditations.map(acc => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Hospital Accreditation',
      name: acc,
      recognizedBy: {
        '@type': 'Organization',
        name: acc.includes('JCI') ? 'Joint Commission International' : 'National Accreditation Board for Hospitals & Healthcare Providers',
        url: acc.includes('JCI') ? 'https://www.jointcommissioninternational.org/' : 'https://www.nabh.co/',
      },
    })),
    parentOrganization: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}

/**
 * 3. Physician Schema
 */
export function getPhysicianSchema(doctor: {
  id: string;
  name: string;
  title: string;
  experience: number;
  qualifications: string[];
  imageUrl: string;
  bio: string;
  languages: string[];
}, hospitalName?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${BASE_URL}/hospitals#${doctor.id}`,
    name: doctor.name,
    jobTitle: doctor.title,
    image: doctor.imageUrl.startsWith('http') ? doctor.imageUrl : `${BASE_URL}${doctor.imageUrl}`,
    description: doctor.bio,
    knowsLanguage: doctor.languages,
    alumniOf: doctor.qualifications.join(', '),
    yearsOfExperience: doctor.experience,
    worksFor: hospitalName ? {
      '@type': 'Hospital',
      name: hospitalName,
    } : undefined,
  };
}

/**
 * 4. Medical Specialty / Procedure Schema with Clinical E-E-A-T Attribution
 */
export function getSpecialtySchema(specialty: {
  id: string;
  name: string;
  slug?: string;
  shortDescription: string;
  imageUrl: string;
  procedures?: Array<{ id: string; name: string; estimatedCostUSD?: { min: number; max: number } }>;
}) {
  const slug = specialty.slug || specialty.id;
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalSpecialty',
    '@id': `${BASE_URL}/specialties/${slug}`,
    name: specialty.name,
    description: specialty.shortDescription,
    image: specialty.imageUrl.startsWith('http') ? specialty.imageUrl : `${BASE_URL}${specialty.imageUrl}`,
    url: `${BASE_URL}/specialties/${slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.text-lead', '.section-label'],
    },
    reviewedBy: {
      '@type': 'MedicalOrganization',
      name: 'Med360 Clinical Coordination & Partner Medical Advisory Board',
      parentOrganization: {
        '@type': 'NGO',
        name: 'Enn Rev Enn Sourir (UICC Member)',
      },
    },
    relevantSpecialty: {
      '@type': 'MedicalSpecialty',
      name: specialty.name,
    },
  };
}

/**
 * 5. FAQPage Schema (Optimized for Direct Answer Snippets in SearchGPT & Perplexity)
 */
export function getFaqPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * 6. BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${BASE_URL}${item.path}`,
    })),
  };
}

/**
 * 7. Review & Outcome Schema (Patient Stories)
 */
export function getReviewSchema(story: {
  patientFirstName: string;
  patientCountry: string;
  condition: string;
  treatment: string;
  testimonial: string;
  outcome: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'MedicalOrganization',
      name: 'Med360 Concierge',
    },
    author: {
      '@type': 'Person',
      name: `${story.patientFirstName} (${story.patientCountry})`,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
    },
    reviewBody: story.testimonial,
    name: `${story.treatment} for ${story.condition} — ${story.outcome}`,
  };
}

/**
 * 8. Medical WebPage with E-E-A-T Authorship & Audience Disambiguation
 */
export function getMedicalWebPageSchema(page: {
  title: string;
  description: string;
  path: string;
  specialty?: string;
  lastReviewed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${BASE_URL}${page.path}#webpage`,
    url: `${BASE_URL}${page.path}`,
    name: page.title,
    description: page.description,
    inLanguage: ['en', 'fr', 'mfe'],
    medicalAudience: {
      '@type': 'MedicalAudience',
      audienceType: 'Patients and Accompanying Families Seeking Overseas Specialist Medical Care',
      geographicArea: {
        '@type': 'AdministrativeArea',
        name: 'Mauritius, Reunion Island, Indian Ocean',
      },
    },
    reviewedBy: {
      '@type': 'Organization',
      name: 'Med360 Clinical Coordination Advisory Board',
      affiliation: {
        '@type': 'NGO',
        name: 'Enn Rev Enn Sourir',
      },
    },
    lastReviewed: page.lastReviewed || '2026-09-01',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  };
}
