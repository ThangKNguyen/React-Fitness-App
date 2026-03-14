import { useState, useEffect } from 'react';

const KEY = 'mf_favorites';
const EV = 'mf_storage';

export function useFavorites() {
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
    catch { return []; }
  };

  const [favorites, setFavorites] = useState(read);

  useEffect(() => {
    const sync = () => setFavorites(read());
    window.addEventListener(EV, sync);
    return () => window.removeEventListener(EV, sync);
  }, []);

  const toggleFavorite = (exercise) => {
    const cur = read();
    const exists = cur.some((e) => e.id === exercise.id);
    const next = exists ? cur.filter((e) => e.id !== exercise.id) : [exercise, ...cur];
    localStorage.setItem(KEY, JSON.stringify(next));
    setFavorites(next);
    window.dispatchEvent(new Event(EV));
  };

  const isFavorite = (id) => favorites.some((e) => e.id === id);

  return { favorites, toggleFavorite, isFavorite };
}
