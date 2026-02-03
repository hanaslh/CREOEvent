import { useState, useEffect, useRef, useCallback } from 'react';

const Statistics = () => {
  const [counters, setCounters] = useState({
    events: 0,
    users: 0,
    partners: 0
  });
  const statsRef = useRef(null);

  const animateCounter = useCallback((target, type) => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCounters(prev => ({ ...prev, [type]: target }));
        clearInterval(timer);
      } else {
        setCounters(prev => ({ ...prev, [type]: Math.floor(start) }));
      }
    }, 16);
  }, []);

  const animateCounters = useCallback(() => {
    animateCounter(10, 'events');
    animateCounter(100, 'users');
    animateCounter(10, 'partners');
  }, [animateCounter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [animateCounters]);

  return (
    <section className="statistics" ref={statsRef}>
      <div className="container">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{counters.events}+</div>
            <div className="stat-label">Managed Events</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{counters.users}+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{counters.partners}+</div>
            <div className="stat-label">Trusted Partners</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;