import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase/config';
import './FastHomePage.css';

const FastHomePage = () => {
  const [data, setData] = useState({
    birthdays: [],
    events: [],
    stats: { total: 0, approved: 0 }
  });
  const [loading, setLoading] = useState(true);

  // Optimized data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        const [birthdaysRes, eventsRes, membersRes] = await Promise.all([
          supabase.from('members').select('id, full_name, profile_picture_url').eq('registration_status', 'approved').limit(3),
          supabase.from('events').select('*').order('created_at', { ascending: false }).limit(4),
          supabase.from('members').select('registration_status')
        ]);

        const stats = {
          total: membersRes.data?.length || 0,
          approved: membersRes.data?.filter(m => m.registration_status === 'approved').length || 0
        };

        setData({
          birthdays: birthdaysRes.data || [],
          events: eventsRes.data || [],
          stats
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Memoized components for performance
  const StatsSection = useMemo(() => (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-number">{data.stats.total}</span>
        <span className="stat-label">कुल सदस्य</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{data.stats.approved}</span>
        <span className="stat-label">सक्रिय सदस्य</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{data.birthdays.length}</span>
        <span className="stat-label">आज के जन्मदिन</span>
      </div>
    </div>
  ), [data.stats, data.birthdays.length]);

  if (loading) {
    return (
      <div className="fast-homepage">
        <div className="loading-spinner">लोड हो रहा है...</div>
      </div>
    );
  }

  return (
    <div className="fast-homepage">
      {/* Hero Section */}
      <section className="hero">
        <h1>🏛️ सोनी समाज उदयपुर</h1>
        <p>हमारी संस्कृति, हमारी पहचान</p>
        {StatsSection}
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <a href="/register" className="action-btn">
          👤 सदस्यता पंजीकरण
        </a>
        <a href="/events/todays-birthday" className="action-btn">
          🎂 जन्मदिन की बधाई
        </a>
        <a href="/contact" className="action-btn">
          📞 संपर्क करें
        </a>
        <a href="/events" className="action-btn">
          📰 समाचार देखें
        </a>
      </section>

      {/* Recent Events */}
      {data.events.length > 0 && (
        <section className="events">
          <h2>📰 समुदाय समाचार</h2>
          <div className="events-grid">
            {data.events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-type">
                  {event.type === 'badhai' ? '🎉' : event.type === 'shok' ? '🕯️' : '📢'}
                </div>
                <h3>{event.title}</h3>
                <p>{event.description.substring(0, 80)}...</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FastHomePage;