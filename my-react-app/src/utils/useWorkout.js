import { useState, useEffect } from 'react';
import { authFetch } from './api';
import { useAuth } from './useAuth';
import { useAuthPrompt } from './useAuthPrompt';

export function useWorkout() {
  const { token } = useAuth();
  const [workout, setWorkout] = useState([]);

  useEffect(() => {
    if (!token) { setWorkout([]); return; }
    authFetch('/api/user/workout')
      .then((data) => setWorkout(Array.isArray(data) ? data : []))
      .catch(() => setWorkout([]));
  }, [token]);

  const addToWorkout = async (exercise) => {
    if (!token) { useAuthPrompt.getState().show(); return; }
    if (workout.some((e) => e.id === exercise.id)) return;
    await authFetch('/api/user/workout', {
      method: 'POST',
      body: JSON.stringify({ exerciseId: exercise.id }),
    });
    setWorkout((prev) => [...prev, exercise]);
  };

  const removeFromWorkout = async (id) => {
    if (!token) return;
    await authFetch(`/api/user/workout/${id}`, { method: 'DELETE' });
    setWorkout((prev) => prev.filter((e) => e.id !== id));
  };

  const clearWorkout = async () => {
    if (!token) return;
    await authFetch('/api/user/workout', { method: 'DELETE' });
    setWorkout([]);
  };

  const isInWorkout = (id) => workout.some((e) => e.id === id);

  return { workout, addToWorkout, removeFromWorkout, clearWorkout, isInWorkout };
}
