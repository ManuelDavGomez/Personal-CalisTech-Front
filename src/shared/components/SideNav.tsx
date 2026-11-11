import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthToken, getAuthUser } from "../utils/auth";

const navigationItems = [
  {
    label: "Resumen",
    path: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    label: "Biblioteca",
    path: "/dashboard/skills",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
        <path
          d="M5 4.75h11.5A2.5 2.5 0 0 1 19 7.25v12H7.5A2.5 2.5 0 0 1 5 16.75v-12Z"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path d="M5 16.5A2.5 2.5 0 0 1 7.5 14H19" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
];

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = getAuthUser();
  const displayName = user?.username || user?.email?.split("@")[0] || "Atleta";
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

  const renderNavigation = () => (
    <nav aria-label="Navegación principal" className="mt-3 space-y-1">
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/dashboard"}
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
              isActive
                ? "bg-(--primary-color)/10 font-semibold text-(--primary-color)"
                : "font-medium text-(--subtext-color) hover:bg-(--secondary-color) hover:text-(--text-color)"
            }`
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  const renderUserCard = () => (
    <article className="rounded-2xl border border-(--border-color) bg-(--secondary-color) p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--primary-color)/15 text-sm font-bold text-(--primary-color)">
          {initials || "AT"}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-(--text-color)">
            {displayName}
          </span>
          <span className="block truncate text-xs text-(--subtext-color)">
            {user?.email || "Atleta"}
          </span>
        </span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-medium text-(--subtext-color) transition hover:bg-(--tertiary-color) hover:text-(--text-color)"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
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
    </article>
  );

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-(--border-color) bg-(--background-color)/95 px-5 py-3 backdrop-blur lg:hidden">
        <a href="/dashboard" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-(--primary-color) font-black text-(--background-color)">
            C
          </span>
          <span className="text-sm font-bold tracking-wide text-(--text-color)">
            CALISTECH
          </span>
        </a>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-lg p-2 text-(--text-color) hover:bg-(--secondary-color)"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-(--border-color) bg-(--tertiary-color) px-5 py-7 transition-transform lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <a href="/dashboard" className="flex items-center gap-3 px-2">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-(--primary-color) text-lg font-black text-(--background-color)">
            C
          </span>
          <span>
            <span className="block font-bold tracking-wide text-(--text-color)">
              CALISTECH
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-(--subtext-color)">
              ENTRENAMIENTO
            </span>
          </span>
        </a>
        <article className="mt-10">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-(--subtext-color)">
            Mi espacio
          </p>
          {renderNavigation()}
        </article>
        <div className="mt-auto">{renderUserCard()}</div>
      </aside>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-(--border-color) bg-(--tertiary-color) px-5 py-7 lg:flex">
        <a href="/dashboard" className="flex items-center gap-3 px-2">
  
          <span>
            <span className="block font-bold tracking-wide text-(--text-color)">
              CALISTECH
            </span>
           
          </span>
        </a>
        <article className="mt-10">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-(--subtext-color)">
            Mi espacio
          </p>
          {renderNavigation()}
        </article>
        <div className="mt-auto">{renderUserCard()}</div>
      </aside>
    </>
  );
};

export default SideNav;
