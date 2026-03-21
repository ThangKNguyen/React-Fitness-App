import { create } from 'zustand';
import { useEffect } from 'react';
import { authFetch } from './api';
import { useAuth } from './useAuth';
import { useAuthPrompt } from './useAuthPrompt';

const favoritesStore = create((set, get) => ({
  favorites: [],
  fetchedToken: null,

  load: async (token) => {
    if (get().fetchedToken === token) return;
    set({ fetchedToken: token });
    try {
      const data = await authFetch('/api/user/favorites');
      set({ favorites: Array.isArray(data) ? data : [] });
    } catch {
      set({ favorites: [] });
    }
  },

  clear: () => set({ favorites: [], fetchedToken: null }),

  toggleFavorite: async (exercise, token) => {
    if (!token) { useAuthPrompt.getState().show(); return; }
    const alreadySaved = get().favorites.some((e) => e.id === exercise.id);
    if (alreadySaved) {
      await authFetch(`/api/user/favorites/${exercise.id}`, { method: 'DELETE' });
      set((s) => ({ favorites: s.favorites.filter((e) => e.id !== exercise.id) }));
    } else {
      await authFetch('/api/user/favorites', {
        method: 'POST',
        body: JSON.stringify({ exerciseId: exercise.id }),
      });
      set((s) => ({ favorites: [exercise, ...s.favorites] }));
    }
  },

  isFavorite: (id) => get().favorites.some((e) => e.id === id),
}));

export function useFavorites() {
  const { token } = useAuth();
  const { favorites, load, clear, toggleFavorite, isFavorite } = favoritesStore();

  useEffect(() => {
    if (!token) { clear(); return; }
    load(token);
  }, [token]);

  return {
    favorites,
    toggleFavorite: (exercise) => toggleFavorite(exercise, token),
    isFavorite,
  };
}
