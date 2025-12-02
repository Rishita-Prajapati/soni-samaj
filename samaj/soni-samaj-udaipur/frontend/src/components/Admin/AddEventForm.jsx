import React, { useState } from 'react';
import eventsService from '../../services/eventsService';

const AddEventForm = ({ eventType, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    type: eventType
  });
  const [loading, setLoading] = useState(false);

  const eventTypeConfig = {
    badhai: {
      title: 'Add Badhai Event',
      icon: '🎉',
      placeholder: {
        title: 'e.g., Wedding Celebration, New Business Opening',
        subtitle: 'e.g., Beautiful union blessed by tradition',
        description: 'Detailed description of the celebration...'
      }
    },
    shok: {
      title: 'Add Shok Samachar',
      icon: '🕊️',
      placeholder: {
        title: 'e.g., In Loving Memory, Prayer Meeting',
        subtitle: 'e.g., Peaceful passing of respected community elder',
        description: 'Details about the memorial service...'
      }
    },
    news: {
      title: 'Add News Article',
      icon: '📰',
      placeholder: {
        title: 'e.g., Community Center Renovation',
        subtitle: 'e.g., Major modernization project begins',
        description: 'Full details about the news...'
      }
    },
    birthday: {
      title: 'Add Birthday Event',
      icon: '🎂',
      placeholder: {
        title: 'e.g., Birthday Celebration',
        subtitle: 'e.g., Celebrating another year of life',
        description: 'Birthday celebration details...'
      }
    }
  };

  const config = eventTypeConfig[eventType] || eventTypeConfig.news;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await eventsService.addEvent(formData);
      alert('Event added successfully!');
      onSuccess && onSuccess();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      background: 'linear-gradient(135deg, #FFF5E1, #FFEAA7)',
      minHeight: '100vh'
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        background: 'linear-gradient(135deg, #FF9933, #800000)',
        color: 'white',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 8px 25px rgba(255, 153, 51, 0.3)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{config.icon}</div>
        <h2 style={{ color: 'white', marginBottom: '5px', margin: 0 }}>{config.title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', margin: '10px 0 0 0' }}>Fill in the details below</p>
      </div>

      <form onSubmit={handleSubmit} style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '15px', 
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        border: '2px solid #FFE4B5'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={config.placeholder.title}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
            Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder={config.placeholder.subtitle}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={config.placeholder.description}
            required
            rows="5"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              border: '2px solid #FFE4B5',
              borderRadius: '8px',
              background: 'white',
              color: '#800000',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #FF9933, #800000)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(255, 153, 51, 0.3)'
            }}
          >
            {loading ? 'Adding...' : `Add ${eventType === 'badhai' ? 'Badhai' : eventType === 'shok' ? 'Shok' : eventType === 'birthday' ? 'Birthday' : 'News'}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventForm;