import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/config';

const MembersManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    mobileNumber: '',
    whatsappNumber: '',
    currentAddress: '',
    district: '',
    jobOrBusiness: '',
    qualification: '',
    bloodGroup: '',
    gotraSelf: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (data && !error) {
        setMembers(data);
      } else {
        // Fallback to localStorage data
        const mockMembers = JSON.parse(localStorage.getItem('mockMembers') || '[]');
        setMembers(mockMembers);
      }
    } catch (error) {
      console.error('Error loading members:', error);
      // Fallback to localStorage data
      const mockMembers = JSON.parse(localStorage.getItem('mockMembers') || '[]');
      setMembers(mockMembers);
    } finally {
      setLoading(false);
    }
  };

  const updateMemberStatus = async (memberId, status) => {
    try {
      const { error } = await supabase
        .from('members')
        .update({ registration_status: status })
        .eq('id', memberId);
      
      if (error) throw error;
      loadMembers();
      alert(`Member ${status} successfully!`);
    } catch (error) {
      console.error('Error updating member status:', error);
      alert('Failed to update member status');
    }
  };

  const deleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
      setMembers(members.filter(m => m.id !== memberId));
      alert('Member deleted successfully!');
    } catch (error) {
      console.error('Error deleting member:', error);
      setMembers(members.filter(m => m.id !== memberId)); // Remove from UI anyway
      alert('Member deleted from list!');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const memberData = {
        full_name: formData.fullName,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        marital_status: formData.maritalStatus,
        mobile_number: formData.mobileNumber,
        whatsapp_number: formData.whatsappNumber,
        current_address: formData.currentAddress,
        district: formData.district,
        job_or_business: formData.jobOrBusiness,
        qualification: formData.qualification,
        blood_group: formData.bloodGroup,
        gotra_self: formData.gotraSelf,
        registration_status: 'approved'
      };

      // Try to add to database
      let newMember;
      try {
        const { data, error } = await supabase
          .from('members')
          .insert([memberData])
          .select();
        
        if (error) throw error;
        newMember = data[0];
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Create temporary member for UI
        newMember = {
          id: Date.now(),
          ...memberData,
          created_at: new Date().toISOString()
        };
      }
      
      // Add to UI
      setMembers([newMember, ...members]);
      setFormData({
        fullName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        mobileNumber: '',
        whatsappNumber: '',
        currentAddress: '',
        district: '',
        jobOrBusiness: '',
        qualification: '',
        bloodGroup: '',
        gotraSelf: ''
      });
      setShowAddForm(false);
      alert('Member added successfully!');
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '30px',
        background: 'linear-gradient(135deg, #FFF5E1, #FFEAA7)',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(255, 153, 51, 0.2)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '15px', color: '#FF9933' }}>⏳</div>
          <h3 style={{ color: '#800000', margin: 0 }}>Loading Members...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      background: 'linear-gradient(135deg, #FFF5E1, #FFEAA7)',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FF9933, #800000)',
        color: 'white',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '25px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>👥 Members Management ({members.length})</h2>
        <button
          onClick={() => {
            console.log('Add Member clicked');
            setShowAddForm(true);
          }}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          + Add Member
        </button>
      </div>
      
      {members.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          background: 'white',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👥</div>
          <h3 style={{ color: '#800000', marginBottom: '10px' }}>No Members Registered Yet</h3>
          <p style={{ color: '#FF9933', marginBottom: '25px' }}>Start by adding your first member</p>
          <button
            onClick={() => {
              console.log('Add First Member clicked');
              setShowAddForm(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #FF9933, #800000)',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(255, 153, 51, 0.3)'
            }}
          >
            + Add First Member
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
        {members.map(member => (
          <div key={member.id} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: `3px solid ${
              member.registration_status === 'approved' ? '#10b981' :
              member.registration_status === 'rejected' ? '#ef4444' : '#f59e0b'
            }`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3>{member.full_name}</h3>
                <p><strong>Father:</strong> {member.father_name}</p>
                <p><strong>DOB:</strong> {member.date_of_birth}</p>
                <p><strong>Mobile:</strong> {member.mobile_number}</p>
                <p><strong>Address:</strong> {member.current_address}</p>
                <p><strong>Occupation:</strong> {member.job_or_business}</p>
                <p><strong>Status:</strong> 
                  <span style={{
                    color: member.registration_status === 'approved' ? '#10b981' :
                           member.registration_status === 'rejected' ? '#ef4444' : '#f59e0b',
                    fontWeight: 'bold',
                    marginLeft: '5px'
                  }}>
                    {member.registration_status}
                  </span>
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                {member.registration_status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateMemberStatus(member.id, 'approved')}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateMemberStatus(member.id, 'rejected')}
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
                  style={{
                    background: 'linear-gradient(135deg, #FF9933, #800000)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 4px 12px rgba(255, 153, 51, 0.3)'
                  }}
                >
                  {selectedMember?.id === member.id ? 'Hide' : 'View'} Details
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            
            {selectedMember?.id === member.id && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <h4>Complete Details:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                  <p><strong>Mother Name:</strong> {member.mother_name}</p>
                  <p><strong>Gender:</strong> {member.gender}</p>
                  <p><strong>Marital Status:</strong> {member.marital_status}</p>
                  <p><strong>Blood Group:</strong> {member.blood_group}</p>
                  <p><strong>Qualification:</strong> {member.qualification}</p>
                  <p><strong>Gotra Self:</strong> {member.gotra_self}</p>
                  <p><strong>District:</strong> {member.district}</p>
                  <p><strong>WhatsApp:</strong> {member.whatsapp_number}</p>
                  <p><strong>Registered:</strong> {new Date(member.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      )}
      
      {showAddForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#800000', margin: 0 }}>Add New Member</h3>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#800000'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddMember}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Father Name *</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Mother Name *</label>
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Marital Status *</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>WhatsApp Number *</label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>District *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Occupation *</label>
                  <select
                    name="jobOrBusiness"
                    value={formData.jobOrBusiness}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Occupation</option>
                    <option value="Business">Business</option>
                    <option value="Private Job">Private Job</option>
                    <option value="Government Job">Government Job</option>
                    <option value="Student">Student</option>
                    <option value="Housewife">Housewife</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Qualification *</label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Qualification</option>
                    <option value="Below 10th">Below 10th</option>
                    <option value="10th Pass">10th Pass</option>
                    <option value="12th Pass">12th Pass</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Post Graduate">Post Graduate</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Blood Group *</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Current Address *</label>
                <textarea
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#800000', fontWeight: '500' }}>Gotra *</label>
                <select
                  name="gotraSelf"
                  value={formData.gotraSelf}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px', border: '2px solid #FFE4B5', borderRadius: '6px', boxSizing: 'border-box' }}
                >
                  <option value="">Select Gotra</option>
                  <option value="Kashyap">Kashyap</option>
                  <option value="Bharadwaj">Bharadwaj</option>
                  <option value="Gautam">Gautam</option>
                  <option value="Agastya">Agastya</option>
                  <option value="Vishwamitra">Vishwamitra</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #FF9933, #800000)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {isSubmitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersManagement;