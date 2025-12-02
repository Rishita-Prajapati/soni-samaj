import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { eventsService } from '../../supabase/services/eventsService';

const shokService = {
  addEvent: async (eventData) => {
    const mappedData = {
      title: `शोक संदेश: ${eventData.deceasedName}`,
      subtitle: `Family: ${eventData.familyName}${eventData.age ? ` (Age: ${eventData.age})` : ''}`,
      description: eventData.description || `We are deeply saddened to inform about the demise of ${eventData.deceasedName}.`,
      type: 'shok',
      image_url: eventData.eventImage,
      event_date: eventData.deathDate || null,
      location: eventData.deathPlace || eventData.funeralLocation,
      contact_number: eventData.contactNumber,
      is_published: true
    };
    return await eventsService.createEvent(mappedData);
  },

  getEventsByType: async () => {
    const result = await eventsService.getEventsByType('shok');
    if (result.success) {
      return result.data.map(event => ({
        id: event.id,
        deceasedName: event.title?.replace('शोक संदेश: ', '') || '',
        familyName: event.subtitle?.split(' (')[0]?.replace('Family: ', '') || '',
        age: event.subtitle?.match(/Age: (\d+)/)?.[1] || '',
        deathDate: event.event_date,
        deathPlace: event.location,
        funeralLocation: event.location,
        description: event.description,
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
      title: `शोक संदेश: ${updateData.deceasedName}`,
      subtitle: `Family: ${updateData.familyName}${updateData.age ? ` (Age: ${updateData.age})` : ''}`,
      description: updateData.description,
      event_date: updateData.deathDate || null,
      location: updateData.deathPlace || updateData.funeralLocation,
      contact_number: updateData.contactNumber,
      image_url: updateData.eventImage
    };
    return await eventsService.updateEvent(eventId, mappedData);
  },

  deleteEvent: async (eventId) => {
    return await eventsService.deleteEvent(eventId);
  }
};

const AdminShok = ({ admin, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    deceasedName: '',
    familyName: '',
    age: '',
    deathDate: '',
    deathTime: '',
    deathPlace: '',
    funeralDate: '',
    funeralTime: '',
    funeralLocation: '',
    causeOfDeath: '',
    description: '',
    contactNumber: '',
    eventImage: null
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await shokService.getEventsByType();
      setEvents(eventsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error('Error loading shok events:', error);
      alert(`Error loading events: ${error.message}`);
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
      if (!formData.deceasedName || !formData.familyName) {
        alert('Please fill in required fields (Deceased Name and Family Name)');
        return;
      }

      setUploading(true);
      
      let imageUrl = '';
      // Image upload would be handled here
      if (formData.eventImage) {
        imageUrl = ''; // Placeholder for image upload
      }

      const eventData = { ...formData, eventImage: imageUrl };
      await shokService.addEvent(eventData);
      alert('🕊️ Shok event saved successfully!');
      setShowAddModal(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error adding shok event:', error);
      alert(`Error adding event: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      if (!formData.deceasedName || !formData.familyName) {
        alert('Please fill in required fields');
        return;
      }

      setUploading(true);

      let imageUrl = selectedEvent.eventImage || '';
      // Image upload would be handled here
      if (formData.eventImage && typeof formData.eventImage !== 'string') {
        imageUrl = ''; // Placeholder for image upload
      }

      const updateData = { ...formData, eventImage: imageUrl };
      await shokService.updateEvent(selectedEvent.id, updateData);
      alert('✨ Shok event updated successfully!');
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error updating shok event:', error);
      alert(`Error updating event: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEvent = async (eventId, deceasedName) => {
    if (window.confirm(`Are you sure you want to delete "${deceasedName}"? This action cannot be undone.`)) {
      try {
        await shokService.deleteEvent(eventId);
        // Immediately update UI state
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        alert('🗑️ Shok event deleted successfully!');
      } catch (error) {
        console.error('Error deleting shok event:', error);
        alert(`Error deleting event: ${error.message}`);
      }
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      deceasedName: event.deceasedName || '',
      familyName: event.familyName || '',
      age: event.age || '',
      deathDate: event.deathDate ? new Date(event.deathDate).toISOString().split('T')[0] : '',
      deathTime: event.deathTime || '',
      deathPlace: event.deathPlace || '',
      funeralDate: event.funeralDate ? new Date(event.funeralDate).toISOString().split('T')[0] : '',
      funeralTime: event.funeralTime || '',
      funeralLocation: event.funeralLocation || '',
      causeOfDeath: event.causeOfDeath || '',
      description: event.description || '',
      contactNumber: event.contactNumber || '',
      eventImage: event.eventImage || null
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      deceasedName: '',
      familyName: '',
      age: '',
      deathDate: '',
      deathTime: '',
      deathPlace: '',
      funeralDate: '',
      funeralTime: '',
      funeralLocation: '',
      causeOfDeath: '',
      description: '',
      contactNumber: '',
      eventImage: null
    });
  };

  if (loading) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout} currentModule="events">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🕊️</div>
            <div>Loading Shok events...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout admin={admin} onLogout={onLogout} currentModule="events">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
              🕊️ शोक समाचार - Shok Events
            </h1>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Manage condolence messages and funeral information • Total: {events.length}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            disabled={uploading}
            style={{
              backgroundColor: uploading ? '#9ca3af' : '#6b7280',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            🕊️ Add Shok Event
          </button>
        </div>

        {/* Events Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                border: '2px solid #6b7280'
              }}
            >
              {event.eventImage && (
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src={event.eventImage}
                    alt={event.deceasedName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                  🕊️ {event.deceasedName}
                </h3>
                <div style={{ fontSize: '16px', color: '#6b7280', fontWeight: '600', marginBottom: '12px' }}>
                  👨👩👧👦 {event.familyName}
                </div>
                {event.age && (
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                    Age: {event.age} years
                  </p>
                )}
                {event.description && (
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '16px' }}>
                    {event.description}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {event.deathDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span>📅</span>
                      <span>Death: {new Date(event.deathDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                  {event.funeralDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span>⚱️</span>
                      <span>Funeral: {new Date(event.funeralDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                  {event.funeralLocation && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <span>📍</span>
                      <span>{event.funeralLocation}</span>
                    </div>
                  )}
                </div>

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
                      fontSize: '14px'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id, event.deceasedName)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🕊️</div>
            <h3>No Shok Events Yet</h3>
            <p style={{ color: '#6b7280' }}>Start by adding your first condolence message.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal would go here - similar structure to AdminBadhai */}
    </AdminLayout>
  );
};

export default AdminShok;