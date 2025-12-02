import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import './FastAdmin.css';

const FastAdmin = ({ admin, onLogout }) => {
  const [stats, setStats] = useState({ members: 0, events: 0, messages: 0 });
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', type: 'general' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [membersRes, eventsRes, messagesRes] = await Promise.all([
        supabase.from('members').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('id')
      ]);

      setMembers(membersRes.data || []);
      setEvents(eventsRes.data || []);
      setStats({
        members: membersRes.data?.length || 0,
        events: eventsRes.data?.length || 0,
        messages: messagesRes.data?.length || 0
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.description) return;

    try {
      await supabase.from('events').insert(newEvent);
      setNewEvent({ title: '', description: '', type: 'general' });
      loadData();
      alert('समाचार जोड़ा गया!');
    } catch (error) {
      alert('त्रुटि हुई।');
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('हटाना चाहते हैं?')) return;
    
    try {
      await supabase.from('events').delete().eq('id', id);
      loadData();
    } catch (error) {
      alert('त्रुटि हुई।');
    }
  };

  const updateMemberStatus = async (id, status) => {
    try {
      await supabase.from('members').update({ registration_status: status }).eq('id', id);
      loadData();
    } catch (error) {
      alert('त्रुटि हुई।');
    }
  };

  if (loading) {
    return <div className="fast-admin"><div className="loading">लोड हो रहा है...</div></div>;
  }

  return (
    <div className="fast-admin">
      {/* Header */}
      <header className="admin-header">
        <h1>🏛️ सोनी समाज प्रबंधन</h1>
        <div className="header-actions">
          <span>स्वागत, {admin.name}</span>
          <button onClick={onLogout} className="logout-btn">लॉगआउट</button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 डैशबोर्ड
        </button>
        <button 
          className={activeTab === 'members' ? 'active' : ''}
          onClick={() => setActiveTab('members')}
        >
          👥 सदस्य ({members.filter(m => m.registration_status === 'pending').length})
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          📰 समाचार ({events.length})
        </button>
      </nav>

      {/* Content */}
      <main className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>{stats.members}</h3>
                <p>कुल सदस्य</p>
              </div>
              <div className="stat-card">
                <h3>{stats.events}</h3>
                <p>कुल समाचार</p>
              </div>
              <div className="stat-card">
                <h3>{stats.messages}</h3>
                <p>कुल संदेश</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-section">
            <h2>सदस्य प्रबंधन</h2>
            <div className="members-list">
              {members.map((member) => (
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
                      <button onClick={() => updateMemberStatus(member.id, 'approved')}>
                        ✓ स्वीकार
                      </button>
                      <button onClick={() => updateMemberStatus(member.id, 'rejected')}>
                        ✗ अस्वीकार
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-section">
            <div className="create-event">
              <h2>नया समाचार जोड़ें</h2>
              <form onSubmit={createEvent}>
                <select 
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option value="general">सामान्य</option>
                  <option value="badhai">बधाई</option>
                  <option value="shok">शोक</option>
                </select>
                <input
                  type="text"
                  placeholder="शीर्षक"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  required
                />
                <textarea
                  placeholder="विवरण"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  required
                />
                <button type="submit">प्रकाशित करें</button>
              </form>
            </div>

            <div className="events-list">
              <h2>प्रकाशित समाचार</h2>
              {events.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <span className="event-type">{event.type}</span>
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className="delete-btn">
                    🗑️ हटाएं
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FastAdmin;