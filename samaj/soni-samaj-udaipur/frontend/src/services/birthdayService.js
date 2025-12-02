import { supabase } from '../supabase/config';

class BirthdayService {
  // Get today's birthdays from members table
  async getTodaysBirthdays() {
    try {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, profile_image_url, date_of_birth, mobile_number')
        .eq('registration_status', 'approved')
        .like('date_of_birth', `%-${month}-${day}`);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching today\'s birthdays:', error);
      return [];
    }
  }

  // Get upcoming birthdays (next 7 days)
  async getUpcomingBirthdays() {
    try {
      const today = new Date();
      const upcomingBirthdays = [];
      
      // Check next 7 days
      for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        
        const month = String(futureDate.getMonth() + 1).padStart(2, '0');
        const day = String(futureDate.getDate()).padStart(2, '0');
        
        const { data } = await supabase
          .from('members')
          .select('id, full_name, profile_image_url, date_of_birth, mobile_number')
          .eq('registration_status', 'approved')
          .like('date_of_birth', `%-${month}-${day}`);
        
        if (data && data.length > 0) {
          upcomingBirthdays.push(...data.map(member => ({
            ...member,
            daysUntil: i
          })));
        }
      }
      
      return upcomingBirthdays;
    } catch (error) {
      console.error('Error fetching upcoming birthdays:', error);
      return [];
    }
  }

  // Get birthday wishes for a member
  async getBirthdayWishes(memberId) {
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
      console.error('Error fetching birthday wishes:', error);
      return [];
    }
  }

  // Send birthday wish
  async sendBirthdayWish(memberId, senderName, message) {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .insert([{
          member_id: memberId,
          sender_name: senderName,
          message: message,
          is_approved: true,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error sending birthday wish:', error);
      return { success: false, error: error.message };
    }
  }

  // Get birthday statistics
  async getBirthdayStats() {
    try {
      const [todaysBirthdays, upcomingBirthdays] = await Promise.all([
        this.getTodaysBirthdays(),
        this.getUpcomingBirthdays()
      ]);

      return {
        todayCount: todaysBirthdays.length,
        upcomingCount: upcomingBirthdays.length,
        totalWishes: await this.getTotalWishesCount()
      };
    } catch (error) {
      console.error('Error fetching birthday stats:', error);
      return {
        todayCount: 0,
        upcomingCount: 0,
        totalWishes: 0
      };
    }
  }

  // Get total wishes count
  async getTotalWishesCount() {
    try {
      const { count, error } = await supabase
        .from('wishes')
        .select('id', { count: 'exact' })
        .eq('is_approved', true);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching total wishes count:', error);
      return 0;
    }
  }

  // Create birthday notification (for future use with push notifications)
  async createBirthdayNotification(memberId, type = 'birthday_today') {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          member_id: memberId,
          type: type,
          title: type === 'birthday_today' ? 'Birthday Today!' : 'Upcoming Birthday',
          message: type === 'birthday_today' 
            ? 'Wish them a happy birthday!' 
            : 'Birthday coming up in a few days',
          is_read: false,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating birthday notification:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new BirthdayService();