import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';

const BirthdayDisplay = () => {
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [wishes, setWishes] = useState({});
  const [newWish, setNewWish] = useState({ senderName: '', message: '' });
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('birthday_events')
        .select('*')
        .eq('is_published', true)
        .eq('is_active', true);

      if (error) throw error;

      const today = new Date();
      const todaysEvents = [];
      const upcomingEvents = [];

      data?.forEach(event => {
        const birthDate = new Date(event.date_of_birth);
        const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        if (thisYearBirthday < today) {
          thisYearBirthday.setFullYear(today.getFullYear() + 1);
        }
        
        const diffTime = thisYearBirthday - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          todaysEvents.push(event);
        } else if (diffDays <= 7) {
          upcomingEvents.push({ ...event, daysUntil: diffDays });
        }
      });

      setTodaysBirthdays(todaysEvents);
      setUpcomingBirthdays(upcomingEvents);
    } catch (error) {
      console.error('Error loading birthdays:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishes = async (memberId) => {
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('member_id', memberId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWishes(prev => ({ ...prev, [memberId]: data || [] }));
    } catch (error) {
      console.error('Error loading wishes:', error);
    }
  };

  const sendWish = async (memberId) => {
    if (!newWish.senderName || !newWish.message) {
      alert('Please fill in both name and message');
      return;
    }

    try {
      const { error } = await supabase
        .from('wishes')
        .insert([{
          member_id: memberId,
          sender_name: newWish.senderName,
          message: newWish.message
        }]);

      if (error) throw error;
      
      setNewWish({ senderName: '', message: '' });
      loadWishes(memberId);
      alert('Birthday wish sent successfully!');
    } catch (error) {
      console.error('Error sending wish:', error);
      alert('Failed to send wish. Please try again.');
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const BirthdayCard = ({ member, isToday = false, daysUntil = 0 }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: isToday ? '3px solid #10b981' : '1px solid #e5e7eb',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {member.photo_url ? (
            <img
              src={member.photo_url}
              alt={member.birthday_person_name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <span style={{ fontSize: '32px', color: '#6b7280' }}>👤</span>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1f2937', fontSize: '18px' }}>
            {member.birthday_person_name}
          </h3>
          <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>
            Age: {member.age_completing || calculateAge(member.date_of_birth)} years
          </p>
          <p style={{ margin: '0 0 4px 0', color: '#6b7280', fontSize: '14px' }}>
            📞 {member.mobile_number}
          </p>
          {isToday && (
            <div style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'inline-block',
              marginTop: '8px'
            }}>
              🎉 Birthday Today!
            </div>
          )}
          {daysUntil > 0 && (
            <div style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'inline-block',
              marginTop: '8px'
            }}>
              🗓️ In {daysUntil} day{daysUntil > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {isToday && (
          <button
            onClick={() => {
              setSelectedMember(member);
              loadWishes(member.id);
            }}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Send Wish 🎂
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
        <p>Loading birthdays...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '20px auto', 
      padding: '20px',
      position: 'relative',
      zIndex: 1
    }}>
      <h1 style={{ textAlign: 'center', color: '#1f2937', marginBottom: '30px' }}>
        🎂 Birthday Celebrations
      </h1>

      {/* Today's Birthdays */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#10b981', marginBottom: '20px', fontSize: '24px' }}>
          🎉 Today's Birthdays ({todaysBirthdays.length})
        </h2>
        {todaysBirthdays.length > 0 ? (
          <div>
            {todaysBirthdays.map(member => (
              <BirthdayCard key={member.id} member={member} isToday={true} />
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
            <p>No birthdays today</p>
          </div>
        )}
      </div>

      {/* Upcoming Birthdays */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#3b82f6', marginBottom: '20px', fontSize: '24px' }}>
          🗓️ Upcoming Birthdays ({upcomingBirthdays.length})
        </h2>
        {upcomingBirthdays.length > 0 ? (
          <div>
            {upcomingBirthdays.map(member => (
              <BirthdayCard 
                key={member.id} 
                member={member} 
                daysUntil={member.daysUntil} 
              />
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
            <p>No upcoming birthdays in the next 7 days</p>
          </div>
        )}
      </div>

      {/* Birthday Wish Modal */}
      {selectedMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>
                🎂 Send Birthday Wish to {selectedMember.birthday_person_name}
              </h3>
              <button
                onClick={() => setSelectedMember(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            {/* Send New Wish */}
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '16px', color: '#374151' }}>Send Your Wish</h4>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Your Name</label>
                <input
                  type="text"
                  value={newWish.senderName}
                  onChange={(e) => setNewWish(prev => ({ ...prev, senderName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter your name"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Birthday Message</label>
                <textarea
                  value={newWish.message}
                  onChange={(e) => setNewWish(prev => ({ ...prev, message: e.target.value }))}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Write your birthday message..."
                />
              </div>
              <button
                onClick={() => sendWish(selectedMember.id)}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Send Wish 🎉
              </button>
            </div>

            {/* Existing Wishes */}
            <div>
              <h4 style={{ marginBottom: '16px', color: '#374151' }}>
                Birthday Wishes ({wishes[selectedMember.id]?.length || 0})
              </h4>
              {wishes[selectedMember.id]?.length > 0 ? (
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {wishes[selectedMember.id].map((wish, index) => (
                    <div key={index} style={{
                      backgroundColor: '#f3f4f6',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                        {wish.sender_name}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px' }}>
                        {wish.message}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
                        {new Date(wish.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
                  No wishes yet. Be the first to wish!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayDisplay;