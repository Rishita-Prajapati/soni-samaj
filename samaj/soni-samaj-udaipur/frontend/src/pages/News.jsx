import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import './EventsPages.css';
import eventsService from '../services/eventsService';

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewsEvents = async () => {
      try {
        const result = await eventsService.getNewsEvents();
        if (result.success) {
          const formattedPosts = result.data.map(event => ({
            id: event.id,
            adminUser: 'sonisamajudaipur',
            timeAgo: getTimeAgo(event.created_at),
            title: event.title,
            subtitle: event.news_headline,
            mainImage: event.image_url || '/news-main.jpg',
            secondaryImage: event.image_url || '/community-news.jpg',
            hasCustomImage: !!event.image_url,
            description: event.news_content,
            eventDate: event.event_date,
            location: event.location,
            category: event.news_category,
            contactNumber: event.contact_number,
            likes: Math.floor(Math.random() * 800) + 100,
            shares: Math.floor(Math.random() * 60) + 10,
            isLiked: false,
            priority: 'medium'
          }));
          setPosts(formattedPosts);
        }
      } catch (error) {
        console.error('Error loading news events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNewsEvents();
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
      <div className="events-page admin-posts clean-ui news-page">
        <PageHeader 
          title="📰 Community News & Updates" 
          subtitle="Loading news..." 
        />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
          <p>Loading community news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page admin-posts clean-ui news-page">
      <PageHeader 
        title="📰 Community News & Updates" 
        subtitle="Stay informed with the latest news and announcements from our community" 
      />

      <div className="events-container-full">
        <div className="events-feed-centered">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px', margin: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📰</div>
              <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>No News Yet</h2>
              <p style={{ color: '#6b7280' }}>Community news and updates will appear here</p>
            </div>
          ) : (
            posts.map(post => (
            <div key={post.id} className="admin-post-card-clean news-card">
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
                      <img src={post.secondaryImage} alt="News Update" />
                    </div>
                  ) : (
                    <div className="secondary-image">
                      <img src="/community-news.jpg" alt="News Update" />
                    </div>
                  )}
                </div>

                <div className="post-description-clean">
                  <div className="news-priority-badge">
                    <span className={`priority-indicator ${post.priority}`}>
                      {post.priority === 'high' ? '🔥 HIGH PRIORITY' : 
                       post.priority === 'medium' ? '⚡ MEDIUM PRIORITY' : 
                       '📌 NORMAL'}
                    </span>
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
                    <span className="action-icon">👍</span>
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
                  <span className="likes-count">{post.likes.toLocaleString()} reactions</span>
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

export default News;