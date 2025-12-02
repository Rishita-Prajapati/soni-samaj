import React, { useState, useEffect } from 'react';
import './AdminLogin.css';
import adminAuthService from '../services/adminAuthService';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authService, setAuthService] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const setupAuth = async () => {
      await adminAuthService.initialize();
      setAuthService(adminAuthService);
      setInitializing(false);
    };
    setupAuth();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !authService) return;

    setLoading(true);
    setError('');

    try {
      const adminData = await authService.loginAdmin(formData.email, formData.password);
      
      // Success callback
      if (onLoginSuccess) {
        onLoginSuccess(adminData);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  if (initializing) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="logo-section">
            <div className="admin-logo">
              <span className="logo-icon">🏛️</span>
            </div>
            <h1>Soni Samaj Admin</h1>
            <p>Administrative Panel Access</p>
          </div>
        </div>

        <div className="admin-login-form-container">
          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p>Please sign in to your admin account</p>
          </div>

          <div className="login-form">
            <div className="form-group">
              <label htmlFor="email">Admin Username</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your admin username"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="login-button"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <span className="login-icon">🚀</span>
                  Sign In to Dashboard
                </>
              )}
            </button>
          </div>

          <div className="login-footer">
            <div className="security-info">
              <span className="security-icon">🔐</span>
              <span>Secure Admin Access</span>
            </div>
            <div className="help-text">
              <p><strong>Admin Credentials (Choose any):</strong></p>
              <p>1. Email: <code>admin</code> | Password: <code>admin</code></p>
              <p>2. Email: <code>sonisamaj</code> | Password: <code>123456</code></p>
              <p>3. Email: <code>admin@sonisamaj.com</code> | Password: <code>SoniSamaj@2024!</code></p>
            </div>
          </div>
        </div>

        <div className="admin-login-footer">
          <div className="footer-content">
            <p>&copy; 2024 Soni Samaj Udaipur. All rights reserved.</p>
            <div className="footer-links">
              <span>🏠 Back to Website</span>
              <span>📞 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
    </div>
  );
};

export default AdminLogin;