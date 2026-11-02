import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, getAuthUser } from "../utils/auth";

const ProtectedRoute = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const authUser = getAuthUser();

  if (
    (location.pathname === "/admin" ||
      location.pathname.startsWith("/admin/")) &&
    authUser?.role?.toLowerCase() !== "admin"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
