import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Statistics from './components/Statistics'
import Services from './components/Services'
import OurWork from './components/OurWork'
import Footer from './components/Footer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Events from './pages/Events';
import EventPlanner from './pages/EventPlanner';
import Venue2D from './pages/Venue2D';
import ExhibitionPlanner from './pages/ExhibitionPlanner';
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ErrorBoundary>
    <Router>
      <div className="App">
        <div className="background-elements">
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
        </div>
        <div className="cyber-grid"></div>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event-planner" element={<EventPlanner />} />
          <Route path="/venue-2d" element={<Venue2D />} />
          <Route path="/exhibition-planner" element={<ExhibitionPlanner />} />
          <Route path="/" element={
            <>
              <Header scrollY={scrollY} />
              <Hero />
              <Statistics />
              <Services />
              <OurWork />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
    </ErrorBoundary>
  )
}

export default App