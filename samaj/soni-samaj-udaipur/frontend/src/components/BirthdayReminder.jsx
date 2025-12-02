import React, { useState, useEffect } from 'react';
import birthdayService from '../services/birthdayService';

const BirthdayReminder = () => {
  const [birthdayReminders, setBirthdayReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBirthdays();
  }, []);

  const loadBirthdays = async () => {
    try {
      setLoading(true);
      const reminders = await birthdayService.getBirthdayReminders();
      setBirthdayReminders(reminders);
    } catch (error) {
      console.error('Error loading birthday reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Separate today's and upcoming birthdays
  const todaysBirthdays = birthdayReminders.filter(b => b.days_until_birthday === 0);
  const upcomingBirthdays = birthdayReminders.filter(b => b.days_until_birthday > 0);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>🎂 Loading birthdays...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Today's Birthdays */}
      {todaysBirthdays.length > 0 && (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#92400e', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎉 Today's Birthdays ({todaysBirthdays.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {todaysBirthdays.map((birthday) => (
              <div key={birthday.id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center',
                border: '2px solid #f59e0b'
              }}>
                {birthday.person_image_url && (
                  <img
                    src={birthday.person_image_url}
                    alt={birthday.person_name}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '12px',
                      border: '3px solid #f59e0b'
                    }}
                  />
                )}
                <div style={{
                  backgroundColor: '#fef3c7',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  marginBottom: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#92400e'
                }}>
                  {birthday.birthday_message}
                </div>
                <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
                  {birthday.person_name}
                </h3>
                <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
                  Family: {birthday.family_name}
                </p>
                <p style={{ margin: '0 0 8px 0', color: '#f59e0b', fontWeight: 'bold' }}>
                  Turning {birthday.age + 1} years old!
                </p>
                {birthday.contact_number && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                    📞 {birthday.contact_number}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Birthdays */}
      {upcomingBirthdays.length > 0 && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '2px solid #0ea5e9',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h2 style={{ color: '#0c4a6e', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Birthday Reminders (Next 7 Days)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {upcomingBirthdays.map((birthday) => (
              <div key={birthday.id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                {birthday.person_image_url && (
                  <img
                    src={birthday.person_image_url}
                    alt={birthday.person_name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '12px',
                      border: '2px solid #0ea5e9'
                    }}
                  />
                )}
                <div style={{
                  backgroundColor: '#e0f2fe',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  marginBottom: '12px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#0c4a6e'
                }}>
                  {birthday.birthday_message}
                </div>
                <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>
                  {birthday.person_name}
                </h3>
                <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
                  Family: {birthday.family_name}
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>
                  Birthday: {new Date(birthday.birth_date).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#0ea5e9', fontWeight: 'bold' }}>
                  Will turn {birthday.age + 1} years old
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Birthdays */}
      {birthdayReminders.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '2px dashed #d1d5db'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎂</div>
          <h3 style={{ color: '#6b7280', margin: '0 0 8px 0' }}>No Upcoming Birthdays</h3>
          <p style={{ color: '#9ca3af', margin: '0' }}>No birthdays in the next 7 days. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default BirthdayReminder;