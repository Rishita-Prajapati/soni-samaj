import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

// Firebase service for Birthday collection specifically
const birthdayService = {
  // Add event to 'bday' collection
  addEvent: async (eventData) => {
    try {
      console.log('Adding to bday collection:', eventData);
      // In real Firebase: await db.collection('bday').add(eventData);
      return { id: Date.now().toString(), ...eventData, createdAt: new Date().toISOString() };
    } catch (error) {
      console.error('Error adding bday event:', error);
      throw error;
    }
  },

  // Get events from 'bday' collection only
  getEventsByType: async () => {
    try {
      console.log('Getting events from bday collection');
      // In real Firebase: const snapshot = await db.collection('bday').get();
      return [
        {
          id: '1',
          person_name: 'Ganesh',
          family_name: 'Temple Committee',
          relationship: 'deity',
          birthday_date: '2025-09-07',
          celebration_type: 'birthday',
          venue: 'Main Temple',
          wishes_message: 'Happy Ganesh Chaturthi to all devotees! 🐘',
          description: 'Grand Ganesh Chaturthi celebration',
          contact_number: '9876543210',
          createdAt: '2025-08-25T08:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error loading bday events:', error);
      throw error;
    }
  },

  // Update event in 'bday' collection
  updateEvent: async (eventId, updateData) => {
    try {
      console.log(`Updating bday event ${eventId}:`, updateData);
      // In real Firebase: await db.collection('bday').doc(eventId).update(updateData);
      return { success: true };
    } catch (error) {
      console.error('Error updating bday event:', error);
      throw error;
    }
  },

  // Delete event from 'bday' collection
  deleteEvent: async (eventId) => {
    try {
      console.log(`Deleting bday event ${eventId}`);
      // In real Firebase: await db.collection('bday').doc(eventId).delete();
      return { success: true };
    } catch (error) {
      console.error('Error deleting bday event:', error);
      throw error;
    }
  },

  // Upload image to Firebase Storage for bday
  uploadEventImage: async (file) => {
    try {
      console.log('Uploading bday image:', file.name);
      // In real Firebase Storage: 
      // const storageRef = storage.ref(`bday/${Date.now()}_${file.name}`);
      // const snapshot = await storageRef.put(file);
      // return await snapshot.ref.getDownloadURL();
      return `https://firebasestorage.googleapis.com/bday/${file.name}`;
    } catch (error) {
      console.error('Error uploading bday image:', error);
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

const AdminBirthday = ({ admin, onLogout }) => {
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
    birthday_date: '',
    person_name: '',
    age: '',
    family_name: '',
    relationship: 'son',
    celebration_type: 'birthday',
    venue: '',
    celebration_time: '',
    contact_number: '',
    wishes_message: '',
    image: null
  });

  const relationshipTypes = [
    { value: 'son', label: 'पुत्र - Son' },
    { value: 'daughter', label: 'पुत्री - Daughter' },
    { value: 'father', label: 'पिता - Father' },
    { value: 'mother', label: 'माता - Mother' },
    { value: 'husband', label: 'पति - Husband' },
    { value: 'wife', label: 'पत्नी - Wife' },
    { value: 'brother', label: 'भाई - Brother' },
    { value: 'sister', label: 'बहन - Sister' },
    { value: 'grandfather', label: 'दादाजी - Grandfather' },
    { value: 'grandmother', label: 'दादीजी - Grandmother' },
    { value: 'uncle', label: 'चाचा/मामा - Uncle' },
    { value: 'aunt', label: 'चाची/मामी - Aunt' },
    { value: 'self', label: 'स्वयं - Self' },
    { value: 'deity', label: 'देवता - Deity' },
    { value: 'other', label: 'अन्य - Other' }
  ];

  const celebrationTypes = [
    { value: 'birthday', label: 'जन्मदिन - Birthday' },
    { value: 'milestone', label: 'मील का पत्थर - Milestone Birthday' },
    { value: 'first_birthday', label: 'पहला जन्मदिन - First Birthday' },
    { value: 'coming_of_age', label: 'वयस्कता - Coming of Age' },
    { value: 'golden_birthday', label: 'स्वर्णिम जन्मदिन - Golden Birthday' },
    { value: 'religious', label: 'धार्मिक - Religious Birthday' }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await birthdayService.getEventsByType();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading birthday events:', error);
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
      if (!formData.person_name || !formData.birthday_date || !formData.family_name) {
        alert('Please fill in all required fields');
        return;
      }

      let imageUrl = '';
      if (formData.image) {
        imageUrl = await birthdayService.uploadEventImage(formData.image);
      }

      const eventData = {
        ...formData,
        image: imageUrl
      };

      await birthdayService.addEvent(eventData);
      alert('🎂 Birthday event saved to BDAY collection successfully!');
      setShowAddModal(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error adding birthday event:', error);
      alert('Error adding event. Please try again.');
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = selectedEvent.image;
      if (formData.image && typeof formData.image !== 'string') {
        imageUrl = await birthdayService.uploadEventImage(formData.image);
      }

      const updateData = {
        ...formData,
        image: imageUrl
      };

      await birthdayService.updateEvent(selectedEvent.id, updateData);
      alert('✨ Birthday event updated in BDAY collection successfully!');
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error updating birthday event:', error);
      alert('Error updating event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId, personName) => {
    if (window.confirm(`Are you sure you want to delete "${personName}'s birthday" from BDAY collection? This action cannot be undone.`)) {
      try {
        await birthdayService.deleteEvent(eventId);
        // Immediately update UI state
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        alert('🗑️ Birthday event deleted from BDAY collection successfully!');
      } catch (error) {
        console.error('Error deleting birthday event:', error);
        alert('Error deleting event. Please try again.');
      }
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      birthday_date: event.birthday_date || '',
      person_name: event.person_name || '',
      age: event.age || '',
      family_name: event.family_name || '',
      relationship: event.relationship || 'son',
      celebration_type: event.celebration_type || 'birthday',
      venue: event.venue || '',
      celebration_time: event.celebration_time || '',
      contact_number: event.contact_number || '',
      wishes_message: event.wishes_message || '',
      image: event.image || null
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      birthday_date: '',
      person_name: '',
      age: '',
      family_name: '',
      relationship: 'son',
      celebration_type: 'birthday',
      venue: '',
      celebration_time: '',
      contact_number: '',
      wishes_message: '',
      image: null
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎂</div>
            <div>Loading Birthday events from Firebase BDAY collection...</div>
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
                🎂 जन्मदिन - Birthday Events
              </h1>
            </div>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Manage birthday celebrations and wishes • Total: {events.length} • 
              <strong style={{ color: '#ec4899' }}> Saved in Firebase BDAY Collection</strong>
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#ec4899',
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
            <span>🎂</span>
            Add to BDAY Collection
          </button>
        </div>

        {/* Firebase Collection Info */}
        <div style={{
          backgroundColor: '#fef7ff',
          border: '1px solid #ec4899',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>🔥</span>
          <div>
            <strong style={{ color: '#be185d' }}>Firebase Collection: </strong>
            <code style={{ backgroundColor: '#fce7f3', padding: '2px 6px', borderRadius: '4px', color: '#be185d' }}>
              bday
            </code>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#be185d' }}>
              All birthday celebrations and wishes are stored in the separate 'bday' collection
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
                border: '2px solid #ec4899',
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
                    alt={event.person_name}
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
                    backgroundColor: 'rgba(236, 72, 153, 0.9)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    🎂 Birthday
                  </div>
                </div>
              )}

              {/* Event Content */}
              <div style={{ padding: '20px' }}>
                {/* Collection Badge */}
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#fef7ff',
                  color: '#ec4899',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  border: '1px solid #ec4899'
                }}>
                  📦 BDAY Collection
                </div>

                {/* Celebration Type Badge */}
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#fce7f3',
                  color: '#ec4899',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '12px',
                  marginLeft: '8px'
                }}>
                  {celebrationTypes.find(type => type.value === event.celebration_type)?.label || event.celebration_type}
                </div>

                {/* Person Name and Age */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 8px 0',
                  lineHeight: '1.4'
                }}>
                  🎉 {event.person_name}
                  {event.age && ` (${event.age} years)`}
                  {!event.age && event.birthday_date && ` (${calculateAge(event.birthday_date)} years)`}
                </h3>

                <div style={{
                  fontSize: '16px',
                  color: '#ec4899',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  👨‍👩‍👧‍👦 {event.family_name}
                </div>

                {/* Relationship */}
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '12px'
                }}>
                  {relationshipTypes.find(rel => rel.value === event.relationship)?.label || event.relationship}
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

                {/* Birthday Wishes */}
                {event.wishes_message && (
                  <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#92400e',
                      marginBottom: '4px'
                    }}>
                      🎊 Birthday Wishes:
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#92400e',
                      fontStyle: 'italic'
                    }}>
                      "{event.wishes_message}"
                    </div>
                  </div>
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
                  {event.birthday_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span>🎂</span>
                      <span>Birthday: {utils.formatDate(new Date(event.birthday_date))}</span>
                    </div>
                  )}
                  {event.venue && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span>📍</span>
                      <span>{event.venue}</span>
                    </div>
                  )}
                  {event.celebration_time && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                      <span>⏰</span>
                      <span>{event.celebration_time}</span>
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
                    onClick={() => handleDeleteEvent(event.id, event.person_name)}
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
                  Added to BDAY: {utils.formatDateTime(event.createdAt)}
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
            border: '2px dashed #ec4899'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎂</div>
            <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '8px' }}>No Birthday Events Yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>Start by adding your first birthday celebration!</p>
            <p style={{ color: '#ec4899', marginBottom: '24px', fontSize: '14px' }}>
              <strong>📦 All events will be saved in Firebase BDAY collection</strong>
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: '#ec4899',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              🎂 Add First Birthday Event
            </button>
          </div>
        )}

        {/* Add Modal */}
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
                  🎂 Add to BDAY Collection
                </h2>
                <div style={{
                  backgroundColor: '#fef7ff',
                  color: '#ec4899',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  border: '1px solid #ec4899'
                }}>
                  📦 Firebase: bday
                </div>
              </div>
              
              <form onSubmit={handleAddEvent}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                      Person Name *
                    </label>
                    <input
                      type="text"
                      name="person_name"
                      value={formData.person_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Name of birthday person"
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
                      placeholder="Age turning"
                      min="0"
                      max="120"
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
                      placeholder="Family surname"
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
                      Relationship
                    </label>
                    <select
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      {relationshipTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                      Birthday Date *
                    </label>
                    <input
                      type="date"
                      name="birthday_date"
                      value={formData.birthday_date}
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
                      Celebration Type
                    </label>
                    <select
                      name="celebration_type"
                      value={formData.celebration_type}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      {celebrationTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                      Birthday Wishes
                    </label>
                    <textarea
                      name="wishes_message"
                      value={formData.wishes_message}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Special birthday wishes message..."
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
                      Birthday Image
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
                      backgroundColor: '#ec4899',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    🎂 Save to BDAY Collection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
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
                  ✏️ Edit BDAY Event
                </h2>
                <div style={{
                  backgroundColor: '#fef7ff',
                  color: '#ec4899',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  border: '1px solid #ec4899'
                }}>
                  📦 Firebase: bday
                </div>
              </div>
              
              <form onSubmit={handleEditEvent}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                      Person Name *
                    </label>
                    <input
                      type="text"
                      name="person_name"
                      value={formData.person_name}
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
                      Birthday Date *
                    </label>
                    <input
                      type="date"
                      name="birthday_date"
                      value={formData.birthday_date}
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

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                      Birthday Image
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
                    ✨ Update in BDAY Collection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBirthday;