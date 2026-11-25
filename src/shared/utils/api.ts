const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiFetch = (path: string, init: RequestInit = {}) =>
  fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
  });
