import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import badhaiService from '../services/badhaiService';
import shokService from '../services/shokService';
import newsService from '../services/newsService';
import './EventsDisplay.css';

const EventsDisplay = ({ eventType = 'all' }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(eventType);

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    setLoading(true);
    let allEvents = [];
    
    try {
      if (filter === 'all' || filter === 'badhai') {
        const badhaiResult = await badhaiService.getAllBadhai();
        if (badhaiResult.success) {
          const badhaiEvents = badhaiResult.data.map(event => ({
            ...event,
            type: 'badhai',
            description: `${event.celebration_person_name} - ${event.occasion_type}`
          }));
          allEvents = [...allEvents, ...badhaiEvents];
        }
      }
      
      if (filter === 'all' || filter === 'shok') {
        const shokResult = await shokService.getAllShok();
        if (shokResult.success) {
          const shokEvents = shokResult.data.map(event => ({
            ...event,
            type: 'shok',
            description: `${event.deceased_name} - Age ${event.age_at_death || 'N/A'}`
          }));
          allEvents = [...allEvents, ...shokEvents];
        }
      }
      
      if (filter === 'all' || filter === 'news') {
        const newsResult = await newsService.getAllNews();
        if (newsResult.success) {
          const newsEvents = newsResult.data.map(event => ({
            ...event,
            type: 'news',
            description: event.news_headline
          }));
          allEvents = [...allEvents, ...newsEvents];
        }
      }
      
      // Sort by creation date
      allEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    }
    
    setLoading(false);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'badhai':
        return '🎉';
      case 'shok':
        return '🙏';
      case 'news':
        return '📰';
      default:
        return '📝';
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'badhai':
        return 'बधाई समाचार';
      case 'shok':
        return 'शोक समाचार';
      case 'news':
        return 'समाचार';
      default:
        return 'समाचार';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading">समाचार लोड हो रहे हैं...</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>📰 समुदाय समाचार</h1>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            सभी समाचार
          </button>
          <button 
            className={filter === 'badhai' ? 'active' : ''}
            onClick={() => setFilter('badhai')}
          >
            बधाई समाचार
          </button>
          <button 
            className={filter === 'shok' ? 'active' : ''}
            onClick={() => setFilter('shok')}
          >
            शोक समाचार
          </button>
          <button 
            className={filter === 'news' ? 'active' : ''}
            onClick={() => setFilter('news')}
          >
            समाचार
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>कोई समाचार उपलब्ध नहीं है</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className={`event-card ${event.type}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="event-header">
                <div className="event-icon">
                  {getEventIcon(event.type)}
                </div>
                <div className="event-meta">
                  <span className="event-type">
                    {getEventTypeLabel(event.type)}
                  </span>
                  <span className="event-date">
                    {formatDate(event.created_at)}
                  </span>
                </div>
              </div>
              
              <div className="event-content">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
              
              <div className="event-footer">
                <div className="event-actions">
                  <button className="share-btn">
                    📤 साझा करें
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsDisplay;