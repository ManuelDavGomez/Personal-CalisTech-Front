import { Outlet, useLocation } from "react-router-dom";
import SideNav from "../../shared/components/SideNav";

const DashboardPage = () => {
  const { pathname } = useLocation();
  const pageTitle = pathname.startsWith("/dashboard/skills")
    ? "Biblioteca"
    : pathname.startsWith("/dashboard/sessions")
      ? "Sesiones"
      : pathname.startsWith("/dashboard/workout")
        ? "Registro de entrenamiento"
      : "Resumen";

  return (
    <article className="min-h-screen bg-(--background-color) text-(--text-color)">
      <SideNav />
      <main id="inicio" className="min-w-0 pt-14 lg:ml-72 lg:pt-0">
        <header className="flex items-center justify-between border-b border-(--border-color) px-5 py-4 sm:px-8 lg:px-10">
          <p className="hidden text-xs font-medium text-(--subtext-color) sm:block">
            Panel de entrenamiento
            <span className="px-2 text-(--border-color)">/</span>
            <span className="text-(--primary-color)">{pageTitle}</span>
          </p>
          <section className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-(--primary-color)/15 bg-(--primary-color)/6 px-3 py-1.5 text-[11px] font-semibold text-(--primary-color) sm:inline-flex">
              <span className="size-1.5 rounded-full bg-(--primary-color)" />
              MI ESPACIO
            </span>
          </section>
        </header>
        <section className="mx-auto max-w-360 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <Outlet />
        </section>
      </main>
    </article>
  );
};

export default DashboardPage;
