import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaEye, FaEyeSlash, FaFacebook, FaBuilding, FaUserTie } from 'react-icons/fa';
import './Signup.css';
import { authAPI } from '../services/api';
import Logo from '../assets/creoeventlogo.svg';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    
    // Organizer Specific
    companyName: '',
    businessRegNumber: '',
    taxId: '',
    companyAddress: '',
    businessPhone: '',
    website: '',
    contactPerson: '',
    contactPosition: '',
    directPhone: '',
    companySize: '',
    yearsInBusiness: '',
    industryType: '',
    previousEvents: '',
    expectedAudience: '',
    
    exhibitorCompanyName: '',
    exhibitorIndustry: '',
    exhibitorAddress: '',
    exhibitorPhone: '',
    exhibitorWebsite: '',
    contactName: '',
    contactTitle: '',
    productsDescription: '',
    targetAudience: '',
    previousExhibitions: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
  
  try {  
    const response = await authAPI.register({
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      company_name: formData.companyName,
      phone: formData.phone,
      address: formData.address
    });
    
    // Store token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    alert(`Registration successful! ${selectedRole === 'organizer' ? 'Your account requires approval.' : 'You can now login.'}`);
    
    // Redirect
    navigate('/');
    
  } catch (error) {
    console.error('Registration failed:', error);
    alert(error.message || 'Registration failed. Please try again.');
  }
};

  const renderFormStep = () => {
    if (currentStep === 1) {
      return (
        <div className="form-step">
          <div className="step-indicator">
            <div className="step active">1</div>
            <div className="step-connector"></div>
            <div className="step">2</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>I want to join as...</label>
            <div className="role-selection">
              <div 
                className={`role-option ${selectedRole === 'organizer' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('organizer')}
              >
                <div className="role-icon"><FaUserTie /></div>
                <div className="role-info">
                  <h4>Event Organizer</h4>
                  <p>Create and manage paid events (Approval Required)</p>
                  <div className="role-badge">Business Account</div>
                </div>
              </div>
              
              <div 
                className={`role-option ${selectedRole === 'exhibitor' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('exhibitor')}
              >
                <div className="role-icon"><FaBuilding /></div>
                <div className="role-info">
                  <h4>Exhibitor</h4>
                  <p>Showcase your products and services at events</p>
                  <div className="role-badge">Business Account</div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="next-button"
            onClick={nextStep}
            disabled={!selectedRole}
          >
            Continue to Business Details
          </button>
        </div>
      );
    }

    if (currentStep === 2) {
      if (selectedRole === 'organizer') {
        return (
          <div className="form-step">
            <div className="step-indicator">
              <div className="step completed">1</div>
              <div className="step-connector"></div>
              <div className="step active">2</div>
            </div>
            
            <h3 className="step-title">Organizer Business Information</h3>
            <p className="step-description">Please provide your business details for verification</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company/Organization Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="businessRegNumber">Business Registration Number *</label>
                <input
                  type="text"
                  id="businessRegNumber"
                  name="businessRegNumber"
                  value={formData.businessRegNumber}
                  onChange={handleChange}
                  placeholder="Registration number"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="businessPhone">Business Phone *</label>
                <input
                  type="tel"
                  id="businessPhone"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  placeholder="Company phone number"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="companyAddress">Company Address *</label>
              <input
                type="text"
                id="companyAddress"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                placeholder="Full business address"
                required
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="industryType">Industry/Event Type *</label>
                <select
                  id="industryType"
                  name="industryType"
                  value={formData.industryType}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business & Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="fashion">Fashion</option>
                  <option value="food">Food & Beverage</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person Name *</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Full name of contact person"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactPosition">Position/Title *</label>
                <input
                  type="text"
                  id="contactPosition"
                  name="contactPosition"
                  value={formData.contactPosition}
                  onChange={handleChange}
                  placeholder="Job title"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="back-button" onClick={prevStep}>
                Back
              </button>
              <button type="submit" className="signup-button">
                Submit for Approval
              </button>
            </div>
          </div>
        );
      }

      if (selectedRole === 'exhibitor') {
        return (
          <div className="form-step">
            <div className="step-indicator">
              <div className="step completed">1</div>
              <div className="step-connector"></div>
              <div className="step active">2</div>
            </div>
            
            <h3 className="step-title">Exhibitor Company Information</h3>
            <p className="step-description">Tell us about your company and exhibition needs</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="exhibitorCompanyName">Company Name *</label>
                <input
                  type="text"
                  id="exhibitorCompanyName"
                  name="exhibitorCompanyName"
                  value={formData.exhibitorCompanyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exhibitorIndustry">Industry/Sector *</label>
                <select
                  id="exhibitorIndustry"
                  name="exhibitorIndustry"
                  value={formData.exhibitorIndustry}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="food-beverage">Food & Beverage</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="productsDescription">Products/Services Description *</label>
              <textarea
                id="productsDescription"
                name="productsDescription"
                value={formData.productsDescription}
                onChange={handleChange}
                placeholder="Describe what you want to exhibit"
                required
                className="form-input textarea"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="exhibitorAddress">Company Address *</label>
                <input
                  type="text"
                  id="exhibitorAddress"
                  name="exhibitorAddress"
                  value={formData.exhibitorAddress}
                  onChange={handleChange}
                  placeholder="Business address"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exhibitorPhone">Business Phone *</label>
                <input
                  type="tel"
                  id="exhibitorPhone"
                  name="exhibitorPhone"
                  value={formData.exhibitorPhone}
                  onChange={handleChange}
                  placeholder="Company phone number"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactName">Contact Person Name *</label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactTitle">Position/Title *</label>
                <input
                  type="text"
                  id="contactTitle"
                  name="contactTitle"
                  value={formData.contactTitle}
                  onChange={handleChange}
                  placeholder="Job title"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="targetAudience">Target Audience</label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Who are you trying to reach?"
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="back-button" onClick={prevStep}>
                Back
              </button>
              <button type="submit" className="signup-button">
                Complete Registration
              </button>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="signup-page">
      {/* Header */}
      <header className="signup-header">
        <div className="container">
          <div className="nav-container">
            <Link to="/" className="logo">
              <img src={Logo} alt="CREOEvent Logo" />
            </Link>
            <nav>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login" className="login-btn">Login</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Signup Section */}
      <section className="signup-section">
        <div className="container">
          <div className="signup-container">
            {/* Signup Form */}
            <div className="signup-form-container">
              <div className="signup-card">
                <div className="signup-header-text">
                  <h2>Business Registration</h2>
                  <p>Create your organizer or exhibitor account</p>
                </div>

                <div className="visitor-notice">
                  <p>
                    <strong>Attending events as a visitor?</strong>{' '}
                    No registration needed! Browse events and register directly when you find one you like.
                  </p>
                  <Link to="/events" className="browse-events-btn">
                    Browse Events
                  </Link>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                  {renderFormStep()}
                </form>

                <div className="divider">
                  <span>Or sign up with</span>
                </div>

                <div className="social-signup">
                  <button type="button" className="social-btn google-btn">
                    <GoogleIcon />
                    Google
                  </button>
                  <button type="button" className="social-btn facebook-btn">
                    <FaFacebook className="social-icon" />
                    Facebook
                  </button>
                </div>

                <div className="login-link">
                  Already have an account? <Link to="/login">Sign in</Link>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="signup-hero">
              <div className="hero-content">
                <h3>Grow Your Business with CREOEvent</h3>
                <p>Join our platform to reach thousands of potential customers and partners through events and exhibitions.</p>
                
                <div className="features-list">
                  <div className="feature">
                    <div className="feature-bullet"></div>
                    <span>Access to Premium Event Tools</span>
                  </div>
                  <div className="feature">
                    <div className="feature-bullet"></div>
                    <span>Direct Connection with Attendees</span>
                  </div>
                  <div className="feature">
                    <div className="feature-bullet"></div>
                    <span>Advanced Analytics & Insights</span>
                  </div>
                  <div className="feature">
                    <div className="feature-bullet"></div>
                    <span>Marketing & Promotion Support</span>
                  </div>
                </div>

                <div className="role-benefits">
                  <h4>Why Join as Business?</h4>
                  <div className="benefit-cards">
                    <div className="benefit-card">
                      <h5> For Organizers</h5>
                      <ul>
                        <li>Create and manage paid events</li>
                        <li>Access to premium tools</li>
                        <li>Revenue generation</li>
                        <li>Professional support</li>
                      </ul>
                    </div>
                    <div className="benefit-card">
                      <h5> For Exhibitors</h5>
                      <ul>
                        <li>Showcase to targeted audience</li>
                        <li>Lead generation</li>
                        <li>Brand visibility</li>
                        <li>Networking opportunities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;