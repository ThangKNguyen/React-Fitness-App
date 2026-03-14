import { useState, useEffect } from 'react';

const KEY = 'mf_workout';
const EV = 'mf_storage';

export function useWorkout() {
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
    catch { return []; }
  };

  const [workout, setWorkout] = useState(read);

  useEffect(() => {
    const sync = () => setWorkout(read());
    window.addEventListener(EV, sync);
    return () => window.removeEventListener(EV, sync);
  }, []);

  const write = (next) => {
    localStorage.setItem(KEY, JSON.stringify(next));
    setWorkout(next);
    window.dispatchEvent(new Event(EV));
  };

  const addToWorkout = (exercise) => {
    const cur = read();
    if (!cur.some((e) => e.id === exercise.id)) write([...cur, exercise]);
  };

  const removeFromWorkout = (id) => write(read().filter((e) => e.id !== id));

  const clearWorkout = () => write([]);

  const isInWorkout = (id) => workout.some((e) => e.id === id);

  return { workout, addToWorkout, removeFromWorkout, clearWorkout, isInWorkout };
}
