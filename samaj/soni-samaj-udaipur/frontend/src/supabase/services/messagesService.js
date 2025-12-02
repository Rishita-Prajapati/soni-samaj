import { supabase } from '../config.js';

export const messagesService = {
  // Get all messages
  async getAllMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create new message
  async createMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          name: messageData.name,
          email: messageData.email,
          phone: messageData.phone,
          subject: messageData.subject,
          message: messageData.message,
          is_read: false
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete message
  async deleteMessage(messageId) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Subscribe to real-time messages
  subscribeToMessages(callback) {
    return supabase
      .channel('messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, callback)
      .subscribe();
  }
};

export default messagesService;