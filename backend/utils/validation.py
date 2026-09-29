

def validate_route_payload(payload):
    if not payload.get("locations"):
        raise ValueError("At least one stop is required before route generation.")
    if payload.get("vehicles", 0) <= 0:
        raise ValueError("Available vehicles must be greater than zero.")
    if not payload.get("start"):
        raise ValueError("Start location is required.")
    if not payload.get("end"):
        raise ValueError("End location is required.")

    for location in payload["locations"]:
        if "name" not in location or "latitude" not in location or "longitude" not in location:
            raise ValueError("Every stop must include a name, latitude and longitude.")
    return True