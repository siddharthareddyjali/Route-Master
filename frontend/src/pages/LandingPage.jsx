import FeatureSection from '../components/FeatureSection';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Navbar from '../components/Navbar';

function LandingPage() {
  return (
    <div className="page-shell landing-shell">
      <Navbar />
      <main>
        <Hero />
        <FeatureSection />
        <HowItWorks />
        <section id="about" className="about-section">
          <div className="container about-box">
            <div>
              <span className="eyebrow">About RouteMaster</span>
              <h2>Purpose-built for dispatch and field service planning</h2>
            </div>
            <p>
              RouteMaster helps teams assign multiple stops across available vehicles, optimize route order, compare route performance, and make faster operational decisions without manual clustering.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
