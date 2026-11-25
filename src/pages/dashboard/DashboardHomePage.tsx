import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../shared/context/AuthContext";
import { formatDuration, getWorkouts, type WorkoutRecord } from "../../shared/utils/workouts";

const DashboardHomePage = () => {
  const { user } = useAuth();
  const displayName = user?.username || user?.email?.split("@")[0] || "atleta";
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([]);
  const [workoutsLoading, setWorkoutsLoading] = useState(true);
  const [workoutsError, setWorkoutsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getWorkouts()
      .then((records) => {
        if (active) setWorkouts(records);
      })
      .catch((error: unknown) => {
        if (active) {
          setWorkoutsError(
            error instanceof Error ? error.message : "No se pudieron cargar las sesiones.",
          );
        }
      })
      .finally(() => {
        if (active) setWorkoutsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const totalSeconds = workouts.reduce((total, workout) => total + workout.durationSeconds, 0);
  const totalSets = workouts.reduce(
    (total, workout) =>
      total +
      workout.exercises.reduce(
        (sets, exercise) => sets + (exercise.setsCompleted ?? exercise.sets.length),
        0,
      ),
    0,
  );
  const recentWorkouts = workouts.slice(0, 3);

  return (
    <>
      {workoutsError && <p className="mb-5 text-sm text-red-300" role="alert">{workoutsError}</p>}
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
          <Link
            to="/dashboard/sessions"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-5 py-3 text-sm font-bold text-(--background-color) transition hover:brightness-110"
          >
            Ver sesiones
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path
                d="M5 12h14m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </section>
      </article>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-(--border-color) bg-(--secondary-color) p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--subtext-color)">Sesiones</p>
          <p className="mt-2 text-3xl font-bold text-(--text-color)">{workoutsLoading ? "…" : workouts.length}</p>
          <p className="mt-1 text-xs text-(--subtext-color)">Entrenamientos registrados</p>
        </article>
        <article className="rounded-2xl border border-(--border-color) bg-(--secondary-color) p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--subtext-color)">Tiempo total</p>
          <p className="mt-2 text-3xl font-bold text-(--text-color)">{workoutsLoading ? "…" : formatDuration(totalSeconds)}</p>
          <p className="mt-1 text-xs text-(--subtext-color)">Tiempo activo acumulado</p>
        </article>
        <article className="rounded-2xl border border-(--border-color) bg-(--secondary-color) p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--subtext-color)">Series</p>
          <p className="mt-2 text-3xl font-bold text-(--text-color)">{workoutsLoading ? "…" : totalSets}</p>
          <p className="mt-1 text-xs text-(--subtext-color)">Series completadas</p>
        </article>
      </section>

      {recentWorkouts.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">Historial</p>
              <h2 className="mt-2 text-xl font-bold text-(--text-color)">Últimos entrenamientos</h2>
            </div>
            <Link to="/dashboard/sessions" className="text-xs font-bold text-(--primary-color)">Ver sesiones</Link>
          </div>
          <div className="grid gap-3">
            {recentWorkouts.map((workout) => (
              <article key={workout.id} className="flex flex-col gap-3 rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-(--text-color)">{workout.name}</h3>
                  <p className="mt-1 text-xs text-(--subtext-color)">
                    {new Date(workout.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-5 text-xs">
                  <span className="text-(--subtext-color)"><strong className="mr-1 text-white">{workout.exercises.length}</strong>ejercicios</span>
                  <span className="text-(--subtext-color)"><strong className="mr-1 text-white">{formatDuration(workout.durationSeconds)}</strong>duración</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

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
