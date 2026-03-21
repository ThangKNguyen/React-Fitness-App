import { create } from 'zustand';
import { useEffect } from 'react';
import { authFetch } from './api';
import { useAuth } from './useAuth';

const recentlyViewedStore = create((set, get) => ({
  recentlyViewed: [],
  fetchedToken: null,

  load: async (token) => {
    if (get().fetchedToken === token) return;
    set({ fetchedToken: token });
    try {
      const data = await authFetch('/api/user/history');
      set({ recentlyViewed: Array.isArray(data) ? data : [] });
    } catch {
      set({ recentlyViewed: [] });
    }
  },

  clear: () => set({ recentlyViewed: [], fetchedToken: null }),

  addRecent: (exercise, token) => {
    if (!token) return;
    authFetch('/api/user/history', {
      method: 'POST',
      body: JSON.stringify({ exerciseId: exercise.id }),
    }).catch(() => {});
    set((s) => ({
      recentlyViewed: [exercise, ...s.recentlyViewed.filter((e) => e.id !== exercise.id)],
    }));
  },
}));

export function useRecentlyViewed() {
  const { token } = useAuth();
  const { recentlyViewed, load, clear, addRecent } = recentlyViewedStore();

  useEffect(() => {
    if (!token) { clear(); return; }
    load(token);
  }, [token]);

  return {
    recentlyViewed,
    addRecent: (exercise) => addRecent(exercise, token),
  };
}
