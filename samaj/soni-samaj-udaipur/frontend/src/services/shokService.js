import { supabase } from '../supabase/config';
import imageUploadService from './imageUploadService';

class ShokService {
  async createShok(eventData) {
    try {
      let imageUrl = '';
      let imageFilename = '';
      
      if (eventData.image) {
        const result = await imageUploadService.uploadImage(
          eventData.image,
          'events',
          'shok'
        );
        if (result.success) {
          imageUrl = result.url;
          imageFilename = result.filename;
        }
      }

      const { data, error } = await supabase
        .from('shok')
        .insert([{
          title: eventData.title,
          deceased_name: eventData.deceasedName,
          deceased_father_name: eventData.deceasedFatherName,
          deceased_mother_name: eventData.deceasedMotherName,
          age_at_death: eventData.ageAtDeath,
          date_of_death: eventData.dateOfDeath,
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
      console.error('Error creating shok:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllShok() {
    try {
      const { data, error } = await supabase
        .from('shok')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching shok:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async getShokById(id) {
    try {
      const { data, error } = await supabase
        .from('shok')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching shok:', error);
      return { success: false, error: error.message };
    }
  }

  async updateShok(id, eventData) {
    try {
      let imageUrl = eventData.image_url;
      let imageFilename = eventData.image_filename;
      
      if (eventData.image && typeof eventData.image !== 'string') {
        const result = await imageUploadService.uploadImage(
          eventData.image,
          'events',
          'shok'
        );
        if (result.success) {
          imageUrl = result.url;
          imageFilename = result.filename;
        }
      }

      const { data, error } = await supabase
        .from('shok')
        .update({
          title: eventData.title,
          deceased_name: eventData.deceasedName,
          deceased_father_name: eventData.deceasedFatherName,
          deceased_mother_name: eventData.deceasedMotherName,
          age_at_death: eventData.ageAtDeath,
          date_of_death: eventData.dateOfDeath,
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
      console.error('Error updating shok:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteShok(id) {
    try {
      const { data, error } = await supabase
        .from('shok')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error deleting shok:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ShokService();