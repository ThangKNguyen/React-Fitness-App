import { create } from 'zustand';
import { useEffect } from 'react';
import { authFetch, authUpload } from './api';
import { useAuth } from './useAuth';
import heroImage from '../assets/images/davidlaid.jpg';

// Demo seed data (for "Preview with Sample Data" mode only)
export const SEED_ENTRIES = [
  { id: 900001, date: '2025-01-15', caption: 'Starting my fitness journey — day one', photos: [heroImage, heroImage, heroImage] },
  { id: 900002, date: '2025-03-22', caption: 'Two months in, feeling stronger', photos: [heroImage, heroImage] },
  { id: 900003, date: '2025-05-10', caption: 'Hitting PRs on deadlift', photos: [heroImage] },
  { id: 900004, date: '2025-05-28', caption: 'End of month pump', photos: [heroImage, heroImage] },
  { id: 900005, date: '2025-07-04', caption: 'Summer shred progress', photos: [heroImage, heroImage, heroImage, heroImage] },
  { id: 900006, date: '2025-09-18', caption: 'Bulk season starting', photos: [heroImage] },
  { id: 900007, date: '2025-11-30', caption: 'End of year check-in', photos: [heroImage, heroImage] },
  { id: 900008, date: '2026-01-12', caption: 'New year, same grind', photos: [heroImage, heroImage, heroImage] },
  { id: 900009, date: '2026-03-01', caption: 'First of the month check', photos: [heroImage] },
  { id: 900010, date: '2026-03-03', caption: 'Morning posing practice', photos: [heroImage, heroImage] },
  { id: 900011, date: '2026-03-06', caption: 'Post leg day pump', photos: [heroImage, heroImage, heroImage] },
  { id: 900012, date: '2026-03-08', caption: 'Back double bicep', photos: [heroImage] },
  { id: 900013, date: '2026-03-11', caption: 'Shoulders looking full', photos: [heroImage, heroImage] },
  { id: 900014, date: '2026-03-14', caption: 'Mid-month progress', photos: [heroImage, heroImage, heroImage] },
  { id: 900015, date: '2026-03-17', caption: 'Chest and arms day', photos: [heroImage, heroImage] },
  { id: 900016, date: '2026-03-19', caption: '', photos: [heroImage] },
  { id: 900017, date: '2026-03-20', caption: 'Almost there', photos: [heroImage, heroImage, heroImage] },
  { id: 900018, date: '2026-03-21', caption: 'Looking lean after cut', photos: [heroImage, heroImage] },
  { id: 900019, date: '2026-03-22', caption: 'Peak week vibes', photos: [heroImage, heroImage, heroImage, heroImage] },
];

// Convert API response entry → frontend shape
function toEntry(apiEntry) {
  return {
    id: apiEntry.id,
    date: apiEntry.date,
    caption: apiEntry.caption || '',
    photos: (apiEntry.photos || []).map((p) => ({ id: p.id, url: p.url })),
  };
}

const photosStore = create((set, get) => ({
  entries: [],
  fetchedToken: null,

  load: async (token) => {
    if (get().fetchedToken === token) return;
    set({ fetchedToken: token });
    try {
      const data = await authFetch('/api/progress-photos');
      const entries = (Array.isArray(data) ? data : []).map(toEntry);
      set({ entries });
    } catch {
      set({ entries: [] });
    }
  },

  clear: () => set({ entries: [], fetchedToken: null }),

  // Upload new entry: files = File[], date = 'YYYY-MM-DD', caption = string
  addEntry: async (files, date, caption = '') => {
    const fd = new FormData();
    fd.append('date', date);
    fd.append('caption', caption);
    for (const file of files) fd.append('files', file);

    const created = await authUpload('/api/progress-photos', fd);
    const entry = toEntry(created);
    set((s) => ({
      entries: [entry, ...s.entries].sort((a, b) => b.date.localeCompare(a.date)),
    }));
    return entry;
  },

  // Add photos to existing entry
  addPhotosToEntry: async (entryId, files) => {
    const fd = new FormData();
    for (const file of files) fd.append('files', file);

    const updated = await authUpload(`/api/progress-photos/${entryId}/photos`, fd);
    const entry = toEntry(updated);
    set((s) => ({
      entries: s.entries.map((e) => (e.id === entryId ? entry : e)),
    }));
  },

  // Remove a single photo by its photo ID
  removePhoto: async (entryId, photoId) => {
    await authFetch(`/api/progress-photos/${entryId}/photos/${photoId}`, { method: 'DELETE' });
    set((s) => ({
      entries: s.entries
        .map((e) => {
          if (e.id !== entryId) return e;
          const photos = e.photos.filter((p) => p.id !== photoId);
          return { ...e, photos };
        })
        .filter((e) => e.photos.length > 0),
    }));
  },

  // Delete entire entry
  deleteEntry: async (id) => {
    await authFetch(`/api/progress-photos/${id}`, { method: 'DELETE' });
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
  },

  // Update caption
  updateCaption: async (id, caption) => {
    const updated = await authFetch(`/api/progress-photos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ caption }),
    });
    const entry = toEntry(updated);
    set((s) => ({
      entries: s.entries.map((e) => (e.id === id ? entry : e)),
    }));
  },
}));

export function useProgressPhotos() {
  const { token } = useAuth();
  const store = photosStore();

  useEffect(() => {
    if (!token) { store.clear(); return; }
    store.load(token);
  }, [token]);

  return {
    entries: store.entries,
    addEntry: store.addEntry,
    addPhotosToEntry: store.addPhotosToEntry,
    removePhoto: store.removePhoto,
    deleteEntry: store.deleteEntry,
    updateCaption: store.updateCaption,
  };
}
