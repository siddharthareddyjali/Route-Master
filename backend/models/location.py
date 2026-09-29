from models import db


class Location(db.Model):
    __tablename__ = "locations"

    id = db.Column(db.Integer, primary_key=True)
    route_plan_id = db.Column(db.Integer, db.ForeignKey("route_plans.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    priority = db.Column(db.Integer, default=0)

    route_plan = db.relationship("RoutePlan", back_populates="locations")
    route_stops = db.relationship("RouteStop", back_populates="location", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "route_plan_id": self.route_plan_id,
            "name": self.name,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "priority": self.priority,
        }