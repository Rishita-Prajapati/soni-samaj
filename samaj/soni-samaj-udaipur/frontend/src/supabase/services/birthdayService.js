import { supabase } from '../config.js';

export const birthdayService = {
  // Create new birthday event
  async createBirthday(birthdayData) {
    try {
      const { data, error } = await supabase
        .from('birthday_events')
        .insert([birthdayData])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all birthday events
  async getAllBirthdays(page = 1, limit = 20) {
    try {
      const { data, error, count } = await supabase
        .from('birthday_events')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
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

  // Get birthday by ID
  async getBirthdayById(id) {
    try {
      const { data, error } = await supabase
        .from('birthday_events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update birthday
  async updateBirthday(id, birthdayData) {
    try {
      const { data, error } = await supabase
        .from('birthday_events')
        .update(birthdayData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete birthday
  async deleteBirthday(id) {
    try {
      const { data, error } = await supabase
        .from('birthday_events')
        .update({ is_active: false })
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get today's birthdays
  async getTodaysBirthdays() {
    try {
      const { data, error } = await supabase
        .rpc('get_todays_birthdays');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get upcoming birthdays
  async getUpcomingBirthdays(daysAhead = 7) {
    try {
      const { data, error } = await supabase
        .rpc('get_upcoming_birthdays', { days_ahead: daysAhead });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get published birthdays for public display
  async getPublishedBirthdays(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('birthday_events')
        .select('*')
        .eq('is_published', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default birthdayService;