import { FaSearch, FaUsers, FaTicketAlt } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: <FaSearch />,
      title: "For Exhibitors",
      description: "Discover relevant events and salons to showcase your products and services. Get detailed insights to make informed participation decisions."
    },
    {
      icon: <FaUsers />,
      title: "For Organizers",
      description: "Promote your events to a targeted audience of exhibitors and visitors. Manage registrations and maximize event attendance."
    },
    {
      icon: <FaTicketAlt />,
      title: "For Visitors",
      description: "Find events that match your interests. Plan your visit, purchase tickets, and get the most out of every exhibition experience."
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>We provide comprehensive solutions for all stakeholders in the event ecosystem</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="service-card">
      <div className="service-icon">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Services;