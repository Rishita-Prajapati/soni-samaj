import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import './FastBirthdays.css';

const FastBirthdays = () => {
  const [birthdays, setBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [wishes, setWishes] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [wishForm, setWishForm] = useState({ name: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    loadBirthdayData();
    
    // Real-time subscription for member changes
    const subscription = supabase
      .channel('members-birthdays')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, loadBirthdayData)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadBirthdayData = async () => {
    try {
      // Get today's birthdays from database
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      
      const { data: todaysBirthdays } = await supabase
        .from('birthday_events')
        .select('*')
        .eq('is_active', true)
        .like('birth_date', `%-${month}-${day}`);
      
      // Get upcoming birthdays (next 7 days) - simplified for now
      const { data: upcomingBirthdays } = await supabase
        .from('birthday_events')
        .select('*')
        .eq('is_active', true)
        .order('birth_date');
      
      setBirthdays(todaysBirthdays || []);
      setUpcomingBirthdays(upcomingBirthdays || []);
    } catch (error) {
      console.error('Error loading birthday data:', error);
      // Use mock data as fallback
      const mockTodaysBirthdays = [
        {
          id: 1,
          person_name: 'Rajesh Kumar Soni',
          birth_date: new Date().toISOString().split('T')[0],
          age: 45,
          mobile_number: '9876543210'
        },
        {
          id: 2,
          person_name: 'Priya Soni',
          birth_date: new Date().toISOString().split('T')[0],
          age: 28,
          mobile_number: '9876543211'
        }
      ];
      
      const mockUpcomingBirthdays = [
        {
          id: 3,
          person_name: 'Suresh Kumar Soni',
          birth_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          age: 35,
          mobile_number: '9876543212',
          daysUntil: 2
        }
      ];
      
      setBirthdays(mockTodaysBirthdays);
      setUpcomingBirthdays(mockUpcomingBirthdays);
    } finally {
      setLoading(false);
    }
  };

  const loadWishes = async (memberId) => {
    try {
      const { data: wishes } = await supabase
        .from('wishes')
        .select('*')
        .eq('member_id', memberId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      setWishes(wishes || []);
    } catch (error) {
      console.error('Error loading wishes:', error);
      // Mock wishes as fallback
      setWishes([
        {
          id: 1,
          sender_name: 'Community Member',
          message: 'जन्मदिन की हार्दिक शुभकामनाएं! आपका जीवन खुशियों से भरा रहे।',
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const sendWish = async (e) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;

    try {
      const { error } = await supabase
        .from('wishes')
        .insert({
          member_id: selectedMember.id,
          sender_name: wishForm.name,
          message: wishForm.message,
          is_approved: true
        });

      if (!error) {
        setWishForm({ name: '', message: '' });
        loadWishes(selectedMember.id);
        alert('बधाई संदेश भेजा गया!');
      } else {
        alert('त्रुटि हुई, पुनः प्रयास करें।');
      }
    } catch (error) {
      alert('त्रुटि हुई, पुनः प्रयास करें।');
    }
  };

  const selectMember = (member) => {
    setSelectedMember(member);
    loadWishes(member.id);
    
    // Real-time subscription for wishes
    const wishesSubscription = supabase
      .channel(`wishes-${member.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'wishes',
        filter: `member_id=eq.${member.id}`
      }, () => loadWishes(member.id))
      .subscribe();

    return () => {
      wishesSubscription.unsubscribe();
    };
  };

  if (loading) {
    return <div className="fast-birthdays"><div className="loading">लोड हो रहा है...</div></div>;
  }

  return (
    <div className="fast-birthdays">
      <div className="header">
        <h1>🎂 Birthday Celebrations</h1>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Today ({birthdays.length})
          </button>
          <button 
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({upcomingBirthdays.length})
          </button>
        </div>
      </div>

      {activeTab === 'today' && (
        <div className="birthday-section">
          {birthdays.length === 0 ? (
            <div className="no-birthdays">
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎂</div>
              <h2>No Birthdays Today</h2>
              <p>Check back tomorrow or view upcoming birthdays!</p>
            </div>
          ) : (
            <div className="birthdays-grid">
              {birthdays.map((member) => (
                <div 
                  key={member.id} 
                  className={`birthday-card ${selectedMember?.id === member.id ? 'selected' : ''}`}
                  onClick={() => selectMember(member)}
                >
                  <div className="photo">
                    {member.profile_picture_url ? (
                      <img src={member.profile_picture_url} alt={member.person_name} />
                    ) : (
                      <div className="placeholder">{member.person_name.charAt(0)}</div>
                    )}
                  </div>
                  <h3>{member.person_name}</h3>
                  <p>🎉 Happy Birthday!</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="birthday-section">
          {upcomingBirthdays.length === 0 ? (
            <div className="no-birthdays">
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📅</div>
              <h2>No Upcoming Birthdays</h2>
              <p>No birthdays in the next 7 days</p>
            </div>
          ) : (
            <div className="birthdays-grid">
              {upcomingBirthdays.map((member) => (
                <div 
                  key={member.id} 
                  className="birthday-card upcoming"
                >
                  <div className="photo">
                    {member.profile_picture_url ? (
                      <img src={member.profile_picture_url} alt={member.person_name} />
                    ) : (
                      <div className="placeholder">{member.person_name.charAt(0)}</div>
                    )}
                  </div>
                  <h3>{member.person_name}</h3>
                  <p>📅 In {member.daysUntil} day{member.daysUntil > 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedMember && (
        <div className="wish-section">
          <h2>{selectedMember.person_name} को बधाई दें</h2>
          
          <form onSubmit={sendWish} className="wish-form">
            <input
              type="text"
              placeholder="आपका नाम"
              value={wishForm.name}
              onChange={(e) => setWishForm({...wishForm, name: e.target.value})}
              required
            />
            <textarea
              placeholder="बधाई संदेश..."
              value={wishForm.message}
              onChange={(e) => setWishForm({...wishForm, message: e.target.value})}
              required
            />
            <button type="submit">बधाई भेजें</button>
          </form>

          <div className="wishes-list">
            <h3>बधाई संदेश ({wishes.length})</h3>
            {wishes.map((wish) => (
              <div key={wish.id} className="wish-item">
                <strong>{wish.sender_name}</strong>
                <p>{wish.message}</p>
                <small>{new Date(wish.created_at).toLocaleDateString('hi-IN')}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FastBirthdays;