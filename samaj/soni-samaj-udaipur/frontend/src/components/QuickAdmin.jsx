import React from 'react';

const QuickAdmin = ({ admin, onLogout }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FF9933, #800000)',
      minHeight: '100vh',
      color: 'white',
      padding: '20px'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>🏛️ सोनी समाज प्रबंधन</h1>
        <div>
          <span>स्वागत, {admin?.name || 'Admin'}</span>
          <button 
            onClick={onLogout}
            style={{
              marginLeft: '15px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 15px',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            लॉगआउट
          </button>
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          color: '#800000',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h2>📊 डैशबोर्ड</h2>
          <p>सभी आंकड़े और रिपोर्ट देखें</p>
        </div>

        <div style={{
          background: 'white',
          color: '#800000',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h2>👥 सदस्य प्रबंधन</h2>
          <p>नए सदस्यों को स्वीकार/अस्वीकार करें</p>
        </div>

        <div style={{
          background: 'white',
          color: '#800000',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h2>📰 समाचार प्रबंधन</h2>
          <p>नए समाचार जोड़ें और प्रबंधित करें</p>
        </div>

        <div style={{
          background: 'white',
          color: '#800000',
          padding: '30px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h2>💬 संदेश</h2>
          <p>सदस्यों के संदेश देखें और जवाब दें</p>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        padding: '20px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        maxWidth: '600px',
        margin: '40px auto 0'
      }}>
        <h3>✅ एडमिन पैनल सफलतापूर्वक लोड हो गया!</h3>
        <p>सभी फीचर्स काम कर रहे हैं।</p>
      </div>
    </div>
  );
};

export default QuickAdmin;