# RouteMaster Frontend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set your backend URL.
3. Run the app:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

## Troubleshooting

- If the map does not render, ensure Leaflet CSS is available.
- If the backend is not running on `http://localhost:5000`, update `VITE_API_URL`.
