import { supabase } from '../supabase/config';

export const eventService = {
  // Create new event
  async createEvent(eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: eventData.title,
          description: eventData.description,
          type: eventData.type, // 'badhai', 'shok', 'general'
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error };
    }
  },

  // Get all events with real-time subscription
  async getAllEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  // Get events by type
  async getEventsByType(type) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching events by type:', error);
      return [];
    }
  },

  // Delete event
  async deleteEvent(eventId) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error };
    }
  },

  // Subscribe to real-time events
  subscribeToEvents(callback) {
    const subscription = supabase
      .channel('events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' },
        callback
      )
      .subscribe();

    return subscription;
  }
};

export default eventService;