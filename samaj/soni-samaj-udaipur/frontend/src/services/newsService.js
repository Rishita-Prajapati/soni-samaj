import { supabase } from '../supabase/config';
import imageUploadService from './imageUploadService';

class NewsService {
  async createNews(eventData) {
    try {
      let imageUrl = '';
      let imageFilename = '';
      
      if (eventData.image) {
        const result = await imageUploadService.uploadImage(
          eventData.image,
          'news',
          'news'
        );
        if (result.success) {
          imageUrl = result.url;
          imageFilename = result.filename;
        }
      }

      const { data, error } = await supabase
        .from('news')
        .insert([{
          title: eventData.title,
          news_headline: eventData.newsHeadline,
          news_category: eventData.newsCategory,
          news_content: eventData.newsContent,
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
      console.error('Error creating news:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllNews() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching news:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  async getNewsById(id) {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching news:', error);
      return { success: false, error: error.message };
    }
  }

  async updateNews(id, eventData) {
    try {
      let imageUrl = eventData.image_url;
      let imageFilename = eventData.image_filename;
      
      if (eventData.image && typeof eventData.image !== 'string') {
        const result = await imageUploadService.uploadImage(
          eventData.image,
          'news',
          'news'
        );
        if (result.success) {
          imageUrl = result.url;
          imageFilename = result.filename;
        }
      }

      const { data, error } = await supabase
        .from('news')
        .update({
          title: eventData.title,
          news_headline: eventData.newsHeadline,
          news_category: eventData.newsCategory,
          news_content: eventData.newsContent,
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
      console.error('Error updating news:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteNews(id) {
    try {
      const { data, error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error deleting news:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new NewsService();