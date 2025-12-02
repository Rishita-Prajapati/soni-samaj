import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ImageUpload from '../ImageUpload';
import './SangathanManagement.css';

const SangathanManagement = ({ admin, onLogout }) => {
  // View state
  const [view, setView] = useState('districts');
  
  // Data states
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Selection states
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  
  // Form visibility states
  const [showDistrictForm, setShowDistrictForm] = useState(false);
  const [showCityForm, setShowCityForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  
  // Editing states
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [editingCity, setEditingCity] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  
  // District form data
  const [districtName, setDistrictName] = useState('');
  const [districtDescription, setDistrictDescription] = useState('');
  const [districtImage, setDistrictImage] = useState(null);
  
  // City form data
  const [cityName, setCityName] = useState('');
  const [cityDescription, setCityDescription] = useState('');
  const [cityImage, setCityImage] = useState(null);
  
  // Member form data
  const [memberName, setMemberName] = useState('');
  const [memberMobile, setMemberMobile] = useState('');
  const [memberPosition, setMemberPosition] = useState('');
  const [memberCategory, setMemberCategory] = useState('');
  const [memberImage, setMemberImage] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    loadLocalData();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveLocalData();
  }, [districts, cities, members]);

  // Local Storage Functions
  const loadLocalData = () => {
    try {
      const savedDistricts = localStorage.getItem('sangathan_districts');
      const savedCities = localStorage.getItem('sangathan_cities');
      const savedMembers = localStorage.getItem('sangathan_members');
      
      if (savedDistricts) setDistricts(JSON.parse(savedDistricts));
      if (savedCities) setCities(JSON.parse(savedCities));
      if (savedMembers) setMembers(JSON.parse(savedMembers));
    } catch (error) {
      console.error('Error loading local data:', error);
    }
  };

  const saveLocalData = () => {
    try {
      localStorage.setItem('sangathan_districts', JSON.stringify(districts));
      localStorage.setItem('sangathan_cities', JSON.stringify(cities));
      localStorage.setItem('sangathan_members', JSON.stringify(members));
    } catch (error) {
      console.error('Error saving local data:', error);
    }
  };

  // Generate unique ID
  const generateId = () => {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Convert image to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // District handlers
  const handleDistrictSave = async (e) => {
    e.preventDefault();
    if (!districtName.trim()) {
      alert('Please enter district name');
      return;
    }

    try {
      setLoading(true);
      
      let imageUrl = editingDistrict?.image_url || '';
      
      if (districtImage) {
        imageUrl = await convertImageToBase64(districtImage);
      }

      const districtData = {
        id: editingDistrict?.id || generateId(),
        name: districtName,
        description: districtDescription,
        image_url: imageUrl,
        created_at: editingDistrict?.created_at || new Date().toISOString()
      };

      if (editingDistrict) {
        setDistricts(districts.map(d => d.id === editingDistrict.id ? districtData : d));
        alert('District updated successfully!');
      } else {
        setDistricts([districtData, ...districts]);
        alert('District added successfully!');
      }

      setShowDistrictForm(false);
      setEditingDistrict(null);
      setDistrictName('');
      setDistrictDescription('');
      setDistrictImage(null);
    } catch (error) {
      console.error('Error saving district:', error);
      alert('Error saving district: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictDelete = (districtId) => {
    if (!window.confirm('Delete this district? All cities and members under it will also be deleted.')) {
      return;
    }

    try {
      // Delete district
      setDistricts(districts.filter(d => d.id !== districtId));
      
      // Delete all cities under this district
      const districtCityIds = cities.filter(c => c.district_id === districtId).map(c => c.id);
      setCities(cities.filter(c => c.district_id !== districtId));
      
      // Delete all members under deleted cities
      setMembers(members.filter(m => !districtCityIds.includes(m.city_id)));
      
      alert('District deleted successfully!');
    } catch (error) {
      console.error('Error deleting district:', error);
      alert('Error deleting district: ' + error.message);
    }
  };

  // City handlers
  const handleCitySave = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) {
      alert('Please enter city name');
      return;
    }

    try {
      setLoading(true);
      
      let imageUrl = editingCity?.image_url || '';
      
      if (cityImage) {
        imageUrl = await convertImageToBase64(cityImage);
      }

      const cityData = {
        id: editingCity?.id || generateId(),
        name: cityName,
        description: cityDescription,
        district_id: selectedDistrict.id,
        image_url: imageUrl,
        created_at: editingCity?.created_at || new Date().toISOString()
      };

      if (editingCity) {
        setCities(cities.map(c => c.id === editingCity.id ? cityData : c));
        alert('City updated successfully!');
      } else {
        setCities([cityData, ...cities]);
        alert('City added successfully!');
      }

      setShowCityForm(false);
      setEditingCity(null);
      setCityName('');
      setCityDescription('');
      setCityImage(null);
    } catch (error) {
      console.error('Error saving city:', error);
      alert('Error saving city: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCityDelete = (cityId) => {
    if (!window.confirm('Delete this city? All members under it will also be deleted.')) {
      return;
    }

    try {
      // Delete city
      setCities(cities.filter(c => c.id !== cityId));
      
      // Delete all members under this city
      setMembers(members.filter(m => m.city_id !== cityId));
      
      alert('City deleted successfully!');
    } catch (error) {
      console.error('Error deleting city:', error);
      alert('Error deleting city: ' + error.message);
    }
  };

  // Member handlers
  const handleMemberSave = async (e) => {
    e.preventDefault();
    if (!memberName.trim() || !memberMobile.trim() || !memberPosition.trim() || !memberCategory) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      
      let imageUrl = editingMember?.image_url || '';
      
      if (memberImage) {
        imageUrl = await convertImageToBase64(memberImage);
      }

      const memberData = {
        id: editingMember?.id || generateId(),
        full_name: memberName,
        mobile: memberMobile,
        position: memberPosition,
        category: memberCategory,
        city_id: selectedCity.id,
        image_url: imageUrl,
        created_at: editingMember?.created_at || new Date().toISOString()
      };

      if (editingMember) {
        setMembers(members.map(m => m.id === editingMember.id ? memberData : m));
        alert('Member updated successfully!');
      } else {
        setMembers([memberData, ...members]);
        alert('Member added successfully!');
      }

      setShowMemberForm(false);
      setEditingMember(null);
      setMemberName('');
      setMemberMobile('');
      setMemberPosition('');
      setMemberCategory('');
      setMemberImage(null);
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Error saving member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberDelete = (memberId) => {
    if (!window.confirm('Delete this member?')) {
      return;
    }

    try {
      setMembers(members.filter(m => m.id !== memberId));
      alert('Member deleted successfully!');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error deleting member: ' + error.message);
    }
  };

  // Get filtered cities and members
  const getDistrictCities = () => {
    return cities.filter(c => c.district_id === selectedDistrict?.id);
  };

  const getCityMembers = () => {
    return members.filter(m => m.city_id === selectedCity?.id);
  };

  return (
    <AdminLayout admin={admin} onLogout={onLogout}>
      <div className="sangathan-management">
        
        {/* Breadcrumb */}
        {(selectedDistrict || selectedCity) && (
          <div className="breadcrumb">
            <span 
              className={view === 'districts' ? 'active' : ''}
              onClick={() => {
                setView('districts');
                setSelectedDistrict(null);
                setSelectedCity(null);
                setShowDistrictForm(false);
                setShowCityForm(false);
                setShowMemberForm(false);
              }}
            >
              🏛️ Districts
            </span>
            
            {selectedDistrict && (
              <>
                <span className="separator">→</span>
                <span 
                  className={view === 'cities' ? 'active' : ''}
                  onClick={() => {
                    setView('cities');
                    setSelectedCity(null);
                    setShowCityForm(false);
                    setShowMemberForm(false);
                  }}
                >
                  🏙️ {selectedDistrict.name}
                </span>
              </>
            )}
            
            {selectedCity && (
              <>
                <span className="separator">→</span>
                <span className="active">
                  👥 {selectedCity.name}
                </span>
              </>
            )}
          </div>
        )}

        {/* DISTRICTS VIEW */}
        {view === 'districts' && (
          <div className="content-wrapper">
            <div className="page-header">
              <div className="header-info">
                <h1>🏛️ Sangathan Management</h1>
                <p>Manage districts, cities, and members (Local Storage)</p>
              </div>
              <button 
                className="btn-add"
                onClick={() => {
                  setShowDistrictForm(true);
                  setEditingDistrict(null);
                  setDistrictName('');
                  setDistrictDescription('');
                  setDistrictImage(null);
                }}
                style={{ position: 'relative', zIndex: 999 }}
              >
                ➕ Add District
              </button>
            </div>

            {showDistrictForm && (
              <div className="form-container">
                <div className="form-header">
                  <h2>{editingDistrict ? '✏️ Edit District' : '➕ Add District'}</h2>
                  <button 
                    className="btn-close"
                    onClick={() => {
                      setShowDistrictForm(false);
                      setEditingDistrict(null);
                      setDistrictName('');
                      setDistrictDescription('');
                      setDistrictImage(null);
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleDistrictSave} className="form-content">
                  <div className="form-group">
                    <label>District Name *</label>
                    <input
                      type="text"
                      value={districtName}
                      onChange={(e) => setDistrictName(e.target.value)}
                      placeholder="Enter district name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={districtDescription}
                      onChange={(e) => setDistrictDescription(e.target.value)}
                      placeholder="Enter description (optional)"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <ImageUpload
                      label="District Image"
                      onImageSelect={setDistrictImage}
                      currentImage={editingDistrict?.image_url}
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => {
                        setShowDistrictForm(false);
                        setEditingDistrict(null);
                        setDistrictName('');
                        setDistrictDescription('');
                        setDistrictImage(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Saving...' : (editingDistrict ? 'Update' : 'Add') + ' District'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="cards-grid">
              {districts.length === 0 ? (
                <div className="empty-state">
                  <h3>No Districts Found</h3>
                  <p>Click "Add District" to create your first district</p>
                </div>
              ) : (
                districts.map((district) => (
                  <div key={district.id} className="card">
                    <div className="card-header">
                      <div className="card-info">
                        <h3>{district.name}</h3>
                        {district.description && <p>{district.description}</p>}
                      </div>
                      {district.image_url && (
                        <div className="card-image">
                          <img src={district.image_url} alt={district.name} />
                        </div>
                      )}
                    </div>
                    
                    <div className="card-actions">
                      <button
                        className="btn-view"
                        onClick={() => {
                          setSelectedDistrict(district);
                          setView('cities');
                        }}
                      >
                        View Cities →
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingDistrict(district);
                          setDistrictName(district.name);
                          setDistrictDescription(district.description || '');
                          setDistrictImage(null);
                          setShowDistrictForm(true);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDistrictDelete(district.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* CITIES VIEW */}
        {view === 'cities' && (
          <div className="content-wrapper">
            <div className="page-header">
              <div className="header-info">
                <h1>🏙️ Cities in {selectedDistrict?.name}</h1>
                <p>Manage cities under this district</p>
              </div>
              <button 
                className="btn-add"
                onClick={() => {
                  setShowCityForm(true);
                  setEditingCity(null);
                  setCityName('');
                  setCityDescription('');
                  setCityImage(null);
                }}
                style={{ position: 'relative', zIndex: 999 }}
              >
                ➕ Add City
              </button>
            </div>

            {showCityForm && (
              <div className="form-container">
                <div className="form-header">
                  <h2>{editingCity ? '✏️ Edit City' : '➕ Add City'}</h2>
                  <button 
                    className="btn-close"
                    onClick={() => {
                      setShowCityForm(false);
                      setEditingCity(null);
                      setCityName('');
                      setCityDescription('');
                      setCityImage(null);
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCitySave} className="form-content">
                  <div className="form-group">
                    <label>City Name *</label>
                    <input
                      type="text"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      placeholder="Enter city name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={cityDescription}
                      onChange={(e) => setCityDescription(e.target.value)}
                      placeholder="Enter description (optional)"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <ImageUpload
                      label="City Image"
                      onImageSelect={setCityImage}
                      currentImage={editingCity?.image_url}
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => {
                        setShowCityForm(false);
                        setEditingCity(null);
                        setCityName('');
                        setCityDescription('');
                        setCityImage(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Saving...' : (editingCity ? 'Update' : 'Add') + ' City'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="cards-grid">
              {getDistrictCities().length === 0 ? (
                <div className="empty-state">
                  <h3>No Cities Found</h3>
                  <p>Click "Add City" to create your first city</p>
                </div>
              ) : (
                getDistrictCities().map((city) => (
                  <div key={city.id} className="card">
                    <div className="card-header">
                      <div className="card-info">
                        <h3>{city.name}</h3>
                        {city.description && <p>{city.description}</p>}
                      </div>
                      {city.image_url && (
                        <div className="card-image">
                          <img src={city.image_url} alt={city.name} />
                        </div>
                      )}
                    </div>
                    
                    <div className="card-actions">
                      <button
                        className="btn-view"
                        onClick={() => {
                          setSelectedCity(city);
                          setView('members');
                        }}
                      >
                        View Members →
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingCity(city);
                          setCityName(city.name);
                          setCityDescription(city.description || '');
                          setCityImage(null);
                          setShowCityForm(true);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleCityDelete(city.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* MEMBERS VIEW */}
        {view === 'members' && (
          <div className="content-wrapper">
            <div className="page-header">
              <div className="header-info">
                <h1>👥 Members in {selectedCity?.name}</h1>
                <p>Manage members under this city</p>
              </div>
              <button 
                className="btn-add"
                onClick={() => {
                  setShowMemberForm(true);
                  setEditingMember(null);
                  setMemberName('');
                  setMemberMobile('');
                  setMemberPosition('');
                  setMemberCategory('');
                  setMemberImage(null);
                }}
                style={{ position: 'relative', zIndex: 999 }}
              >
                ➕ Add Member
              </button>
            </div>

            {showMemberForm && (
              <div className="form-container">
                <div className="form-header">
                  <h2>{editingMember ? '✏️ Edit Member' : '➕ Add Member'}</h2>
                  <button 
                    className="btn-close"
                    onClick={() => {
                      setShowMemberForm(false);
                      setEditingMember(null);
                      setMemberName('');
                      setMemberMobile('');
                      setMemberPosition('');
                      setMemberCategory('');
                      setMemberImage(null);
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleMemberSave} className="form-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        value={memberMobile}
                        onChange={(e) => setMemberMobile(e.target.value)}
                        placeholder="Enter mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Position *</label>
                      <input
                        type="text"
                        value={memberPosition}
                        onChange={(e) => setMemberPosition(e.target.value)}
                        placeholder="e.g., President, Secretary"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={memberCategory}
                        onChange={(e) => setMemberCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Executive">Executive</option>
                        <option value="Advisory">Advisory</option>
                        <option value="Administrative">Administrative</option>
                        <option value="Financial">Financial</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Social">Social</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <ImageUpload
                      label="Member Photo"
                      onImageSelect={setMemberImage}
                      currentImage={editingMember?.image_url}
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => {
                        setShowMemberForm(false);
                        setEditingMember(null);
                        setMemberName('');
                        setMemberMobile('');
                        setMemberPosition('');
                        setMemberCategory('');
                        setMemberImage(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit" disabled={loading}>
                      {loading ? 'Saving...' : (editingMember ? 'Update' : 'Add') + ' Member'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="cards-grid">
              {getCityMembers().length === 0 ? (
                <div className="empty-state">
                  <h3>No Members Found</h3>
                  <p>Click "Add Member" to create your first member</p>
                </div>
              ) : (
                getCityMembers().map((member) => (
                  <div key={member.id} className="card">
                    <div className="card-header">
                      <div className="card-info">
                        <h3>{member.full_name}</h3>
                        <div className="member-badge">{member.position}</div>
                        <p>Category: {member.category}</p>
                        <p>📱 {member.mobile}</p>
                      </div>
                      {member.image_url && (
                        <div className="card-image">
                          <img src={member.image_url} alt={member.full_name} />
                        </div>
                      )}
                    </div>
                    
                    <div className="card-actions">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingMember(member);
                          setMemberName(member.full_name);
                          setMemberMobile(member.mobile);
                          setMemberPosition(member.position);
                          setMemberCategory(member.category);
                          setMemberImage(null);
                          setShowMemberForm(true);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleMemberDelete(member.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default SangathanManagement;