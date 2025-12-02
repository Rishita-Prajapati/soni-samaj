import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

// Firebase service for Shoak collection specifically
const shoakService = {
  // Add event to 'shoak' collection
  addEvent: async (eventData) => {
    try {
      console.log('Adding to shoak collection:', eventData);
      // In real Firebase: await db.collection('shoak').add(eventData);
      return { id: Date.now().toString(), ...eventData, createdAt: new Date().toISOString() };
    } catch (error) {
      console.error('Error adding shoak event:', error);
      throw error;
    }
  },

  // Get events from 'shoak' collection only
  getEventsByType: async () => {
    try {
      console.log('Getting events from shoak collection');
      // In real Firebase: const snapshot = await db.collection('shoak').get();
      return [
        {
          id: '1',
          deceased_name: 'Late Ramesh Ji',
          family_name: 'Sharma Family',
          relation: 'father',
          age: '75',
          date: '2025-08-10',
          funeral_date: '2025-08-11',
          funeral_location: 'Cremation Ground',
          description: 'May his soul rest in peace. He was a respected member of our community.',
          contact_number: '9876543210',
          createdAt: '2025-08-10T15:30:00Z'
        }
      ];
    } catch (error) {
      console.error('Error loading shoak events:', error);
      throw error;
    }
  },

  // Update event in 'shoak' collection
  updateEvent: async (eventId, updateData) => {
    try {
      console.log(`Updating shoak event ${eventId}:`, updateData);
      // In real Firebase: await db.collection('shoak').doc(eventId).update(updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating shoak event:', error);
      throw error;
    }
  },

  // Delete event from 'shoak' collection
  deleteEvent: async (eventId) => {
    try {
      console.log(`Deleting shoak event ${eventId}`);
      // In real Firebase: await db.collection('shoak').doc(eventId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting shoak event:', error);
      throw error;
    }
  },

  // Upload image to Firebase Storage for shoak
  uploadEventImage: async (file) => {
    try {
      console.log('Uploading shoak image:', file.name);
      // In real Firebase Storage: 
      // const storageRef = storage.ref(`shoak/${Date.now()}_${file.name}`);
      // const snapshot = await storageRef.put(file);
      // return await snapshot.ref.getDownloadURL();
      return `https://firebasestorage.googleapis.com/shoak/${file.name}`;
    } catch (error) {
      console.error('Error uploading shoak image:', error);
      throw error;
    }
  }
};

const utils = {
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  },
  formatDateTime: (date) => {
    return new Date(date).toLocaleString('en-IN');
  }
};

const AdminShokNews = ({ admin, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    deceased_name: '',
    relation: '',
    family_name: '',
    age: '',
    cause: '',
    funeral_date: '',
    funeral_location: '',
    contact_number: '',
    image: null
  });

  const relationTypes = [
    { value: 'father', label: 'पिता - Father' },
    { value: 'mother', label: 'माता - Mother' },
    { value: 'husband', label: 'पति - Husband' },
    { value: 'wife', label: 'पत्नी - Wife' },
    { value: 'son', label: 'पुत्र - Son' },
    { value: 'daughter', label: 'पुत्री - Daughter' },
    { value: 'brother', label: 'भाई - Brother' },
    { value: 'sister', label: 'बहन - Sister' },
    { value: 'grandfather', label: 'दादाजी - Grandfather' },
    { value: 'grandmother', label: 'दादीजी - Grandmother' },
    { value: 'other', label: 'अन्य - Other' }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await shoakService.getEventsByType();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading shoak events:', error);
      alert('Error loading events. Please try again.');
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
      if (!formData.deceased_name || !formData.family_name) {
        alert('Please fill in all required fields');
        return;
      }

      let imageUrl = '';
      if (formData.image) {
        imageUrl = await shoakService.uploadEventImage(formData.image);
      }

      const eventData = {
        ...formData,
        image: imageUrl
      };

      await shoakService.addEvent(eventData);
      alert('🙏 Shoak news saved to SHOAK collection successfully!');
      setShowAddModal(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error adding shoak event:', error);
      alert('Error adding event. Please try again.');
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = selectedEvent.image;
      if (formData.image && typeof formData.image !== 'string') {
        imageUrl = await shoakService.uploadEventImage(formData.image);
      }

      const updateData = {
        ...formData,
        image: imageUrl
      };

      await shoakService.updateEvent(selectedEvent.id, updateData);
      alert('✨ Shoak news updated in SHOAK collection successfully!');
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error updating shoak event:', error);
      alert('Error updating event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}" from SHOAK collection? This action cannot be undone.`)) {
      try {
        await shoakService.deleteEvent(eventId);
        alert('🗑️ Shoak news deleted from SHOAK collection successfully!');
        loadEvents();
      } catch (error) {
        console.error('Error deleting shoak event:', error);
        alert('Error deleting event. Please try again.');
      }
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      location: event.location || '',
      deceased_name: event.deceased_name || '',
      relation: event.relation || 'father',
      family_name: event.family_name || '',
      age: event.age || '',
      cause: event.cause || '',
      funeral_date: event.funeral_date || '',
      funeral_location: event.funeral_location || '',
      contact_number: event.contact_number || '',
      image: event.image || null
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      deceased_name: '',
      relation: 'father',
      family_name: '',
      age: '',
      cause: '',
      funeral_date: '',
      funeral_location: '',
      contact_number: '',
      image: null
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
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🙏</div>
            <div>Loading Shoak news from Firebase SHOAK collection...</div>
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
                🙏 शोक समाचार - Condolence News
              </h1>
            </div>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Manage condolence messages and funeral information • Total: {events.length} • 
              <strong style={{ color: '#6b7280' }}> Saved in Firebase SHOAK Collection</strong>
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🙏</span>
            Add to SHOAK Collection
          </button>
        </div>

        {/* Firebase Collection Info */}
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #6b7280',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>🔥</span>
          <div>
            <strong style={{ color: '#374151' }}>Firebase Collection: </strong>
            <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: '#374151' }}>
              shoak
            </code>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
              All condolence and memorial information is stored in the separate 'shoak' collection
            </p>
          </div>
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
                border: '2px solid #6b7280',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Event Image */}
              {event.image && (
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={event.image}
                    alt={event.deceased_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    🙏 In Memory
                  </div>
                </div>
              )}

              {/* Event Content */}
              <div style={{ padding: '20px' }}>
                {/* Collection Badge */}
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#f9fafb',
                  color: '#6b7280',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  border: '1px solid #6b7280'
                }}>
                  📦 SHOAK Collection
                </div>

                {/* Relation Badge */}
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  marginLeft: '8px'
                }}>
                  {relationTypes.find(type => type.value === event.relation)?.label || event.relation}
                </div>

                {/* Deceased Name and Family */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  🕯️ {event.deceased_name} {event.age && `(${event.age} years)`}
                </h3>

                <div style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  fontWeight: '600',
                  marginBottom: '12px'
                }}>
                  👨‍👩‍👧‍👦 Family: {event.family_name}
                </div>

                {/* Title */}
                {event.title && (
                  <p style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    {event.title}
                  </p>
                )}

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
                      <span>Passed: {utils.formatDate(new Date(event.date))}</span>
                    </div>
                  )}
                  {event.funeral_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span>⚰️</span>
                      <span>Funeral: {utils.formatDate(new Date(event.funeral_date))}</span>
                    </div>
                  )}
                  {event.funeral_location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span>📍</span>
                      <span>{event.funeral_location}</span>
                    </div>
                  )}
                  {event.contact_number && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span>📞</span>
                      <span>{event.contact_number}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => openEditModal(event)}
                    style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.deceased_name)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
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
                  Added to SHOAK: {utils.formatDateTime(event.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '2px dashed #6b7280'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🙏</div>
            <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '8px' }}>No Shoak News Yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>Start by adding condolence information!</p>
            <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>
              <strong>📦 All events will be saved in Firebase SHOAK collection</strong>
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              🙏 Add First Shoak News
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
                  backgroundColor: currentPage === i + 1 ? '#6b7280' : 'white',
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
                🙏 Add to SHOAK Collection
              </h2>
              <div style={{
                backgroundColor: '#f9fafb',
                color: '#6b7280',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                border: '1px solid #6b7280'
              }}>
                📦 Firebase: shoak
              </div>
            </div>
            
            <form onSubmit={handleAddEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Deceased Name *
                  </label>
                  <input
                    type="text"
                    name="deceased_name"
                    value={formData.deceased_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Name of the deceased person"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Age at time of death"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Family Name *
                  </label>
                  <input
                    type="text"
                    name="family_name"
                    value={formData.family_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Family surname or name"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Relation
                  </label>
                  <select
                    name="relation"
                    value={formData.relation}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {relationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Date of Death
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Funeral Date
                  </label>
                  <input
                    type="date"
                    name="funeral_date"
                    value={formData.funeral_date}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Funeral Location
                  </label>
                  <input
                    type="text"
                    name="funeral_location"
                    value={formData.funeral_location}
                    onChange={handleInputChange}
                    placeholder="Cremation/burial location"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    placeholder="Family contact number"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Optional title for the condolence message"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
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
                    placeholder="Condolence message or additional details..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Memorial Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  🙏 Save to SHOAK Collection
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
                ✏️ Edit SHOAK Event
              </h2>
              <div style={{
                backgroundColor: '#f9fafb',
                color: '#6b7280',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                border: '1px solid #6b7280'
              }}>
                📦 Firebase: shoak
              </div>
            </div>
            
            <form onSubmit={handleEditEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Deceased Name *
                  </label>
                  <input
                    type="text"
                    name="deceased_name"
                    value={formData.deceased_name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Family Name *
                  </label>
                  <input
                    type="text"
                    name="family_name"
                    value={formData.family_name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Relation
                  </label>
                  <select
                    name="relation"
                    value={formData.relation}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {relationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Memorial Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  {selectedEvent.image && (
                    <div style={{ marginTop: '8px' }}>
                      <img 
                        src={selectedEvent.image} 
                        alt="Current"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Current image</p>
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
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  ✨ Update in SHOAK Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminShokNews;