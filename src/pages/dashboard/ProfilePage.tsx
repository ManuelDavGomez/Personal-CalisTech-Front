import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../shared/context/AuthContext";
import { formatDuration, getWorkouts, type WorkoutRecord } from "../../shared/utils/workouts";

const ProfilePage = () => {
  const { user } = useAuth();
  const displayName = user?.username || user?.email?.split("@")[0] || "Atleta";
  const email = user?.email || "No disponible";
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
  const totalExercises = workouts.reduce((total, workout) => total + workout.exercises.length, 0);
  const totalSets = workouts.reduce(
    (total, workout) =>
      total +
      workout.exercises.reduce(
        (exerciseTotal, exercise) =>
          exerciseTotal + (exercise.setsCompleted ?? exercise.sets.length),
        0,
      ),
    0,
  );
  const initials = displayName
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0].toUpperCase())
    .join("");
  const recentWorkout = workouts[0];
  const firstWorkout = [...workouts].reverse()[0];

  return (
    <div className="mx-auto max-w-5xl">
      {workoutsError && <p className="mb-5 text-sm text-red-300" role="alert">{workoutsError}</p>}
      <article className="relative overflow-hidden rounded-3xl border border-(--border-color) bg-(--secondary-color)">
        <div className="h-32 bg-[linear-gradient(135deg,rgba(212,255,0,0.18),rgba(212,255,0,0.02)_55%,rgba(14,14,14,0.9))] sm:h-40" />
        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <span className="flex size-24 shrink-0 items-center justify-center rounded-full border-4 border-(--secondary-color) bg-(--primary-color) text-2xl font-black text-(--background-color) shadow-xl">
                {initials || "AT"}
              </span>
              <div className="pb-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
                  Miembro CalisTech
                </p>
                <h1 className="mt-1 text-3xl font-bold text-(--text-color)">{displayName}</h1>
                <p className="mt-1 text-sm text-(--subtext-color)">{email}</p>
              </div>
            </div>
            <Link
              to="/dashboard/workout"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--primary-color)/25 bg-(--primary-color)/10 px-4 py-2.5 text-sm font-bold text-(--primary-color) transition hover:bg-(--primary-color)/15"
            >
              Nuevo entrenamiento
              <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>
      </article>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Sesiones", workoutsLoading ? "…" : workouts.length, "entrenamientos"],
          ["Tiempo activo", workoutsLoading ? "…" : formatDuration(totalSeconds), "acumulado"],
          ["Ejercicios", workoutsLoading ? "…" : totalExercises, "registrados"],
          ["Series", workoutsLoading ? "…" : totalSets, "completadas"],
        ].map(([label, value, caption]) => (
          <article key={String(label)} className="rounded-2xl border border-(--border-color) bg-(--secondary-color) p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--subtext-color)">
              {label}
            </p>
            <p className="mt-3 text-2xl font-bold text-(--text-color)">{value}</p>
            <p className="mt-1 text-xs text-(--subtext-color)">
              {caption}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-3xl border border-(--border-color) bg-(--secondary-color) p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
                Información personal
              </p>
              <h2 className="mt-2 text-xl font-bold text-(--text-color)">Datos de la cuenta</h2>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full bg-(--primary-color)/10 text-(--primary-color)">
              <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-4">
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--subtext-color)">
                Nombre de usuario
              </dt>
              <dd className="mt-2 font-semibold text-(--text-color)">{displayName}</dd>
            </div>
            <div className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-4">
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--subtext-color)">
                Correo electrónico
              </dt>
              <dd className="mt-2 break-all font-semibold text-(--text-color)">{email}</dd>
            </div>
            <div className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-4">
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--subtext-color)">
                Rol
              </dt>
              <dd className="mt-2 font-semibold capitalize text-(--text-color)">
                {user?.role === "admin" ? "Administrador" : "Atleta"}
              </dd>
            </div>
            <div className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-4">
              <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-(--subtext-color)">
                Identificador
              </dt>
              <dd className="mt-2 font-semibold text-(--text-color)">
                {user?.id ? `#${user.id}` : "No disponible"}
              </dd>
            </div>
          </dl>
        </article>

        <aside className="rounded-3xl border border-(--border-color) bg-(--secondary-color) p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
            Actividad
          </p>
          <h2 className="mt-2 text-xl font-bold text-(--text-color)">Resumen deportivo</h2>

          <div className="mt-6 space-y-4">
            <div className="border-b border-(--border-color) pb-4">
              <p className="text-xs text-(--subtext-color)">Última sesión</p>
              <p className="mt-1 font-semibold text-(--text-color)">
                {recentWorkout
                  ? new Date(recentWorkout.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Sin sesiones"}
              </p>
            </div>
            <div className="border-b border-(--border-color) pb-4">
              <p className="text-xs text-(--subtext-color)">Primer registro</p>
              <p className="mt-1 font-semibold text-(--text-color)">
                {firstWorkout
                  ? new Date(firstWorkout.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Sin actividad"}
              </p>
            </div>
            <div>
              <p className="text-xs text-(--subtext-color)">Estado</p>
              <p className="mt-1 flex items-center gap-2 font-semibold text-(--text-color)">
                <span className="size-2 rounded-full bg-(--primary-color)" />
                Cuenta activa
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/sessions"
            className="mt-6 flex w-full items-center justify-between rounded-xl border border-(--border-color) bg-(--tertiary-color) px-4 py-3 text-sm font-bold text-(--text-color) transition hover:border-(--primary-color)/30"
          >
            Ver historial
            <svg viewBox="0 0 24 24" fill="none" className="size-4 text-(--primary-color)" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </aside>
      </section>
    </div>
  );
};

export default ProfilePage;
