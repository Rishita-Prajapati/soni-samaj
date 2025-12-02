import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { supabase } from '../../supabase/config';
import './EventForms.css';
import './AdminButtonFixes.css';

const BirthdayEventManagement = ({ admin, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    birthdayPersonName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    mobileNumber: '',
    photoFile: null,
    currentAddress: '',
    ageCompleting: '',
    isActive: true,
    isPublished: true
  });

  const handleShowForm = () => {
    console.log('Add Birthday button clicked');
    setShowForm(true);
    setEditingEvent(null);
    setFormData({
      title: '',
      birthdayPersonName: '',
      fatherName: '',
      motherName: '',
      dateOfBirth: '',
      mobileNumber: '',
      photoFile: null,
      currentAddress: '',
      ageCompleting: '',
      isActive: true,
      isPublished: true
    });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('birthday_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading birthday events:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    };
    
    if (name === 'dateOfBirth') {
      newFormData.ageCompleting = calculateAge(value);
    }
    
    setFormData(newFormData);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      birthdayPersonName: '',
      fatherName: '',
      motherName: '',
      dateOfBirth: '',
      mobileNumber: '',
      photoFile: null,
      currentAddress: '',
      ageCompleting: '',
      isActive: true,
      isPublished: true
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const eventData = {
        title: formData.title,
        birthday_person_name: formData.birthdayPersonName,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        date_of_birth: formData.dateOfBirth,
        mobile_number: formData.mobileNumber,
        photo_url: formData.photoFile,
        current_address: formData.currentAddress,
        age_completing: parseInt(formData.ageCompleting) || null,
        is_active: formData.isActive,
        is_published: formData.isPublished
      };

      let result;
      if (editingEvent) {
        const { data, error } = await supabase
          .from('birthday_events')
          .update(eventData)
          .eq('id', editingEvent.id)
          .select()
          .single();
        result = { success: !error, data, error };
      } else {
        const { data, error } = await supabase
          .from('birthday_events')
          .insert([eventData])
          .select()
          .single();
        result = { success: !error, data, error };
      }

      if (result.success) {
        alert(editingEvent ? 'Birthday event updated successfully!' : 'Birthday event created successfully!');
        resetForm();
        loadEvents();
      } else {
        alert('Error: ' + result.error?.message);
      }
    } catch (error) {
      alert('Error saving birthday event: ' + error.message);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title || '',
      birthdayPersonName: event.birthday_person_name || '',
      fatherName: event.father_name || '',
      motherName: event.mother_name || '',
      dateOfBirth: event.date_of_birth || '',
      mobileNumber: event.mobile_number || '',
      photoFile: null,
      currentAddress: event.current_address || '',
      ageCompleting: event.age_completing || '',
      isActive: event.is_active,
      isPublished: event.is_published
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this birthday event?')) {
      try {
        const { error } = await supabase
          .from('birthday_events')
          .delete()
          .eq('id', id);

        if (!error) {
          alert('Birthday event deleted successfully!');
          loadEvents();
        } else {
          alert('Error deleting event: ' + error.message);
        }
      } catch (error) {
        alert('Error deleting event: ' + error.message);
      }
    }
  };

  return (
    <AdminLayout admin={admin} onLogout={onLogout}>
      <div className="event-management">
        <div className="page-header">
          <div>
            <h1>🎂 Birthday Event Management</h1>
            <p>Manage birthday celebrations and wishes</p>
          </div>
          <button 
            onClick={() => {
              console.log('Birthday button clicked');
              setShowForm(true);
              setEditingEvent(null);
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
            ➕ Add Birthday Event
          </button>
        </div>


        
        {!showForm ? (
          <div className="events-table-container">
            {loading ? (
              <div className="loading">Loading birthday events...</div>
            ) : (
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Person</th>
                    <th>Age</th>
                    <th>Birthday Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td><strong>{event.title}</strong></td>
                      <td>{event.birthday_person_name || 'N/A'}</td>
                      <td>{event.age_completing || 'N/A'}</td>
                      <td>{event.date_of_birth ? new Date(event.date_of_birth).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className={`status ${event.is_published ? 'published' : 'draft'}`}>
                          {event.is_published ? '✅ Published' : '📝 Draft'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(event)} className="btn-edit">✏️</button>
                          <button onClick={() => handleDelete(event.id)} className="btn-delete">🗑️</button>
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
              <h2>{editingEvent ? 'Edit Birthday Event' : 'Add New Birthday Event'}</h2>
              <button onClick={resetForm} className="close-form-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-section">
                <h3>🎂 Birthday Event Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Event Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Birthday Person Name *</label>
                    <input type="text" name="birthdayPersonName" value={formData.birthdayPersonName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Father's Name</label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Mother's Name</label>
                    <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Age Completing (Auto-calculated)</label>
                    <input type="number" name="ageCompleting" value={formData.ageCompleting} onChange={handleInputChange} readOnly style={{backgroundColor: '#f3f4f6'}} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Photo</label>
                    <input 
                      type="file" 
                      name="photoFile" 
                      onChange={handleInputChange} 
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Current Address</label>
                    <textarea name="currentAddress" value={formData.currentAddress} onChange={handleInputChange} rows="3" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                      Active Event
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} />
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BirthdayEventManagement;