import api from './api';
import { localSpotStore } from './localSpotStore';

export const parkingSpotService = {
  /** API spots merged with spots saved locally in this browser. */
  getAll: async () => {
    const local = localSpotStore.getAll();
    try {
      const res = await api.get('/parking-spots');
      return [...local, ...res.data];
    } catch (err) {
      if (local.length) return local; // backend offline — still show local spots
      throw err;
    }
  },
  getById: async (id) => {
    if (localSpotStore.isLocalId(id)) {
      const spot = localSpotStore.getById(id);
      if (!spot) throw new Error('Local spot not found');
      return spot;
    }
    const res = await api.get(`/parking-spots/${id}`);
    return res.data;
  },
  search: async (lat, lng, radius = 5) => {
    const res = await api.get('/parking-spots/search', { params: { lat, lng, radius } });
    return res.data;
  },
  getMy: async () => {
    const res = await api.get('/parking-spots/my');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/parking-spots', data);
    return res.data;
  },
  /** Saves the spot in this browser only (used when the user is not logged in). */
  createLocal: (data) => localSpotStore.create(data),
  update: async (id, data) => {
    const res = await api.put(`/parking-spots/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    if (localSpotStore.isLocalId(id)) {
      localSpotStore.remove(id);
      return;
    }
    await api.delete(`/parking-spots/${id}`);
  },
};
