from math import atan2, cos, radians, sin, sqrt


def haversine_km(point_a, point_b):
    lat1, lon1 = map(radians, [point_a["latitude"], point_a["longitude"]])
    lat2, lon2 = map(radians, [point_b["latitude"], point_b["longitude"]])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 2 * 6371 * atan2(sqrt(a), sqrt(1 - a))