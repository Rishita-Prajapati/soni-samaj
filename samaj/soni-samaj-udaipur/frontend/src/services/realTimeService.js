import { supabase } from '../supabase/config';

export const realTimeService = {
  // Subscribe to member changes
  subscribeToMembers(callback) {
    return supabase
      .channel('members-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'members' },
        callback
      )
      .subscribe();
  },

  // Subscribe to event changes
  subscribeToEvents(callback) {
    return supabase
      .channel('events-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' },
        callback
      )
      .subscribe();
  },

  // Subscribe to message changes
  subscribeToMessages(callback) {
    return supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        callback
      )
      .subscribe();
  },

  // Subscribe to wish changes
  subscribeToWishes(callback) {
    return supabase
      .channel('wishes-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'wishes' },
        callback
      )
      .subscribe();
  }
};

export default realTimeService;