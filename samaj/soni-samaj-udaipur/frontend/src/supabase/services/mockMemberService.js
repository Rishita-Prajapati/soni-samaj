// Mock member service for testing when Supabase is not accessible
export const mockMemberService = {
  // Mock create member function
  async createMember(memberData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for testing
      const members = JSON.parse(localStorage.getItem('mockMembers') || '[]');
      const newMember = {
        id: Date.now(),
        full_name: memberData.fullName,
        father_name: memberData.fatherName,
        mother_name: memberData.motherName,
        date_of_birth: memberData.dateOfBirth,
        gender: memberData.gender,
        marital_status: memberData.maritalStatus,
        mobile_number: memberData.mobileNumber,
        whatsapp_number: memberData.whatsappNumber,
        current_address: memberData.currentAddress,
        district: memberData.district,
        job_or_business: memberData.jobOrBusiness,
        qualification: memberData.qualification,
        blood_group: memberData.bloodGroup,
        gotra_self: memberData.gotraSelf,
        registration_status: 'pending',
        created_at: new Date().toISOString()
      };
      members.push(newMember);
      localStorage.setItem('mockMembers', JSON.stringify(members));
      
      return { success: true, data: newMember };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mock get all members
  async getAllMembers() {
    try {
      const members = JSON.parse(localStorage.getItem('mockMembers') || '[]');
      return { success: true, data: members };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Clear mock data
  clearMockData() {
    localStorage.removeItem('mockMembers');
  }
};

export default mockMemberService;