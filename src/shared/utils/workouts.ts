import { apiFetch } from "./api";

export interface WorkoutSet {
  reps: number;
  weight: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  difficulty: string;
  image: string;
  muscles?: string[];
  setsCompleted?: number;
  sets: WorkoutSet[];
}

export interface WorkoutRecord {
  id: string;
  userId: string;
  name: string;
  date: string;
  durationSeconds: number;
  exercises: WorkoutExercise[];
}

const isWorkoutRecord = (value: unknown): value is WorkoutRecord => {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.userId === "string" &&
    typeof record.name === "string" &&
    typeof record.date === "string" &&
    Number.isFinite(Date.parse(record.date)) &&
    typeof record.durationSeconds === "number" &&
    Number.isInteger(record.durationSeconds) &&
    Array.isArray(record.exercises) &&
    record.exercises.every((exercise) => {
      if (typeof exercise !== "object" || exercise === null) return false;
      const item = exercise as Record<string, unknown>;
      return (
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.difficulty === "string" &&
        typeof item.image === "string" &&
        Array.isArray(item.sets) &&
        item.sets.every((set) => {
          if (typeof set !== "object" || set === null) return false;
          const setData = set as Record<string, unknown>;
          return (
            typeof setData.reps === "number" &&
            Number.isFinite(setData.reps) &&
            typeof setData.weight === "number" &&
            Number.isFinite(setData.weight)
          );
        })
      );
    })
  );
};

export const getWorkouts = async (): Promise<WorkoutRecord[]> => {
  const response = await apiFetch("/workouts");
  const data: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String(data.message)
        : "No se pudieron cargar los entrenamientos.";
    throw new Error(message);
  }
  if (!Array.isArray(data) || !data.every(isWorkoutRecord)) {
    throw new Error("El servidor devolvió un historial de entrenamientos inválido.");
  }
  return data;
};

export const saveWorkout = (
  workout: Omit<WorkoutRecord, "id" | "userId">,
) => apiFetch("/workouts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(workout),
}).then(async (response) => {
  const data: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String(data.message)
        : "No se pudo guardar el entrenamiento.";
    throw new Error(message);
  }
  if (!isWorkoutRecord(data)) {
    throw new Error("El servidor devolvió un entrenamiento inválido.");
  }
  return data;
});

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};
