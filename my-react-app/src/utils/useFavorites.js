import { useState, useEffect } from 'react';
import { authFetch } from './api';
import { useAuth } from './useAuth';
import { useAuthPrompt } from './useAuthPrompt';

export function useFavorites() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!token) { setFavorites([]); return; }
    authFetch('/api/user/favorites')
      .then((data) => setFavorites(Array.isArray(data) ? data : []))
      .catch(() => setFavorites([]));
  }, [token]);

  const toggleFavorite = async (exercise) => {
    if (!token) { useAuthPrompt.getState().show(); return; }

    const alreadySaved = favorites.some((e) => e.id === exercise.id);
    if (alreadySaved) {
      await authFetch(`/api/user/favorites/${exercise.id}`, { method: 'DELETE' });
      setFavorites((prev) => prev.filter((e) => e.id !== exercise.id));
    } else {
      await authFetch('/api/user/favorites', {
        method: 'POST',
        body: JSON.stringify({ exerciseId: exercise.id }),
      });
      setFavorites((prev) => [exercise, ...prev]);
    }
  };

  const isFavorite = (id) => favorites.some((e) => e.id === id);

  return { favorites, toggleFavorite, isFavorite };
}
