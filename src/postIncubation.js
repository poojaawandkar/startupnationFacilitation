import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './postIncubation.css';
import { submitIncubationCenter } from './services/incubationService';

const initialState = {
  logo: '',
  companyName: '',
  companyEmail: '',
  companyWebsite: '',
  uniqueSellingPoint: '',
  incubationCenterType: '',
  location: '',
  domain: '',
  services: '',
  startupsIncubated: '',
  supportRemuneration: '',
  youtubeLink: '',
  incubationDescription: '',
};

const INCUBATION_CENTER_TYPES = [
  'Incubation center',
  'Accelerator', 
  'Venture capital',
  'Entrepreneurship cell',
  'Startup clubs',
  'School/college startup facilitation body'
];

const DOMAINS = [
  'Agriculture',
  'Artificial Intelligence / SAAS',
  'Climate Tech',
  'Consumer Goods or FMCG',
  'Education',
  'Finance',
  'Healthcare',
  'Agnostic',
  'Social Impact',
  'Defense and Space'
];

const SERVICES = ['Remote', 'Onsite', 'Hybrid'];
const SUPPORT_REMUNERATION = ['Equity based', 'Fee based', 'Hybrid (equity + fee)'];

export default function PostIncubationForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files && files[0]) {
      const file = files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = e2 => setForm(f => ({ ...f, logo: e2.target.result }));
      reader.readAsDataURL(file);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!form.companyName) newErrors.companyName = 'Company name is required';
    if (!form.companyEmail) newErrors.companyEmail = 'Company email is required';
    if (!form.companyWebsite) newErrors.companyWebsite = 'Company website is required';
    if (!form.uniqueSellingPoint) newErrors.uniqueSellingPoint = 'Unique selling point is required';
    if (!form.incubationCenterType) newErrors.incubationCenterType = 'Incubation center type is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.domain) newErrors.domain = 'Domain is required';
    if (!form.services) newErrors.services = 'Services are required';
    if (!form.startupsIncubated) newErrors.startupsIncubated = 'Number of startups incubated is required';
    if (!form.supportRemuneration) newErrors.supportRemuneration = 'Support remuneration is required';
    if (!form.youtubeLink) newErrors.youtubeLink = 'YouTube link is required';
    if (!form.incubationDescription) newErrors.incubationDescription = 'Incubation description is required';
    
    // Validate logo
    if (!form.logo) newErrors.logo = 'Company logo is required';
    
    // Validate unique selling point length
    if (form.uniqueSellingPoint && form.uniqueSellingPoint.split('.').length > 2) {
      newErrors.uniqueSellingPoint = 'Unique selling point should not be more than 2 sentences';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const newIncubationCenter = await submitIncubationCenter(form, logoFile);
      console.log('Incubation center submitted successfully:', newIncubationCenter);
      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting incubation center:', error);
      alert('Error submitting incubation center. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (showThankYou) {
    return (
      <div className="post-incubation-page">
        <div className="post-incubation-container">
          <div className="thank-you-message">
            <div className="thank-you-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <h2>Thank You!</h2>
            <h3>Your incubation center will be displayed on the Facilitator Network within <strong>12-24 hours</strong></h3>
            <div className="thank-you-actions">
              <button className="back-home-btn" onClick={handleBackToHome}>
                Back to Home
              </button>
              <button className="post-another-btn" onClick={() => {
                setForm(initialState);
                setErrors({});
                setShowThankYou(false);
              }}>
                Register Another Center
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-incubation-page">
      <div className="post-incubation-container">
        <form className="post-incubation-form-page" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Facilitation Center Registration Form</h2>
            <p>Fill out the form below to register your incubation center</p>
            <button type="button" className="back-home-btn" onClick={handleBackToHome} style={{ marginTop: '1rem' }}>
              ← Back to Home
            </button>
          </div>
          
          <div className="form-sections">
            <div className="form-section">
              <h3>Company Information</h3>
              
              <label>
                Company Logo*
                <input type="file" name="logo" accept="image/*" onChange={handleChange} className={errors.logo ? 'input-error' : ''} required />
                {form.logo && <img src={form.logo} alt="Logo preview" className="logo-preview" />}
                {errors.logo && <span className="error-message">{errors.logo}</span>}
              </label>
              
              <label>
                Company Name*
                <input name="companyName" value={form.companyName} onChange={handleChange} className={errors.companyName ? 'input-error' : ''} required />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </label>
              
              <label>
                Company Email*
                <input name="companyEmail" type="email" value={form.companyEmail} onChange={handleChange} className={errors.companyEmail ? 'input-error' : ''} required />
                {errors.companyEmail && <span className="error-message">{errors.companyEmail}</span>}
              </label>
              
              <label>
                Company Website*
                <input name="companyWebsite" type="url" value={form.companyWebsite} onChange={handleChange} placeholder="https://company.com" className={errors.companyWebsite ? 'input-error' : ''} required />
                {errors.companyWebsite && <span className="error-message">{errors.companyWebsite}</span>}
              </label>
              
              <label>
                Unique Selling Point (Not more than 2 sentences)*
                <textarea 
                  name="uniqueSellingPoint" 
                  value={form.uniqueSellingPoint} 
                  onChange={handleChange} 
                  placeholder="Brief description of what makes your center unique..."
                  className={errors.uniqueSellingPoint ? 'input-error' : ''} 
                  required
                />
                {errors.uniqueSellingPoint && <span className="error-message">{errors.uniqueSellingPoint}</span>}
              </label>
            </div>

            <div className="form-section">
              <h3>Incubation Center Details</h3>
              
              <label>
                Incubation Center Type*
                <select name="incubationCenterType" value={form.incubationCenterType} onChange={handleChange} className={errors.incubationCenterType ? 'input-error' : ''} required>
                  <option value="">Select Type</option>
                  {INCUBATION_CENTER_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors.incubationCenterType && <span className="error-message">{errors.incubationCenterType}</span>}
              </label>
              
              <label>
                Location*
                <input name="location" value={form.location} onChange={handleChange} placeholder="City, Country" className={errors.location ? 'input-error' : ''} required />
                {errors.location && <span className="error-message">{errors.location}</span>}
              </label>
              
              <label>
                Domain*
                <select name="domain" value={form.domain} onChange={handleChange} className={errors.domain ? 'input-error' : ''} required>
                  <option value="">Select Domain</option>
                  {DOMAINS.map(domain => <option key={domain} value={domain}>{domain}</option>)}
                </select>
                {errors.domain && <span className="error-message">{errors.domain}</span>}
              </label>
              
              <label>
                Services*
                <select name="services" value={form.services} onChange={handleChange} className={errors.services ? 'input-error' : ''} required>
                  <option value="">Select Services</option>
                  {SERVICES.map(service => <option key={service} value={service}>{service}</option>)}
                </select>
                {errors.services && <span className="error-message">{errors.services}</span>}
              </label>
              
              <label>
                Startups Incubated*
                <input 
                  name="startupsIncubated" 
                  type="number" 
                  value={form.startupsIncubated} 
                  onChange={handleChange} 
                  placeholder="Number of startups"
                  className={errors.startupsIncubated ? 'input-error' : ''} 
                  required
                />
                {errors.startupsIncubated && <span className="error-message">{errors.startupsIncubated}</span>}
              </label>
              
              <label>
                Support Remuneration*
                <select name="supportRemuneration" value={form.supportRemuneration} onChange={handleChange} className={errors.supportRemuneration ? 'input-error' : ''} required>
                  <option value="">Select Remuneration Type</option>
                  {SUPPORT_REMUNERATION.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors.supportRemuneration && <span className="error-message">{errors.supportRemuneration}</span>}
              </label>
              
              <label>
                YouTube Link*
                <input 
                  name="youtubeLink" 
                  type="url" 
                  value={form.youtubeLink} 
                  onChange={handleChange} 
                  placeholder="https://youtube.com/..."
                  className={errors.youtubeLink ? 'input-error' : ''} 
                  required
                />
                {errors.youtubeLink && <span className="error-message">{errors.youtubeLink}</span>}
              </label>
              
              <label>
                Incubation Description*
                <textarea 
                  name="incubationDescription" 
                  value={form.incubationDescription} 
                  onChange={handleChange} 
                  placeholder="Detailed description of your incubation center, services offered, and what makes you unique..."
                  className={errors.incubationDescription ? 'input-error' : ''} 
                  rows="6"
                  required
                />
                {errors.incubationDescription && <span className="error-message">{errors.incubationDescription}</span>}
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Registering Center...' : 'Register Center'}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel} disabled={isSubmitting}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}