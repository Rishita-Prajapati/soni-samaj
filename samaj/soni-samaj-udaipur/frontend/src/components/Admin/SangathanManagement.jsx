import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { supabase } from '../../supabase/config';
import ImageUpload from '../ImageUpload';
import imageUploadService from '../../services/imageUploadService';
import './EventForms.css';
import './AdminButtonFixes.css';

const SangathanManagement = ({ admin, onLogout }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    position: '',
    city: '',
    district: '',
    state: '',
    address: '',
    mobile: '',
    occupation: '',
    memberImage: null,
    districtImage: null,
    cityImage: null,
    isActive: true
  });

  const handleShowForm = () => {
    console.log('Add Sangathan button clicked');
    setShowForm(true);
    setEditingMember(null);
    setFormData({
      fullName: '',
      fatherName: '',
      position: '',
      city: '',
      district: '',
      state: '',
      address: '',
      mobile: '',
      occupation: '',
      memberImage: null,
      districtImage: null,
      cityImage: null,
      isActive: true
    });
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sangathan')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading sangathan members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      fatherName: '',
      position: '',
      city: '',
      district: '',
      state: '',
      address: '',
      mobile: '',
      occupation: '',
      memberImage: null,
      districtImage: null,
      cityImage: null,
      isActive: true
    });
    setEditingMember(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let memberImageUrl = editingMember?.image_url || '';
      let memberImageFilename = editingMember?.image_filename || '';
      let districtImageUrl = editingMember?.district_image_url || '';
      let districtImageFilename = editingMember?.district_image_filename || '';
      let cityImageUrl = editingMember?.city_image_url || '';
      let cityImageFilename = editingMember?.city_image_filename || '';
      
      // Upload member image
      if (formData.memberImage) {
        const result = await imageUploadService.uploadImage(
          formData.memberImage,
          'sangathan',
          'members'
        );
        if (result.success) {
          memberImageUrl = result.url;
          memberImageFilename = formData.memberImage.name;
        }
      }
      
      // Upload district image
      if (formData.districtImage) {
        const result = await imageUploadService.uploadImage(
          formData.districtImage,
          'sangathan',
          'districts'
        );
        if (result.success) {
          districtImageUrl = result.url;
          districtImageFilename = formData.districtImage.name;
        }
      }
      
      // Upload city image
      if (formData.cityImage) {
        const result = await imageUploadService.uploadImage(
          formData.cityImage,
          'sangathan',
          'cities'
        );
        if (result.success) {
          cityImageUrl = result.url;
          cityImageFilename = formData.cityImage.name;
        }
      }

      const memberData = {
        full_name: formData.fullName,
        father_name: formData.fatherName,
        position: formData.position,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        address: formData.address,
        mobile: formData.mobile,
        occupation: formData.occupation,
        image_url: memberImageUrl,
        image_filename: memberImageFilename,
        district_image_url: districtImageUrl,
        district_image_filename: districtImageFilename,
        city_image_url: cityImageUrl,
        city_image_filename: cityImageFilename,
        is_active: formData.isActive
      };

      let result;
      if (editingMember) {
        const { data, error } = await supabase
          .from('sangathan')
          .update(memberData)
          .eq('id', editingMember.id)
          .select()
          .single();
        result = { success: !error, data, error };
      } else {
        const { data, error } = await supabase
          .from('sangathan')
          .insert([memberData])
          .select()
          .single();
        result = { success: !error, data, error };
      }

      if (result.success) {
        alert(editingMember ? 'Sangathan member updated successfully!' : 'Sangathan member added successfully!');
        resetForm();
        loadMembers();
      } else {
        alert('Error: ' + result.error?.message);
      }
    } catch (error) {
      alert('Error saving sangathan member: ' + error.message);
    }
  };

  const handleEdit = (member) => {
    setFormData({
      fullName: member.full_name || '',
      fatherName: member.father_name || '',
      position: member.position || '',
      city: member.city || '',
      district: member.district || '',
      state: member.state || '',
      address: member.address || '',
      mobile: member.mobile || '',
      occupation: member.occupation || '',
      memberImage: null,
      districtImage: null,
      cityImage: null,
      isActive: member.is_active
    });
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sangathan member?')) {
      try {
        const { error } = await supabase
          .from('sangathan')
          .delete()
          .eq('id', id);

        if (!error) {
          alert('Sangathan member deleted successfully!');
          loadMembers();
        } else {
          alert('Error deleting member: ' + error.message);
        }
      } catch (error) {
        alert('Error deleting member: ' + error.message);
      }
    }
  };

  return (
    <AdminLayout admin={admin} onLogout={onLogout}>
      <div className="event-management">
        <div className="page-header">
          <div>
            <h1>🏛️ Sangathan Management</h1>
            <p>Manage organization committee members</p>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              console.log('Add Sangathan button clicked');
              setShowForm(true);
              setEditingMember(null);
            }}
            className="add-event-btn"
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ➕ Add Member
          </button>
        </div>

        <div style={{padding: '10px', background: '#f0f0f0', margin: '10px 0', borderRadius: '4px'}}>
          <strong>Debug Info:</strong> showForm = {showForm.toString()}
        </div>
        
        {!showForm ? (
          <div className="events-table-container">
            {loading ? (
              <div className="loading">Loading sangathan members...</div>
            ) : (
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>City</th>
                    <th>District</th>
                    <th>Mobile</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.full_name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: '16px', color: '#6b7280' }}>👤</span>
                          )}
                        </div>
                      </td>
                      <td><strong>{member.full_name}</strong></td>
                      <td>{member.position || 'N/A'}</td>
                      <td>{member.city || 'N/A'}</td>
                      <td>{member.district || 'N/A'}</td>
                      <td>{member.mobile || 'N/A'}</td>
                      <td>
                        <span className={`status ${member.is_active ? 'published' : 'draft'}`}>
                          {member.is_active ? '✅ Active' : '❌ Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(member)} className="btn-edit">✏️</button>
                          <button onClick={() => handleDelete(member.id)} className="btn-delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="event-form-container">
            <div className="form-header">
              <h2>{editingMember ? 'Edit Sangathan Member' : 'Add New Sangathan Member'}</h2>
              <button onClick={resetForm} className="close-form-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-section">
                <h3>🏛️ Member Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Father's Name *</label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Position *</label>
                    <select name="position" value={formData.position} onChange={handleInputChange} required>
                      <option value="">Select Position</option>
                      <option value="President">President</option>
                      <option value="Vice President">Vice President</option>
                      <option value="Secretary">Secretary</option>
                      <option value="Joint Secretary">Joint Secretary</option>
                      <option value="Treasurer">Treasurer</option>
                      <option value="Executive Member">Executive Member</option>
                      <option value="Advisor">Advisor</option>
                      <option value="Patron">Patron</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>District *</label>
                    <input type="text" name="district" value={formData.district} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Occupation *</label>
                    <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <ImageUpload
                      label="Member Photo"
                      onImageSelect={(file) => setFormData(prev => ({ ...prev, memberImage: file }))}
                      currentImage={editingMember?.image_url}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <ImageUpload
                      label="District Image"
                      onImageSelect={(file) => setFormData(prev => ({ ...prev, districtImage: file }))}
                      currentImage={editingMember?.district_image_url}
                    />
                  </div>
                  <div className="form-group">
                    <ImageUpload
                      label="City Image"
                      onImageSelect={(file) => setFormData(prev => ({ ...prev, cityImage: file }))}
                      currentImage={editingMember?.city_image_url}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                      Active Member
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SangathanManagement;