import { supabase } from '../supabase/config';

class ImageUploadService {
  // Upload image to Supabase Storage
  async uploadImage(file, bucket = 'images', folder = 'uploads') {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return {
        success: true,
        url: publicUrl,
        path: fileName,
        filename: file.name
      };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete image from Supabase Storage
  async deleteImage(path, bucket = 'images') {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Image delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get public URL for image
  getPublicUrl(path, bucket = 'images') {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}

export default new ImageUploadService();