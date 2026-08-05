export const AUTH_STORAGE_KEY = "Token";
export const AUTH_EXPIRY_KEY = "TokenExpiresAt";
export const AUTH_USER_KEY = "AuthUser";
export const AUTH_SESSION_DURATION_MS = 60 * 60 * 1000;

const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem(AUTH_EXPIRY_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

const decodeJwtPayload = (token: string) => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );

    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.warn("No se pudo decodificar el token", error);
    return null;
  }
};

export const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(AUTH_STORAGE_KEY) ?? localStorage.getItem("token");
  const storedExpiry = Number(localStorage.getItem(AUTH_EXPIRY_KEY));

  if (!token) {
    clearAuthSession();
    return null;
  }

  const jwtPayload = decodeJwtPayload(token);
  const jwtExpiry = jwtPayload?.exp ? Number(jwtPayload.exp) * 1000 : null;
  const expiresAt = Number.isFinite(jwtExpiry) ? jwtExpiry : storedExpiry;

  if (expiresAt && Date.now() >= expiresAt) {
    clearAuthSession();
    return null;
  }

  if (!storedExpiry && expiresAt) {
    localStorage.setItem(AUTH_EXPIRY_KEY, String(expiresAt));
  }

  return token;
};

export const saveAuthToken = (
  token: string,
  user?: { id?: number | string | null; email?: string | null; role?: string | null; username?: string | null },
  expiresInMs: number = AUTH_SESSION_DURATION_MS,
) => {
  if (typeof window === "undefined") {
    return;
  }

  const jwtPayload = decodeJwtPayload(token);
  const expiryFromToken = jwtPayload?.exp ? Number(jwtPayload.exp) * 1000 : null;
  const effectiveExpiry = Number.isFinite(expiryFromToken)
    ? expiryFromToken
    : Date.now() + expiresInMs;

  localStorage.setItem(AUTH_STORAGE_KEY, token);
  localStorage.setItem("token", token);
  localStorage.setItem(AUTH_EXPIRY_KEY, String(effectiveExpiry));

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
};

export const getAuthUser = () => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  }

  const token = getAuthToken();

  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);

  return {
    id: payload?.id ?? null,
    email: payload?.email ?? null,
    role: payload?.role ?? "user",
  };
};

export const isAdmin = () => getAuthUser()?.role === "admin";

export const clearAuthToken = () => {
  clearAuthSession();
};

export const logout = () => {
  clearAuthSession();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

export const isAuthenticated = () => Boolean(getAuthToken());
