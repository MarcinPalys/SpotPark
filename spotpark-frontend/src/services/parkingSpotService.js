import api from './api';

export const parkingSpotService = {
  getAll: async () => {
    const res = await api.get('/parking-spots');
    return res.data;
  },
  getById: async (id) => {
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
  update: async (id, data) => {
    const res = await api.put(`/parking-spots/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    await api.delete(`/parking-spots/${id}`);
  },
};
