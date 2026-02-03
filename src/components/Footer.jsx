import { FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <FooterAbout />
          </div>
          <div className="footer-section">
            <FooterLinks 
              title="Quick Links"
              links={[
                { text: "Home", href: "#home" },
                { text: "Services", href: "#services" },
                { text: "Our Work", href: "#our-work" },
                { text: "Contact", href: "#footer" },
                { text: "Privacy Policy", href: "#" }
              ]}
            />
          </div>
          <div className="footer-section">
            <FooterLinks 
              title="Our Services"
              links={[
                { text: "For Exhibitors", href: "#" },
                { text: "For Organizers", href: "#" },
                { text: "For Visitors", href: "#" },
                { text: "Event Management", href: "#" },
                { text: "Marketing Solutions", href: "#" }
              ]}
            />
          </div>
          <div className="footer-section">
            <FooterContact />
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 CREOEvent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterAbout = () => {
  return (
    <div className="footer-about">
      <div className="footer-logo">
        <FaCalendarAlt /> CREOEvent
      </div>
      <p>CREOEvent is the leading platform connecting event organizers, exhibitors, and visitors in a seamless ecosystem.</p>
      <div className="social-links">
        <a href="#"><FaFacebookF /></a>
        <a href="#"><FaTwitter /></a>
        <a href="#"><FaInstagram /></a>
        <a href="#"><FaLinkedinIn /></a>
      </div>
    </div>
  );
};

const FooterLinks = ({ title, links }) => {
  return (
    <div className="footer-links">
      <h4>{title}</h4>
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href}>{link.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterContact = () => {
  return (
    <div className="footer-contact">
      <h4>Contact Info</h4>
      <div className="contact-item">
        <FaMapMarkerAlt className="contact-icon" />
        <span>C R E O, Setif, Algeria</span>
      </div>
      <div className="contact-item">
        <FaPhone className="contact-icon" />
        <span>+213 555 55 55 55</span>
      </div>
      <div className="contact-item">
        <FaEnvelope className="contact-icon" />
        <span>info@creoevent.com</span>
      </div>
    </div>
  );
};

export default Footer;