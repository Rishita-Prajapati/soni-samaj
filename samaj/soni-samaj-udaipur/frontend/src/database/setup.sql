-- Create members table
CREATE TABLE IF NOT EXISTS members (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    marital_status VARCHAR(20) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    whatsapp_number VARCHAR(15) NOT NULL,
    current_address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    job_or_business VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    gotra_self VARCHAR(50) NOT NULL,
    registration_status VARCHAR(20) DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishes table
CREATE TABLE IF NOT EXISTS wishes (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district_id BIGINT REFERENCES districts(id)
);

-- Create sangathan_positions table
CREATE TABLE IF NOT EXISTS sangathan_positions (
    id BIGSERIAL PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL,
    hierarchy_level INTEGER NOT NULL
);

-- Create sangathan_members table
CREATE TABLE IF NOT EXISTS sangathan_members (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    position_id BIGINT REFERENCES sangathan_positions(id),
    city_id BIGINT REFERENCES cities(id),
    appointed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO districts (name) VALUES ('Udaipur'), ('Jaipur'), ('Jodhpur') ON CONFLICT (name) DO NOTHING;
INSERT INTO cities (name, district_id) VALUES ('Udaipur City', 1), ('Jaipur City', 2), ('Jodhpur City', 3);
INSERT INTO sangathan_positions (position_name, hierarchy_level) VALUES ('President', 1), ('Secretary', 2), ('Treasurer', 3);