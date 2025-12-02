import { eventsService as supabaseEventsService, fileService } from './supabaseService';
import { STORAGE_BUCKETS } from '../supabase/config';

class EventsService {
  async addEvent(eventData) {
    try {
      const result = await supabaseEventsService.createEvent(eventData.eventType, eventData);
      return {
        ...result,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  }

  async getEventsByType(eventType) {
    try {
      const events = await supabaseEventsService.getEventsByType(eventType);
      return events.map(event => ({
        ...event,
        createdAt: event.created_at,
        updatedAt: event.updated_at
      }));
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  async getAllEvents() {
    try {
      const eventTypes = ['badhai', 'shok', 'birthday', 'news'];
      const allEvents = [];
      
      for (const type of eventTypes) {
        const events = await this.getEventsByType(type);
        allEvents.push(...events);
      }
      
      return allEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error getting all events:', error);
      return [];
    }
  }

  async getEventsStats() {
    try {
      const allEvents = await this.getAllEvents();
      const stats = {
        total: allEvents.length,
        badhai: 0,
        shok: 0,
        birthday: 0,
        news: 0,
        published: 0,
        featured: 0
      };
      
      allEvents.forEach(event => {
        if (event.event_title) stats.badhai++;
        else if (event.deceased_name) stats.shok++;
        else if (event.person_name) stats.birthday++;
        else if (event.title) stats.news++;
        
        if (event.is_published !== false) stats.published++;
        if (event.is_featured === true) stats.featured++;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return { total: 0, badhai: 0, shok: 0, birthday: 0, news: 0, published: 0, featured: 0 };
    }
  }

  async updateEvent(eventId, updateData) {
    try {
      const result = await supabaseEventsService.updateEvent(updateData.eventType, eventId, updateData);
      return {
        ...result,
        createdAt: result.created_at,
        updatedAt: result.updated_at
      };
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId, eventType) {
    try {
      return await supabaseEventsService.deleteEvent(eventType, eventId);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  async uploadEventImage(file, eventType) {
    try {
      const bucket = STORAGE_BUCKETS.EVENTS;
      const path = eventType;
      const result = await fileService.uploadFile(file, bucket, path);
      return result.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

const utils = {
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN');
  },
  formatDateTime: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-IN');
  },
  getRelativeTime: (date) => {
    if (!date) return '';
    const now = new Date();
    const diffInMs = now - new Date(date);
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return `${Math.floor(diffInDays / 7)} weeks ago`;
  }
};

const eventsService = new EventsService();
export { eventsService, utils };
export default eventsService;