import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyNotice = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF5E1 0%, #FFEAA7 100%)',
      padding: '120px 20px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
        border: '2px solid #FFE4B5'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
        
        <h1 style={{
          color: '#800000',
          fontSize: '2.5rem',
          marginBottom: '20px',
          fontWeight: '700'
        }}>
          Privacy Protected
        </h1>
        
        <p style={{
          color: '#3B2F2F',
          fontSize: '1.2rem',
          lineHeight: '1.6',
          marginBottom: '30px'
        }}>
          To protect our community members' privacy, the member directory has been removed from public access. 
          Member information is now only available to authorized personnel.
        </p>
        
        <div style={{
          background: '#FFF5E1',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '2px solid #FF9933'
        }}>
          <h3 style={{ color: '#FF9933', marginBottom: '10px' }}>
            🏛️ सोनी समाज उदयपुर
          </h3>
          <p style={{ color: '#800000', margin: 0, fontSize: '1rem' }}>
            For member-related inquiries, please contact our office directly or reach out to community leaders.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/contact" 
            style={{
              background: 'linear-gradient(135deg, #FF9933, #800000)',
              color: 'white',
              textDecoration: 'none',
              padding: '12px 25px',
              borderRadius: '25px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 153, 51, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Contact Us
          </Link>
          
          <Link 
            to="/" 
            style={{
              background: 'white',
              color: '#FF9933',
              textDecoration: 'none',
              padding: '12px 25px',
              borderRadius: '25px',
              fontWeight: '600',
              border: '2px solid #FF9933',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#FF9933';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'white';
              e.target.style.color = '#FF9933';
            }}
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;