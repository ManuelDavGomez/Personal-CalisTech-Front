import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from "../../shared/utils/auth";

interface Skill {
  id: string | number;
  nombre: string;
  musculos: string[];
  dificultad: string;
  url_img: string;
  categorias: string[];
  descripcion?: string;
  pasos?: string[];
  materiales?: string[];
}

const isSkill = (value: unknown): value is Skill => {
  if (typeof value !== "object" || value === null) return false;

  const skill = value as Record<string, unknown>;
  return (
    (typeof skill.id === "string" || typeof skill.id === "number") &&
    typeof skill.nombre === "string" &&
    typeof skill.dificultad === "string" &&
    typeof skill.url_img === "string" &&
    Array.isArray(skill.musculos) &&
    skill.musculos.every((muscle) => typeof muscle === "string") &&
    Array.isArray(skill.categorias) &&
    skill.categorias.every((category) => typeof category === "string")
  );
};

const difficultyStyles: Record<string, string> = {
  Principiante: "border-lime-300/25 bg-lime-300/10 text-lime-200",
  Intermedio: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  Avanzado: "border-rose-300/25 bg-rose-300/10 text-rose-200",
};

const ExerciseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [imageUnavailable, setImageUnavailable] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadExercise = async () => {
      const token = getAuthToken();

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      if (!id) {
        setError("No se indicó qué ejercicio quieres consultar.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:3000/exercises/skills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "message" in data &&
            typeof data.message === "string"
              ? data.message
              : "No se pudo cargar el ejercicio.";
          throw new Error(message);
        }

        if (!Array.isArray(data) || !data.every(isSkill)) {
          throw new Error(
            "El servidor devolvió un formato de ejercicios inesperado.",
          );
        }

        const selectedExercise = data.find((item) => String(item.id) === id);

        if (active) {
          setExercise(selectedExercise ?? null);
          if (!selectedExercise) {
            setError(
              "No encontramos ese ejercicio. Puede que haya sido eliminado.",
            );
          }
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Error de conexión con el servidor.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadExercise();
    return () => {
      active = false;
    };
  }, [id, navigate, retryCount]);

  const muscles = exercise?.musculos ?? [];
  const categories = exercise?.categorias ?? [];
  const difficultyClass = exercise
    ? (difficultyStyles[exercise.dificultad] ??
      "border-white/10 bg-white/5 text-white/70")
    : "";

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 h-5 w-40 animate-pulse rounded bg-white/10" />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="aspect-4/3 animate-pulse rounded-3xl bg-white/5" />
          <div className="space-y-5 py-4">
            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-24 animate-pulse rounded-2xl bg-white/5" />
            <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
          </div>
        </div>
        <p className="sr-only" role="status">
          Cargando detalles del ejercicio...
        </p>
      </main>
    );
  }

  if (error || !exercise) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-3xl text-(--primary-color)">
          !
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-(--primary-color)">
          Ficha no disponible
        </p>
        <h1 className="mb-3 text-3xl font-bold text-white">
          No pudimos cargar este ejercicio
        </h1>
        <p
          className="mb-8 max-w-lg text-sm leading-6 text-white/60"
          role="alert"
        >
          {error || "El ejercicio solicitado no está disponible."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="rounded-xl bg-(--primary-color) px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
          >
            Intentar de nuevo
          </button>
          <Link
            to="/dashboard/skills"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Volver a ejercicios
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:pt-10 ">
      <nav
        aria-label="Ruta de navegación"
        className="mb-8 flex items-center gap-2 text-sm"
      >
        <Link
          to="/dashboard/skills"
          className="text-white/50 transition hover:text-(--primary-color)"
        >
          Volver atras
        </Link>
        <span aria-hidden="true" className="text-white/25">
          /
        </span>
        <span className="max-w-[60vw] truncate font-medium text-white/80">
          {exercise.nombre || "Detalle del ejercicio"}
        </span>
      </nav>

      <section className="grid items-stretch gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div className="group relative min-h-80 overflow-hidden rounded-4xl border border-white/10 bg-[#191a16] shadow-2xl shadow-black/30 sm:min-h-110">
          {imageUnavailable !== exercise.url_img && exercise.url_img ? (
            <img
              src={exercise.url_img}
              alt={`Imagen de ${exercise.nombre}`}
              onError={() => setImageUnavailable(exercise.url_img)}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_40%,rgba(212,255,0,0.16),transparent_55%),linear-gradient(145deg,#25291b,#121212_70%)]">
              <div className="text-center">
                <span className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl border border-lime-300/20 bg-lime-300/10 text-4xl text-(--primary-color)">
                  ↗
                </span>
                <p className="text-sm text-white/50">Imagen no disponible</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-black/20" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8"></div>
        </div>

        <div className="flex flex-col justify-center py-2 lg:py-8">
          <div className="mb-5 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold ${difficultyClass}`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m13 2-3 8h7l-6 12 1-9H6l7-11Z"
                />
              </svg>
              {exercise.dificultad || "Dificultad no indicada"}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/4 px-3.5 py-2 text-xs font-medium text-white/60">
              ID · {exercise.id}
            </span>
          </div>

          <h2 className="mb-3 text-2xl font-semibold text-white sm:text-3xl">
            {exercise.nombre || "Ejercicio sin nombre"}
          </h2>
          <p className="mb-7 max-w-xl text-sm leading-7 text-white/60">
            {exercise.descripcion ||
              "No hay descripción disponible para este ejercicio."}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2 text-(--primary-color)">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM6 13a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0v-1a3 3 0 0 0-3-3Zm12 0a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0v-1a3 3 0 0 0-3-3ZM9 7h6m-9 6 3-5m9 5-3-5"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-white">
                  Musculos Implicados
                </h3>
              </div>
              {muscles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {muscles.map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-lg bg-black/25 px-2.5 py-1.5 text-xs text-white/70"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-white/45">
                  No hay músculos asociados registrados.
                </p>
              )}
            </article>

            <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2 text-(--primary-color)">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7.5h16M4 12h10m-10 4.5h7M18 11l2 2-4 4"
                  />
                </svg>
                <h3 className="text-sm font-semibold text-white">Categorías</h3>
              </div>
              {categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-lg border border-lime-300/15 bg-lime-300/6 px-2.5 py-1.5 text-xs text-lime-100/80"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-white/45">
                  No hay categorías registradas.
                </p>
              )}
            </article>
          </div>

          <article className="mt-3 rounded-2xl border border-white/8 bg-white/[0.035] p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-(--primary-color)">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-7.5 w-7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M3 9v6m3-9v12m12-12v12m3-9v6M6 12h12"
                />
              </svg>

              <h3 className="text-sm font-semibold text-white">
                Materiales
              </h3>
            </div>

            <ul className="space-y-2 text-sm leading-6 text-white/60">
              {exercise.materiales && exercise.materiales.length > 0 ? (
                exercise.materiales.map((equip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--primary-color) text-xs font-semibold text-black">
                      {index + 1}
                    </span>
                    <p>{equip}</p>
                  </li>
                ))
              ) : (
                <li>No hay pasos de ejecución registrados.</li>
              )}
            </ul>
          </article>

          <div className="mt-3 rounded-2xl border border-lime-300/15 bg-lime-300/4.5 p-4 sm:p-5">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <span className="text-lg text-(--primary-color)">✦</span>
              Pasos de Ejecucion
            </p>

            <ul className="space-y-2 text-sm leading-6 text-white/60">
              {exercise.pasos && exercise.pasos.length > 0 ? (
                exercise.pasos.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-(--primary-color) text-xs font-semibold text-black">
                      {index + 1}
                    </span>
                    <p>{step}</p>
                  </li>
                ))
              ) : (
                <li>No hay pasos de ejecución registrados.</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 rounded-3xl border border-white/8 bg-linear-to-r from-white/4.5 to-transparent p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-(--primary-color)">
            Información de la ficha
          </p>
          <h2 className="mb-1 text-lg font-semibold text-white">
            Entrena con control, progresa con constancia
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-white/50">
            Esta página muestra los datos disponibles para el ejercicio.
            
          </p>
        </div>
        <Link
          to="/dashboard/skills"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--primary-color) px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15 18-6-6 6-6M9 12h11"
            />
          </svg>
          Volver a biblioteca
        </Link>
      </section>
    </main>
  );
};

export default ExerciseDetailPage;
