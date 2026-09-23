import { logout } from "../../shared/utils/auth";
import { useNavigate } from "react-router-dom";
import SidenavPanel from "../../shared/components/SideNavPanel";
import ExerciseForm from "../../shared/components/ExerciseForm";

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <SidenavPanel />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
              Panel de administrador
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              Crear ejercicio
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500"
          >
            Cerrar sesión
          </button>
        </div>

        <ExerciseForm />
      </main>
    </div>
  );
};

export default AdminPage;
