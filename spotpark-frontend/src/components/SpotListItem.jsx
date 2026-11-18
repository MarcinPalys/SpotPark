import { Link } from 'react-router-dom';
import Icon from './Icon';
import { plural } from '../utils/plural';

/**
 * Horizontal offer card used next to the map on the home page.
 * `reserveQuery` (e.g. "?start=…&end=…") pre-fills the reservation form.
 */
export default function SpotListItem({
  spot, distanceLabel, hours, reserveQuery = '', active, onHover, favorite, onToggleFavorite,
}) {
  const price = Number(spot.pricePerHour);
  const total = hours > 0 ? Math.round(price * hours * 100) / 100 : null;
  const photo = spot.imageUrls?.[0];

  return (
    <article
      className={`spot-item${active ? ' spot-item-active' : ''}`}
      onMouseEnter={() => onHover?.(spot.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="spot-item-photo">
        {photo ? (
          <img src={photo} alt={spot.title} loading="lazy" />
        ) : (
          <div className="spot-item-placeholder"><Icon name="parking" size={40} strokeWidth={1.5} /></div>
        )}
        <button
          type="button"
          className={`spot-fav${favorite ? ' spot-fav-on' : ''}`}
          onClick={() => onToggleFavorite?.(spot.id)}
          aria-label={favorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          aria-pressed={favorite}
        >
          <Icon name="heart" size={18} filled={favorite} />
        </button>
      </div>

      <div className="spot-item-body">
        <h3 className="spot-item-title">{spot.title}</h3>
        <p className="spot-item-address">
          {spot.address}
          {distanceLabel && <span className="spot-item-distance"> · {distanceLabel}</span>}
        </p>

        {spot.averageRating != null ? (
          <p className="spot-item-rating">
            <Icon name="star" size={15} filled />
            <strong>{spot.averageRating.toFixed(1).replace('.', ',')}</strong>
            <span>({spot.reviewCount} {plural(spot.reviewCount, ['opinia', 'opinie', 'opinii'])})</span>
          </p>
        ) : (
          <p className="spot-item-rating spot-item-new">Nowe miejsce</p>
        )}

        <ul className="spot-item-features">
          <li><Icon name="parking" size={16} /> Miejsce prywatne</li>
          <li><Icon name="shield" size={16} /> {spot.isAvailable ? 'Dostępne dziś' : 'Obecnie niedostępne'}</li>
          <li><Icon name="calendar" size={16} /> Rezerwacja od zaraz</li>
        </ul>
      </div>

      <div className="spot-item-side">
        <div className="spot-item-price">
          <strong>{price.toLocaleString('pl-PL')} zł</strong> <span>/ godz.</span>
        </div>
        {total != null && (
          <p className="spot-item-total">
            Razem {total.toLocaleString('pl-PL')} zł za {hours.toLocaleString('pl-PL')} h
          </p>
        )}
        <Link
          to={`/parking-spots/${spot.id}${reserveQuery}`}
          className={`btn btn-primary spot-item-cta${spot.isAvailable ? '' : ' btn-disabled'}`}
        >
          Zarezerwuj <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </article>
  );
}
