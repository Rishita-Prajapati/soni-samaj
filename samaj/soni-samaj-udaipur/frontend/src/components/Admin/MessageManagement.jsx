import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { messageService } from '../../supabase/services/memberService';
import './MessageManagement.css';
import './AdminButtonFixes.css';

const MessageManagement = ({ admin, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [currentPage]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const result = await messageService.getAllMessages(currentPage, 20);
      if (result.success) {
        setMessages(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const result = await messageService.markAsRead(id);
      if (result.success) {
        loadMessages();
      }
    } catch (error) {
      alert('Error marking message as read: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const result = await messageService.deleteMessage(id);
        if (result.success) {
          loadMessages();
          alert('Message deleted successfully!');
        }
      } catch (error) {
        alert('Error deleting message: ' + error.message);
      }
    }
  };

  const viewMessageDetails = (message) => {
    setSelectedMessage(message);
    setShowDetails(true);
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  const getReadStatus = (isRead) => {
    return isRead ? (
      <span className="status-read">✅ Read</span>
    ) : (
      <span className="status-unread">🔴 Unread</span>
    );
  };

  return (
    <AdminLayout admin={admin} onLogout={onLogout} currentModule="messages">
      <div className="message-management">
        <div className="page-header">
          <h1>📧 Message Management</h1>
          <p>Manage contact form submissions and inquiries</p>
        </div>

        {/* Messages Table */}
        <div className="messages-table-container">
          {loading ? (
            <div className="loading">Loading messages...</div>
          ) : (
            <table className="messages-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className={!message.is_read ? 'unread-row' : ''}>
                    <td>{getReadStatus(message.is_read)}</td>
                    <td>
                      <div className="sender-info">
                        <strong>{message.name}</strong>
                      </div>
                    </td>
                    <td>{message.email}</td>
                    <td>{message.phone || 'Not provided'}</td>
                    <td>
                      <div className="subject-preview">
                        {message.subject}
                      </div>
                    </td>
                    <td>{new Date(message.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => viewMessageDetails(message)}
                          className="btn-view"
                          title="View Message"
                        >
                          👁️
                        </button>
                        {!message.is_read && (
                          <button 
                            onClick={() => handleMarkAsRead(message.id)}
                            className="btn-mark-read"
                            title="Mark as Read"
                          >
                            ✅
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(message.id)}
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

        {/* Message Details Modal */}
        {showDetails && selectedMessage && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📧 Message Details</h2>
                <button onClick={() => setShowDetails(false)}>✕</button>
              </div>
              
              <div className="message-details">
                <div className="detail-section">
                  <h3>Sender Information</h3>
                  <div className="detail-grid">
                    <div><strong>Name:</strong> {selectedMessage.name}</div>
                    <div><strong>Email:</strong> {selectedMessage.email}</div>
                    <div><strong>Phone:</strong> {selectedMessage.phone || 'Not provided'}</div>
                    <div><strong>Date:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Message Content</h3>
                  <div className="message-subject">
                    <strong>Subject:</strong> {selectedMessage.subject}
                  </div>
                  <div className="message-body">
                    <strong>Message:</strong>
                    <div className="message-text">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Status</h3>
                  <div className="status-info">
                    {getReadStatus(selectedMessage.is_read)}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                {!selectedMessage.is_read && (
                  <button 
                    onClick={() => {
                      handleMarkAsRead(selectedMessage.id);
                      setShowDetails(false);
                    }}
                    className="btn-mark-read"
                  >
                    ✅ Mark as Read
                  </button>
                )}
                <button 
                  onClick={() => {
                    const email = selectedMessage.email;
                    const subject = `Re: ${selectedMessage.subject}`;
                    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`, '_blank');
                  }}
                  className="btn-reply"
                >
                  📧 Reply via Email
                </button>
                <button onClick={() => setShowDetails(false)} className="btn-close">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MessageManagement;