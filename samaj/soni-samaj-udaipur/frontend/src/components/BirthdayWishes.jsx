import React, { useState, useEffect } from 'react';
import { birthdayWishService } from '../services/birthdayWishService';
import './BirthdayWishes.css';

const BirthdayWishes = () => {
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState({
    senderName: '',
    message: ''
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadTodaysBirthdays();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      loadWishes(selectedMember.id);
      
      // Subscribe to real-time wishes
      const subscription = birthdayWishService.subscribeToWishes(
        selectedMember.id,
        () => loadWishes(selectedMember.id)
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedMember]);

  const loadTodaysBirthdays = async () => {
    setLoading(true);
    const birthdays = await birthdayWishService.getTodaysBirthdays();
    setTodaysBirthdays(birthdays);
    setLoading(false);
  };

  const loadWishes = async (memberId) => {
    const memberWishes = await birthdayWishService.getWishesForMember(memberId);
    setWishes(memberWishes);
  };

  const handleSendWish = async (e) => {
    e.preventDefault();
    if (!newWish.senderName.trim() || !newWish.message.trim()) return;

    setSending(true);
    const result = await birthdayWishService.sendBirthdayWish({
      memberId: selectedMember.id,
      senderName: newWish.senderName,
      message: newWish.message
    });

    if (result.success) {
      setNewWish({ senderName: '', message: '' });
      if (result.moderated) {
        alert('आपका संदेश भेजा गया है और समीक्षा के बाद प्रदर्शित होगा।');
      } else {
        // Confetti animation trigger
        triggerConfetti();
      }
    } else {
      alert('संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    }
    setSending(false);
  };

  const triggerConfetti = () => {
    // Simple confetti effect
    const confetti = document.createElement('div');
    confetti.className = 'confetti-container';
    confetti.innerHTML = '🎉🎊✨🎈🎁';
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      document.body.removeChild(confetti);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="birthday-wishes-container">
        <div className="loading">लोड हो रहा है...</div>
      </div>
    );
  }

  return (
    <div className="birthday-wishes-container">
      <div className="birthday-header">
        <h1>🎂 आज के जन्मदिन</h1>
        <p>आज के जन्मदिन मनाने वाले सदस्यों को बधाई दें</p>
      </div>

      {todaysBirthdays.length === 0 ? (
        <div className="no-birthdays">
          <p>आज कोई जन्मदिन नहीं है</p>
        </div>
      ) : (
        <div className="birthdays-grid">
          {todaysBirthdays.map((member) => (
            <div 
              key={member.id} 
              className={`birthday-card ${selectedMember?.id === member.id ? 'selected' : ''}`}
              onClick={() => setSelectedMember(member)}
            >
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
            </div>
          ))}
        </div>
      )}

      {selectedMember && (
        <div className="wishes-section">
          <h2>{selectedMember.full_name} को बधाई दें</h2>
          
          <form onSubmit={handleSendWish} className="wish-form">
            <input
              type="text"
              placeholder="आपका नाम"
              value={newWish.senderName}
              onChange={(e) => setNewWish({...newWish, senderName: e.target.value})}
              required
            />
            <textarea
              placeholder="जन्मदिन की बधाई संदेश..."
              value={newWish.message}
              onChange={(e) => setNewWish({...newWish, message: e.target.value})}
              required
            />
            <button type="submit" disabled={sending}>
              {sending ? 'भेजा जा रहा है...' : 'बधाई भेजें'}
            </button>
          </form>

          <div className="wishes-list">
            <h3>बधाई संदेश ({wishes.length})</h3>
            {wishes.map((wish) => (
              <div key={wish.id} className="wish-item">
                <div className="wish-header">
                  <strong>{wish.sender_name}</strong>
                  <span className="wish-time">
                    {new Date(wish.created_at).toLocaleString('hi-IN')}
                  </span>
                </div>
                <p>{wish.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayWishes;