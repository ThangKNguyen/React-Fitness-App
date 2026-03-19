import { create } from 'zustand';

export const useAuthPrompt = create((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));
