import { useState, useEffect } from 'react';

const KEY = 'mf_recent';
const EV = 'mf_storage';
const MAX = 8;

export function useRecentlyViewed() {
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
    catch { return []; }
  };

  const [recentlyViewed, setRecentlyViewed] = useState(read);

  useEffect(() => {
    const sync = () => setRecentlyViewed(read());
    window.addEventListener(EV, sync);
    return () => window.removeEventListener(EV, sync);
  }, []);

  const addRecent = (exercise) => {
    const cur = read();
    const filtered = cur.filter((e) => e.id !== exercise.id);
    const next = [exercise, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    setRecentlyViewed(next);
    window.dispatchEvent(new Event(EV));
  };

  return { recentlyViewed, addRecent };
}
