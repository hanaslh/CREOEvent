import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import './Login.css';
import Logo from '../assets/creoeventlogo.svg';
import { authAPI } from '../services/api';


const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      const response = await authAPI.login({
      email: formData.email,
      password: formData.password
    });
    
    // Store token and user data
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    // Show success message
    console.log('Login successful!', response.user);
    
    // Redirect based on role
    const userRole = response.user.role;
    
    if (userRole === 'organizer') {
      navigate('/event-planner');
    } else if (userRole === 'exhibitor') {
      navigate('/events');
    } else {
      navigate('/'); // visitor
    }
    
  } catch (error) {
    // Handle login error
    console.error('Login failed:', error);
    
    // Show user-friendly error message
    alert(error.message || 'Login failed. Please check your credentials.');
    
  } finally {
    // setLoading(false);
  }
};

  // Animation for feature items
  useEffect(() => {
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      feature.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
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

      {/* Login Section */}
      <section className="login-section">
        <div className="container">
          <div className="login-container">
            {/* Login Form */}
            <div className="login-form-container">
              <div className="login-card">
                <div className="login-header-text">
                  <h2>Welcome Back</h2>
                  <p>Sign in to your CREOEvent account</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
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
                        placeholder="Enter your password"
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

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                      Remember me
                    </label>
                    <a href="#forgot" className="forgot-password">
                      Forgot password?
                    </a>
                  </div>

                  <button type="submit" className="login-button">
                    Sign In
                  </button>

                  <div className="divider">
                    <span>Or continue with</span>
                  </div>
                  <div className="social-login">
                    <button type="button" className="social-btn google-btn">
                      <GoogleIcon />
                      Google
                    </button>
                      
                    <button type="button" className="social-btn facebook-btn">
                      <FaFacebook className="social-icon" />
                      Facebook
                    </button>
                  </div>
                  <div className="signup-link">
                    Don't have an account? <Link to="/signup">Sign up now</Link>
                 </div>
                </form>
              </div>
            </div>

            {/* Hero Section */}
            <div className="login-hero">
              <div className="hero-content">
                <h3>Connect with the Event Ecosystem</h3>
                <p>Access personalized event recommendations, manage your exhibitions, and connect with industry professionals.</p>
                
                <div className="features-list">
                  <div className="feature">
                    <div className="feature-bullet"></div>
                    <span>Personalized Event Recommendations</span>
                  </div>
                  <div className="feature">
                    <div className="feature-bullet"></div>
                    <span>Advanced Analytics Dashboard</span>
                  </div>
                  <div className="feature">
                    <div className="feature-bullet"></div>
                    <span>Networking Opportunities</span>
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

export default Login;