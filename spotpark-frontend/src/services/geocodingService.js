import { KRAKOW_BOUNDS } from '../utils/geo';

// Free OpenStreetMap-based geocoders:
// - Photon (komoot) for search-as-you-type suggestions
// - Nominatim for reverse geocoding (map click -> address).
//   Nominatim's usage policy forbids autocomplete, so it is only used for single lookups.
const PHOTON_URL = 'https://photon.komoot.io/api/';
const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

function formatPhotonFeature(feature) {
  const p = feature.properties;
  const street = p.street ? `${p.street}${p.housenumber ? ` ${p.housenumber}` : ''}` : null;
  const hasOwnName = p.name && p.name !== p.street;
  const main = hasOwnName ? p.name : street ?? p.name ?? '';
  const secondary = [hasOwnName ? street : null, p.district, p.postcode, p.city]
    .filter(Boolean)
    .join(', ');
  const [lng, lat] = feature.geometry.coordinates;
  return {
    id: `${p.osm_type}${p.osm_id}`,
    main,
    secondary,
    address: [main, secondary].filter(Boolean).join(', '),
    lat,
    lng,
  };
}

export const geocodingService = {
  /** Address suggestions limited to Kraków. */
  search: async (query, signal) => {
    const { west, south, east, north } = KRAKOW_BOUNDS;
    const params = new URLSearchParams({
      q: query,
      limit: '6',
      bbox: `${west},${south},${east},${north}`,
    });
    const res = await fetch(`${PHOTON_URL}?${params}`, { signal });
    if (!res.ok) throw new Error(`Photon error ${res.status}`);
    const data = await res.json();
    const seen = new Set();
    return data.features
      .map(formatPhotonFeature)
      .filter((s) => s.main && !seen.has(s.address) && seen.add(s.address));
  },

  /** Human-readable address for a point. */
  reverse: async (lat, lng) => {
    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: String(lat),
      lon: String(lng),
      zoom: '18',
      addressdetails: '1',
      'accept-language': 'pl',
    });
    const res = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`);
    if (!res.ok) throw new Error(`Nominatim error ${res.status}`);
    const data = await res.json();
    const a = data.address ?? {};
    const road = a.road || a.pedestrian || a.footway || a.square;
    const line1 = road ? `${road}${a.house_number ? ` ${a.house_number}` : ''}` : data.name;
    const parts = [line1, a.suburb || a.quarter || a.city_district, a.city || a.town || a.village]
      .filter(Boolean);
    return parts.length ? parts.join(', ') : data.display_name;
  },
};
