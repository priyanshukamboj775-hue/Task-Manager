const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data;
}

export const api = {
  getTasks: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString();
    return request('GET', `/tasks${qs ? `?${qs}` : ''}`);
  },
  createTask: (task) => request('POST', '/tasks', task),
  updateTask: (id, updates) => request('PUT', `/tasks/${id}`, updates),
  patchTask: (id, updates) => request('PATCH', `/tasks/${id}`, updates),
  deleteTask: (id) => request('DELETE', `/tasks/${id}`),
};
