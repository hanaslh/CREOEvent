import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import Logo from '../assets/creoeventlogo.svg';

const Header = ({ scrollY }) => {
  const location = useLocation();

  useEffect(() => {
  if (location.pathname === '/') {
    const handleSmoothScroll = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          setTimeout(() => {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 80;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 100);
        } else {
          console.warn(`Element with id "${targetId}" not found`);
        }
      }
    };

    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }
}, [location]);

  return (
    <header className={`header ${scrollY > 100 ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-container">
          <Link to="/" className="logo-container">
            <img src={Logo} alt="CREOEvent Logo"  className="logo-img"/>
          </Link>
          <nav>
            <ul>
              {location.pathname === '/' ? (
                <>
                  <li><a href="#home" className="nav-link">Home</a></li>
                  <li><a href="#services" className="nav-link">Services</a></li>
                  <li><a href="#our-work" className="nav-link">Our Work</a></li>
                  <li><a href="#footer" className="nav-link">Contacts</a></li>
                  <li><Link to="/login" className="login-btn">Login</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/" className="nav-link">Home</Link></li>
                  <li><Link to="/login" className="nav-link">Login</Link></li>
                  <li><Link to="/signup" className="login-btn">Sign Up</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;