import { create } from 'zustand';
import { useEffect } from 'react';
import { authFetch } from './api';
import { useAuth } from './useAuth';
import { useAuthPrompt } from './useAuthPrompt';

const customExercisesStore = create((set, get) => ({
  customExercises: [],
  fetchedToken: null,

  load: async (token) => {
    if (get().fetchedToken === token) return;
    set({ fetchedToken: token });
    try {
      const data = await authFetch('/api/user/custom-exercises');
      set({ customExercises: Array.isArray(data) ? data : [] });
    } catch {
      set({ customExercises: [] });
    }
  },

  clear: () => set({ customExercises: [], fetchedToken: null }),

  createCustomExercise: async (data, token) => {
    if (!token) { useAuthPrompt.getState().show(); return null; }
    const created = await authFetch('/api/user/custom-exercises', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    set((s) => ({ customExercises: [created, ...s.customExercises] }));
    return created;
  },

  deleteCustomExercise: async (id, token) => {
    if (!token) return;
    const numericId = id.startsWith('custom_') ? id.substring(7) : id;
    await authFetch(`/api/user/custom-exercises/${numericId}`, { method: 'DELETE' });
    set((s) => ({ customExercises: s.customExercises.filter((e) => e.id !== id) }));
  },
}));

export function useCustomExercises() {
  const { token } = useAuth();
  const { customExercises, load, clear, createCustomExercise, deleteCustomExercise } = customExercisesStore();

  useEffect(() => {
    if (!token) { clear(); return; }
    load(token);
  }, [token]);

  return {
    customExercises,
    createCustomExercise: (data) => createCustomExercise(data, token),
    deleteCustomExercise: (id) => deleteCustomExercise(id, token),
  };
}
