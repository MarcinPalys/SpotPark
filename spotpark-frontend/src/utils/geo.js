export const KRAKOW_CENTER = { lat: 50.0614, lng: 19.9366 };

// City limits (approx.) — used to restrict address suggestions.
export const KRAKOW_BOUNDS = { south: 49.967, west: 19.792, north: 50.126, east: 20.217 };

// Slightly wider area the map is allowed to pan within.
export const KRAKOW_VIEW_BOUNDS = { south: 49.90, west: 19.65, north: 50.20, east: 20.35 };

export function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatDistance(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace('.', ',')} km`;
}

export function hasCoordinates(spot) {
  return Number.isFinite(spot.latitude) && Number.isFinite(spot.longitude) &&
    !(spot.latitude === 0 && spot.longitude === 0);
}
