import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { eventsService } from '../../supabase/services/eventsService';
import './EventManagement.css';

const EventManagement = ({ admin, onLogout, defaultType = 'all' }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState(defaultType);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    type: 'badhai',
    eventDate: '',
    location: '',
    contactNumber: '',
    imageUrl: '',
    isPublished: true,
    // Badhai specific fields
    personName: '',
    fatherName: '',
    occasion: '',
    relationshipType: '',
    // Shok specific fields
    deceasedName: '',
    deceasedFatherName: '',
    ageAtDeath: '',
    deathDate: '',
    deathPlace: '',
    lastRites: '',
    // News specific fields
    newsCategory: '',
    newsSource: '',
    newsDate: '',
    // Birthday specific fields
    birthdayPersonName: '',
    birthdayDate: '',
    age: '',
    wishes: ''
  });

  useEffect(() => {
    loadEvents();
  }, [currentPage, typeFilter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const result = await eventsService.getAllEvents(currentPage, 20, typeFilter);
      if (result.success) {
        setEvents(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Error loading events:', error);
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
      title: '', subtitle: '', description: '', type: defaultType !== 'all' ? defaultType : 'badhai', eventDate: '', location: '', contactNumber: '', imageUrl: '', isPublished: true,
      personName: '', fatherName: '', occasion: '', relationshipType: '',
      deceasedName: '', deceasedFatherName: '', ageAtDeath: '', deathDate: '', deathPlace: '', lastRites: '',
      newsCategory: '', newsSource: '', newsDate: '',
      birthdayPersonName: '', birthdayDate: '', age: '', wishes: ''
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare event data based on type
      let eventData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        type: formData.type,
        eventDate: formData.eventDate || null,
        location: formData.location,
        contactNumber: formData.contactNumber,
        imageUrl: formData.imageUrl,
        isPublished: formData.isPublished
      };

      // Add type-specific data to description
      let additionalData = {};
      
      if (formData.type === 'badhai') {
        additionalData = {
          personName: formData.personName,
          fatherName: formData.fatherName,
          occasion: formData.occasion,
          relationshipType: formData.relationshipType
        };
      } else if (formData.type === 'shok') {
        additionalData = {
          deceasedName: formData.deceasedName,
          deceasedFatherName: formData.deceasedFatherName,
          ageAtDeath: formData.ageAtDeath,
          deathDate: formData.deathDate,
          deathPlace: formData.deathPlace,
          lastRites: formData.lastRites
        };
      } else if (formData.type === 'news') {
        additionalData = {
          newsCategory: formData.newsCategory,
          newsSource: formData.newsSource,
          newsDate: formData.newsDate
        };
      } else if (formData.type === 'birthday') {
        additionalData = {
          birthdayPersonName: formData.birthdayPersonName,
          birthdayDate: formData.birthdayDate,
          age: formData.age,
          wishes: formData.wishes
        };
      }

      // Combine description with additional data
      eventData.description = JSON.stringify({
        description: formData.description,
        additionalData
      });

      let result;
      if (editingEvent) {
        result = await eventsService.updateEvent(editingEvent.id, eventData);
      } else {
        result = await eventsService.createEvent(eventData);
      }

      if (result.success) {
        alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
        resetForm();
        loadEvents();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error saving event: ' + error.message);
    }
  };

  const handleEdit = async (event) => {
    try {
      // Parse the description to get additional data
      let parsedDescription = { description: event.description, additionalData: {} };
      try {
        parsedDescription = JSON.parse(event.description);
      } catch (e) {
        // If parsing fails, treat as simple description
        parsedDescription = { description: event.description, additionalData: {} };
      }

      setFormData({
        title: event.title,
        subtitle: event.subtitle || '',
        description: parsedDescription.description || event.description,
        type: event.type,
        eventDate: event.event_date || '',
        location: event.location || '',
        contactNumber: event.contact_number || '',
        imageUrl: event.image_url || '',
        isPublished: event.is_published,
        // Populate type-specific fields
        ...parsedDescription.additionalData
      });
      
      setEditingEvent(event);
      setShowForm(true);
    } catch (error) {
      alert('Error loading event for editing: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const result = await eventsService.deleteEvent(id);
        if (result.success) {
          alert('Event deleted successfully!');
          loadEvents();
        } else {
          alert('Error deleting event: ' + result.error);
        }
      } catch (error) {
        alert('Error deleting event: ' + error.message);
      }
    }
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      badhai: '🎉',
      shok: '🙏',
      news: '📰',
      birthday: '🎂'
    };
    return icons[type] || '📅';
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'badhai':
        return (
          <div className="type-specific-fields">
            <h3>🎉 Badhai Event Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Person Name *</label>
                <input
                  type="text"
                  name="personName"
                  value={formData.personName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Occasion *</label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Occasion</option>
                  <option value="marriage">Marriage</option>
                  <option value="engagement">Engagement</option>
                  <option value="birth">Birth of Child</option>
                  <option value="graduation">Graduation</option>
                  <option value="job">New Job</option>
                  <option value="business">New Business</option>
                  <option value="achievement">Achievement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <select
                  name="relationshipType"
                  value={formData.relationshipType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Relationship</option>
                  <option value="son">Son</option>
                  <option value="daughter">Daughter</option>
                  <option value="brother">Brother</option>
                  <option value="sister">Sister</option>
                  <option value="nephew">Nephew</option>
                  <option value="niece">Niece</option>
                  <option value="grandson">Grandson</option>
                  <option value="granddaughter">Granddaughter</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'shok':
        return (
          <div className="type-specific-fields">
            <h3>🙏 Shok Event Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Deceased Name *</label>
                <input
                  type="text"
                  name="deceasedName"
                  value={formData.deceasedName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Father's Name</label>
                <input
                  type="text"
                  name="deceasedFatherName"
                  value={formData.deceasedFatherName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Age at Death</label>
                <input
                  type="number"
                  name="ageAtDeath"
                  value={formData.ageAtDeath}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Death Date</label>
                <input
                  type="date"
                  name="deathDate"
                  value={formData.deathDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Death Place</label>
                <input
                  type="text"
                  name="deathPlace"
                  value={formData.deathPlace}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Last Rites Details</label>
                <input
                  type="text"
                  name="lastRites"
                  value={formData.lastRites}
                  onChange={handleInputChange}
                  placeholder="Time, place, etc."
                />
              </div>
            </div>
          </div>
        );

      case 'news':
        return (
          <div className="type-specific-fields">
            <h3>📰 News Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>News Category *</label>
                <select
                  name="newsCategory"
                  value={formData.newsCategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="community">Community News</option>
                  <option value="achievement">Achievement</option>
                  <option value="announcement">Announcement</option>
                  <option value="event">Event News</option>
                  <option value="social">Social Work</option>
                  <option value="business">Business News</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>News Source</label>
                <input
                  type="text"
                  name="newsSource"
                  value={formData.newsSource}
                  onChange={handleInputChange}
                  placeholder="Source of news"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>News Date</label>
                <input
                  type="date"
                  name="newsDate"
                  value={formData.newsDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );

      case 'birthday':
        return (
          <div className="type-specific-fields">
            <h3>🎂 Birthday Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Person Name *</label>
                <input
                  type="text"
                  name="birthdayPersonName"
                  value={formData.birthdayPersonName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Birthday Date *</label>
                <input
                  type="date"
                  name="birthdayDate"
                  value={formData.birthdayDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Special Wishes</label>
                <textarea
                  name="wishes"
                  value={formData.wishes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Birthday wishes..."
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout admin={admin} onLogout={onLogout} currentModule="events">
      <div className="event-management">
        <div className="page-header">
          <h1>📅 Event Management</h1>
          <p>Manage all community events and announcements</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="add-event-btn"
          >
            ➕ Add New Event
          </button>
        </div>

        {!showForm ? (
          <>
            {/* Filters */}
            <div className="controls-section">
              <div className="filter-section">
                <select 
                  value={typeFilter} 
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Events</option>
                  <option value="badhai">🎉 Badhai</option>
                  <option value="shok">🙏 Shok</option>
                  <option value="news">📰 News</option>
                  <option value="birthday">🎂 Birthday</option>
                </select>
              </div>
            </div>

            {/* Events Table */}
            <div className="events-table-container">
              {loading ? (
                <div className="loading">Loading events...</div>
              ) : (
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <span className="event-type">
                            {getEventTypeIcon(event.type)} {event.type}
                          </span>
                        </td>
                        <td>
                          <div className="event-title">
                            <strong>{event.title}</strong>
                            {event.subtitle && <small>{event.subtitle}</small>}
                          </div>
                        </td>
                        <td>{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}</td>
                        <td>{event.location || 'N/A'}</td>
                        <td>
                          <span className={`status ${event.is_published ? 'published' : 'draft'}`}>
                            {event.is_published ? '✅ Published' : '📝 Draft'}
                          </span>
                        </td>
                        <td>{new Date(event.created_at).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleEdit(event)}
                              className="btn-edit"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDelete(event.id)}
                              className="btn-delete"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          /* Event Form */
          <div className="event-form-container">
            <div className="form-header">
              <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
              <button onClick={resetForm} className="close-form-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="event-form">
              {/* Basic Event Information */}
              <div className="form-section">
                <h3>📝 Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Event Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      disabled={defaultType !== 'all'}
                    >
                      <option value="badhai">🎉 Badhai</option>
                      <option value="shok">🙏 Shok</option>
                      <option value="news">📰 News</option>
                      <option value="birthday">🎂 Birthday</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Event Date</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                      />
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>

              {/* Type-specific fields */}
              {renderTypeSpecificFields()}

              {/* Form Actions */}
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
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

export default EventManagement;