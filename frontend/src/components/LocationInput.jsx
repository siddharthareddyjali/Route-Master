import { LoaderCircle, MapPin, Search, UploadCloud } from 'lucide-react';

function LocationInput({ searchQuery, onSearchChange, onSearchSubmit, searchResults, onSelectSearchResult, onMapAdd, onCsvUpload, loading, locations }) {
  return (
    <div className="panel-box">
      <div className="panel-header">
        <h3>Locations</h3>
        <button type="button" className="secondary-button small-button" onClick={onMapAdd}>Add Stop</button>
      </div>
      <div className="search-box">
        <Search size={16} />
        <input value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search location..." />
        <button type="button" className="small-button" onClick={onSearchSubmit}>Search</button>
      </div>
      {searchResults.length > 0 && (
        <div className="result-list">
          {searchResults.map((result) => (
            <button key={`${result.latitude}-${result.longitude}`} type="button" className="result-item" onClick={() => onSelectSearchResult(result)}>
              <MapPin size={14} />
              <span>{result.display_name}</span>
            </button>
          ))}
        </div>
      )}
      <label className="upload-box">
        <UploadCloud size={16} />
        <span>Upload CSV</span>
        <input type="file" accept=".csv" onChange={onCsvUpload} />
      </label>
      <div className="chip-list">
        {locations.length === 0 ? <span className="empty-text">No stops added yet.</span> : locations.map((location) => (
          <span key={location.id || `${location.name}-${location.latitude}`} className="chip">{location.name}</span>
        ))}
      </div>
      {loading && <div className="inline-loader"><LoaderCircle size={14} className="spin" /> Preparing locations</div>}
    </div>
  );
}

export default LocationInput;
