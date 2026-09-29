import numpy as np
from sklearn.cluster import KMeans


def _distance(point_a, point_b):
    lat_scale = 111.0
    lon_scale = 111.0 * np.cos(np.radians((point_a["latitude"] + point_b["latitude"]) / 2))
    lat_delta = (point_a["latitude"] - point_b["latitude"]) * lat_scale
    lon_delta = (point_a["longitude"] - point_b["longitude"]) * lon_scale
    return float(np.sqrt(lat_delta ** 2 + lon_delta ** 2))


def _estimated_route_distance(points, start, end):
    if not points:
        return _distance(start, end)

    remaining = list(points)
    current = start
    total = 0.0
    while remaining:
        next_point = min(remaining, key=lambda point: _distance(current, point))
        total += _distance(current, next_point)
        current = next_point
        remaining.remove(next_point)
    return total + _distance(current, end)


def _balance_assignments(assignments, start, end, max_stops_per_vehicle):
    """Improve K-Means labels using depot-aware route length and stop balance."""
    # First make the number of stops practical. This keeps the optimizer from
    # preserving a large K-Means cluster merely because its centroid is close.
    for _ in range(len(assignments) * len(assignments)):
        largest_key = max(assignments, key=lambda key: len(assignments[key]))
        smallest_key = min(assignments, key=lambda key: len(assignments[key]))
        if len(assignments[largest_key]) - len(assignments[smallest_key]) <= 1:
            break
        if len(assignments[largest_key]) <= 1:
            break
        if max_stops_per_vehicle and len(assignments[smallest_key]) >= max_stops_per_vehicle:
            break

        best_move = min(
            assignments[largest_key],
            key=lambda location: _estimated_route_distance(
                assignments[smallest_key] + [location],
                start,
                end,
            ),
        )
        assignments[largest_key].remove(best_move)
        assignments[smallest_key].append(best_move)

    for _ in range(len(assignments) * 4):
        route_lengths = {
            key: _estimated_route_distance(points, start, end)
            for key, points in assignments.items()
        }
        longest_key = max(route_lengths, key=route_lengths.get)
        shortest_key = min(route_lengths, key=route_lengths.get)
        current_spread = max(route_lengths.values()) - min(route_lengths.values())
        best_move = None
        best_score = current_spread

        if longest_key == shortest_key:
            break

        for location in list(assignments[longest_key]):
            if len(assignments[longest_key]) <= 1:
                continue
            if max_stops_per_vehicle and len(assignments[shortest_key]) >= max_stops_per_vehicle:
                continue

            source_points = [point for point in assignments[longest_key] if point is not location]
            target_points = assignments[shortest_key] + [location]
            if abs(len(source_points) - len(target_points)) > 1:
                continue
            candidate_lengths = dict(route_lengths)
            candidate_lengths[longest_key] = _estimated_route_distance(source_points, start, end)
            candidate_lengths[shortest_key] = _estimated_route_distance(target_points, start, end)
            candidate_spread = max(candidate_lengths.values()) - min(candidate_lengths.values())

            # A small count penalty avoids creating a visually uneven stop split
            # when two moves produce almost identical distances.
            count_penalty = abs(len(source_points) - len(target_points)) * 0.15
            candidate_score = candidate_spread + count_penalty
            if candidate_score < best_score:
                best_score = candidate_score
                best_move = location

        if best_move is None:
            break

        assignments[longest_key].remove(best_move)
        assignments[shortest_key].append(best_move)

    # Swap stops between equally sized routes to reduce distance imbalance
    # without undoing the practical stop-count distribution.
    for _ in range(len(assignments) * 3):
        route_lengths = {
            key: _estimated_route_distance(points, start, end)
            for key, points in assignments.items()
        }
        longest_key = max(route_lengths, key=route_lengths.get)
        shortest_key = min(route_lengths, key=route_lengths.get)
        current_spread = max(route_lengths.values()) - min(route_lengths.values())
        best_pair = None
        best_spread = current_spread

        for long_point in assignments[longest_key]:
            for short_point in assignments[shortest_key]:
                long_candidate = [
                    point if point is not long_point else short_point
                    for point in assignments[longest_key]
                ]
                short_candidate = [
                    point if point is not short_point else long_point
                    for point in assignments[shortest_key]
                ]
                candidate_lengths = dict(route_lengths)
                candidate_lengths[longest_key] = _estimated_route_distance(long_candidate, start, end)
                candidate_lengths[shortest_key] = _estimated_route_distance(short_candidate, start, end)
                candidate_spread = max(candidate_lengths.values()) - min(candidate_lengths.values())
                if candidate_spread < best_spread:
                    best_spread = candidate_spread
                    best_pair = (long_point, short_point)

        if best_pair is None:
            break
        long_point, short_point = best_pair
        assignments[longest_key].remove(long_point)
        assignments[shortest_key].remove(short_point)
        assignments[longest_key].append(short_point)
        assignments[shortest_key].append(long_point)

    return assignments


def assign_locations_to_vehicles(
    locations,
    vehicle_count,
    start=None,
    end=None,
    max_stops_per_vehicle=None,
):
    if not locations:
        raise ValueError("At least one location is required.")
    if vehicle_count <= 0:
        raise ValueError("Vehicle count must be greater than zero.")
    if len(locations) < vehicle_count:
        raise ValueError("Number of locations must be greater than or equal to the number of vehicles.")
    if max_stops_per_vehicle is not None and max_stops_per_vehicle < 1:
        raise ValueError("Maximum stops per vehicle must be greater than zero.")
    if max_stops_per_vehicle and len(locations) > max_stops_per_vehicle * vehicle_count:
        raise ValueError("Maximum stops per vehicle is too low for all locations.")

    start = start or {"latitude": float(np.mean([location["latitude"] for location in locations])), "longitude": float(np.mean([location["longitude"] for location in locations]))}
    end = end or start

    coords = np.array([[loc["latitude"], loc["longitude"]] for loc in locations], dtype=float)
    model = KMeans(n_clusters=vehicle_count, n_init=10, random_state=42)
    labels = model.fit_predict(coords)

    assignments = {idx: [] for idx in range(vehicle_count)}
    for index, label in enumerate(labels):
        assignments[int(label)].append(locations[index])

    # K-Means supplies geographic seeds; this pass prevents one cluster from
    # owning most of the route distance while another vehicle stays local.
    return _balance_assignments(assignments, start, end, max_stops_per_vehicle)