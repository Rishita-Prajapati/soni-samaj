-- =====================================================
-- SONI SAMAJ UDAIPUR - FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to auto-create birthday events
CREATE OR REPLACE FUNCTION create_birthday_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Create birthday event when member is approved
    IF NEW.registration_status = 'approved' AND NEW.date_of_birth IS NOT NULL THEN
        INSERT INTO birthday_events (
            member_id,
            person_name,
            birth_date,
            age,
            mobile_number,
            is_active
        ) VALUES (
            NEW.id,
            NEW.full_name,
            NEW.date_of_birth,
            EXTRACT(YEAR FROM AGE(NEW.date_of_birth)),
            NEW.mobile_number,
            true
        ) ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function for soft delete
CREATE OR REPLACE FUNCTION soft_delete_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Store deleted record in archive
    INSERT INTO deleted_records (
        table_name,
        record_id,
        record_data,
        deleted_by,
        reason
    ) VALUES (
        TG_TABLE_NAME,
        OLD.id,
        row_to_json(OLD),
        current_user,
        'Deleted via admin panel'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create Triggers

-- Update timestamp triggers
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Birthday event creation trigger
CREATE TRIGGER create_birthday_event_trigger
    AFTER INSERT OR UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION create_birthday_event();

-- Soft delete triggers
CREATE TRIGGER soft_delete_members_trigger
    BEFORE DELETE ON members
    FOR EACH ROW EXECUTE FUNCTION soft_delete_record();

CREATE TRIGGER soft_delete_events_trigger
    BEFORE DELETE ON events
    FOR EACH ROW EXECUTE FUNCTION soft_delete_record();

CREATE TRIGGER soft_delete_messages_trigger
    BEFORE DELETE ON messages
    FOR EACH ROW EXECUTE FUNCTION soft_delete_record();