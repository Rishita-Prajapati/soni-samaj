-- =====================================================
-- SONI SAMAJ UDAIPUR - COMPLETE DATABASE SETUP
-- =====================================================
-- Run this script to set up the entire database

-- Execute all setup scripts in order
\i 01_main_tables.sql
\i 02_security_policies.sql
\i 03_functions_triggers.sql
\i 04_helper_functions.sql

-- Insert initial data (no mock data, only essential structure)
INSERT INTO events (title, subtitle, description, type, is_published) VALUES
('Welcome to Soni Samaj Udaipur', 'Official Launch', 'Welcome to our community platform', 'news', true)
ON CONFLICT DO NOTHING;

-- Create admin user function (for initial setup)
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_email VARCHAR,
    admin_password VARCHAR,
    admin_name VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
    -- This would integrate with your auth system
    -- For now, just return true
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Verify setup
DO $$
DECLARE
    table_count INTEGER;
    function_count INTEGER;
BEGIN
    -- Check tables
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('members', 'messages', 'events', 'birthday_events', 'wishes', 'deleted_records');
    
    -- Check functions
    SELECT COUNT(*) INTO function_count 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN ('get_todays_birthdays', 'get_upcoming_birthdays', 'approve_member');
    
    IF table_count = 6 AND function_count >= 3 THEN
        RAISE NOTICE 'Database setup completed successfully!';
        RAISE NOTICE 'Tables created: %', table_count;
        RAISE NOTICE 'Functions created: %', function_count;
    ELSE
        RAISE EXCEPTION 'Database setup incomplete. Tables: %, Functions: %', table_count, function_count;
    END IF;
END $$;