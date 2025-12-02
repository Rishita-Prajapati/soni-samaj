import { supabase } from '../config.js';

export const newsService = {
  // Create new news
  async createNews(newsData) {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert([newsData])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all news
  async getAllNews(page = 1, limit = 20) {
    try {
      const { data, error, count } = await supabase
        .from('news')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;
      return { 
        success: true, 
        data, 
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get news by ID
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
      return { success: false, error: error.message };
    }
  },

  // Update news
  async updateNews(id, newsData) {
    try {
      const { data, error } = await supabase
        .from('news')
        .update(newsData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete news
  async deleteNews(id) {
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get published news for public display
  async getPublishedNews(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get news by category
  async getNewsByCategory(category, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('news_category', category)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default newsService;