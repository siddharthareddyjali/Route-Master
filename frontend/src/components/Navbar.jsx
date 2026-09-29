import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="topbar">
      <div className="container nav-shell">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-line brand-mark-line-one" />
            <span className="brand-mark-line brand-mark-line-two" />
            <span className="brand-mark-dot" />
          </span>
          RouteMaster
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/#how-it-works">How It Works</Link>
          <Link to="/#about">About</Link>
        </nav>
        <Link to="/planner" className="primary-button small-button">
          Launch Planner <ArrowRight size={16} />
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
