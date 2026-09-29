function RouteCard({ route, vehicleOptions, onMoveStop }) {
  return (
    <div className="route-card">
      <div className="route-card-header">
        <h3>Vehicle {route.vehicle}</h3>
        <span>{route.stops.length} Stops</span>
      </div>
      <div className="route-stat-row">
        <span>{route.distance} km</span>
        <span>{route.duration} min</span>
      </div>
      <div className="stop-list">
        {route.stops.map((stop, index) => (
          <div key={`${route.vehicle}-${stop.name}-${index}`} className="stop-row">
            <div>
              <strong>Stop #{index + 1}</strong>
              <div>{stop.name}</div>
            </div>
            <select value={route.vehicle} onChange={(e) => onMoveStop(route.vehicle, stop.name, Number(e.target.value))}>
              {vehicleOptions.map((vehicle) => (
                <option key={vehicle} value={vehicle}>Vehicle {vehicle}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RouteCard;
