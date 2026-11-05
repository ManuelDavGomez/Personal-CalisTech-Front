import { useLocation, Outlet } from "react-router-dom";

import SideNavAdmin from "../../shared/components/SideNavAdmin";

const AdminPage = () => {
  const location = useLocation();
  const pageTitle =
    location.pathname === "/admin/library" ? "Biblioteca" : "Resumen";

  return (
    <article className="min-h-screen bg-(--background-color) text-(--text-color)">
      <SideNavAdmin />
      <main id="inicio" className="min-w-0 lg:ml-72">
        <header className="flex items-center justify-between border-b border-(--border-color) px-5 py-4 sm:px-8 lg:px-10">
          <a href="/admin" className="flex items-center gap-2 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-(--primary-color) font-black text-(--background-color)">
              C
            </span>
            <span className="text-sm font-bold tracking-wide">CALISTECH</span>
          </a>
          <p className="hidden text-xs font-medium text-(--subtext-color) sm:block">
            Panel de administración
            <span className="px-2 text-(--border-color)">/</span>
            <span className="text-(--primary-color)">{pageTitle}</span>
          </p>
          <section className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-(--primary-color)/15 bg-(--primary-color)/6 px-3 py-1.5 text-[11px] font-semibold text-(--primary-color) sm:inline-flex">
              <span className="size-1.5 rounded-full bg-(--primary-color)" />
              MODO ADMIN
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

export default AdminPage;
