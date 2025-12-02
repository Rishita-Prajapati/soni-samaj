import { supabase } from '../config.js';

// Message service functions
export const messageService = {
  // Create new message
  async createMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          name: messageData.name,
          email: messageData.email,
          phone: messageData.phone || null,
          subject: messageData.subject,
          message: messageData.message
        }])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all messages
  async getAllMessages(page = 1, limit = 20) {
    try {
      const { data, error, count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
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

  // Mark message as read
  async markAsRead(id) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete message
  async deleteMessage(id) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export const memberService = {
  // Test connection
  async testConnection() {
    try {
      const { error } = await supabase.from('members').select('count').limit(1);
      return { success: !error, error: error?.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create a new member registration
  async createMember(memberData) {
    try {
      // Prepare the member data for database insertion
      const memberRecord = {
        full_name: memberData.fullName,
        father_name: memberData.fatherName,
        mother_name: memberData.motherName,
        date_of_birth: memberData.dateOfBirth,
        gender: memberData.gender,
        marital_status: memberData.maritalStatus,
        current_address: memberData.currentAddress,
        district: memberData.district,
        gotra_self: memberData.gotraSelf,
        qualification: memberData.qualification,
        blood_group: memberData.bloodGroup,
        mobile_number: memberData.mobileNumber,
        whatsapp_number: memberData.whatsappNumber,
        email: memberData.email || null,
        job_or_business: memberData.jobOrBusiness,
        satimata_place: memberData.satimataPlace,
        bheruji_place: memberData.bherujiPlace,
        kuldevi_place: memberData.kuldeviPlace,
        registration_status: 'pending'
      };

      const { data, error } = await supabase
        .from('members')
        .insert([memberRecord])
        .select();

      if (error) {
        if (error.code === '23505') {
          return { success: false, error: 'This mobile number is already registered.' };
        }
        return { success: false, error: error.message };
      }

      // Create birthday event for the new member
      if (data && data[0]) {
        await this.createBirthdayEvent(data[0]);
      }

      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create birthday event for member
  async createBirthdayEvent(member) {
    try {
      const { error } = await supabase
        .from('birthday_events')
        .insert([{
          member_id: member.id,
          person_name: member.full_name,
          birth_date: member.date_of_birth,
          mobile_number: member.mobile_number,
          is_active: true
        }]);
      
      if (error) console.error('Error creating birthday event:', error);
    } catch (error) {
      console.error('Error creating birthday event:', error);
    }
  },

  // Get all members with pagination
  async getAllMembers(page = 1, limit = 50, status = 'all') {
    try {
      let query = supabase
        .from('members')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      if (status !== 'all') {
        query = query.eq('registration_status', status);
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

  // Get member by ID
  async getMemberById(id) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search members
  async searchMembers(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('is_active', true)
        .or(`full_name.ilike.%${searchTerm}%,mobile_number.ilike.%${searchTerm}%,father_name.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Approve member
  async approveMember(id) {
    try {
      const { data, error } = await supabase
        .from('members')
        .update({ registration_status: 'approved' })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reject member
  async rejectMember(id, reason = '') {
    try {
      const { data, error } = await supabase
        .from('members')
        .update({ 
          registration_status: 'rejected',
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

  // Delete member (soft delete)
  async deleteMember(id) {
    try {
      const { data, error } = await supabase
        .from('members')
        .update({ is_active: false })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get dashboard stats
  async getStats() {
    try {
      const [membersResult, pendingResult, birthdaysResult] = await Promise.all([
        supabase.from('members').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('members').select('id', { count: 'exact' }).eq('registration_status', 'pending'),
        supabase.from('birthday_events').select('id', { count: 'exact' }).eq('is_active', true)
      ]);

      return {
        success: true,
        data: {
          totalMembers: membersResult.count || 0,
          pendingMembers: pendingResult.count || 0,
          totalBirthdays: birthdaysResult.count || 0
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default memberService;