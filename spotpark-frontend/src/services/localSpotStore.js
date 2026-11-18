// Temporary browser-only storage for parking spots listed without logging in.
// The backend requires authentication for POST /parking-spots, so until login is wired up
// spots added by anonymous users live here and are merged with the API results.
const STORAGE_KEY = 'spotpark.localSpots';
export const LOCAL_ID_PREFIX = 'local-';

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export class StorageFullError extends Error {}

function write(spots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spots));
  } catch (err) {
    // Photos are stored as data URLs, so the ~5 MB browser quota can run out.
    if (err?.name === 'QuotaExceededError') throw new StorageFullError('Browser storage is full');
    throw err;
  }
}

export const localSpotStore = {
  getAll: () => read(),

  getById: (id) => read().find((s) => s.id === id) ?? null,

  isLocalId: (id) => String(id).startsWith(LOCAL_ID_PREFIX),

  create: (data) => {
    const spot = {
      ...data,
      id: `${LOCAL_ID_PREFIX}${Date.now()}`,
      isAvailable: true,
      isLocal: true,
      ownerId: 'local',
      createdAt: new Date().toISOString(),
      imageUrls: data.imageUrls ?? [],
      averageRating: null,
      reviewCount: 0,
    };
    write([spot, ...read()]);
    return spot;
  },

  remove: (id) => write(read().filter((s) => s.id !== id)),
};
