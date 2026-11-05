import { getAuthToken, getAuthUser } from "../../shared/utils/auth";
import { useState, useEffect } from "react";

const fetchStat = async (metric: "usuarios" | "ejercicios", token: string) => {
  const response = await fetch(`http://localhost:3000/stats/${metric}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `No se encontró la ruta /stats/${metric} (HTTP ${response.status}). Reinicia el backend.`,
    );
  }

  const data: { message?: string; value?: unknown } = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `No se pudo obtener el total de ${metric}.`);
  }

  if (typeof data.value !== "number") {
    throw new Error(`La respuesta no contiene el total de ${metric}.`);
  }

  return data.value;
};

const AdminDashboardPage = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalExercises, setTotalExercises] = useState<number | null>(null);
  const [usersError, setUsersError] = useState<string | null>(() =>
    getAuthToken()
      ? null
      : "Inicia sesión como administrador para consultar los usuarios.",
  );
  const [exercisesError, setExercisesError] = useState<string | null>(() =>
    getAuthToken()
      ? null
      : "Inicia sesión como administrador para consultar los ejercicios.",
  );

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    void fetchStat("usuarios", token)
      .then(setTotalUsers)
      .catch((error: unknown) => {
        setUsersError(
          error instanceof Error
            ? error.message
            : "No se pudo conectar con el servidor.",
        );
      });

    void fetchStat("ejercicios", token)
      .then(setTotalExercises)
      .catch((error: unknown) => {
        setExercisesError(
          error instanceof Error
            ? error.message
            : "No se pudo conectar con el servidor.",
        );
      });
  }, []);

  const user = getAuthUser();
  const displayName =
    user?.username || user?.email?.split("@")[0] || "Administrador";

  return (
    <>
      <article className="relative overflow-hidden rounded-3xl border border-(--border-color) bg-(--secondary-color) px-6 py-7 sm:px-9 sm:py-9">
        <section className="pointer-events-none absolute -right-14 -top-32 size-80 rounded-full bg-(--primary-color)/[0.07] blur-3xl" />
        <section className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <section>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
              <span className="size-1.5 rounded-full bg-(--primary-color)" />
              Tu espacio de gestión
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-(--text-color) sm:text-4xl">
              Hola, {displayName}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-(--subtext-color)">
              Bienvenido al panel de administración de CalisTech. Aquí podrás
              añadir nuevos ejercicios y mantener tu cuenta de administrador.
            </p>
          </section>
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
        </section>
      </article>

      <section className="mt-5 grid gap-4 sm:grid-cols-3">
        <section className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-5">
          <h3>Total de Usuarios</h3>
          <p
            role={usersError ? "alert" : undefined}
            className={`font-bold break-anywhere ${
              usersError ? "text-sm text-red-600" : "text-3xl text-(--primary-color)"
            }`}
          >
            {usersError ? usersError : (totalUsers ?? "Cargando...")}
          </p>
        </section>
        <section className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-5">
          <h3>Total de Ejercicios</h3>
          <p
            role={exercisesError ? "alert" : undefined}
            className={`font-bold break-anywhere ${
              exercisesError ? "text-sm text-red-600" : "text-3xl text-(--primary-color)"
            }`}
          >
            {exercisesError
              ? exercisesError
              : (totalExercises ?? "Cargando...")}
          </p>
        </section>
      </section>
    </>
  );
};

export default AdminDashboardPage;
