-- =====================================================
-- MIGRATION: ADD IMAGE SUPPORT TO ALL TABLES
-- =====================================================

-- Add image filename columns to existing tables
DO $$ 
BEGIN
    -- Add profile_image_filename to members table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'members' AND column_name = 'profile_image_filename') THEN
        ALTER TABLE members ADD COLUMN profile_image_filename VARCHAR(255);
    END IF;

    -- Add image columns to sangathan table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sangathan' AND column_name = 'image_url') THEN
        ALTER TABLE sangathan ADD COLUMN image_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sangathan' AND column_name = 'image_filename') THEN
        ALTER TABLE sangathan ADD COLUMN image_filename VARCHAR(255);
    END IF;

    -- Add image_filename columns to event tables if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'badhai' AND column_name = 'image_filename') THEN
        ALTER TABLE badhai ADD COLUMN image_filename VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shok' AND column_name = 'image_filename') THEN
        ALTER TABLE shok ADD COLUMN image_filename VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'news' AND column_name = 'image_filename') THEN
        ALTER TABLE news ADD COLUMN image_filename VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'birthday_events' AND column_name = 'photo_filename') THEN
        ALTER TABLE birthday_events ADD COLUMN photo_filename VARCHAR(255);
    END IF;
END $$;

-- Update trigger function to include image filename
CREATE OR REPLACE FUNCTION create_birthday_event_from_member()
RETURNS TRIGGER AS $$
BEGIN
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
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update existing birthday_events with member profile images
UPDATE birthday_events 
SET photo_url = m.profile_image_url,
    photo_filename = m.profile_image_filename
FROM members m 
WHERE birthday_events.member_id = m.id 
AND birthday_events.photo_url IS NULL 
AND m.profile_image_url IS NOT NULL;

-- Extract filenames from existing URLs where filename is null
UPDATE members 
SET profile_image_filename = SUBSTRING(profile_image_url FROM '[^/]*$') 
WHERE profile_image_url IS NOT NULL AND profile_image_filename IS NULL;

UPDATE badhai 
SET image_filename = SUBSTRING(image_url FROM '[^/]*$') 
WHERE image_url IS NOT NULL AND image_filename IS NULL;

UPDATE shok 
SET image_filename = SUBSTRING(image_url FROM '[^/]*$') 
WHERE image_url IS NOT NULL AND image_filename IS NULL;

UPDATE news 
SET image_filename = SUBSTRING(image_url FROM '[^/]*$') 
WHERE image_url IS NOT NULL AND image_filename IS NULL;

UPDATE birthday_events 
SET photo_filename = SUBSTRING(photo_url FROM '[^/]*$') 
WHERE photo_url IS NOT NULL AND photo_filename IS NULL;