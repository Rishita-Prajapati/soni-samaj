import React, { useState } from 'react';
import memberService from '../services/memberService';
import ImageUpload from './ImageUpload';

const MemberRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    bornTime: '',
    bornPlace: '',
    bornState: '',
    gender: '',
    maritalStatus: '',
    currentAddress: '',
    permanentAddress: '',
    district: '',
    areaLocality: '',
    gotraSelf: '',
    gotraMother: '',
    gotraNani: '',
    gotraDadi: '',
    qualification: '',
    bloodGroup: '',
    mobileNumber: '',
    whatsappNumber: '',
    email: '',
    profileImage: null,
    jobOrBusiness: '',
    businessName: '',
    businessType: '',
    businessLocation: '',
    yearsInBusiness: '',
    annualTurnover: '',
    numberOfEmployees: '',
    companyName: '',
    designation: '',
    department: '',
    jobType: '',
    workPlace: '',
    yearsOfExperience: '',
    salaryRange: '',
    industrySector: '',
    institutionName: '',
    courseLevel: '',
    fieldOfStudy: '',
    yearOfStudy: '',
    skillsInterests: '',
    homeBasedWork: '',
    previousOccupation: '',
    retirementYear: '',
    currentActivities: '',
    lookingFor: '',
    preferredField: '',
    satimataPlace: '',
    bherujiPlace: '',
    kuldeviPlace: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.fatherName || !formData.mobileNumber || 
        !formData.gender || !formData.maritalStatus || !formData.qualification || 
        !formData.bloodGroup || !formData.jobOrBusiness || !formData.currentAddress || 
        !formData.district || !formData.gotraSelf || !formData.whatsappNumber ||
        !formData.satimataPlace || !formData.bherujiPlace || !formData.kuldeviPlace) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    try {
      setLoading(true);
      console.log('Submitting registration with data:', {
        ...formData,
        profileImage: formData.profileImage ? formData.profileImage.name : 'No image'
      });
      
      const result = await memberService.registerMember(formData);
      console.log('Registration result:', result);
      
      if (result.success) {
        setSuccess(true);
        alert('Registration submitted successfully! Your application is under review.');
      } else {
        throw new Error(result.error?.message || 'Registration failed');
      }
      
      // Reset form
      setFormData({
        fullName: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        bornTime: '',
        bornPlace: '',
        bornState: '',
        gender: '',
        maritalStatus: '',
        currentAddress: '',
        permanentAddress: '',
        district: '',
        areaLocality: '',
        gotraSelf: '',
        gotraMother: '',
        gotraNani: '',
        gotraDadi: '',
        qualification: '',
        bloodGroup: '',
        mobileNumber: '',
        whatsappNumber: '',
        email: '',
        profileImage: null,
        jobOrBusiness: '',
        businessName: '',
        businessType: '',
        businessLocation: '',
        yearsInBusiness: '',
        annualTurnover: '',
        numberOfEmployees: '',
        companyName: '',
        designation: '',
        department: '',
        jobType: '',
        workPlace: '',
        yearsOfExperience: '',
        salaryRange: '',
        industrySector: '',
        institutionName: '',
        courseLevel: '',
        fieldOfStudy: '',
        yearOfStudy: '',
        skillsInterests: '',
        homeBasedWork: '',
        previousOccupation: '',
        retirementYear: '',
        currentActivities: '',
        lookingFor: '',
        preferredField: '',
        satimataPlace: '',
        bherujiPlace: '',
        kuldeviPlace: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '40px',
        backgroundColor: '#f0f9ff',
        borderRadius: '12px',
        textAlign: 'center',
        border: '2px solid #10b981'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
        <h2 style={{ color: '#10b981', marginBottom: '16px' }}>Registration Successful!</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Your membership application has been submitted successfully. 
          Our admin team will review your application and notify you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Register Another Member
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#1f2937', marginBottom: '30px' }}>
          👥 Member Registration
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#374151', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
              Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Marital Status *</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Qualification *</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., B.A., B.Com, M.A., etc."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Blood Group *</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Job/Business *</label>
                <select
                  name="jobOrBusiness"
                  value={formData.jobOrBusiness}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="Job">Job</option>
                  <option value="Business">Business</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Contact & Address */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#374151', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
              Contact & Address
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>WhatsApp Number *</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>District *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <ImageUpload
                  label="Profile Photo"
                  onImageSelect={(file) => {
                    console.log('Image selected:', file ? file.name : 'No file');
                    setFormData(prev => ({ ...prev, profileImage: file }));
                  }}
                  currentImage={formData.profileImage ? URL.createObjectURL(formData.profileImage) : null}
                />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Current Address *</label>
              <textarea
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleInputChange}
                required
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Gotra Information */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#374151', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
              Gotra Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Self Gotra *</label>
                <input
                  type="text"
                  name="gotraSelf"
                  value={formData.gotraSelf}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Mother's Gotra *</label>
                <input
                  type="text"
                  name="gotraMother"
                  value={formData.gotraMother}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Nani's Gotra *</label>
                <input
                  type="text"
                  name="gotraNani"
                  value={formData.gotraNani}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Dadi's Gotra *</label>
                <input
                  type="text"
                  name="gotraDadi"
                  value={formData.gotraDadi}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Religious Information */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#374151', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
              Religious Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Satimata Place *</label>
                <input
                  type="text"
                  name="satimataPlace"
                  value={formData.satimataPlace}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Bheruji Place *</label>
                <input
                  type="text"
                  name="bherujiPlace"
                  value={formData.bherujiPlace}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Kuldevi Place *</label>
                <input
                  type="text"
                  name="kuldeviPlace"
                  value={formData.kuldeviPlace}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              {loading ? (
                <>
                  <span>⏳</span> Submitting Registration...
                </>
              ) : (
                <>
                  <span>📝</span> Submit Registration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberRegistration;