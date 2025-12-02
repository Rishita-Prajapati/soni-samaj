import React from 'react';
import PageHeader from './PageHeader';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <PageHeader 
        title="About Soni Samaj Udaipur" 
        subtitle="स्वर्णकार समाज उदयपुर - A legacy of tradition, unity, and progress" 
      />

      {/* History Section */}
      <section className="history-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Rich History</h2>
            <div className="section-divider"></div>
          </div>
          <div className="history-content">
            <div className="history-text">
              <p>
                स्वर्णकार समाज उदयपुर has a proud heritage spanning over several decades. Our community 
                has been an integral part of Udaipur's cultural and economic landscape, contributing 
                significantly to the art of jewelry making and goldsmithing.
              </p>
              <p>
                Founded with the vision of preserving our ancient traditions while embracing modern 
                progress, our samaj has grown from a small group of artisans to a thriving community 
                of thousands of members. We have maintained our cultural identity while adapting to 
                changing times.
              </p>
              <p>
                Throughout our journey, we have celebrated countless festivals, supported members 
                during challenging times, and created opportunities for growth and development. 
                Our legacy continues through the dedication of our members and the values we uphold.
              </p>
            </div>
            <div className="history-timeline">
              <div className="timeline-item">
                <div className="timeline-year">1950s</div>
                <div className="timeline-content">
                  <h4>Foundation Era</h4>
                  <p>Establishment of the formal community organization</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">1980s</div>
                <div className="timeline-content">
                  <h4>Growth Period</h4>
                  <p>Expansion of membership and community activities</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2000s</div>
                <div className="timeline-content">
                  <h4>Modern Era</h4>
                  <p>Digital transformation and youth engagement</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">Present</div>
                <div className="timeline-content">
                  <h4>Current Day</h4>
                  <p>5000+ members strong and growing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To preserve and promote our rich cultural heritage while fostering unity, 
                growth, and prosperity among all members of the Soni Samaj Udaipur. We are 
                committed to supporting each other through social, cultural, and economic 
                initiatives that strengthen our community bonds.
              </p>
              <ul className="mission-points">
                <li>Preserve traditional craftsmanship and skills</li>
                <li>Support member welfare and development</li>
                <li>Promote cultural values and traditions</li>
                <li>Foster business and educational opportunities</li>
              </ul>
            </div>
            <div className="vision-card">
              <div className="card-icon">🔮</div>
              <h3>Our Vision</h3>
              <p>
                To be a model community that successfully bridges tradition with modernity, 
                creating a prosperous and united society where every member thrives while 
                maintaining our cultural identity and values for future generations.
              </p>
              <ul className="vision-points">
                <li>A digitally connected global community</li>
                <li>Economic empowerment for all members</li>
                <li>Cultural preservation for future generations</li>
                <li>Leadership in community development</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="photo-gallery-section">
        <div className="container">
          <div className="section-header">
            <h2>Photo Gallery</h2>
            <div className="section-divider"></div>
            <p>Capturing moments from our community events and celebrations</p>
          </div>
          <div className="photo-gallery-grid">
            <div className="photo-card">
              <img src="/gallery-1.jpg" alt="Community Event" />
              <div className="photo-overlay">
                <h4>Annual Gathering 2024</h4>
                <p>Community celebration with 1000+ members</p>
              </div>
            </div>
            <div className="photo-card">
              <img src="/gallery-2.jpg" alt="Cultural Program" />
              <div className="photo-overlay">
                <h4>Cultural Program</h4>
                <p>Traditional dance and music performances</p>
              </div>
            </div>
            <div className="photo-card">
              <img src="/gallery-3.jpg" alt="Business Meet" />
              <div className="photo-overlay">
                <h4>Business Networking</h4>
                <p>Professional development and opportunities</p>
              </div>
            </div>
            <div className="photo-card">
              <img src="/gallery-4.jpg" alt="Youth Activities" />
              <div className="photo-overlay">
                <h4>Youth Programs</h4>
                <p>Engaging the next generation</p>
              </div>
            </div>
            <div className="photo-card">
              <img src="/gallery-5.jpg" alt="Festival Celebration" />
              <div className="photo-overlay">
                <h4>Festival Celebrations</h4>
                <p>Traditional festivals and ceremonies</p>
              </div>
            </div>
            <div className="photo-card">
              <img src="/gallery-6.jpg" alt="Community Service" />
              <div className="photo-overlay">
                <h4>Community Service</h4>
                <p>Social welfare and charitable activities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="achievements-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Achievements</h2>
            <div className="section-divider"></div>
            <p>Milestones that make us proud</p>
          </div>
          <div className="achievements-grid">
            <div className="achievement-card">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-content">
                <h4>Community Excellence Award</h4>
                <p>Recognized by Udaipur Municipal Corporation for outstanding community service and cultural preservation efforts in 2023.</p>
                <span className="achievement-year">2023</span>
              </div>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🎓</div>
              <div className="achievement-content">
                <h4>Educational Support Program</h4>
                <p>Successfully provided scholarships to 500+ students from our community, supporting their higher education dreams.</p>
                <span className="achievement-year">2020-2024</span>
              </div>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">💼</div>
              <div className="achievement-content">
                <h4>Business Network Expansion</h4>
                <p>Facilitated business connections leading to 100+ successful partnerships and ventures among community members.</p>
                <span className="achievement-year">2022</span>
              </div>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🏥</div>
              <div className="achievement-content">
                <h4>Healthcare Initiative</h4>
                <p>Organized free health camps serving 2000+ community members with preventive healthcare and awareness programs.</p>
                <span className="achievement-year">2021-2024</span>
              </div>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🌟</div>
              <div className="achievement-content">
                <h4>Cultural Heritage Recognition</h4>
                <p>Our traditional craft exhibition was featured in the State Cultural Festival, showcasing our rich artistic heritage.</p>
                <span className="achievement-year">2023</span>
              </div>
            </div>
            <div className="achievement-card">
              <div className="achievement-icon">🤝</div>
              <div className="achievement-content">
                <h4>Unity in Diversity</h4>
                <p>Successfully organized interfaith harmony programs, promoting peace and understanding in the broader community.</p>
                <span className="achievement-year">2019-2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;