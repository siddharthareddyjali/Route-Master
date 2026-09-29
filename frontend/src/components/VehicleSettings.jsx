import { Minus, Plus } from 'lucide-react';

function VehicleSettings({ vehicleCount, onChangeVehicleCount, maxStops, onMaxStopsChange, start, onStartChange, end, onEndChange }) {
  return (
    <div className="panel-box">
      <div className="panel-header">
        <h3>Vehicles</h3>
      </div>
      <div className="vehicle-counter">
        <button type="button" className="counter-btn" onClick={() => onChangeVehicleCount(Math.max(1, vehicleCount - 1))}><Minus size={16} /></button>
        <span>{vehicleCount}</span>
        <button type="button" className="counter-btn" onClick={() => onChangeVehicleCount(Math.min(20, vehicleCount + 1))}><Plus size={16} /></button>
      </div>
      <div className="field-group">
        <label>Maximum Stops Per Vehicle</label>
        <input
          type="number"
          min="1"
          max="500"
          value={maxStops}
          onChange={(e) => onMaxStopsChange(e.target.value)}
          placeholder="Optional"
        />
        <span className="field-hint">Leave blank for balanced automatic distribution.</span>
      </div>
      <div className="field-group">
        <label>Start Location</label>
        <input value={start.name} onChange={(e) => onStartChange({ ...start, name: e.target.value })} placeholder="Warehouse" />
      </div>
      <div className="field-group">
        <label>End Location</label>
        <input value={end.name} onChange={(e) => onEndChange({ ...end, name: e.target.value })} placeholder="Warehouse" />
      </div>
    </div>
  );
}

export default VehicleSettings;
