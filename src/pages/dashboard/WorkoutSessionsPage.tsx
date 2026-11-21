import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  formatDuration,
  getWorkouts,
  saveWorkout,
  type WorkoutExercise,
  type WorkoutRecord,
} from "../../shared/utils/workouts";
import { getAuthToken, getAuthUser } from "../../shared/utils/auth";

interface Skill {
  id: string | number;
  nombre: string;
  dificultad: string;
  url_img: string;
  musculos: string[];
  categorias: string[];
  descripcion?: string;
  pasos: string[];
  materiales: string[];
}

type View = "routines" | "history";
type Screen = "list" | "routine" | "exercise" | "workout";

const routineName = "Rutina de ejemplo";
const setsPerExercise = 3;
const defaultRestBetweenSetsSeconds = 60;
const defaultRestBetweenExercisesSeconds = 90;
const getCurrentTime = () => Date.now();

const readStringList = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

const parseSkill = (value: unknown): Skill | null => {
  if (typeof value !== "object" || value === null) return null;
  const skill = value as Record<string, unknown>;

  if (
    (typeof skill.id !== "string" && typeof skill.id !== "number") ||
    typeof skill.nombre !== "string" ||
    typeof skill.dificultad !== "string" ||
    typeof skill.url_img !== "string" ||
    !Array.isArray(skill.musculos) ||
    !skill.musculos.every((muscle) => typeof muscle === "string")
  ) {
    return null;
  }

  return {
    id: skill.id,
    nombre: skill.nombre,
    dificultad: skill.dificultad,
    url_img: skill.url_img,
    musculos: skill.musculos,
    categorias: readStringList(skill.categorias),
    descripcion: typeof skill.descripcion === "string" ? skill.descripcion : undefined,
    pasos: readStringList(skill.pasos),
    materiales: readStringList(skill.materiales),
  };
};

const toWorkoutExercise = (skill: Skill): WorkoutExercise => ({
  id: String(skill.id),
  name: skill.nombre,
  difficulty: skill.dificultad,
  image: skill.url_img,
  muscles: skill.musculos,
  sets: [],
});

const difficultyStyles: Record<string, string> = {
  Principiante: "border-lime-300/25 bg-lime-300/10 text-lime-200",
  Intermedio: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  Avanzado: "border-rose-300/25 bg-rose-300/10 text-rose-200",
};

const WorkoutSessionsPage = () => {
  const user = getAuthUser();
  const [library, setLibrary] = useState<Skill[]>([]);
  const [history, setHistory] = useState<WorkoutRecord[]>(() => getWorkouts(user?.id));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("routines");
  const [screen, setScreen] = useState<Screen>("list");
  const [search, setSearch] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [restBetweenSetsSeconds, setRestBetweenSetsSeconds] = useState(defaultRestBetweenSetsSeconds);
  const [restBetweenExercisesSeconds, setRestBetweenExercisesSeconds] = useState(defaultRestBetweenExercisesSeconds);
  const [elapsed, setElapsed] = useState(0);
  const [restRemaining, setRestRemaining] = useState(0);
  const [restType, setRestType] = useState<"set" | "exercise" | null>(null);
  const [running, setRunning] = useState(false);
  const [saved, setSaved] = useState(false);
  const startedAtRef = useRef(0);
  const elapsedBeforeStartRef = useRef(0);
  const routineSkills = library.slice(0, 2);
  const routineExercises = routineSkills.map(toWorkoutExercise);
  const estimatedDurationMinutes = Math.max(
    1,
    Math.ceil(
      (
        routineSkills.length * setsPerExercise * 45 +
        routineSkills.length * (setsPerExercise - 1) * restBetweenSetsSeconds +
        Math.max(0, routineSkills.length - 1) * restBetweenExercisesSeconds
      ) / 60,
    ),
  );

  useEffect(() => {
    let active = true;

    const loadExercises = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("Tu sesión expiró. Inicia sesión para ver las sesiones.");
        setLoading(false);
        return;
      }

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
              : "No se pudo cargar la biblioteca de ejercicios.";
          throw new Error(message);
        }

        const parsedSkills = Array.isArray(data) ? data.map(parseSkill) : null;
        if (!parsedSkills) {
          throw new Error("El servidor devolvió un formato de ejercicios inesperado.");
        }
        const skills = parsedSkills.filter((skill): skill is Skill => skill !== null);
        if (skills.length !== parsedSkills.length) {
          throw new Error("El servidor devolvió un formato de ejercicios inesperado.");
        }
        if (active) setLibrary(skills);
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

    void loadExercises();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setElapsed(
        elapsedBeforeStartRef.current +
          Math.floor((getCurrentTime() - startedAtRef.current) / 1000),
      );
    }, 250);
    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running || restRemaining <= 0) return;
    const timeout = window.setTimeout(() => {
      if (restRemaining === 1) {
        setRestRemaining(0);
        if (restType === "set") {
          setCurrentSet((set) => set + 1);
        } else if (restType === "exercise") {
          setCurrentExercise((index) => Math.min(index + 1, routineSkills.length - 1));
          setCurrentSet(1);
        }
        setRestType(null);
      } else {
        setRestRemaining((remaining) => remaining - 1);
      }
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [restRemaining, restType, running, routineSkills.length]);

  const muscles = useMemo(
    () =>
      [...new Set(library.flatMap((skill) => skill.musculos))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [library],
  );
  const routineMuscles = [...new Set(routineSkills.flatMap((skill) => skill.musculos))];
  const routineDifficulty = routineSkills.some((skill) => skill.dificultad === "Avanzado")
    ? "Avanzado"
    : routineSkills.some((skill) => skill.dificultad === "Intermedio")
      ? "Intermedio"
      : routineSkills[0]?.dificultad || "Principiante";
  const normalizedSearch = search.trim().toLowerCase();
  const routineMatchesFilters =
    (!normalizedSearch ||
      routineName.toLowerCase().includes(normalizedSearch) ||
      routineSkills.some((skill) => skill.nombre.toLowerCase().includes(normalizedSearch))) &&
    (!muscleFilter || routineMuscles.includes(muscleFilter)) &&
    (!difficultyFilter || routineDifficulty === difficultyFilter);

  const filteredHistory = history.filter((workout) => {
    const matchesSearch = workout.name.toLowerCase().includes(normalizedSearch);
    const matchesMuscle =
      !muscleFilter ||
      workout.exercises.some((exercise) => exercise.muscles?.includes(muscleFilter));
    const matchesDifficulty =
      !difficultyFilter ||
      workout.exercises.some((exercise) => exercise.difficulty === difficultyFilter);
    return matchesSearch && matchesMuscle && matchesDifficulty;
  });

  const clearFilters = () => {
    setSearch("");
    setMuscleFilter("");
    setDifficultyFilter("");
  };

  const startRoutine = () => {
    setCurrentExercise(0);
    setCurrentSet(1);
    setElapsed(0);
    setRestRemaining(0);
    setRestType(null);
    elapsedBeforeStartRef.current = 0;
    startedAtRef.current = getCurrentTime();
    setSaved(false);
    setScreen("workout");
    setRunning(true);
  };

  const toggleTimer = () => {
    if (running) {
      const pausedElapsed =
        elapsedBeforeStartRef.current +
        Math.floor((getCurrentTime() - startedAtRef.current) / 1000);
      elapsedBeforeStartRef.current = pausedElapsed;
      setElapsed(pausedElapsed);
      setRunning(false);
      return;
    }

    startedAtRef.current = getCurrentTime();
    setRunning(true);
  };

  const finishRoutine = () => {
    const durationSeconds = running
      ? elapsedBeforeStartRef.current +
        Math.floor((getCurrentTime() - startedAtRef.current) / 1000)
      : elapsed;

    try {
      const record = saveWorkout(
        {
          name: routineName,
          date: new Date().toISOString(),
          durationSeconds,
          exercises: routineExercises.map((exercise) => ({
            ...exercise,
            setsCompleted: setsPerExercise,
          })),
        },
        user?.id,
      );
      setHistory((current) => [record, ...current]);
      setElapsed(durationSeconds);
      setRunning(false);
      setScreen("list");
      setView("history");
      setSaved(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la sesión.",
      );
    }
  };

  const continueWorkout = () => {
    if (currentSet < setsPerExercise) {
      if (restBetweenSetsSeconds > 0) {
        setRestType("set");
        setRestRemaining(restBetweenSetsSeconds);
      } else {
        setCurrentSet((set) => set + 1);
      }
      return;
    }

    if (currentExercise < routineSkills.length - 1) {
      if (restBetweenExercisesSeconds > 0) {
        setRestType("exercise");
        setRestRemaining(restBetweenExercisesSeconds);
      } else {
        setCurrentExercise((index) => index + 1);
        setCurrentSet(1);
      }
      return;
    }

    finishRoutine();
  };

  const skipRest = () => {
    setRestRemaining(0);
    if (restType === "set") {
      setCurrentSet((set) => set + 1);
    } else if (restType === "exercise") {
      setCurrentExercise((index) => Math.min(index + 1, routineSkills.length - 1));
      setCurrentSet(1);
    }
    setRestType(null);
  };

  const updateRestDuration = (
    event: ChangeEvent<HTMLInputElement>,
    setter: (seconds: number) => void,
  ) => {
    const seconds = Number(event.target.value);
    setter(Number.isFinite(seconds) ? Math.min(600, Math.max(0, seconds)) : 0);
  };

  const backToRoutineList = () => {
    setScreen("list");
    setSelectedExercise(null);
  };

  if (screen === "workout") {
    const exercise = routineSkills[currentExercise];
    const nextExercise = routineSkills[currentExercise + 1];
    const restExercise = restType === "set" ? exercise : nextExercise;
    const setCount = setsPerExercise;
    const isLastSet = currentSet >= setCount;
    const isLastExercise = currentExercise >= routineSkills.length - 1;
    const continueLabel = !isLastSet
      ? restBetweenSetsSeconds > 0 ? "Completar serie y descansar" : "Siguiente serie"
      : !isLastExercise
        ? restBetweenExercisesSeconds > 0 ? "Completar ejercicio y descansar" : "Siguiente ejercicio"
        : "Finalizar y guardar entrenamiento";

    return (
      <article className="mx-auto max-w-4xl pb-12">
        <button
          type="button"
          onClick={() => {
            setRunning(false);
            setRestRemaining(0);
            backToRoutineList();
          }}
          className="mb-6 text-sm font-semibold text-(--subtext-color) transition hover:text-(--primary-color)"
        >
          ← Salir de la sesión
        </button>

        <section className="overflow-hidden rounded-3xl border border-(--border-color) bg-(--secondary-color)">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border-color) px-5 py-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-(--primary-color)">
                Ejercicio {currentExercise + 1} de {routineSkills.length} · Serie {currentSet} de {setCount}
              </p>
              <h1 className="mt-1 text-lg font-bold text-white">{routineName}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-(--font-space) text-xl font-bold tabular-nums text-(--primary-color)">
                {formatDuration(elapsed)}
              </span>
              <button
                type="button"
                onClick={toggleTimer}
                className="rounded-lg border border-(--border-color) px-3 py-2 text-xs font-bold text-white transition hover:border-(--primary-color)"
              >
                {running ? "Pausar" : "Reanudar"}
              </button>
            </div>
          </div>

          {restRemaining > 0 ? (
            <div className="p-5 sm:p-8">
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-center sm:p-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                  {restType === "set" ? "Descanso entre series" : "Descanso entre ejercicios"}
                </p>
                <p className="my-4 font-(--font-space) text-6xl font-bold tabular-nums text-amber-200">
                  {formatDuration(restRemaining)}
                </p>
                {restExercise && (
                  <p className="text-sm text-(--subtext-color)">
                    {restType === "set" ? "Siguiente serie:" : "Siguiente ejercicio:"}{" "}
                    <strong className="text-white">
                      {restType === "set"
                        ? `${currentSet + 1} de ${setCount} · ${restExercise.nombre}`
                        : restExercise.nombre}
                    </strong>
                  </p>
                )}
                <button
                  type="button"
                  onClick={skipRest}
                  className="mt-5 rounded-xl border border-amber-200/20 px-4 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/10"
                >
                  Saltar descanso
                </button>
              </div>
              {restExercise && (
                <div className="mt-5 flex items-center gap-4 rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-4">
                  {restExercise.url_img ? (
                    <img src={restExercise.url_img} alt="" className="size-16 rounded-xl object-cover" />
                  ) : (
                    <div className="size-16 rounded-xl bg-(--secondary-color)" />
                  )}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--primary-color)">
                      {restType === "set" ? "Siguiente serie" : "Siguiente ejercicio"}
                    </p>
                    <p className="mt-1 font-semibold text-white">
                      {restType === "set"
                        ? `Serie ${currentSet + 1} de ${setCount} · ${restExercise.nombre}`
                        : restExercise.nombre}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : exercise ? (
            <>
              {exercise.url_img ? (
                <img
                  src={exercise.url_img}
                  alt={`Demostración de ${exercise.nombre}`}
                  className="max-h-96 w-full bg-(--tertiary-color) object-contain"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-(--tertiary-color) text-5xl text-(--primary-color)">
                  ✦
                </div>
              )}
              <div className="p-5 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--primary-color)">
                      Ejercicio actual
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-white">{exercise.nombre}</h2>
                    <p className="mt-1 text-xs font-semibold text-(--primary-color)">
                      Serie {currentSet} de {setCount}
                    </p>
                    <p className="mt-2 text-sm text-(--subtext-color)">
                      {exercise.musculos.join(" · ") || "Grupo muscular no especificado"}
                    </p>
                  </div>
                  <span className="rounded-full border border-(--border-color) px-3 py-1.5 text-xs text-(--subtext-color)">
                    {exercise.dificultad}
                  </span>
                </div>
                {nextExercise ? (
                  <div className="mt-6 flex items-center gap-4 rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-4">
                    {nextExercise.url_img ? (
                      <img src={nextExercise.url_img} alt="" className="size-16 rounded-xl object-cover" />
                    ) : (
                      <div className="size-16 rounded-xl bg-(--secondary-color)" />
                    )}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--subtext-color)">
                        Siguiente ejercicio
                      </p>
                      <p className="mt-1 font-semibold text-white">{nextExercise.nombre}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 rounded-xl border border-(--primary-color)/15 bg-(--primary-color)/5 p-4 text-sm text-(--subtext-color)">
                    Este es el último ejercicio de la rutina.
                  </p>
                )}
                <button
                  type="button"
                  onClick={continueWorkout}
                  className="mt-6 w-full rounded-xl bg-(--primary-color) px-5 py-4 text-sm font-bold text-black transition hover:brightness-110"
                >
                  {continueLabel}
                </button>
              </div>
            </>
          ) : null}
        </section>
      </article>
    );
  }

  if (screen === "exercise" && selectedExercise !== null) {
    const exercise = routineSkills[selectedExercise];
    if (!exercise) {
      return (
        <article className="mx-auto max-w-3xl py-12 text-center">
          <p className="text-sm text-(--subtext-color)">No se pudo cargar ese ejercicio.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedExercise(null);
              setScreen("routine");
            }}
            className="mt-4 rounded-xl border border-(--border-color) px-4 py-2 text-sm font-semibold text-white"
          >
            Volver a la rutina
          </button>
        </article>
      );
    }

    return (
      <article className="mx-auto max-w-5xl pb-12">
        <button
          type="button"
          onClick={() => setScreen("routine")}
          className="mb-6 text-sm font-semibold text-(--subtext-color) transition hover:text-(--primary-color)"
        >
          ← Volver a {routineName}
        </button>
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-(--border-color) bg-(--secondary-color)">
            {exercise.url_img ? (
              <img
                src={exercise.url_img}
                alt={exercise.nombre}
                className="h-full min-h-72 w-full object-cover"
              />
            ) : (
              <div className="flex min-h-72 items-center justify-center bg-(--tertiary-color) text-5xl text-(--primary-color)">
                ✦
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-(--primary-color)">
                Información del ejercicio
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">{exercise.nombre}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${difficultyStyles[exercise.dificultad] || "border-white/10 bg-white/5 text-white/70"}`}>
                {exercise.dificultad}
              </span>
              {exercise.categorias.map((category) => (
                <span key={category} className="rounded-full border border-(--border-color) px-3 py-1.5 text-xs text-(--subtext-color)">
                  {category}
                </span>
              ))}
            </div>
            <section className="rounded-2xl border border-(--border-color) bg-(--secondary-color) p-5">
              <h2 className="text-sm font-bold text-white">Partes del cuerpo</h2>
              <p className="mt-2 text-sm leading-6 text-(--subtext-color)">
                {exercise.musculos.join(", ") || "No hay músculos asociados registrados."}
              </p>
            </section>
            <section className="rounded-2xl border border-(--border-color) bg-(--secondary-color) p-5">
              <h2 className="text-sm font-bold text-white">Descripción</h2>
              <p className="mt-2 text-sm leading-6 text-(--subtext-color)">
                {exercise.descripcion || "No hay una descripción disponible para este ejercicio."}
              </p>
            </section>
            {exercise.materiales.length > 0 && (
              <section className="rounded-2xl border border-(--border-color) bg-(--secondary-color) p-5">
                <h2 className="text-sm font-bold text-white">Materiales</h2>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-(--subtext-color)">
                  {exercise.materiales.map((material, index) => <li key={`${material}-${index}`}>{material}</li>)}
                </ul>
              </section>
            )}
            {exercise.pasos.length > 0 && (
              <section className="rounded-2xl border border-(--border-color) bg-(--secondary-color) p-5">
                <h2 className="text-sm font-bold text-white">Cómo realizarlo</h2>
                <ol className="mt-3 space-y-2 text-sm leading-6 text-(--subtext-color)">
                  {exercise.pasos.map((step, index) => (
                    <li key={`${step}-${index}`} className="flex gap-3">
                      <span className="font-bold text-(--primary-color)">{index + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </section>
      </article>
    );
  }

  if (screen === "routine") {
    return (
      <article className="mx-auto max-w-5xl pb-12">
        <button
          type="button"
          onClick={backToRoutineList}
          className="mb-6 text-sm font-semibold text-(--subtext-color) transition hover:text-(--primary-color)"
        >
          ← Volver a sesiones
        </button>
        <header className="mb-6 rounded-3xl border border-(--border-color) bg-(--secondary-color) p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-(--primary-color)">
            Rutina guiada
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">{routineName}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${difficultyStyles[routineDifficulty] || "border-white/10 bg-white/5 text-white/70"}`}>
              {routineDifficulty}
            </span>
            <span className="rounded-full border border-(--border-color) px-3 py-1.5 text-xs text-(--subtext-color)">
              ~{estimatedDurationMinutes} min
            </span>
            {routineMuscles.map((muscle) => (
              <span key={muscle} className="rounded-full border border-(--border-color) px-3 py-1.5 text-xs text-(--subtext-color)">
                {muscle}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={startRoutine}
            className="mt-6 rounded-xl bg-(--primary-color) px-5 py-3 text-sm font-bold text-black transition hover:brightness-110"
          >
            Empezar entrenamiento
          </button>
        </header>

        <section className="mb-6 rounded-3xl border border-(--border-color) bg-(--secondary-color) p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white">Descansos de la sesión</h2>
            <p className="mt-1 text-sm text-(--subtext-color)">
              Las series y los ejercicios de esta rutina son fijos. Ajusta solo los descansos antes de empezar.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-4">
              <span className="block text-sm font-semibold text-white">Descanso entre series</span>
              <span className="mt-1 block text-xs text-(--subtext-color)">Segundos · 0 a 600</span>
              <input
                type="number"
                min="0"
                max="600"
                step="15"
                value={restBetweenSetsSeconds}
                onChange={(event) => updateRestDuration(event, setRestBetweenSetsSeconds)}
                className="mt-3 w-full rounded-xl border border-(--border-color) bg-(--secondary-color) px-4 py-3 text-sm text-white outline-none focus:border-(--primary-color)"
              />
            </label>
            <label className="rounded-2xl border border-(--border-color) bg-(--tertiary-color) p-4">
              <span className="block text-sm font-semibold text-white">Descanso entre ejercicios</span>
              <span className="mt-1 block text-xs text-(--subtext-color)">Segundos · 0 a 600</span>
              <input
                type="number"
                min="0"
                max="600"
                step="15"
                value={restBetweenExercisesSeconds}
                onChange={(event) => updateRestDuration(event, setRestBetweenExercisesSeconds)}
                className="mt-3 w-full rounded-xl border border-(--border-color) bg-(--secondary-color) px-4 py-3 text-sm text-white outline-none focus:border-(--primary-color)"
              />
            </label>
          </div>
          <p className="mt-4 text-xs text-(--subtext-color)">
            Duración estimada: ~{estimatedDurationMinutes} min. La duración real se guarda al terminar la sesión.
          </p>
        </section>

        <h2 className="mb-3 text-lg font-bold text-white">Ejercicios de la rutina</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {routineSkills.map((exercise, index) => (
            <article
              key={exercise.id}
              className="overflow-hidden rounded-2xl border border-(--border-color) bg-(--secondary-color)"
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedExercise(index);
                  setScreen("exercise");
                }}
                className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-(--tertiary-color)"
              >
                {exercise.url_img ? (
                  <img src={exercise.url_img} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
                ) : (
                  <span className="size-20 shrink-0 rounded-xl bg-(--tertiary-color)" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-(--primary-color)">
                    Ejercicio {index + 1}
                  </span>
                  <span className="mt-1 block truncate font-semibold text-white">{exercise.nombre}</span>
                  <span className="mt-1 block truncate text-xs text-(--subtext-color)">
                    {exercise.musculos.join(" · ")} · {exercise.dificultad}
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-(--primary-color)">Ver información</span>
                </span>
                <span aria-hidden="true" className="text-xl text-(--subtext-color)">›</span>
              </button>
              <div className="flex items-center justify-between border-t border-(--border-color) px-4 py-3">
                <span className="text-xs font-semibold text-(--subtext-color)">Series de la rutina</span>
                <span className="font-bold tabular-nums text-(--primary-color)">{setsPerExercise}</span>
              </div>
            </article>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article className="mx-auto max-w-6xl pb-12">
      <header className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
          Rutinas guiadas
        </p>
        <h1 className="mt-2 text-3xl font-bold text-(--text-color)">Sesiones</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-(--subtext-color)">
          Elige una rutina para ver sus ejercicios, consultar sus detalles y comenzar a entrenar.
        </p>
      </header>

      <section className="mb-6 flex flex-wrap gap-2 border-b border-(--border-color)">
        {([
          ["routines", "Rutinas"],
          ["history", "Mi historial"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setView(key);
              clearFilters();
            }}
            className={`border-b-2 px-4 py-3 text-sm font-bold transition ${
              view === key
                ? "border-(--primary-color) text-(--primary-color)"
                : "border-transparent text-(--subtext-color) hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </section>

      {saved && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-lime-300/20 bg-lime-300/10 px-4 py-3 text-sm font-semibold text-lime-200"
        >
          Sesión guardada en tu historial.
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200"
        >
          {error}
        </div>
      )}

      <section className="mb-6 grid gap-3 rounded-2xl border border-(--border-color) bg-(--secondary-color) p-4 sm:grid-cols-3">
        <label>
          <span className="sr-only">Buscar por nombre</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={view === "routines" ? "Buscar rutina o ejercicio..." : "Buscar en historial..."}
            className="w-full rounded-xl border border-(--border-color) bg-(--tertiary-color) px-4 py-3 text-sm text-white outline-none placeholder:text-(--subtext-color) focus:border-(--primary-color)"
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por músculo</span>
          <select
            value={muscleFilter}
            onChange={(event) => setMuscleFilter(event.target.value)}
            className="w-full rounded-xl border border-(--border-color) bg-(--tertiary-color) px-4 py-3 text-sm text-white outline-none focus:border-(--primary-color)"
          >
            <option value="">Todas las partes del cuerpo</option>
            {muscles.map((muscle) => (
              <option key={muscle} value={muscle}>{muscle}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filtrar por dificultad</span>
          <select
            value={difficultyFilter}
            onChange={(event) => setDifficultyFilter(event.target.value)}
            className="w-full rounded-xl border border-(--border-color) bg-(--tertiary-color) px-4 py-3 text-sm text-white outline-none focus:border-(--primary-color)"
          >
            <option value="">Todas las dificultades</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </label>
      </section>

      {view === "routines" ? (
        loading ? (
          <p className="py-12 text-center text-sm text-(--subtext-color)">Cargando rutinas...</p>
        ) : routineSkills.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-(--border-color) p-10 text-center">
            <h2 className="font-semibold text-white">Rutina de ejemplo no disponible</h2>
            <p className="mt-2 text-sm text-(--subtext-color)">
              Necesita al menos dos ejercicios en la biblioteca para poder iniciarse.
            </p>
          </div>
        ) : !routineMatchesFilters ? (
          <div className="rounded-2xl border border-dashed border-(--border-color) p-10 text-center">
            <h2 className="font-semibold text-white">No hay rutinas con esos filtros</h2>
            <p className="mt-2 text-sm text-(--subtext-color)">Prueba con otros filtros.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => setScreen("routine")}
              className="flex aspect-square flex-col overflow-hidden rounded-3xl border border-(--border-color) bg-(--secondary-color) text-left transition hover:-translate-y-1 hover:border-(--primary-color)/60"
            >
              <div className="grid min-h-0 flex-[0.9] grid-cols-2 bg-(--tertiary-color)">
                {routineSkills.map((exercise) =>
                  exercise.url_img ? (
                    <img
                      key={exercise.id}
                      src={exercise.url_img}
                      alt=""
                      className="h-full min-h-0 w-full object-cover"
                    />
                  ) : (
                    <div key={exercise.id} className="flex min-h-0 items-center justify-center text-3xl text-(--primary-color)">
                      ✦
                    </div>
                  ),
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-white">{routineName}</h2>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${difficultyStyles[routineDifficulty] || "border-white/10 bg-white/5 text-white/70"}`}>
                    {routineDifficulty}
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-(--subtext-color)">
                  <span aria-hidden="true">◷</span> ~{estimatedDurationMinutes} minutos
                </p>
                <div className="mt-3 flex min-h-12 flex-wrap content-start gap-1.5">
                  {routineMuscles.length > 0 ? routineMuscles.map((muscle) => (
                    <span key={muscle} className="rounded-lg bg-(--tertiary-color) px-2.5 py-1 text-[11px] text-(--subtext-color)">
                      {muscle}
                    </span>
                  )) : (
                    <span className="text-xs text-(--subtext-color)">Partes del cuerpo no indicadas</span>
                  )}
                </div>
                <p className="mt-4 text-xs font-bold text-(--primary-color)">
                  {routineSkills.length} ejercicios · Ver rutina <span aria-hidden="true">→</span>
                </p>
              </div>
            </button>
          </div>
        )
      ) : filteredHistory.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--border-color) p-10 text-center">
          <h2 className="font-semibold text-white">Aún no hay sesiones guardadas</h2>
          <p className="mt-2 text-sm text-(--subtext-color)">
            Cuando termines una rutina, aquí aparecerá su fecha y duración.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((workout) => (
            <article
              key={workout.id}
              className="flex flex-col gap-4 rounded-2xl border border-(--border-color) bg-(--secondary-color) p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-bold text-white">{workout.name}</h2>
                <p className="mt-1 text-xs text-(--subtext-color)">
                  {new Date(workout.date).toLocaleString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="mt-1 truncate text-xs text-(--subtext-color)">
                  {workout.exercises.map((exercise) => exercise.name).join(" · ")}
                </p>
              </div>
              <strong className="text-sm tabular-nums text-(--primary-color)">
                {formatDuration(workout.durationSeconds)}
              </strong>
            </article>
          ))}
        </div>
      )}
    </article>
  );
};

export default WorkoutSessionsPage;
