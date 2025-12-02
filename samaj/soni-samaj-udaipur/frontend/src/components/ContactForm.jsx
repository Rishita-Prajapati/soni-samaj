import React, { useState } from 'react';
import { messageService } from '../supabase/services/memberService';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    message: '',
    type: 'general'
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.senderName.trim() || !formData.message.trim()) {
      alert('कृपया नाम और संदेश भरें।');
      return;
    }

    setSending(true);
    const messageData = {
      name: formData.senderName,
      email: formData.senderEmail,
      phone: formData.senderPhone,
      subject: formData.type,
      message: formData.message
    };
    
    const result = await messageService.createMessage(messageData);
    
    if (result.success) {
      setSubmitted(true);
      setFormData({
        senderName: '',
        senderEmail: '',
        senderPhone: '',
        message: '',
        type: 'general'
      });
      
      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } else {
      alert('संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    }
    
    setSending(false);
  };

  if (submitted) {
    return (
      <div className="contact-form-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>धन्यवाद!</h2>
          <p>आपका संदेश सफलतापूर्वक भेजा गया है।</p>
          <p>हम जल्द ही आपसे संपर्क करेंगे।</p>
          <button 
            className="new-message-btn"
            onClick={() => setSubmitted(false)}
          >
            नया संदेश भेजें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-container">
      <div className="contact-header">
        <h1>📞 संपर्क करें</h1>
        <p>हमें अपने सुझाव, शिकायत या प्रतिक्रिया भेजें</p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="senderName">नाम *</label>
            <input
              type="text"
              id="senderName"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              placeholder="आपका पूरा नाम"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">संदेश प्रकार</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="general">सामान्य संदेश</option>
              <option value="suggestion">सुझाव</option>
              <option value="feedback">प्रतिक्रिया</option>
              <option value="complaint">शिकायत</option>
              <option value="inquiry">पूछताछ</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="senderEmail">ईमेल</label>
            <input
              type="email"
              id="senderEmail"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleInputChange}
              placeholder="आपका ईमेल पता (वैकल्पिक)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="senderPhone">मोबाइल नंबर</label>
            <input
              type="tel"
              id="senderPhone"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleInputChange}
              placeholder="आपका मोबाइल नंबर (वैकल्पिक)"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="message">संदेश *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="अपना संदेश यहाँ लिखें..."
            rows="6"
            required
          />
        </div>

        <button type="submit" disabled={sending} className="submit-btn">
          {sending ? (
            <>
              <span className="spinner"></span>
              भेजा जा रहा है...
            </>
          ) : (
            '📤 संदेश भेजें'
          )}
        </button>
      </form>

      <div className="contact-info">
        <h3>अन्य संपर्क माध्यम</h3>
        <div className="contact-methods">
          <div className="contact-method">
            <span className="icon">📧</span>
            <div>
              <strong>ईमेल</strong>
              <p>sonisamaj.udaipur@gmail.com</p>
            </div>
          </div>
          
          <div className="contact-method">
            <span className="icon">📱</span>
            <div>
              <strong>व्हाट्सऐप</strong>
              <p>+91 98765 43210</p>
            </div>
          </div>
          
          <div className="contact-method">
            <span className="icon">📍</span>
            <div>
              <strong>पता</strong>
              <p>सोनी समाज भवन, उदयपुर, राजस्थान</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;