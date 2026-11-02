import { getAuthUser } from "../../shared/utils/auth";

const AdminDashboardPage = () => {
  const user = getAuthUser();
  const displayName =
    user?.username || user?.email?.split("@")[0] || "Administrador";

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-(--border-color) bg-(--secondary-color) px-6 py-7 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-14 -top-32 size-80 rounded-full bg-(--primary-color)/[0.07] blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
              <span className="size-1.5 rounded-full bg-(--primary-color)" />
              Tu espacio de gestión
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-(--text-color) sm:text-4xl">
              Hola, {displayName}
              <span className="text-(--primary-color)">.</span>
              <br className="hidden sm:block" /> Hagamos crecer la biblioteca.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-(--subtext-color)">
              Crea ejercicios claros y bien organizados para que cada atleta
              encuentre su próximo reto.
            </p>
          </div>
          <a
            href="/dashboard/skills"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-5 py-3 text-sm font-bold text-(--background-color) transition hover:brightness-110"
          >
            Explorar biblioteca
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-4"
              aria-hidden="true"
            >
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </section>

      <section
        aria-label="Resumen de administración"
        className="mt-5 grid gap-4 sm:grid-cols-3"
      >
        {[
          ["Catálogo", "Biblioteca de ejercicios", "Consulta el contenido disponible"],
          ["Acción rápida", "Añadir un ejercicio", "Completa los datos para publicarlo"],
          ["Tu cuenta", "Acceso administrador", "Puedes gestionar el contenido"],
        ].map(([label, title, description]) => (
          <article
            key={label}
            className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-5"
          >
            <p className="text-xs font-medium text-(--subtext-color)">{label}</p>
            <p className="mt-4 text-lg font-semibold text-(--text-color)">
              {title}
            </p>
            <p className="mt-1 text-xs text-(--subtext-color)">{description}</p>
          </article>
        ))}
      </section>
    </>
  );
};

export default AdminDashboardPage;
