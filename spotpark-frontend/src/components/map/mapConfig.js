import L from 'leaflet';
import { KRAKOW_VIEW_BOUNDS } from '../../utils/geo';
import '../../styles/map.css';

const { south, west, north, east } = KRAKOW_VIEW_BOUNDS;
export const MAX_BOUNDS = [[south, west], [north, east]];

// Standard OpenStreetMap tiles (no API key). Colours are softened in map.css (.leaflet-tile-pane).
export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export const selectedIcon = L.divIcon({
  className: 'leaflet-div-reset',
  html: '<div class="selected-pin"></div>',
  iconSize: [0, 0],
});
