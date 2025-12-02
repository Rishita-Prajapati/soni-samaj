import { supabase } from '../supabase/config';
import imageUploadService from './imageUploadService';

export const memberService = {
  // Register new member from UI
  async registerMember(memberData) {
    try {
      let profileImageUrl = '';
      let profileImageFilename = '';
      
      // Upload profile image if provided
      if (memberData.profileImage) {
        console.log('Uploading profile image:', memberData.profileImage.name);
        const result = await imageUploadService.uploadImage(
          memberData.profileImage,
          'profiles',
          'members'
        );
        console.log('Upload result:', result);
        if (result.success) {
          profileImageUrl = result.url;
          profileImageFilename = memberData.profileImage.name;
          console.log('Image uploaded successfully:', profileImageUrl);
        } else {
          console.error('Image upload failed:', result.error);
          throw new Error('Failed to upload profile image: ' + result.error);
        }
      }
      // Prepare member data for database
      const dbMemberData = {
        full_name: memberData.fullName || '',
        father_name: memberData.fatherName || '',
        mother_name: memberData.motherName || '',
        date_of_birth: memberData.dateOfBirth || new Date().toISOString().split('T')[0],
        gender: memberData.gender || 'Male',
        marital_status: memberData.maritalStatus || 'Single',
        current_address: memberData.currentAddress || '',
        district: memberData.district || '',
        gotra_self: memberData.gotraSelf || '',
        qualification: memberData.qualification || 'Not Specified',
        blood_group: memberData.bloodGroup || 'O+',
        mobile_number: memberData.mobileNumber || '',
        whatsapp_number: memberData.whatsappNumber || memberData.mobileNumber || '',
        email: memberData.email || null,
        profile_image_url: profileImageUrl || null,
        profile_image_filename: profileImageFilename || null,
        job_or_business: memberData.jobOrBusiness || 'Not Specified',
        satimata_place: memberData.satimataPlace || '',
        bheruji_place: memberData.bherujiPlace || '',
        kuldevi_place: memberData.kuldeviPlace || '',
        registration_status: 'pending'
      };
      
      console.log('Prepared member data for database:', dbMemberData);
      const { data, error } = await supabase
        .from('members')
        .insert([dbMemberData])
        .select()
        .single();
        
      if (error) {
        console.error('Database insert error:', error);
        return { success: false, error };
      }
      
      console.log('Member registered successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error registering member:', error);
      return { success: false, error };
    }
  },

  // Get all members for admin
  async getAllMembers() {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  },

  // Update member status (approve/reject)
  async updateMemberStatus(memberId, status, approvedBy = null) {
    try {
      const updateData = {
        registration_status: status,
        updated_at: new Date().toISOString()
      };

      if (status === 'approved' && approvedBy) {
        updateData.approved_by = approvedBy;
        updateData.approved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating member status:', error);
      throw error;
    }
  },

  // Delete member
  async deleteMember(memberId) {
    try {
      const { data, error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId)
        .select();

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No member was deleted. Member may not exist or you may not have permission.');
      }
      
      return { success: true, deletedCount: data.length };
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  },

  // Get member statistics
  async getMemberStats() {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('registration_status');

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter(m => m.registration_status === 'pending').length,
        approved: data.filter(m => m.registration_status === 'approved').length,
        rejected: data.filter(m => m.registration_status === 'rejected').length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching member stats:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }
};

export default memberService;