import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import './EventsPages.css';

const KulDevtaPage = () => {
  const [kulDevtas, setKulDevtas] = useState([
    {
      id: 1,
      adminUser: 'sonisamajudaipur',
      timeAgo: '1d',
      devtaName: 'Shri Eklingji Maharaj',
      location: 'Eklingji, Udaipur, Rajasthan',
      mainImage: '/eklingji-temple.jpg',
      secondaryImage: '/eklingji-deity.jpg',
      description: 'Shri Eklingji is the ruling deity of Mewar and holds special significance for the Soni community. This ancient temple complex is a sacred pilgrimage site where devotees seek blessings for prosperity and protection.',
      gotras: ['Kashyap', 'Bharadwaj', 'Gautam'],
      establishedYear: '734 AD',
      significance: 'Family Deity',
      likes: 456,
      shares: 23,
      isLiked: true
    },
    {
      id: 2,
      adminUser: 'sonisamajudaipur',
      timeAgo: '2d',
      devtaName: 'Shri Nathdwara Ji',
      location: 'Nathdwara, Rajsamand, Rajasthan',
      mainImage: '/nathdwara-temple.jpg',
      secondaryImage: '/shrinathji-deity.jpg',
      description: 'Shrinathji at Nathdwara is revered as the Kul Devta by many Soni families. The temple is famous for its beautiful architecture and the divine presence of Lord Krishna in his child form.',
      gotras: ['Agastya', 'Vishwamitra', 'Jamadagni'],
      establishedYear: '1672 AD',
      significance: 'Ancestral Deity',
      likes: 512,
      shares: 31,
      isLiked: false
    },
    {
      id: 3,
      adminUser: 'sonisamajudaipur',
      timeAgo: '3d',
      devtaName: 'Mata Ambika Devi',
      location: 'Jagat, Udaipur, Rajasthan',
      mainImage: '/ambika-temple.jpg',
      secondaryImage: '/ambika-mata.jpg',
      description: 'Mata Ambika at Jagat is worshipped as the Kul Devi by several Soni gotras. This ancient temple, known for its exquisite stone carvings, is considered the Khajuraho of Rajasthan.',
      gotras: ['Vashishtha', 'Atri', 'Angiras'],
      establishedYear: '10th Century',
      significance: 'Kul Devi',
      likes: 389,
      shares: 19,
      isLiked: true
    },
    {
      id: 4,
      adminUser: 'sonisamajudaipur',
      timeAgo: '4d',
      devtaName: 'Shri Rishabdeo Ji',
      location: 'Dhulev, Udaipur, Rajasthan',
      mainImage: '/rishabdeo-temple.jpg',
      secondaryImage: '/rishabdeo-statue.jpg',
      description: 'Lord Rishabdeo (Adinath) is the first Tirthankara of Jainism and is revered as Kul Devta by many Soni families. The black stone idol is believed to be very ancient and miraculous.',
      gotras: ['Kaushik', 'Galav', 'Mudgal'],
      establishedYear: '15th Century',
      significance: 'Spiritual Guide',
      likes: 298,
      shares: 15,
      isLiked: false
    }
  ]);

  const handleLike = (devtaId) => {
    setKulDevtas(kulDevtas.map(devta => {
      if (devta.id === devtaId) {
        return {
          ...devta,
          isLiked: !devta.isLiked,
          likes: devta.isLiked ? devta.likes - 1 : devta.likes + 1
        };
      }
      return devta;
    }));
  };

  const handleShare = (devta) => {
    if (navigator.share) {
      navigator.share({
        title: devta.devtaName,
        text: devta.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="events-page admin-posts clean-ui kul-devta-page">
      <PageHeader 
        title="🏛️ Kul Devta - Our Sacred Heritage" 
        subtitle="Preserving the spiritual legacy and ancestral deities of our community" 
      />

      <div className="events-container-full">
        <div className="events-feed-centered">
          {kulDevtas.map(devta => (
            <div key={devta.id} className="admin-post-card-clean kul-devta-card">
              <div className="admin-post-header-clean">
                <div className="admin-info">
                  <div className="admin-avatar">
                    <img src="/soni-samaj-logo.jpg" alt="Soni Samaj" />
                  </div>
                  <div className="admin-details">
                    <h4 className="admin-username">{devta.adminUser}</h4>
                    <span className="post-time">{devta.timeAgo}</span>
                  </div>
                </div>
                <div className="verified-badge">🕉️</div>
              </div>

              <div className="admin-post-content">
                <div className="post-title-section-clean">
                  <h2 className="post-main-title">{devta.devtaName}</h2>
                  <h3 className="post-subtitle">📍 {devta.location}</h3>
                </div>

                <div className="post-images-clean">
                  <div className="main-image">
                    <img src={devta.mainImage} alt={devta.devtaName} />
                  </div>
                  <div className="secondary-image">
                    <img src={devta.secondaryImage} alt="Deity Image" />
                  </div>
                </div>

                <div className="post-description-clean">
                  <div className="kul-devta-info">
                    <div className="devta-details">
                      <div className="detail-row">
                        <span className="detail-label">🏛️ Established:</span>
                        <span className="detail-value">{devta.establishedYear}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">⭐ Significance:</span>
                        <span className="detail-value">{devta.significance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="gotras-section">
                    <h4 className="gotras-title">🔱 Associated Gotras:</h4>
                    <div className="gotras-list">
                      {devta.gotras.map((gotra, index) => (
                        <span key={index} className="gotra-badge">
                          {gotra}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="devta-description">{devta.description}</p>
                </div>
              </div>

              <div className="admin-post-actions-clean">
                <div className="action-buttons-clean">
                  <button 
                    className={`action-btn-clean like-btn ${devta.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(devta.id)}
                  >
                    <span className="action-icon">🙏</span>
                  </button>
                  
                  <button 
                    className="action-btn-clean share-btn"
                    onClick={() => handleShare(devta)}
                  >
                    <span className="action-icon">📤</span>
                  </button>
                  
                  <button className="action-btn-clean bookmark-btn">
                    <span className="action-icon">🔖</span>
                  </button>
                </div>

                <div className="post-stats-clean">
                  <span className="likes-count">{devta.likes.toLocaleString()} devotees</span>
                  <span className="shares-count">{devta.shares} shares</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KulDevtaPage;