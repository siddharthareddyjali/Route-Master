from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from database.init_db import init_db
from routes.geocoding import geocoding_bp
from routes.history import history_bp
from routes.routing import routing_bp


app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "*"}})

init_db(app)

app.register_blueprint(geocoding_bp, url_prefix="/api")
app.register_blueprint(routing_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")


@app.get("/api/health")
def health_check():
    return jsonify({"success": True, "message": "RouteMaster backend is running."})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)