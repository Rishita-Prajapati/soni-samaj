import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import './EventsPages.css';
import eventsService from '../services/eventsService';

const TodaysBirthday = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBirthdayEvents = async () => {
      try {
        const result = await eventsService.getBirthdayEvents();
        if (result.success) {
          const formattedPosts = result.data.map(event => ({
            id: event.id,
            adminUser: 'sonisamajudaipur',
            timeAgo: getTimeAgo(event.created_at),
            title: 'Happy Birthday! 🎂',
            subtitle: `Celebrating ${event.birthday_person_name} - ${event.age_completing} years of joy 🔥`,
            mainImage: event.photo_url && event.photo_url.trim() !== '' ? event.photo_url : '/birthday1.jpg',
            secondaryImage: event.photo_url && event.photo_url.trim() !== '' ? event.photo_url : '/birthday-celebration1.jpg',
            hasCustomImage: !!(event.photo_url && event.photo_url.trim() !== ''),
            description: `Wishing a very Happy Birthday to our beloved community member ${event.birthday_person_name}! May this new year of life bring you happiness, good health, and prosperity. Celebrate and enjoy your special day!`,
            likes: Math.floor(Math.random() * 500) + 100,
            shares: Math.floor(Math.random() * 30) + 5,
            isLiked: false,
            birthdayPerson: event.birthday_person_name,
            age: event.age_completing?.toString() || 'N/A',
            dateOfBirth: event.date_of_birth,
            address: event.current_address,
            mobile: event.mobile_number
          }));
          setPosts(formattedPosts);
        }
      } catch (error) {
        console.error('Error loading birthday events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBirthdayEvents();
  }, []);

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffInHours = Math.floor((now - eventDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="events-page admin-posts clean-ui birthday-page">
        <PageHeader 
          title="🎂 Today's Birthday - Celebrations" 
          subtitle="Loading birthday celebrations..." 
        />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
          <p>Loading birthday events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page admin-posts clean-ui birthday-page">
      <PageHeader 
        title="🎂 Today's Birthday - Celebrations" 
        subtitle="Celebrating special moments and milestones with our community family" 
      />

      <div className="events-container-full">
        <div className="events-feed-centered">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px', margin: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎂</div>
              <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>No Birthday Events Yet</h2>
              <p style={{ color: '#6b7280' }}>Birthday celebrations will appear here!</p>
            </div>
          ) : (
            posts.map(post => (
            <div key={post.id} className="admin-post-card-clean birthday-card">
              <div className="admin-post-header-clean">
                <div className="admin-info">
                  <div className="admin-avatar">
                    <img src="/soni-samaj-logo.jpg" alt="Soni Samaj" />
                  </div>
                  <div className="admin-details">
                    <h4 className="admin-username">{post.adminUser}</h4>
                    <span className="post-time">{post.timeAgo}</span>
                  </div>
                </div>
                <div className="verified-badge">✓</div>
              </div>

              <div className="admin-post-content">
                <div className="post-title-section-clean">
                  <h2 className="post-main-title">{post.title}</h2>
                  <h3 className="post-subtitle">{post.subtitle}</h3>
                </div>

                <div className="post-images-clean">
                  <div className="main-image">
                    <img src={post.mainImage} alt={post.title} />
                  </div>
                  {post.hasCustomImage ? (
                    <div className="secondary-image">
                      <img src={post.secondaryImage} alt="Birthday Celebration" />
                    </div>
                  ) : (
                    <div className="secondary-image">
                      <img src="/birthday-celebration1.jpg" alt="Birthday Celebration" />
                    </div>
                  )}
                </div>

                <div className="post-description-clean">
                  <div className="birthday-person-info">
                    <div className="birthday-cake">🎂</div>
                    <div className="person-details">
                      <div className="person-name">{post.birthdayPerson}</div>
                      <div className="person-age">{post.age} years old</div>
                    </div>
                  </div>
                  <p>{post.description}</p>
                </div>
              </div>

              <div className="admin-post-actions-clean">
                <div className="action-buttons-clean">
                  <button 
                    className={`action-btn-clean like-btn ${post.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <span className="action-icon">🎉</span>
                  </button>
                  
                  <button 
                    className="action-btn-clean share-btn"
                    onClick={() => handleShare(post)}
                  >
                    <span className="action-icon">📤</span>
                  </button>
                  
                  <button className="action-btn-clean bookmark-btn">
                    <span className="action-icon">🔖</span>
                  </button>
                </div>

                <div className="post-stats-clean">
                  <span className="likes-count">{post.likes.toLocaleString()} wishes</span>
                  <span className="shares-count">{post.shares} shares</span>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodaysBirthday;