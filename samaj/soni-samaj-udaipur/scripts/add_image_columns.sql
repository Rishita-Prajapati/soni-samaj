-- Add image_filename columns to existing tables for better image management

-- Add image_filename to badhai table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'badhai' AND column_name = 'image_filename') THEN
        ALTER TABLE badhai ADD COLUMN image_filename VARCHAR(255);
    END IF;
END $$;

-- Add image_filename to shok table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'shok' AND column_name = 'image_filename') THEN
        ALTER TABLE shok ADD COLUMN image_filename VARCHAR(255);
    END IF;
END $$;

-- Add image_filename to news table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'news' AND column_name = 'image_filename') THEN
        ALTER TABLE news ADD COLUMN image_filename VARCHAR(255);
    END IF;
END $$;

-- Update existing records to extract filename from URL (if needed)
UPDATE badhai 
SET image_filename = SUBSTRING(image_url FROM '[^/]*$') 
WHERE image_url IS NOT NULL AND image_filename IS NULL;

UPDATE shok 
SET image_filename = SUBSTRING(image_url FROM '[^/]*$') 
WHERE image_url IS NOT NULL AND image_filename IS NULL;

UPDATE news 
SET image_filename = SUBSTRING(image_url FROM '[^/]*$') 
WHERE image_url IS NOT NULL AND image_filename IS NULL;