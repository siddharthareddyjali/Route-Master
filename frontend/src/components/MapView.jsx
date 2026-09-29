import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';

const routeColors = ['#16805b', '#0f766e', '#65a30d', '#d97745', '#0d9488', '#84cc16'];

function MapView({ start, end, plan, locations }) {
  const markers = locations || [];
  const activeRoutes = plan?.routes || [];
  const routeColorMap = {};
  activeRoutes.forEach((route, index) => {
    routeColorMap[route.vehicle] = routeColors[index % routeColors.length];
  });

  return (
    <div className="map-panel">
      <MapContainer center={[17.4065, 78.4772]} zoom={11} scrollWheelZoom className="leaflet-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {start && (
          <CircleMarker center={[start.latitude, start.longitude]} pathOptions={{ color: '#111827', fillColor: '#0f766e', fillOpacity: 1 }} radius={8}>
            <Popup>Start: {start.name}</Popup>
          </CircleMarker>
        )}

        {end && (
          <CircleMarker center={[end.latitude, end.longitude]} pathOptions={{ color: '#111827', fillColor: '#c2410c', fillOpacity: 1 }} radius={8}>
            <Popup>End: {end.name}</Popup>
          </CircleMarker>
        )}

        {activeRoutes.map((route) => (
          <Polyline
            key={route.vehicle}
            positions={route.geometry || []}
            pathOptions={{ color: routeColorMap[route.vehicle], weight: 4 }}
          >
            <Popup>
              <div>
                <strong>Vehicle {route.vehicle}</strong>
                <br />
                Stops: {route.stops.length}
                <br />
                Distance: {route.distance} km
                <br />
                Time: {route.duration} min
              </div>
            </Popup>
          </Polyline>
        ))}

        {markers.map((location, idx) => (
          <Marker key={`${location.name}-${idx}`} position={[location.latitude, location.longitude]}>
            <Popup>
              <strong>{location.name}</strong>
              <div>{location.address}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
