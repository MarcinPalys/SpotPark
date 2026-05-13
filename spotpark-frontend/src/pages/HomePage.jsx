import { useState, useEffect } from 'react';
import { parkingSpotService } from '../services/parkingSpotService';
import ParkingSpotCard from '../components/ParkingSpotCard';

export default function HomePage() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    parkingSpotService.getAll()
      .then(setSpots)
      .catch(() => setError('Failed to load parking spots.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = spots.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Find a Parking Spot</h1>
        <p className="page-subtitle">Browse available parking spots near you</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div className="spinner-wrapper"><div className="spinner" /></div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <p>No parking spots found.</p>
        </div>
      )}

      <div className="cards-grid">
        {filtered.map(spot => (
          <ParkingSpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}
