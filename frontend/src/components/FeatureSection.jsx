import { ArrowUpDown, Map, Route as RouteIcon, SlidersHorizontal, Truck } from 'lucide-react';

const features = [
  { title: 'Multi-Vehicle Planning', description: 'Automatically create routes based on the number of available vehicles.', icon: Truck },
  { title: 'Smart Location Distribution', description: 'Group geographically nearby locations intelligently.', icon: RouteIcon },
  { title: 'Route Optimization', description: 'Generate an efficient stop sequence for each vehicle.', icon: ArrowUpDown },
  { title: 'Interactive Maps', description: 'Visualize every route using OpenStreetMap and Leaflet.', icon: Map },
  { title: 'Route Comparison', description: 'Compare distance, travel time and number of stops.', icon: SlidersHorizontal },
  { title: 'Route Management', description: 'Edit, save and export generated route plans.', icon: RouteIcon },
];

function FeatureSection() {
  return (
    <section id="features" className="feature-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Why teams choose RouteMaster</span>
          <h2>Built for modern field and delivery operations</h2>
        </div>
        <div className="feature-grid">
          {features.map(({ title, description, icon: Icon }) => (
            <article key={title} className="feature-card">
              <div className="feature-icon"><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
