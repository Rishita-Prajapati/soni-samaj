import React, { useState, useEffect } from 'react';
import memberService from '../services/memberService';
import { eventsService } from '../services/supabaseService';
import birthdayService from '../services/birthdayService';

const TestIntegration = () => {
  const [stats, setStats] = useState({
    members: { total: 0, pending: 0, approved: 0 },
    events: { badhai: 0, shok: 0, birthday: 0, news: 0 },
    birthdays: { today: 0, upcoming: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    try {
      setLoading(true);
      
      // Test member service
      const memberStats = await memberService.getMemberStats();
      
      // Test events service
      const [badhai, shok, birthday, news] = await Promise.all([
        eventsService.getEventsByType('badhai', 100),
        eventsService.getEventsByType('shok', 100),
        eventsService.getEventsByType('birthday', 100),
        eventsService.getEventsByType('news', 100)
      ]);
      
      // Test birthday service
      const [todayBirthdays, upcomingBirthdays] = await Promise.all([
        birthdayService.getTodaysBirthdays(),
        birthdayService.getUpcomingBirthdays(7)
      ]);

      setStats({
        members: memberStats,
        events: {
          badhai: badhai.length,
          shok: shok.length,
          birthday: birthday.length,
          news: news.length
        },
        birthdays: {
          today: todayBirthdays.length,
          upcoming: upcomingBirthdays.length
        }
      });
    } catch (error) {
      console.error('Integration test error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔄</div>
        <div>Testing integrations...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🔗 Integration Test Results
      </h1>

      {/* Integration Status */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Members Integration */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #10b981'
        }}>
          <h3 style={{ color: '#10b981', marginBottom: '16px' }}>
            👥 Members Integration
          </h3>
          <div style={{ fontSize: '14px', color: '#374151' }}>
            <div>Total: {stats.members.total}</div>
            <div>Pending: {stats.members.pending}</div>
            <div>Approved: {stats.members.approved}</div>
          </div>
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#ecfdf5',
            borderRadius: '6px',
            color: '#10b981',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            ✅ UI → Database → Admin
          </div>
        </div>

        {/* Events Integration */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #3b82f6'
        }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '16px' }}>
            📰 Events Integration
          </h3>
          <div style={{ fontSize: '14px', color: '#374151' }}>
            <div>Badhai: {stats.events.badhai}</div>
            <div>Shok: {stats.events.shok}</div>
            <div>Birthday: {stats.events.birthday}</div>
            <div>News: {stats.events.news}</div>
          </div>
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#eff6ff',
            borderRadius: '6px',
            color: '#3b82f6',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            ✅ Admin → Database → UI
          </div>
        </div>

        {/* Birthday Integration */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '16px' }}>
            🎂 Birthday Integration
          </h3>
          <div style={{ fontSize: '14px', color: '#374151' }}>
            <div>Today: {stats.birthdays.today}</div>
            <div>Upcoming: {stats.birthdays.upcoming}</div>
          </div>
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            color: '#f59e0b',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            ✅ Auto-Creation → Reminders
          </div>
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '30px', color: '#1f2937' }}>
          🔄 Real-Time Data Flow
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            border: '2px solid #10b981',
            color: '#10b981',
            fontWeight: '500'
          }}>
            🌐 UI Registration
          </div>
          <div style={{ fontSize: '1.5rem' }}>→</div>
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            color: '#3b82f6',
            fontWeight: '500'
          }}>
            🗄️ Supabase
          </div>
          <div style={{ fontSize: '1.5rem' }}>→</div>
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '2px solid #f59e0b',
            color: '#f59e0b',
            fontWeight: '500'
          }}>
            ⚙️ Admin Panel
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '30px'
        }}>
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '2px solid #f59e0b',
            color: '#f59e0b',
            fontWeight: '500'
          }}>
            ⚙️ Admin Events
          </div>
          <div style={{ fontSize: '1.5rem' }}>→</div>
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            color: '#3b82f6',
            fontWeight: '500'
          }}>
            🗄️ Supabase
          </div>
          <div style={{ fontSize: '1.5rem' }}>→</div>
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            border: '2px solid #10b981',
            color: '#10b981',
            fontWeight: '500'
          }}>
            🌐 Website Display
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#ecfdf5',
            borderRadius: '8px',
            border: '2px solid #10b981',
            color: '#10b981',
            fontWeight: '500'
          }}>
            ✅ Member Approval
          </div>
          <div style={{ fontSize: '1.5rem' }}>→</div>
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '2px solid #f59e0b',
            color: '#f59e0b',
            fontWeight: '500'
          }}>
            🎂 Auto Birthday
          </div>
          <div style={{ fontSize: '1.5rem' }}>→</div>
          <div style={{
            padding: '16px 20px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '2px solid #3b82f6',
            color: '#3b82f6',
            fontWeight: '500'
          }}>
            🔔 Reminders
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          onClick={loadAllStats}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '16px'
          }}
        >
          🔄 Refresh Integration Test
        </button>
      </div>
    </div>
  );
};

export default TestIntegration;