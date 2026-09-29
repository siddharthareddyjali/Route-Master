from flask import Blueprint, jsonify, request

from services.geocoding_service import GeocodingService

geocoding_bp = Blueprint("geocoding_bp", __name__)


@geocoding_bp.route("/geocode", methods=["POST"])
def geocode_address():
    try:
        payload = request.get_json(silent=True) or {}
        address = payload.get("address") or payload.get("query")
        if not address:
            return jsonify({"success": False, "message": "Address is required."}), 400

        result = GeocodingService.geocode_address(address)
        return jsonify({"success": True, "result": result})
    except ValueError as exc:
        return jsonify({"success": False, "message": str(exc)}), 400
    except Exception as exc:
        return jsonify({"success": False, "message": f"Unable to geocode address: {str(exc)}"}), 500