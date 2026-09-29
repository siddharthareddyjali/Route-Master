from flask import Blueprint, jsonify, request

from models import db
from models.location import Location
from models.route import Route
from models.route_plan import RoutePlan
from models.route_stop import RouteStop
from services.clustering_service import assign_locations_to_vehicles
from services.optimization_service import nearest_neighbor_route, two_opt_order
from services.road_routing_service import RoadRoutingService
from utils.validation import validate_route_payload

routing_bp = Blueprint("routing_bp", __name__)


@routing_bp.route("/routes/generate", methods=["POST"])
def generate_routes():
    try:
        payload = request.get_json(silent=True) or {}
        validate_route_payload(payload)

        start = payload["start"]
        end = payload["end"]
        locations = payload["locations"]
        vehicles = int(payload["vehicles"])

        assignments = assign_locations_to_vehicles(
            locations,
            vehicles,
            start=start,
            end=end,
            max_stops_per_vehicle=payload.get("max_stops_per_vehicle"),
        )

        generated_routes = []
        total_distance = 0.0
        total_duration = 0.0

        for vehicle_number in range(1, vehicles + 1):
            cluster_locations = assignments.get(vehicle_number - 1, []) if vehicle_number - 1 in assignments else assignments.get(vehicle_number, [])
            if not cluster_locations:
                cluster_locations = []
            if not cluster_locations:
                continue

            route_points = nearest_neighbor_route(start, cluster_locations, end)
            optimized = two_opt_order(route_points)
            route_result = RoadRoutingService.route_geometry(optimized)
            total_distance += route_result["distance_km"]
            total_duration += route_result["duration_minutes"]

            generated_routes.append({
                "vehicle": vehicle_number,
                "stops": [{
                    "id": item.get("id"),
                    "name": item.get("name"),
                    "latitude": item.get("latitude"),
                    "longitude": item.get("longitude"),
                    "address": item.get("address")
                } for item in cluster_locations],
                "distance": route_result["distance_km"],
                "duration": route_result["duration_minutes"],
                "geometry": route_result["geometry"],
                "route_order": [point.get("name") for point in optimized if point.get("name")],
            })

        summary = {
            "total_routes": len(generated_routes),
            "total_stops": sum(len(route["stops"]) for route in generated_routes),
            "total_distance": round(total_distance, 2),
            "total_duration": round(total_duration, 2),
        }

        plan_name = f"Route Plan {len(RoutePlan.query.all()) + 1}"
        new_plan = RoutePlan(
            name=plan_name,
            start_name=start.get("name", "Warehouse"),
            start_latitude=float(start["latitude"]),
            start_longitude=float(start["longitude"]),
            end_name=end.get("name", "Warehouse"),
            end_latitude=float(end["latitude"]),
            end_longitude=float(end["longitude"]),
            vehicle_count=vehicles,
            total_stops=summary["total_stops"],
            total_distance=summary["total_distance"],
            total_duration=summary["total_duration"],
        )
        db.session.add(new_plan)
        db.session.flush()

        for location_data in locations:
            location_record = Location(
                route_plan_id=new_plan.id,
                name=location_data["name"],
                address=location_data.get("address", location_data.get("name", "")),
                latitude=float(location_data["latitude"]),
                longitude=float(location_data["longitude"]),
                priority=0,
            )
            db.session.add(location_record)
            db.session.flush()

        route_index = 1
        for route_data in generated_routes:
            route_record = Route(
                route_plan_id=new_plan.id,
                vehicle_number=route_data["vehicle"],
                distance=route_data["distance"],
                duration=route_data["duration"],
            )
            db.session.add(route_record)
            db.session.flush()

            for stop_order, stop in enumerate(route_data["stops"], start=1):
                location_match = Location.query.filter_by(
                    route_plan_id=new_plan.id,
                    name=stop["name"],
                    latitude=float(stop["latitude"]),
                    longitude=float(stop["longitude"]),
                ).first()
                if location_match:
                    db.session.add(RouteStop(route_id=route_record.id, location_id=location_match.id, stop_order=stop_order))
            route_index += 1
        db.session.commit()

        return jsonify({
            "success": True,
            "routes": generated_routes,
            "summary": summary,
            "plan_id": new_plan.id,
            "message": "Routes generated successfully.",
        })
    except ValueError as exc:
        return jsonify({"success": False, "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"success": False, "message": f"Unable to generate routes: {str(exc)}"}), 500


@routing_bp.route("/routes/recalculate", methods=["POST"])
def recalculate_routes():
    payload = request.get_json(silent=True) or {}
    if not payload.get("routes"):
        return jsonify({"success": False, "message": "Please provide route assignments to recalculation."}), 400

    locations = []
    for route in payload["routes"]:
        for stop in route.get("stops", []):
            locations.append(stop)

    if not locations:
        return jsonify({"success": False, "message": "No stops available for recalculation."}), 400

    start = payload.get("start", {})
    end = payload.get("end", {})
    if not start or not end:
        return jsonify({"success": False, "message": "Both start and end locations are required."}), 400

    revised_routes = []
    for route in payload["routes"]:
        route_stops = route.get("stops", [])
        if not route_stops:
            continue
        route_points = nearest_neighbor_route(start, route_stops, end)
        optimized = two_opt_order(route_points)
        route_result = RoadRoutingService.route_geometry(optimized)
        revised_routes.append({
            "vehicle": route.get("vehicle"),
            "stops": route_stops,
            "distance": route_result["distance_km"],
            "duration": route_result["duration_minutes"],
            "geometry": route_result["geometry"],
            "route_order": [point.get("name") for point in optimized if point.get("name")],
        })

    return jsonify({
        "success": True,
        "routes": revised_routes,
        "summary": {
            "total_routes": len(revised_routes),
            "total_stops": sum(len(route["stops"]) for route in revised_routes),
            "total_distance": round(sum(route["distance"] for route in revised_routes), 2),
            "total_duration": round(sum(route["duration"] for route in revised_routes), 2),
        },
        "message": "Routes recalculated successfully.",
    })