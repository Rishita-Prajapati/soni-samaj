-- Add photo columns to existing tables
ALTER TABLE members ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE birthday_events ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE birthday_events ADD COLUMN IF NOT EXISTS photo_filename VARCHAR(255);

-- Update the trigger function
DROP FUNCTION IF EXISTS create_birthday_event_from_member();

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
            true,
            true
        );
    END IF;
    
    IF OLD IS NOT NULL AND NEW.profile_image_url != OLD.profile_image_url THEN
        UPDATE birthday_events 
        SET photo_url = NEW.profile_image_url
        WHERE member_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_birthday_on_approval ON members;
CREATE TRIGGER create_birthday_on_approval AFTER INSERT OR UPDATE ON members 
    FOR EACH ROW EXECUTE FUNCTION create_birthday_event_from_member();