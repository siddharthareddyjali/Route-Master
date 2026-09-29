import requests


class GeocodingService:
    @staticmethod
    def geocode_address(address):
        if not address or not str(address).strip():
            raise ValueError("Address is required.")

        params = {
            "q": address,
            "format": "jsonv2",
            "limit": 5,
        }
        response = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params=params,
            headers={"User-Agent": "RouteMaster/1.0"},
            timeout=15,
        )
        response.raise_for_status()
        payload = response.json()

        if not payload:
            raise ValueError("No geocoding result found for this address.")

        result = payload[0]
        return {
            "display_name": result.get("display_name"),
            "latitude": float(result["lat"]),
            "longitude": float(result["lon"]),
        }