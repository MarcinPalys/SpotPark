import { useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';

/** Calls onClick({ lat, lng }) when the map is clicked. */
export function MapClickHandler({ onClick }) {
  useMapEvents({
    click: (e) => onClick({ lat: e.latlng.lat, lng: e.latlng.lng }),
  });
  return null;
}

/** Smoothly moves the map to the given point whenever it changes. */
export function FlyTo({ point, minZoom = 16 }) {
  const map = useMap();
  const lat = point?.lat;
  const lng = point?.lng;

  useEffect(() => {
    if (lat == null || lng == null) return;
    map.flyTo([lat, lng], Math.max(map.getZoom(), minZoom), { duration: 0.6 });
  }, [map, lat, lng, minZoom]);
  return null;
}
