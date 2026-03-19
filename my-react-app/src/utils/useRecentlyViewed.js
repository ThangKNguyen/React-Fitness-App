import { useState, useEffect } from 'react';
import { authFetch } from './api';
import { useAuth } from './useAuth';

export function useRecentlyViewed() {
  const { token } = useAuth();
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (!token) { setRecentlyViewed([]); return; }
    authFetch('/api/user/history')
      .then((data) => setRecentlyViewed(Array.isArray(data) ? data : []))
      .catch(() => setRecentlyViewed([]));
  }, [token]);

  const addRecent = (exercise) => {
    if (!token) return; // silently skip — no popup for automatic tracking
    authFetch('/api/user/history', {
      method: 'POST',
      body: JSON.stringify({ exerciseId: exercise.id }),
    }).catch(() => {});
    // Optimistic update — move to front
    setRecentlyViewed((prev) => [exercise, ...prev.filter((e) => e.id !== exercise.id)]);
  };

  return { recentlyViewed, addRecent };
}
