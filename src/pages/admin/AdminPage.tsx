import { logout } from "../../shared/utils/auth";
import { useNavigate } from "react-router-dom";
import SidenavPanel from "../../shared/components/SideNavPanel";

const AdminPage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <SidenavPanel />
      AdminPage xd
      <button
        type="button"
        onClick={handleLogout}
        className="mt-3 rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default AdminPage;
