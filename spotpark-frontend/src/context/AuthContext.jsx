import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    return data;
  }, []);

  const register = useCallback(async (formData) => {
    const data = await authService.register(formData);
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
