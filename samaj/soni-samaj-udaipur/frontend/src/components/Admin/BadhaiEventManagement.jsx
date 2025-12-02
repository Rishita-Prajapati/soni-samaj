import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import badhaiService from '../../services/badhaiService';
import './EventForms.css';
import './AdminButtonFixes.css';

const BadhaiEventManagement = ({ admin, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    celebrationPersonName: '',
    fatherName: '',
    motherName: '',
    occasionType: '',
    occasionDate: '',
    imageFile: null,
    eventDate: '',
    location: '',
    contactNumber: '',
    additionalNotes: '',
    isPublished: true
  });

  const handleShowForm = () => {
    console.log('Add Badhai button clicked, current showForm:', showForm);
    setShowForm(true);
    setEditingEvent(null);
    setFormData({
      title: '',
      celebrationPersonName: '',
      fatherName: '',
      motherName: '',
      occasionType: '',
      occasionDate: '',
      imageFile: null,
      eventDate: '',
      location: '',
      contactNumber: '',
      additionalNotes: '',
      isPublished: true
    });
    console.log('After setShowForm(true)');
  };

  useEffect(() => {
    loadEvents();
  }, []);
  
  useEffect(() => {
    console.log('showForm state changed to:', showForm);
  }, [showForm]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const result = await badhaiService.getAllBadhai();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error loading badhai events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      celebrationPersonName: '',
      fatherName: '',
      motherName: '',
      occasionType: '',
      occasionDate: '',
      imageFile: null,
      eventDate: '',
      location: '',
      contactNumber: '',
      additionalNotes: '',
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
        celebrationPersonName: formData.celebrationPersonName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        occasionType: formData.occasionType,
        occasionDate: formData.occasionDate,
        image: formData.imageFile,
        eventDate: formData.eventDate,
        location: formData.location,
        contactNumber: formData.contactNumber,
        additionalNotes: formData.additionalNotes,
        isPublished: formData.isPublished
      };

      let result;
      if (editingEvent) {
        result = await badhaiService.updateBadhai(editingEvent.id, eventData);
      } else {
        result = await badhaiService.createBadhai(eventData);
      }

      if (result.success) {
        const message = editingEvent ? 'Badhai event updated successfully!' : 'Badhai event created successfully!';
        alert(message);
        resetForm();
        loadEvents();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error saving badhai event: ' + error.message);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title || '',
      celebrationPersonName: event.celebration_person_name || '',
      fatherName: event.father_name || '',
      motherName: event.mother_name || '',
      occasionType: event.occasion_type || '',
      occasionDate: event.occasion_date || '',
      imageFile: null,
      eventDate: event.event_date || '',
      location: event.location || '',
      contactNumber: event.contact_number || '',
      additionalNotes: event.additional_notes || '',
      isPublished: event.is_published
    });
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this badhai event?')) {
      try {
        const result = await badhaiService.deleteBadhai(id);
        if (result.success) {
          alert('Badhai event deleted successfully!');
          loadEvents();
        } else {
          alert('Error deleting event: ' + result.error);
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
            <h1>🎉 Badhai Event Management</h1>
            <p>Manage celebration and congratulatory events</p>
          </div>
          <button 
            onClick={() => {
              console.log('Badhai button clicked');
              setShowForm(true);
              setEditingEvent(null);
            }}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            ➕ Add Badhai Event
          </button>
        </div>


        
        {!showForm ? (
          <div className="events-table-container">
            {loading ? (
              <div className="loading">Loading badhai events...</div>
            ) : (
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Person</th>
                    <th>Occasion</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        {event.image_url ? (
                          <img 
                            src={event.image_url} 
                            alt="Event" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ) : (
                          <div style={{ width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎉</div>
                        )}
                      </td>
                      <td><strong>{event.title}</strong></td>
                      <td>{event.celebration_person_name || 'N/A'}</td>
                      <td>{event.occasion_type || 'N/A'}</td>
                      <td>{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className={`status ${event.is_published ? 'published' : 'draft'}`}>
                          {event.is_published ? '✅ Published' : '📝 Draft'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(event)} className="btn-edit">Edit</button>
                          <button onClick={() => handleDelete(event.id)} className="btn-delete">Delete</button>
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
              <h2>{editingEvent ? 'Edit Badhai Event' : 'Add New Badhai Event'}</h2>
              <button onClick={resetForm} className="close-form-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-section">
                <h3>🎉 Badhai Event Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Event Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Person Being Celebrated *</label>
                    <input type="text" name="celebrationPersonName" value={formData.celebrationPersonName} onChange={handleInputChange} required />
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
                    <label>Occasion Type *</label>
                    <select name="occasionType" value={formData.occasionType} onChange={handleInputChange} required>
                      <option value="">Select Occasion</option>
                      <option value="Marriage">Marriage</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Birth of Child">Birth of Child</option>
                      <option value="Graduation">Graduation</option>
                      <option value="New Job">New Job</option>
                      <option value="Business Opening">Business Opening</option>
                      <option value="Achievement">Achievement</option>
                      <option value="Promotion">Promotion</option>
                      <option value="House Warming">House Warming</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Occasion Date</label>
                    <input type="date" name="occasionDate" value={formData.occasionDate} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Event Date</label>
                    <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Event Image</label>
                    <input 
                      type="file" 
                      name="imageFile" 
                      onChange={handleInputChange} 
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    />
                    {formData.imageFile && (
                      <div className="image-preview">
                        <img 
                          src={URL.createObjectURL(formData.imageFile)} 
                          alt="Preview" 
                          style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                        />
                      </div>
                    )}
                    {editingEvent && editingEvent.image_url && !formData.imageFile && (
                      <div className="current-image">
                        <img 
                          src={editingEvent.image_url} 
                          alt="Current" 
                          style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
                        />
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Current image</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Additional Notes</label>
                    <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleInputChange} rows="3" />
                  </div>
                </div>

                <div className="form-row">
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

export default BadhaiEventManagement;