import { Link } from 'react-router-dom';

export default function ParkingSpotCard({ spot }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{spot.title}</h3>
          <span className={`badge ${spot.isAvailable ? 'badge-success' : 'badge-error'}`}>
            {spot.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <p className="card-address">{spot.address}</p>
        {spot.averageRating != null && (
          <p className="card-rating">
            {'★'.repeat(Math.round(spot.averageRating))}{'☆'.repeat(5 - Math.round(spot.averageRating))}
            <span className="rating-count"> ({spot.reviewCount})</span>
          </p>
        )}
        <div className="card-footer-row">
          <span className="card-price">{spot.pricePerHour} PLN/h</span>
          <Link to={`/parking-spots/${spot.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
