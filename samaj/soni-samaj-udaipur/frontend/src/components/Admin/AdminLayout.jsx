import React from 'react';
import AdminHeader from './AdminHeader';
import '../../styles/admin.css';

const AdminLayout = ({ children, admin, onLogout }) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Navigation */}
      <AdminHeader admin={admin} onLogout={onLogout} />

      {/* Page Content */}
      <main style={{
        flex: 1,
        backgroundColor: 'white',
        minHeight: 'calc(100vh - 80px)'
      }}>
        <div style={{
          padding: '20px',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;