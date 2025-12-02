import React, { useState, useEffect } from 'react';
import { memberService } from '../../services/memberService';
import { eventService } from '../../services/eventService';
import { messageService } from '../../services/messageService';
import { birthdayWishService } from '../../services/birthdayWishService';
import './AdminDashboardNew.css';
import './AdminButtonFixes.css';

const AdminDashboardNew = ({ admin, onLogout }) => {
  const [stats, setStats] = useState({
    members: { total: 0, pending: 0, approved: 0 },
    events: 0,
    messages: 0,
    todaysBirthdays: 0
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
    
    // Real-time subscriptions
    const membersSubscription = memberService.subscribeToMembers?.(() => {
      loadMemberStats();
      loadRecentMembers();
    });
    
    const messagesSubscription = messageService.subscribeToMessages(() => {
      loadMessageStats();
      loadRecentMessages();
    });

    return () => {
      membersSubscription?.unsubscribe();
      messagesSubscription?.unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      loadMemberStats(),
      loadEventStats(),
      loadMessageStats(),
      loadBirthdayStats(),
      loadRecentMembers(),
      loadRecentMessages()
    ]);
    setLoading(false);
  };

  const loadMemberStats = async () => {
    const memberStats = await memberService.getMemberStats();
    setStats(prev => ({ ...prev, members: memberStats }));
  };

  const loadEventStats = async () => {
    const events = await eventService.getAllEvents();
    setStats(prev => ({ ...prev, events: events.length }));
  };

  const loadMessageStats = async () => {
    const messages = await messageService.getAllMessages();
    setStats(prev => ({ ...prev, messages: messages.length }));
  };

  const loadBirthdayStats = async () => {
    const birthdays = await birthdayWishService.getTodaysBirthdays();
    setStats(prev => ({ ...prev, todaysBirthdays: birthdays.length }));
  };

  const loadRecentMembers = async () => {
    const members = await memberService.getAllMembers();
    setRecentMembers(members.slice(0, 5));
  };

  const loadRecentMessages = async () => {
    const messages = await messageService.getAllMessages();
    setRecentMessages(messages.slice(0, 5));
  };

  const handleMemberAction = async (memberId, action) => {
    try {
      if (action === 'approve') {
        await memberService.updateMemberStatus(memberId, 'approved', admin.id);
      } else if (action === 'reject') {
        await memberService.updateMemberStatus(memberId, 'rejected', admin.id);
      } else if (action === 'delete') {
        if (window.confirm('क्या आप इस सदस्य को हटाना चाहते हैं?')) {
          await memberService.deleteMember(memberId);
        }
      }
      loadRecentMembers();
      loadMemberStats();
    } catch (error) {
      alert('कार्य पूरा करने में त्रुटि हुई।');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">डैशबोर्ड लोड हो रहा है...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="admin-info">
            <h1>🏛️ सोनी समाज प्रबंधन</h1>
            <p>स्वागत है, {admin.name}</p>
          </div>
          <button 
            onClick={() => {
              if (window.confirm('क्या आप लॉगआउट करना चाहते हैं?')) {
                onLogout();
              }
            }} 
            className="logout-btn"
          >
            🚪 लॉगआउट
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 डैशबोर्ड
        </button>
        <button 
          className={activeTab === 'members' ? 'active' : ''}
          onClick={() => setActiveTab('members')}
        >
          👥 सदस्य ({stats.members.pending})
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          📰 समाचार
        </button>
        <button 
          className={activeTab === 'messages' ? 'active' : ''}
          onClick={() => setActiveTab('messages')}
        >
          💬 संदेश ({stats.messages})
        </button>
        <button 
          onClick={() => window.location.href = '/admin/sangthan'}
          className="nav-btn"
        >
          🏛️ संगठन
        </button>
      </nav>

      {/* Dashboard Content */}
      <main className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card members">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.members.total}</h3>
                  <p>कुल सदस्य</p>
                  <small>{stats.members.pending} प्रतीक्षारत</small>
                </div>
              </div>
              
              <div className="stat-card events">
                <div className="stat-icon">📰</div>
                <div className="stat-info">
                  <h3>{stats.events}</h3>
                  <p>कुल समाचार</p>
                </div>
              </div>
              
              <div className="stat-card messages">
                <div className="stat-icon">💬</div>
                <div className="stat-info">
                  <h3>{stats.messages}</h3>
                  <p>प्राप्त संदेश</p>
                </div>
              </div>
              
              <div className="stat-card birthdays">
                <div className="stat-icon">🎂</div>
                <div className="stat-info">
                  <h3>{stats.todaysBirthdays}</h3>
                  <p>आज के जन्मदिन</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
              <div className="recent-members">
                <h2>हाल के सदस्य पंजीकरण</h2>
                {recentMembers.length === 0 ? (
                  <div className="empty-state">
                    <p>कोई नया पंजीकरण नहीं</p>
                  </div>
                ) : (
                  <div className="members-list">
                    {recentMembers.map((member) => (
                      <div key={member.id} className="member-item">
                        <div className="member-info">
                          <h4>{member.full_name}</h4>
                          <p>{member.mobile_number}</p>
                          <span className={`status ${member.registration_status}`}>
                            {member.registration_status === 'pending' ? 'प्रतीक्षारत' :
                             member.registration_status === 'approved' ? 'स्वीकृत' : 'अस्वीकृत'}
                          </span>
                        </div>
                        {member.registration_status === 'pending' && (
                          <div className="member-actions">
                            <button 
                              onClick={() => handleMemberAction(member.id, 'approve')}
                              className="approve-btn"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={() => handleMemberAction(member.id, 'reject')}
                              className="reject-btn"
                            >
                              ✗
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="recent-messages">
                <h2>हाल के संदेश</h2>
                {recentMessages.length === 0 ? (
                  <div className="empty-state">
                    <p>कोई नया संदेश नहीं</p>
                  </div>
                ) : (
                  <div className="messages-list">
                    {recentMessages.map((message) => (
                      <div key={message.id} className="message-item">
                        <div className="message-header">
                          <strong>{message.sender_name}</strong>
                          <span className="message-date">
                            {new Date(message.created_at).toLocaleDateString('hi-IN')}
                          </span>
                        </div>
                        <p>{message.message.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-section">
            <h2>सदस्य प्रबंधन</h2>
            <div className="quick-actions-grid">
              <button onClick={() => window.location.href = '/admin/members'} className="action-btn">
                👥 सदस्य सूची देखें
              </button>
              <button onClick={() => loadMemberStats()} className="action-btn">
                🔄 आंकड़े रीफ्रेश करें
              </button>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <h2>समाचार प्रबंधन</h2>
            <div className="quick-actions-grid">
              <button onClick={() => window.location.href = '/admin/badhai'} className="action-btn">
                🎉 बधाई समाचार
              </button>
              <button onClick={() => window.location.href = '/admin/shok'} className="action-btn">
                🙏 शोक समाचार
              </button>
              <button onClick={() => window.location.href = '/admin/news'} className="action-btn">
                📰 सामान्य समाचार
              </button>
              <button onClick={() => window.location.href = '/admin/birthday'} className="action-btn">
                🎂 जन्मदिन समाचार
              </button>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-section">
            <h2>संदेश प्रबंधन</h2>
            <div className="quick-actions-grid">
              <button onClick={() => window.location.href = '/admin/messages'} className="action-btn">
                📧 सभी संदेश देखें
              </button>
              <button onClick={() => loadRecentMessages()} className="action-btn">
                🔄 संदेश रीफ्रेश करें
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardNew;