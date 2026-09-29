from math import radians, sin, cos, sqrt, atan2


def haversine_distance(point_a, point_b):
    lat1, lon1 = map(radians, [point_a["latitude"], point_a["longitude"]])
    lat2, lon2 = map(radians, [point_b["latitude"], point_b["longitude"]])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 2 * 6371 * atan2(sqrt(a), sqrt(1 - a))


def nearest_neighbor_route(start, points, end):
    if not points:
        return [start, end]

    route = [start]
    remaining = list(points)
    current = start
    while remaining:
        nearest = min(remaining, key=lambda p: haversine_distance(current, p))
        route.append(nearest)
        remaining.remove(nearest)
        current = nearest
    route.append(end)
    return route


def two_opt_order(points):
    if len(points) <= 2:
        return points

    best_path = list(points)
    improved = True
    while improved:
        improved = False
        for i in range(1, len(best_path) - 2):
            for j in range(i + 1, len(best_path) - 1):
                if j - i == 1:
                    continue
                candidate = best_path[:]
                candidate[i:j + 1] = reversed(candidate[i:j + 1])
                if total_distance(candidate) < total_distance(best_path):
                    best_path = candidate
                    improved = True
    return best_path


def total_distance(points):
    distance = 0.0
    for i in range(1, len(points)):
        distance += haversine_distance(points[i - 1], points[i])
    return distance