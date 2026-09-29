import { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import api from '../services/api';

function HistoryPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get('/api/routes').then((response) => {
      setPlans(response.data.plans || []);
    }).catch(() => {
      setPlans([]);
    });
  }, []);

  return (
    <div className="page-shell">
      <Navbar />
      <div className="container history-section">
        <div className="section-heading left-align">
          <span className="eyebrow">Route history</span>
          <h2>Saved route plans</h2>
        </div>
        {plans.length === 0 ? (
          <div className="card empty-state-card">No route history yet. Generate your first route plan to save it.</div>
        ) : (
          <div className="history-grid">
            {plans.map((plan) => (
              <div key={plan.id} className="card history-card">
                <h3>{plan.name}</h3>
                <p>{plan.created_at}</p>
                <div className="meta-row">
                  <span>{plan.vehicle_count} vehicles</span>
                  <span>{plan.total_stops} stops</span>
                </div>
                <div className="meta-row">
                  <span>{plan.total_distance} km</span>
                  <span>{plan.total_duration} min</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
