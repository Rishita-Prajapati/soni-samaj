import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { eventsService } from '../../services/supabaseService';

const AdminEventsOverview = ({ admin, onLogout }) => {
  const [stats, setStats] = useState({
    badhai: 0,
    shok: 0,
    birthday: 0,
    news: 0,
    total: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventsData();
  }, []);

  const loadEventsData = async () => {
    try {
      setLoading(true);
      
      // Get stats for each event type
      const [badhaiEvents, shokEvents, birthdayEvents, newsEvents] = await Promise.all([
        eventsService.getEventsByType('badhai', 100),
        eventsService.getEventsByType('shok', 100),
        eventsService.getEventsByType('birthday', 100),
        eventsService.getEventsByType('news', 100)
      ]);

      const eventStats = {
        badhai: badhaiEvents.length,
        shok: shokEvents.length,
        birthday: birthdayEvents.length,
        news: newsEvents.length,
        total: badhaiEvents.length + shokEvents.length + birthdayEvents.length + newsEvents.length
      };

      setStats(eventStats);

      // Get recent events (last 10)
      const allEvents = [
        ...badhaiEvents.map(e => ({ ...e, type: 'badhai', title: e.event_title })),
        ...shokEvents.map(e => ({ ...e, type: 'shok', title: e.deceased_name + ' - Shok' })),
        ...birthdayEvents.map(e => ({ ...e, type: 'birthday', title: e.person_name + ' - Birthday' })),
        ...newsEvents.map(e => ({ ...e, type: 'news', title: e.title }))
      ];

      const sortedEvents = allEvents
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);

      setRecentEvents(sortedEvents);
    } catch (error) {
      console.error('Error loading events data:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventTypeConfig = {
    badhai: { color: '#10b981', icon: '🎉', label: 'Badhai Events', path: '/admin/events/badhai' },
    shok: { color: '#6b7280', icon: '🕊️', label: 'Shok Events', path: '/admin/events/shok' },
    birthday: { color: '#f59e0b', icon: '🎂', label: 'Birthday Events', path: '/admin/events/birthday' },
    news: { color: '#3b82f6', icon: '📰', label: 'News Articles', path: '/admin/events/news' }
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
            Manage all events, news, and celebrations • Total Events: {stats.total}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {Object.entries(eventTypeConfig).map(([type, config]) => (
            <Link
              key={type}
              to={config.path}
              style={{
                textDecoration: 'none',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: `2px solid ${config.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '2rem' }}>{config.icon}</div>
                <div style={{
                  backgroundColor: config.color,
                  color: 'white',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {stats[type]}
                </div>
              </div>
              <h3 style={{ color: config.color, margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>
                {config.label}
              </h3>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                Click to manage {type} events
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Events */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 20px 0' }}>
            📅 Recent Events
          </h2>
          
          {recentEvents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentEvents.map((event, index) => {
                const config = eventTypeConfig[event.type];
                return (
                  <div
                    key={`${event.type}-${event.id}-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: `1px solid ${config.color}20`
                    }}
                  >
                    <div style={{
                      fontSize: '1.5rem',
                      width: '40px',
                      textAlign: 'center'
                    }}>
                      {config.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', color: '#1f2937', fontSize: '16px' }}>
                        {event.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#6b7280' }}>
                        <span style={{
                          backgroundColor: config.color,
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {config.label.replace(' Events', '').replace(' Articles', '')}
                        </span>
                        <span>📅 {new Date(event.created_at).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <Link
                      to={config.path}
                      style={{
                        backgroundColor: config.color,
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
              <p>No events created yet. Start by adding your first event!</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEventsOverview;