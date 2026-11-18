import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { KRAKOW_CENTER, hasCoordinates } from '../../utils/geo';
import { useReversePick } from '../../hooks/useReversePick';
import { MAX_BOUNDS, TILE_URL, TILE_ATTRIBUTION, selectedIcon } from './mapConfig';
import { MapClickHandler, FlyTo } from './MapParts';

/**
 * OpenStreetMap of Kraków. Clicking anywhere reverse-geocodes the point and calls
 * onPick({ address, lat, lng }). Shows parking spots as price markers.
 */
export default function KrakowMap({ spots, selected, onPick, activeId = null }) {
  const pick = useReversePick(onPick);

  return (
    <MapContainer
      center={[KRAKOW_CENTER.lat, KRAKOW_CENTER.lng]}
      zoom={13}
      minZoom={11}
      maxBounds={MAX_BOUNDS}
      maxBoundsViscosity={0.8}
      zoomControl={false}
      className="krakow-map"
    >
      <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} maxZoom={19} />
      <ZoomControl position="bottomright" />

      <MapClickHandler onClick={pick} />
      <FlyTo point={selected} />

      {spots.filter(hasCoordinates).map((spot) => (
        <SpotMarker key={spot.id} spot={spot} active={spot.id === activeId} />
      ))}

      {selected && (
        <Marker
          position={[selected.lat, selected.lng]}
          icon={selectedIcon}
          zIndexOffset={1000}
          interactive={false}
        />
      )}
    </MapContainer>
  );
}

function SpotMarker({ spot, active }) {
  const icon = useMemo(() => {
    const classes = ['price-marker', !spot.isAvailable && 'price-marker-off', active && 'price-marker-active']
      .filter(Boolean).join(' ');
    return L.divIcon({
      className: 'leaflet-div-reset',
      html: `<div class="${classes}"><span class="price-marker-label">${Number(spot.pricePerHour)} zł</span><span class="price-marker-tail"></span><span class="price-marker-dot"></span></div>`,
      iconSize: [0, 0],
    });
  }, [spot.pricePerHour, spot.isAvailable, active]);

  return (
    <Marker
      position={[spot.latitude, spot.longitude]}
      icon={icon}
      title={spot.title}
      zIndexOffset={active ? 500 : 0}
    >
      <Popup offset={[0, -40]}>
        <div className="map-info">
          <strong>{spot.title}</strong>
          <p>{spot.address}</p>
          <p className="map-info-price">{spot.pricePerHour} zł/h</p>
          <Link to={`/parking-spots/${spot.id}`}>Zobacz szczegóły →</Link>
        </div>
      </Popup>
    </Marker>
  );
}
