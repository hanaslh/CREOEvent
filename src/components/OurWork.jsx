const OurWork = () => {
  const projects = [
    {
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      title: "E Art Expo 2024",
      description: "Connected 250+ tech companies with 15,000+ visitors"
    }
  ];

  return (
    <section id="our-work" className="our-work">
      <div className="container">
        <div className="section-title">
          <h2>Our Work</h2>
          <p>See how we've helped connect events with the right participants</p>
        </div>
        <div className="work-grid">
          {projects.map((project, index) => (
            <WorkCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkCard = ({ image, title, description }) => {
  return (
    <div className="work-card">
      <img src={image} alt={title} />
      <div className="work-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default OurWork;