from models import db


class Route(db.Model):
    __tablename__ = "routes"

    id = db.Column(db.Integer, primary_key=True)
    route_plan_id = db.Column(db.Integer, db.ForeignKey("route_plans.id"), nullable=False)
    vehicle_number = db.Column(db.Integer, nullable=False)
    distance = db.Column(db.Float, nullable=False)
    duration = db.Column(db.Float, nullable=False)

    route_plan = db.relationship("RoutePlan", back_populates="routes")
    stops = db.relationship("RouteStop", back_populates="route", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "route_plan_id": self.route_plan_id,
            "vehicle_number": self.vehicle_number,
            "distance": round(self.distance, 2),
            "duration": round(self.duration, 2),
        }