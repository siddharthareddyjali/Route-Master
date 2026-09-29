import { ArrowRight, Route, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Smart logistics planning</span>
          <h1>Plan Multiple Routes. Move Smarter.</h1>
          <p>
            Automatically distribute stops across your vehicles and generate optimized routes in seconds.
          </p>
          <div className="cta-row">
            <Link to="/planner" className="primary-button">
              Start Planning <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="secondary-button">
              See How It Works
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>50+</strong>
              <span>Stop planning</span>
            </div>
            <div>
              <strong>3x</strong>
              <span>Faster routing</span>
            </div>
            <div>
              <strong>20</strong>
              <span>Max vehicles</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="map-card">
            <div className="mini-map-header">
              <span className="map-badge"><Truck size={14} /> Fleet</span>
              <span className="map-badge muted"><Route size={14} /> 3 Routes</span>
            </div>
            <div className="mini-map">
              <div className="route-line route-red" />
              <div className="route-line route-blue" />
              <div className="route-line route-green" />
              <span className="node n1" />
              <span className="node n2" />
              <span className="node n3" />
              <span className="node n4" />
              <span className="node n5" />
              <span className="node n6" />
              <span className="node n7" />
              <span className="node n8" />
              <span className="node n9" />
              <span className="node n10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
