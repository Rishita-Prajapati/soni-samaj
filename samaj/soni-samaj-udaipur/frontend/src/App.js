import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationFix from './components/NavigationFix';
import './App.css';

// Import regular components
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Registration from './pages/Registration';

// Import optimized components
import FastBirthdays from './components/FastBirthdays';
import EventsDisplay from './components/EventsDisplay';
import ContactForm from './components/ContactForm';
import AdminDashboard from './components/Admin/AdminDashboard';
import Footer from './components/Footer';
import BirthdayDisplay from './components/BirthdayDisplay';

// Import global styles
import './styles/globals.css';
import './styles/scroll-fixes.css';
import './styles/admin-fixes.css';

// Import Events pages
import Badhai from './pages/Badhai';
import ShokSamachar from './pages/ShokSamachar';
import TodaysBirthday from './pages/TodaysBirthday';
import News from './pages/News';
import KulDevtaPage from './pages/KulDevtaPage';

// Import other pages
import Sangathan from './pages/Sangathan';

// Import Admin components
import AdminLogin from './components/AdminLogin';
import AdminAuth from './components/AdminAuth';

// Import Admin Event Management Components
import SimpleAdminPage from './components/Admin/SimpleAdminPage';
import MemberDirectorySearch from './components/Admin/MemberDirectorySearch';
import MemberManagement from './components/Admin/MemberManagement';
import MessageManagement from './components/Admin/MessageManagement';
import PrivacyNotice from './components/PrivacyNotice';

import SangathanManagement from './components/Admin/SangathanManagement';
import BadhaiEventManagement from './components/Admin/BadhaiEventManagement';
import ShokEventManagement from './components/Admin/ShokEventManagement';
import NewsEventManagement from './components/Admin/NewsEventManagement';
import BirthdayEventManagement from './components/Admin/BirthdayEventManagement';

// Import Admin Auth Service
import adminAuthService from './services/adminAuthService';



// Create a main page component that contains all sections
const MainPage = () => {
  return (
    <div>
      <Home />
      <About />
      <Contact />
    </div>
  );
};

// Improved Placeholder component for admin pages under development
const PlaceholderPage = ({ title, icon, description }) => {
  const goToDashboard = () => {
    window.location.href = '/admin/dashboard';
  };

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh' 
    }}>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{icon}</div>
        <h1 style={{ color: '#1f2937', marginBottom: '16px' }}>{title}</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>{description}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={goToDashboard}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ← Back to Dashboard
          </button>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            🔄 Refresh Page
          </button>
        </div>
        
        {/* Debug Info */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          textAlign: 'left',
          fontSize: '14px'
        }}>
          <strong>Debug Info:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Current URL: {window.location.pathname}</li>
            <li>Page Status: ✅ Route Working</li>
            <li>Component: PlaceholderPage</li>
            <li>Ready for Development: Yes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component for Admin
const ProtectedAdminRoute = ({ children, admin }) => {
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Public Route Component (hides header for admin routes)
const PublicRoute = ({ children, showHeader = true }) => {
  return (
    <div>
      {showHeader && <Header />}
      {children}
      {showHeader && <Footer />}
    </div>
  );
};

// Error Boundary for Admin Components
class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#fef2f2',
          minHeight: '100vh'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '12px',
            maxWidth: '600px',
            margin: '0 auto',
            border: '2px solid #fecaca'
          }}>
            <h1 style={{ color: '#dc2626', marginBottom: '16px' }}>
              🚨 Admin Component Error
            </h1>
            <p style={{ marginBottom: '20px' }}>
              There was an error loading this admin page.
            </p>
            <div style={{
              backgroundColor: '#fef2f2',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <strong>Error Details:</strong>
              <pre style={{ fontSize: '12px', marginTop: '8px', overflow: 'auto' }}>
                {this.state.error?.message || 'Unknown error occurred'}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              🔄 Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper for Admin Routes with Error Boundary
const AdminRouteWrapper = ({ children }) => (
  <AdminErrorBoundary>
    {children}
  </AdminErrorBoundary>
);

function App() {
  const [admin, setAdmin] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if user is returning to same session
      const sessionAuth = sessionStorage.getItem('adminSession');
      if (sessionAuth) {
        try {
          const adminData = JSON.parse(sessionAuth);
          setAdmin(adminData);
        } catch (error) {
          sessionStorage.removeItem('adminSession');
        }
      }
      
      // Clear localStorage on page load for security
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('admin_user');
      
      await adminAuthService.initialize();
      
      const unsubscribe = adminAuthService.onAuthStateChange((adminUser) => {
        setAdmin(adminUser);
        if (adminUser) {
          sessionStorage.setItem('adminSession', JSON.stringify(adminUser));
        } else {
          sessionStorage.removeItem('adminSession');
        }
      });

      setAuthLoading(false);
      return unsubscribe;
    };

    initializeAuth();
  }, []);

  const handleAdminLogin = (adminUser) => {
    setAdmin(adminUser);
    sessionStorage.setItem('adminSession', JSON.stringify(adminUser));
  };

  const handleAdminLogout = async () => {
    try {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('admin_user');
      sessionStorage.removeItem('adminSession');
      await adminAuthService.logout();
      setAdmin(null);
      // Force redirect to login page
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if there's an error
      window.location.href = '/admin/login';
    }
  };



  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8fafc'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <NavigationFix />
      <div className="App">
        <Routes>
          {/* ================================
              PUBLIC ROUTES (with Header)
              ================================ */}
          
          {/* Main Routes */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <MainPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            index 
            element={
              <PublicRoute>
                <MainPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Registration />
              </PublicRoute>
            } 
          />

          {/* Privacy Notice for Member Directory */}
          <Route 
            path="/members/search" 
            element={
              <PublicRoute showHeader={false}>
                <PrivacyNotice />
              </PublicRoute>
            } 
          />
          
          {/* Events Routes */}
          <Route 
            path="/events/badhai" 
            element={
              <PublicRoute>
                <Badhai />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/events/shok-samachar" 
            element={
              <PublicRoute>
                <ShokSamachar />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/events/todays-birthday" 
            element={
              <PublicRoute>
                <TodaysBirthday />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/events/news" 
            element={
              <PublicRoute>
                <News />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/events/kul-devta" 
            element={
              <PublicRoute>
                <KulDevtaPage />
              </PublicRoute>
            } 
          />
          
          {/* Main Navigation Routes */}
          <Route 
            path="/kul-devta" 
            element={
              <PublicRoute>
                <KulDevtaPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/sangathan" 
            element={
              <PublicRoute>
                <Sangathan />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/home" 
            element={
              <PublicRoute>
                <MainPage />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/about" 
            element={
              <PublicRoute>
                <div>
                  <About />
                </div>
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/contact" 
            element={
              <PublicRoute>
                <div>
                  <Contact />
                </div>
              </PublicRoute>
            } 
          />
          
          {/* Events Display Route */}
          <Route 
            path="/events" 
            element={
              <PublicRoute>
                <EventsDisplay />
              </PublicRoute>
            } 
          />

          {/* ================================
              ADMIN ROUTES (without Header)
              ================================ */}
          
          {/* Admin Login Route */}
          <Route 
            path="/admin/login" 
            element={
              <PublicRoute showHeader={false}>
                <AdminAuth onLogin={handleAdminLogin} />
              </PublicRoute>
            } 
          />
          
          {/* Admin Dashboard Route */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedAdminRoute admin={admin}>
                <PublicRoute showHeader={false}>
                  <AdminRouteWrapper>
                    <AdminDashboard 
                      admin={admin} 
                      onLogout={handleAdminLogout} 
                    />
                  </AdminRouteWrapper>
                </PublicRoute>
              </ProtectedAdminRoute>
            } 
          />
          
          {/* Admin Pages */}

          
          <Route path="/admin/badhai" element={
            <ProtectedAdminRoute admin={admin}>
              <PublicRoute showHeader={false}>
                <AdminRouteWrapper>
                  <BadhaiEventManagement admin={admin} onLogout={handleAdminLogout} />
                </AdminRouteWrapper>
              </PublicRoute>
            </ProtectedAdminRoute>
          } />
          
          <Route path="/admin/shok" element={
            <ProtectedAdminRoute admin={admin}>
              <PublicRoute showHeader={false}>
                <AdminRouteWrapper>
                  <ShokEventManagement admin={admin} onLogout={handleAdminLogout} />
                </AdminRouteWrapper>
              </PublicRoute>
            </ProtectedAdminRoute>
          } />
          
          <Route path="/admin/birthday" element={
            <ProtectedAdminRoute admin={admin}>
              <PublicRoute showHeader={false}>
                <AdminRouteWrapper>
                  <BirthdayEventManagement admin={admin} onLogout={handleAdminLogout} />
                </AdminRouteWrapper>
              </PublicRoute>
            </ProtectedAdminRoute>
          } />
          
          <Route path="/admin/news" element={
            <ProtectedAdminRoute admin={admin}>
              <PublicRoute showHeader={false}>
                <AdminRouteWrapper>
                  <NewsEventManagement admin={admin} onLogout={handleAdminLogout} />
                </AdminRouteWrapper>
              </PublicRoute>
            </ProtectedAdminRoute>
          } />
          
          <Route path="/admin/members" element={
            <ProtectedAdminRoute admin={admin}>
              <PublicRoute showHeader={false}>
                <AdminRouteWrapper>
                  <MemberManagement admin={admin} onLogout={handleAdminLogout} />
                </AdminRouteWrapper>
              </PublicRoute>
            </ProtectedAdminRoute>
          } />
          
          <Route path="/admin/sangthan" element={
            <ProtectedAdminRoute admin={admin}>
              <PublicRoute showHeader={false}>
                <AdminRouteWrapper>
                  <SangathanManagement admin={admin} onLogout={handleAdminLogout} />
                </AdminRouteWrapper>
              </PublicRoute>
            </ProtectedAdminRoute>
          } />
          
          <Route path="/admin/messages" element={
            <ProtectedAdminRoute admin={admin}>
              <PublicRoute showHeader={false}>
                <AdminRouteWrapper>
                  <MessageManagement admin={admin} onLogout={handleAdminLogout} />
                </AdminRouteWrapper>
              </PublicRoute>
            </ProtectedAdminRoute>
          } />



          {/* ================================
              UTILITY ROUTES
              ================================ */}
          
          {/* Admin Root Redirect */}
          <Route 
            path="/admin" 
            element={<Navigate to="/admin/dashboard" replace />} 
          />
          
          {/* Test Route */}
          <Route 
            path="/test" 
            element={
              <PublicRoute>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h1>🧪 Test Route Works!</h1>
                  <p>This proves routing is functioning</p>
                  <div style={{ marginTop: '20px' }}>
                    <p><strong>Admin Status:</strong> {admin ? `Logged in as ${admin.name}` : 'Not logged in'}</p>
                    <p><strong>Current URL:</strong> {window.location.pathname}</p>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <button 
                      onClick={() => console.log('Admin object:', admin)}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px'
                      }}
                    >
                      🔍 Log Admin State
                    </button>
                    <button 
                      onClick={() => window.location.href = '/admin/dashboard'}
                      style={{
                        backgroundColor: '#3182ce',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      👑 Go to Admin
                    </button>
                  </div>
                </div>
              </PublicRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route 
            path="*" 
            element={
              <PublicRoute>
                <div style={{ padding: '20px', textAlign: 'center', minHeight: '60vh' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>Current URL: {window.location.pathname}</p>
                  <div style={{ marginTop: '30px' }}>
                    <button 
                      onClick={() => window.location.href = '/'}
                      style={{
                        background: '#3182ce',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        marginRight: '10px'
                      }}
                    >
                      🏠 Go to Home
                    </button>
                    <button 
                      onClick={() => window.location.href = '/admin/dashboard'}
                      style={{
                        background: '#7c3aed',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      👑 Go to Admin
                    </button>
                  </div>
                </div>
              </PublicRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;