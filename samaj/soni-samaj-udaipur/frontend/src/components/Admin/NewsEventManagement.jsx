import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import newsService from '../../services/newsService';
import './EventForms.css';
import './AdminButtonFixes.css';

const NewsEventManagement = ({ admin, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    newsHeadline: '',
    newsCategory: '',
    newsContent: '',
    imageFile: null,
    eventDate: '',
    location: '',
    contactNumber: '',
    additionalNotes: '',
    isPublished: true
  });

  const handleShowForm = () => {
    console.log('Add News button clicked');
    setShowForm(true);
    setEditingEvent(null);
    setFormData({
      title: '',
      newsHeadline: '',
      newsCategory: '',
      newsContent: '',
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
      const result = await newsService.getAllNews();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error loading news events:', error);
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
      newsHeadline: '',
      newsCategory: '',
      newsContent: '',
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
        newsHeadline: formData.newsHeadline,
        newsCategory: formData.newsCategory,
        newsContent: formData.newsContent,
        image: formData.imageFile,
        eventDate: formData.eventDate,
        location: formData.location,
        contactNumber: formData.contactNumber,
        additionalNotes: formData.additionalNotes,
        isPublished: formData.isPublished
      };

      let result;
      if (editingEvent) {
        result = await newsService.updateNews(editingEvent.id, eventData);
      } else {
        result = await newsService.createNews(eventData);
      }

      if (result.success) {
        const message = editingEvent ? 'News updated successfully!' : 'News created successfully!';
        alert(message);
        resetForm();
        loadEvents();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error saving news: ' + error.message);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title || '',
      newsHeadline: event.news_headline || '',
      newsCategory: event.news_category || '',
      newsContent: event.news_content || '',
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
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        const result = await newsService.deleteNews(id);
        if (result.success) {
          alert('News deleted successfully!');
          loadEvents();
        } else {
          alert('Error deleting news: ' + result.error);
        }
      } catch (error) {
        alert('Error deleting news: ' + error.message);
      }
    }
  };

  return (
    <AdminLayout admin={admin} onLogout={onLogout}>
      <div className="event-management">
        <div className="page-header">
          <div>
            <h1>📰 News Management</h1>
            <p>Manage community news and articles</p>
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
            ➕ Add News Event
          </button>
        </div>

        <div style={{padding: '10px', background: '#f0f0f0', margin: '10px 0', borderRadius: '4px'}}>
          <strong>Debug Info:</strong> showForm = {showForm.toString()}
        </div>
        
        {!showForm ? (
          <div className="events-table-container">
            {loading ? (
              <div className="loading">Loading news...</div>
            ) : (
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Headline</th>
                    <th>Category</th>
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
                            alt="News" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ) : (
                          <div style={{ width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📰</div>
                        )}
                      </td>
                      <td><strong>{event.title}</strong></td>
                      <td>{event.news_headline || 'N/A'}</td>
                      <td>{event.news_category || 'N/A'}</td>
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
              <h2>{editingEvent ? 'Edit News' : 'Add New News'}</h2>
              <button onClick={resetForm} className="close-form-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-section">
                <h3>📰 News Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>News Headline *</label>
                    <input type="text" name="newsHeadline" value={formData.newsHeadline} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>News Category *</label>
                    <select name="newsCategory" value={formData.newsCategory} onChange={handleInputChange} required>
                      <option value="">Select Category</option>
                      <option value="Community">Community</option>
                      <option value="Events">Events</option>
                      <option value="Announcements">Announcements</option>
                      <option value="Achievements">Achievements</option>
                      <option value="Social Work">Social Work</option>
                      <option value="Religious">Religious</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Business">Business</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Event Date</label>
                    <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>News Image</label>
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
                    <label>News Content *</label>
                    <textarea name="newsContent" value={formData.newsContent} onChange={handleInputChange} rows="5" required />
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
                  {editingEvent ? 'Update News' : 'Create News'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default NewsEventManagement;