import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { birthdayWishService } from '../services/birthdayWishService';
import { memberService } from '../services/memberService';
import './HomePage.css';

const HomePage = () => {
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [memberStats, setMemberStats] = useState({ total: 0, approved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
    
    // Real-time subscriptions
    const eventsSubscription = eventService.subscribeToEvents(() => {
      loadRecentEvents();
    });

    return () => {
      eventsSubscription.unsubscribe();
    };
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    await Promise.all([
      loadTodaysBirthdays(),
      loadRecentEvents(),
      loadMemberStats()
    ]);
    setLoading(false);
  };

  const loadTodaysBirthdays = async () => {
    const birthdays = await birthdayWishService.getTodaysBirthdays();
    setTodaysBirthdays(birthdays.slice(0, 3)); // Show only 3 on homepage
  };

  const loadRecentEvents = async () => {
    const events = await eventService.getAllEvents();
    setRecentEvents(events.slice(0, 4)); // Show only 4 recent events
  };

  const loadMemberStats = async () => {
    const stats = await memberService.getMemberStats();
    setMemberStats(stats);
  };

  if (loading) {
    return (
      <div className="homepage-container">
        <div className="loading">समुदाय की जानकारी लोड हो रही है...</div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section animate-slideInDown">
        <div className="hero-content">
          <h1>🏛️ सोनी समाज उदयपुर</h1>
          <p>हमारी संस्कृति, हमारी पहचान</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{memberStats.total}</span>
              <span className="stat-label">कुल सदस्य</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{memberStats.approved}</span>
              <span className="stat-label">सक्रिय सदस्य</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{todaysBirthdays.length}</span>
              <span className="stat-label">आज के जन्मदिन</span>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Birthdays Section */}
      {todaysBirthdays.length > 0 && (
        <section className="birthdays-section animate-fadeInUp">
          <div className="section-header">
            <h2>🎂 आज के जन्मदिन</h2>
            <a href="/events/todays-birthday" className="view-all-link">
              सभी देखें →
            </a>
          </div>
          <div className="birthdays-grid">
            {todaysBirthdays.map((member) => (
              <div key={member.id} className="birthday-card">
                <div className="member-photo">
                  {member.profile_picture_url ? (
                    <img src={member.profile_picture_url} alt={member.full_name} />
                  ) : (
                    <div className="photo-placeholder">
                      {member.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3>{member.full_name}</h3>
                <p>🎉 जन्मदिन मुबारक!</p>
                <a href="/events/todays-birthday" className="btn-primary">
                  बधाई दें
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Events Section */}
      <section className="events-section animate-fadeInUp">
        <div className="section-header">
          <h2>📰 समुदाय समाचार</h2>
          <a href="/events" className="view-all-link">
            सभी समाचार →
          </a>
        </div>
        
        {recentEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📰</div>
            <h3>कोई समाचार नहीं</h3>
            <p>अभी तक कोई समाचार प्रकाशित नहीं हुआ है</p>
          </div>
        ) : (
          <div className="events-grid">
            {recentEvents.map((event) => (
              <div key={event.id} className={`event-card ${event.type}`}>
                <div className="event-header">
                  <span className="event-type">
                    {event.type === 'badhai' ? '🎉 बधाई' : 
                     event.type === 'shok' ? '🕯️ शोक' : '📢 सूचना'}
                  </span>
                  <span className="event-date">
                    {new Date(event.created_at).toLocaleDateString('hi-IN')}
                  </span>
                </div>
                <h3>{event.title}</h3>
                <p>{event.description.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions-section animate-fadeInUp">
        <h2>त्वरित सेवाएं</h2>
        <div className="actions-grid">
          <a href="/register" className="action-card">
            <div className="action-icon">👤</div>
            <h3>सदस्यता पंजीकरण</h3>
            <p>नए सदस्य बनें</p>
          </a>
          
          <a href="/events/todays-birthday" className="action-card">
            <div className="action-icon">🎂</div>
            <h3>जन्मदिन की बधाई</h3>
            <p>बधाई संदेश भेजें</p>
          </a>
          
          <a href="/contact" className="action-card">
            <div className="action-icon">📞</div>
            <h3>संपर्क करें</h3>
            <p>सुझाव या शिकायत</p>
          </a>
          
          <a href="/sangathan" className="action-card">
            <div className="action-icon">🏛️</div>
            <h3>संगठन</h3>
            <p>समाज संरचना</p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;