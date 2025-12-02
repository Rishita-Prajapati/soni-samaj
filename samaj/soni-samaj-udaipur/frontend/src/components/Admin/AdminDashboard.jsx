import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; // 🎨 CSS IMPORT
import './AdminButtonFixes.css';
import AdminLayout from './AdminLayout';
import { memberService, messageService } from '../../supabase/services/memberService';
import { badhaiService } from '../../supabase/services/badhaiService';
import { shokService } from '../../supabase/services/shokService';
import { newsService } from '../../supabase/services/newsService';
import { birthdayService } from '../../supabase/services/birthdayService';

const AdminDashboard = ({ admin, onLogout }) => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalMessages: 0,
    pendingMembers: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [memberStats, messageStats, badhaiData, shokData, newsData] = await Promise.all([
          memberService.getStats(),
          messageService.getAllMessages(1, 1),
          badhaiService.getPublishedBadhai(3),
          shokService.getPublishedShok(2),
          newsService.getPublishedNews(2)
        ]);
        
        const totalEvents = (badhaiData.success ? badhaiData.data.length : 0) + 
                           (shokData.success ? shokData.data.length : 0) + 
                           (newsData.success ? newsData.data.length : 0);
        
        setStats({
          totalMembers: memberStats.success ? memberStats.data.totalMembers : 0,
          totalEvents: totalEvents,
          totalMessages: messageStats.success ? messageStats.total : 0,
          pendingMembers: memberStats.success ? memberStats.data.pendingMembers : 0
        });
        
        // Combine recent events from all sources
        const allEvents = [];
        if (badhaiData.success) allEvents.push(...badhaiData.data.map(e => ({...e, type: 'badhai'})));
        if (shokData.success) allEvents.push(...shokData.data.map(e => ({...e, type: 'shok'})));
        if (newsData.success) allEvents.push(...newsData.data.map(e => ({...e, type: 'news'})));
        
        // Sort by created_at and take first 5
        const sortedEvents = allEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        setRecentEvents(sortedEvents);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statsDisplay = [
    { title: 'Total Members', value: stats.totalMembers.toString(), icon: '👥', bgColor: 'blue' },
    { title: 'Pending Members', value: stats.pendingMembers.toString(), icon: '⏳', bgColor: 'orange' },
    { title: 'Total Messages', value: stats.totalMessages.toString(), icon: '📧', bgColor: 'purple' },
    { title: 'Active Events', value: stats.totalEvents.toString(), icon: '📅', bgColor: 'green' }
  ];

  const quickActions = [
    { title: 'Members', icon: '👥', bgColor: 'blue', action: () => navigateToPage('/admin/members') },
    { title: 'Badhai', icon: '🎉', bgColor: 'green', action: () => navigateToPage('/admin/badhai') },
    { title: 'Shok', icon: '🙏', bgColor: 'gray', action: () => navigateToPage('/admin/shok') },
    { title: 'News', icon: '📰', bgColor: 'blue', action: () => navigateToPage('/admin/news') },
    { title: 'Birthday', icon: '🎂', bgColor: 'pink', action: () => navigateToPage('/admin/birthday') },
    { title: 'Messages', icon: '📧', bgColor: 'red', action: () => navigateToPage('/admin/messages') },
    { title: 'Sangathan', icon: '🏛️', bgColor: 'purple', action: () => navigateToPage('/admin/sangthan') }
  ];

  const navigateToPage = (path) => {
    try {
      window.location.href = path;
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Navigation failed. Please try again.');
    }
  };

  return (
    <AdminLayout admin={admin} onLogout={onLogout} currentModule="dashboard">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <div className="welcome-text">
              <h1>Welcome to the Soni Samaj Admin Dashboard! 🏛️</h1>
              <p>Here's an overview of your community management portal</p>
            </div>
            <div className="welcome-icon">
              <span>🎯</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>Loading stats...</div>
          ) : (
            statsDisplay.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-content">
                  <div className="stat-info">
                    <p className="stat-title">{stat.title}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                  <div className={`stat-icon ${stat.bgColor}`}>
                    <span>{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Recent Events */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Recent Events</h2>
              <p>Latest community events and activities</p>
            </div>
            <div className="card-content">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading events...</div>
              ) : recentEvents.length > 0 ? (
                <div className="events-list">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="event-item">
                      <div className="event-content">
                        <div className="event-indicator"></div>
                        <div className="event-info">
                          <h3>{event.title}</h3>
                          <p>{event.type} • {new Date(event.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="event-status">published</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No events yet. Start by adding your first event!
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  className="view-all-btn"
                  onClick={() => navigateToPage('/admin/badhai')}
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  Manage Badhai
                </button>
                <button 
                  className="view-all-btn"
                  onClick={() => navigateToPage('/admin/shok')}
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  Manage Shok
                </button>
                <button 
                  className="view-all-btn"
                  onClick={() => navigateToPage('/admin/news')}
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  Manage News
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Quick Overview</h2>
              <p>Community activity summary</p>
            </div>
            <div className="card-content">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading overview...</div>
              ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <span>Total Members</span>
                    <strong>{stats.totalMembers}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fef3c7', borderRadius: '8px' }}>
                    <span>Pending Approvals</span>
                    <strong style={{ color: '#f59e0b' }}>{stats.pendingMembers}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <span>Contact Messages</span>
                    <strong>{stats.totalMessages}</strong>
                  </div>
                </div>
              )}
              <button 
                className="view-all-btn"
                onClick={() => navigateToPage('/admin/members')}
              >
                Manage Members
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <div className="actions-header">
            <h2>Quick Actions</h2>
            <p>Common tasks and shortcuts</p>
          </div>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="action-card"
              >
                <div className={`action-icon ${action.bgColor}`}>
                  <span>{action.icon}</span>
                </div>
                <h3 className="action-title">{action.title}</h3>
                <p className="action-description">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;