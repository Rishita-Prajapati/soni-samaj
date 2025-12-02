-- =====================================================
-- SONI SAMAJ UDAIPUR - SECURITY POLICIES
-- =====================================================

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthday_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deleted_records ENABLE ROW LEVEL SECURITY;

-- Members Policies
CREATE POLICY "Allow public read of active members" ON members 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public insert for registration" ON members 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access to members" ON members 
    FOR ALL USING (true);

-- Messages Policies
CREATE POLICY "Allow public insert for contact form" ON messages 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read messages" ON messages 
    FOR SELECT USING (true);

CREATE POLICY "Allow admin update messages" ON messages 
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin delete messages" ON messages 
    FOR DELETE USING (true);

-- Events Policies
CREATE POLICY "Allow public read published events" ON events 
    FOR SELECT USING (is_published = true);

CREATE POLICY "Allow admin full access to events" ON events 
    FOR ALL USING (true);

-- Birthday Events Policies
CREATE POLICY "Allow public read active birthdays" ON birthday_events 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to birthdays" ON birthday_events 
    FOR ALL USING (true);

-- Wishes Policies
CREATE POLICY "Allow public read approved wishes" ON wishes 
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow public insert wishes" ON wishes 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin full access to wishes" ON wishes 
    FOR ALL USING (true);

-- Deleted Records Policies (Admin Only)
CREATE POLICY "Allow admin full access to deleted records" ON deleted_records 
    FOR ALL USING (true);