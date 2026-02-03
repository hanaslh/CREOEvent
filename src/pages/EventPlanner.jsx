import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaRuler, FaCube, FaArrowRight, FaPlus } from 'react-icons/fa';
import './EventPlanner.css';

const EventPlanner = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [venueDimensions, setVenueDimensions] = useState({
    width: '',
    length: ''
  });

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setVenueDimensions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLaunch2D = () => {
    if (venueDimensions.width && venueDimensions.length) {
      const venue = {
        name: "Custom Venue",
        dimensions: {
          width: parseFloat(venueDimensions.width),
          length: parseFloat(venueDimensions.length),
        }
      };
      navigate('/venue-2d', { state: { venue } });
    } else {
      alert('Please enter valid dimensions for width and length');
    }
  };

  const steps = [
    {
      number: 1,
      title: "Define Your Space",
      description: "Set your venue dimensions"
    },
    {
      number: 2,
      title: "2D Planning",
      description: "Design your layout in 2D"
    }
  ];

  return (
    <div className="event-planner-page">
      <header className="planner-header">
        <div className="container">
          <div className="nav-container">
            <a href="/" className="logo-container">
              <span className="logo-text">CREOEvent</span>
            </a>
            <nav>
              <ul>
                <li><a href="/" className="nav-link">Home</a></li>
                <li><a href="/events" className="nav-link">Events</a></li>
                <li><a href="/login" className="login-btn">Login</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="planner-hero">
        <div className="container">
          <h1>Start Your Event Plan</h1>
          <p>Define your space and launch into 2D planning to create your perfect event layout</p>
        </div>
      </section>

      {/* Steps Indicator */}
      <section className="planner-steps">
        <div className="container">
          <div className="steps-indicator">
            {steps.map((step, index) => (
              <div key={step.number} className="step-item">
                <div className={`step-number ${currentStep >= step.number ? 'active' : ''}`}>
                  {step.number}
                </div>
                <div className="step-info">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${currentStep > step.number ? 'active' : ''}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="planner-content">
        <div className="container">
          {currentStep === 1 && (
            <div className="step-content">
              <div className="section-header">
                <h2>Define Your Venue Dimensions</h2>
                <p>Enter the dimensions of your event space to get started with 2D planning</p>
              </div>

              <div className="dimension-form">
                <div className="form-group">
                  <label htmlFor="width">Width (meters)</label>
                  <input
                    type="number"
                    id="width"
                    name="width"
                    value={venueDimensions.width}
                    onChange={handleDimensionChange}
                    placeholder="Enter width"
                    min="1"
                    step="0.1"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="length">Length (meters)</label>
                  <input
                    type="number"
                    id="length"
                    name="length"
                    value={venueDimensions.length}
                    onChange={handleDimensionChange}
                    placeholder="Enter length"
                    min="1"
                    step="0.1"
                    className="form-input"
                  />
                </div>

                <div className="dimension-preview">
                  <h4>Space Preview</h4>
                  <div className="preview-box">
                    <div className="preview-label">
                      {venueDimensions.width || '?'}m × {venueDimensions.length || '?'}m
                    </div>
                    <div className="preview-area">
                      Area: {venueDimensions.width && venueDimensions.length 
                        ? (venueDimensions.width * venueDimensions.length).toFixed(1) 
                        : '?'} m²
                    </div>
                  </div>
                </div>

                <button 
                  className="btn-primary launch-btn"
                  onClick={() => setCurrentStep(2)}
                  disabled={!venueDimensions.width || !venueDimensions.length}
                >
                  <FaRuler />
                  Continue to 2D Planning
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content">
              <div className="section-header">
                <h2>2D Venue Planning</h2>
                <p>Launch the 2D planner to design your event layout with interactive tools</p>
              </div>

              <div className="planning-features">
                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <FaCube />
                    </div>
                    <h3>2D Tools Available</h3>
                    <ul>
                      <li>Select & Move Objects</li>
                      <li>Build Walls</li>
                      <li>Place Exhibition Stands</li>
                      <li>Add Furniture</li>
                      <li>Create Doors & Entrances</li>
                      <li>Define Zones</li>
                    </ul>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <FaRuler />
                    </div>
                    <h3>Your Space Details</h3>
                    <div className="space-details">
                      <div className="detail-item">
                        <span>Dimensions:</span>
                        <strong>{venueDimensions.width}m × {venueDimensions.length}m</strong>
                      </div>
                      <div className="detail-item">
                        <span>Area:</span>
                        <strong>{(venueDimensions.width * venueDimensions.length).toFixed(1)} m²</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    className="btn-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    ← Back to Dimensions
                  </button>
                  <button 
                    className="btn-primary launch-2d-btn"
                    onClick={handleLaunch2D}
                  >
                    <FaRocket />
                    Launch 2D Planner
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventPlanner;