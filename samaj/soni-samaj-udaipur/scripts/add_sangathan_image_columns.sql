-- Add image columns to existing sangathan table
ALTER TABLE sangathan 
ADD COLUMN IF NOT EXISTS district_image_url TEXT,
ADD COLUMN IF NOT EXISTS district_image_filename VARCHAR(255),
ADD COLUMN IF NOT EXISTS city_image_url TEXT,
ADD COLUMN IF NOT EXISTS city_image_filename VARCHAR(255);

-- Add validation constraints
ALTER TABLE sangathan ADD CONSTRAINT IF NOT EXISTS check_sangathan_district_image_format 
    CHECK (district_image_filename IS NULL OR district_image_filename ~* '\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|tif)$');

ALTER TABLE sangathan ADD CONSTRAINT IF NOT EXISTS check_sangathan_city_image_format 
    CHECK (city_image_filename IS NULL OR city_image_filename ~* '\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|tif)$');