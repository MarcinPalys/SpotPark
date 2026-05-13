import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parkingSpotService } from '../services/parkingSpotService';

export default function AddParkingSpotPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    pricePerHour: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const spot = await parkingSpotService.create({
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        pricePerHour: parseFloat(form.pricePerHour),
      });
      navigate(`/parking-spots/${spot.id}`);
    } catch {
      setError('Failed to create parking spot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <button className="btn btn-ghost btn-sm mb" onClick={() => navigate(-1)}>← Back</button>
      <h1>List a Parking Spot</h1>
      <p className="page-subtitle">Fill in the details to list your parking spot</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Covered spot near city center"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your parking spot..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="ul. Przykładowa 1, Warszawa"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="52.2297"
                step="any"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="21.0122"
                step="any"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pricePerHour">Price per hour (PLN)</label>
            <input
              id="pricePerHour"
              type="number"
              name="pricePerHour"
              value={form.pricePerHour}
              onChange={handleChange}
              placeholder="5.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'List my spot'}
          </button>
        </form>
      </div>
    </div>
  );
}
