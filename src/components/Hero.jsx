import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaCalendarAlt } from 'react-icons/fa';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="container">
        <div className="hero-content">
          <div className="hero-slogan animate-on-scroll">
            YOU IMAGINE WE CREATE
          </div>
          <h2 className="hero-title animate-on-scroll">
            Connecting Exhibitors, Organizers & Visitors
          </h2>
          <p className="hero-description animate-on-scroll">
            CREOEvent is the first platform that seamlessly integrates event organizers, 
            exhibitors, and visitors in one sophisticated ecosystem. Discover your next 
            opportunity or showcase your exhibition with unparalleled ease.
          </p>
          <div className="cta-buttons animate-on-scroll">
            <Link to="/event-planner" className="btn btn-primary">
              <FaRocket className="btn-icon" />
              <span>Start Your Event</span>
            </Link>
            <Link to="/events" className="btn btn-secondary">
              <FaCalendarAlt className="btn-icon" />
              <span>Show Existing Events</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;