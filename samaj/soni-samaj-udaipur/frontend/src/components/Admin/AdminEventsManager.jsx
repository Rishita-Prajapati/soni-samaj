import React, { useState, useEffect } from 'react';
import { eventsService } from '../../supabase/services/eventsService';
import { messagesService } from '../../supabase/services/messagesService';
import './AdminEventsManager.css';

const AdminEventsManager = () => {
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'general'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    loadData();
    
    // Subscribe to real-time updates
    const eventsSubscription = eventsService.subscribeToEvents(() => {
      loadEvents();
    });
    
    const messagesSubscription = messagesService.subscribeToMessages(() => {
      loadMessages();
    });

    return () => {
      if (eventsSubscription) eventsSubscription.unsubscribe();
      if (messagesSubscription) messagesSubscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadEvents(), loadMessages()]);
    setLoading(false);
  };

  const loadEvents = async () => {
    const result = await eventsService.getAllEvents();
    if (result.success) {
      setEvents(result.data);
    }
  };

  const loadMessages = async () => {
    const result = await messagesService.getAllMessages();
    if (result.success) {
      setMessages(result.data);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.description.trim()) return;

    const result = await eventsService.createEvent({
      ...newEvent,
      type: newEvent.type === 'general' ? 'news' : newEvent.type
    });
    if (result.success) {
      setNewEvent({ title: '', description: '', type: 'general' });
      alert('समाचार सफलतापूर्वक जोड़ा गया!');
      loadEvents();
    } else {
      alert('समाचार जोड़ने में त्रुटि हुई।');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('क्या आप इस समाचार को हटाना चाहते हैं?')) {
      const result = await eventsService.deleteEvent(eventId);
      if (result.success) {
        alert('समाचार हटा दिया गया।');
        loadEvents();
      } else {
        alert('समाचार हटाने में त्रुटि हुई।');
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('क्या आप इस संदेश को हटाना चाहते हैं?')) {
      const result = await messagesService.deleteMessage(messageId);
      if (result.success) {
        alert('संदेश हटा दिया गया।');
        loadMessages();
      } else {
        alert('संदेश हटाने में त्रुटि हुई।');
      }
    }
  };

  const handleMarkAsRead = async (messageId) => {
    await messagesService.markAsRead(messageId);
    loadMessages();
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'badhai': return 'बधाई समाचार';
      case 'shok': return 'शोक समाचार';
      case 'general': return 'सामान्य सूचना';
      default: return 'समाचार';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('hi-IN');
  };

  if (loading) {
    return <div className="admin-loading">लोड हो रहा है...</div>;
  }

  return (
    <div className="admin-events-manager">
      <div className="admin-header">
        <h1>📰 समाचार और संदेश प्रबंधन</h1>
        <div className="tab-buttons">
          <button 
            className={activeTab === 'events' ? 'active' : ''}
            onClick={() => setActiveTab('events')}
          >
            समाचार प्रबंधन ({events.length})
          </button>
          <button 
            className={activeTab === 'messages' ? 'active' : ''}
            onClick={() => setActiveTab('messages')}
          >
            संदेश प्रबंधन ({messages.filter(m => !m.is_read).length})
          </button>
        </div>
      </div>

      {activeTab === 'events' && (
        <div className="events-section">
          <div className="create-event-form">
            <h2>नया समाचार जोड़ें</h2>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>समाचार प्रकार:</label>
                <select 
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option value="general">सामान्य सूचना</option>
                  <option value="badhai">बधाई समाचार</option>
                  <option value="shok">शोक समाचार</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>शीर्षक:</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="समाचार का शीर्षक..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>विवरण:</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="समाचार का विस्तृत विवरण..."
                  required
                />
              </div>
              
              <button type="submit">समाचार प्रकाशित करें</button>
            </form>
          </div>

          <div className="events-list">
            <h2>प्रकाशित समाचार ({events.length})</h2>
            {events.length === 0 ? (
              <p>कोई समाचार नहीं मिला।</p>
            ) : (
              <div className="events-grid">
                {events.map((event) => (
                  <div key={event.id} className={`event-item ${event.type}`}>
                    <div className="event-header">
                      <span className="event-type">
                        {getEventTypeLabel(event.type)}
                      </span>
                      <span className="event-date">
                        {formatDate(event.created_at)}
                      </span>
                    </div>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <div className="event-actions">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        🗑️ हटाएं
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="messages-section">
          <h2>प्राप्त संदेश ({messages.length})</h2>
          {messages.length === 0 ? (
            <p>कोई संदेश नहीं मिला।</p>
          ) : (
            <div className="messages-list">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`message-item ${!message.is_read ? 'unread' : ''}`}
                >
                  <div className="message-header">
                    <div className="sender-info">
                      <strong>{message.sender_name}</strong>
                      {message.sender_email && (
                        <span className="email">({message.sender_email})</span>
                      )}
                      {message.sender_phone && (
                        <span className="phone">📞 {message.sender_phone}</span>
                      )}
                    </div>
                    <div className="message-meta">
                      <span className="message-type">
                        {message.message_type || 'सामान्य'}
                      </span>
                      <span className="message-date">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="message-content">
                    <p>{message.message}</p>
                  </div>
                  
                  <div className="message-actions">
                    {!message.is_read && (
                      <button 
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        ✓ पढ़ा गया
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      🗑️ हटाएं
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEventsManager;