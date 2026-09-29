from models import db


class RouteStop(db.Model):
    __tablename__ = "route_stops"

    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey("routes.id"), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey("locations.id"), nullable=False)
    stop_order = db.Column(db.Integer, nullable=False)

    route = db.relationship("Route", back_populates="stops")
    location = db.relationship("Location", back_populates="route_stops")

    def to_dict(self):
        return {
            "id": self.id,
            "route_id": self.route_id,
            "location_id": self.location_id,
            "stop_order": self.stop_order,
        }