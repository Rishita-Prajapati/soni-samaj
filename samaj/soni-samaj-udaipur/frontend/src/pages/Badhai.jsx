import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import './EventsPages.css';
import eventsService from '../services/eventsService';

const Badhai = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadhaiEvents = async () => {
      try {
        const result = await eventsService.getBadhaiEvents();
        if (result.success) {
          const formattedPosts = result.data.map(event => ({
            id: event.id,
            adminUser: 'sonisamajudaipur',
            timeAgo: getTimeAgo(event.created_at),
            title: event.title,
            subtitle: `${event.occasion_type} - ${event.celebration_person_name}`,
            mainImage: event.image_url || '/wedding-main.jpg',
            secondaryImage: event.image_url || '/wedding-celebration.jpg',
            hasCustomImage: !!event.image_url,
            description: event.additional_notes || `Celebrating ${event.occasion_type} of ${event.celebration_person_name}`,
            eventDate: event.event_date,
            location: event.location,
            contactNumber: event.contact_number,
            likes: Math.floor(Math.random() * 1000) + 100,
            shares: Math.floor(Math.random() * 50) + 10,
            isLiked: false,
            category: 'Badhai'
          }));
          setPosts(formattedPosts);
        }
      } catch (error) {
        console.error('Error loading badhai events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBadhaiEvents();
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
      <div className="events-page admin-posts clean-ui">
        <PageHeader 
          title="🎉 Badhai - Celebrations" 
          subtitle="Loading celebrations..." 
        />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
          <p>Loading badhai events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page admin-posts clean-ui">
      <PageHeader 
        title="🎉 Badhai - Celebrations" 
        subtitle="Official community celebrations and happy moments" 
      />

      <div className="events-container-full">
        <div className="events-feed-centered">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px', margin: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉</div>
              <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>No Badhai Events Yet</h2>
              <p style={{ color: '#6b7280' }}>Check back soon for community celebrations!</p>
            </div>
          ) : (
            posts.map(post => (
            <div key={post.id} className="admin-post-card-clean">
              {/* Admin Post Header */}
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

              {/* Post Content */}
              <div className="admin-post-content">
                {/* Title Section */}
                <div className="post-title-section-clean">
                  <h2 className="post-main-title">{post.title}</h2>
                  <h3 className="post-subtitle">{post.subtitle}</h3>
                </div>

                {/* Image Section */}
                <div className="post-images-clean">
                  <div className="main-image">
                    <img src={post.mainImage} alt={post.title} />
                  </div>
                  {post.hasCustomImage ? (
                    <div className="secondary-image">
                      <img src={post.secondaryImage} alt="Celebration" />
                    </div>
                  ) : (
                    <div className="secondary-image">
                      <img src="/wedding-celebration.jpg" alt="Celebration" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="post-description-clean">
                  <p>{post.description}</p>
                </div>
              </div>

              {/* Post Actions - Simplified */}
              <div className="admin-post-actions-clean">
                <div className="action-buttons-clean">
                  <button 
                    className={`action-btn-clean like-btn ${post.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <span className="action-icon">{post.isLiked ? '❤️' : '🤍'}</span>
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
                  <span className="likes-count">{post.likes.toLocaleString()} likes</span>
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

export default Badhai;