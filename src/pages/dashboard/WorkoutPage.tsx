import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../shared/utils/api";
import {
  formatDuration,
  saveWorkout,
  type WorkoutExercise,
  type WorkoutSet,
} from "../../shared/utils/workouts";

interface Skill {
  id: string | number;
  nombre: string;
  dificultad: string;
  url_img: string;
  musculos: string[];
}

const emptySet = (): WorkoutSet => ({ reps: 10, weight: 0 });

const WorkoutPage = () => {
  const [library, setLibrary] = useState<Skill[]>([]);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [workoutName, setWorkoutName] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [restRemaining, setRestRemaining] = useState(0);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<number | null>(null);
  const previousRestRemainingRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let active = true;

    const loadLibrary = async () => {
      try {
        const response = await apiFetch("/exercises/skills");
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "No se pudo cargar la biblioteca");
        if (active) setLibrary(Array.isArray(data) ? data : []);
      } catch (requestError) {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Error de conexión");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadLibrary();
    return () => { active = false; };
  }, []);

  function playRestFinishedSound() {
    const context = audioContextRef.current;
    if (!context) return;
    const now = context.currentTime;

    [0, 0.18, 0.36].forEach((offset, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 660 + index * 110;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.18, now + offset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.12);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.13);
    });
  }

  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (restRemaining <= 0) {
      if (previousRestRemainingRef.current === 1) {
        playRestFinishedSound();
      }
      previousRestRemainingRef.current = 0;
      return;
    }

    previousRestRemainingRef.current = restRemaining;
    const restTimer = window.setTimeout(() => setRestRemaining((value) => value - 1), 1000);
    return () => window.clearTimeout(restTimer);
  }, [restRemaining]);

  const addExercise = (skill: Skill) => {
    if (exercises.some((exercise) => exercise.id === String(skill.id))) return;
    setExercises((current) => [
      ...current,
      {
        id: String(skill.id),
        name: skill.nombre,
        difficulty: skill.dificultad,
        image: skill.url_img,
        sets: [emptySet()],
      },
    ]);
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof WorkoutSet, value: number) => {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, index) =>
                index === setIndex ? { ...set, [field]: Math.max(0, value) } : set,
              ),
            }
          : exercise,
      ),
    );
  };

  const startRest = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    void audioContextRef.current.resume();
    setRestRemaining(restSeconds);
  };

  const stopRest = () => setRestRemaining(0);

  const save = async () => {
    if (exercises.length === 0) {
      setError("Añade al menos un ejercicio al entrenamiento.");
      return;
    }

    try {
      await saveWorkout(
        {
          name: workoutName.trim() || `Entrenamiento ${new Date().toLocaleDateString("es-ES")}`,
          date: new Date().toISOString(),
          durationSeconds: elapsed,
          exercises,
        },
      );
      setRunning(false);
      setSaved(true);
      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar el entrenamiento.");
    }
  };

  const filteredLibrary = library.filter((skill) =>
    skill.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <article className="mx-auto max-w-6xl pb-16">
      <header className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--primary-color)">
            Sesión activa
          </p>
          <h1 className="mt-2 text-3xl font-bold text-(--text-color)">Registrar entrenamiento</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              running
                ? "border border-amber-300/30 bg-amber-300/10 text-amber-200"
                : "bg-(--primary-color) text-black"
            }`}
          >
            {running ? "Pausar" : elapsed > 0 ? "Reanudar" : "Iniciar"}
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-xl border border-(--border-color) bg-(--secondary-color) px-5 py-3 text-sm font-bold text-(--text-color) transition hover:border-(--primary-color)"
          >
            Guardar
          </button>
        </div>
      </header>

      {saved && (
        <div className="mb-5 rounded-xl border border-lime-300/20 bg-lime-300/10 px-4 py-3 text-sm font-semibold text-lime-200">
          Entrenamiento guardado correctamente.
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200" role="alert">
          {error}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
        <div className="space-y-5">
          <article className="rounded-3xl border border-(--border-color) bg-(--secondary-color) p-5 sm:p-6">
            <label className="text-xs font-bold uppercase tracking-[0.16em] text-(--subtext-color)">
              Nombre del entrenamiento
              <input
                value={workoutName}
                onChange={(event) => setWorkoutName(event.target.value)}
                placeholder="Ej. Tren superior"
                className="mt-3 w-full rounded-xl border border-(--border-color) bg-(--tertiary-color) px-4 py-3 text-base font-normal normal-case tracking-normal text-white outline-none placeholder:text-(--subtext-color)/60 focus:border-(--primary-color)"
              />
            </label>
          </article>

          {exercises.length === 0 ? (
            <article className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-(--border-color) bg-(--secondary-color)/40 p-8 text-center">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-2xl text-(--primary-color)">+</div>
              <h2 className="font-semibold text-white">Añade ejercicios</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-(--subtext-color)">
                Selecciona movimientos de la biblioteca para registrar series, repeticiones y peso.
              </p>
            </article>
          ) : (
            <div className="space-y-4">
              {exercises.map((exercise, exerciseIndex) => (
                <article key={exercise.id} className="rounded-3xl border border-(--border-color) bg-(--secondary-color) p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-4">
                    {exercise.image ? (
                      <img src={exercise.image} alt="" className="size-14 rounded-xl object-cover" />
                    ) : (
                      <div className="size-14 rounded-xl bg-(--tertiary-color)" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-(--primary-color)">
                        Ejercicio {exerciseIndex + 1}
                      </p>
                      <h2 className="mt-1 truncate text-lg font-bold text-white">{exercise.name}</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExercises((current) => current.filter((item) => item.id !== exercise.id))}
                      className="rounded-lg px-3 py-2 text-xs font-semibold text-(--subtext-color) hover:bg-rose-300/10 hover:text-rose-200"
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="grid gap-2">
                    <div className="grid grid-cols-[42px_1fr_1fr_42px] items-center gap-2 px-1 text-[10px] font-bold uppercase tracking-wider text-(--subtext-color)">
                      <span>Serie</span><span>Reps</span><span>Peso kg</span><span />
                    </div>
                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-[42px_1fr_1fr_42px] items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-(--tertiary-color) text-xs font-bold text-(--primary-color)">
                          {setIndex + 1}
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={set.reps}
                          onChange={(event) => updateSet(exercise.id, setIndex, "reps", Number(event.target.value))}
                          className="w-full rounded-lg border border-(--border-color) bg-(--tertiary-color) px-3 py-2.5 text-sm text-white outline-none focus:border-(--primary-color)"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={set.weight}
                          onChange={(event) => updateSet(exercise.id, setIndex, "weight", Number(event.target.value))}
                          className="w-full rounded-lg border border-(--border-color) bg-(--tertiary-color) px-3 py-2.5 text-sm text-white outline-none focus:border-(--primary-color)"
                        />
                        <button
                          type="button"
                          onClick={() => setExercises((current) =>
                            current.map((item) =>
                              item.id === exercise.id
                                ? { ...item, sets: item.sets.filter((_, index) => index !== setIndex) }
                                : item,
                            ),
                          )}
                          className="flex size-8 items-center justify-center rounded-lg text-(--subtext-color) hover:bg-rose-300/10 hover:text-rose-200"
                          aria-label="Eliminar serie"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setExercises((current) =>
                      current.map((item) =>
                        item.id === exercise.id ? { ...item, sets: [...item.sets, emptySet()] } : item,
                      ),
                    )}
                    className="mt-4 rounded-lg border border-(--border-color) px-3 py-2 text-xs font-bold text-(--primary-color) hover:border-(--primary-color)"
                  >
                    + Añadir serie
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <article className="overflow-hidden rounded-3xl border border-(--primary-color)/20 bg-(--secondary-color)">
            <div className="border-b border-(--border-color) px-5 py-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-(--subtext-color)">Tiempo activo</p>
              <p className="mt-2 font-(--font-space) text-5xl font-bold tabular-nums text-(--primary-color)">
                {formatDuration(elapsed)}
              </p>
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-(--text-color)">Descanso</span>
                {restRemaining > 0 && (
                  <span className="font-bold tabular-nums text-amber-300">{formatDuration(restRemaining)}</span>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  value={restSeconds}
                  onChange={(event) => setRestSeconds(Number(event.target.value))}
                  className="min-w-0 flex-1 rounded-xl border border-(--border-color) bg-(--tertiary-color) px-3 py-3 text-sm text-white outline-none"
                >
                  <option value={30}>30 segundos</option>
                  <option value={60}>60 segundos</option>
                  <option value={90}>90 segundos</option>
                  <option value={120}>2 minutos</option>
                  <option value={180}>3 minutos</option>
                </select>
                <button
                  type="button"
                  onClick={startRest}
                  className="rounded-xl bg-(--primary-color) px-4 text-sm font-bold text-black"
                >
                  Iniciar
                </button>
                {restRemaining > 0 && (
                  <button
                    type="button"
                    onClick={stopRest}
                    className="rounded-xl border border-rose-300/20 px-3 text-sm font-bold text-rose-200 transition hover:bg-rose-300/10"
                  >
                    Detener
                  </button>
                )}
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-(--border-color) bg-(--secondary-color) p-5">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar ejercicio..."
              className="mb-4 w-full rounded-xl border border-(--border-color) bg-(--tertiary-color) px-4 py-3 text-sm text-white outline-none placeholder:text-(--subtext-color) focus:border-(--primary-color)"
            />
            <div className="max-h-125 space-y-2 overflow-y-auto pr-1">
              {loading ? (
                <p className="py-8 text-center text-sm text-(--subtext-color)">Cargando biblioteca...</p>
              ) : filteredLibrary.map((skill) => {
                const selected = exercises.some((exercise) => exercise.id === String(skill.id));
                return (
                  <button
                    type="button"
                    key={skill.id}
                    disabled={selected}
                    onClick={() => addExercise(skill)}
                    className="flex w-full items-center gap-3 rounded-xl border border-(--border-color) p-2 text-left transition hover:border-(--primary-color)/50 disabled:opacity-50"
                  >
                    {skill.url_img ? (
                      <img src={skill.url_img} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="size-12 shrink-0 rounded-lg bg-(--tertiary-color)" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white">{skill.nombre}</span>
                      <span className="mt-1 block truncate text-[11px] text-(--subtext-color)">
                        {skill.musculos?.join(", ") || skill.dificultad}
                      </span>
                    </span>
                    <span className="text-lg text-(--primary-color)">{selected ? "✓" : "+"}</span>
                  </button>
                );
              })}
            </div>
          </article>
        </aside>
      </section>
    </article>
  );
};

export default WorkoutPage;
