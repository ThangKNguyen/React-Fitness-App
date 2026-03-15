import { create } from 'zustand';

const API = import.meta.env.VITE_API_URL;

export const useAuth = create((set) => ({
  user: JSON.parse(localStorage.getItem('mf_user')) ?? null,
  token: localStorage.getItem('mf_token') ?? null,

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
  },

  logout: () => {
    localStorage.removeItem('mf_token');
    localStorage.removeItem('mf_refresh_token');
    localStorage.removeItem('mf_user');
    set({ user: null, token: null });
  },
}));
