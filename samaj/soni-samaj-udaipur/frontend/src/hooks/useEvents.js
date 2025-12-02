// hooks/useEvents.js
import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '../services/firebaseService';

// Base hook for common event operations
const useBaseEvents = (eventType, limitNum = 10, options = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error helper
  const clearError = useCallback(() => setError(null), []);

  // Fetch events with error handling
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const eventsData = await eventsService.getEventsByType(eventType);
      
      // Apply limit if specified
      const limitedEvents = limitNum ? eventsData.slice(0, limitNum) : eventsData;
      
      // Apply any additional filtering from options
      let filteredEvents = limitedEvents;
      if (options.priority) {
        filteredEvents = limitedEvents.filter(event => event.priority === options.priority);
      }
      
      setEvents(filteredEvents);
    } catch (err) {
      console.error(`Error fetching ${eventType} events:`, err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [eventType, limitNum, options.priority]);

  // Create new event
  const createEvent = useCallback(async (eventData) => {
    try {
      setError(null);
      const newEvent = await eventsService.addEvent({
        ...eventData,
        eventType
      });
      
      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (err) {
      console.error(`Error creating ${eventType} event:`, err);
      setError(err.message || 'Failed to create event');
      throw err;
    }
  }, [eventType]);

  // Update existing event
  const updateEvent = useCallback(async (eventId, updateData) => {
    try {
      setError(null);
      const updatedEvent = await eventsService.updateEvent(eventId, updateData);
      
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, ...updatedEvent } : event
      ));
      
      return updatedEvent;
    } catch (err) {
      console.error(`Error updating ${eventType} event:`, err);
      setError(err.message || 'Failed to update event');
      throw err;
    }
  }, [eventType]);

  // Delete event
  const deleteEvent = useCallback(async (eventId) => {
    try {
      setError(null);
      await eventsService.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      console.error(`Error deleting ${eventType} event:`, err);
      setError(err.message || 'Failed to delete event');
      throw err;
    }
  }, [eventType]);

  // Like event (increment likes counter)
  const likeEvent = useCallback(async (eventId) => {
    try {
      setError(null);
      // Optimistically update UI
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, likes: (event.likes || 0) + 1 }
          : event
      ));
      
      // Update in database (you'd implement this in eventsService)
      // await eventsService.likeEvent(eventId);
    } catch (err) {
      console.error(`Error liking ${eventType} event:`, err);
      setError(err.message || 'Failed to like event');
      // Revert optimistic update on error
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, likes: Math.max((event.likes || 0) - 1, 0) }
          : event
      ));
    }
  }, [eventType]);

  // Share event (increment shares counter)
  const shareEvent = useCallback(async (eventId) => {
    try {
      setError(null);
      // Optimistically update UI
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, shares: (event.shares || 0) + 1 }
          : event
      ));
      
      // Update in database (you'd implement this in eventsService)
      // await eventsService.shareEvent(eventId);
    } catch (err) {
      console.error(`Error sharing ${eventType} event:`, err);
      setError(err.message || 'Failed to share event');
      // Revert optimistic update on error
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, shares: Math.max((event.shares || 0) - 1, 0) }
          : event
      ));
    }
  }, [eventType]);

  // Search events
  const searchEvents = useCallback(async (searchTerm, filterOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await eventsService.searchEvents({
        eventType,
        searchTerm,
        ...filterOptions
      });
      
      setEvents(searchResults);
    } catch (err) {
      console.error(`Error searching ${eventType} events:`, err);
      setError(err.message || 'Failed to search events');
    } finally {
      setLoading(false);
    }
  }, [eventType]);

  // Initial load
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    likeEvent,
    shareEvent,
    searchEvents,
    clearError
  };
};

// Specific hooks for each event type
export const useBadhaiEvents = (limitNum = 10) => {
  return useBaseEvents('badhai', limitNum);
};

export const useShokEvents = (limitNum = 10) => {
  return useBaseEvents('shok', limitNum);
};

export const useBirthdayEvents = (limitNum = 10) => {
  const baseHook = useBaseEvents('birthday', limitNum);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);

  // Get today's birthdays
  const fetchTodaysBirthdays = useCallback(async () => {
    try {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const allBirthdays = await eventsService.getEventsByType('birthday');
      const todaysEvents = allBirthdays.filter(event => {
        if (!event.birthday_date) return false;
        const eventDate = new Date(event.birthday_date);
        const eventDateString = eventDate.toISOString().split('T')[0];
        
        // Check if month and day match (ignore year for birthdays)
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();
        const eventMonth = eventDate.getMonth();
        const eventDay = eventDate.getDate();
        
        return todayMonth === eventMonth && todayDay === eventDay;
      });
      
      setTodaysBirthdays(todaysEvents);
    } catch (err) {
      console.error('Error fetching today\'s birthdays:', err);
    }
  }, []);

  useEffect(() => {
    fetchTodaysBirthdays();
  }, [fetchTodaysBirthdays]);

  return {
    ...baseHook,
    todaysBirthdays,
    refreshTodaysBirthdays: fetchTodaysBirthdays
  };
};

export const useNewsEvents = (limitNum = 10, priority = null) => {
  return useBaseEvents('news', limitNum, { priority });
};

// Generic hook for any event type
export const useEvents = (eventType, limitNum = 10, options = {}) => {
  return useBaseEvents(eventType, limitNum, options);
};

// Admin-specific hook with enhanced operations
export const useAdminEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const clearError = useCallback(() => setError(null), []);

  // Create event with image upload support
  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      
      let imageUrl = '';
      
      // Handle image upload if provided
      if (eventData.image && typeof eventData.image !== 'string') {
        setUploadProgress(10);
        imageUrl = await eventsService.uploadEventImage(
          eventData.image, 
          eventData.eventType
        );
        setUploadProgress(50);
      }

      // Create event with image URL
      const finalEventData = {
        ...eventData,
        image: imageUrl || eventData.image
      };

      setUploadProgress(75);
      const newEvent = await eventsService.addEvent(finalEventData);
      setUploadProgress(100);
      
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, []);

  // Update event with image upload support
  const updateEvent = useCallback(async (eventId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      let imageUrl = updateData.image;
      
      // Handle new image upload if provided
      if (updateData.image && typeof updateData.image !== 'string') {
        setUploadProgress(10);
        imageUrl = await eventsService.uploadEventImage(
          updateData.image, 
          updateData.eventType || 'general'
        );
        setUploadProgress(50);
      }

      // Update event with new image URL
      const finalUpdateData = {
        ...updateData,
        image: imageUrl
      };

      setUploadProgress(75);
      const updatedEvent = await eventsService.updateEvent(eventId, finalUpdateData);
      setUploadProgress(100);
      
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message || 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, []);

  // Delete event
  const deleteEvent = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      await eventsService.deleteEvent(eventId);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload image separately
  const uploadImage = useCallback(async (imageFile, folder = 'events', fileName = null) => {
    try {
      setLoading(true);
      setError(null);
      setUploadProgress(10);
      
      const imageUrl = await eventsService.uploadEventImage(imageFile, folder, fileName);
      setUploadProgress(100);
      
      return imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
      throw err;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, []);

  // Batch operations for admin
  const batchDeleteEvents = useCallback(async (eventIds) => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all(
        eventIds.map(id => eventsService.deleteEvent(id))
      );
    } catch (err) {
      console.error('Error batch deleting events:', err);
      setError(err.message || 'Failed to delete events');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get events statistics
  const getEventsStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await eventsService.getEventsStats();
      return stats;
    } catch (err) {
      console.error('Error getting events stats:', err);
      setError(err.message || 'Failed to get statistics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    uploadProgress,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadImage,
    batchDeleteEvents,
    getEventsStats,
    clearError
  };
};

// Hook for event statistics and analytics
export const useEventStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statsData = await eventsService.getEventsStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching event stats:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

// Export all hooks as default
export default {
  useBadhaiEvents,
  useShokEvents,
  useBirthdayEvents,
  useNewsEvents,
  useEvents,
  useAdminEvents,
  useEventStats
};