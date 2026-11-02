import { clearAuthToken, getAuthUser } from "../../shared/utils/auth";
import { useNavigate } from "react-router-dom";

const SideNavAdmin = () => {
  const navigate = useNavigate();
  const user = getAuthUser();

  const displayName =
    user?.username || user?.email?.split("@")[0] || "Administrador";
  const initials = displayName
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0].toUpperCase())
    .join("");

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-(--border-color) bg-(--tertiary-color) px-5 py-7 lg:flex">
      <a href="/admin" className="flex items-center gap-3 px-2">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-(--primary-color) text-lg font-black text-(--background-color)">
          C
        </span>
        <span>
          <span className="block font-bold tracking-wide text-(--text-color)">
            CALISTECH
          </span>
          <span className="text-[10px] font-semibold tracking-[0.2em] text-(--subtext-color)">
            ADMIN STUDIO
          </span>
        </span>
      </a>

      <div className="mt-12">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-(--subtext-color)">
          Workspace
        </p>
        <nav
          aria-label="Navegación de administración"
          className="mt-3 space-y-1"
        >
          <a
            href="/admin"
            className="flex items-center gap-3 rounded-xl bg-(--primary-color)/10 px-3 py-3 text-sm font-semibold text-(--primary-color)"
            aria-current="page"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>
            Resumen
          </a>
          <a
            href="/admin/library"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-(--subtext-color) transition hover:bg-(--secondary-color) hover:text-(--text-color)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              aria-hidden="true"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Libreria
          </a>
          <a
            href="/dashboard/skills"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-(--subtext-color) transition hover:bg-(--secondary-color) hover:text-(--text-color)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              aria-hidden="true"
            >
              <path
                d="M5 4.75h11.5A2.5 2.5 0 0 1 19 7.25v12H7.5A2.5 2.5 0 0 1 5 16.75v-12Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M5 16.5A2.5 2.5 0 0 1 7.5 14H19"
                stroke="currentColor"
                strokeWidth="1.7"
              />
            </svg>
            Biblioteca
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="ml-auto size-4"
              aria-hidden="true"
            >
              <path
                d="M7 17 17 7M8 7h9v9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </nav>
      </div>

      <div className="mt-auto rounded-2xl border border-(--border-color) bg-(--secondary-color) p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-(--primary-color)/15 text-sm font-bold text-(--primary-color)">
            {initials || "AD"}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-(--text-color)">
              {displayName}
            </span>
            <span className="text-xs text-(--subtext-color)">
              Administrador
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-medium text-(--subtext-color) transition hover:bg-(--tertiary-color) hover:text-(--text-color)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="size-4"
            aria-hidden="true"
          >
            <path
              d="M10 17l5-5-5-5M15 12H3m9-8h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default SideNavAdmin;
