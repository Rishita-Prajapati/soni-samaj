import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '40px 20px 20px 20px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '30px'
        }}>
          {/* Organization Info */}
          <div>
            <h3 style={{
              color: '#ff8c00',
              fontSize: '20px',
              marginBottom: '16px',
              fontWeight: 'bold'
            }}>
              सोनी समाज उदयपुर
            </h3>
            <p style={{
              color: '#d1d5db',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              समुदाय की सेवा में समर्पित। हमारा उद्देश्य सभी सदस्यों को जोड़ना और 
              सामाजिक कल्याण के लिए काम करना है।
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>🏛️</span>
              <span style={{ color: '#d1d5db' }}>Serving the Community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              color: '#ff8c00',
              fontSize: '16px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Member Registration', href: '/register' },
                { name: 'Events', href: '/events' },
                { name: 'Contact', href: '/contact' }
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <a
                    href={link.href}
                    style={{
                      color: '#d1d5db',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#ff8c00'}
                    onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 style={{
              color: '#ff8c00',
              fontSize: '16px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Events & Services
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {[
                { name: 'Badhai Events', href: '/events/badhai' },
                { name: 'Shok Samachar', href: '/events/shok-samachar' },
                { name: 'Today\'s Birthday', href: '/events/todays-birthday' },
                { name: 'News & Updates', href: '/events/news' },
                { name: 'Member Directory', href: '/members/search' }
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <a
                    href={link.href}
                    style={{
                      color: '#d1d5db',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#ff8c00'}
                    onMouseOut={(e) => e.target.style.color = '#d1d5db'}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              color: '#ff8c00',
              fontSize: '16px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              Contact Information
            </h4>
            <div style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📍</span>
                <span>Udaipur, Rajasthan, India</span>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📧</span>
                <span>info@sonisamajudaipur.org</span>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📱</span>
                <span>Contact through website</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Copyright */}
          <div style={{
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '14px'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              © {currentYear} <strong style={{ color: '#ff8c00' }}>Soni Samaj Udaipur</strong>. All rights reserved.
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              सभी अधिकार सुरक्षित। इस वेबसाइट की सामग्री का अनधिकृत उपयोग वर्जित है।
            </p>
          </div>

          {/* Legal Links */}
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              'Privacy Policy',
              'Terms of Service',
              'Community Guidelines',
              'Disclaimer'
            ].map((link, index) => (
              <span key={index}>
                <a
                  href="#"
                  style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '12px',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#ff8c00'}
                  onMouseOut={(e) => e.target.style.color = '#9ca3af'}
                >
                  {link}
                </a>
                {index < 3 && <span style={{ color: '#4b5563', margin: '0 10px' }}>|</span>}
              </span>
            ))}
          </div>

          {/* Made with Love */}
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '12px',
            marginTop: '8px'
          }}>
            Made with ❤️ for the Soni Community | Developed with modern web technologies
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;