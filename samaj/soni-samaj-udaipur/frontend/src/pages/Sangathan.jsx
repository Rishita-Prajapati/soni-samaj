import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import PageHeader from '../components/PageHeader';
import './Sangathan.css';

const Sangathan = () => {
  const [currentView, setCurrentView] = useState('districts');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [sangathanData, setSangathanData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSangathanData();
  }, []);

  const loadSangathanData = async () => {
    try {
      const { data, error } = await supabase
        .from('sangathan')
        .select('*')
        .eq('is_active', true)
        .order('district', { ascending: true })
        .order('city', { ascending: true });

      if (error) throw error;

      const groupedData = {};
      data?.forEach(member => {
        if (!groupedData[member.district]) {
          groupedData[member.district] = {
            name: member.district,
            image: member.district_image_url || '/default-district.jpg',
            cities: {},
            cityCount: 0
          };
        }
        
        if (!groupedData[member.district].cities[member.city]) {
          groupedData[member.district].cities[member.city] = {
            name: member.city,
            image: member.city_image_url || '/default-city.jpg',
            description: `Discover more about ${member.city} city.`,
            members: []
          };
          groupedData[member.district].cityCount++;
        }
        
        groupedData[member.district].cities[member.city].members.push(member);
      });

      setSangathanData(groupedData);
    } catch (error) {
      console.error('Error loading sangathan data:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleDistrictClick = (districtKey) => {
    setSelectedDistrict(districtKey);
    setCurrentView('cities');
  };

  const handleCityClick = (cityKey) => {
    setSelectedCity(cityKey);
    setCurrentView('members');
  };

  const handleBackToDistricts = () => {
    setCurrentView('districts');
    setSelectedDistrict(null);
    setSelectedCity(null);
  };

  const handleBackToCities = () => {
    setCurrentView('cities');
    setSelectedCity(null);
  };

  // Districts View
  if (currentView === 'districts') {
    return (
      <div className="sangathan-page">
        <PageHeader 
          title="Sangathan" 
          subtitle="Meet the dedicated leaders and members who serve our community" 
        />

        <div className="sangathan-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⏳</div>
              <p>Loading sangathan data...</p>
            </div>
          ) : Object.keys(sangathanData).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏛️</div>
              <h2>No Sangathan Data Available</h2>
              <p>Please add sangathan members from admin panel.</p>
            </div>
          ) : (
            <div className="districts-grid">
              {Object.entries(sangathanData).map(([key, district]) => (
                <div key={key} className="district-card" onClick={() => handleDistrictClick(key)}>
                  <div className="district-image">
                    <img src={district.image} alt={district.name} />
                  </div>
                  <div className="district-info">
                    <h3>{district.name}</h3>
                    <p>{district.cityCount} Cities available in this district.</p>
                    <button className="see-details-btn">
                      See Details <span className="arrow">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Cities View
  if (currentView === 'cities' && selectedDistrict) {
    const district = sangathanData[selectedDistrict];
    return (
      <div className="sangathan-page">
        <div className="sangathan-header">
          <div className="container">
            <h1>{district.name} - Cities</h1>
            <p>Explore the cities under the {district.name} district.</p>
          </div>
        </div>

        <div className="sangathan-content">
          <div className="cities-grid">
            {Object.entries(district.cities || {}).map(([key, city]) => (
              <div key={key} className="city-card" onClick={() => handleCityClick(key)}>
                <div className="city-image">
                  <img src={city.image} alt={city.name} />
                </div>
                <div className="city-info">
                  <h3>{city.name}</h3>
                  <p>{city.description}</p>
                  <button className="see-details-btn">See Details</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="back-button-container">
            <button className="back-btn" onClick={handleBackToDistricts}>
              ← Back to Districts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Members View
  if (currentView === 'members' && selectedDistrict && selectedCity) {
    const district = sangathanData[selectedDistrict];
    const city = (district.cities || {})[selectedCity];
    
    return (
      <div className="sangathan-page">
        <div className="sangathan-header">
          <div className="container">
            <h1>{city.name} Sangathan Members</h1>
            <p>{district.name} District</p>
          </div>
        </div>

        <div className="sangathan-content">
          <div className="members-section">
            <h2 className="section-title">Sangathan Members</h2>
            
            <div className="members-grid">
              {city.members.map((member) => (
                <div key={member.id} className="member-card">
                  <div className="member-image">
                    <img src={member.image_url || '/default-member.jpg'} alt={member.full_name} />
                  </div>
                  <div className="member-contact">
                    <div className="phone-icon">
                      <span>📞</span>
                    </div>
                    <a href={`tel:${member.mobile}`} className="phone-number">
                      {member.mobile}
                    </a>
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.full_name}</h3>
                    <span className={`member-role ${member.position.toLowerCase()}`}>
                      {member.position}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="back-button-container">
            <button className="back-btn" onClick={handleBackToCities}>
              ← Back to Cities
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Sangathan;