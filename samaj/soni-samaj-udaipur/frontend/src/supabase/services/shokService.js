import { supabase } from '../config.js';

export const shokService = {
  // Create new shok event
  async createShok(shokData) {
    try {
      const { data, error } = await supabase
        .from('shok')
        .insert([shokData])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all shok events
  async getAllShok(page = 1, limit = 20) {
    try {
      const { data, error, count } = await supabase
        .from('shok')
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

  // Get shok by ID
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
      return { success: false, error: error.message };
    }
  },

  // Update shok
  async updateShok(id, shokData) {
    try {
      const { data, error } = await supabase
        .from('shok')
        .update(shokData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete shok
  async deleteShok(id) {
    try {
      const { error } = await supabase
        .from('shok')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get published shok for public display
  async getPublishedShok(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('shok')
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

export default shokService;