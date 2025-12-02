-- =====================================================
-- SONI SAMAJ UDAIPUR - COMPLETE DATABASE SETUP
-- =====================================================

-- Drop existing tables
DROP TABLE IF EXISTS wishes CASCADE;
DROP TABLE IF EXISTS birthday_events CASCADE;
DROP TABLE IF EXISTS sangathan CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS shok CASCADE;
DROP TABLE IF EXISTS badhai CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS members CASCADE;

-- Members Table
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
    profile_image_url TEXT,
    profile_image_filename VARCHAR(255),
    registration_status VARCHAR(20) DEFAULT 'pending',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
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

-- Badhai Events Table
CREATE TABLE badhai (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    celebration_person_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    occasion_type VARCHAR(100) NOT NULL,
    occasion_date DATE,
    image_url TEXT,
    image_filename VARCHAR(255),
    event_date DATE,
    location VARCHAR(500),
    contact_number VARCHAR(15),
    additional_notes TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shok Events Table
CREATE TABLE shok (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    deceased_name VARCHAR(255) NOT NULL,
    deceased_father_name VARCHAR(255),
    deceased_mother_name VARCHAR(255),
    age_at_death INTEGER,
    date_of_death DATE,
    image_url TEXT,
    image_filename VARCHAR(255),
    event_date DATE,
    location VARCHAR(500),
    contact_number VARCHAR(15),
    additional_notes TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Table
CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    news_headline VARCHAR(500) NOT NULL,
    news_category VARCHAR(100) NOT NULL,
    news_content TEXT NOT NULL,
    image_url TEXT,
    image_filename VARCHAR(255),
    event_date DATE,
    location VARCHAR(500),
    contact_number VARCHAR(15),
    additional_notes TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Birthday Events Table
CREATE TABLE birthday_events (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    birthday_person_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    date_of_birth DATE NOT NULL,
    mobile_number VARCHAR(15),
    photo_url TEXT,
    photo_filename VARCHAR(255),
    current_address TEXT,
    age_completing INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishes Table
CREATE TABLE wishes (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    sender_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sangathan Table
CREATE TABLE sangathan (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    address TEXT NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    occupation VARCHAR(255) NOT NULL,
    image_url TEXT,
    image_filename VARCHAR(255),
    district_image_url TEXT,
    district_image_filename VARCHAR(255),
    city_image_url TEXT,
    city_image_filename VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to create birthday events from members
CREATE OR REPLACE FUNCTION create_birthday_event_from_member()
RETURNS TRIGGER AS $$
BEGIN
    -- Create birthday event when member is approved
    IF NEW.registration_status = 'approved' AND (OLD IS NULL OR OLD.registration_status != 'approved') THEN
        INSERT INTO birthday_events (
            member_id, 
            title, 
            birthday_person_name, 
            father_name,
            mother_name,
            date_of_birth, 
            mobile_number, 
            photo_url,
            photo_filename,
            current_address,
            age_completing,
            is_active,
            is_published
        )
        VALUES (
            NEW.id, 
            'Birthday - ' || NEW.full_name, 
            NEW.full_name, 
            NEW.father_name,
            NEW.mother_name,
            NEW.date_of_birth, 
            NEW.mobile_number, 
            NEW.profile_image_url,
            NEW.profile_image_filename,
            NEW.current_address,
            EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.date_of_birth))::INTEGER,
            true,
            true
        );
    END IF;
    
    -- Update birthday event photo when member photo is updated
    IF OLD IS NOT NULL AND (OLD.profile_image_url != NEW.profile_image_url OR OLD.profile_image_filename != NEW.profile_image_filename) THEN
        UPDATE birthday_events 
        SET photo_url = NEW.profile_image_url,
            photo_filename = NEW.profile_image_filename,
            updated_at = NOW()
        WHERE member_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
DROP TRIGGER IF EXISTS create_birthday_on_approval ON members;
CREATE TRIGGER create_birthday_on_approval AFTER INSERT OR UPDATE ON members 
    FOR EACH ROW EXECUTE FUNCTION create_birthday_event_from_member();

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE badhai ENABLE ROW LEVEL SECURITY;
ALTER TABLE shok ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthday_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sangathan ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read of active members" ON members FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public insert for registration" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access to members" ON members FOR ALL USING (true);

CREATE POLICY "Allow public insert for contact form" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access to messages" ON messages FOR ALL USING (true);

CREATE POLICY "Allow public read published badhai" ON badhai FOR SELECT USING (is_published = true);
CREATE POLICY "Allow admin full access to badhai" ON badhai FOR ALL USING (true);

CREATE POLICY "Allow public read published shok" ON shok FOR SELECT USING (is_published = true);
CREATE POLICY "Allow admin full access to shok" ON shok FOR ALL USING (true);

CREATE POLICY "Allow public read published news" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Allow admin full access to news" ON news FOR ALL USING (true);

CREATE POLICY "Allow public read active birthdays" ON birthday_events FOR SELECT USING (is_active = true AND is_published = true);
CREATE POLICY "Allow admin full access to birthdays" ON birthday_events FOR ALL USING (true);

CREATE POLICY "Allow public read approved wishes" ON wishes FOR SELECT USING (is_approved = true);
CREATE POLICY "Allow public insert wishes" ON wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access to wishes" ON wishes FOR ALL USING (true);

CREATE POLICY "Allow public read active sangathan" ON sangathan FOR SELECT USING (is_active = true);
CREATE POLICY "Allow admin full access to sangathan" ON sangathan FOR ALL USING (true);

-- =====================================================
-- SUPABASE STORAGE BUCKETS SETUP
-- =====================================================

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profiles', 'profiles', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff']),
  ('events', 'events', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff']),
  ('news', 'news', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff']),
  ('sangathan', 'sangathan', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/tiff'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public access
DO $$
BEGIN
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
    CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (true);
    CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (true);
    CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- IMAGE FORMAT VALIDATION FUNCTION
-- =====================================================

-- Function to validate image file extensions
CREATE OR REPLACE FUNCTION validate_image_filename(filename TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF filename IS NULL OR filename = '' THEN
        RETURN TRUE;
    END IF;
    RETURN filename ~* '\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|tif)$';
END;
$$ LANGUAGE plpgsql;

-- Add check constraints for image filename validation
DO $$
BEGIN
    ALTER TABLE members ADD CONSTRAINT check_profile_image_format 
        CHECK (validate_image_filename(profile_image_filename));
    ALTER TABLE badhai ADD CONSTRAINT check_badhai_image_format 
        CHECK (validate_image_filename(image_filename));
    ALTER TABLE shok ADD CONSTRAINT check_shok_image_format 
        CHECK (validate_image_filename(image_filename));
    ALTER TABLE news ADD CONSTRAINT check_news_image_format 
        CHECK (validate_image_filename(image_filename));
    ALTER TABLE birthday_events ADD CONSTRAINT check_birthday_image_format 
        CHECK (validate_image_filename(photo_filename));
    ALTER TABLE sangathan ADD CONSTRAINT check_sangathan_image_format 
        CHECK (validate_image_filename(image_filename));
    ALTER TABLE sangathan ADD CONSTRAINT check_sangathan_district_image_format 
        CHECK (validate_image_filename(district_image_filename));
    ALTER TABLE sangathan ADD CONSTRAINT check_sangathan_city_image_format 
        CHECK (validate_image_filename(city_image_filename));
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- SYNC MEMBER PHOTOS TO BIRTHDAY EVENTS
-- =====================================================

-- Sync member photos to birthday events
UPDATE birthday_events 
SET photo_url = m.profile_image_url,
    photo_filename = m.profile_image_filename,
    updated_at = NOW()
FROM members m 
WHERE birthday_events.member_id = m.id 
AND m.profile_image_url IS NOT NULL
AND (birthday_events.photo_url IS NULL OR birthday_events.photo_url != m.profile_image_url);