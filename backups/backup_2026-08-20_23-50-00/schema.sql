-- =============================================================================
-- Medical 360 Database DDL Schema
-- Generated: 2026-08-20T23:50:00+04:00
-- Compatible with: PostgreSQL 14+, SQLite 3.35+, MySQL 8.0+, Supabase, Neon
-- =============================================================================

-- 1. Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    address TEXT,
    beds_count INT DEFAULT 0,
    icu_beds INT DEFAULT 0,
    founded_year INT,
    rating DECIMAL(3,2) DEFAULT 4.80,
    review_count INT DEFAULT 0,
    international_patients_per_year INT DEFAULT 0,
    languages JSON,
    accreditations JSON,
    specialties JSON,
    gallery JSON,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Specialties Table
CREATE TABLE IF NOT EXISTS specialties (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    name_fr VARCHAR(150),
    name_kr VARCHAR(150),
    icon VARCHAR(64),
    featured BOOLEAN DEFAULT TRUE,
    short_description TEXT,
    overview TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Procedures Table
CREATE TABLE IF NOT EXISTS procedures (
    id VARCHAR(64) PRIMARY KEY,
    specialty_id VARCHAR(64) REFERENCES specialties(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    name_fr VARCHAR(200),
    cost_usd_min INT NOT NULL,
    cost_usd_max INT NOT NULL,
    typical_stay_days INT DEFAULT 5,
    recovery_time_weeks INT DEFAULT 4,
    description TEXT
);

-- 4. Doctors (The 7 Specialists) Table
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    title VARCHAR(200) NOT NULL,
    title_fr VARCHAR(200),
    hospital_id VARCHAR(64) REFERENCES hospitals(id) ON DELETE SET NULL,
    experience_years INT DEFAULT 15,
    surgeries INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 4.90,
    reviews_count INT DEFAULT 0,
    consultation_fee_usd INT DEFAULT 60,
    languages JSON,
    degrees JSON,
    awards JSON,
    featured BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Doctor-Specialties Junction
CREATE TABLE IF NOT EXISTS doctor_specialties (
    doctor_id VARCHAR(64) REFERENCES doctors(id) ON DELETE CASCADE,
    specialty_id VARCHAR(64) REFERENCES specialties(id) ON DELETE CASCADE,
    PRIMARY KEY (doctor_id, specialty_id)
);

-- 6. Patient Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
    id VARCHAR(64) PRIMARY KEY,
    patient_first_name VARCHAR(100) NOT NULL,
    patient_country VARCHAR(100) NOT NULL,
    specialty_id VARCHAR(64) REFERENCES specialties(id) ON DELETE SET NULL,
    hospital_id VARCHAR(64) REFERENCES hospitals(id) ON DELETE SET NULL,
    doctor_id VARCHAR(64) REFERENCES doctors(id) ON DELETE SET NULL,
    condition TEXT NOT NULL,
    treatment TEXT NOT NULL,
    cost_saved_percent INT DEFAULT 60,
    recovery_time_weeks INT DEFAULT 4,
    testimonial TEXT NOT NULL,
    testimonial_fr TEXT,
    year INT DEFAULT 2025,
    featured BOOLEAN DEFAULT TRUE,
    rating INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Patient Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(64) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    country_of_residence VARCHAR(100) NOT NULL,
    specialty_id VARCHAR(64),
    preferred_hospital_id VARCHAR(64),
    preferred_country VARCHAR(100),
    urgency VARCHAR(30) DEFAULT 'routine',
    description TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'new',
    assigned_to VARCHAR(100),
    documents JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Inquiry Notes Table
CREATE TABLE IF NOT EXISTS inquiry_notes (
    id VARCHAR(64) PRIMARY KEY,
    inquiry_id VARCHAR(64) REFERENCES inquiries(id) ON DELETE CASCADE,
    author_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'case_manager',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Multi-Lingual CMS Pages Table
CREATE TABLE IF NOT EXISTS cms_pages (
    id VARCHAR(64) PRIMARY KEY,
    page_key VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    content JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Indexes for Performance ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_hospitals_country ON hospitals(country);
CREATE INDEX IF NOT EXISTS idx_hospitals_featured ON hospitals(featured);
CREATE INDEX IF NOT EXISTS idx_procedures_specialty ON procedures(specialty_id);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_urgency ON inquiries(urgency);
CREATE INDEX IF NOT EXISTS idx_inquiry_notes_inquiry ON inquiry_notes(inquiry_id);
