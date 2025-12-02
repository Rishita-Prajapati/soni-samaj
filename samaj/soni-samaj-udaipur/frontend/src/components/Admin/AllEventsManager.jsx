import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { eventsService } from '../../supabase/services/eventsService';
import { messagesService } from '../../supabase/services/messagesService';

const AllEventsManager = ({ admin, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load all events
      const eventsResult = await eventsService.getAllEvents();
      if (eventsResult.success) {
        setEvents(eventsResult.data);
      }

      // Load all messages
      const messagesResult = await messagesService.getAllMessages();
      if (messagesResult.success) {
        setMessages(messagesResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const result = await eventsService.deleteEvent(eventId);
        if (result.success) {
          setEvents(prev => prev.filter(event => event.id !== eventId));
          alert('Event deleted successfully!');
        }
      } catch (error) {
        alert('Error deleting event');
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const result = await messagesService.deleteMessage(messageId);
        if (result.success) {
          setMessages(prev => prev.filter(msg => msg.id !== messageId));
          alert('Message deleted successfully!');
        }
      } catch (error) {
        alert('Error deleting message');
      }
    }
  };

  const filteredEvents = selectedType === 'all' 
    ? events 
    : events.filter(event => event.type === selectedType);

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'badhai': return '🎉 Badhai';
      case 'shok': return '🕊️ Shok';
      case 'news': return '📰 News';
      default: return '📋 Event';
    }
  };

  if (loading) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
          <div>Loading all data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout admin={admin} onLogout={onLogout}>
      <div style={{ padding: '20px' }}>
        <h1>📊 All Events & Messages Manager</h1>
        
        {/* Tab Navigation */}
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={() => setActiveTab('events')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: activeTab === 'events' ? '#ff8c00' : '#f0f0f0',
              color: activeTab === 'events' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📅 Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'messages' ? '#ff8c00' : '#f0f0f0',
              color: activeTab === 'messages' ? 'white' : '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            💬 Messages ({messages.length})
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            {/* Event Type Filter */}
            <div style={{ marginBottom: '20px' }}>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="all">All Events ({events.length})</option>
                <option value="badhai">Badhai Events ({events.filter(e => e.type === 'badhai').length})</option>
                <option value="shok">Shok Events ({events.filter(e => e.type === 'shok').length})</option>
                <option value="news">News Events ({events.filter(e => e.type === 'news').length})</option>
              </select>
            </div>

            {/* Events List */}
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid #eee'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{
                          backgroundColor: '#ff8c00',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {getEventTypeLabel(event.type)}
                        </span>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {new Date(event.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      
                      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                        {event.title}
                      </h3>
                      
                      {event.subtitle && (
                        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>
                          {event.subtitle}
                        </p>
                      )}
                      
                      {event.description && (
                        <p style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>
                          {event.description.length > 150 
                            ? event.description.substring(0, 150) + '...' 
                            : event.description}
                        </p>
                      )}
                      
                      <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#666' }}>
                        {event.event_date && (
                          <span>📅 {new Date(event.event_date).toLocaleDateString('en-IN')}</span>
                        )}
                        {event.location && (
                          <span>📍 {event.location}</span>
                        )}
                        {event.contact_number && (
                          <span>📞 {event.contact_number}</span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredEvents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📭</div>
                  <h3>No events found</h3>
                  <p>No events of this type have been created yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <div style={{ display: 'grid', gap: '20px' }}>
              {messages.map(message => (
                <div
                  key={message.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: message.is_read ? '1px solid #eee' : '2px solid #ff8c00'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        {!message.is_read && (
                          <span style={{
                            backgroundColor: '#ff8c00',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px'
                          }}>
                            NEW
                          </span>
                        )}
                        <span style={{ fontSize: '12px', color: '#666' }}>
                          {new Date(message.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      
                      <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                        {message.name}
                      </h4>
                      
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                        {message.email && <span>📧 {message.email}</span>}
                        {message.phone && <span style={{ marginLeft: '10px' }}>📞 {message.phone}</span>}
                      </div>
                      
                      <div style={{ fontSize: '14px', color: '#555', marginBottom: '10px' }}>
                        <strong>Subject:</strong> {message.subject}
                      </div>
                      
                      <p style={{ margin: '0', color: '#555', fontSize: '14px' }}>
                        {message.message}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📭</div>
                  <h3>No messages found</h3>
                  <p>No contact messages have been received yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AllEventsManager;