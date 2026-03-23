import { create } from 'zustand';
import { useEffect } from 'react';
import { authFetch } from './api';
import { useAuth } from './useAuth';

// Simple seeded PRNG (mulberry32) — ensures demo data is identical every time
function seededRandom(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate realistic seed data spanning ~18 months (for demo mode only)
// Deterministic — same output every call
export function generateSeedData() {
  const rand = seededRandom(42);
  const entries = [];
  let weight = 182;
  const start = new Date('2024-09-01');
  const end = new Date('2026-03-20');
  let id = 1;

  for (let d = new Date(start); d <= end; ) {
    weight += (rand() - 0.52) * 1.8;
    weight = Math.round(weight * 10) / 10;
    weight = Math.max(165, Math.min(192, weight));

    entries.push({
      id: id++,
      weight,
      date: d.toISOString().slice(0, 10),
      unit: 'lbs',
    });

    d.setDate(d.getDate() + 2 + Math.floor(rand() * 3));
  }

  return entries;
}

const bodyweightStore = create((set, get) => ({
  entries: [],
  fetchedToken: null,

  load: async (token) => {
    if (get().fetchedToken === token) return;
    set({ fetchedToken: token });
    try {
      const data = await authFetch('/api/weight-logs');
      const entries = (Array.isArray(data) ? data : [])
        .map((e) => ({ id: e.id, weight: Number(e.weight), date: e.date, unit: 'lbs' }))
        .sort((a, b) => a.date.localeCompare(b.date));
      set({ entries });
    } catch {
      set({ entries: [] });
    }
  },

  clear: () => set({ entries: [], fetchedToken: null }),

  addEntry: async (weight, date) => {
    try {
      const created = await authFetch('/api/weight-logs', {
        method: 'POST',
        body: JSON.stringify({ weight: parseFloat(weight), date }),
      });
      const entry = { id: created.id, weight: Number(created.weight), date: created.date, unit: 'lbs' };
      set((s) => ({
        entries: [...s.entries, entry].sort((a, b) => a.date.localeCompare(b.date)),
      }));
    } catch (err) {
      throw err;
    }
  },

  deleteEntry: async (id) => {
    try {
      await authFetch(`/api/weight-logs/${id}`, { method: 'DELETE' });
      set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
    } catch (err) {
      throw err;
    }
  },

  getFiltered: (rangeMonths) => {
    const entries = bodyweightStore.getState().entries;
    if (!rangeMonths) return entries;
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - rangeMonths);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return entries.filter((e) => e.date >= cutoffStr);
  },
}));

export function useBodyweight() {
  const { token } = useAuth();
  const { entries, load, clear, addEntry, deleteEntry, getFiltered } = bodyweightStore();

  useEffect(() => {
    if (!token) { clear(); return; }
    load(token);
  }, [token]);

  return { entries, addEntry, deleteEntry, getFiltered };
}
