import { supabase } from '../supabase/config';
import badhaiService from './badhaiService';
import shokService from './shokService';
import newsService from './newsService';

class EventsService {
  // Get all events
  async getEvents() {
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
  }

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
  }

  // Add new event
  async addEvent(eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  // Get stats
  async getStats() {
    try {
      const [eventsResult, membersResult, wishesResult] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('members').select('id', { count: 'exact' }),
        supabase.from('wishes').select('id', { count: 'exact' })
      ]);

      // Get today's birthday count
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      
      const birthdayResult = await supabase
        .from('members')
        .select('id', { count: 'exact' })
        .eq('registration_status', 'approved')
        .like('date_of_birth', `%-${month}-${day}`);

      return {
        totalEvents: eventsResult.count || 0,
        totalMembers: membersResult.count || 0,
        totalWishes: wishesResult.count || 0,
        birthdaysToday: birthdayResult.count || 0
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalEvents: 0,
        totalMembers: 0,
        totalWishes: 0,
        birthdaysToday: 0
      };
    }
  }

  // Get recent events
  async getRecentEvents(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent events:', error);
      return [];
    }
  }

  // Get Badhai events
  async getBadhaiEvents() {
    return await badhaiService.getAllBadhai();
  }

  // Get Shok events
  async getShokEvents() {
    return await shokService.getAllShok();
  }

  // Get News events
  async getNewsEvents() {
    return await newsService.getAllNews();
  }

  // Get Birthday events
  async getBirthdayEvents() {
    try {
      const { data, error } = await supabase
        .from('birthday_events')
        .select('*')
        .eq('is_active', true)
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching birthday events:', error);
      return { success: false, error, data: [] };
    }
  }
}

export default new EventsService();