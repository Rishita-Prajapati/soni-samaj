import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import AddEventForm from './AddEventForm';
import MembersManagement from './MembersManagement';
import SangathanManagement from './SangathanManagement';
import MessagesManagement from './MessagesManagement';

const SimpleAdminPage = ({ title, icon, admin, onLogout, children }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Determine event type based on title
  const getEventType = () => {
    if (title.toLowerCase().includes('badhai')) return 'badhai';
    if (title.toLowerCase().includes('shok')) return 'shok';
    if (title.toLowerCase().includes('news')) return 'news';
    return 'news';
  };

  const getActionText = () => {
    if (title.toLowerCase().includes('badhai')) return 'Add Badhai';
    if (title.toLowerCase().includes('shok')) return 'Add Shok Samachar';
    if (title.toLowerCase().includes('news')) return 'Add News';
    if (title.toLowerCase().includes('birthday')) return 'Add Birthday Event';
    if (title.toLowerCase().includes('members')) return 'Add Member';
    return 'Add Item';
  };

  const handleSuccess = () => {
    setShowAddForm(false);
  };

  // Show specific management components
  if (title.toLowerCase().includes('members')) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout}>
        <MembersManagement />
      </AdminLayout>
    );
  }

  if (title.toLowerCase().includes('sangthan')) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout}>
        <SangathanManagement />
      </AdminLayout>
    );
  }

  if (title.toLowerCase().includes('messages')) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout}>
        <MessagesManagement />
      </AdminLayout>
    );
  }

  // Show add form for events
  if (showAddForm && ['badhai', 'shok', 'news'].includes(getEventType())) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout}>
        <AddEventForm 
          eventType={getEventType()}
          onSuccess={handleSuccess}
          onCancel={() => setShowAddForm(false)}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout admin={admin} onLogout={onLogout}>
      <div style={{ 
        padding: '20px',
        background: 'linear-gradient(135deg, #FFF5E1, #FFEAA7)',
        minHeight: '100vh'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '15px',
          textAlign: 'center',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
          border: '2px solid #FFE4B5'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{icon}</div>
          <h1 style={{ color: '#800000', marginBottom: '10px' }}>{title}</h1>
          <p style={{ color: '#FF9933', marginBottom: '20px' }}>
            Manage your {title.toLowerCase()}
          </p>
          {children}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              style={{
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
              }}
            >
              ← Dashboard
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: 'linear-gradient(135deg, #FF9933, #800000)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(255, 153, 51, 0.3)'
              }}
            >
              + {getActionText()}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SimpleAdminPage;