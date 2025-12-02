import { supabase } from '../supabase/config';

export const messageService = {
  // Send general message
  async sendMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_name: messageData.senderName,
          sender_email: messageData.senderEmail,
          sender_phone: messageData.senderPhone,
          message: messageData.message,
          message_type: messageData.type || 'general', // 'general', 'suggestion', 'feedback'
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error };
    }
  },

  // Get all messages (admin only)
  async getAllMessages() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
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
      console.error('Error deleting message:', error);
      return { success: false, error };
    }
  },

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: false, error };
    }
  },

  // Subscribe to real-time messages
  subscribeToMessages(callback) {
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        callback
      )
      .subscribe();

    return subscription;
  }
};

export default messageService;