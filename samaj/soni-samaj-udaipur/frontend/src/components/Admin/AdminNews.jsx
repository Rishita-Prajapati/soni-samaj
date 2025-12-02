import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { eventsService } from '../../supabase/services/eventsService';

const AdminNews = ({ admin, onLogout }) => {
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
    content: '',
    date: '',
    location: '',
    category: 'community',
    priority: 'medium',
    source: '',
    author: '',
    tags: '',
    external_link: '',
    contact_number: '',
    is_featured: false,
    is_published: true,
    image: null
  });

  const newsCategories = [
    { value: 'community', label: 'समुदाय समाचार - Community News' },
    { value: 'events', label: 'कार्यक्रम - Events' },
    { value: 'business', label: 'व्यापार - Business' },
    { value: 'achievement', label: 'उपलब्धि - Achievement' },
    { value: 'social', label: 'सामाजिक - Social' },
    { value: 'cultural', label: 'सांस्कृतिक - Cultural' },
    { value: 'education', label: 'शिक्षा - Education' },
    { value: 'health', label: 'स्वास्थ्य - Health' },
    { value: 'religious', label: 'धार्मिक - Religious' },
    { value: 'announcement', label: 'घोषणा - Announcement' },
    { value: 'other', label: 'अन्य - Other' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'कम - Low', color: '#6b7280' },
    { value: 'medium', label: 'मध्यम - Medium', color: '#f59e0b' },
    { value: 'high', label: 'उच्च - High', color: '#ef4444' },
    { value: 'urgent', label: 'तत्काल - Urgent', color: '#dc2626' }
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const result = await eventsService.getEventsByType('news');
      if (result.success) {
        // Sort by priority and date
        const sortedEvents = result.data.sort((a, b) => {
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const priorityDiff = (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(b.event_date || b.created_at) - new Date(a.event_date || a.created_at);
        });
        setEvents(sortedEvents);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      alert('Error loading news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.content) {
        alert('Please fill in all required fields');
        return;
      }

      const eventData = {
        title: formData.title,
        subtitle: formData.description,
        description: formData.content,
        type: 'news',
        image_url: '',
        event_date: formData.date,
        location: formData.location,
        contact_number: formData.contact_number,
        is_published: formData.is_published
      };

      const result = await eventsService.createEvent(eventData);
      if (!result.success) throw new Error(result.error);
      alert('News article added successfully! 📰');
      setShowAddModal(false);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error adding news:', error);
      alert('Error adding news. Please try again.');
    }
  };

  const handleEditEvent = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        title: formData.title,
        subtitle: formData.description,
        description: formData.content,
        event_date: formData.date,
        location: formData.location,
        contact_number: formData.contact_number,
        is_published: formData.is_published
      };

      const result = await eventsService.updateEvent(selectedEvent.id, updateData);
      if (!result.success) throw new Error(result.error);
      alert('News article updated successfully! ✨');
      setShowEditModal(false);
      setSelectedEvent(null);
      resetForm();
      loadEvents();
    } catch (error) {
      console.error('Error updating news:', error);
      alert('Error updating news. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      try {
        const result = await eventsService.deleteEvent(eventId);
        if (result.success) {
          // Immediately update UI state
          setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        } else {
          throw new Error(result.error);
        }
        alert('News article deleted successfully!');
      } catch (error) {
        console.error('Error deleting news:', error);
        alert('Error deleting news. Please try again.');
      }
    }
  };

  const toggleFeatured = async (event) => {
    try {
      const result = await eventsService.updateEvent(event.id, { is_featured: !event.is_featured });
      if (!result.success) throw new Error(result.error);
      loadEvents();
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Error updating featured status. Please try again.');
    }
  };

  const togglePublished = async (event) => {
    try {
      const result = await eventsService.updateEvent(event.id, { is_published: !event.is_published });
      if (!result.success) throw new Error(result.error);
      loadEvents();
    } catch (error) {
      console.error('Error updating published status:', error);
      alert('Error updating published status. Please try again.');
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      content: event.content || '',
      date: event.date || '',
      location: event.location || '',
      category: event.category || 'community',
      priority: event.priority || 'medium',
      source: event.source || '',
      author: event.author || '',
      tags: Array.isArray(event.tags) ? event.tags.join(', ') : (event.tags || ''),
      external_link: event.external_link || '',
      contact_number: event.contact_number || '',
      is_featured: event.is_featured || false,
      is_published: event.is_published !== false,
      image: event.image || null
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      date: '',
      location: '',
      category: 'community',
      priority: 'medium',
      source: '',
      author: '',
      tags: '',
      external_link: '',
      contact_number: '',
      is_featured: false,
      is_published: true,
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
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📰</div>
            <div>Loading News articles...</div>
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
                📰 समाचार - News Articles
              </h1>
            </div>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Manage community news, announcements and articles • Total: {events.length}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#3b82f6',
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
            <span>📰</span>
            Add News Article
          </button>
        </div>

        {/* Events Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {currentEvents.map((event) => {
            const priorityConfig = priorityLevels.find(p => p.value === event.priority) || priorityLevels[1];
            const categoryConfig = newsCategories.find(c => c.value === event.category) || newsCategories[0];
            
            return (
              <div
                key={event.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  border: `2px solid ${priorityConfig.color}`,
                  transition: 'transform 0.2s',
                  opacity: event.is_published === false ? 0.7 : 1
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Event Image */}
                {event.image && (
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {/* Status Badges */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      {event.is_featured && (
                        <div style={{
                          backgroundColor: 'rgba(251, 191, 36, 0.9)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          ⭐ Featured
                        </div>
                      )}
                      {event.is_published === false && (
                        <div style={{
                          backgroundColor: 'rgba(107, 114, 128, 0.9)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          📝 Draft
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Content */}
                <div style={{ padding: '20px' }}>
                  {/* Priority and Category Badges */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: priorityConfig.color,
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {priorityConfig.label}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {categoryConfig.label.split(' - ')[0]}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4'
                  }}>
                    📰 {event.title}
                  </h3>

                  {/* Author and Source */}
                  <div style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '12px'
                  }}>
                    {event.author && (
                      <span>✍️ By: {event.author}</span>
                    )}
                    {event.source && (
                      <span style={{ marginLeft: event.author ? '12px' : '0' }}>
                        📡 {event.source}
                      </span>
                    )}
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
                        <span>{new Date(event.event_date).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                    {event.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                        <span>📍</span>
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.external_link && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
                        <span>🔗</span>
                        <a 
                          href={event.external_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'none' }}
                        >
                          Read Full Article
                        </a>
                      </div>
                    )}
                    {event.tags && Array.isArray(event.tags) && event.tags.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', flexWrap: 'wrap' }}>
                        <span>🏷️</span>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              style={{
                                backgroundColor: '#e5e7eb',
                                color: '#374151',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                              +{event.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => toggleFeatured(event)}
                      style={{
                        backgroundColor: event.is_featured ? '#fbbf24' : '#f3f4f6',
                        color: event.is_featured ? 'white' : '#6b7280',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      ⭐ {event.is_featured ? 'Featured' : 'Feature'}
                    </button>
                    <button
                      onClick={() => togglePublished(event)}
                      style={{
                        backgroundColor: event.is_published !== false ? '#10b981' : '#6b7280',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {event.is_published !== false ? '✅ Published' : '📝 Draft'}
                    </button>
                  </div>

                  {/* Main Actions */}
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
                      onClick={() => handleDeleteEvent(event.id, event.title)}
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
                    Added: {new Date(event.created_at).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📰</div>
            <h3 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '8px' }}>No News Articles Yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Start by adding your first news article!</p>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              📰 Add First News Article
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
                  backgroundColor: currentPage === i + 1 ? '#3b82f6' : 'white',
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
            maxWidth: '700px',
            width: '95%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              📰 Add News Article
            </h2>
            
            <form onSubmit={handleAddEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    News Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter news headline..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {newsCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {priorityLevels.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
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
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Location (if applicable)"
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
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder={admin?.name || 'Article author name'}
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
                    Source
                  </label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="News source (optional)"
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
                    Short Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="Brief summary of the news..."
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
                    Full Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="Full news article content..."
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

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Tag1, Tag2, Tag3 (comma separated)"
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
                    placeholder="Contact number (if applicable)"
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
                    External Link
                  </label>
                  <input
                    type="url"
                    name="external_link"
                    value={formData.external_link}
                    onChange={handleInputChange}
                    placeholder="https://example.com (optional link to full article)"
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
                    News Image
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

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: '500', color: '#374151' }}>⭐ Feature this article</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: '500', color: '#374151' }}>📰 Publish immediately</span>
                  </label>
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
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  📰 Add News Article
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
            maxWidth: '700px',
            width: '95%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              ✏️ Edit News Article
            </h2>
            
            <form onSubmit={handleEditEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    News Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {newsCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    {priorityLevels.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Full Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="5"
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
                    News Image
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
                        style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>Current image</p>
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: '500', color: '#374151' }}>⭐ Feature this article</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontWeight: '500', color: '#374151' }}>📰 Published</span>
                  </label>
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
                  ✨ Update Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminNews;