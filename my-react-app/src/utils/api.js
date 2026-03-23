const API = import.meta.env.VITE_API_URL;

/** Public endpoints — no auth required */
export const apiFetch = async (path) => {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

/** Protected endpoints — attaches Bearer token from localStorage */
export const authFetch = async (path, options = {}) => {
  const token = localStorage.getItem('mf_token');
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

/** Protected multipart upload — no Content-Type (browser sets boundary) */
export const authUpload = async (path, formData, method = 'POST') => {
  const token = localStorage.getItem('mf_token');
  const res = await fetch(`${API}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};
