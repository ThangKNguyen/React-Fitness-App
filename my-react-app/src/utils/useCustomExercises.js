import { useState, useEffect } from 'react';
import { authFetch } from './api';
import { useAuth } from './useAuth';
import { useAuthPrompt } from './useAuthPrompt';

export function useCustomExercises() {
  const { token } = useAuth();
  const [customExercises, setCustomExercises] = useState([]);

  useEffect(() => {
    if (!token) { setCustomExercises([]); return; }
    authFetch('/api/user/custom-exercises')
      .then((data) => setCustomExercises(Array.isArray(data) ? data : []))
      .catch(() => setCustomExercises([]));
  }, [token]);

  const createCustomExercise = async (data) => {
    if (!token) { useAuthPrompt.getState().show(); return null; }
    const created = await authFetch('/api/user/custom-exercises', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setCustomExercises((prev) => [created, ...prev]);
    return created;
  };

  const deleteCustomExercise = async (id) => {
    if (!token) return;
    const numericId = id.startsWith('custom_') ? id.substring(7) : id;
    await authFetch(`/api/user/custom-exercises/${numericId}`, { method: 'DELETE' });
    setCustomExercises((prev) => prev.filter((e) => e.id !== id));
  };

  return { customExercises, createCustomExercise, deleteCustomExercise };
}
