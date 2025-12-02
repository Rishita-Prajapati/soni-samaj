import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = ({ activeModule, onModuleChange, isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/admin/dashboard'
    },
    {
      id: 'members',
      label: 'Members',
      icon: '👥',
      path: '/admin/members'
    },
    {
      id: 'badhai',
      label: 'Badhai',
      icon: '🎉',
      path: '/admin/badhai'
    },
    {
      id: 'shok',
      label: 'Shok News',
      icon: '🙏',
      path: '/admin/shok'
    },
    {
      id: 'birthday',
      label: 'Birthdays',
      icon: '🎂',
      path: '/admin/birthday'
    },
    {
      id: 'news',
      label: 'News',
      icon: '📰',
      path: '/admin/news'
    },
    {
      id: 'sangthan',
      label: 'Sangthan',
      icon: '🏛️',
      path: '/admin/sangthan'
    }
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
      '/admin/news': 'news',
      '/admin/messages': 'messages'
    };
    return pathMap[currentPath] || 'dashboard';
  };

  const currentActiveModule = getCurrentActiveModule();

  const handleNavigation = (path, itemId) => {
    try {
      navigate(path);
      if (onModuleChange) {
        onModuleChange(itemId);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  return (
    <div style={{
      backgroundColor: '#ff8c00',
      color: 'white',
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Header */}
      <div 
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer'
        }} 
        onClick={() => handleNavigation('/admin/dashboard', 'dashboard')}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              👑
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Admin Panel</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Soni Samaj Udaipur</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            margin: '0 auto'
          }}>
            👑
          </div>
        )}
      </div>

      {/* Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '80px',
            backgroundColor: '#e67e00',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'white',
            zIndex: 10
          }}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      )}

      {/* Navigation Menu */}
      <nav style={{
        flex: 1,
        padding: '24px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => {
          const isActive = currentActiveModule === item.id;
          
          return (
            <button
              key={item.id}
              data-menu-id={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: isActive ? '#e67e00' : 'transparent',
                color: isActive ? 'white' : 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                cursor: 'pointer',
                gap: isCollapsed ? '0' : '12px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                }
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <span style={{ fontSize: '20px', minWidth: '20px' }}>{item.icon}</span>
              {!isCollapsed && (
                <span style={{ flex: 1, textAlign: 'left' }}>
                  {item.label}
                </span>
              )}
              {isActive && !isCollapsed && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  opacity: 0.8
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {!isCollapsed && process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            fontSize: '10px',
            opacity: 0.7
          }}>
            <div>Path: {location.pathname}</div>
            <div>Active: {currentActiveModule}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;