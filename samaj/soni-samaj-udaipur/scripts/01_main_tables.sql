-- =====================================================
-- SONI SAMAJ UDAIPUR - MAIN TABLES SETUP
-- =====================================================

-- Drop existing tables
DROP TABLE IF EXISTS deleted_records CASCADE;
DROP TABLE IF EXISTS birthday_events CASCADE;
DROP TABLE IF EXISTS wishes CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- Members Table (Main Registration Data)
CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    marital_status VARCHAR(20) NOT NULL,
    current_address TEXT NOT NULL,
    district VARCHAR(255) NOT NULL,
    gotra_self VARCHAR(100) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    whatsapp_number VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    job_or_business VARCHAR(50) NOT NULL,
    satimata_place VARCHAR(255) NOT NULL,
    bheruji_place VARCHAR(255) NOT NULL,
    kuldevi_place VARCHAR(255) NOT NULL,
    registration_status VARCHAR(20) DEFAULT 'pending',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table (Contact Form Data)
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table (All Event Types)
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('badhai', 'shok', 'news')),
    image_url TEXT,
    event_date DATE,
    location VARCHAR(500),
    contact_number VARCHAR(15),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Birthday Events Table (Auto-generated from Members)
CREATE TABLE birthday_events (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    person_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    age INTEGER,
    mobile_number VARCHAR(15),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishes Table (Birthday Wishes)
CREATE TABLE wishes (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deleted Records Table (Soft Delete Archive)
CREATE TABLE deleted_records (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    record_data JSONB NOT NULL,
    deleted_by VARCHAR(255),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason TEXT
);

-- Create Indexes
CREATE INDEX idx_members_mobile ON members(mobile_number);
CREATE INDEX idx_members_status ON members(registration_status);
CREATE INDEX idx_members_birth_date ON members(date_of_birth);
CREATE INDEX idx_messages_read ON messages(is_read);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_published ON events(is_published);
CREATE INDEX idx_birthday_events_date ON birthday_events(birth_date);
CREATE INDEX idx_deleted_records_table ON deleted_records(table_name);