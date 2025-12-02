import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const hamburgerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
        setShowHamburgerMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      const searchableContent = [
        { title: 'Badhai Events', keywords: ['badhai', 'congratulations', 'celebration', 'happy', 'joy'], path: '/events/badhai', type: 'event' },
        { title: 'Shok Samachar', keywords: ['shok', 'sad', 'condolence', 'death', 'mourning', 'grief'], path: '/events/shok-samachar', type: 'event' },
        { title: 'Today\'s Birthday', keywords: ['birthday', 'birth', 'celebration', 'cake', 'party', 'age'], path: '/events/todays-birthday', type: 'event' },
        { title: 'News Events', keywords: ['news', 'updates', 'information', 'announcement', 'latest'], path: '/events/news', type: 'event' },
        { title: 'Sangathan Members', keywords: ['sangathan', 'members', 'organization', 'committee', 'leaders'], path: '/sangathan', type: 'sangathan' },
        { title: 'About Soni Samaj', keywords: ['about', 'history', 'community', 'soni', 'samaj', 'heritage'], path: '/about', type: 'about' },
        { title: 'Contact Information', keywords: ['contact', 'phone', 'address', 'email', 'reach', 'help'], path: '/contact', type: 'about' },
        { title: 'Kul Devta', keywords: ['kul', 'devta', 'deity', 'god', 'worship', 'temple', 'spiritual'], path: '/kul-devta', type: 'about' }
      ];
      
      const queryLower = query.toLowerCase();
      const filtered = searchableContent.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(queryLower);
        const keywordMatch = item.keywords.some(keyword => 
          keyword.includes(queryLower) || queryLower.includes(keyword)
        );
        return titleMatch || keywordMatch;
      });
      
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleResultClick = (path) => {
    navigate(path);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const toggleHamburgerMenu = () => {
    setShowHamburgerMenu(!showHamburgerMenu);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <img src="/Logo.png" alt="Soni Samaj Logo" className="logo-img" />
        </div>

        {/* Navigation, Search, and Register - All on Right */}
        <nav className="nav-menu">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item dropdown" ref={dropdownRef}>
              <span 
                className="nav-link dropdown-trigger"
                onClick={() => handleDropdownToggle('events')}
              >
                Events
                <span className={`dropdown-arrow ${activeDropdown === 'events' ? 'active' : ''}`}>▼</span>
              </span>
              <div className={`dropdown-menu ${activeDropdown === 'events' ? 'active' : ''}`}>
                <Link to="/events/badhai" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Badhai</Link>
                <Link to="/events/shok-samachar" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Shok Samachar</Link>
                <Link to="/events/todays-birthday" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Today's Birthday</Link>
                <Link to="/events/news" className="dropdown-link" onClick={() => setActiveDropdown(null)}>News</Link>
              </div>
            </li>
            <li className="nav-item">
              <Link to="/sangathan" className="nav-link">Sangathan</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          </ul>
          
          {/* Hamburger Menu */}
          <div className="hamburger-menu" ref={hamburgerRef}>
            <div className="hamburger-icon" onClick={toggleHamburgerMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={`hamburger-dropdown ${showHamburgerMenu ? 'active' : ''}`}>
              <Link to="/about" className="hamburger-link" onClick={() => setShowHamburgerMenu(false)}>About</Link>
              <Link to="/kul-devta" className="hamburger-link" onClick={() => setShowHamburgerMenu(false)}>Kul Devta</Link>
            </div>
          </div>
          
          {/* Search */}
          <div className="search-container" ref={searchRef}>
            {showSearch && (
              <div className="search-form">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Search events, sangathan, about..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                    autoFocus
                  />
                </form>
                {searchQuery.trim() && (
                  <div className="search-results">
                    {searchResults.length > 0 ? (
                      searchResults.map((result, index) => (
                        <div 
                          key={index} 
                          className="search-result-item"
                          onClick={() => handleResultClick(result.path)}
                        >
                          <span className="result-type">{result.type}</span>
                          <span className="result-title">{result.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="no-results">
                        <span className="no-results-icon">🔍</span>
                        <span className="no-results-text">No results found</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="search-icon" onClick={handleSearchToggle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>

          {/* Register Button */}
          <Link to="/register" className="register-link">RIGISTRATION</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;