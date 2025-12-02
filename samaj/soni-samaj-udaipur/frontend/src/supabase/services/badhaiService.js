import { supabase } from '../config.js';

export const badhaiService = {
  // Create new badhai event
  async createBadhai(badhaiData) {
    try {
      const { data, error } = await supabase
        .from('badhai')
        .insert([badhaiData])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all badhai events
  async getAllBadhai(page = 1, limit = 20) {
    try {
      const { data, error, count } = await supabase
        .from('badhai')
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

  // Get badhai by ID
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
      return { success: false, error: error.message };
    }
  },

  // Update badhai
  async updateBadhai(id, badhaiData) {
    try {
      const { data, error } = await supabase
        .from('badhai')
        .update(badhaiData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete badhai
  async deleteBadhai(id) {
    try {
      const { error } = await supabase
        .from('badhai')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get published badhai for public display
  async getPublishedBadhai(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('badhai')
        .select('*')
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

export default badhaiService;