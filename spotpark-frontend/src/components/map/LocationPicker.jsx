import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { KRAKOW_CENTER } from '../../utils/geo';
import { useReversePick } from '../../hooks/useReversePick';
import { MAX_BOUNDS, TILE_URL, TILE_ATTRIBUTION, selectedIcon } from './mapConfig';
import { MapClickHandler, FlyTo } from './MapParts';

/**
 * Small map for choosing a single point: click to place the pin, drag it to fine-tune.
 * Calls onPick({ address, lat, lng, pending? }).
 */
export default function LocationPicker({ value, onPick }) {
  const pick = useReversePick(onPick);

  const markerHandlers = useMemo(() => ({
    dragend: (e) => {
      const { lat, lng } = e.target.getLatLng();
      pick({ lat, lng });
    },
  }), [pick]);

  return (
    <MapContainer
      center={[KRAKOW_CENTER.lat, KRAKOW_CENTER.lng]}
      zoom={13}
      minZoom={11}
      maxBounds={MAX_BOUNDS}
      maxBoundsViscosity={0.8}
      scrollWheelZoom={false}
      className="location-picker"
    >
      <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} maxZoom={19} />
      <MapClickHandler onClick={pick} />
      <FlyTo point={value} minZoom={17} />
      {value && (
        <Marker
          position={[value.lat, value.lng]}
          icon={selectedIcon}
          draggable
          eventHandlers={markerHandlers}
        />
      )}
    </MapContainer>
  );
}
