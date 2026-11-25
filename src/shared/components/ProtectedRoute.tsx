import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const location = useLocation();
  const { user, loading, error } = useAuth();

  if (loading) {
    return <p className="p-8 text-center text-(--subtext-color)">Validando sesión...</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-red-300" role="alert">{error}</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    (location.pathname === "/admin" ||
      location.pathname.startsWith("/admin/")) &&
    user.role?.toLowerCase() !== "admin"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
