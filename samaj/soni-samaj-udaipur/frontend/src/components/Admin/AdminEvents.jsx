import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { eventsService, utils } from '../../services/firebaseService';

const AdminEvents = ({ admin, onLogout }) => {
  const [stats, setStats] = useState({
    total: 0,
    badhai: 0,
    shok: 0,
    birthday: 0,
    news: 0,
    published: 0,
    featured: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, allEvents] = await Promise.all([
        eventsService.getEventsStats(),
        eventsService.getAllEvents()
      ]);
      
      setStats(statsData);
      
      // Get recent events (last 10)
      const recent = allEvents
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setRecentEvents(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToEventType = (eventType) => {
    window.location.href = `/admin/events/${eventType}`;
  };

  const getEventIcon = (eventType) => {
    const icons = {
      badhai: '🎉',
      shok: '🙏',
      birthday: '🎂',
      news: '📰'
    };
    return icons[eventType] || '📝';
  };

  const getEventColor = (eventType) => {
    const colors = {
      badhai: '#10b981',
      shok: '#6b7280',
      birthday: '#ec4899',
      news: '#3b82f6'
    };
    return colors[eventType] || '#6b7280';
  };

  if (loading) {
    return (
      <AdminLayout admin={admin} onLogout={onLogout} currentModule="events">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
            <div>Loading events overview...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout admin={admin} onLogout={onLogout} currentModule="events">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            📊 Events Overview
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Manage all types of community events and news
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {/* Total Events */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📝</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
              {stats.total}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Events</div>
          </div>

          {/* Badhai Events */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '2px solid #10b981',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onClick={() => navigateToEventType('badhai')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
              {stats.badhai}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Badhai Events</div>
          </div>

          {/* Shok News */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '2px solid #6b7280',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onClick={() => navigateToEventType('shok-news')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🙏</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280', marginBottom: '4px' }}>
              {stats.shok}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Shok News</div>
          </div>

          {/* Birthday Events */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '2px solid #ec4899',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onClick={() => navigateToEventType('birthday')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎂</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ec4899', marginBottom: '4px' }}>
              {stats.birthday}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Birthday Events</div>
          </div>

          {/* News Articles */}
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '2px solid #3b82f6',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onClick={() => navigateToEventType('news')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📰</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
              {stats.news}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>News Articles</div>
          </div>

          {/* Published Content */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px solid #059669',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', marginBottom: '4px' }}>
              {stats.published}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Published</div>
          </div>

          {/* Featured Content */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px solid #f59e0b',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⭐</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
              {stats.featured}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Featured</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            📝 Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <button
              onClick={() => navigateToEventType('badhai')}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '20px' }}>🎉</span>
              Add Badhai Event
            </button>
            
            <button
              onClick={() => navigateToEventType('shok-news')}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '20px' }}>🙏</span>
              Add Shok News
            </button>
            
            <button
              onClick={() => navigateToEventType('birthday')}
              style={{
                backgroundColor: '#ec4899',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '20px' }}>🎂</span>
              Add Birthday Event
            </button>
            
            <button
              onClick={() => navigateToEventType('news')}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '20px' }}>📰</span>
              Add News Article
            </button>
          </div>
        </div>

        {/* Recent Events */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            🕒 Recent Events
          </h2>
          
          {recentEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
              <p>No events yet. Start by adding your first event!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentEvents.map((event, index) => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: `2px solid ${getEventColor(event.eventType)}20`
                  }}
                >
                  <div style={{
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: getEventColor(event.eventType),
                    color: 'white',
                    borderRadius: '50%'
                  }}>
                    {getEventIcon(event.eventType)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                      {event.title || event.person_name || event.deceased_name || 'Untitled'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {event.family_name && `Family: ${event.family_name} • `}
                      Added {utils.getRelativeTime(event.createdAt)}
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: getEventColor(event.eventType),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {event.eventType}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;