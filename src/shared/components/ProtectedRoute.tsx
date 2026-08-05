import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, getAuthUser } from "../utils/auth";

const ProtectedRoute = () => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const authUser = getAuthUser();

  // Allow admins to access the admin panel; if they try another protected
  // route, redirect them to the admin panel.
  if (authUser?.role === "admin") {
    if (location.pathname !== "/admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Outlet />;
  }

  // Block non-admin users from /admin
  if (location.pathname === "/admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
