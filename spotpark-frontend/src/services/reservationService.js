import api from './api';

export const reservationService = {
  getMy: async () => {
    const res = await api.get('/reservations');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/reservations/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/reservations', data);
    return res.data;
  },
  cancel: async (id) => {
    await api.put(`/reservations/${id}/cancel`);
  },
};
