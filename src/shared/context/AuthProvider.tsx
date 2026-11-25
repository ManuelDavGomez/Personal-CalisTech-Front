import { useEffect, useState, type ReactNode } from "react";
import { apiFetch } from "../utils/api";
import { AuthContext, type AuthUser } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateUser = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    setError(null);
  };

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const response = await apiFetch("/auth/me");
        if (response.status === 401) return;
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "No se pudo validar la sesión.");
        }
        if (active) {
          setUser(data.user);
          setError(null);
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "No se pudo conectar con el servidor.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadUser();
    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    const response = await apiFetch("/auth/logout", { method: "POST" });
    if (!response.ok) {
      throw new Error("No se pudo cerrar la sesión.");
    }
    updateUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, setUser: updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
