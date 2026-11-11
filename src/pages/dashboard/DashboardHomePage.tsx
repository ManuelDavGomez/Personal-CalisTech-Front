import { getAuthUser } from "../../shared/utils/auth";

const DashboardHomePage = () => {
  const user = getAuthUser();
  const displayName = user?.username || user?.email?.split("@")[0] || "atleta";

  return (
    <>
      <article className="relative overflow-hidden rounded-3xl border border-(--border-color) bg-(--secondary-color) px-6 py-7 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-14 -top-32 size-80 rounded-full bg-(--primary-color)/[0.07] blur-3xl" />
        <section className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
              <span className="size-1.5 rounded-full bg-(--primary-color)" />
              Tu espacio de entrenamiento
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-(--text-color) sm:text-4xl">
              ¡Hola, {displayName}!
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-(--subtext-color)">
              Descubre nuevos movimientos, conoce su nivel de dificultad y
              encuentra tu próximo reto en la biblioteca de CalisTech.
            </p>
          </div>
          <a
            href="/dashboard/skills"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-5 py-3 text-sm font-bold text-(--background-color) transition hover:brightness-110"
          >
            Explorar biblioteca
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </section>
      </article>

      <section className="mt-8">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
            Empieza aquí
          </p>
          <h2 className="mt-2 text-xl font-bold text-(--text-color)">
            Tu próximo paso
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-(--primary-color)/10 text-sm font-bold text-(--primary-color)">
              01
            </span>
            <h3 className="mt-4 font-semibold text-(--text-color)">
              Explora ejercicios
            </h3>
            <p className="mt-2 text-sm leading-6 text-(--subtext-color)">
              Revisa los movimientos disponibles y encuentra opciones para tu
              entrenamiento.
            </p>
          </article>
          <article className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-(--primary-color)/10 text-sm font-bold text-(--primary-color)">
              02
            </span>
            <h3 className="mt-4 font-semibold text-(--text-color)">
              Elige tu nivel
            </h3>
            <p className="mt-2 text-sm leading-6 text-(--subtext-color)">
              Usa los filtros de dificultad para acotar la búsqueda a tu
              experiencia.
            </p>
          </article>
          <article className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-(--primary-color)/10 text-sm font-bold text-(--primary-color)">
              03
            </span>
            <h3 className="mt-4 font-semibold text-(--text-color)">
              Conoce cada movimiento
            </h3>
            <p className="mt-2 text-sm leading-6 text-(--subtext-color)">
              Abre la ficha de un ejercicio para consultar sus detalles.
            </p>
          </article>
        </div>
      </section>
    </>
  );
};

export default DashboardHomePage;
