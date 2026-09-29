from flask import Blueprint, jsonify

from models import db
from models.route_plan import RoutePlan
from models.location import Location
from models.route import Route
from models.route_stop import RouteStop

history_bp = Blueprint("history_bp", __name__)


@history_bp.route("/routes", methods=["GET"])
def list_route_plans():
    plans = RoutePlan.query.order_by(RoutePlan.created_at.desc()).all()
    return jsonify({"success": True, "plans": [plan.to_dict() for plan in plans]})


@history_bp.route("/routes/<int:plan_id>", methods=["GET"])
def get_route_plan(plan_id):
    plan = RoutePlan.query.get_or_404(plan_id)
    plan_data = plan.to_dict()
    plan_data["locations"] = [location.to_dict() for location in plan.locations]
    plan_data["routes"] = []
    for route in plan.routes:
        route_data = route.to_dict()
        route_data["stops"] = [stop.to_dict() for stop in route.stops]
        plan_data["routes"].append(route_data)
    return jsonify({"success": True, "plan": plan_data})


@history_bp.route("/routes/<int:plan_id>", methods=["DELETE"])
def delete_route_plan(plan_id):
    plan = RoutePlan.query.get_or_404(plan_id)
    db.session.delete(plan)
    db.session.commit()
    return jsonify({"success": True, "message": "Route plan deleted."})