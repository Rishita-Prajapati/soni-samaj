import React, { useState, useEffect } from 'react';
import adminAuthService from '../services/adminAuthService';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const currentAdmin = adminAuthService.getCurrentAdmin();
    setAdmin(currentAdmin);
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await adminAuthService.logoutAdmin();
        localStorage.clear();
        if (onLogout) {
          onLogout();
        } else {
          window.location.href = '/admin/login';
        }
      } catch (error) {
        console.error('Logout error:', error);
        window.location.href = '/admin/login';
      }
    }
  };

  if (!admin) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="admin-info">
            <div className="admin-avatar">
              <span>👤</span>
            </div>
            <div className="admin-details">
              <h2>Welcome, {admin.name}</h2>
              <p>{admin.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-nav">
          <button 
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            👥 Members
          </button>
          <button 
            className={`nav-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            🎉 Events
          </button>
          <button 
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="dashboard-main">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h3>Dashboard Overview</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h4>Total Members</h4>
                    <p>1,234</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎉</div>
                  <div className="stat-info">
                    <h4>Active Events</h4>
                    <p>12</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎂</div>
                  <div className="stat-info">
                    <h4>Today's Birthdays</h4>
                    <p>5</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="members-section">
              <h3>Member Management</h3>
              <p>Manage community members here.</p>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-section">
              <h3>Event Management</h3>
              <p>Manage community events here.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h3>Admin Settings</h3>
              <div className="settings-card">
                <h4>Security Information</h4>
                <p><strong>Admin Email:</strong> {admin.email}</p>
                <p><strong>Role:</strong> {admin.role}</p>
                <p><strong>Status:</strong> Active</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;