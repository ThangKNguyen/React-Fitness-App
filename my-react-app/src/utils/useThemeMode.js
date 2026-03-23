import { create } from 'zustand';
import { authFetch } from './api';

export const useThemeMode = create((set) => ({
  mode: localStorage.getItem('mf_theme') ?? 'dark',
  toggleMode: () =>
    set((s) => {
      const next = s.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('mf_theme', next);
      authFetch('/api/users/me/preferences', {
        method: 'PUT',
        body: JSON.stringify({ theme: next }),
      }).catch(() => {});
      return { mode: next };
    }),
  setMode: (mode) => {
    localStorage.setItem('mf_theme', mode);
    set({ mode });
  },

  // Called on login to sync preferences from backend
  syncFromBackend: async () => {
    try {
      const prefs = await authFetch('/api/users/me/preferences');
      if (prefs?.theme) {
        localStorage.setItem('mf_theme', prefs.theme);
        set({ mode: prefs.theme });
      }
      if (prefs?.weightUnit) {
        localStorage.setItem('mf_weight_unit', prefs.weightUnit);
      }
    } catch { /* ignore — preferences endpoint is optional */ }
  },
}));
