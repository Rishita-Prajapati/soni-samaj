// src/components/Admin/MemberDirectorySearch.jsx
import React, { useState } from 'react';

const MemberDirectorySearch = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    gotra: '',
    fathers_name: '',
    mobile_number: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);

  // Mock data
  const mockMembers = [
    {
      id: '1',
      full_name: 'Rajesh Kumar Soni',
      fathers_name: 'Ram Kumar Soni',
      gotra: 'Kashyap',
      mobile_number: '9876543210',
      email: 'rajesh@email.com',
      city: 'Udaipur',
      occupation: 'Jeweller',
      date_of_birth: '1985-05-15'
    },
    {
      id: '2',
      full_name: 'Priya Soni',
      fathers_name: 'Mohan Lal Soni',
      gotra: 'Bharadwaj',
      mobile_number: '9876543211',
      email: 'priya@email.com',
      city: 'Udaipur',
      occupation: 'Teacher',
      date_of_birth: '1990-08-20'
    },
    {
      id: '3',
      full_name: 'Suresh Kumar Soni',
      fathers_name: 'Gopal Soni',
      gotra: 'Vishwamitra',
      mobile_number: '9876543212',
      email: 'suresh@email.com',
      city: 'Jaipur',
      occupation: 'Business Owner',
      date_of_birth: '1980-12-10'
    }
  ];

  const gotraOptions = [
    '', 'Kashyap', 'Bharadwaj', 'Vishwamitra', 'Jamadagni', 'Vasishta', 
    'Atri', 'Agastya', 'Bhrigu', 'Angiras', 'Gautam', 'Sandilya',
    'Kaundinya', 'Dhanvantari', 'Bharata', 'Mandavya', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const hasSearchTerms = Object.values(searchCriteria).some(value => value.trim() !== '');
    
    if (!hasSearchTerms) {
      alert('Please enter at least one search criterion');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setCurrentPage(1);

    // Simulate API call delay
    setTimeout(() => {
      let filtered = mockMembers;

      // Apply filters
      if (searchCriteria.name.trim()) {
        const nameQuery = searchCriteria.name.trim().toLowerCase();
        filtered = filtered.filter(member =>
          member.full_name && member.full_name.toLowerCase().includes(nameQuery)
        );
      }

      if (searchCriteria.fathers_name.trim()) {
        const fatherNameQuery = searchCriteria.fathers_name.trim().toLowerCase();
        filtered = filtered.filter(member =>
          member.fathers_name && member.fathers_name.toLowerCase().includes(fatherNameQuery)
        );
      }

      if (searchCriteria.mobile_number.trim()) {
        const mobileQuery = searchCriteria.mobile_number.trim();
        filtered = filtered.filter(member =>
          member.mobile_number && member.mobile_number.startsWith(mobileQuery)
        );
      }

      if (searchCriteria.gotra) {
        filtered = filtered.filter(member =>
          member.gotra === searchCriteria.gotra
        );
      }

      setSearchResults(filtered);
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setSearchCriteria({
      name: '',
      gotra: '',
      fathers_name: '',
      mobile_number: ''
    });
    setSearchResults([]);
    setHasSearched(false);
    setCurrentPage(1);
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ backgroundColor: '#ffe4b5', padding: '0 2px' }}>
          {part}
        </mark>
      ) : part
    );
  };

  // Pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff8c00', marginBottom: '8px' }}>
          सदस्य खोज
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          नाम, गोत्र, पिता का नाम या मोबाइल नंबर से सदस्यों को खोजें
        </p>
      </div>

      {/* Search Form */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                Member Name
              </label>
              <input
                type="text"
                name="name"
                value={searchCriteria.name}
                onChange={handleInputChange}
                placeholder="Enter member name..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                Gotra
              </label>
              <select
                name="gotra"
                value={searchCriteria.gotra}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Gotra (All)</option>
                {gotraOptions.slice(1).map(gotra => (
                  <option key={gotra} value={gotra}>{gotra}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                Father's Name
              </label>
              <input
                type="text"
                name="fathers_name"
                value={searchCriteria.fathers_name}
                onChange={handleInputChange}
                placeholder="Enter father's name..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile_number"
                value={searchCriteria.mobile_number}
                onChange={handleInputChange}
                placeholder="Enter mobile number..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginTop: '24px'
          }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 32px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '16px'
              }}
            >
              {loading ? 'Searching...' : 'Search Members'}
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              style={{
                padding: '12px 32px',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div>
          {searchResults.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>
                No members found
              </h3>
              <p>Try adjusting your search criteria or check the spelling.</p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Search Results
                </h2>
                <span style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {searchResults.length} member{searchResults.length !== 1 ? 's' : ''} found
                </span>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {currentResults.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '20px',
                      transition: 'box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                      <div style={{ flexShrink: 0 }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          color: '#6b7280',
                          border: '2px solid #e5e7eb'
                        }}>
                          👤
                        </div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: 'bold',
                              color: '#1f2937',
                              margin: '0 0 8px 0'
                            }}>
                              {highlightSearchTerm(member.full_name, searchCriteria.name)}
                            </h3>
                            
                            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                              <strong>Father:</strong> {highlightSearchTerm(member.fathers_name, searchCriteria.fathers_name)}
                            </div>
                            
                            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                              <strong>Gotra:</strong> 
                              <span style={{
                                backgroundColor: searchCriteria.gotra === member.gotra ? '#fef08a' : 'transparent',
                                padding: searchCriteria.gotra === member.gotra ? '0 4px' : '0',
                                marginLeft: '4px'
                              }}>
                                {member.gotra}
                              </span>
                            </div>
                            
                            {member.occupation && (
                              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                <strong>Occupation:</strong> {member.occupation}
                              </div>
                            )}
                          </div>

                          <div>
                            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                              <strong>Mobile:</strong> {highlightSearchTerm(member.mobile_number, searchCriteria.mobile_number)}
                            </div>
                            

                            
                            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                              <strong>City:</strong> {member.city}
                            </div>
                            

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: currentPage === i + 1 ? '#ff8c00' : 'white',
                        color: currentPage === i + 1 ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontWeight: currentPage === i + 1 ? '600' : '400'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search Tips */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
          Search Tips:
        </h3>
        <ul style={{ color: '#6b7280', fontSize: '14px', margin: 0, paddingLeft: '20px' }}>
          <li>Enter at least one search criterion to find members</li>
          <li>Name and Father's Name searches are partial matches</li>
          <li>Mobile number search matches numbers starting with your input</li>
          <li>Gotra search requires exact selection from the dropdown</li>
          <li>Use multiple criteria to narrow down your search results</li>
        </ul>
      </div>

      {/* Community Notice */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#fff5e1',
        border: '1px solid #ff8c00',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>🏛️</span>
          <div>
            <strong style={{ color: '#ff8c00' }}>सोनी समाज उदयपुर:</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#ff8c00' }}>
              समुदाय के सदस्यों से जुड़ें और संपर्क बनाए रखें। केवल सार्वजनिक जानकारी दिखाई जाती है।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDirectorySearch;