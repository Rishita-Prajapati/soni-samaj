-- Sync member photos to birthday events
UPDATE birthday_events 
SET photo_url = m.profile_image_url,
    photo_filename = m.profile_image_filename,
    updated_at = NOW()
FROM members m 
WHERE birthday_events.member_id = m.id 
AND m.profile_image_url IS NOT NULL
AND (birthday_events.photo_url IS NULL OR birthday_events.photo_url != m.profile_image_url);