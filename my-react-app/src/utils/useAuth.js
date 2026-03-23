import { create } from 'zustand';
import { useThemeMode } from './useThemeMode';

const API = import.meta.env.VITE_API_URL;

export const useAuth = create((set) => ({
  user: JSON.parse(localStorage.getItem('mf_user')) ?? null,
  token: localStorage.getItem('mf_token') ?? null,

  register: async (email, username, password) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('mf_token', data.token);
    localStorage.setItem('mf_refresh_token', data.refreshToken);
    localStorage.setItem('mf_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    useThemeMode.getState().syncFromBackend();
  },

  login: async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid email or password');
    const data = await res.json();
    localStorage.setItem('mf_token', data.token);
    localStorage.setItem('mf_refresh_token', data.refreshToken);
    localStorage.setItem('mf_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
    useThemeMode.getState().syncFromBackend();
  },

  logout: () => {
    localStorage.removeItem('mf_token');
    localStorage.removeItem('mf_refresh_token');
    localStorage.removeItem('mf_user');
    set({ user: null, token: null });
  },
}));
