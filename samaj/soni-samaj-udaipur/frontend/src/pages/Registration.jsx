import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import './Registration.css';
import { memberService } from '../supabase/services/memberService.js';

const Registration = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    bornTime: { hours: '', minutes: '', seconds: '' },
    bornPlace: '',
    bornState: '',
    gender: '',
    maritalStatus: '',
    
    // Address Information
    currentAddress: '',
    permanentAddress: '',
    sameAsAbove: false,
    district: '',
    areaLocality: '',
    
    // Gotra Details
    gotraSelf: '',
    gotraMother: '',
    gotraNani: '',
    gotraDadi: '',
    
    // Education & Medical Info
    qualification: '',
    bloodGroup: '',
    
    // Contact & Photo
    mobileNumber: '',
    whatsappNumber: '',
    profilePicture: null,
    
    // Work Information - Base
    jobOrBusiness: '',
    
    // Business Fields
    businessName: '',
    businessType: '',
    businessLocation: '',
    yearsInBusiness: '',
    annualTurnover: '',
    numberOfEmployees: '',
    
    // Job Fields
    companyName: '',
    designation: '',
    department: '',
    jobType: '',
    workPlace: '',
    yearsOfExperience: '',
    salaryRange: '',
    industrySector: '',
    
    // Student Fields
    institutionName: '',
    courseLevel: '',
    fieldOfStudy: '',
    yearOfStudy: '',
    
    // Housewife Fields
    skillsInterests: '',
    homeBasedWork: '',
    
    // Retired Fields
    previousOccupation: '',
    retirementYear: '',
    currentActivities: '',
    
    // Unemployed Fields
    lookingFor: '',
    preferredField: '',
    
    // Religious Information
    satimataPlace: '',
    bherujiPlace: '',
    kuldeviPlace: ''
  });

  // Dropdown options
  const genderOptions = ['Male', 'Female', 'Other'];
  const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  
  const gotraOptions = [
    'Kashyap', 'Bharadwaj', 'Gautam', 'Agastya', 'Vishwamitra', 
    'Jamadagni', 'Vashishtha', 'Atri', 'Angiras', 'Kaushik', 
    'Galav', 'Mudgal', 'Parashar', 'Bhrigu', 'Pulastya'
  ];
  
  const qualificationOptions = [
    'Below 10th', '10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 
    'Diploma', 'ITI', 'Professional Course', 'PhD', 'Other'
  ];
  
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const jobBusinessOptions = [
    'Business', 'Private Job', 'Government Job', 'Self Employed', 
    'Student', 'Housewife', 'Retired', 'Unemployed', 'Other'
  ];
  
  const jobTypeOptions = [
    'Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'
  ];

  // Indian states with cities
  const statesWithCities = {
    'Rajasthan': [
      'Udaipur', 'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 
      'Bharatpur', 'Alwar', 'Sikar', 'Pali', 'Sri Ganganagar', 
      'Churu', 'Jhunjhunu', 'Barmer', 'Jaisalmer', 'Banswara', 
      'Rajsamand', 'Dungarpur', 'Chittorgarh', 'Bhilwara'
    ],
    'Gujarat': [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 
      'Jamnagar', 'Gandhinagar', 'Anand', 'Bharuch', 'Mehsana'
    ],
    'Maharashtra': [
      'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 
      'Solapur', 'Amravati', 'Kolhapur', 'Sangli'
    ],
    'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Uttar Pradesh': [
      'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 
      'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad'
    ],
    'Punjab': [
      'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 
      'Mohali', 'Hoshiarpur', 'Moga', 'Pathankot', 'Batala'
    ],
    'Haryana': [
      'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 
      'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula'
    ],
    'Madhya Pradesh': [
      'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 
      'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'
    ],
    'Other': ['Other']
  };

  const religiousPlaces = [
    'Eklingji Temple', 'Nathdwara Temple', 'Rishabdeo Temple', 
    'Ambika Mata Temple', 'Jagnath Temple', 'Sanwariya Seth Temple',
    'Brahma Temple Pushkar', 'Dilwara Temples', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('bornTime.')) {
      const timeField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bornTime: {
          ...prev.bornTime,
          [timeField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: e.target.files[0]
    }));
  };

  const handleSameAsAbove = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      sameAsAbove: isChecked,
      permanentAddress: isChecked ? prev.currentAddress : ''
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Attempting registration with data:', formData);
      
      // Validate required fields
      const requiredFields = ['fullName', 'fatherName', 'motherName', 'dateOfBirth', 'gender', 'maritalStatus', 'currentAddress', 'district', 'gotraSelf', 'qualification', 'bloodGroup', 'mobileNumber', 'whatsappNumber', 'jobOrBusiness', 'satimataPlace', 'bherujiPlace', 'kuldeviPlace'];
      
      // Set email to null if empty to avoid database issues
      if (!formData.email || !formData.email.trim()) {
        formData.email = null;
      }
      
      for (const field of requiredFields) {
        if (!formData[field]) {
          alert(`Please fill in the required field: ${field}`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Try database registration
      const result = await memberService.createMember(formData);
      
      console.log('Registration result:', result);
      
      if (result && result.success) {
        alert('पंजीकरण सफलतापूर्वक जमा किया गया! आपका आवेदन अनुमोदन के लिए प्रतीक्षारत है।');
        // Reset form
        setFormData({
          fullName: '', fatherName: '', motherName: '', dateOfBirth: '', bornTime: { hours: '', minutes: '', seconds: '' }, bornPlace: '', bornState: '', gender: '', maritalStatus: '', currentAddress: '', permanentAddress: '', sameAsAbove: false, district: '', areaLocality: '', gotraSelf: '', gotraMother: '', gotraNani: '', gotraDadi: '', qualification: '', bloodGroup: '', mobileNumber: '', whatsappNumber: '', email: '', profilePicture: null, jobOrBusiness: '', businessName: '', businessType: '', businessLocation: '', yearsInBusiness: '', annualTurnover: '', numberOfEmployees: '', companyName: '', designation: '', department: '', jobType: '', workPlace: '', yearsOfExperience: '', salaryRange: '', industrySector: '', institutionName: '', courseLevel: '', fieldOfStudy: '', yearOfStudy: '', skillsInterests: '', homeBasedWork: '', previousOccupation: '', retirementYear: '', currentActivities: '', lookingFor: '', preferredField: '', satimataPlace: '', bherujiPlace: '', kuldeviPlace: ''
        });
      } else {
        alert('त्रुटि: ' + (result ? result.error : 'अज्ञात त्रुटि हुई'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('पंजीकरण विफल: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-page">
      <PageHeader 
        title="📝 सदस्यता पंजीकरण" 
        subtitle="Join our community - Fill out the form below to become a member" 
      />
      
      <div className="registration-container">
        <form className="registration-form" onSubmit={handleSubmit}>
          
          {/* Personal Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">👤</span>
              Personal Information
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mother's Name *</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  placeholder="15/08/2025"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Born Time (H:M:S)</label>
                <div className="time-inputs">
                  <input
                    type="number"
                    name="bornTime.hours"
                    value={formData.bornTime.hours}
                    onChange={handleInputChange}
                    placeholder="HH"
                    min="0"
                    max="23"
                    className="time-input"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    name="bornTime.minutes"
                    value={formData.bornTime.minutes}
                    onChange={handleInputChange}
                    placeholder="MM"
                    min="0"
                    max="59"
                    className="time-input"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    name="bornTime.seconds"
                    value={formData.bornTime.seconds}
                    onChange={handleInputChange}
                    placeholder="SS"
                    min="0"
                    max="59"
                    className="time-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Born Place (City)</label>
                <input
                  type="text"
                  name="bornPlace"
                  value={formData.bornPlace}
                  onChange={handleInputChange}
                  placeholder="Enter birth city"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Born State</label>
                <select
                  name="bornState"
                  value={formData.bornState}
                  onChange={handleInputChange}
                >
                  <option value="">Select State</option>
                  {Object.keys(statesWithCities).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Marital Status *</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  {maritalStatusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">🏠</span>
              Address Information
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Current Address *</label>
                <textarea
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Permanent Address *</label>
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={formData.sameAsAbove}
                  required
                />
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="sameAsAbove"
                    name="sameAsAbove"
                    checked={formData.sameAsAbove}
                    onChange={handleSameAsAbove}
                  />
                  <label htmlFor="sameAsAbove">Same as above</label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>District *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="Start typing district..."
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Area / Locality *</label>
                <textarea
                  name="areaLocality"
                  value={formData.areaLocality}
                  onChange={handleInputChange}
                  placeholder="Enter a location"
                  rows="3"
                  required
                />
              </div>
            </div>
          </div>

          {/* Gotra Details Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">🔱</span>
              Gotra Details
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Gotra - Self *</label>
                <select
                  name="gotraSelf"
                  value={formData.gotraSelf}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {gotraOptions.map(gotra => (
                    <option key={gotra} value={gotra}>{gotra}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Gotra - Mother *</label>
                <select
                  name="gotraMother"
                  value={formData.gotraMother}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {gotraOptions.map(gotra => (
                    <option key={gotra} value={gotra}>{gotra}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gotra - Nani *</label>
                <select
                  name="gotraNani"
                  value={formData.gotraNani}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {gotraOptions.map(gotra => (
                    <option key={gotra} value={gotra}>{gotra}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Gotra - Dadi *</label>
                <select
                  name="gotraDadi"
                  value={formData.gotraDadi}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {gotraOptions.map(gotra => (
                    <option key={gotra} value={gotra}>{gotra}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Education & Medical Info Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">🎓</span>
              Education & Medical Info
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Qualification *</label>
                <select
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Qualification</option>
                  {qualificationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group *</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroupOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contact & Photo Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">📞</span>
              Contact & Photo
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>WhatsApp Number *</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="आपका ईमेल पता (वैकल्पिक)"
                />
              </div>
              <div className="form-group">
                <label>Profile Picture (Optional)</label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Work Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">💼</span>
              Work Information
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Job or Business *</label>
                <select
                  name="jobOrBusiness"
                  value={formData.jobOrBusiness}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {jobBusinessOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Business Fields - Show only if Business is selected */}
            {formData.jobOrBusiness === 'Business' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Name *</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Enter your business name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Business Type *</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Business Type</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Trading">Trading</option>
                      <option value="Service Provider">Service Provider</option>
                      <option value="Retail">Retail</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Import/Export">Import/Export</option>
                      <option value="Restaurant/Food">Restaurant/Food</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Construction">Construction</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="IT/Software">IT/Software</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Business Location *</label>
                    <input
                      type="text"
                      name="businessLocation"
                      value={formData.businessLocation}
                      onChange={handleInputChange}
                      placeholder="Enter business address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Years in Business</label>
                    <select
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Years</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="6-10 years">6-10 years</option>
                      <option value="11-15 years">11-15 years</option>
                      <option value="16-20 years">16-20 years</option>
                      <option value="More than 20 years">More than 20 years</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Annual Turnover</label>
                    <select
                      name="annualTurnover"
                      value={formData.annualTurnover}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Range</option>
                      <option value="Less than 1 Lakh">Less than ₹1 Lakh</option>
                      <option value="1-5 Lakhs">₹1-5 Lakhs</option>
                      <option value="5-10 Lakhs">₹5-10 Lakhs</option>
                      <option value="10-25 Lakhs">₹10-25 Lakhs</option>
                      <option value="25-50 Lakhs">₹25-50 Lakhs</option>
                      <option value="50 Lakhs - 1 Crore">₹50 Lakhs - 1 Crore</option>
                      <option value="1-5 Crores">₹1-5 Crores</option>
                      <option value="More than 5 Crores">More than ₹5 Crores</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Number of Employees</label>
                    <select
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Range</option>
                      <option value="Only Me">Only Me</option>
                      <option value="2-5">2-5</option>
                      <option value="6-10">6-10</option>
                      <option value="11-25">11-25</option>
                      <option value="26-50">26-50</option>
                      <option value="51-100">51-100</option>
                      <option value="More than 100">More than 100</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Job Fields - Show if any job type is selected */}
            {(formData.jobOrBusiness === 'Private Job' || 
              formData.jobOrBusiness === 'Government Job' || 
              formData.jobOrBusiness === 'Self Employed') && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Company/Organization Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter company/organization name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation/Position *</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="Enter your designation"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department/Division</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="Enter department name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Type *</label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Job Type</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Work Location *</label>
                    <input
                      type="text"
                      name="workPlace"
                      value={formData.workPlace}
                      onChange={handleInputChange}
                      placeholder="Enter work location"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <select
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Experience</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="6-10 years">6-10 years</option>
                      <option value="11-15 years">11-15 years</option>
                      <option value="16-20 years">16-20 years</option>
                      <option value="More than 20 years">More than 20 years</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Salary Range</label>
                    <select
                      name="salaryRange"
                      value={formData.salaryRange}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Range</option>
                      <option value="Less than 20,000">Less than ₹20,000</option>
                      <option value="20,000 - 40,000">₹20,000 - ₹40,000</option>
                      <option value="40,000 - 60,000">₹40,000 - ₹60,000</option>
                      <option value="60,000 - 80,000">₹60,000 - ₹80,000</option>
                      <option value="80,000 - 1,00,000">₹80,000 - ₹1,00,000</option>
                      <option value="1,00,000 - 1,50,000">₹1,00,000 - ₹1,50,000</option>
                      <option value="1,50,000 - 2,00,000">₹1,50,000 - ₹2,00,000</option>
                      <option value="More than 2,00,000">More than ₹2,00,000</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Industry/Sector</label>
                    <select
                      name="industrySector"
                      value={formData.industrySector}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Industry</option>
                      <option value="IT/Software">IT/Software</option>
                      <option value="Banking/Finance">Banking/Finance</option>
                      <option value="Healthcare/Medical">Healthcare/Medical</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Construction">Construction</option>
                      <option value="Retail/Sales">Retail/Sales</option>
                      <option value="Government">Government</option>
                      <option value="Telecom">Telecom</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Media/Entertainment">Media/Entertainment</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Student Fields */}
            {formData.jobOrBusiness === 'Student' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Institution Name *</label>
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleInputChange}
                      placeholder="Enter school/college/university name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Course/Study Level *</label>
                    <select
                      name="courseLevel"
                      value={formData.courseLevel}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Course Level</option>
                      <option value="10th Class">10th Class</option>
                      <option value="12th Class">12th Class</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                      <option value="Professional Course">Professional Course</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input
                      type="text"
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science, Commerce, Arts"
                    />
                  </div>
                  <div className="form-group">
                    <label>Year of Study</label>
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Housewife/Homemaker Fields */}
            {formData.jobOrBusiness === 'Housewife' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Additional Skills/Interests</label>
                  <textarea
                    name="skillsInterests"
                    value={formData.skillsInterests}
                    onChange={handleInputChange}
                    placeholder="Any special skills, hobbies, or interests (optional)"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Home-based Work</label>
                  <select
                    name="homeBasedWork"
                    value={formData.homeBasedWork}
                    onChange={handleInputChange}
                  >
                    <option value="">Select if applicable</option>
                    <option value="Tailoring/Stitching">Tailoring/Stitching</option>
                    <option value="Cooking/Catering">Cooking/Catering</option>
                    <option value="Tutoring">Tutoring</option>
                    <option value="Handicrafts">Handicrafts</option>
                    <option value="Beauty Services">Beauty Services</option>
                    <option value="Online Business">Online Business</option>
                    <option value="Other">Other</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
            )}

            {/* Retired Fields */}
            {formData.jobOrBusiness === 'Retired' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Previous Occupation</label>
                    <input
                      type="text"
                      name="previousOccupation"
                      value={formData.previousOccupation}
                      onChange={handleInputChange}
                      placeholder="What was your previous job/business?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Retirement Year</label>
                    <input
                      type="number"
                      name="retirementYear"
                      value={formData.retirementYear}
                      onChange={handleInputChange}
                      placeholder="YYYY"
                      min="1960"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Current Activities</label>
                    <textarea
                      name="currentActivities"
                      value={formData.currentActivities}
                      onChange={handleInputChange}
                      placeholder="What do you do now? (social work, consulting, etc.)"
                      rows="3"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Unemployed Fields */}
            {formData.jobOrBusiness === 'Unemployed' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Looking For</label>
                  <select
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleInputChange}
                  >
                    <option value="">What are you looking for?</option>
                    <option value="Job Opportunity">Job Opportunity</option>
                    <option value="Business Opportunity">Business Opportunity</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Skill Development">Skill Development</option>
                    <option value="Not Looking">Not Looking Currently</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Field</label>
                  <input
                    type="text"
                    name="preferredField"
                    value={formData.preferredField}
                    onChange={handleInputChange}
                    placeholder="Which field interests you?"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Religious Information Section */}
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">🛕</span>
              Religious Information
            </h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Satimata Place *</label>
                <select
                  name="satimataPlace"
                  value={formData.satimataPlace}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {religiousPlaces.map(place => (
                    <option key={place} value={place}>{place}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Bheruji Place *</label>
                <select
                  name="bherujiPlace"
                  value={formData.bherujiPlace}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {religiousPlaces.map(place => (
                    <option key={place} value={place}>{place}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Kuldevi Place *</label>
                <select
                  name="kuldeviPlace"
                  value={formData.kuldeviPlace}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select</option>
                  {religiousPlaces.map(place => (
                    <option key={place} value={place}>{place}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button type="submit" className="register-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;