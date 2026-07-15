export const AUTH_STORAGE_KEY = "Token";

export const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(AUTH_STORAGE_KEY) ?? localStorage.getItem("token");
};

export const saveAuthToken = (token: string) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, token);
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("token");
};

export const isAuthenticated = () => Boolean(getAuthToken());
