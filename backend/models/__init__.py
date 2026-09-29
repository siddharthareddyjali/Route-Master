from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

from .route_plan import RoutePlan
from .route import Route
from .route_stop import RouteStop
from .location import Location