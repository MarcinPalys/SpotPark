import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async ({ email, password, firstName, lastName }) => {
    const res = await api.post('/auth/register', { email, password, firstName, lastName });
    return res.data;
  },
};
