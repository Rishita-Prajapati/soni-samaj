import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/config';
import PageHeader from './PageHeader';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          is_read: false,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <PageHeader 
        title="Contact Us" 
        subtitle="Get in touch with Soni Samaj Udaipur - We're here to help" 
      />

      {/* Contact Information Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3>Our Address</h3>
              <p>
                Soni Samaj Bhawan<br/>
                City Palace Road<br/>
                Udaipur, Rajasthan 313001<br/>
                India
              </p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3>Phone Numbers</h3>
              <p>
                Office: +91 294 241 XXXX<br/>
                President: +91 98XX XXX XXX<br/>
                Secretary: +91 97XX XXX XXX<br/>
                Emergency: +91 99XX XXX XXX
              </p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3>Email Addresses</h3>
              <p>
                General: info@sonisamajudaipur.org<br/>
                Events: events@sonisamajudaipur.org<br/>
                Membership: membership@sonisamajudaipur.org<br/>
                Support: support@sonisamajudaipur.org
              </p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">🕒</div>
              <h3>Office Hours</h3>
              <p>
                Monday - Friday: 9:00 AM - 6:00 PM<br/>
                Saturday: 9:00 AM - 2:00 PM<br/>
                Sunday: Closed<br/>
                (Emergency services available 24/7)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-content">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Have questions or need assistance? Fill out the form below and we'll get back to you promptly.</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="membership">Membership Inquiry</option>
                    <option value="events">Event Information</option>
                    <option value="support">Community Support</option>
                    <option value="business">Business Networking</option>
                    <option value="feedback">Feedback/Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Enter your message here..."
                ></textarea>
              </div>
              <div className="form-submit">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="contact-quick-links">
        <div className="container">
          <h2>Quick Links</h2>
          <div className="quick-links-grid">
            <div className="quick-link-item">
              <div className="quick-link-icon">👥</div>
              <h4>Become a Member</h4>
              <p>Join our community and be part of our legacy</p>
              <Link to="/register" className="quick-link-btn">Register Now</Link>
            </div>
            <div className="quick-link-item">
              <div className="quick-link-icon">📅</div>
              <h4>Upcoming Events</h4>
              <p>Stay updated with our latest events and programs</p>
              <Link to="/events" className="quick-link-btn">View Events</Link>
            </div>
            <div className="quick-link-item">
              <div className="quick-link-icon">💰</div>
              <h4>Make a Donation</h4>
              <p>Support community development and welfare programs</p>
              <Link to="/contact" className="quick-link-btn">Contact Us</Link>
            </div>
            <div className="quick-link-item">
              <div className="quick-link-icon">📋</div>
              <h4>Community Services</h4>
              <p>Learn about our community services and programs</p>
              <Link to="/about" className="quick-link-btn">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-media-section">
        <div className="container">
          <h2>Follow Us</h2>
          <p>Stay connected with our community on social media</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
              <span className="social-icon">📘</span>
              <span>Facebook</span>
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
              <span className="social-icon">📱</span>
              <span>WhatsApp</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
              <span className="social-icon">📷</span>
              <span>Instagram</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube">
              <span className="social-icon">📹</span>
              <span>YouTube</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;