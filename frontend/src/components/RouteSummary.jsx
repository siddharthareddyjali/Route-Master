function RouteSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <span>Total Routes</span>
        <strong>{summary.total_routes}</strong>
      </div>
      <div className="summary-card">
        <span>Total Stops</span>
        <strong>{summary.total_stops}</strong>
      </div>
      <div className="summary-card">
        <span>Total Distance</span>
        <strong>{summary.total_distance} km</strong>
      </div>
      <div className="summary-card">
        <span>Estimated Time</span>
        <strong>{summary.total_duration} min</strong>
      </div>
    </div>
  );
}

export default RouteSummary;
