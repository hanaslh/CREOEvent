import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUsers, FaBuilding, FaFilter, FaStar, FaRegStar, FaArrowRight } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import './Events.css';
import Logo from '../assets/creoeventlogo.svg';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    'All Categories',
    'Technology',
    'Business',
    'Healthcare',
    'Education',
    'Entertainment',
    'Fashion',
    'Food & Beverage',
    'Sports',
    'Arts & Culture'
  ];

  const mockEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      organizer: "TechGlobal Inc.",
      date: "2024-03-15",
      time: "09:00 - 18:00",
      location: "Convention Center, San Francisco",
      category: "Technology",
      attendees: 2500,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      description: "Join the leading tech innovators for a day of cutting-edge presentations and networking.",
      sponsors: ["Google Cloud", "Microsoft", "AWS"],
      price: "$199",
      featured: true,
      rating: 4.8
    }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
      } catch (err) {
        setError('Failed to load events. Please try again.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by date
    if (selectedDate !== 'all') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        if (selectedDate === 'upcoming') return eventDate >= today;
        if (selectedDate === 'past') return eventDate < today;
        return true;
      });
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, selectedDate, events]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="events-page">
        <EventsHeader />
        <LoadingSpinner 
          size="large" 
          text="Loading events..." 
          className="events-loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page">
        <EventsHeader />
        <div className="error-container">
          <h3>Unable to load events</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <EventsHeader />
      
      <section className="events-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Discover Amazing Events</h1>
            <p>Find and join events that match your interests. Connect with organizers, exhibitors, and fellow attendees.</p>
          </div>
        </div>
      </section>

      <section className="events-section">
        <div className="container">
          <div className="events-filters">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search events, organizers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <div className="filter-group">
                <FaFilter className="filter-icon" />
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category === 'All Categories' ? 'all' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <FaCalendarAlt className="filter-icon" />
                <select 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Dates</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Events</option>
                </select>
              </div>
            </div>
          </div>

          <div className="events-stats">
            <p>Found <strong>{filteredEvents.length}</strong> events matching your criteria</p>
          </div>

          <div className="events-grid">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} renderStars={renderStars} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="no-events">
              <h3>No events found</h3>
              <p>Try adjusting your search criteria or browse all categories.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const EventsHeader = () => {
  return (
    <header className="events-header">
      <div className="container">
        <div className="nav-container">
          <Link to="/" className="logo-container">
            <img src={Logo} alt="CREOEvent Logo"/>
          </Link>
          <nav>
            <ul>
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/events" className="nav-link active">Events</Link></li>
              <li><Link to="/login" className="login-btn">Login</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

const EventCard = ({ event, renderStars }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className={`event-card ${event.featured ? 'featured' : ''}`}>
      {event.featured && <div className="featured-badge">Featured</div>}
      
      <div className="event-image">
        <img src={event.image} alt={event.title} />
        <div className="event-overlay">
          <div className="event-rating">
            {renderStars(event.rating)}
            <span className="rating-value">{event.rating}</span>
          </div>
        </div>
      </div>

      <div className="event-content">
        <div className="event-category">{event.category}</div>
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>

        <div className="event-organizer">
          <FaBuilding className="organizer-icon" />
          <span>By {event.organizer}</span>
        </div>

        <div className="event-details">
          <div className="detail-item">
            <FaCalendarAlt className="detail-icon" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="detail-item">
            <FaClock className="detail-icon" />
            <span>{event.time}</span>
          </div>
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <span>{event.location}</span>
          </div>
          <div className="detail-item">
            <FaUsers className="detail-icon" />
            <span>{event.attendees.toLocaleString()} attendees</span>
          </div>
        </div>

        {event.sponsors && event.sponsors.length > 0 && (
          <div className="event-sponsors">
            <strong>Sponsored by:</strong>
            <div className="sponsors-list">
              {event.sponsors.map((sponsor, index) => (
                <span key={index} className="sponsor-tag">{sponsor}</span>
              ))}
            </div>
          </div>
        )}

        <div className="event-footer">
          <div className="event-price">{event.price}</div>
          <button className="event-button">
            View Details <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Events;