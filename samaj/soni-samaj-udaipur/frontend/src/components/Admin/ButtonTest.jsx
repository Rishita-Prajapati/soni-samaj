import React, { useState } from 'react';

const ButtonTest = () => {
  const [showForm, setShowForm] = useState(false);
  
  const handleShowForm = () => {
    console.log('Test button clicked');
    setShowForm(true);
  };
  
  const handleHideForm = () => {
    setShowForm(false);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Button Test Component</h2>
      <p>Current showForm state: {showForm.toString()}</p>
      
      <button 
        onClick={handleShowForm}
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500',
          marginRight: '10px'
        }}
      >
        ➕ Show Form
      </button>
      
      <button 
        onClick={handleHideForm}
        style={{
          background: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        ✕ Hide Form
      </button>
      
      {showForm && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          border: '2px solid #10b981',
          borderRadius: '8px',
          background: '#f0fdf4'
        }}>
          <h3>✅ Form is now visible!</h3>
          <p>This proves the button functionality works correctly.</p>
          <button onClick={handleHideForm}>Close Form</button>
        </div>
      )}
    </div>
  );
};

export default ButtonTest;