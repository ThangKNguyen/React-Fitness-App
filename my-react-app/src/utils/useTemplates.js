import { useState, useEffect } from 'react';
import { authFetch } from './api';
import { useAuth } from './useAuth';
import { useAuthPrompt } from './useAuthPrompt';

export function useTemplates() {
  const { token } = useAuth();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    if (!token) { setTemplates([]); return; }
    authFetch('/api/user/templates')
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => setTemplates([]));
  }, [token]);

  const createTemplate = async (name, numberOfDays) => {
    if (!token) { useAuthPrompt.getState().show(); return null; }
    const created = await authFetch('/api/user/templates', {
      method: 'POST',
      body: JSON.stringify({ name, numberOfDays }),
    });
    setTemplates((prev) => [created, ...prev]);
    return created;
  };

  const deleteTemplate = async (id) => {
    if (!token) return;
    await authFetch(`/api/user/templates/${id}`, { method: 'DELETE' });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const renameTemplate = async (id, name) => {
    if (!token) return;
    await authFetch(`/api/user/templates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
    });
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name } : t))
    );
  };

  return { templates, createTemplate, deleteTemplate, renameTemplate };
}
