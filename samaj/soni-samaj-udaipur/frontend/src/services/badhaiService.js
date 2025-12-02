import { supabase } from '../supabase/config';
import imageUploadService from './imageUploadService';

class BadhaiService {
  async createBadhai(eventData) {
    try {
      let imageUrl = '';
      let imageFilename = '';
      
      if (eventData.image) {
        const result = await imageUploadService.uploadImage(
          eventData.image,
          'events',
          'badhai'
        );
        if (result.success) {
          imageUrl = result.url;
          imageFilename = result.filename;
        }
      }

      const { data, error } = await supabase
        .from('badhai')
        .insert([{
          title: eventData.title,
          celebration_person_name: eventData.celebrationPersonName,
          father_name: eventData.fatherName,
          mother_name: eventData.motherName,
          occasion_type: eventData.occasionType,
          occasion_date: eventData.occasionDate,
          image_url: imageUrl,
          image_filename: imageFilename,
          event_date: eventData.eventDate,
          location: eventData.location,
          contact_number: eventData.contactNumber,
          additional_notes: eventData.additionalNotes,
          is_published: eventData.isPublished || true
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating badhai:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllBadhai() {
    try {
      const { data, error } = await supabase
        .from('badhai')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching badhai:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async getBadhaiById(id) {
    try {
      const { data, error } = await supabase
        .from('badhai')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching badhai:', error);
      return { success: false, error: error.message };
    }
  }

  async updateBadhai(id, eventData) {
    try {
      let imageUrl = eventData.image_url;
      let imageFilename = eventData.image_filename;
      
      if (eventData.image && typeof eventData.image !== 'string') {
        const result = await imageUploadService.uploadImage(
          eventData.image,
          'events',
          'badhai'
        );
        if (result.success) {
          imageUrl = result.url;
          imageFilename = result.filename;
        }
      }

      const { data, error } = await supabase
        .from('badhai')
        .update({
          title: eventData.title,
          celebration_person_name: eventData.celebrationPersonName,
          father_name: eventData.fatherName,
          mother_name: eventData.motherName,
          occasion_type: eventData.occasionType,
          occasion_date: eventData.occasionDate,
          image_url: imageUrl,
          image_filename: imageFilename,
          event_date: eventData.eventDate,
          location: eventData.location,
          contact_number: eventData.contactNumber,
          additional_notes: eventData.additionalNotes,
          is_published: eventData.isPublished
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating badhai:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteBadhai(id) {
    try {
      const { data, error } = await supabase
        .from('badhai')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error deleting badhai:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new BadhaiService();