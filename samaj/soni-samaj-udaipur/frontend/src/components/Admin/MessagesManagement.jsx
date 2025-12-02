import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/config';

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Show mock messages if database fails
      setMessages([
        {
          id: 1,
          name: 'Amit Soni',
          email: 'amit@example.com',
          phone: '9876543210',
          subject: 'membership',
          message: 'I want to join the samaj. Please guide me.',
          is_read: false,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Sunita Devi',
          email: 'sunita@example.com',
          phone: '9876543211',
          subject: 'events',
          message: 'When is the next community event?',
          is_read: true,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
      
      if (error) throw error;
      loadMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      loadMessages();
      alert('Message deleted successfully!');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '30px',
        background: 'linear-gradient(135deg, #FFF5E1, #FFEAA7)',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(255, 153, 51, 0.2)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '15px', color: '#FF9933' }}>⏳</div>
          <h3 style={{ color: '#800000', margin: 0 }}>Loading Messages...</h3>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter(msg => !msg.is_read).length;

  return (
    <div style={{ 
      padding: '20px',
      background: 'linear-gradient(135deg, #FFF5E1, #FFEAA7)',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FF9933, #800000)',
        color: 'white',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '25px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>📧 Messages ({messages.length}) - {unreadCount} Unread</h2>
      </div>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {messages.map(message => (
          <div key={message.id} style={{
            background: message.is_read ? 'white' : '#FFF5E1',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            border: `3px solid ${message.is_read ? '#FFE4B5' : '#FF9933'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>{message.name}</h3>
                  {!message.is_read && (
                    <span style={{
                      background: '#f59e0b',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      NEW
                    </span>
                  )}
                </div>
                
                <p><strong>Email:</strong> {message.email}</p>
                <p><strong>Phone:</strong> {message.phone}</p>
                <p><strong>Subject:</strong> {message.subject}</p>
                <p><strong>Received:</strong> {new Date(message.created_at).toLocaleString()}</p>
                
                {selectedMessage?.id === message.id && (
                  <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '6px'
                  }}>
                    <h4>Message:</h4>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{message.message}</p>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <button
                  onClick={() => setSelectedMessage(selectedMessage?.id === message.id ? null : message)}
                  style={{
                    background: 'linear-gradient(135deg, #FF9933, #800000)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 4px 12px rgba(255, 153, 51, 0.3)'
                  }}
                >
                  {selectedMessage?.id === message.id ? 'Hide' : 'View'} Message
                </button>
                
                {!message.is_read && (
                  <button
                    onClick={() => markAsRead(message.id)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Mark Read
                  </button>
                )}
                
                <button
                  onClick={() => deleteMessage(message.id)}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '50px',
            background: 'white',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📧</div>
            <h3>No Messages Yet</h3>
            <p>Contact form messages will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesManagement;