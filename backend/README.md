# RouteMaster Backend

This backend powers the RouteMaster route planner and stores route history in MySQL when configured.

## Requirements

- Python 3.10+
- MySQL server (optional for local demo; SQLite is used when MySQL config is absent)

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and fill in MySQL values if needed.

## Run

```bash
python app.py
```

## API Overview

- GET /api/health
- POST /api/geocode
- POST /api/routes/generate
- POST /api/routes/recalculate
- GET /api/routes
- GET /api/routes/<id>
- DELETE /api/routes/<id>

## Troubleshooting

- If geocoding or routing is unavailable, the app falls back to local coordinate calculations and warns the frontend.
- If MySQL is not available, SQLite is used automatically for local demos.