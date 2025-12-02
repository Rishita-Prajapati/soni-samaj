import React, { useState } from 'react';
import './AdminNavbar.css';

const AdminNavbar = ({ admin, onLogout, onToggleSidebar, currentModule = 'Dashboard' }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'New Member Registration',
      message: 'Rajesh Kumar has registered as a new member',
      time: '2 mins ago',
      unread: true
    },
    {
      id: 2,
      title: 'Event Update',
      message: 'Annual Community Meeting date changed',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Website backup completed successfully',
      time: '3 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    console.log('Logout clicked!'); // Debug log
    setShowProfileDropdown(false);
    
    // Call the logout function passed from props
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    } else {
      console.error('onLogout function not provided or not a function');
    }
  };

  const formatModuleName = (module) => {
    return module.charAt(0).toUpperCase() + module.slice(1);
  };

  const navbarStyle = {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'relative',
    zIndex: 40
  };

  const leftSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const mobileMenuBtnStyle = {
    display: window.innerWidth < 1024 ? 'block' : 'none',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#4b5563'
  };

  const searchStyle = {
    display: window.innerWidth >= 768 ? 'flex' : 'none',
    flex: 1,
    maxWidth: '32rem',
    margin: '0 32px',
    position: 'relative'
  };

  const searchInputStyle = {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none'
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const notificationBtnStyle = {
    position: 'relative',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px'
  };

  const profileBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer'
  };

  const profileAvatarStyle = {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: 'white'
  };

  const dropdownStyle = {
    position: 'absolute',
    right: 0,
    marginTop: '8px',
    width: '192px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    padding: '8px 0',
    zIndex: 50
  };

  const dropdownHeaderStyle = {
    padding: '8px 16px',
    borderBottom: '1px solid #f3f4f6'
  };

  const menuItemStyle = {
    width: '100%',
    padding: '8px 16px',
    textAlign: 'left',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#374151',
    transition: 'background-color 0.2s'
  };

  const logoutItemStyle = {
    ...menuItemStyle,
    color: '#dc2626',
    borderTop: '1px solid #f3f4f6',
    marginTop: '8px',
    paddingTop: '12px'
  };

  return (
    <header style={navbarStyle}>
      {/* Left Section */}
      <div style={leftSectionStyle}>
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleSidebar}
          style={mobileMenuBtnStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ☰
        </button>

        {/* Page Title */}
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            {formatModuleName(currentModule)}
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, display: window.innerWidth >= 640 ? 'block' : 'none' }}>
            Manage your {currentModule.toLowerCase()} here
          </p>
        </div>
      </div>

      {/* Center Section - Search */}
      <div style={searchStyle}>
        <div style={{ position: 'relative', width: '100%' }}>
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '18px'
          }}>🔍</span>
          <input
            type="text"
            placeholder="Search members, events, content..."
            style={searchInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div style={rightSectionStyle}>
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            style={notificationBtnStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '12px',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '500'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{ ...dropdownStyle, width: '320px' }}>
              <div style={dropdownHeaderStyle}>
                <h3 style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>Notifications</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{unreadCount} unread</p>
              </div>
              
              <div style={{ maxHeight: '384px', overflowY: 'auto' }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderLeft: `4px solid ${notification.unread ? '#3b82f6' : 'transparent'}`,
                      backgroundColor: notification.unread ? '#eff6ff' : 'transparent'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    onMouseOut={(e) => e.target.style.backgroundColor = notification.unread ? '#eff6ff' : 'transparent'}
                  >
                    <h4 style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px', margin: '0 0 4px 0' }}>
                      {notification.title}
                    </h4>
                    <p style={{ color: '#4b5563', fontSize: '14px', margin: '4px 0' }}>
                      {notification.message}
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: '8px 0 0 0' }}>
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
              
              <div style={{ padding: '8px 16px', borderTop: '1px solid #f3f4f6' }}>
                <button style={{
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.color = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.color = '#3b82f6'}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            style={profileBtnStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <div style={profileAvatarStyle}>
              👤
            </div>
            <div style={{ display: window.innerWidth >= 1024 ? 'block' : 'none', textAlign: 'left' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                {admin?.name || 'Admin User'}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                {admin?.role || 'Administrator'}
              </p>
            </div>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>▼</span>
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileDropdown && (
            <div style={dropdownStyle}>
              <div style={dropdownHeaderStyle}>
                <p style={{ fontWeight: '500', color: '#1f2937', margin: 0 }}>{admin?.name || 'Admin User'}</p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{admin?.email || 'admin@sonisamaj.com'}</p>
              </div>
              
              <button style={menuItemStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                <span>👤</span>
                <span>Profile</span>
              </button>
              
              <button style={menuItemStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                <span>⚙️</span>
                <span>Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                style={logoutItemStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for dropdowns */}
      {(showProfileDropdown || showNotifications) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 30
          }}
          onClick={() => {
            setShowProfileDropdown(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default AdminNavbar;