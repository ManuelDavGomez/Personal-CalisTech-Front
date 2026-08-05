import { useNavigate } from "react-router-dom";
import { getAuthUser, logout } from "../../shared/utils/auth";
import SideNav from "../../shared/components/SideNav";

const DashboardPage = () => {
  const authUser = getAuthUser();
  const roleLabel = authUser?.role === "admin" ? "Administrador" : "Usuario";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="space-y-4">
      <SideNav />
      <div className="rounded-xl border border-(--border-color) bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
        <p className="font-semibold text-(--primary-color)">Sesión activa</p>
        <p>Rol actual: {roleLabel}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
