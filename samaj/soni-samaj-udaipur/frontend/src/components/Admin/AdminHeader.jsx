import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminHeader = ({ admin, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: '/admin/dashboard' },
    { id: 'members', label: 'Members', icon: '👥', path: '/admin/members' },
    { id: 'badhai', label: 'Badhai', icon: '🎉', path: '/admin/badhai' },
    { id: 'shok', label: 'Shok News', icon: '🙏', path: '/admin/shok' },
    { id: 'birthday', label: 'Birthdays', icon: '🎂', path: '/admin/birthday' },
    { id: 'news', label: 'News', icon: '📰', path: '/admin/news' },
    { id: 'sangthan', label: 'Sangthan', icon: '🏛️', path: '/admin/sangthan' }
  ];

  const getCurrentActiveModule = () => {
    const currentPath = location.pathname;
    const pathMap = {
      '/admin/dashboard': 'dashboard',
      '/admin/members': 'members',
      '/admin/sangthan': 'sangthan',
      '/admin/badhai': 'badhai',
      '/admin/shok': 'shok',
      '/admin/birthday': 'birthday',
      '/admin/news': 'news'
    };
    return pathMap[currentPath] || 'dashboard';
  };

  const currentActiveModule = getCurrentActiveModule();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header style={{
      backgroundColor: '#ff8c00',
      color: 'white',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      flexShrink: 0,
      zIndex: 100
    }}>
      {/* Logo & Brand */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => handleNavigation('/admin/dashboard')}
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          👑
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Admin Panel</h1>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Soni Samaj Udaipur</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ display: 'flex', gap: '8px' }}>
        {menuItems.map((item) => {
          const isActive = currentActiveModule === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: isActive ? '#e67e00' : 'transparent',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Admin Info & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>
              {admin?.name || 'Admin'}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
              {admin?.role || 'Administrator'}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              if (onLogout) {
                onLogout();
              } else {
                // Fallback logout
                localStorage.clear();
                window.location.href = '/admin/login';
              }
            }
          }}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ef4444';
          }}
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;