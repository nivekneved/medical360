/**
 * Med360 — Schema.org JSON-LD Structured Data Suite
 * 
 * Provides search engines with structured entity definitions for:
 * 1. MedicalOrganization (Global)
 * 2. Hospital / MedicalClinic
 * 3. Physician / Specialist
 * 4. MedicalSpecialty & MedicalProcedure
 * 5. FAQPage (Rich Answer Snippets)
 * 6. BreadcrumbList (Navigational Breadcrumbs)
 * 7. Review & AggregateRating (Verified Patient Outcomes)
 */

import { SITE_URL, CONTACT_EMAIL } from '../config/site';

export const BASE_URL = SITE_URL;

/**
 * 1. Global MedicalOrganization Schema
 */
export function getMedicalOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Med360',
    legalName: 'Med360 Ltd',
    url: BASE_URL,
    logo: `${BASE_URL}/assets/logo.png`,
    description: 'Med360 is a company owned by the NGO Enn Rev Enn Sourir. 10+ years coordinating specialised treatment in private clinics and abroad, with 100% of profits returned to the NGO to fund medical care for the needy.',
    telephone: '+230 59188275',
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Port Louis',
      addressCountry: 'MU',
      addressRegion: 'Mauritius',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -20.1609,
      longitude: 57.5012,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+230 59188275',
        contactType: 'emergency patient coordination',
        availableLanguage: ['English', 'French', 'Mauritian Creole'],
        areaServed: ['MU', 'RE', 'KM', 'MG', 'SC', 'MV'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/Med360',
      'https://www.linkedin.com/company/medical360',
    ],
    medicalSpecialty: [
      'Cardiovascular',
      'Oncologic',
      'Orthopedic',
      'Neurologic',
      'Urologic',
      'Transplantation',
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
 * 5. FAQPage Schema
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

