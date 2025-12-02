import { supabase } from '../config.js';

export const eventsService = {
  // Create new event
  async createEvent(eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: eventData.title,
          subtitle: eventData.subtitle || null,
          description: eventData.description,
          type: eventData.type,
          image_url: eventData.imageUrl || null,
          event_date: eventData.eventDate || null,
          location: eventData.location || null,
          contact_number: eventData.contactNumber || null,
          is_published: eventData.isPublished || true
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all events with pagination
  async getAllEvents(page = 1, limit = 20, type = 'all') {
    try {
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' });

      if (type !== 'all') {
        query = query.eq('type', type);
      }

      const { data, error, count } = await query
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

  // Get event by ID
  async getEventById(id) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update event
  async updateEvent(id, eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: eventData.title,
          subtitle: eventData.subtitle || null,
          description: eventData.description,
          type: eventData.type,
          image_url: eventData.imageUrl || null,
          event_date: eventData.eventDate || null,
          location: eventData.location || null,
          contact_number: eventData.contactNumber || null,
          is_published: eventData.isPublished,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete event
  async deleteEvent(id) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get events by type for public display
  async getEventsByType(type, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('type', type)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get recent events
  async getRecentEvents(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('events')
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

  // Get stats
  async getStats() {
    try {
      const [totalResult, badhaiResult, shokResult, newsResult] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact' }).eq('is_published', true),
        supabase.from('events').select('id', { count: 'exact' }).eq('type', 'badhai').eq('is_published', true),
        supabase.from('events').select('id', { count: 'exact' }).eq('type', 'shok').eq('is_published', true),
        supabase.from('events').select('id', { count: 'exact' }).eq('type', 'news').eq('is_published', true)
      ]);

      return {
        success: true,
        data: {
          totalEvents: totalResult.count || 0,
          badhaiEvents: badhaiResult.count || 0,
          shokEvents: shokResult.count || 0,
          newsEvents: newsResult.count || 0
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

// Sangathan service
export const sangathanService = {
  // Create new sangathan member
  async createSangathan(sangathanData) {
    try {
      const { data, error } = await supabase
        .from('sangathan')
        .insert([sangathanData])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all sangathan members
  async getAllSangathan(page = 1, limit = 50) {
    try {
      const { data, error, count } = await supabase
        .from('sangathan')
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

  // Get sangathan by ID
  async getSangathanById(id) {
    try {
      const { data, error } = await supabase
        .from('sangathan')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update sangathan member
  async updateSangathan(id, sangathanData) {
    try {
      const { data, error } = await supabase
        .from('sangathan')
        .update(sangathanData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete sangathan member (soft delete)
  async deleteSangathan(id) {
    try {
      const { data, error } = await supabase
        .from('sangathan')
        .update({ is_active: false })
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get sangathan by district
  async getSangathanByDistrict(district) {
    try {
      const { data, error } = await supabase
        .from('sangathan')
        .select('*')
        .eq('district', district)
        .eq('is_active', true)
        .order('position');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get sangathan by city
  async getSangathanByCity(city) {
    try {
      const { data, error } = await supabase
        .from('sangathan')
        .select('*')
        .eq('city', city)
        .eq('is_active', true)
        .order('position');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default sangathanService;