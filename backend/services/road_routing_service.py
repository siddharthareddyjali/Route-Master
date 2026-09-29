import requests


class RoadRoutingService:
    @staticmethod
    def route_geometry(points):
        if len(points) < 2:
            raise ValueError("At least two points are required for routing.")

        coordinates = []
        for point in points:
            coordinates.append(f"{point['longitude']},{point['latitude']}")
        route_string = ";".join(coordinates)
        url = f"https://router.project-osrm.org/route/v1/driving/{route_string}?overview=full&geometries=geojson"

        response = requests.get(url, timeout=20)
        if response.status_code != 200:
            raise RuntimeError("Road routing service is unavailable.")

        payload = response.json()
        if not payload.get('routes'):
            raise RuntimeError("No route geometry returned by the routing service.")

        route = payload['routes'][0]
        geometry = route.get('geometry', {}).get('coordinates', [])
        return {
            "distance_km": round(route.get('distance', 0) / 1000, 2),
            "duration_minutes": round(route.get('duration', 0) / 60, 2),
            "geometry": [[lat, lon] for lon, lat in geometry],
        }