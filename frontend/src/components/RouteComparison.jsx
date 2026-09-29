function RouteComparison({ routes }) {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="table-card">
      <h3>Route Comparison</h3>
      <table>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Stops</th>
            <th>Distance</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.vehicle}>
              <td>Vehicle {route.vehicle}</td>
              <td>{route.stops.length}</td>
              <td>{route.distance} km</td>
              <td>{route.duration} min</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RouteComparison;
