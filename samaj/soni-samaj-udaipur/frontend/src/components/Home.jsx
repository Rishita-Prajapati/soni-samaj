import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/config';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({ members: 0, events: 0, birthdays: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [membersRes, eventsRes] = await Promise.all([
        supabase.from('members').select('id').eq('registration_status', 'approved'),
        supabase.from('events').select('id')
      ]);
      
      setStats({
        members: membersRes.data?.length || 0,
        events: eventsRes.data?.length || 0,
        birthdays: 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Setup real-time subscriptions
  useEffect(() => {
    const membersSubscription = supabase
      .channel('members-home')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, loadStats)
      .subscribe();

    const eventsSubscription = supabase
      .channel('events-home')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, loadStats)
      .subscribe();

    return () => {
      membersSubscription.unsubscribe();
      eventsSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-overlay">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="welcome-title">
                स्वागत है<br />सोनी समाज में
              </h1>
              <p className="welcome-description">
                हमारे समुदाय से जुड़ें, कार्यक्रम साझा करें और विशेष अवसरों का जश्न मनाएं।
              </p>
            </div>
          </div>
        </div>
        <div className="hero-background">
          <div className="hero-avatars">
            <img src="/avatars.png" alt="Traditional Indian Couple" className="avatars-image" />
          </div>
          <div className="mandala-background">
            <img src="/Mandal.png" alt="" className="mandala-bg mandala-1" />
            <img src="/Mandal.png" alt="" className="mandala-bg mandala-2" />
            <img src="/Mandal.png" alt="" className="mandala-bg mandala-3" />
          </div>
        </div>
      </section>



      {/* Quick Links Section */}
      <section className="quick-links-section">
        <div className="container">
          <h2>त्वरित लिंक</h2>
          <div className="quick-links-grid">
            <div className="quick-link-card">
              <div className="card-icon">🏛️</div>
              <h3>संगठन</h3>
              <p>हमारे संगठन की संरचना और गतिविधियों के बारे में जानें</p>
              <Link to="/sangathan" className="card-btn">संगठन देखें</Link>
            </div>
            <div className="quick-link-card">
              <div className="card-icon">🎉</div>
              <h3>बधाई समाचार</h3>
              <p>समुदाय के साथ खुशी के पल और बधाई साझा करें</p>
              <Link to="/events/badhai" className="card-btn">बधाई देखें</Link>
            </div>
            <div className="quick-link-card">
              <div className="card-icon">🕯️</div>
              <h3>शोक समाचार</h3>
              <p>कठिन समय में संवेदना और सहायता साझा करें</p>
              <Link to="/events/shok-samachar" className="card-btn">शोक समाचार देखें</Link>
            </div>
            <div className="quick-link-card">
              <div className="card-icon">🎂</div>
              <h3>जन्मदिन की बधाई</h3>
              <p>समुदाय के सदस्यों को जन्मदिन की बधाई दें</p>
              <Link to="/events/todays-birthday" className="card-btn">बधाई भेजें</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;