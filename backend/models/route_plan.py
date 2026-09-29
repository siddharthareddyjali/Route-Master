from models import db


class RoutePlan(db.Model):
    __tablename__ = "route_plans"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    start_name = db.Column(db.String(255), nullable=False)
    start_latitude = db.Column(db.Float, nullable=False)
    start_longitude = db.Column(db.Float, nullable=False)
    end_name = db.Column(db.String(255), nullable=False)
    end_latitude = db.Column(db.Float, nullable=False)
    end_longitude = db.Column(db.Float, nullable=False)
    vehicle_count = db.Column(db.Integer, nullable=False)
    total_stops = db.Column(db.Integer, nullable=False)
    total_distance = db.Column(db.Float, nullable=False)
    total_duration = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    locations = db.relationship("Location", back_populates="route_plan", cascade="all, delete-orphan")
    routes = db.relationship("Route", back_populates="route_plan", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "start_name": self.start_name,
            "start_latitude": self.start_latitude,
            "start_longitude": self.start_longitude,
            "end_name": self.end_name,
            "end_latitude": self.end_latitude,
            "end_longitude": self.end_longitude,
            "vehicle_count": self.vehicle_count,
            "total_stops": self.total_stops,
            "total_distance": round(self.total_distance, 2),
            "total_duration": round(self.total_duration, 2),
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }