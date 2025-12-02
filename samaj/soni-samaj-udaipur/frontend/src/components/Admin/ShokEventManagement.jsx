import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import shokService from '../../services/shokService';
import './EventForms.css';
import './AdminButtonFixes.css';

const ShokEventManagement = ({ admin, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    deceasedName: '',
    deceasedFatherName: '',
    deceasedMotherName: '',
    ageAtDeath: '',
    dateOfDeath: '',
    imageFile: null,
    eventDate: '',
    location: '',
    contactNumber: '',
    additionalNotes: '',
    isPublished: true
  });

  const handleShowForm = () => {
    console.log('Add Shok button clicked');
    setShowForm(true);
    setEditingEvent(null);
    setFormData({
      title: '',
      deceasedName: '',
      deceasedFatherName: '',
      deceasedMotherName: '',
      ageAtDeath: '',
      dateOfDeath: '',
      imageFile: null,
      eventDate: '',
      location: '',
      contactNumber: '',
      additionalNotes: '',
      isPublished: true
    });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const result = await shokService.getAllShok();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error loading shok events:', error);
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
      deceasedName: '',
      deceasedFatherName: '',
      deceasedMotherName: '',
      ageAtDeath: '',
      dateOfDeath: '',
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
        deceasedName: formData.deceasedName,
        deceasedFatherName: formData.deceasedFatherName,
        deceasedMotherName: formData.deceasedMotherName,
        ageAtDeath: parseInt(formData.ageAtDeath) || null,
        dateOfDeath: formData.dateOfDeath,
        image: formData.imageFile,
        eventDate: formData.eventDate,
        location: formData.location,
        contactNumber: formData.contactNumber,
        additionalNotes: formData.additionalNotes,
        isPublished: formData.isPublished
      };

      let result;
      if (editingEvent) {
        result = await shokService.updateShok(editingEvent.id, eventData);
      } else {
        result = await shokService.createShok(eventData);
      }

      if (result.success) {
        const message = editingEvent ? 'Shok event updated successfully!' : 'Shok event created successfully!';
        alert(message);
        resetForm();
        loadEvents();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error saving shok event: ' + error.message);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title || '',
      deceasedName: event.deceased_name || '',
      deceasedFatherName: event.deceased_father_name || '',
      deceasedMotherName: event.deceased_mother_name || '',
      ageAtDeath: event.age_at_death || '',
      dateOfDeath: event.date_of_death || '',
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
    if (window.confirm('Are you sure you want to delete this shok event?')) {
      try {
        const result = await shokService.deleteShok(id);
        if (result.success) {
          alert('Shok event deleted successfully!');
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
            <h1>🙏 Shok Event Management</h1>
            <p>Manage condolence and memorial events</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
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
            ➕ Add Shok Event
          </button>
        </div>


        
        {!showForm ? (
          <div className="events-table-container">
            {loading ? (
              <div className="loading">Loading shok events...</div>
            ) : (
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Deceased Name</th>
                    <th>Age</th>
                    <th>Date of Death</th>
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
                          <div style={{ width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🙏</div>
                        )}
                      </td>
                      <td><strong>{event.title}</strong></td>
                      <td>{event.deceased_name || 'N/A'}</td>
                      <td>{event.age_at_death || 'N/A'}</td>
                      <td>{event.date_of_death ? new Date(event.date_of_death).toLocaleDateString() : 'N/A'}</td>
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
              <h2>{editingEvent ? 'Edit Shok Event' : 'Add New Shok Event'}</h2>
              <button onClick={resetForm} className="close-form-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-section">
                <h3>🙏 Shok Event Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Event Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Deceased Name *</label>
                    <input type="text" name="deceasedName" value={formData.deceasedName} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Deceased Father's Name</label>
                    <input type="text" name="deceasedFatherName" value={formData.deceasedFatherName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Deceased Mother's Name</label>
                    <input type="text" name="deceasedMotherName" value={formData.deceasedMotherName} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Age at Death</label>
                    <input type="number" name="ageAtDeath" value={formData.ageAtDeath} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Date of Death</label>
                    <input type="date" name="dateOfDeath" value={formData.dateOfDeath} onChange={handleInputChange} />
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

export default ShokEventManagement;