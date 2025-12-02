import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { eventsService } from '../../supabase/services/eventsService';

// Badhai service using unified events table
const badhaiService = {
  addEvent: async (eventData) => {
    const mappedData = {
      title: `${eventData.occasionType}: ${eventData.eventTitle}`,
      subtitle: `Family: ${eventData.familyName}`,
      description: eventData.description,
      type: 'badhai',
      image_url: eventData.eventImage,
      event_date: eventData.date || null,
      location: eventData.location,
      contact_number: eventData.contactNumber,
      is_published: true
    };
    return await eventsService.createEvent(mappedData);
  },

  getEventsByType: async () => {
    const result = await eventsService.getEventsByType('badhai');
    if (result.success) {
      return result.data.map(event => ({
        id: event.id,
        eventTitle: event.title?.split(': ')[1] || event.title,
        familyName: event.subtitle?.replace('Family: ', '') || '',
        occasionType: event.title?.split(': ')[0] || 'marriage',
        description: event.description,
        date: event.event_date,
        location: event.location,
        contactNumber: event.contact_number,
        eventImage: event.image_url,
        created_at: event.created_at,
        updated_at: event.updated_at
      }));
    }
    return [];
  },

  updateEvent: async (eventId, updateData) => {
    const mappedData = {
      title: `${updateData.occasionType}: ${updateData.eventTitle}`,
      subtitle: `Family: ${updateData.familyName}`,
      description: updateData.description,
      event_date: updateData.date || null,
      location: updateData.location,
      contact_number: updateData.contactNumber,
      image_url: updateData.eventImage
    };
    return await eventsService.updateEvent(eventId, mappedData);
  },

  deleteEvent: async (eventId) => {
    return await eventsService.deleteEvent(eventId);
  }
};

const utils = {
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN');
  },
  formatDateTime: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-IN');
  }
};

const AdminBadhai = ({ admin, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [uploading, setUploading] = useState(false);

  // Form state - matching Supabase structure
  const [formData, setFormData] = useState({
    eventTitle: '',
    description: '',
    date: '',
    location: '',
    familyName: '',
    occasionType: 'marriage',
    contactNumber: '',
    eventImage: null
  });

  const occasionTypes = [
    { value: 'marriage', label: 'विवाह - Marriage' },
    { value: 'birth', label: 'जन्म - Birth' },
    { value: 'engagement', label: 'सगाई - Engagement' },
    { value: 'achievement', label: 'उपलब्धि - Achievement' },
    { value: 'business', label: 'व्यापार - Business Opening' },
    { value: 'other', label: 'अन्य - Other' }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await badhaiService.getEventsByType();
      setEvents(eventsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error('Error loading badhai events:', error);
      console.error('Error details:', error.message);
      alert(`Error loading events: ${error.message}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      if (!formData.eventTitle || !formData.familyName) {
        alert('Please fill in all required fields (Event Title and Family Name)');
        return;
      }

      setUploading(true);
      
      let imageUrl = '';
      if (formData.eventImage) {
        // Image upload would be handled here
        imageUrl = ''; // Placeholder for image upload
      }

      const eventData = {
        eventTitle: formData.eventTitle,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        familyName: formData.familyName,
        occasionType: formData.occasionType,
        contactNumber: formData.contactNumber,
        eventImage: imageUrl
      };

      console.log('Adding event with data:', eventData);
      const result = await badhaiService.addEvent(eventData);
      console.log('Event added successfully:', result);
      alert('🎉 Badhai event saved successfully!');
      setShowAddModal(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error adding badhai event:', error);
      console.error('Error details:', error.message);
      alert(`Error adding event: ${error.message}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      if (!formData.eventTitle || !formData.familyName) {
        alert('Please fill in all required fields (Event Title and Family Name)');
        return;
      }

      setUploading(true);

      let imageUrl = selectedEvent.eventImage || '';
      if (formData.eventImage && typeof formData.eventImage !== 'string') {
        // Image upload would be handled here
        imageUrl = ''; // Placeholder for image upload
      }

      const updateData = {
        eventTitle: formData.eventTitle,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        familyName: formData.familyName,
        occasionType: formData.occasionType,
        contactNumber: formData.contactNumber,
        eventImage: imageUrl
      };

      console.log('Updating event with data:', updateData);
      const result = await badhaiService.updateEvent(selectedEvent.id, updateData);
      console.log('Event updated successfully:', result);
      alert('✨ Badhai event updated successfully!');
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error updating badhai event:', error);
      console.error('Error details:', error.message);
      alert(`Error updating event: ${error.message}. Please try again.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      try {
        console.log('Deleting event:', eventId);
        const result = await badhaiService.deleteEvent(eventId);
        console.log('Event deleted successfully:', result);
        // Immediately update UI state
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        alert('🗑️ Badhai event deleted successfully!');
      } catch (error) {
        console.error('Error deleting badhai event:', error);
        console.error('Error details:', error.message);
        alert(`Error deleting event: ${error.message}. Please try again.`);
      }
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      eventTitle: event.eventTitle || '',
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      location: event.location || '',
      familyName: event.familyName || '',
      occasionType: event.occasionType || 'marriage',
      contactNumber: event.contactNumber || '',
      eventImage: event.eventImage || null
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      eventTitle: '',
      description: '',
      date: '',
      location: '',
      familyName: '',
      occasionType: 'marriage',
      contactNumber: '',
      eventImage: null
    });
  };

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout} currentModule="events">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉</div>
            <div>Loading Badhai events...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout admin={admin} onLogout={onLogout} currentModule="events">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <button
                onClick={() => window.history.back()}
                style={{
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                ←
              </button>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                🎉 बधाई समाचार - Badhai Events
              </h1>
            </div>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Manage celebrations, marriages, and happy occasions • Total: {events.length}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={uploading}
            style={{
              backgroundColor: uploading ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🎉</span>
            {uploading ? 'Processing...' : 'Add Badhai Event'}
          </button>
        </div>



        {/* Events Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {currentEvents.map((event) => (
            <div
              key={event.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                border: '2px solid #10b981',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Event Image */}
              {event.eventImage && (
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src={event.eventImage}
                    alt={event.eventTitle}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}

              {/* Event Content */}
              <div style={{ padding: '20px' }}>


                {/* Occasion Type Badge */}
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#ecfdf5',
                  color: '#10b981',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  marginLeft: '8px'
                }}>
                  {occasionTypes.find(type => type.value === event.occasionType)?.label || event.occasionType}
                </div>

                {/* Title and Family */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  🎉 {event.eventTitle}
                </h3>

                <div style={{
                  fontSize: '16px',
                  color: '#10b981',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  👨‍👩‍👧‍👦 {event.familyName}
                </div>

                {/* Description */}
                {event.description && (
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    lineHeight: '1.5',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {event.description}
                  </p>
                )}

                {/* Event Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {event.date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span>📅</span>
                      <span>{utils.formatDate(event.date)}</span>
                    </div>
                  )}
                  {event.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.contactNumber && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span>📞</span>
                      <span>{event.contactNumber}</span>
                    </div>
                  )}
                </div>



                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => openEditModal(event)}
                    disabled={uploading}
                    style={{
                      backgroundColor: uploading ? '#9ca3af' : '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.eventTitle)}
                    disabled={uploading}
                    style={{
                      backgroundColor: uploading ? '#9ca3af' : '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* Created Date */}
                <div style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginTop: '12px',
                  textAlign: 'right'
                }}>
                  Added: {utils.formatDateTime(event.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '2px dashed #10b981'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '8px' }}>No Badhai Events Yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Start by adding your first celebration!</p>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={uploading}
              style={{
                backgroundColor: uploading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              🎉 Add First Badhai Event
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            padding: '20px'
          }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: currentPage === i + 1 ? '#10b981' : 'white',
                  color: currentPage === i + 1 ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                🎉 Add Badhai Event
              </h2>
            </div>
            
            <form onSubmit={handleAddEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="eventTitle"
                    value={formData.eventTitle}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    placeholder="e.g., Marriage Ceremony, New Born Baby"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Family Name *
                  </label>
                  <input
                    type="text"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    placeholder="Family or person name"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Occasion Type
                  </label>
                  <select
                    name="occasionType"
                    value={formData.occasionType}
                    onChange={handleInputChange}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  >
                    {occasionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={uploading}
                    placeholder="Venue or location"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    disabled={uploading}
                    placeholder="Contact number"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    disabled={uploading}
                    placeholder="Additional details about the event..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Event Image
                  </label>
                  <input
                    type="file"
                    name="eventImage"
                    onChange={handleInputChange}
                    accept="image/*"
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                  {uploading && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>📤</span> Uploading image...
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  disabled={uploading}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: uploading ? '#9ca3af' : '#10b981',
                    color: 'white',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {uploading ? (
                    <>
                      <span>⏳</span> Saving...
                    </>
                  ) : (
                    <>
                      <span>🎉</span> Save Badhai Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                ✏️ Edit Badhai Event
              </h2>
            </div>
            

            
            <form onSubmit={handleEditEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="eventTitle"
                    value={formData.eventTitle}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Family Name *
                  </label>
                  <input
                    type="text"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    required
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Occasion Type
                  </label>
                  <select
                    name="occasionType"
                    value={formData.occasionType}
                    onChange={handleInputChange}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  >
                    {occasionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={uploading}
                    placeholder="Venue or location"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    disabled={uploading}
                    placeholder="Contact number"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    disabled={uploading}
                    placeholder="Additional details about the event..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Event Image
                  </label>
                  <input
                    type="file"
                    name="eventImage"
                    onChange={handleInputChange}
                    accept="image/*"
                    disabled={uploading}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: uploading ? '#f9fafb' : 'white'
                    }}
                  />
                  {selectedEvent.eventImage && (
                    <div style={{ marginTop: '8px' }}>
                      <img 
                        src={selectedEvent.eventImage} 
                        alt="Current"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        Current image
                      </p>
                    </div>
                  )}
                  {uploading && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>📤</span> Uploading new image...
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedEvent(null);
                    resetForm();
                  }}
                  disabled={uploading}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: uploading ? '#9ca3af' : '#f59e0b',
                    color: 'white',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {uploading ? (
                    <>
                      <span>⏳</span> Updating...
                    </>
                  ) : (
                    <>
                      <span>✨</span> Update Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBadhai;