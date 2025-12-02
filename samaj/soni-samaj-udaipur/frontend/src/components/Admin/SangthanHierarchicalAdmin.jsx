import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit2, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, 
  Save, X, Upload, Calendar, MapPin, Phone, Mail, Globe, Users, 
  ArrowLeft, Building, Home, Crown, UserCheck, FileText, Menu,
  BarChart3, Settings, Bell, LogOut, MessageSquare
} from 'lucide-react';

// AdminSidebar Component
const AdminSidebar = ({ activeModule, onModuleChange, isCollapsed, onToggleCollapse }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/admin/dashboard'
    },
    {
      id: 'members',
      label: 'Members',
      icon: '👥',
      path: '/admin/members'
    },
    {
      id: 'sangthan',
      label: 'Sangthan',
      icon: '🏛️',
      path: '/admin/sangthan'
    },
    {
      id: 'events',
      label: 'Events Overview',
      icon: '📊',
      path: '/admin/events'
    },
    {
      id: 'badhai',
      label: 'Badhai Events',
      icon: '🎉',
      path: '/admin/events/badhai'
    },
    {
      id: 'shok',
      label: 'Shok News',
      icon: '🙏',
      path: '/admin/events/shok-news'
    },
    {
      id: 'birthday',
      label: 'Birthday Events',
      icon: '🎂',
      path: '/admin/events/birthday'
    },
    {
      id: 'news',
      label: 'News Articles',
      icon: '📰',
      path: '/admin/events/news'
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      icon: '💬',
      path: '/admin/testimonials'
    },
    {
      id: 'advertisements',
      label: 'Advertisements',
      icon: '🖼️',
      path: '/admin/advertisements'
    },
    {
      id: 'committee',
      label: 'Committee',
      icon: '👑',
      path: '/admin/committee'
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: '📝',
      path: '/admin/blog'
    }
  ];

  // Get current path to determine active module
  const getCurrentPath = () => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/admin/sangthan';
  };

  // Map URL paths to module IDs
  const getActiveModuleFromPath = () => {
    const currentPath = getCurrentPath();
    const pathMap = {
      '/admin/dashboard': 'dashboard',
      '/admin/members': 'members', 
      '/admin/sangthan': 'sangthan',
      '/admin/events': 'events',
      '/admin/events/badhai': 'badhai',
      '/admin/events/shok-news': 'shok',
      '/admin/events/birthday': 'birthday',
      '/admin/events/news': 'news',
      '/admin/testimonials': 'testimonials',
      '/admin/advertisements': 'advertisements',
      '/admin/committee': 'committee',
      '/admin/blog': 'blog',
      '/admin/settings': 'settings'
    };
    return pathMap[currentPath] || activeModule || 'sangthan';
  };

  const currentActiveModule = getActiveModuleFromPath();

  const handleNavigation = (path, itemId) => {
    console.log(`Navigating to: ${path} (${itemId})`);
    
    // Simulate navigation by updating browser URL
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState(null, '', path);
        // Trigger a popstate event to update the UI
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch (error) {
        console.log('Navigation simulation:', path);
      }
    }
    
    // Call the callback to update parent component state
    if (onModuleChange) {
      onModuleChange(itemId);
    }
    
    // Add visual feedback
    const button = document.querySelector(`[data-menu-id="${itemId}"]`);
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 100);
    }
  };

  const handleSettingsClick = () => {
    handleNavigation('/admin/settings', 'settings');
  };

  return (
    <div style={{
      backgroundColor: '#1e293b',
      color: 'white',
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Header */}
      <div 
        style={{
          padding: '20px 16px',
          borderBottom: '1px solid #334155',
          cursor: 'pointer'
        }} 
        onClick={() => handleNavigation('/admin/dashboard', 'dashboard')}
      >
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              👑
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'white' }}>Admin Panel</h1>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Soni Samaj Udaipur</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            margin: '0 auto'
          }}>
            👑
          </div>
        )}
      </div>

      {/* Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          style={{
            position: 'absolute',
            right: '-12px',
            top: '80px',
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '12px',
            color: 'white',
            zIndex: 10
          }}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      )}

      {/* Navigation Menu */}
      <nav style={{
        flex: 1,
        padding: '24px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto'
      }}>
        {menuItems.map((item) => {
          const isActive = currentActiveModule === item.id;
          
          return (
            <button
              key={item.id}
              data-menu-id={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                color: isActive ? 'white' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                gap: isCollapsed ? '0' : '12px',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = '#334155';
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#cbd5e1';
                }
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <span style={{ fontSize: '18px', minWidth: '18px' }}>{item.icon}</span>
              {!isCollapsed && (
                <span style={{ flex: 1, textAlign: 'left' }}>
                  {item.label}
                </span>
              )}
              {isActive && !isCollapsed && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  opacity: 0.8
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid #334155'
      }}>
        <button 
          onClick={handleSettingsClick}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: '8px',
            color: currentActiveModule === 'settings' ? 'white' : '#cbd5e1',
            backgroundColor: currentActiveModule === 'settings' ? '#3b82f6' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            gap: isCollapsed ? '0' : '12px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (currentActiveModule !== 'settings') {
              e.target.style.backgroundColor = '#334155';
              e.target.style.color = 'white';
            }
          }}
          onMouseLeave={(e) => {
            if (currentActiveModule !== 'settings') {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#cbd5e1';
            }
          }}
          title={isCollapsed ? 'Settings' : undefined}
        >
          <span style={{ fontSize: '18px' }}>⚙️</span>
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
};

const SangthanHierarchicalAdmin = () => {
  const [currentView, setCurrentView] = useState('districts');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('sangthan');
  
  // Data states
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [members, setMembers] = useState([]);
  
  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formType, setFormType] = useState('district');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('all');

  // Form states
  const [districtForm, setDistrictForm] = useState({
    name: '',
    description: '',
    state: 'Rajasthan',
    is_active: true,
    display_order: ''
  });

  const [cityForm, setCityForm] = useState({
    name: '',
    district_id: '',
    description: '',
    pincode: '',
    is_active: true,
    display_order: ''
  });

  const [memberForm, setMemberForm] = useState({
    member_id: '',
    city_id: '',
    district_id: '',
    position_title: '',
    hierarchy_level: '',
    term_year: '',
    is_active: true,
    display_order: ''
  });

  // Sample data initialization
  useEffect(() => {
    const sampleDistricts = [
      { id: 1, name: 'Udaipur', description: 'Main district of operations', state: 'Rajasthan', is_active: true, display_order: 1, city_count: 2 },
      { id: 2, name: 'Rajsamand', description: 'Secondary district', state: 'Rajasthan', is_active: true, display_order: 2, city_count: 1 },
      { id: 3, name: 'Banswara', description: 'Third district', state: 'Rajasthan', is_active: true, display_order: 3, city_count: 1 }
    ];

    const sampleCities = [
      { id: 1, name: 'Udaipur City', district_id: 1, description: 'Main city in Udaipur district', pincode: '313001', is_active: true, display_order: 1, member_count: 3 },
      { id: 2, name: 'Mavli', district_id: 1, description: 'Secondary city in Udaipur', pincode: '313002', is_active: true, display_order: 2, member_count: 2 },
      { id: 3, name: 'Rajsamand City', district_id: 2, description: 'Main city in Rajsamand', pincode: '313324', is_active: true, display_order: 1, member_count: 1 },
      { id: 4, name: 'Banswara City', district_id: 3, description: 'Main city in Banswara', pincode: '327001', is_active: true, display_order: 1, member_count: 1 }
    ];

    const sampleMembers = [
      { id: 1, member_id: 101, name: 'Rajesh Kumar Soni', city_id: 1, district_id: 1, position_title: 'PRESIDENT', hierarchy_level: 'Executive', term_year: '2024-2026', mobile: '9876543210', fathers_name: 'Ram Kumar Soni', gotra: 'Kashyap', occupation: 'Jeweller', is_active: true, display_order: 1 },
      { id: 2, member_id: 102, name: 'Priya Soni', city_id: 1, district_id: 1, position_title: 'SECRETARY', hierarchy_level: 'Executive', term_year: '2024-2026', mobile: '9876543211', fathers_name: 'Mohan Lal Soni', gotra: 'Bharadwaj', occupation: 'Teacher', is_active: true, display_order: 2 },
      { id: 3, member_id: 103, name: 'Rani Chauhan', city_id: 1, district_id: 1, position_title: 'TREASURER', hierarchy_level: 'Executive', term_year: '2024-2026', mobile: '9765432109', fathers_name: 'Suresh Soni', gotra: 'Gautam', occupation: 'Business', is_active: true, display_order: 3 },
      { id: 4, member_id: 104, name: 'Amit Soni', city_id: 2, district_id: 1, position_title: 'MEMBER', hierarchy_level: 'General', term_year: '2024-2026', mobile: '9876543212', fathers_name: 'Prakash Soni', gotra: 'Vashishtha', occupation: 'Engineer', is_active: true, display_order: 1 },
      { id: 5, member_id: 105, name: 'Sunita Devi', city_id: 2, district_id: 1, position_title: 'MEMBER', hierarchy_level: 'Women', term_year: '2024-2026', mobile: '9876543213', fathers_name: 'Vinod Soni', gotra: 'Atri', occupation: 'Homemaker', is_active: true, display_order: 2 }
    ];

    setDistricts(sampleDistricts);
    setCities(sampleCities);
    setMembers(sampleMembers);
  }, []);

  const positionTitles = [
    'PRESIDENT', 'VICE PRESIDENT', 'SECRETARY', 'TREASURER', 
    'JOINT SECRETARY', 'EXECUTIVE MEMBER', 'MEMBER', 'ADVISOR'
  ];

  const hierarchyLevels = [
    'Executive', 'Advisory', 'General', 'Youth', 'Women', 'Senior'
  ];

  const resetForms = () => {
    setDistrictForm({ name: '', description: '', state: 'Rajasthan', is_active: true, display_order: '' });
    setCityForm({ name: '', district_id: '', description: '', pincode: '', is_active: true, display_order: '' });
    setMemberForm({ member_id: '', city_id: '', district_id: '', position_title: '', hierarchy_level: '', term_year: '', is_active: true, display_order: '' });
    setEditingId(null);
  };

  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);
    
    // Handle different module navigation
    switch(moduleId) {
      case 'sangthan':
        // Stay in current sangthan view or reset to districts
        break;
      case 'members':
        // In a real app, you would navigate to members page
        console.log('Navigate to Members page');
        break;
      case 'dashboard':
        console.log('Navigate to Dashboard');
        break;
      case 'events':
        console.log('Navigate to Events Overview');
        break;
      case 'badhai':
        console.log('Navigate to Badhai Events');
        break;
      case 'shok':
        console.log('Navigate to Shok News');
        break;
      case 'birthday':
        console.log('Navigate to Birthday Events');
        break;
      case 'news':
        console.log('Navigate to News Articles');
        break;
      case 'testimonials':
        console.log('Navigate to Testimonials');
        break;
      case 'advertisements':
        console.log('Navigate to Advertisements');
        break;
      case 'committee':
        console.log('Navigate to Committee');
        break;
      case 'blog':
        console.log('Navigate to Blog');
        break;
      case 'settings':
        console.log('Navigate to Settings');
        break;
      default:
        console.log('Unknown module:', moduleId);
    }
  };

  const goToDistricts = () => {
    setCurrentView('districts');
    setSelectedDistrict(null);
    setSelectedCity(null);
    resetForms();
  };

  const goToCities = (district) => {
    setCurrentView('cities');
    setSelectedDistrict(district);
    setSelectedCity(null);
    resetForms();
  };

  const goToMembers = (city) => {
    setCurrentView('members');
    setSelectedCity(city);
    resetForms();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formType === 'district') {
      if (editingId) {
        setDistricts(districts.map(item => 
          item.id === editingId ? { ...districtForm, id: editingId } : item
        ));
      } else {
        const newDistrict = {
          ...districtForm,
          id: Math.max(...districts.map(d => d.id)) + 1,
          city_count: 0
        };
        setDistricts([newDistrict, ...districts]);
      }
    } else if (formType === 'city') {
      if (editingId) {
        setCities(cities.map(item => 
          item.id === editingId ? { ...cityForm, id: editingId } : item
        ));
      } else {
        const newCity = {
          ...cityForm,
          id: Math.max(...cities.map(c => c.id)) + 1,
          member_count: 0
        };
        setCities([newCity, ...cities]);
      }
    } else if (formType === 'member') {
      if (editingId) {
        setMembers(members.map(item => 
          item.id === editingId ? { ...memberForm, id: editingId } : item
        ));
      } else {
        const memberNames = ['Rajesh Kumar', 'Sunita Devi', 'Ashok Soni', 'Meera Sharma', 'Vikash Jain'];
        const randomName = memberNames[Math.floor(Math.random() * memberNames.length)];
        const fatherNames = ['Ram Kumar Soni', 'Mohan Lal Soni', 'Suresh Soni', 'Prakash Soni', 'Vinod Soni'];
        const gotras = ['Kashyap', 'Bharadwaj', 'Gautam', 'Vashishtha', 'Atri'];
        const occupations = ['Jeweller', 'Teacher', 'Business', 'Engineer', 'Doctor'];
        
        const newMember = {
          ...memberForm,
          id: Math.max(...members.map(m => m.id)) + 1,
          name: randomName,
          fathers_name: fatherNames[Math.floor(Math.random() * fatherNames.length)],
          gotra: gotras[Math.floor(Math.random() * gotras.length)],
          occupation: occupations[Math.floor(Math.random() * occupations.length)],
          mobile: '98765' + Math.floor(Math.random() * 100000).toString().padStart(5, '0')
        };
        setMembers([newMember, ...members]);
      }
    }
    
    setShowForm(false);
    resetForms();
  };

  const handleEdit = (item, type) => {
    if (type === 'district') {
      setDistrictForm(item);
    } else if (type === 'city') {
      setCityForm(item);
    } else if (type === 'member') {
      setMemberForm(item);
    }
    setFormType(type);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'district') {
        setDistricts(districts.filter(item => item.id !== id));
      } else if (type === 'city') {
        setCities(cities.filter(item => item.id !== id));
      } else if (type === 'member') {
        setMembers(members.filter(item => item.id !== id));
      }
    }
  };

  const toggleStatus = (id, type) => {
    if (type === 'district') {
      setDistricts(districts.map(item =>
        item.id === id ? { ...item, is_active: !item.is_active } : item
      ));
    } else if (type === 'city') {
      setCities(cities.map(item =>
        item.id === id ? { ...item, is_active: !item.is_active } : item
      ));
    } else if (type === 'member') {
      setMembers(members.map(item =>
        item.id === id ? { ...item, is_active: !item.is_active } : item
      ));
    }
  };

  const getFilteredData = () => {
    let data = [];
    
    if (currentView === 'districts') {
      data = districts;
    } else if (currentView === 'cities') {
      data = cities.filter(city => city.district_id === selectedDistrict?.id);
    } else if (currentView === 'members') {
      data = members.filter(member => member.city_id === selectedCity?.id);
    }

    if (searchTerm) {
      data = data.filter(item => {
        const searchFields = currentView === 'districts' ? [item.name, item.description] :
                           currentView === 'cities' ? [item.name, item.description, item.pincode] :
                           [item.name, item.position_title, item.hierarchy_level, item.mobile, item.fathers_name, item.gotra];
        
        return searchFields.some(field => 
          field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (filterStatus !== 'all') {
      data = data.filter(item => 
        filterStatus === 'active' ? item.is_active : !item.is_active
      );
    }

    return data;
  };

  const filteredData = getFilteredData();

  const Breadcrumb = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '24px',
      padding: '12px 0'
    }}>
      <button 
        onClick={goToDistricts}
        style={{
          background: 'none',
          border: 'none',
          color: currentView === 'districts' ? '#3b82f6' : '#64748b',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'all 0.2s',
          fontSize: '14px',
          fontWeight: currentView === 'districts' ? '600' : '400'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f1f5f9';
          e.target.style.color = '#3b82f6';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = currentView === 'districts' ? '#3b82f6' : '#64748b';
        }}
      >
        Districts
      </button>
      {selectedDistrict && (
        <>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <button 
            onClick={() => goToCities(selectedDistrict)}
            style={{
              background: 'none',
              border: 'none',
              color: currentView === 'cities' ? '#3b82f6' : '#64748b',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s',
              fontSize: '14px',
              fontWeight: currentView === 'cities' ? '600' : '400'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.color = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = currentView === 'cities' ? '#3b82f6' : '#64748b';
            }}
          >
            {selectedDistrict.name}
          </button>
        </>
      )}
      {selectedCity && (
        <>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#3b82f6', fontWeight: '600' }}>{selectedCity.name}</span>
        </>
      )}
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '70px' : '280px',
        transition: 'width 0.3s ease',
        flexShrink: 0
      }}>
        <AdminSidebar 
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                borderRadius: '6px',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f1f5f9';
                e.target.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#64748b';
              }}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0,
                marginBottom: '4px'
              }}>
                {currentView === 'districts' && 'District Management'}
                {currentView === 'cities' && `Cities in ${selectedDistrict?.name}`}
                {currentView === 'members' && `${selectedCity?.name} Sangthan Members`}
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                {currentView === 'districts' && 'Manage districts and their organizational structure'}
                {currentView === 'cities' && `Manage cities under ${selectedDistrict?.name} district`}
                {currentView === 'members' && `Manage organization hierarchy for ${selectedCity?.name}`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <Bell size={18} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                A
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Admin</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Administrator</div>
              </div>
            </div>
            
            <button style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px' }}>
          <Breadcrumb />
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div>
              {currentView !== 'districts' && (
                <button
                  onClick={() => {
                    if (currentView === 'members') {
                      goToCities(selectedDistrict);
                    } else if (currentView === 'cities') {
                      goToDistricts();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    backgroundColor: '#64748b',
                    color: 'white',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}
            </div>
            
            <button
              onClick={() => {
                setFormType(currentView === 'districts' ? 'district' : 
                          currentView === 'cities' ? 'city' : 'member');
                if (currentView === 'cities') {
                  setCityForm({...cityForm, district_id: selectedDistrict?.id});
                } else if (currentView === 'members') {
                  setMemberForm({...memberForm, city_id: selectedCity?.id, district_id: selectedDistrict?.id});
                }
                setShowForm(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '8px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px 0 rgba(59, 130, 246, 0.3)'
              }}
            >
              <Plus size={16} />
              Add New {currentView === 'districts' ? 'District' : 
                        currentView === 'cities' ? 'City' : 'Member'}
            </button>
          </div>

          {/* Search and Filter */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              alignItems: 'end'
            }}>
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Search
                </label>
                <div style={{ position: 'relative' }}>
                  <Search style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} size={16} />
                  <input
                    type="text"
                    placeholder={`Search ${currentView}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  Results
                </label>
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {filteredData.length} {currentView}
                </div>
              </div>
            </div>
          </div>

          {/* Data Display */}
          {currentView === 'districts' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {filteredData.map((district) => (
                <div key={district.id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1e293b',
                        margin: 0,
                        marginBottom: '4px'
                      }}>
                        {district.name}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <MapPin size={12} />
                        {district.state}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleEdit(district, 'district')}
                        style={{
                          padding: '6px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(district.id, 'district')}
                        style={{
                          padding: '6px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '16px',
                    lineHeight: '1.5'
                  }}>
                    {district.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b',
                      backgroundColor: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {district.city_count || 0} Cities
                    </span>
                    <button
                      onClick={() => toggleStatus(district.id, 'district')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: district.is_active ? '#dcfce7' : '#fef2f2',
                        color: district.is_active ? '#166534' : '#dc2626'
                      }}
                    >
                      {district.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => goToCities(district)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Manage Cities →
                  </button>
                </div>
              ))}
            </div>
          )}

          {currentView === 'cities' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {filteredData.map((city) => (
                <div key={city.id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1e293b',
                        margin: 0,
                        marginBottom: '4px'
                      }}>
                        {city.name}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <MapPin size={12} />
                        {city.pincode}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleEdit(city, 'city')}
                        style={{
                          padding: '6px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(city.id, 'city')}
                        style={{
                          padding: '6px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '16px',
                    lineHeight: '1.5'
                  }}>
                    {city.description}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b',
                      backgroundColor: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {city.member_count || 0} Members
                    </span>
                    <button
                      onClick={() => toggleStatus(city.id, 'city')}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: city.is_active ? '#dcfce7' : '#fef2f2',
                        color: city.is_active ? '#166534' : '#dc2626'
                      }}
                    >
                      {city.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => goToMembers(city)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Manage Members →
                  </button>
                </div>
              ))}
            </div>
          )}

          {currentView === 'members' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: '20px'
            }}>
              {filteredData.map((member) => (
                <div key={member.id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '18px'
                      }}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1e293b',
                          margin: 0,
                          marginBottom: '2px'
                        }}>
                          {member.name}
                        </h3>
                        <p style={{
                          fontSize: '12px',
                          color: '#64748b',
                          margin: 0
                        }}>
                          ID: {member.member_id}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleEdit(member, 'member')}
                        style={{
                          padding: '6px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, 'member')}
                        style={{
                          padding: '6px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: 
                        member.position_title === 'PRESIDENT' ? '#fef2f2' :
                        member.position_title === 'SECRETARY' ? '#eff6ff' :
                        member.position_title === 'TREASURER' ? '#f0fdf4' : '#f8fafc',
                      color:
                        member.position_title === 'PRESIDENT' ? '#dc2626' :
                        member.position_title === 'SECRETARY' ? '#2563eb' :
                        member.position_title === 'TREASURER' ? '#16a34a' : '#475569'
                    }}>
                      {member.position_title === 'PRESIDENT' && <Crown size={12} />}
                      {member.position_title}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px', fontSize: '14px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Father: </span>
                      <span style={{ color: '#64748b' }}>{member.fathers_name}</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Gotra: </span>
                      <span style={{ color: '#64748b' }}>{member.gotra}</span>
                    </div>
                    <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} style={{ color: '#64748b' }} />
                      <span style={{ color: '#64748b' }}>{member.mobile}</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>City: </span>
                      <span style={{ color: '#64748b' }}>{selectedCity?.name}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: '500', color: '#374151' }}>Occupation: </span>
                      <span style={{ color: '#64748b' }}>{member.occupation}</span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b',
                      backgroundColor: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {member.hierarchy_level}
                    </span>
                    <button
                      onClick={() => toggleStatus(member.id, 'member')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: member.is_active ? '#dcfce7' : '#fef2f2',
                        color: member.is_active ? '#166534' : '#dc2626'
                      }}
                    >
                      {member.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                      {member.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredData.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <Users size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                No {currentView} found
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 2000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {editingId ? 'Edit' : 'Add New'} {
                    formType === 'district' ? 'District' :
                    formType === 'city' ? 'City' : 'Member'
                  }
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForms();
                  }}
                  style={{
                    padding: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: '#64748b',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                {/* District Form */}
                {formType === 'district' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        District Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={districtForm.name}
                        onChange={(e) => setDistrictForm({...districtForm, name: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s'
                        }}
                        placeholder="Enter district name"
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        State <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        required
                        value={districtForm.state}
                        onChange={(e) => setDistrictForm({...districtForm, state: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                      </select>
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={districtForm.description}
                        onChange={(e) => setDistrictForm({...districtForm, description: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          resize: 'vertical',
                          minHeight: '80px'
                        }}
                        placeholder="Brief description of the district"
                      />
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '6px',
                          display: 'block'
                        }}>
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={districtForm.display_order}
                          onChange={(e) => setDistrictForm({...districtForm, display_order: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                          placeholder="Order for display"
                        />
                      </div>
                      
                      <div style={{ alignItems: 'end', display: 'flex' }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            checked={districtForm.is_active}
                            onChange={(e) => setDistrictForm({...districtForm, is_active: e.target.checked})}
                            style={{
                              width: '16px',
                              height: '16px'
                            }}
                          />
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151'
                          }}>
                            Active
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* City Form */}
                {formType === 'city' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        City Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cityForm.name}
                        onChange={(e) => setCityForm({...cityForm, name: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="Enter city name"
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        District
                      </label>
                      <input
                        type="text"
                        value={selectedDistrict?.name || ''}
                        disabled
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#f8fafc',
                          color: '#64748b'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Pincode
                      </label>
                      <input
                        type="text"
                        pattern="[0-9]{6}"
                        value={cityForm.pincode}
                        onChange={(e) => setCityForm({...cityForm, pincode: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                        placeholder="6-digit PIN code"
                      />
                    </div>
                    
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={cityForm.description}
                        onChange={(e) => setCityForm({...cityForm, description: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          resize: 'vertical',
                          minHeight: '80px'
                        }}
                        placeholder="Brief description of the city"
                      />
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '6px',
                          display: 'block'
                        }}>
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={cityForm.display_order}
                          onChange={(e) => setCityForm({...cityForm, display_order: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                          placeholder="Order for display"
                        />
                      </div>
                      
                      <div style={{ alignItems: 'end', display: 'flex' }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer'
                        }}>
                          <input
                            type="checkbox"
                            checked={cityForm.is_active}
                            onChange={(e) => setCityForm({...cityForm, is_active: e.target.checked})}
                            style={{
                              width: '16px',
                              height: '16px'
                            }}
                          />
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151'
                          }}>
                            Active
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Member Form */}
                {formType === 'member' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '6px',
                        display: 'block'
                      }}>
                        Member <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select
                        required
                        value={memberForm.member_id}
                        onChange={(e) => setMemberForm({...memberForm, member_id: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="">Select a member</option>
                        <option value="101">Rajesh Kumar (ID: 101)</option>
                        <option value="102">Sunita Devi (ID: 102)</option>
                        <option value="103">Ashok Soni (ID: 103)</option>
                        <option value="104">Meera Sharma (ID: 104)</option>
                        <option value="105">Vikash Jain (ID: 105)</option>
                      </select>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '6px',
                          display: 'block'
                        }}>
                          City
                        </label>
                        <input
                          type="text"
                          value={selectedCity?.name || ''}
                          disabled
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: '#f8fafc',
                            color: '#64748b'
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '6px',
                          display: 'block'
                        }}>
                          District
                        </label>
                        <input
                          type="text"
                          value={selectedDistrict?.name || ''}
                          disabled
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: '#f8fafc',
                            color: '#64748b'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '6px',
                          display: 'block'
                        }}>
                          Position Title <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          required
                          value={memberForm.position_title}
                          onChange={(e) => setMemberForm({...memberForm, position_title: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: 'white'
                          }}
                        >
                          <option value="">Select position</option>
                          {positionTitles.map(title => (
                            <option key={title} value={title}>{title}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '6px',
                          display: 'block'
                        }}>
                          Hierarchy Level <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <select
                          required
                          value={memberForm.hierarchy_level}
                          onChange={(e) => setMemberForm({...memberForm, hierarchy_level: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: 'white'
                          }}
                        >
                          <option value="">Select level</option>
                          {hierarchyLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '6px',
                          display: 'block'
                        }}>
                          Term/Year
                        </label>
                        <input
                          type="text"
                          value={memberForm.term_year}
                          onChange={(e) => setMemberForm({...memberForm, term_year: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                          placeholder="e.g., 2024-2026"
                        />
                      </div>
                      
                      <div>
                        <label style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '6px',
                          display: 'block'
                        }}>
                          Display Order
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={memberForm.display_order}
                          onChange={(e) => setMemberForm({...memberForm, display_order: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                          placeholder="Order for display"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={memberForm.is_active}
                          onChange={(e) => setMemberForm({...memberForm, is_active: e.target.checked})}
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151'
                        }}>
                          Active in Organization
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e2e8f0',
                  marginTop: '20px'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForms();
                    }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#64748b',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      backgroundColor: '#22c55e',
                      color: 'white',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Save size={16} />
                    {editingId ? 'Update' : 'Create'} {
                      formType === 'district' ? 'District' :
                      formType === 'city' ? 'City' : 'Member'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SangthanHierarchicalAdmin;