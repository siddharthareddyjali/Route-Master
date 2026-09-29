import { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';

import LoadingState from '../components/LoadingState';
import LocationInput from '../components/LocationInput';
import MapView from '../components/MapView';
import Navbar from '../components/Navbar';
import RouteCard from '../components/RouteCard';
import RouteComparison from '../components/RouteComparison';
import RouteSummary from '../components/RouteSummary';
import VehicleSettings from '../components/VehicleSettings';
import api from '../services/api';

const defaultStart = { name: 'Hyderabad Warehouse', latitude: 17.4065, longitude: 78.4772 };
const defaultEnd = { name: 'Hyderabad Warehouse', latitude: 17.4065, longitude: 78.4772 };

const sampleLocations = [
  { name: 'Kukatpally', address: 'Kukatpally, Hyderabad', latitude: 17.4845, longitude: 78.4136 },
  { name: 'Madhapur', address: 'Madhapur, Hyderabad', latitude: 17.4399, longitude: 78.3916 },
  { name: 'Gachibowli', address: 'Gachibowli, Hyderabad', latitude: 17.4401, longitude: 78.3489 },
  { name: 'Banjara Hills', address: 'Banjara Hills, Hyderabad', latitude: 17.4068, longitude: 78.4516 },
  { name: 'Hitech City', address: 'Hitech City, Hyderabad', latitude: 17.4483, longitude: 78.3915 },
  { name: 'Secunderabad', address: 'Secunderabad, Hyderabad', latitude: 17.4399, longitude: 78.4983 },
  { name: 'Begumpet', address: 'Begumpet, Hyderabad', latitude: 17.4474, longitude: 78.4695 },
  { name: 'Ameerpet', address: 'Ameerpet, Hyderabad', latitude: 17.4376, longitude: 78.4487 },
  { name: 'Mehdipatnam', address: 'Mehdipatnam, Hyderabad', latitude: 17.3919, longitude: 78.4489 },
  { name: 'Jubilee Hills', address: 'Jubilee Hills, Hyderabad', latitude: 17.4157, longitude: 78.4128 },
  { name: 'Kondapur', address: 'Kondapur, Hyderabad', latitude: 17.4578, longitude: 78.3341 },
  { name: 'Manikonda', address: 'Manikonda, Hyderabad', latitude: 17.3929, longitude: 78.3886 },
  { name: 'LB Nagar', address: 'LB Nagar, Hyderabad', latitude: 17.3495, longitude: 78.5519 },
  { name: 'Dilsukhnagar', address: 'Dilsukhnagar, Hyderabad', latitude: 17.3688, longitude: 78.5244 },
  { name: 'Uppal', address: 'Uppal, Hyderabad', latitude: 17.4053, longitude: 78.5591 },
];

function PlannerPage() {
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [vehicles, setVehicles] = useState(3);
  const [locations, setLocations] = useState(sampleLocations);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState(null);
  const [maxStops, setMaxStops] = useState('');

  const routeOptions = useMemo(() => Array.from({ length: vehicles }, (_, index) => index + 1), [vehicles]);

  const handleGeocodeSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await api.post('/api/geocode', { address: searchQuery });
      const result = response.data.result;
      if (!result) {
        setError('No geocoding match was found for the search.');
        return;
      }
      setSearchResults([result]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to search for this location.');
    }
  };

  const handleSelectSearchResult = (result) => {
    const newStop = {
      name: result.display_name.split(',')[0].trim() || 'New Stop',
      address: result.display_name,
      latitude: Number(result.latitude),
      longitude: Number(result.longitude),
    };
    setLocations((current) => [...current, newStop]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleMapAdd = () => {
    const nextLocation = {
      name: `Stop ${locations.length + 1}`,
      address: 'Map selected stop',
      latitude: start.latitude + (locations.length * 0.0025),
      longitude: start.longitude + (locations.length * 0.0035),
    };
    setLocations((current) => [...current, nextLocation]);
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      setError('CSV must include at least a header and one row.');
      return;
    }

    const parsed = [];
    for (let index = 1; index < lines.length; index += 1) {
      const [name, address] = lines[index].split(',');
      if (!name || !address) continue;
      parsed.push({ name: name.trim(), address: address.trim() });
    }

    const geocodedStops = [];
    for (const item of parsed) {
      try {
        const response = await api.post('/api/geocode', { address: item.address });
        const result = response.data.result;
        geocodedStops.push({
          name: item.name,
          address: item.address,
          latitude: Number(result.latitude),
          longitude: Number(result.longitude),
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to geocode one or more CSV rows.');
      }
    }

    if (geocodedStops.length > 0) {
      setLocations((current) => [...current, ...geocodedStops]);
    }
    event.target.value = '';
  };

  const handleGenerateRoutes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/routes/generate', {
        start,
        end,
        vehicles,
        locations,
        max_stops_per_vehicle: maxStops ? Number(maxStops) : null,
      });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Unable to generate routes.');
      }
      setPlan(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'The planner could not generate routes.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveStop = async (fromVehicle, stopName, targetVehicle) => {
    if (fromVehicle === targetVehicle || !plan) return;
    const movedStop = plan.routes
      .find((route) => route.vehicle === fromVehicle)
      ?.stops.find((stop) => stop.name === stopName);
    const updatedRoutes = plan.routes.map((route) => {
      if (route.vehicle === fromVehicle) {
        return { ...route, stops: route.stops.filter((stop) => stop.name !== stopName) };
      }
      if (route.vehicle === targetVehicle) {
        return { ...route, stops: movedStop ? [...route.stops, movedStop] : route.stops };
      }
      return route;
    });

    const payload = {
      start,
      end,
      vehicles,
      routes: updatedRoutes,
    };

    try {
      const response = await api.post('/api/routes/recalculate', payload);
      setPlan(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to recalculate routes.');
    }
  };

  const handleLoadSampleData = () => {
    setLocations(sampleLocations);
    setStart(defaultStart);
    setEnd(defaultEnd);
    setVehicles(3);
    setPlan(null);
    setError('');
  };

  const handleExportCsv = () => {
    if (!plan || !plan.routes) return;
    const rows = [['vehicle', 'stop_order', 'location', 'address', 'latitude', 'longitude']];
    plan.routes.forEach((route) => {
      route.stops.forEach((stop, index) => {
        rows.push([route.vehicle, index + 1, stop.name, stop.address || '', stop.latitude || '', stop.longitude || '']);
      });
    });
    const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'routemaster-plan.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportPdf = () => {
    if (!plan || !plan.routes) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('RouteMaster', 14, 20);
    doc.setFontSize(12);
    doc.text('Route Plan', 14, 30);
    doc.text(`Total Distance: ${plan.summary?.total_distance ?? 0} km`, 14, 40);
    doc.text(`Estimated Time: ${plan.summary?.total_duration ?? 0} min`, 14, 48);

    let cursorY = 62;
    plan.routes.forEach((route) => {
      doc.setFontSize(13);
      doc.text(`Vehicle ${route.vehicle}`, 14, cursorY);
      cursorY += 8;
      doc.setFontSize(11);
      doc.text(`Stops: ${route.stops.length}`, 16, cursorY);
      cursorY += 8;
      route.stops.forEach((stop, index) => {
        doc.text(`${index + 1}. ${stop.name}`, 18, cursorY);
        cursorY += 7;
      });
      cursorY += 8;
      if (cursorY > 250) {
        doc.addPage();
        cursorY = 18;
      }
    });

    doc.save('routemaster-plan.pdf');
  };

  return (
    <div className="page-shell planner-shell">
      <Navbar />
      <div className="container planner-layout">
        <aside className="sidebar-panel">
          <div className="top-actions">
            <Link to="/" className="local-link">Home</Link>
            <Link to="/history" className="local-link">History</Link>
            <button type="button" className="local-link" onClick={handleLoadSampleData}>Load Sample Data</button>
          </div>
          <VehicleSettings
            vehicleCount={vehicles}
            onChangeVehicleCount={setVehicles}
            maxStops={maxStops}
            onMaxStopsChange={setMaxStops}
            start={start}
            onStartChange={setStart}
            end={end}
            onEndChange={setEnd}
          />
          <LocationInput
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleGeocodeSearch}
            searchResults={searchResults}
            onSelectSearchResult={handleSelectSearchResult}
            onMapAdd={handleMapAdd}
            onCsvUpload={handleCsvUpload}
            loading={loading}
            locations={locations}
          />
          <button type="button" className="primary-button full-width" onClick={handleGenerateRoutes} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Routes'}
          </button>
          {plan && (
            <div className="export-row">
              <button type="button" className="secondary-button small-button" onClick={handleExportCsv}>Export CSV</button>
              <button type="button" className="secondary-button small-button" onClick={handleExportPdf}>Export PDF</button>
            </div>
          )}
          {error && <div className="error-box">{error}</div>}
        </aside>

        <main className="workspace-panel">
          <div className="workspace-header">
            <div>
              <span className="eyebrow">Route planner</span>
              <h2>Multi-vehicle route generation</h2>
            </div>
          </div>
          {loading ? <LoadingState /> : <MapView start={start} end={end} plan={plan} locations={locations} />}
          {plan && (
            <>
              <RouteSummary summary={plan.summary} />
              <RouteComparison routes={plan.routes} />
              <div className="route-grid">
                {plan.routes.map((route) => (
                  <RouteCard key={route.vehicle} route={route} vehicleOptions={routeOptions} onMoveStop={handleMoveStop} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default PlannerPage;
