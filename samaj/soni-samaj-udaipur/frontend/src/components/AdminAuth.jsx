import React, { useState } from 'react';

const AdminAuth = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple hardcoded authentication
    const validLogins = [
      { username: 'admin', password: 'admin' },
      { username: 'sonisamaj', password: '123456' },
      { username: 'admin@sonisamaj.com', password: 'SoniSamaj@2024!' }
    ];
    
    const isValid = validLogins.some(login => 
      login.username === credentials.username && login.password === credentials.password
    );
    
    if (isValid) {
      const adminData = { name: 'Admin', username: 'admin', loginTime: new Date().toISOString() };
      localStorage.setItem('adminAuth', JSON.stringify(adminData));
      onLogin(adminData);
      window.location.href = '/admin/dashboard';
    } else {
      setError('गलत उपयोगकर्ता नाम या पासवर्ड');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ff8c00 0%, #ff6b35 50%, #f7931e 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '15px',
        boxShadow: '0 20px 40px rgba(255, 140, 0, 0.3)',
        width: '100%',
        maxWidth: '450px',
        border: '3px solid #ff8c00'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>🏛️</div>
          <h1 style={{ 
            color: '#ff8c00', 
            marginBottom: '0.5rem',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>Admin Panel</h1>
          <h2 style={{ 
            color: '#333', 
            marginBottom: '0.5rem',
            fontSize: '1.5rem'
          }}>Soni Samaj Udaipur</h2>
          <p style={{ 
            color: '#666', 
            margin: 0,
            fontSize: '1rem'
          }}>प्रवेश करें</p>
          <div style={{
            background: '#fff3e0',
            padding: '15px',
            borderRadius: '8px',
            marginTop: '15px',
            border: '1px solid #ffcc02'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#ff8c00' }}>Login Credentials:</p>
            <p style={{ margin: '2px 0', fontSize: '14px', color: '#333' }}>Username: <code>admin</code> | Password: <code>admin</code></p>
            <p style={{ margin: '2px 0', fontSize: '14px', color: '#333' }}>Username: <code>sonisamaj</code> | Password: <code>123456</code></p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #ff8c00',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
              onBlur={(e) => e.target.style.borderColor = '#ff8c00'}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #ff8c00',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'all 0.3s',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
              onBlur={(e) => e.target.style.borderColor = '#ff8c00'}
            />
          </div>
          
          {error && (
            <div style={{
              color: '#d32f2f',
              textAlign: 'center',
              padding: '12px',
              background: '#ffebee',
              borderRadius: '8px',
              border: '2px solid #ffcdd2',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: loading ? '#ffb74d' : '#ff8c00',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)'
            }}
            onMouseOver={(e) => !loading && (e.target.style.background = '#ff6b35')}
            onMouseOut={(e) => !loading && (e.target.style.background = '#ff8c00')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;