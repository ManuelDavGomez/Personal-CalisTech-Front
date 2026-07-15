export const AUTH_STORAGE_KEY = "Token";
export const AUTH_EXPIRY_KEY = "TokenExpiresAt";
export const AUTH_SESSION_DURATION_MS = 60 * 60 * 1000;

const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem(AUTH_EXPIRY_KEY);
};

export const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(AUTH_STORAGE_KEY) ?? localStorage.getItem("token");
  const expiresAt = Number(localStorage.getItem(AUTH_EXPIRY_KEY));

  if (!token) {
    clearAuthSession();
    return null;
  }

  if (expiresAt && Date.now() > expiresAt) {
    clearAuthSession();
    return null;
  }

  return token;
};

export const saveAuthToken = (
  token: string,
  expiresInMs: number = AUTH_SESSION_DURATION_MS,
) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, token);
  localStorage.setItem("token", token);
  localStorage.setItem(AUTH_EXPIRY_KEY, String(Date.now() + expiresInMs));
};

export const clearAuthToken = () => {
  clearAuthSession();
};

export const isAuthenticated = () => Boolean(getAuthToken());
