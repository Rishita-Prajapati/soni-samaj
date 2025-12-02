import { supabase } from '../supabase/config';

// Moderation word filter
const OFFENSIVE_WORDS = [
  'badword1', 'badword2', 'spam', 'inappropriate'
  // Add more offensive words as needed
];

export const birthdayWishService = {
  // Get today's birthdays
  async getTodaysBirthdays() {
    try {
      const today = new Date();
      const todayString = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, profile_picture_url, date_of_birth')
        .eq('registration_status', 'approved')
        .like('date_of_birth', `%-${todayString}`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching today\'s birthdays:', error);
      return [];
    }
  },

  // Get upcoming birthdays (next 7 days)
  async getUpcomingBirthdays() {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, profile_picture_url, date_of_birth')
        .eq('registration_status', 'approved');

      if (error) throw error;

      // Filter for next 7 days
      const today = new Date();
      const upcoming = data.filter(member => {
        if (!member.date_of_birth) return false;
        
        const birthDate = new Date(member.date_of_birth);
        const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }
        
        const diffTime = thisYearBirthday - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 0 && diffDays <= 7;
      });

      return upcoming;
    } catch (error) {
      console.error('Error fetching upcoming birthdays:', error);
      return [];
    }
  },

  // Send birthday wish
  async sendBirthdayWish(wishData) {
    try {
      // Check for offensive content
      const isOffensive = this.moderateMessage(wishData.message);
      
      const { data, error } = await supabase
        .from('wishes')
        .insert([{
          member_id: wishData.memberId,
          sender_name: wishData.senderName,
          message: wishData.message,
          is_approved: !isOffensive,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      
      return { 
        success: true, 
        data,
        moderated: isOffensive 
      };
    } catch (error) {
      console.error('Error sending birthday wish:', error);
      return { success: false, error };
    }
  },

  // Get wishes for a member
  async getWishesForMember(memberId) {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('member_id', memberId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wishes:', error);
      return [];
    }
  },

  // Moderate message content
  moderateMessage(message) {
    const lowerMessage = message.toLowerCase();
    return OFFENSIVE_WORDS.some(word => lowerMessage.includes(word));
  },

  // Subscribe to real-time wishes
  subscribeToWishes(memberId, callback) {
    const subscription = supabase
      .channel(`wishes-${memberId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'wishes',
          filter: `member_id=eq.${memberId}`
        },
        callback
      )
      .subscribe();

    return subscription;
  }
};

export default birthdayWishService;