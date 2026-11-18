import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { parkingSpotService } from '../services/parkingSpotService';
import { reservationService } from '../services/reservationService';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/Icon';

export default function ParkingSpotDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const justCreated = useLocation().state?.justCreated;

  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const now = new Date();
  now.setMinutes(0, 0, 0);
  const defaultStart = new Date(now.getTime() + 3600000).toISOString().slice(0, 16);
  const defaultEnd = new Date(now.getTime() + 7200000).toISOString().slice(0, 16);

  // The home-page search passes ?start=YYYY-MM-DDTHH:mm&end=… to pre-fill the form.
  const [searchParams] = useSearchParams();
  const isDateTime = (v) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v ?? '');
  const [reservation, setReservation] = useState(() => ({
    startDate: isDateTime(searchParams.get('start')) ? searchParams.get('start') : defaultStart,
    endDate: isDateTime(searchParams.get('end')) ? searchParams.get('end') : defaultEnd,
  }));
  const [resError, setResError] = useState('');
  const [resLoading, setResLoading] = useState(false);
  const [resSuccess, setResSuccess] = useState(false);

  useEffect(() => {
    parkingSpotService.getById(id)
      .then(setSpot)
      .catch(() => setError('Parking spot not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const totalHours = (() => {
    const diff = new Date(reservation.endDate) - new Date(reservation.startDate);
    return diff > 0 ? diff / 3600000 : 0;
  })();

  const totalCost = spot ? (totalHours * spot.pricePerHour).toFixed(2) : '0.00';

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setResError('');
    setResLoading(true);
    try {
      await reservationService.create({
        parkingSpotId: spot.id,
        startDate: new Date(reservation.startDate).toISOString(),
        endDate: new Date(reservation.endDate).toISOString(),
      });
      setResSuccess(true);
    } catch (err) {
      setResError(err.response?.data?.error || 'Failed to create reservation.');
    } finally {
      setResLoading(false);
    }
  };

  if (loading) return <div className="container page"><div className="spinner-wrapper"><div className="spinner" /></div></div>;
  if (error) return <div className="container page"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="container page">
      <button className="btn btn-ghost btn-sm mb" onClick={() => navigate(-1)}>← Back</button>

      {justCreated && (
        <div className="alert alert-success">
          <strong>Miejsce zostało wystawione.</strong>{' '}
          {spot.isLocal
            ? 'Zapisaliśmy je w tej przeglądarce. Widać je już na mapie na stronie głównej.'
            : 'Kierowcy zobaczą je teraz na mapie.'}{' '}
          <Link to="/">Przejdź do mapy</Link>
        </div>
      )}

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-header-row">
            <h1 className="detail-title">{spot.title}</h1>
            <span className={`badge ${spot.isAvailable ? 'badge-success' : 'badge-error'}`}>
              {spot.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <p className="detail-address"><Icon name="pin" size={16} /> {spot.address}</p>

          {spot.imageUrls?.length > 0 && (
            <div className={`detail-photos detail-photos-${Math.min(spot.imageUrls.length, 3)}`}>
              {spot.imageUrls.slice(0, 3).map((url, i) => (
                <img key={url.slice(-32) + i} src={url} alt={`${spot.title} – zdjęcie ${i + 1}`} />
              ))}
            </div>
          )}

          {spot.averageRating != null && (
            <p className="detail-rating">
              {'★'.repeat(Math.round(spot.averageRating))}{'☆'.repeat(5 - Math.round(spot.averageRating))}
              <span className="rating-count"> {spot.averageRating.toFixed(1)} ({spot.reviewCount} reviews)</span>
            </p>
          )}

          <p className="detail-price">{spot.pricePerHour} PLN / hour</p>

          <div className="detail-section">
            <h2>Description</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{spot.description || 'No description provided.'}</p>
          </div>

          <div className="detail-section">
            <h2>Location</h2>
            <p className="coordinates">Lat: {spot.latitude}, Lng: {spot.longitude}</p>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="card">
            <div className="card-body">
              <h2 className="sidebar-title">Reserve this spot</h2>

              {spot.isLocal ? (
                <p className="list-item-sub">
                  To ogłoszenie jest zapisane tylko w tej przeglądarce, więc nie można go jeszcze
                  zarezerwować. Rezerwacje będą możliwe po opublikowaniu go na serwerze.
                </p>
              ) : resSuccess ? (
                <div className="alert alert-success">
                  Reservation confirmed! View it in your <a href="/dashboard">Dashboard</a>.
                </div>
              ) : (
                <form onSubmit={handleReserve} className="reservation-form">
                  {resError && <div className="alert alert-error">{resError}</div>}

                  <div className="form-group">
                    <label>Start</label>
                    <input
                      type="datetime-local"
                      value={reservation.startDate}
                      onChange={(e) => setReservation({ ...reservation, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End</label>
                    <input
                      type="datetime-local"
                      value={reservation.endDate}
                      onChange={(e) => setReservation({ ...reservation, endDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="cost-summary">
                    <span>{totalHours.toFixed(1)}h × {spot.pricePerHour} PLN</span>
                    <strong>{totalCost} PLN</strong>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={resLoading || !spot.isAvailable || totalHours <= 0}
                  >
                    {resLoading ? 'Reserving...' : isAuthenticated ? 'Reserve' : 'Log in to reserve'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
