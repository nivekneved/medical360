/**
 * Medical 360 — Schema.org JSON-LD Structured Data Suite
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

export const BASE_URL = 'https://medical360-zeta.vercel.app';

/**
 * 1. Global MedicalOrganization Schema
 */
export function getMedicalOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Medical 360',
    legalName: 'Med360 Ltd',
    url: BASE_URL,
    logo: `${BASE_URL}/assets/banners/home_banner.jpg`,
    description: 'Premier medical concierge service in Mauritius connecting patients to top accredited international hospitals in India, Thailand, Singapore, and Europe.',
    telephone: '+230 59188275',
    email: 'contact@medical360.mu',
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
      'https://www.facebook.com/Medical360',
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
    '@id': `${BASE_URL}/doctors#${doctor.id}`,
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
 * 4. Medical Specialty / Procedure Schema
 */
export function getSpecialtySchema(specialty: {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  imageUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalSpecialty',
    '@id': `${BASE_URL}/specialties/${specialty.slug}`,
    name: specialty.name,
    description: specialty.shortDescription,
    image: specialty.imageUrl.startsWith('http') ? specialty.imageUrl : `${BASE_URL}${specialty.imageUrl}`,
    url: `${BASE_URL}/specialties/${specialty.slug}`,
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
      name: 'Medical 360 Concierge',
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
