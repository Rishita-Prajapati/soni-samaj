-- =====================================================
-- SONI SAMAJ UDAIPUR - HELPER FUNCTIONS
-- =====================================================

-- Function to get today's birthdays
CREATE OR REPLACE FUNCTION get_todays_birthdays()
RETURNS TABLE (
    id BIGINT,
    person_name VARCHAR,
    birth_date DATE,
    age INTEGER,
    mobile_number VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        be.id,
        be.person_name,
        be.birth_date,
        be.age,
        be.mobile_number
    FROM birthday_events be
    WHERE be.is_active = true
    AND EXTRACT(MONTH FROM be.birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(DAY FROM be.birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
    ORDER BY be.person_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming birthdays (next 7 days)
CREATE OR REPLACE FUNCTION get_upcoming_birthdays(days_ahead INTEGER DEFAULT 7)
RETURNS TABLE (
    id BIGINT,
    person_name VARCHAR,
    birth_date DATE,
    age INTEGER,
    mobile_number VARCHAR,
    days_until_birthday INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        be.id,
        be.person_name,
        be.birth_date,
        be.age,
        be.mobile_number,
        CASE 
            WHEN DATE_PART('doy', be.birth_date) >= DATE_PART('doy', CURRENT_DATE) THEN
                (DATE_PART('doy', be.birth_date) - DATE_PART('doy', CURRENT_DATE))::INTEGER
            ELSE
                (365 + DATE_PART('doy', be.birth_date) - DATE_PART('doy', CURRENT_DATE))::INTEGER
        END as days_until_birthday
    FROM birthday_events be
    WHERE be.is_active = true
    AND (
        (DATE_PART('doy', be.birth_date) >= DATE_PART('doy', CURRENT_DATE) 
         AND DATE_PART('doy', be.birth_date) <= DATE_PART('doy', CURRENT_DATE) + days_ahead)
        OR
        (DATE_PART('doy', be.birth_date) <= (DATE_PART('doy', CURRENT_DATE) + days_ahead) - 365)
    )
    ORDER BY days_until_birthday, be.person_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get member statistics
CREATE OR REPLACE FUNCTION get_member_stats()
RETURNS TABLE (
    total_members BIGINT,
    pending_approvals BIGINT,
    approved_members BIGINT,
    total_events BIGINT,
    unread_messages BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM members WHERE is_active = true) as total_members,
        (SELECT COUNT(*) FROM members WHERE registration_status = 'pending' AND is_active = true) as pending_approvals,
        (SELECT COUNT(*) FROM members WHERE registration_status = 'approved' AND is_active = true) as approved_members,
        (SELECT COUNT(*) FROM events WHERE is_published = true) as total_events,
        (SELECT COUNT(*) FROM messages WHERE is_read = false) as unread_messages;
END;
$$ LANGUAGE plpgsql;

-- Function to approve member and create birthday event
CREATE OR REPLACE FUNCTION approve_member(member_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
    member_record RECORD;
BEGIN
    -- Update member status
    UPDATE members 
    SET registration_status = 'approved', updated_at = NOW()
    WHERE id = member_id AND is_active = true;
    
    -- Get member details
    SELECT * INTO member_record FROM members WHERE id = member_id;
    
    -- Create birthday event if not exists
    IF member_record.date_of_birth IS NOT NULL THEN
        INSERT INTO birthday_events (
            member_id,
            person_name,
            birth_date,
            age,
            mobile_number,
            is_active
        ) VALUES (
            member_record.id,
            member_record.full_name,
            member_record.date_of_birth,
            EXTRACT(YEAR FROM AGE(member_record.date_of_birth)),
            member_record.mobile_number,
            true
        ) ON CONFLICT DO NOTHING;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to permanently delete old records
CREATE OR REPLACE FUNCTION cleanup_deleted_records(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM deleted_records 
    WHERE deleted_at < NOW() - INTERVAL '1 day' * days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;