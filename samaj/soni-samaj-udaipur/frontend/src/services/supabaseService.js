import { supabase, TABLES, STORAGE_BUCKETS } from '../supabase/config';

// Members Service
export const membersService = {
  // Create new member registration
  async createMember(memberData) {
    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .insert([memberData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all members with filters
  async getMembers(filters = {}) {
    let query = supabase.from(TABLES.MEMBERS).select('*');
    
    if (filters.status) {
      query = query.eq('registration_status', filters.status);
    }
    if (filters.district) {
      query = query.eq('district', filters.district);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Update member status
  async updateMemberStatus(memberId, status, approvedBy = null) {
    const updateData = { 
      registration_status: status,
      updated_at: new Date().toISOString()
    };
    
    if (status === 'approved' && approvedBy) {
      updateData.approved_by = approvedBy;
      updateData.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .update(updateData)
      .eq('id', memberId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Events Service
export const eventsService = {
  // Create event
  async createEvent(eventType, eventData) {
    const tableName = TABLES[`${eventType.toUpperCase()}_EVENTS`];
    
    const { data, error } = await supabase
      .from(tableName)
      .insert([eventData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get events by type
  async getEventsByType(eventType, limit = 50) {
    const tableName = TABLES[`${eventType.toUpperCase()}_EVENTS`];
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  // Update event
  async updateEvent(eventType, eventId, updateData) {
    const tableName = TABLES[`${eventType.toUpperCase()}_EVENTS`];
    
    const { data, error } = await supabase
      .from(tableName)
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', eventId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete event
  async deleteEvent(eventType, eventId) {
    const tableName = TABLES[`${eventType.toUpperCase()}_EVENTS`];
    
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', eventId)
      .select();
    
    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No record was deleted. Record may not exist or you may not have permission.');
    }
    
    return { success: true, deletedCount: data.length };
  },

  // Get today's birthdays
  async getTodaysBirthdays() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const { data, error } = await supabase
      .from(TABLES.BIRTHDAY_EVENTS)
      .select('*')
      .eq('is_published', true)
      .filter('birth_date', 'like', `%-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}%`);
    
    if (error) throw error;
    return data;
  }
};

// Sangathan Service
export const sangathanService = {
  // Get districts
  async getDistricts() {
    const { data, error } = await supabase
      .from(TABLES.DISTRICTS)
      .select('*')
      .eq('is_active', true)
      .order('district_name');
    
    if (error) throw error;
    return data;
  },

  // Get cities by district
  async getCitiesByDistrict(districtId) {
    const { data, error } = await supabase
      .from(TABLES.CITIES)
      .select('*')
      .eq('district_id', districtId)
      .eq('is_active', true)
      .order('city_name');
    
    if (error) throw error;
    return data;
  },

  // Get sangathan members by city
  async getSangathanMembersByCity(cityId) {
    const { data, error } = await supabase
      .from(TABLES.SANGATHAN_MEMBERS)
      .select(`
        *,
        position:sangathan_positions(position_name, position_level),
        city:cities(city_name),
        district:districts(district_name)
      `)
      .eq('city_id', cityId)
      .eq('is_active', true)
      .eq('is_current_position', true)
      .order('display_order');
    
    if (error) throw error;
    return data;
  },

  // Get sangathan hierarchy
  async getSangathanHierarchy() {
    const { data, error } = await supabase.rpc('get_sangathan_hierarchy');
    if (error) throw error;
    return data;
  },

  // Create sangathan member
  async createSangathanMember(memberData) {
    const { data, error } = await supabase
      .from(TABLES.SANGATHAN_MEMBERS)
      .insert([memberData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get positions
  async getPositions() {
    const { data, error } = await supabase
      .from(TABLES.SANGATHAN_POSITIONS)
      .select('*')
      .eq('is_active', true)
      .order('position_level');
    
    if (error) throw error;
    return data;
  }
};

// File Upload Service
export const fileService = {
  // Upload file to storage
  async uploadFile(file, bucket, path) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicData.publicUrl
    };
  },

  // Delete file from storage
  async deleteFile(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return { success: true };
  }
};

// Admin Service
export const adminService = {
  // Get admin user
  async getAdminUser(userId) {
    const { data, error } = await supabase
      .from(TABLES.ADMIN_USERS)
      .select('*')
      .eq('id', userId)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update last login
  async updateLastLogin(userId) {
    const { error } = await supabase
      .from(TABLES.ADMIN_USERS)
      .update({ 
        last_login: new Date().toISOString(),
        login_count: supabase.raw('login_count + 1')
      })
      .eq('id', userId);
    
    if (error) throw error;
  },

  // Log activity
  async logActivity(action, tableName, recordId = null, oldValues = null, newValues = null) {
    const { error } = await supabase.rpc('log_activity', {
      p_action: action,
      p_table_name: tableName,
      p_record_id: recordId,
      p_old_values: oldValues,
      p_new_values: newValues
    });
    
    if (error) console.error('Failed to log activity:', error);
  }
};

export default {
  membersService,
  eventsService,
  sangathanService,
  fileService,
  adminService
};