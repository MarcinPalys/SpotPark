import { Link } from 'react-router-dom';

export default function ParkingSpotCard({ spot, distanceLabel }) {
  return (
    <div className="card">
      {spot.imageUrls?.[0] && (
        <img src={spot.imageUrls[0]} alt={spot.title} className="card-photo" loading="lazy" />
      )}
      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{spot.title}</h3>
          <span className={`badge ${spot.isAvailable ? 'badge-success' : 'badge-error'}`}>
            {spot.isAvailable ? 'Dostępne' : 'Zajęte'}
          </span>
        </div>
        <p className="card-address">
          {spot.address}
          {distanceLabel && <span className="card-distance"> · {distanceLabel}</span>}
        </p>
        {spot.averageRating != null && (
          <p className="card-rating">
            {'★'.repeat(Math.round(spot.averageRating))}{'☆'.repeat(5 - Math.round(spot.averageRating))}
            <span className="rating-count"> ({spot.reviewCount})</span>
          </p>
        )}
        <div className="card-footer-row">
          <span className="card-price">{spot.pricePerHour} zł/h</span>
          <Link to={`/parking-spots/${spot.id}`} className="btn btn-primary btn-sm">
            Szczegóły
          </Link>
        </div>
      </div>
    </div>
  );
}
